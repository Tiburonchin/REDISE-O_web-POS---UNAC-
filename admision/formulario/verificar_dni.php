<?php
header('Content-Type: application/json');

// En una implementación real, aquí te conectarías a tu base de datos
// y comprobarías si el DNI ya existe.

// Para este ejemplo, simplemente devolvemos que el DNI no existe
// para permitir que el formulario principal continúe.

$dni = $_GET['dni'] ?? '';

// Simulación: Comprobar si el DNI existe.
// Cambia a `true` para probar el mensaje de error de DNI duplicado.
$dni_existe = false; 


echo json_encode(['exists' => $dni_existe]);
?>
