/**
 * Cronograma Académico - Dynamic Date Handling
 * Updates status badges and highlights based on current date
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get current date for comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Process each date in the table
    const dateElements = document.querySelectorAll('.fecha-limite');
    
    dateElements.forEach(element => {
        const row = element.closest('tr');
        const dateText = element.textContent.trim();
        
        // Parse the date (format: "DD de MMMM YYYY")
        const [day, , monthName, year] = dateText.split(' ');
        const monthMap = {
            'enero': 0, 'febrero': 1, 'marzo': 2, 'abril': 3, 'mayo': 4, 'junio': 5,
            'julio': 6, 'agosto': 7, 'septiembre': 8, 'octubre': 9, 'noviembre': 10, 'diciembre': 11
        };
        
        const month = monthMap[monthName.toLowerCase()];
        const eventDate = new Date(year, month, parseInt(day));
        
        // Calculate difference in days
        const timeDiff = eventDate - today;
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        
        // Update status badge and styling
        const statusCell = row.querySelector('.status-badge');
        if (statusCell) {
            if (daysDiff < 0) {
                // Past event
                statusCell.innerHTML = '<span class="badge bg-secondary">Cerrado</span>';
            } else if (daysDiff <= 7) {
                // Upcoming event (within 7 days)
                statusCell.innerHTML = '<span class="badge bg-warning text-dark">Próximo</span>';
                row.classList.add('table-warning');
            } else if (daysDiff <= 30) {
                // Approaching event (within 30 days)
                statusCell.innerHTML = '<span class="badge bg-info">Próximamente</span>';
            } else {
                // Future event
                statusCell.innerHTML = '<span class="badge bg-light text-dark">Pendiente</span>';
            }
        }
        
        // Highlight today's events
        if (daysDiff === 0) {
            row.classList.add('table-primary');
            const statusBadge = row.querySelector('.status-badge');
            if (statusBadge) {
                statusBadge.innerHTML = '<span class="badge bg-primary">Hoy</span>';
            }
        }
    });
    
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});

// Print functionality
function printCronograma() {
    window.print();
}

// Export to PDF (placeholder - would need a library like jsPDF)
function exportToPDF() {
    // This is a placeholder - would need jsPDF or similar library
    alert('La funcionalidad de exportar a PDF estará disponible pronto.');
}
