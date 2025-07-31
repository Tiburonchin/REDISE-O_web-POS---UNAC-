// Asegurar que las funciones estén disponibles globalmente desde el inicio
window.toggleMobileMenu = function() {
    console.log('toggleMobileMenu called before initialization');
};

window.toggleDropdown = function(id) {
    console.log('toggleDropdown called before initialization for:', id);
};

// Función principal de inicialización
function initializeHeaderFunctions() {
    // Variables para los elementos
    let mobileMenu = null;
    let mobileBtn = null;
    
    // Inicializar elementos después de que el DOM esté listo
    function initializeElements() {
        mobileMenu = document.getElementById('mobileMenu');
        mobileBtn = document.querySelector('.mobile-menu-btn');
        
        console.log('Mobile menu element:', mobileMenu); // Debug
        console.log('Mobile button element:', mobileBtn); // Debug
        
        return mobileMenu && mobileBtn;
    }
    
    function toggleMobileMenu() {
        // Re-inicializar elementos si no están disponibles
        if (!mobileMenu || !mobileBtn) {
            if (!initializeElements()) {
                console.error('Cannot find mobile menu elements');
                return;
            }
        }
        
        const isActive = mobileMenu.classList.contains('active');
        
        console.log('Toggling menu, currently active:', isActive); // Debug
        
        if (isActive) {
            // Cerrar menú
            mobileMenu.classList.remove('active');
            mobileBtn.classList.remove('active');
            
            // Cerrar todos los dropdowns
            document.querySelectorAll('.mobile-dropdown').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
            
            // Quitar clase del body para permitir scroll
            document.body.classList.remove('mobile-menu-open');
            console.log('Menu closed'); // Debug
        } else {
            // Abrir menú
            mobileMenu.classList.add('active');
            mobileBtn.classList.add('active');
            
            // Prevenir scroll del body cuando el menú está abierto
            document.body.classList.add('mobile-menu-open');
            console.log('Menu opened'); // Debug
        }
    }

    function toggleDropdown(id) {
        if (typeof event !== 'undefined' && event) {
            event.preventDefault();
        }
        
        // Get all mobile dropdowns
        const allDropdowns = document.querySelectorAll('.mobile-dropdown');
        const targetDropdown = document.getElementById(id);
        
        console.log('Toggling dropdown:', id, targetDropdown); // Debug
        
        // Close all other dropdowns first
        allDropdowns.forEach(dropdown => {
            if (dropdown.id !== id && dropdown.classList.contains('active')) {
                dropdown.classList.remove('active');
            }
        });
        
        // Toggle the clicked dropdown with smooth animation
        if (targetDropdown) {
            targetDropdown.classList.toggle('active');
        }
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        // Re-inicializar elementos si no están disponibles
        if (!mobileMenu || !mobileBtn) {
            initializeElements();
        }
        
        if (mobileMenu && mobileBtn && 
            !mobileMenu.contains(event.target) && 
            !mobileBtn.contains(event.target) &&
            mobileMenu.classList.contains('active')) {
            
            mobileMenu.classList.remove('active');
            mobileBtn.classList.remove('active');
            document.body.classList.remove('mobile-menu-open');
            
            // Close all mobile dropdowns
            document.querySelectorAll('.mobile-dropdown').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });

    // Close mobile menu when resizing to desktop view
    window.addEventListener('resize', function() {
        // Re-inicializar elementos si no están disponibles
        if (!mobileMenu || !mobileBtn) {
            initializeElements();
        }
        
        // If window is wider than tablet breakpoint, close mobile menu and dropdowns
        if (window.innerWidth > 900 && mobileMenu && mobileBtn) {
            mobileMenu.classList.remove('active');
            mobileBtn.classList.remove('active');
            document.body.classList.remove('mobile-menu-open');
            
            document.querySelectorAll('.mobile-dropdown').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });

    // Mejorar la accesibilidad con teclado
    document.addEventListener('keydown', function(event) {
        // Re-inicializar elementos si no están disponibles
        if (!mobileMenu || !mobileBtn) {
            initializeElements();
        }
        
        if (event.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            mobileBtn.classList.remove('active');
            document.body.classList.remove('mobile-menu-open');
            
            document.querySelectorAll('.mobile-dropdown').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });

    // Esperar un poco más y reintentar inicialización
    setTimeout(() => {
        initializeElements();
    }, 100);

    // Make functions globally available - REEMPLAZAR las funciones placeholder
    window.toggleMobileMenu = toggleMobileMenu;
    window.toggleDropdown = toggleDropdown;
}

// Ejecutar cuando el DOM esté listo o inmediatamente si ya está listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeHeaderFunctions);
} else {
    initializeHeaderFunctions();
}