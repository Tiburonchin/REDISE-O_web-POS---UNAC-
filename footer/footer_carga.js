window.addEventListener('DOMContentLoaded', () => {
    const base = typeof basePath !== 'undefined' ? basePath : '';

    const footerPath = `${base}footer/footer-pass.html`;
    
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

            if (base !== '') {
                // Corregir rutas de imágenes
                const images = footerElement.querySelectorAll('img');
                images.forEach(img => {
                    let src = img.getAttribute('src');
                    if (src && !src.startsWith('http') && !src.startsWith(base)) {
                        img.setAttribute('src', base + src);
                    }
                });

                // Corregir rutas de enlaces
                const links = footerElement.querySelectorAll('a');
                links.forEach(link => {
                    let href = link.getAttribute('href');
                    if (href && !href.startsWith('#') && !href.startsWith('http') && !href.startsWith(base)) {
                        link.setAttribute('href', base + href);
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
