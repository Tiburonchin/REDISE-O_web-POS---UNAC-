window.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname;
    let basePath = '';
    let isInSubdirectory = false;

    if (currentPath.includes('/admision/formulario/')) {
        basePath = '../../';
        isInSubdirectory = true;
    } else if (
        currentPath.includes('/admision/') || 
        currentPath.includes('/la-escuela/') ||
        currentPath.includes('/conocenos/') ||
        currentPath.includes('/sgi/')
    ) {
        basePath = '../';
        isInSubdirectory = true;
    }
    
    const footerPath = `${basePath}footer/footer-pass.html`;
    
    console.log('Footer - Ruta base detectada:', basePath);
    console.log('Footer - Cargando desde:', footerPath);
    
    fetch(footerPath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            const footerElement = document.getElementById('footer');
            footerElement.innerHTML = data;

            if (isInSubdirectory) {
                // Corregir rutas de imágenes
                const images = footerElement.querySelectorAll('img[src]');
                images.forEach(img => {
                    const src = img.getAttribute('src');
                    if (src && !src.startsWith('http') && !src.startsWith('/') && !src.startsWith(basePath)) {
                        img.src = `${basePath}${src}`;
                    }
                });

                // Corregir rutas de enlaces
                const links = footerElement.querySelectorAll('a[href]');
                links.forEach(link => {
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

            document.querySelectorAll('#footer-email').forEach(el => {
                const correo = 'posgrado' + '@' + 'unac.pe';
                el.innerHTML = `${correo}`;
            });
        })
        .catch(error => {
            console.error('Error al cargar el HTML del footer:', error);
            console.error('Ruta intentada:', footerPath);
        });
});
