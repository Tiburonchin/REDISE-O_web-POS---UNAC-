// Función para copiar texto al portapapeles
function copiarCodigo() {
    const codigo = document.getElementById('codigoEstudiante').textContent;
    
    // Crear un elemento temporal para copiar
    const tempInput = document.createElement('input');
    tempInput.value = codigo;
    document.body.appendChild(tempInput);
    
    // Seleccionar y copiar
    tempInput.select();
    document.execCommand('copy');
    
    // Eliminar el elemento temporal
    document.body.removeChild(tempInput);
    
    // Mostrar mensaje de éxito
    const boton = document.querySelector('.btn[onclick="copiarCodigo()"]');
    const originalText = boton.innerHTML;
    boton.innerHTML = '<i class="fas fa-check me-1"></i> Copiado!';
    
    // Restaurar el texto después de 2 segundos
    setTimeout(() => {
        boton.innerHTML = originalText;
    }, 2000);
}
