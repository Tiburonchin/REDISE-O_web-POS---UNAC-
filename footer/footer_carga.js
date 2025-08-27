window.addEventListener('DOMContentLoaded', () => {
    // Determinar la ruta base relativa dinámicamente
    const pathSegments = window.location.pathname.split('/').filter(Boolean);
    pathSegments.pop(); // Remove filename
    const depth = pathSegments.length;
    const relativePath = '../'.repeat(depth) || './';

    // Construir la ruta al HTML del footer dinámicamente
    const footerPath = `${relativePath}footer/footer-pass.html`;

    console.log('Footer - Profundidad detectada:', depth);
    console.log('Footer - Cargando desde:', footerPath);

    fetch(footerPath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            document.getElementById('footer').innerHTML = data;

            // Si no estamos en la raíz, corregir las rutas de imágenes y enlaces
            if (depth > 0) {
                const elementsToFix = document.querySelectorAll('#footer [src], #footer [href]');
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

            // Insertar el correo dinámicamente después de cargar el HTML
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
