document.addEventListener('DOMContentLoaded', () => {
    const scrollContainer = document.querySelector('.scroll-container');
    const contentColumn = document.querySelector('.scroll-content');
    const sidebar = document.querySelector('.info-sidebar');

    if (!scrollContainer || !contentColumn || !sidebar) {
        console.error('Required elements for scrolling effect not found.');
        return;
    }

    let containerTop = scrollContainer.offsetTop;
    let containerHeight = scrollContainer.offsetHeight;
    let contentHeight = contentColumn.scrollHeight;
    let sidebarHeight = sidebar.offsetHeight;

    // Recalculate on resize
    window.addEventListener('resize', () => {
        containerTop = scrollContainer.offsetTop;
        containerHeight = scrollContainer.offsetHeight;
        contentHeight = contentColumn.scrollHeight;
        sidebarHeight = sidebar.offsetHeight;
    });

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Check if the scroll is within the container's bounds
        if (scrollTop >= containerTop && scrollTop <= containerTop + contentHeight - containerHeight) {
            scrollContainer.classList.add('scrolling');

            // Calculate the scroll progress within the content
            const scrollProgress = (scrollTop - containerTop) / (contentHeight - containerHeight);

            // Calculate the sidebar's slower scroll position
            const sidebarScroll = scrollProgress * (sidebarHeight - containerHeight);

            // Apply transformations
            contentColumn.style.transform = `translateY(-${scrollTop - containerTop}px)`;
            sidebar.style.transform = `translateY(-${sidebarScroll}px)`;

        } else {
            scrollContainer.classList.remove('scrolling');
            // Reset transformations when not in the scrolling zone
            if (scrollTop < containerTop) {
                contentColumn.style.transform = 'translateY(0)';
                sidebar.style.transform = 'translateY(0)';
            } else {
                const contentScrollEnd = contentHeight - containerHeight;
                const sidebarScrollEnd = sidebarHeight - containerHeight;
                contentColumn.style.transform = `translateY(-${contentScrollEnd}px)`;
                sidebar.style.transform = `translateY(-${sidebarScrollEnd}px)`;
            }
        }
    });
});
