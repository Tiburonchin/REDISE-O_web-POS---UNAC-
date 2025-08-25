document.addEventListener('DOMContentLoaded', function() {
    // Tab functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    // Function to switch tabs
    function switchTab(tabId) {
        // Hide all tab panes
        tabPanes.forEach(pane => {
            pane.classList.remove('active');
        });

        // Remove active class from all buttons
        tabButtons.forEach(btn => {
            btn.classList.remove('active');
        });

        // Show the selected tab pane
        const selectedPane = document.getElementById(tabId);
        if (selectedPane) {
            selectedPane.classList.add('active');
        }

        // Add active class to the clicked button
        const selectedButton = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
        if (selectedButton) {
            selectedButton.classList.add('active');
        }
    }

    // Add click event listeners to tab buttons
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    // Initialize first tab as active
    if (tabButtons.length > 0) {
        const firstTabId = tabButtons[0].getAttribute('data-tab');
        switchTab(firstTabId);
    }
});
