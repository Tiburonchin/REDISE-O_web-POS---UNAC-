window.addEventListener('DOMContentLoaded', () => {
    // Cargar contenido HTML externo
    fetch('/header/header-pass.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header').innerHTML = data;
        })
        .catch(error => console.error('Error al cargar el HTML:', error));
});
