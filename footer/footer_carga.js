window.addEventListener('DOMContentLoaded', () => {
    // Detectar si estamos en un subdirectorio
    const currentPath = window.location.pathname;
    const isInSubdirectory = currentPath.includes('/admision/') || currentPath.includes('/la-escuela/') || 
                            currentPath.includes('\\admision\\') || currentPath.includes('\\la-escuela\\') ||
                            currentPath.includes('/conocenos/') || currentPath.includes('\\conocenos\\') ||
                            currentPath.includes('/sgi/') || currentPath.includes('\\sgi\\');
    
    // Determinar la ruta correcta según la ubicación
    const footerPath = isInSubdirectory ? '../footer/footer-pass.html' : 'footer/footer-pass.html';
    
    console.log('Footer - Detectado subdirectorio:', isInSubdirectory);
    console.log('Footer - Cargando desde:', footerPath);
    
    // Cargar contenido HTML externo
    fetch(footerPath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            document.getElementById('footer').innerHTML = data;
            
            // Si estamos en un subdirectorio, corregir las rutas de las imágenes
            if (isInSubdirectory) {
                const images = document.querySelectorAll('#footer img');
                images.forEach(img => {
                    if (img.src.includes('img/')) {
                        img.src = img.src.replace('img/', '../img/');
                    }
                });
            }
        })
        .catch(error => {
            console.error('Error al cargar el HTML del footer:', error);
            console.error('Ruta intentada:', footerPath);
        });
});
