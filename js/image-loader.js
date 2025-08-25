// Script para asegurar que la imagen de fondo se cargue correctamente
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔍 Iniciando carga optimizada de imagen de fondo...');
    
    // Crear imagen para precargar
    const img = new Image();
    const heroSection = document.querySelector('.hero');
    
    // Función para ajustar el parallax según el tamaño de pantalla
    function adjustParallax() {
        if (heroSection) {
            if (window.innerWidth > 768) {
                heroSection.style.backgroundAttachment = 'fixed';
            } else {
                heroSection.style.backgroundAttachment = 'scroll';
            }
        }
    }
    
    img.onload = function() {
        console.log('✅ Imagen cargada exitosamente');
        console.log('📐 Dimensiones:', this.naturalWidth, 'x', this.naturalHeight);
        
        // Aplicar estilos optimizados para imagen adaptable
        if (heroSection) {
            // Usar cover para mejor adaptación
            heroSection.style.backgroundImage = `linear-gradient(135deg, rgba(0, 31, 63, 0.25) 0%, rgba(0, 86, 179, 0.10) 50%, rgba(0, 31, 63, 0.30) 100%), url('img/index/unac.png')`;
            heroSection.style.backgroundSize = 'cover';
            heroSection.style.backgroundPosition = 'center';
            heroSection.style.backgroundRepeat = 'no-repeat';
            
            // Aplicar parallax según tamaño de pantalla
            adjustParallax();
            
            console.log('🎨 Imagen aplicada como fondo con parallax');
            
            // Añadir clase para confirmar que está cargada
            heroSection.classList.add('image-loaded');
            console.log('🎨 Imagen aplicada como fondo con parallax');
            
            // Añadir clase para confirmar que está cargada
            heroSection.classList.add('image-loaded');
        }
    };
    
    img.onerror = function() {
        console.error('❌ Error al cargar la imagen');
        console.error('🔗 Ruta intentada:', this.src);
        console.error('🌍 URL base:', window.location.href);
        
        // Intentar rutas alternativas
        const altPaths = [
            './img/index/unac.png',
            '../img/index/unac.png',
            'img/index/unac.png'
        ];
        
        let currentIndex = 0;
        
        const tryNextPath = () => {
            if (currentIndex < altPaths.length) {
                const newImg = new Image();
                newImg.onload = function() {
                    console.log('✅ Imagen cargada con ruta alternativa:', altPaths[currentIndex]);
                    if (heroBg) {
                        heroBg.style.backgroundImage = `url('${altPaths[currentIndex]}')`;
                        heroBg.style.backgroundSize = 'cover';
                        heroBg.style.backgroundPosition = 'center';
                        heroBg.style.opacity = '1';
                    }
                    if (heroImg) {
                        heroImg.src = altPaths[currentIndex];
                        heroImg.style.opacity = '1';
                    }
                };
                newImg.onerror = () => {
                    currentIndex++;
                    tryNextPath();
                };
                newImg.src = altPaths[currentIndex];
            } else {
                console.error('💥 No se pudo cargar la imagen con ninguna ruta');
                // Usar color de fondo como fallback
                if (heroSection) {
                    heroSection.style.background = 'linear-gradient(135deg, #001f3f 0%, #0056b3 100%)';
                }
            }
        };
        
        tryNextPath();
    };
    
    // Iniciar carga
    img.src = 'img/index/unac.png';
    
    // Listener para cambios de tamaño de pantalla
    window.addEventListener('resize', adjustParallax);
    
    // Debug info
    console.log('🔗 Ruta base:', window.location.href);
    console.log('🎯 Ruta de imagen:', new URL('img/index/unac.png', window.location.href).href);
});
