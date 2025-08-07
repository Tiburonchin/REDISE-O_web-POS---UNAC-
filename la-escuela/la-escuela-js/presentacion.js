// Presentación de la Universidad - JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Smooth scroll para el botón de hero
    const scrollButton = document.querySelector('.btn-scroll-down');
    if (scrollButton) {
        scrollButton.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = document.querySelector('#video-section');
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
    
    // Animación de estadísticas al hacer scroll
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(stat => {
                    animateNumber(stat);
                });
                statObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const statsSection = document.querySelector('.proposito-stats');
    if (statsSection) {
        statObserver.observe(statsSection);
    }
    
    // Función para animar números
    function animateNumber(element) {
        const finalNumber = element.textContent.replace(/[^\d]/g, '');
        const duration = 2000;
        const increment = finalNumber / (duration / 16);
        let currentNumber = 0;
        
        const timer = setInterval(() => {
            currentNumber += increment;
            if (currentNumber >= finalNumber) {
                currentNumber = finalNumber;
                clearInterval(timer);
            }
            
            // Mantener el formato original (+ al final si existía)
            const originalText = element.textContent;
            if (originalText.includes('+')) {
                element.textContent = Math.floor(currentNumber) + '+';
            } else {
                element.textContent = Math.floor(currentNumber);
            }
        }, 16);
    }
    
    // Funcionalidad del video
    const videoThumbnail = document.querySelector('.video-thumbnail');
    const videoPlayer = document.querySelector('.video-player');
    const playButton = document.querySelector('.video-play-button');
    
    if (playButton && videoThumbnail && videoPlayer) {
        playButton.addEventListener('click', function() {
            // Ocultar thumbnail y mostrar video
            videoThumbnail.style.display = 'none';
            videoPlayer.style.display = 'block';
            
            // Reproducir video
            const iframe = videoPlayer.querySelector('iframe');
            if (iframe) {
                const src = iframe.src;
                iframe.src = src + (src.includes('?') ? '&' : '?') + 'autoplay=1';
            }
        });
    }
    
    // Añadir efectos de parallax sutiles a las formas decorativas
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const decorativeShapes = document.querySelectorAll('.decorative-shape');
        
        decorativeShapes.forEach((shape, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrolled * speed);
            shape.style.transform = `translateY(${yPos}px)`;
        });
        
        // Efecto parallax para iconos flotantes
        const floatingIcons = document.querySelectorAll('.floating-icon');
        floatingIcons.forEach((icon, index) => {
            const speed = 0.2 + (index * 0.05);
            const yPos = -(scrolled * speed);
            icon.style.transform = `translateY(${yPos}px)`;
        });
    });
    
    // Animación de entrada para elementos
    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                fadeInObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Aplicar animación a elementos específicos
    const animateElements = document.querySelectorAll(
        '.proposito-content, .mission-vision-container, .valores-container'
    );
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        fadeInObserver.observe(el);
    });
    
    console.log('Presentación UNAC - JavaScript cargado correctamente');
});
