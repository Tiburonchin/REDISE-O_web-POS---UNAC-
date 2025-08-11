window.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Iniciando carga del header...');
    
    // Detectar si estamos en un subdirectorio
    const currentPath = window.location.pathname;
    const isInSubdirectory = currentPath.includes('/admision/') || currentPath.includes('/la-escuela/') || 
                            currentPath.includes('\\admision\\') || currentPath.includes('\\la-escuela\\');
    
    // Determinar la ruta correcta según la ubicación
    const headerPath = isInSubdirectory ? '../header/header-pass.html' : 'header/header-pass.html';
    const cssPath = isInSubdirectory ? '../header/header.css' : 'header/header.css';
    const jsPath = isInSubdirectory ? '../header/header_function.js' : 'header/header_function.js';
    
    console.log('📂 Detectado subdirectorio:', isInSubdirectory);
    console.log('📄 Cargando header desde:', headerPath);
    
    // Verificar que el elemento header existe
    const headerElement = document.getElementById('header');
    if (!headerElement) {
        console.error('❌ No se encontró el elemento #header');
        return;
    }
    
    // Cargar contenido HTML externo
    fetch(headerPath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            console.log('✅ HTML del header cargado exitosamente');
            
            // Reemplazar el contenido del header con el dinámico
            headerElement.innerHTML = data;
            
            // Si estamos en un subdirectorio, corregir las rutas de las imágenes
            if (isInSubdirectory) {
                const images = document.querySelectorAll('#header img');
                images.forEach(img => {
                    if (img.src.includes('img/')) {
                        img.src = img.src.replace('img/', '../img/');
                    }
                });
                
                // También corregir enlaces que apunten a páginas principales
                const links = document.querySelectorAll('#header a[href]');
                links.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href && href.startsWith('index.html')) {
                        link.setAttribute('href', '../' + href);
                    } else if (href && href.startsWith('programas.html')) {
                        link.setAttribute('href', '../' + href);
                    }
                });
            }
            
            // Como el CSS ya está precargado en el HTML principal, 
            // simplemente aseguramos que el header sea visible
            console.log('🎨 Header HTML cargado, aplicando visibilidad');
            headerElement.classList.remove('loading');
            headerElement.style.opacity = '1';
            
            // Forzar la visibilidad del header
            setTimeout(() => {
                headerElement.style.display = 'block';
                headerElement.style.visibility = 'visible';
                // Marcar como cargado para activar el fade-in definido en critical-loading.js
                headerElement.classList.add('loaded');
                console.log('👁️ Header forzado a ser visible');
            }, 100);
            
            // Verificar si el CSS del header está cargado
            const existingHeaderCSS = document.querySelector(`link[href="${cssPath}"]`) || 
                                     document.querySelector('link[href="header/header.css"]');
            
            if (!existingHeaderCSS) {
                console.log('📋 Cargando CSS del header...');
                // Solo cargar CSS si no está precargado
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
            
            // Cargar y ejecutar el JavaScript del header
            if (!window.headerJSLoaded) {
                console.log('📜 Cargando JavaScript del header...');
                const script = document.createElement('script');
                script.src = jsPath;
                script.onload = () => {
                    window.headerJSLoaded = true;
                    console.log('✅ JavaScript del header cargado exitosamente');
                    
                    // Ocultar preloader una vez que todo esté cargado
                    hidePreloader();
                };
                script.onerror = () => {
                    console.error('❌ Error al cargar el JavaScript del header desde:', jsPath);
                    hidePreloader(); // Ocultar preloader aunque haya error
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
            
            // Intentar mostrar el header de todas formas
            const headerElement = document.getElementById('header');
            if (headerElement) {
                headerElement.style.opacity = '1';
                headerElement.innerHTML = '<div style="background: #0a2e52; color: white; padding: 20px; text-align: center;">Error cargando header</div>';
            }
            
            hidePreloader(); // Ocultar preloader aunque haya error
        });
});

// Función para ocultar el preloader
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
        }, 300); // Pequeño delay para mejor experiencia visual
    }
}
