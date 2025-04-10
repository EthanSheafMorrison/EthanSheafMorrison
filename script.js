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
            hoverImage.style.opacity = 0;
        });
    });

    // Handle dropdown functionality with animations
    const dropdownHeaders = document.querySelectorAll('.dropdown-header');
    
    dropdownHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const targetList = document.getElementById(targetId);
            
            // Toggle the expanded class
            targetList.classList.toggle('expanded');
            this.classList.toggle('expanded');
            
            // Force a reflow to ensure the animation works
            void targetList.offsetWidth;
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

    // Dark Mode Toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

    // Check for saved user preference, if any, on load of the website
    function checkDarkModePreference() {
        const darkMode = localStorage.getItem('darkMode');
        if (darkMode === 'true' || (darkMode === null && prefersDarkScheme.matches)) {
            document.body.classList.add('dark-mode');
        }
    }

    // Toggle dark mode
    function toggleDarkMode() {
        const isDarkMode = document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', isDarkMode);
    }

    // Event Listeners
    darkModeToggle.addEventListener('click', toggleDarkMode);
    prefersDarkScheme.addEventListener('change', (e) => {
        if (localStorage.getItem('darkMode') === null) {
            document.body.classList.toggle('dark-mode', e.matches);
        }
    });

    // Check preference on load
    checkDarkModePreference();

    // Project Filtering
    document.addEventListener('DOMContentLoaded', function() {
        // Initialize filter sidebar if it exists
        const filterSidebar = document.querySelector('.filter-sidebar');
        if (filterSidebar) {
            const filterToggle = document.querySelector('.filter-toggle');
            const filterTags = document.querySelectorAll('.filter-tag input[type="checkbox"]');
            const projects = document.querySelectorAll('.project-item');

            // Toggle filter sidebar
            filterToggle.addEventListener('click', () => {
                const isExpanded = filterSidebar.classList.toggle('active');
                filterToggle.setAttribute('aria-expanded', isExpanded);
            });

            // Filter projects based on selected tags
            filterTags.forEach(checkbox => {
                checkbox.addEventListener('change', () => {
                    const selectedTags = Array.from(filterTags)
                        .filter(cb => cb.checked)
                        .map(cb => cb.value);

                    projects.forEach(project => {
                        const projectTags = Array.from(project.querySelectorAll('.project-tag'))
                            .map(tag => tag.textContent.trim());

                        if (selectedTags.length === 0 || selectedTags.some(tag => projectTags.includes(tag))) {
                            project.style.display = '';
                        } else {
                            project.style.display = 'none';
                        }
                    });
                });
            });

            // Close sidebar when clicking outside
            document.addEventListener('click', (e) => {
                if (filterSidebar.classList.contains('active') && 
                    !filterSidebar.contains(e.target) && 
                    !filterToggle.contains(e.target)) {
                    filterSidebar.classList.remove('active');
                    filterToggle.setAttribute('aria-expanded', 'false');
                }
            });
        }
    });

    // Project Thumbnail Previews
    const previewContainer = document.querySelector('.project-preview');

    projectItems.forEach(item => {
        const projectLink = item.querySelector('.project-title');
        const projectTitle = projectLink.textContent;
        const projectUrl = projectLink.getAttribute('href');
        
        // Fetch the project page to get the hero image
        fetch(projectUrl)
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const heroImage = doc.querySelector('.hero-image');
                
                if (heroImage) {
                    const heroImageUrl = heroImage.getAttribute('src');
                    
                    item.addEventListener('mouseenter', () => {
                        previewContainer.style.backgroundImage = `url(${heroImageUrl})`;
                        previewContainer.style.opacity = '1';
                        previewContainer.style.visibility = 'visible';
                    });

                    item.addEventListener('mousemove', (e) => {
                        const x = e.clientX;
                        const y = e.clientY;
                        const previewWidth = 300;
                        const previewHeight = 200;
                        const windowWidth = window.innerWidth;
                        const windowHeight = window.innerHeight;

                        // Position the preview to the right of the cursor, or to the left if near the right edge
                        let left = x + 20;
                        if (left + previewWidth > windowWidth) {
                            left = x - previewWidth - 20;
                        }

                        // Position the preview below the cursor, or above if near the bottom edge
                        let top = y + 20;
                        if (top + previewHeight > windowHeight) {
                            top = y - previewHeight - 20;
                        }

                        previewContainer.style.left = `${left}px`;
                        previewContainer.style.top = `${top}px`;
                    });

                    item.addEventListener('mouseleave', () => {
                        previewContainer.style.opacity = '0';
                        previewContainer.style.visibility = 'hidden';
                    });
                }
            })
            .catch(error => {
                console.error('Error fetching project hero image:', error);
            });
    });
});
