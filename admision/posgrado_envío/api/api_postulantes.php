<?php
ob_start();
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once 'form_postulantes.php'; // Solo funciones y carga de datos

$action = $_POST['action'] ?? $_GET['action'] ?? '';

try {
    switch ($action) {
        // Buscar postulante por DNI y programa
        case 'buscar':
            $dni = trim($_POST['dni'] ?? '');
            $programa = trim($_POST['programa'] ?? '');
            if ($dni === '' || $programa === '') {
                throw new Exception('Datos incompletos');
            }
            foreach ($inscripciones as $fila) {
                if (isset($fila[2], $fila[7]) && $fila[2] === $dni && $fila[7] === $programa) {
                    // Buscar el token en la hoja de registros
                    $token = '';
                    foreach ($registros as $reg) {
                        if (isset($reg[1], $reg[5]) && $reg[1] === $dni) {
                            $token = $reg[5];
                            break;
                        }
                    }
                    echo json_encode([
                        'encontrado' => true,
                        'dni' => $fila[2],
                        'nombres' => $fila[3] ?? '',
                        'apellidos' => $fila[4] ?? '',
                        'correo' => $fila[1] ?? '',
                        'facultad' => $fila[5] ?? '',
                        'programa' => $fila[7] ?? '',
                    ]);
                    exit;
                }
            }
            echo json_encode(['encontrado' => false, 'mensaje' => 'No se encontró el postulante.']);
            exit;

        // Consultar estado por token
        case 'consultar_token':
            $token = trim($_POST['token'] ?? '');
            if ($token === '') {
                throw new Exception('Por favor ingresa un token.');
            }
            foreach ($registros as $fila) {
                if (isset($fila[5]) && $fila[5] === $token) {
                    echo json_encode([
                        'encontrado' => true,
                        'fecha' => $fila[0] ?? '',
                        'dni' => $fila[1] ?? '',
                        'nombre' => $fila[2] ?? '',
                        'apellido_paterno' => '', 
                        'apellido_materno' => '', 
                        'correo' => $fila[3] ?? '',
                        'carpeta_drive' => $fila[4] ?? '#', 
                        'estado' => $fila[6] ?? 'Pendiente',
                        'mensaje_estado' => $fila[7] ?? ''
                    ]);
                    exit;
                }
            }
            echo json_encode(['encontrado' => false, 'mensaje' => 'No se encontró el token ingresado.']);
            exit;

        // Subida de archivos (ejemplo, si lo implementas por AJAX)
        case 'subir_archivos':
            $dni = trim($_POST['dni'] ?? '');
            $nombre = trim($_POST['nombre'] ?? '');
            $correo = trim($_POST['correo'] ?? '');
            $pdf = $_FILES['archivoPdf'];
            $img = $_FILES['imagen'];
            file_put_contents('debug_files.log', print_r($_FILES, true));
            file_put_contents('debug_post.log', print_r($_POST, true));

            $facultad = trim($_POST['facultad'] ?? '');   
            $programa = trim($_POST['programa'] ?? '');
            
            // Validar campos
            if (!$dni || !$nombre || !$correo || !$pdf || !$img || !$facultad || !$programa) {
                echo json_encode(['ok' => false, 'mensaje' => 'Faltan datos o archivos.']);
                exit;
            }

            // Validar que ambos archivos hayan sido subidos correctamente
            if (!isset($pdf) || !isset($img)) {
                echo json_encode([
                    'ok' => false,
                    'mensaje' => 'No se recibieron los archivos.',
                    'debug' => [
                        'pdf' => $pdf,
                        'img' => $img
                    ]
                ]);
                exit;
            }

            if ($pdf['error'] !== UPLOAD_ERR_OK) {
                echo json_encode([
                    'ok' => false,
                    'mensaje' => 'Error al subir el archivo PDF.',
                    'error_pdf' => $pdf['error'],
                    'debug_pdf' => $pdf
                ]);
                exit;
            }

            if ($img['error'] !== UPLOAD_ERR_OK) {
                echo json_encode([
                    'ok' => false,
                    'mensaje' => 'Error al subir la imagen.',
                    'error_img' => $img['error'],
                    'debug_img' => $img
                ]);
                exit;
            }

            $extPdf = strtolower(pathinfo($pdf['name'], PATHINFO_EXTENSION));
            $extImg = strtolower(pathinfo($img['name'], PATHINFO_EXTENSION));

            // Validar extensiones de archivos
            if ($pdf['type'] !== 'application/pdf' || $extPdf !== 'pdf') {
                echo json_encode(['ok' => false, 'mensaje' => 'El archivo PDF no es válido. Debe ser de tipo PDF y tener extensión .pdf']);
                exit;
            }

            // Validación para imagen (tipo + extensión)
            $tiposPermitidos = ['image/jpeg', 'image/png'];
            $extensionesPermitidas = ['jpg', 'jpeg', 'png'];

            if (!in_array($img['type'], $tiposPermitidos) || !in_array($extImg, $extensionesPermitidas)) {
                echo json_encode(['ok' => false, 'mensaje' => 'La imagen no es válida. Debe ser JPG o PNG.']);
                exit;
            }

            $tamanoPdf = $pdf['size'];
            $tamanoImg = $img['size'];

            // Validar tamaños de archivos
            if ($tamanoPdf > 10 * 1024 * 1024) {
                echo json_encode(['ok' => false, 'mensaje' => 'El archivo PDF excede los 10MB permitidos.']);
                exit;
            }

            if ($tamanoImg > 5 * 1024 * 1024) {
                echo json_encode(['ok' => false, 'mensaje' => 'La imagen excede los 5MB permitidos.']);
                exit;
            }

            // 1. Busca o crea la carpeta de la facultad dentro de tu carpeta raíz
            $facultadCarpetaNombre = $facultad . ' - CARPETA DE POSTULANTES';
            $facultadFolderId = find_or_create_folder($facultadCarpetaNombre, $access_token, $folderId);

            // 2. Busca o crea la carpeta del programa dentro de la facultad
            $programaFolderId = find_or_create_folder($programa, $access_token, $facultadFolderId);

            // 3. Crea la carpeta del postulante dentro del programa
            $carpetaNombre = $dni . '_' . str_replace(' ', '_', $nombre);
            $carpetaId = find_or_create_folder($carpetaNombre, $access_token, $programaFolderId);

            // 4. Subcarpeta con marca de tiempo
            $timestamp = date('Y-m-d_H-i-s');
            $nombreSubcarpeta = $timestamp . ' - ' . $dni . '_' . str_replace(' ', '_', $nombre);
            $subcarpetaId = create_folder($nombreSubcarpeta, $access_token, $carpetaId);

            // 4. Sube los archivos
            upload_file_to_drive($pdf['tmp_name'], $pdf['name'], $pdf['type'], $access_token, $subcarpetaId);
            upload_file_to_drive($img['tmp_name'], $img['name'], $img['type'], $access_token, $subcarpetaId);

            // 5. Registrar en la hoja
            $token = bin2hex(random_bytes(6));
            $registro = [
                date('Y-m-d H:i:s'),
                $dni,
                $nombre,
                $correo,
                "https://drive.google.com/drive/folders/$subcarpetaId",
                $token
            ];
            add_row_to_sheet($access_token, $spreadsheetId, $registro);

            echo json_encode([
                'ok' => true,
                'mensaje' => "<div class='text-center'>
    <div class='alert alert-success alert-dismissible fade show' role='alert'  style='max-width: 600px; margin: 0 auto; padding: 12px;'>
        <div class='d-flex align-items-center justify-content-center'>
            <i class='fas fa-check-circle me-2 text-success'></i>
            <span class='text-muted small'>Archivos subidos exitosamente</span>
        </div>
    </div>
    <div class='card bg-white border-primary shadow-sm mt-4 p-3 p-md-4 mb-1 expediente-card' style='max-width: 600px; margin: 0 auto;'>
        <div class='d-flex justify-content-between align-items-center mb-3'>
            <span class='h6 mb-0'><i class='fas fa-clipboard-check me-2'></i><b>CÓDIGO DE EXPEDIENTE:</b></span>
        </div>
        <div class='d-flex flex-column align-items-center'>
            <div class='d-flex flex-column flex-md-row align-items-center w-100 justify-content-center'>
                <div class='bg-white border-primary rounded-3 p-2 mb-2 mb-md-0 me-md-3' style='min-width: 200px; text-align: center; border: 2px solid #0d6efd; background-color: #f8f9ff;'>
                    <span id='codigoEstudiante' class='h4 fw-bold text-primary' style='letter-spacing: 1.5px; font-family: &quot;Courier New&quot;, monospace;'>$token</span>
                </div>
                <button onclick='copiarCodigo()' class='btn btn-sm btn-primary' style='padding: 8px 15px;'>
                    <i class='fas fa-copy me-1'></i> Copiar
                </button>
            </div>
        </div>
    </div>
</div>"
            ]);
            exit;

        default:
            throw new Exception('Acción no válida');
    }
} catch (Exception $e) {
    echo json_encode(['error' => true, 'mensaje' => $e->getMessage()]);
    exit;
}
?>
