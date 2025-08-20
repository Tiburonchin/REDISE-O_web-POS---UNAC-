// Función para manejar la lógica de las pestañas (tabs)
function openTab(evt, tabName) {
    // Ocultar todo el contenido de las pestañas
    const tabcontent = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Quitar la clase "active" de todos los botones
    const tablinks = document.getElementsByClassName("tab-button");
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Mostrar la pestaña actual y agregar la clase "active" al botón
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}


document.addEventListener('DOMContentLoaded', () => {
    const accordions = document.querySelectorAll('#requisitos-especificos-col .accordion-item');

    accordions.forEach(accordion => {
        // Use 'click' on summary to handle the logic before the toggle event
        const summary = accordion.querySelector('summary');
        summary.addEventListener('click', (event) => {
            // Prevent the default toggle behavior to manage it manually
            event.preventDefault();

            // If the clicked accordion is already open, close it.
            if (accordion.open) {
                accordion.open = false;
                return;
            }

            // Close all other accordions
            accordions.forEach(otherAccordion => {
                otherAccordion.open = false;
            });

            // Open the clicked one
            accordion.open = true;
        });
    });
});