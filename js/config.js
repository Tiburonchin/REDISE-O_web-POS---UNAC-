/**
 * CONFIGURACIÓN DE LA PÁGINA PRINCIPAL
 * Este archivo contiene configuraciones personalizables
 */

// Configuración para la animación de palabras en el hero
const WORD_ANIMATION_CONFIG = {
    words: [
        'maravilloso',
        'innovador',
        'único',
        'extraordinario',
        'excepcional',
        'brillante'
    ],
    interval: 3000, // milisegundos
    transitionDuration: 300 // milisegundos
};

// Configuración de colores del tema
const THEME_CONFIG = {
    colors: {
        primary: '#001f3f',
        secondary: '#0056b3',
        accent: '#FFC107',
        white: '#ffffff',
        lightGray: '#f8f9fa',
        darkGray: '#343a40'
    }
};

// Configuración de animaciones
const ANIMATION_CONFIG = {
    scrollThreshold: 0.1,
    fadeInDuration: 800,
    hoverTransition: 300,
    carouselSpeed: 20000 // milisegundos
};

// Configuración responsive
const RESPONSIVE_CONFIG = {
    breakpoints: {
        mobile: 576,
        tablet: 768,
        desktop: 992,
        large: 1200
    }
};

// Textos configurables
const CONTENT_CONFIG = {
    hero: {
        title: 'Esto es algo',
        description: 'El Posgrado de nuestra Universidad te brinda la oportunidad de crecer profesionalmente con programas de excelencia.',
        primaryButton: 'Solicitar Información',
        secondaryButton: 'Ver Programas'
    },
    admision: {
        badge: 'Nuevo Proceso',
        title: 'Admisión 2025-B Abierta',
        subtitle: 'Postula ahora y asegura tu lugar',
        description: 'Únete a nuestra comunidad académica y forma parte de la próxima generación de líderes. Nuestro proceso de admisión está diseñado para identificar el talento y la pasión por el conocimiento.',
        button: 'Conoce el proceso'
    },
    motivacional: {
        text: 'La Universidad que forma líderes para transformar el futuro',
        subtitle: 'Más de 50 años de excelencia académica y compromiso con el desarrollo del país'
    }
};

// Exportar configuraciones si se usa como módulo
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        WORD_ANIMATION_CONFIG,
        THEME_CONFIG,
        ANIMATION_CONFIG,
        RESPONSIVE_CONFIG,
        CONTENT_CONFIG
    };
}
