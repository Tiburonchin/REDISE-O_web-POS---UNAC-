/**
 * EMERGENCY HEADER DISPLAY
 * Script de emergencia para asegurar que el header sea visible
 */

// Ejecutar inmediatamente cuando el DOM esté listo
(function() {
    'use strict';
    
    console.log('🚨 Script de emergencia del header iniciado');
    
    function forceHeaderVisibility() {
        const headerElement = document.getElementById('header');
        if (headerElement) {
            console.log('🔧 Forzando visibilidad del header...');
            
            // Aplicar estilos de emergencia
            headerElement.style.cssText = `
                opacity: 1 !important;
                visibility: visible !important;
                display: block !important;
                position: relative !important;
                z-index: 1000 !important;
                background: white !important;
                transition: opacity 0.3s ease !important;
            `;
            
            console.log('✅ Header forzado a ser visible');
            return true;
        }
        return false;
    }
    
    // Intentar inmediatamente
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(forceHeaderVisibility, 100);
        });
    } else {
        setTimeout(forceHeaderVisibility, 100);
    }
    
    // Verificación adicional después de 1 segundo
    setTimeout(() => {
        const headerElement = document.getElementById('header');
        if (headerElement) {
            const computedStyle = window.getComputedStyle(headerElement);
            if (computedStyle.opacity === '0' || computedStyle.visibility === 'hidden') {
                console.log('🚨 Header aún no visible, aplicando corrección de emergencia');
                forceHeaderVisibility();
            }
        }
    }, 1000);
    
})();
