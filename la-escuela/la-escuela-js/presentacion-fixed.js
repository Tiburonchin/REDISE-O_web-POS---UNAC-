/* ================================
   PRESENTACIÓN JAVASCRIPT - UNAC EPG (CORREGIDO)
   ================================ */

document.addEventListener('DOMContentLoaded', function() {
    
    // ================================
    // ANIMACIÓN DE CONTADORES SIMPLE
    // ================================
    
    function animateCounter(numberElement, targetNumber) {
        if (numberElement.dataset.animated) return;
        
        numberElement.dataset.animated = 'true';
        const duration = 2000;
        const startTime = Date.now();
        
        function updateCounter() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing suave
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            const currentNumber = Math.floor(targetNumber * easedProgress);
            
            numberElement.textContent = currentNumber;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                numberElement.textContent = targetNumber;
            }
        }
        
        requestAnimationFrame(updateCounter);
    }
    
    // ================================
    // OBSERVADOR PARA ESTADÍSTICAS
    // ================================
    
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                const numberElement = entry.target.querySelector('.stat-number');
                if (numberElement && !numberElement.dataset.animated) {
                    const targetNumber = parseInt(numberElement.dataset.count) || 0;
                    
                    // Delay escalonado para efecto visual
                    const circles = Array.from(document.querySelectorAll('.stat-circle'));
                    const index = circles.indexOf(entry.target);
                    
                    setTimeout(function() {
                        animateCounter(numberElement, targetNumber);
                    }, index * 200);
                }
            }
        });
    }, {
        threshold: 0.5
    });

    // Observar los círculos de estadísticas
    const statCircles = document.querySelectorAll('.stat-circle');
    statCircles.forEach(function(circle) {
        statsObserver.observe(circle);
    });
    
    // ================================
    // SMOOTH SCROLL
    // ================================
    
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    
    scrollLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                const headerHeight = 80;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ================================
    // ANIMACIONES GENERALES
    // ================================
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, {
        threshold: 0.1
    });

    // Observar elementos para animación
    const elements = document.querySelectorAll('.content-main, .cert-item, .ventaja-card');
    elements.forEach(function(el) {
        observer.observe(el);
    });
    
    console.log('Presentación UNAC: Scripts cargados correctamente');
});

// ================================
// ESTILOS CSS DINÁMICOS
// ================================

const styles = `
    .fade-in {
        animation: fadeIn 0.6s ease-out;
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @media (prefers-reduced-motion: reduce) {
        .fade-in {
            animation: none !important;
        }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);
