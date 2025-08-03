window.addEventListener('DOMContentLoaded', () => {
    // Cargar contenido HTML externo
    fetch('header/header-pass.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header').innerHTML = data;
            
            // Cargar el CSS del header si no está ya cargado
            if (!document.querySelector('link[href="header/header.css"]')) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'header/header.css';
                document.head.appendChild(link);
            }
            
            // Cargar y ejecutar el JavaScript del header
            if (!window.headerJSLoaded) {
                const script = document.createElement('script');
                script.src = 'header/header_function.js';
                script.onload = () => {
                    window.headerJSLoaded = true;
                    console.log('Header JavaScript loaded successfully');
                };
                script.onerror = () => {
                    console.error('Error loading header JavaScript');
                };
                document.head.appendChild(script);
            }
        })
        .catch(error => console.error('Error al cargar el HTML:', error));
});
