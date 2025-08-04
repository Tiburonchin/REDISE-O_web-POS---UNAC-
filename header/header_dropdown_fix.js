// Script adicional para asegurar la funcionalidad del dropdown
document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando funcionalidad adicional del dropdown...');
    
    // Función para inicializar dropdowns después de que el header se cargue
    function initializeDropdowns() {
        const navItems = document.querySelectorAll('#header .nav-item');
        console.log('Nav items encontrados:', navItems.length);
        
        navItems.forEach((item, index) => {
            const dropdown = item.querySelector('.dropdown-menu');
            const navLink = item.querySelector('.nav-link');
            
            if (dropdown && navLink) {
                console.log(`Configurando dropdown ${index + 1} para:`, navLink.textContent.trim());
                
                // Asegurar estilos base del dropdown
                dropdown.style.cssText = `
                    display: block !important;
                    position: absolute !important;
                    top: 100% !important;
                    left: 50% !important;
                    transform: translateX(-50%) translateY(-10px) !important;
                    background: rgba(255, 255, 255, 0.95) !important;
                    backdrop-filter: blur(25px) !important;
                    border: 1px solid rgba(255, 193, 7, 0.3) !important;
                    border-radius: 16px !important;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15), 0 5px 15px rgba(255, 193, 7, 0.1) !important;
                    min-width: 240px !important;
                    opacity: 0 !important;
                    visibility: hidden !important;
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
                    z-index: 10001 !important;
                    padding: 8px 0 !important;
                    overflow: hidden !important;
                    pointer-events: none !important;
                `;
                
                // Limpiar event listeners existentes
                const newItem = item.cloneNode(true);
                item.parentNode.replaceChild(newItem, item);
                const newDropdown = newItem.querySelector('.dropdown-menu');
                
                // Configurar nuevos event listeners
                newItem.addEventListener('mouseenter', function(e) {
                    console.log('Mouse enter en nav-item:', navLink.textContent.trim());
                    if (newDropdown) {
                        newDropdown.style.opacity = '1';
                        newDropdown.style.visibility = 'visible';
                        newDropdown.style.transform = 'translateX(-50%) translateY(0)';
                        newDropdown.style.pointerEvents = 'auto';
                    }
                });
                
                newItem.addEventListener('mouseleave', function(e) {
                    console.log('Mouse leave en nav-item:', navLink.textContent.trim());
                    if (newDropdown) {
                        newDropdown.style.opacity = '0';
                        newDropdown.style.visibility = 'hidden';
                        newDropdown.style.transform = 'translateX(-50%) translateY(-10px)';
                        newDropdown.style.pointerEvents = 'none';
                    }
                });
                
                // También configurar hover para mantener el dropdown abierto
                if (newDropdown) {
                    newDropdown.addEventListener('mouseenter', function(e) {
                        console.log('Mouse enter en dropdown');
                        newDropdown.style.opacity = '1';
                        newDropdown.style.visibility = 'visible';
                        newDropdown.style.transform = 'translateX(-50%) translateY(0)';
                        newDropdown.style.pointerEvents = 'auto';
                    });
                    
                    newDropdown.addEventListener('mouseleave', function(e) {
                        console.log('Mouse leave en dropdown');
                        newDropdown.style.opacity = '0';
                        newDropdown.style.visibility = 'hidden';
                        newDropdown.style.transform = 'translateX(-50%) translateY(-10px)';
                        newDropdown.style.pointerEvents = 'none';
                    });
                }
            }
        });
        
        console.log('Dropdowns inicializados completamente');
    }
    
    // Función para inyectar CSS adicional
    function injectAdditionalCSS() {
        const style = document.createElement('style');
        style.textContent = `
            /* CSS adicional para forzar la funcionalidad del dropdown */
            #header .nav-item {
                position: relative !important;
            }
            
            #header .nav-item .dropdown-menu {
                display: block !important;
                position: absolute !important;
                top: 100% !important;
                left: 50% !important;
                transform: translateX(-50%) translateY(-10px) !important;
                opacity: 0 !important;
                visibility: hidden !important;
                z-index: 10001 !important;
                pointer-events: none !important;
                transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
            }
            
            #header .nav-item:hover .dropdown-menu {
                opacity: 1 !important;
                visibility: visible !important;
                transform: translateX(-50%) translateY(0) !important;
                pointer-events: auto !important;
            }
            
            #header .nav-item .dropdown-menu:hover {
                opacity: 1 !important;
                visibility: visible !important;
                transform: translateX(-50%) translateY(0) !important;
                pointer-events: auto !important;
            }
        `;
        document.head.appendChild(style);
        console.log('CSS adicional inyectado');
    }
    
    // Inyectar CSS inmediatamente
    injectAdditionalCSS();
    
    // Intentar inicializar inmediatamente
    setTimeout(() => {
        initializeDropdowns();
    }, 100);
    
    // También intentar después de varios delays
    setTimeout(initializeDropdowns, 500);
    setTimeout(initializeDropdowns, 1000);
    setTimeout(initializeDropdowns, 2000);
    setTimeout(initializeDropdowns, 3000);
    
    // Observer para detectar cuando se agrega contenido al header
    const observer = new MutationObserver(function(mutations) {
        let shouldReinitialize = false;
        
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1 && 
                        (node.classList && node.classList.contains('nav-item') || 
                         node.querySelector && node.querySelector('.nav-item'))) {
                        shouldReinitialize = true;
                    }
                });
            }
        });
        
        if (shouldReinitialize) {
            console.log('Cambios detectados en el header, reinicializando dropdowns...');
            setTimeout(initializeDropdowns, 100);
        }
    });
    
    // Observar cambios en el header
    const headerElement = document.getElementById('header');
    if (headerElement) {
        observer.observe(headerElement, {
            childList: true,
            subtree: true
        });
    }
    
    // También observar cambios en el documento completo por si el header se agrega dinámicamente
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});
