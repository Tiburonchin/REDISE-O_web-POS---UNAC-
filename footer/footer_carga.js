window.addEventListener('DOMContentLoaded', () => {
    // Cargar contenido HTML externo
    fetch('/footer/footer-pass.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer').innerHTML = data;
        })
        .catch(error => console.error('Error al cargar el HTML:', error));
});
