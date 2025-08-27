window.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Iniciando carga del header...');

    // Determinar la ruta base relativa dinámicamente
    const pathSegments = window.location.pathname.split('/').filter(Boolean);
    pathSegments.pop(); // Remove filename
    const depth = pathSegments.length;
    const relativePath = '../'.repeat(depth) || './';

    // Construir rutas dinámicamente
    const headerPath = `${relativePath}header/header-pass.html`;
    const cssPath = `${relativePath}header/header.css`;
    const jsPath = `${relativePath}header/header_function.js`;

    console.log('📂 Profundidad detectada:', depth);
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

            // Si no estamos en la raíz, corregir las rutas de imágenes y enlaces
            if (depth > 0) {
                const elementsToFix = document.querySelectorAll('#header [src], #header [href]');
                elementsToFix.forEach(el => {
                    const attribute = el.hasAttribute('src') ? 'src' : 'href';
                    const value = el.getAttribute(attribute);

                    if (value && !value.startsWith('http') && !value.startsWith('#') && !value.startsWith('mailto:') && !value.startsWith('tel:') && !value.startsWith('data:')) {
                        if (!value.startsWith(relativePath)) {
                            el.setAttribute(attribute, relativePath + value);
                        }
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

            const existingHeaderCSS = document.querySelector(`link[href="${cssPath}"]`) || document.querySelector('link[href="header/header.css"]');
            if (!existingHeaderCSS) {
                console.log('📋 Cargando CSS del header...');
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = cssPath;
                link.onload = () => console.log('✅ CSS del header cargado desde:', cssPath);
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
