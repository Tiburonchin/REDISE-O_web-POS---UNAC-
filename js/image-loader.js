// Script para asegurar que la imagen de fondo se cargue correctamente
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔍 Iniciando carga optimizada de imagen de fondo...');

    // Crear imagen para precargar
    const img = new Image();
    const heroSection = document.querySelector('.hero');
    const preloader = document.getElementById('preloader');

    // Fade-in para el hero al cargar imagen
    if (heroSection) {
        heroSection.style.opacity = '0';
        heroSection.style.transition = 'opacity 0.7s cubic-bezier(.4,1.6,.6,1)';
    }

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

    // Función para ocultar el preloader y mostrar el hero
    function hidePreloaderAndShowHero() {
        if (preloader) {
            preloader.classList.add('hide');
            setTimeout(() => {
                if (preloader.parentNode) preloader.remove();
            }, 600);
        }
        if (heroSection) {
            heroSection.style.opacity = '1';
        }
    }

    img.onload = function() {
        console.log('✅ Imagen cargada exitosamente');
        console.log('📐 Dimensiones:', this.naturalWidth, 'x', this.naturalHeight);

        // Aplicar estilos optimizados para imagen adaptable
        if (heroSection) {
            heroSection.style.backgroundImage = `linear-gradient(135deg, rgba(0, 31, 63, 0.25) 0%, rgba(0, 86, 179, 0.10) 50%, rgba(0, 31, 63, 0.30) 100%), url('img/index/unac.png')`;
            heroSection.style.backgroundSize = 'cover';
            heroSection.style.backgroundPosition = 'center';
            heroSection.style.backgroundRepeat = 'no-repeat';
            adjustParallax();
            heroSection.classList.add('image-loaded');
        }
        hidePreloaderAndShowHero();
    };

    img.onerror = function() {
        console.error('❌ Error al cargar la imagen principal');
        console.error('🔗 Ruta intentada:', this.src);
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
                    if (heroSection) {
                        heroSection.style.backgroundImage = `linear-gradient(135deg, rgba(0, 31, 63, 0.25) 0%, rgba(0, 86, 179, 0.10) 50%, rgba(0, 31, 63, 0.30) 100%), url('${altPaths[currentIndex]}')`;
                        heroSection.style.backgroundSize = 'cover';
                        heroSection.style.backgroundPosition = 'center';
                        heroSection.style.backgroundRepeat = 'no-repeat';
                        adjustParallax();
                        heroSection.classList.add('image-loaded');
                    }
                    hidePreloaderAndShowHero();
                };
                newImg.onerror = () => {
                    currentIndex++;
                    tryNextPath();
                };
                newImg.src = altPaths[currentIndex];
            } else {
                // Fallback: color de fondo
                if (heroSection) {
                    heroSection.style.background = 'linear-gradient(135deg, #001f3f 0%, #0056b3 100%)';
                }
                hidePreloaderAndShowHero();
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
