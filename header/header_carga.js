window.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Iniciando carga del header...');

    const currentPath = window.location.pathname;
    let basePath = '';
    let isInSubdirectory = false;

    if (currentPath.includes('/admision/formulario/')) {
        basePath = '../../';
        isInSubdirectory = true;
    } else if (
        currentPath.includes('/la-escuela/') ||
        currentPath.includes('/admision/') ||
        currentPath.includes('/conocenos/') ||
        currentPath.includes('/sgi/') ||
        currentPath.includes('/unidad-investigacion/') 
    ) {
        basePath = '../';
        isInSubdirectory = true;
    }

    const headerPath = `${basePath}header/header-pass.html`;
    const cssPath = `${basePath}header/header.css`;
    const jsPath = `${basePath}header/header_function.js`;

    console.log('📂 Ruta base detectada:', basePath);
    console.log('📄 Cargando header desde:', headerPath);

    const headerElement = document.getElementById('header');
    if (!headerElement) {
        console.error('❌ No se encontró el elemento #header');
        return;
    }

    fetch(headerPath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            console.log('✅ HTML del header cargado exitosamente');
            headerElement.innerHTML = data;

            if (isInSubdirectory) {
                // Corregir rutas de imágenes
                const images = document.querySelectorAll('#header img');
                images.forEach(img => {
                    const src = img.getAttribute('src');
                    if (src && !src.startsWith('http') && !src.startsWith('/') && !src.startsWith(basePath)) {
                        img.src = `${basePath}${src}`;
                    }
                });

                // Corregir rutas de enlaces
                const allLinks = document.querySelectorAll('#header a[href]');
                allLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    if (
                        href &&
                        !href.startsWith('http') &&
                        !href.startsWith('#') &&
                        !href.startsWith('mailto:') &&
                        !href.startsWith('/') &&
                        !href.startsWith(basePath)
                    ) {
                        link.href = `${basePath}${href}`;
                    }
                });
            }

            console.log('🎨 Header HTML cargado, aplicando visibilidad');
            headerElement.classList.remove('loading');
            headerElement.style.opacity = '1';

            setTimeout(() => {
                headerElement.style.display = 'block';
                headerElement.style.visibility = 'visible';
                headerElement.classList.add('loaded');
                console.log('👁️ Header forzado a ser visible');
            }, 100);

            const existingHeaderCSS = document.querySelector(`link[href$="header.css"]`);

            if (!existingHeaderCSS) {
                console.log('📋 Cargando CSS del header...');
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = cssPath;
                link.onload = () => {
                    console.log('✅ CSS del header cargado desde:', cssPath);
                };
                document.head.appendChild(link);
            } else {
                console.log('✅ CSS del header ya está precargado');
            }

            if (!window.headerJSLoaded) {
                console.log('📜 Cargando JavaScript del header...');
                const script = document.createElement('script');
                script.src = jsPath;
                script.onload = () => {
                    window.headerJSLoaded = true;
                    console.log('✅ JavaScript del header cargado exitosamente');
                    hidePreloader();
                };
                script.onerror = () => {
                    console.error('❌ Error al cargar el JavaScript del header desde:', jsPath);
                    hidePreloader();
                };
                document.head.appendChild(script);
            } else {
                console.log('✅ JavaScript del header ya estaba cargado');
                hidePreloader();
            }
        })
        .catch(error => {
            console.error('❌ Error al cargar el HTML del header:', error);
            console.error('📍 Ruta intentada:', headerPath);

            const headerElement = document.getElementById('header');
            if (headerElement) {
                headerElement.style.opacity = '1';
                headerElement.innerHTML = '<div style="background: #0a2e52; color: white; padding: 20px; text-align: center;">Error cargando header</div>';
            }

            hidePreloader();
        });
});

function hidePreloader() {
    console.log('🎭 Ocultando preloader...');
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('hide');
            setTimeout(() => {
                preloader.remove();
                console.log('✅ Preloader removido exitosamente');
            }, 500);
        }, 300);
    }
}