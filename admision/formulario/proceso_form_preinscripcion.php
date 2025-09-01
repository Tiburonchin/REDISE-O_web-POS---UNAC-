<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// CONFIGURACIONES
$recaptcha_secret = '6LdtvVMrAAAAAH9kTi2qvFaeAt3JjMjFHxxBDiyL';
$google_sheets_webhook = "https://script.google.com/macros/s/AKfycbywilwBGn3ptSjzxLfRndGownu9GiHzPo-lVOc3zCog8-81uI2RpHG4-T6siIyVi3XI9w/exec";
$bot_endpoint = "http://149.50.134.44:3000/api/enviar-mensaje"; // reemplaza con tu endpoint real

// FUNCIONES
function validarRecaptcha($captcha, $secret) {
    $url = "https://www.google.com/recaptcha/api/siteverify?secret=$secret&response=$captcha";
    $response = file_get_contents($url);
    $data = json_decode($response);
    return $data->success ?? false;
}

function enviarDatosABotWhatsApp($nombreCompleto, $unidad, $programa, $telefono) {
    global $bot_endpoint;

    $data = [
        'numero'   => $telefono,
        'mensaje'  => $nombreCompleto,
        'facultad' => $unidad,
        'programa' => $programa
    ];

    $options = [
        'http' => [
            'header'  => "Content-type: application/json",
            'method'  => 'POST',
            'content' => json_encode($data),
            'ignore_errors' => true // Para capturar respuestas de error HTTP
        ]
    ];

    $context = stream_context_create($options);
    $result = file_get_contents($bot_endpoint, false, $context);

    if ($result === FALSE) {
        error_log("Error al enviar al bot de WhatsApp: " . print_r(error_get_last(), true));
    } else {
        error_log("Respuesta del bot de WhatsApp: " . $result);
    }
}

// PROCESO PRINCIPAL
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $captcha = $_POST['g-recaptcha-response'] ?? '';
    if (!validarRecaptcha($captcha, $recaptcha_secret)) {
        echo '<div style="color:red;text-align:center;">Captcha inválido.</div>';
        exit;
    }

    $dni = $_POST['dni'] ?? '';
    if (!preg_match('/^\d{8}$/', $dni)) {
        echo '<div style="color:red;text-align:center;">DNI inválido.</div>';
        exit;
    }

    // Verifica si el DNI ya está registrado (usando tu sistema actual)
    $verif = @file_get_contents("verificar_dni.php?dni=" . urlencode($dni));
    $verifData = json_decode($verif, true);
    if (isset($verifData['exists']) && $verifData['exists']) {
        echo '<div style="color:red;text-align:center;">El DNI ya está registrado.</div>';
        exit;
    }

    // Captura de datos del formulario
    $data = [
        "correo"            => $_POST['correo'] ?? '',
        "dni"               => $_POST['dni'] ?? '',
        "nombre"            => $_POST['nombre'] ?? '',
        "apellidos"         => $_POST['apellidos'] ?? '',
        "unidad"            => $_POST['unidad'] ?? '',
        "programa"          => $_POST['programa'] ?? '',
        "detalle_programa"  => $_POST['detalle_programa'] ?? '',
        "domicilio"         => $_POST['domicilio'] ?? '',
        "fecha_nacimiento"  => $_POST['fecha_nacimiento'] ?? '',
        "telefono"          => $_POST['telefono'] ?? '',
        "medio_conocimiento"=> $_POST['medio_conocimiento'] ?? '',
    ];

    // Enviar datos a Google Sheets
    $options = [
        'http' => [
            'header'  => "Content-type: application/json",
            'method'  => 'POST',
            'content' => json_encode($data),
        ]
    ];
    $context = stream_context_create($options);
    file_get_contents($google_sheets_webhook, false, $context);

    // Enviar al bot de WhatsApp
    enviarDatosABotWhatsApp(
        $data['nombre'] . ' ' . $data['apellidos'],
        $data['unidad'],
        $data['programa'],
        '51' . $data['telefono']
    );

    // Final
    echo 'OK_REDIRECT';
    exit;
}
?>