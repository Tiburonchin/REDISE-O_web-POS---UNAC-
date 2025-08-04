window.addEventListener('DOMContentLoaded', () => {
    // Detectar si estamos en un subdirectorio
    const currentPath = window.location.pathname;
    const isInSubdirectory = currentPath.includes('/admision/') || currentPath.includes('/la-escuela/') || 
                            currentPath.includes('\\admision\\') || currentPath.includes('\\la-escuela\\');
    
    // Determinar la ruta correcta según la ubicación
    const headerPath = isInSubdirectory ? '../header/header-pass.html' : 'header/header-pass.html';
    const cssPath = isInSubdirectory ? '../header/header.css' : 'header/header.css';
    const jsPath = isInSubdirectory ? '../header/header_function.js' : 'header/header_function.js';
    
    console.log('Detectado subdirectorio:', isInSubdirectory);
    console.log('Cargando header desde:', headerPath);
    
    // Cargar contenido HTML externo
    fetch(headerPath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            document.getElementById('header').innerHTML = data;
            
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
            
            // Cargar el CSS del header si no está ya cargado
            if (!document.querySelector(`link[href="${cssPath}"]`)) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = cssPath;
                document.head.appendChild(link);
                console.log('CSS del header cargado desde:', cssPath);
            }
            
            // Cargar y ejecutar el JavaScript del header
            if (!window.headerJSLoaded) {
                const script = document.createElement('script');
                script.src = jsPath;
                script.onload = () => {
                    window.headerJSLoaded = true;
                    console.log('JavaScript del header cargado exitosamente');
                    
                    // Cargar también el script de fix para dropdowns
                    const fixScript = document.createElement('script');
                    fixScript.src = isInSubdirectory ? '../header/header_dropdown_fix.js' : 'header/header_dropdown_fix.js';
                    fixScript.onload = () => {
                        console.log('Script de fix para dropdowns cargado exitosamente');
                    };
                    document.head.appendChild(fixScript);
                };
                script.onerror = () => {
                    console.error('Error al cargar el JavaScript del header desde:', jsPath);
                };
                document.head.appendChild(script);
            }
        })
        .catch(error => {
            console.error('Error al cargar el HTML del header:', error);
            console.error('Ruta intentada:', headerPath);
        });
});
