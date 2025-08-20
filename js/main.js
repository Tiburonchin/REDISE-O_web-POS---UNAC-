/**
 * INDEX.HTML - MAIN JAVASCRIPT
 * Funcionalidades principales para la página de inicio
 */

// Optimización de carga: Esperar a que todo esté listo
document.addEventListener('DOMContentLoaded', function() {
    // ===================================
    // OPTIMIZACIÓN DE CARGA INICIAL
    // ===================================
    
    // Asegurar que las imágenes críticas se carguen primero
    const criticalImages = document.querySelectorAll('img[src*="logo"], img[src*="admsion"], .hero img');
    let loadedImages = 0;
    
    function checkImagesLoaded() {
        loadedImages++;
        if (loadedImages >= criticalImages.length) {
            // Todas las imágenes críticas están cargadas, inicializar funcionalidades
            initializePageFunctionality();
        }

// Fallback global: si por alguna razón el header_carga.js no ocultó el preloader,
// hazlo al completar la carga total de la página (assets incluidos)
window.addEventListener('load', () => {
    const preloaderEl = document.getElementById('preloader');
    if (preloaderEl) {
        preloaderEl.classList.add('hide');
        setTimeout(() => {
            if (preloaderEl.parentNode) preloaderEl.remove();
        }, 500);
    }
});
    }
    
    // Precargar imágenes críticas
    criticalImages.forEach(img => {
        if (img.complete) {
            checkImagesLoaded();
        } else {
            img.addEventListener('load', checkImagesLoaded);
            img.addEventListener('error', checkImagesLoaded); // Continuar aunque haya error
        }
    });
    
    // Fallback: si no hay imágenes críticas, inicializar inmediatamente
    if (criticalImages.length === 0) {
        initializePageFunctionality();
    }
    
    // Timeout de seguridad: inicializar después de 2 segundos máximo
    setTimeout(initializePageFunctionality, 2000);
});

function initializePageFunctionality() {
    // ===================================
    // VARIABLES GLOBALES
    // ===================================
    
    const animatedWord = document.getElementById('animatedWord');
    const backToTopBtn = document.getElementById('backToTop');
    const scrollIndicator = document.querySelector('.scroll-indicator');

    // Preloader: no ocultar aquí (DOMContentLoaded). Lo maneja header_carga.js
    // Agregamos un fallback en window.load más abajo por si no se cargara el header dinámico.
    
    // Palabras para la animación del hero
    const words = [
        'maravilloso',
        'innovador',
        'único',
        'extraordinario',
        'excepcional',
        'brillante'
    ];
    
    let currentWordIndex = 0;
    let animationInterval;
    
    // ===================================
    // ANIMACIÓN DE PALABRA VARIABLE
    // ===================================
    
    function animateWord() {
        if (!animatedWord) return;
        
        // Efecto de fade out con escala y rotación
        animatedWord.style.opacity = '0';
        animatedWord.style.transform = 'translateY(30px) scale(0.8) rotateX(15deg)';
        animatedWord.style.filter = 'blur(2px)';
        
        setTimeout(() => {
            // Cambiar la palabra
            currentWordIndex = (currentWordIndex + 1) % words.length;
            animatedWord.textContent = words[currentWordIndex];
            
            // Efecto de fade in con bounce
            animatedWord.style.opacity = '1';
            animatedWord.style.transform = 'translateY(0) scale(1) rotateX(0deg)';
            animatedWord.style.filter = 'blur(0px)';
            
            // Añadir un pequeño bounce al final
            setTimeout(() => {
                animatedWord.style.transform = 'translateY(0) scale(1.05) rotateX(0deg)';
                setTimeout(() => {
                    animatedWord.style.transform = 'translateY(0) scale(1) rotateX(0deg)';
                }, 150);
            }, 100);
        }, 400);
    }
    
    // Iniciar animación de palabras
    function startWordAnimation() {
        if (animatedWord) {
            animatedWord.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            // Esperar un poco antes de comenzar la animación
            setTimeout(() => {
                animationInterval = setInterval(animateWord, 4000);
            }, 2000);
        }
    }
    
    // ===================================
    // SCROLL EFFECTS
    // ===================================
    
    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Back to top button visibility
        if (backToTopBtn) {
            if (scrollTop > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }
        
        // Hide scroll indicator after scrolling
        if (scrollIndicator && scrollTop > 150) {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.visibility = 'hidden';
        } else if (scrollIndicator && scrollTop <= 150) {
            scrollIndicator.style.opacity = '1';
            scrollIndicator.style.visibility = 'visible';
        }
        
        // Parallax effect for hero background
        const hero = document.querySelector('.hero');
        const heroBackgroundImage = document.querySelector('.hero-background-image');
        if (hero && heroBackgroundImage && scrollTop < window.innerHeight) {
            const parallaxSpeed = scrollTop * 0.3;
            heroBackgroundImage.style.transform = `translateY(${parallaxSpeed}px) scale(1.05)`;
        }
        
        // Ribbon wave animation based on scroll
        const ribbonWave = document.querySelector('.ribbon-wave');
        if (ribbonWave && scrollTop < window.innerHeight) {
            const waveIntensity = Math.sin(scrollTop * 0.01) * 2;
            ribbonWave.style.transform = `translateY(${waveIntensity}px)`;
        }
    }
    
    // ===================================
    // SMOOTH SCROLLING
    // ===================================
    
    function initSmoothScrolling() {
        // Scroll indicator click
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', () => {
                document.querySelector('.admision-section').scrollIntoView({
                    behavior: 'smooth'
                });
            });
        }
        
        // Back to top button click
        if (backToTopBtn) {
            backToTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
        
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    // ===================================
    // INTERSECTION OBSERVER ANIMATIONS
    // ===================================
    
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe elements for animation
        const animatedElements = document.querySelectorAll(`
            .programa-card,
            .noticia-card,
            .admision-content,
            .section-title,
            .motivacional-text
        `);
        
        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }
    
    // ===================================
    // ENHANCED HERO EFFECTS
    // ===================================
    
    function initHeroEffects() {
        const heroRibbon = document.querySelector('.hero-ribbon');
        const ribbonWave = document.querySelector('.ribbon-wave');
        const heroBackgroundImage = document.querySelector('.hero-background-image');
        
        // Debug: Check if background image is loading
        if (heroBackgroundImage) {
            const backgroundImg = new Image();
            backgroundImg.onload = function() {
                console.log('✅ Imagen de fondo UNAC cargada correctamente');
                heroBackgroundImage.style.opacity = '0.25'; // Increase visibility when loaded
            };
            backgroundImg.onerror = function() {
                console.error('❌ Error cargando imagen de fondo UNAC');
                // Fallback: Try different path
                heroBackgroundImage.style.backgroundImage = "url('./img/index/unac.png')";
            };
            backgroundImg.src = '/img/index/unac.png';
        }
        
        if (heroRibbon && ribbonWave) {
            // Add interactive ribbon effect
            heroRibbon.addEventListener('mouseenter', () => {
                ribbonWave.style.transform = 'scaleY(1.1)';
                ribbonWave.style.transition = 'transform 0.3s ease';
            });
            
            heroRibbon.addEventListener('mouseleave', () => {
                ribbonWave.style.transform = 'scaleY(1)';
            });
            
            // Add click effect to ribbon
            heroRibbon.addEventListener('click', () => {
                document.querySelector('.admision-section').scrollIntoView({
                    behavior: 'smooth'
                });
            });
            
            // Add cursor pointer to indicate interactivity
            heroRibbon.style.cursor = 'pointer';
        }
        
        // Enhanced background image parallax
        const heroBackgroundImageForAnimation = document.querySelector('.hero-background-image');
        if (heroBackgroundImageForAnimation) {
            // Add subtle animation to background image
            heroBackgroundImageForAnimation.style.animation = 'float 12s ease-in-out infinite';
        }
    }
    
    // ===================================
    // IMPROVED WORD ANIMATION
    // ===================================
    
    function enhancedAnimateWord() {
        if (!animatedWord) return;
        
        // Add scale effect during transition
        animatedWord.style.opacity = '0';
        animatedWord.style.transform = 'translateY(20px) scale(0.9)';
        
        setTimeout(() => {
            // Change the word
            currentWordIndex = (currentWordIndex + 1) % words.length;
            animatedWord.textContent = words[currentWordIndex];
            
            // Enhanced fade in effect
            animatedWord.style.opacity = '1';
            animatedWord.style.transform = 'translateY(0) scale(1)';
        }, 400);
    }
    
    // Update the word animation function
    function startEnhancedWordAnimation() {
        if (animatedWord) {
            animatedWord.style.transition = 'all 0.4s cubic-bezier(0.4, 0.0, 0.2, 1)';
            animationInterval = setInterval(enhancedAnimateWord, 3000);
        }
    }
    
    function initEmpresasCarousel() {
        const track = document.getElementById('empresas-track');
        if (!track) return;
        
        // Pause animation on hover
        track.addEventListener('mouseenter', () => {
            track.style.animationPlayState = 'paused';
        });
        
        track.addEventListener('mouseleave', () => {
            track.style.animationPlayState = 'running';
        });
    }
    
    // ===================================
    // LOADING STATES
    // ===================================
    
    function initLoadingStates() {
        // Add loading class to images
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (!img.complete) {
                img.style.opacity = '0';
                img.addEventListener('load', () => {
                    img.style.transition = 'opacity 0.3s ease';
                    img.style.opacity = '1';
                });
            }
        });
    }
    
    // ===================================
    // BUTTON INTERACTIONS
    // ===================================
    
    function initButtonEffects() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(btn => {
            // Add ripple effect on click
            btn.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.3);
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    left: ${x}px;
                    top: ${y}px;
                    width: ${size}px;
                    height: ${size}px;
                `;
                
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        });
        
        // Add ripple animation CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // ===================================
    // FORM VALIDATIONS (if needed)
    // ===================================
    
    function initFormValidations() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                const inputs = form.querySelectorAll('input[required], textarea[required]');
                let isValid = true;
                
                inputs.forEach(input => {
                    if (!input.value.trim()) {
                        isValid = false;
                        input.classList.add('error');
                        
                        // Remove error class after user starts typing
                        input.addEventListener('input', () => {
                            input.classList.remove('error');
                        }, { once: true });
                    }
                });
                
                if (!isValid) {
                    e.preventDefault();
                }
            });
        });
    }
    
    // ===================================
    // PERFORMANCE OPTIMIZATIONS
    // ===================================
    
    function throttle(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // ===================================
    // RESPONSIVE UTILITIES
    // ===================================
    
    
    
    // ===================================
    // ERROR HANDLING
    // ===================================
    
    function handleErrors() {
        window.addEventListener('error', (e) => {
            console.warn('Error capturado:', e.error);
        });
        
        // Handle image loading errors
        document.querySelectorAll('img').forEach(img => {
            img.addEventListener('error', () => {
                img.style.display = 'none';
                console.warn('Error cargando imagen:', img.src);
            });
        });
    }
    
    // ===================================
    // ACCESSIBILITY IMPROVEMENTS
    // ===================================
    
    function initAccessibility() {
        // Add focus indicators for keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });
        
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
        
        // Add ARIA labels where needed
        if (backToTopBtn && !backToTopBtn.getAttribute('aria-label')) {
            backToTopBtn.setAttribute('aria-label', 'Volver arriba');
        }
    }
    
    // ===================================
    // INITIALIZATION
    // ===================================
    
    function init() {
        try {
            startEnhancedWordAnimation(); // Use enhanced version
            initSmoothScrolling();
            initScrollAnimations();
            initHeroEffects(); // Add new hero effects
            initEmpresasCarousel();
            initLoadingStates();
            initButtonEffects();
            initFormValidations();
            initAccessibility();
            handleErrors();
            
            // Event listeners
            window.addEventListener('scroll', throttle(handleScroll, 16));
            
            
            // Initial calls
            handleScroll();
            
            
            console.log('✅ Página de inicio inicializada correctamente con mejoras del Hero');
            
        } catch (error) {
            console.error('❌ Error inicializando la página:', error);
        }
    }
    
    // ===================================
    // START APPLICATION
    // ===================================
    
    // Initialize everything
    init();
    
    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
        if (animationInterval) {
            clearInterval(animationInterval);
        }
    });
    
} // Cierre de initializePageFunctionality

// ===================================
// GLOBAL UTILITIES
// ===================================

// Utility function to check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Utility function to add CSS
function addCSS(css) {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
}

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        isInViewport,
        addCSS
    };
}
