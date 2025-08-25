<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

ini_set('upload_tmp_dir', __DIR__ . '/tmp');
date_default_timezone_set('America/Lima');
putenv('GOOGLE_APPLICATION_CREDENTIALS=' . dirname(__DIR__) . '/config/credentials.json');
$folderId = '0AACjTr939mkJUk9PVA';
$spreadsheetId = '1W4Fz25lZjDCtq_PnlHajwnqzYi29IyPLWbFYLXYqyjM';

// === Obtener el access_token sin usar curl ===
function get_access_token() {
    $credPath = getenv('GOOGLE_APPLICATION_CREDENTIALS');
    if (!file_exists($credPath)) die("Archivo de credenciales no encontrado.");
    $credentials = json_decode(file_get_contents($credPath), true);

    $header = ['alg'=>'RS256','typ'=>'JWT'];
    $now = time();
    $claimSet = [
        'iss' => $credentials['client_email'],
        'scope' => 'https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/spreadsheets',
        'aud' => $credentials['token_uri'],
        'iat' => $now,
        'exp' => $now + 3600
    ];

    $base64url = fn($data) => str_replace(['+', '/', '='], ['-', '_'], base64_encode($data));
    $jwt_header = $base64url(json_encode($header));
    $jwt_claim = $base64url(json_encode($claimSet));
    $unsigned_jwt = $jwt_header . '.' . $jwt_claim;

    openssl_sign($unsigned_jwt, $signature, openssl_pkey_get_private($credentials['private_key']), 'SHA256');
    $jwt = $unsigned_jwt . '.' . $base64url($signature);

    $postData = http_build_query([
        'grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        'assertion' => $jwt
    ]);

    $opts = [
        "http" => [
            "method"  => "POST",
            "header"  => "Content-Type: application/x-www-form-urlencoded",
            "content" => $postData
        ]
    ];

    $context = stream_context_create($opts);
    $response = file_get_contents($credentials['token_uri'], false, $context);
    $data = json_decode($response, true);
    return $data['access_token'] ?? die("No se pudo obtener token: " . $response);
}

// === Obtener datos de una hoja ===
function get_sheet_values($spreadsheetId, $range, $accessToken) {
    $url = "https://sheets.googleapis.com/v4/spreadsheets/$spreadsheetId/values/$range";
    $opts = [
        "http" => [
            "method" => "GET",
            "header" => "Authorization: Bearer $accessToken"
        ]
    ];
    $context = stream_context_create($opts);
    $response = file_get_contents($url, false, $context);
    $data = json_decode($response, true);
    return $data['values'] ?? [];
}

// === Crear carpeta en Google Drive ===
function create_folder($name, $accessToken, $parentId, $driveId = null) {
    $metadata = [
        'name' => $name,
        'mimeType' => 'application/vnd.google-apps.folder',
        'parents' => [$parentId]
    ];
    if ($driveId) {
        $metadata['driveId'] = $driveId;
    }

    $opts = [
        "http" => [
            "method"  => "POST",
            "header"  => "Authorization: Bearer $accessToken\r\nContent-Type: application/json",
            "content" => json_encode($metadata)
        ]
    ];
    $url = "https://www.googleapis.com/drive/v3/files?supportsAllDrives=true";
    $context = stream_context_create($opts);
    $response = file_get_contents($url, false, $context);
    $resData = json_decode($response, true);
    return $resData['id'] ?? die("Error al crear carpeta: " . $response);
}

// Busca o crea una carpeta por nombre dentro de un padre
function find_or_create_folder($name, $accessToken, $parentId, $driveId = null) {
    $query = urlencode("name = '$name' and mimeType = 'application/vnd.google-apps.folder' and '$parentId' in parents and trashed = false");
    $url = "https://www.googleapis.com/drive/v3/files?q=$query&fields=files(id,name)&supportsAllDrives=true&includeItemsFromAllDrives=true";
    if ($driveId) {
        $url .= "&driveId=$driveId&corpora=drive";
    }
    $opts = [
        "http" => [
            "method" => "GET",
            "header" => "Authorization: Bearer $accessToken"
        ]
    ];
    $context = stream_context_create($opts);
    $response = file_get_contents($url, false, $context);
    $data = json_decode($response, true);
    if (!empty($data['files'][0]['id'])) {
        return $data['files'][0]['id'];
    }
    // Si no existe, la crea
    return create_folder($name, $accessToken, $parentId, $driveId);
    file_put_contents('debug_folder_creation.log', "Creando/buscando: $name en padre $parentId\n", FILE_APPEND);
}

// === Subir archivo a Google Drive ===
function upload_file_to_drive($filePath, $fileName, $mimeType, $accessToken, $parentFolderId, $driveId = null) {
    $metadata = ['name' => $fileName, 'parents' => [$parentFolderId]];
    if ($driveId) {
        $metadata['driveId'] = $driveId;
    }
    $boundary = '-------314159265358979323846';
    $body =
        "--$boundary\r\n" .
        "Content-Type: application/json; charset=UTF-8\r\n\r\n" .
        json_encode($metadata) . "\r\n" .
        "--$boundary\r\n" .
        "Content-Type: $mimeType\r\n\r\n" .
        file_get_contents($filePath) . "\r\n" .
        "--$boundary--";

    $opts = [
        "http" => [
            "method"  => "POST",
            "header"  => "Authorization: Bearer $accessToken\r\n" .
                        "Content-Type: multipart/related; boundary=$boundary\r\n" .
                        "Content-Length: " . strlen($body),
            "content" => $body
        ]
    ];
    $url = "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&supportsAllDrives=true";
    $context = stream_context_create($opts);
    $response = file_get_contents($url, false, $context);
    $resData = json_decode($response, true);
    return $resData['id'] ?? die("Error al subir archivo: " . $response);
}

// === Añadir fila a hoja de cálculo ===
function add_row_to_sheet($accessToken, $spreadsheetId, $values) {
    $url = "https://sheets.googleapis.com/v4/spreadsheets/$spreadsheetId/values/Registro_subidas_carpeta_postulantes:append?valueInputOption=USER_ENTERED";
    $body = json_encode(['values' => [$values]]);

    $opts = [
        "http" => [
            "method"  => "POST",
            "header"  => "Authorization: Bearer $accessToken\r\nContent-Type: application/json",
            "content" => $body
        ]
    ];
    $context = stream_context_create($opts);
    file_get_contents($url, false, $context);
}

// === Carga de datos globales ===
$access_token = get_access_token();
$inscripciones = get_sheet_values($spreadsheetId, 'Inscripciones', $access_token);
$registros = get_sheet_values($spreadsheetId, 'Registro_subidas_carpeta_postulantes', $access_token);

$datosEncontrados = null;
$mensaje = '';
$datos_token = '';
$mostrarFormularioCompleto = false;

?>


<?= $datos_token ?>