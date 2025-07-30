function showCategory(category) {
    // Remove active class from all buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.classList.remove('active');
    });

    // Add active class to clicked button
    event.target.classList.add('active');

    // Hide all categories
    const categories = document.querySelectorAll('.formats-category');
    categories.forEach(cat => {
        cat.classList.remove('active');
    });

    // Show selected category
    document.getElementById(category).classList.add('active');
}

function playTutorial(tutorialId) {
    // In a real implementation, this would open a video player
    alert(`Reproduciendo tutorial: ${tutorialId}\n\nEsta función abriría el video tutorial correspondiente.`);
}