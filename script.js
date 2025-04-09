document.addEventListener('DOMContentLoaded', function () {
    // Hover image functionality for project items
    const projectItems = document.querySelectorAll('.projects-list li');
    const hoverImage = document.getElementById('hover-image');
    
    projectItems.forEach(item => {
        item.addEventListener('mouseenter', function () {
            const imageUrl = item.getAttribute('data-image');
            hoverImage.style.backgroundImage = `url(${imageUrl})`;
            hoverImage.style.opacity = 1;

            // Generate random position within the viewport
            const randomX = Math.floor(Math.random() * (window.innerWidth - hoverImage.offsetWidth));
            const randomY = Math.floor(Math.random() * (window.innerHeight - hoverImage.offsetHeight));
            
            hoverImage.style.left = `${randomX}px`;
            hoverImage.style.top = `${randomY}px`;
        });

        item.addEventListener('mouseleave', function () {
            hoverImage.style.opacity = 0; // Hide the image when not hovering
        });
    });

    // Handle dropdown functionality
    const dropdownHeaders = document.querySelectorAll('.dropdown-header');
    
    dropdownHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const targetList = document.getElementById(targetId);
            
            // Toggle the expanded class
            targetList.classList.toggle('expanded');
            
            // Toggle the arrow icon (optional)
            this.classList.toggle('expanded');
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
