/**
 * CRITICAL LOADING OPTIMIZATION
 * Script para optimizar la carga inicial y prevenir flash de contenido sin estilos
 */

// Ejecutar inmediatamente cuando el DOM esté listo
(function() {
    'use strict';
    
    // ===================================
    // OPTIMIZACIÓN DE CARGA CRÍTICA
    // ===================================
    
    // Función para precargar recursos críticos
    function preloadCriticalResources() {
        const resources = [
            { href: 'header/header.css', as: 'style' },
            { href: 'img/logo_unac.png', as: 'image' },
            { href: 'img/ep.png', as: 'image' },
            { href: 'img/index/admsion.jpg', as: 'image' }
        ];
        
        resources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource.href;
            link.as = resource.as;
            if (resource.as === 'style') {
                link.onload = function() {
                    this.onload = null;
                    this.rel = 'stylesheet';
                };
            }
            document.head.appendChild(link);
        });
    }
    
    // Función para optimizar la visibilidad inicial
    function optimizeInitialVisibility() {
        // Asegurar que el header esté oculto inicialmente
        const headerStyle = document.createElement('style');
        headerStyle.textContent = `
            #header {
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            #header.loaded {
                opacity: 1;
            }
        `;
        document.head.appendChild(headerStyle);
    }
    
    // Función para detectar y manejar la carga del DOM
    function handleDOMReady() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializePage);
        } else {
            initializePage();
        }
    }
    
    // Función de inicialización principal
    function initializePage() {
        // Precargar recursos críticos
        preloadCriticalResources();
        
        // Optimizar visibilidad inicial
        optimizeInitialVisibility();
        
        // Configurar observer para lazy loading de imágenes no críticas
        setupLazyLoading();
        
        console.log('Optimización de carga crítica inicializada');
    }
    
    // Función para configurar lazy loading
    function setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            observer.unobserve(img);
                        }
                    }
                });
            });
            
            // Observar imágenes que no son críticas
            setTimeout(() => {
                const lazyImages = document.querySelectorAll('img[data-src]');
                lazyImages.forEach(img => imageObserver.observe(img));
            }, 100);
        }
    }
    
    // ===================================
    // MANEJO DE ERRORES Y FALLBACKS
    // ===================================
    
    // Manejo de errores globales para recursos críticos
    window.addEventListener('error', function(e) {
        if (e.target.tagName === 'LINK' || e.target.tagName === 'IMG') {
            console.warn('Error cargando recurso crítico:', e.target.src || e.target.href);
            // Implementar fallback si es necesario
        }
    }, true);
    
    // ===================================
    // INICIALIZACIÓN
    // ===================================
    
    // Inicializar inmediatamente
    handleDOMReady();
    
})();
