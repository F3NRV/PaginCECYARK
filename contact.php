<?php
// Configura el correo al que llegarán los mensajes
$destinatario = "fkxja38@gmail.com"; // Cambia esto por tu correo real

// Recibe los datos del formulario
$nombre = $_POST['nombre'] ?? '';
$email = $_POST['email'] ?? '';
$telefono = $_POST['telefono'] ?? '';
$asunto = $_POST['asunto'] ?? '';
$mensaje = $_POST['mensaje'] ?? '';

// Validación básica
if ($nombre && $email && $asunto && $mensaje) {
    $asunto_correo = "Nuevo mensaje de contacto: $asunto";
    $contenido = "Nombre: $nombre\n";
    $contenido .= "Correo: $email\n";
    $contenido .= "Teléfono: $telefono\n";
    $contenido .= "Asunto: $asunto\n";
    $contenido .= "Mensaje:\n$mensaje\n";

    $cabeceras = "From: $email\r\nReply-To: $email\r\n";

    // Envía el correo
    if (mail($destinatario, $asunto_correo, $contenido, $cabeceras)) {
        echo "¡Mensaje enviado con éxito!";
    } else {
        echo "Error al enviar el mensaje. Intenta de nuevo más tarde.";
    }
} else {
    echo "Por favor, completa todos los campos obligatorios.";
}
?>