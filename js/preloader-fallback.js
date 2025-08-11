/**
 * PRELOADER FALLBACK
 * 
 * Este script asegura que el preloader siempre se oculte, incluso si el header dinámico falla.
 * Se incluye en todas las páginas como respaldo de header_carga.js.
 */

// Esperar a que la página esté completamente cargada (incluyendo imágenes y recursos)
window.addEventListener('load', function() {
    // Pequeño retraso para dar prioridad a header_carga.js
    setTimeout(function() {
        const preloader = document.getElementById('preloader');
        
        // Si el preloader sigue visible, ocultarlo y removerlo
        if (preloader && !preloader.classList.contains('hide')) {
            console.log('ℹ️ Preloader ocultado por el fallback global');
            preloader.classList.add('hide');
            
            // Remover después de la animación (0.5s definido en CSS)
            setTimeout(function() {
                if (preloader.parentNode) {
                    preloader.remove();
                    console.log('✅ Preloader removido por el fallback');
                }
            }, 600);
        }
    }, 1000); // 1 segundo de margen para header_carga.js
});
