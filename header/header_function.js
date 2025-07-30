        function toggleMobileMenu() {
            const mobileMenu = document.getElementById('mobileMenu');
            mobileMenu.classList.toggle('active');
        }

        function toggleDropdown(id) {
            event.preventDefault();
            
            // Get all mobile dropdowns
            const allDropdowns = document.querySelectorAll('.mobile-dropdown');
            const targetDropdown = document.getElementById(id);
            
            // Close all other dropdowns first
            allDropdowns.forEach(dropdown => {
                if (dropdown.id !== id) {
                    dropdown.classList.remove('active');
                }
            });
            
            // Toggle the clicked dropdown
            targetDropdown.classList.toggle('active');
        }

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            const mobileMenu = document.getElementById('mobileMenu');
            const mobileBtn = document.querySelector('.mobile-menu-btn');
            
            if (!mobileMenu.contains(event.target) && !mobileBtn.contains(event.target)) {
                mobileMenu.classList.remove('active');
                // Close all mobile dropdowns
                document.querySelectorAll('.mobile-dropdown').forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
            }
        });

        // Close mobile menu when resizing to desktop view
        window.addEventListener('resize', function() {
            const mobileMenu = document.getElementById('mobileMenu');
            
            // If window is wider than tablet breakpoint, close mobile menu and dropdowns
            if (window.innerWidth > 768) {
                mobileMenu.classList.remove('active');
                document.querySelectorAll('.mobile-dropdown').forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
            }
        });