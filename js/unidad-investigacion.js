document.addEventListener('DOMContentLoaded', function() {
    // Slider de conferencias
    const slider = document.getElementById('unidad-slider');
    const slides = slider.querySelectorAll('.unidad-slide');
    const prevBtns = document.querySelectorAll('.unidad-slider-prev');
    const nextBtns = document.querySelectorAll('.unidad-slider-next');
    let currentIndex = 0;
    let visibleSlides = 3;

    function updateVisibleSlides() {
        let w = window.innerWidth;
        if (w <= 425) {
            visibleSlides = 2;
        } else if (w < 576) {
            visibleSlides = 1;
        } else if (w < 992) {
            visibleSlides = 2;
        } else {
            visibleSlides = 3;
        }
        // Reinicia el índice si se sale del rango
        if (currentIndex > slides.length - visibleSlides) {
            currentIndex = Math.max(0, slides.length - visibleSlides);
        }
        showSlides();
    }

    function showSlides() {
        slides.forEach((slide, i) => {
            slide.style.display = (i >= currentIndex && i < currentIndex + visibleSlides) ? 'flex' : 'none';
        });
    }

    prevBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (currentIndex > 0) {
                currentIndex--;
                showSlides();
            }
        });
    });
    nextBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (currentIndex < slides.length - visibleSlides) {
                currentIndex++;
                showSlides();
            }
        });
    });

    window.addEventListener('resize', updateVisibleSlides);
    updateVisibleSlides();
});
