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

    // Dropdown functionality with smooth sliding effect
    const dropdownHeaders = document.querySelectorAll('.dropdown-header');

    dropdownHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const projectList = document.getElementById(targetId);

            // Toggle expanded class for smooth sliding
            if (projectList.classList.contains('expanded')) {
                projectList.classList.remove('expanded');
            } else {
                projectList.classList.add('expanded');
            }
        });
    });
});
