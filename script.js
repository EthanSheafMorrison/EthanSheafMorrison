document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM fully loaded');
    
    // Load project data from JSON file
    fetch('data.json')
        .then(response => {
            console.log('Fetch response received:', response.ok);
            return response.json();
        })
        .then(data => {
            console.log('Data loaded:', data);
            console.log('Number of projects:', data.projects.length);
            populateProjects(data.projects);
            setupEventListeners();
        })
        .catch(error => console.error('Error loading project data:', error));

    function populateProjects(projects) {
        console.log('Starting to populate projects...');
        
        // Populate Selected Works section
        const featuredProjects = projects.filter(project => project.featured);
        console.log('Featured projects:', featuredProjects.length);
        
        // Get the first section with class projects-list
        const selectedWorksSection = document.querySelector('section.projects-list');
        if (selectedWorksSection) {
            const selectedWorksUl = selectedWorksSection.querySelector('ul');
            console.log('Selected Works UL found:', !!selectedWorksUl);
            
            if (selectedWorksUl) {
                populateProjectSection(selectedWorksUl, featuredProjects);
            }
        } else {
            console.error('Selected Works section not found');
        }
        
        // Populate Projects by Year section
        const projectsByYear = groupProjectsByYear(projects);
        console.log('Years with projects:', Object.keys(projectsByYear));
        
        for (const year in projectsByYear) {
            const yearList = document.getElementById(`projects-${year}`);
            console.log(`Looking for projects-${year}:`, !!yearList);
            
            if (yearList) {
                populateProjectList(yearList, projectsByYear[year]);
            }
        }
        
        // Populate Group Projects section - this is the 3rd section with class projects-list
        const groupProjects = projects.filter(project => project.group);
        console.log('Group projects:', groupProjects.length);
        
        const sections = document.querySelectorAll('section.projects-list');
        console.log('Total sections found:', sections.length);
        
        if (sections.length >= 3) {
            const groupProjectsSection = sections[2]; // Third section (index 2)
            const groupProjectsUl = groupProjectsSection.querySelector('ul');
            console.log('Group Projects UL found:', !!groupProjectsUl);
            
            if (groupProjectsUl) {
                populateProjectSection(groupProjectsUl, groupProjects);
            }
        } else {
            console.error('Group Projects section not found');
        }
    }
    
    function groupProjectsByYear(projects) {
        const result = {};
        projects.forEach(project => {
            const year = project.date;
            if (!result[year]) {
                result[year] = [];
            }
            result[year].push(project);
        });
        return result;
    }
    
    function populateProjectList(container, projects) {
        if (!container) return;
        
        container.innerHTML = '';
        populateProjectItems(container, projects);
    }
    
    function populateProjectSection(container, projects) {
        console.log('populateProjectSection called with container:', container);
        console.log('Projects to populate:', projects);
        
        if (!container) {
            console.error('Container is null or undefined');
            return;
        }
        
        if (!projects || projects.length === 0) {
            console.warn('No projects to populate');
            container.innerHTML = '<li>No projects to display</li>';
            return;
        }
        
        try {
            container.innerHTML = '';
            populateProjectItems(container, projects);
            console.log('Successfully populated section with', projects.length, 'projects');
        } catch (error) {
            console.error('Error populating section:', error);
        }
    }
    
    function populateProjectItems(container, projects) {
        try {
            console.log('Populating items into container:', container);
            
            projects.forEach(project => {
                console.log('Creating element for project:', project.title);
                
                const li = document.createElement('li');
                
                const link = document.createElement('a');
                link.href = project.url || '#';
                link.className = 'project-title';
                link.textContent = project.title || 'Untitled Project';
                
                const date = document.createElement('span');
                date.className = 'project-date';
                date.textContent = project.month ? project.month : (project.date || 'No Date');
                
                const summary = document.createElement('p');
                summary.className = 'project-summary';
                summary.textContent = project.summary || 'No description available';
                
                li.appendChild(link);
                li.appendChild(date);
                li.appendChild(summary);
                
                container.appendChild(li);
                console.log('Added project to container:', project.title);
            });
        } catch (error) {
            console.error('Error in populateProjectItems:', error);
        }
    }

    function setupEventListeners() {
        // Project Preview functionality
        setupProjectPreview();
        
        // Handle dropdown functionality with animations
        setupDropdowns();
        
        // Smooth scroll for anchor links
        setupSmoothScroll();
        
        // Dark Mode Toggle
        setupDarkMode();
        
        // Lightbox for project images
        setupLightbox();
    }
    
    function setupProjectPreview() {
        // We need to add this setTimeout to ensure we're selecting elements that have been added to the DOM
        setTimeout(() => {
            const projectItems = document.querySelectorAll('.projects-list li');
            const previewContainer = document.querySelector('.project-preview');
            
            if (!previewContainer) return;
            
            projectItems.forEach(item => {
                const projectLink = item.querySelector('.project-title');
                if (!projectLink) return;
                
                const projectUrl = projectLink.getAttribute('href');
                
                item.addEventListener('mouseenter', () => {
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
            });
        }, 100);
    }
    
    function setupDropdowns() {
        const dropdownHeaders = document.querySelectorAll('.dropdown-header');
        
        dropdownHeaders.forEach(header => {
            const targetId = header.getAttribute('data-target');
            const targetList = document.getElementById(targetId);
            const indicator = header.querySelector('.dropdown-indicator');
            
            if (!targetList || !indicator) return;
            
            // Set initial state
            header.setAttribute('aria-expanded', 'false');
            targetList.setAttribute('aria-hidden', 'true');
            
            header.addEventListener('click', () => {
                const isExpanded = header.getAttribute('aria-expanded') === 'true';
                
                // Toggle the expanded state
                header.setAttribute('aria-expanded', !isExpanded);
                targetList.setAttribute('aria-hidden', isExpanded);
                
                // Toggle the expanded class for styling
                header.classList.toggle('expanded');
                targetList.classList.toggle('expanded');
                
                // Update the indicator
                indicator.textContent = isExpanded ? '+' : '−';
            });
        });
    }
    
    function setupSmoothScroll() {
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
    }
    
    function setupDarkMode() {
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (!darkModeToggle) return;
        
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

        // Check for saved user preference
        const darkMode = localStorage.getItem('darkMode');
        if (darkMode === 'true' || (darkMode === null && prefersDarkScheme.matches)) {
            document.body.classList.add('dark-mode');
        }

        // Toggle dark mode
        darkModeToggle.addEventListener('click', () => {
            const isDarkMode = document.body.classList.toggle('dark-mode');
            localStorage.setItem('darkMode', isDarkMode);
        });
        
        // Listen for OS theme changes
        prefersDarkScheme.addEventListener('change', (e) => {
            if (localStorage.getItem('darkMode') === null) {
                document.body.classList.toggle('dark-mode', e.matches);
            }
        });
    }

    // Lightbox functionality
    function setupLightbox() {
        console.log('Setting up lightbox functionality');
        const projectImageColumns = document.querySelectorAll('.project-image-column');
        console.log('Found project image columns:', projectImageColumns.length);
        
        // Delay setup slightly to ensure DOM is fully loaded
        setTimeout(() => {
            projectImageColumns.forEach(column => {
                const images = column.querySelectorAll('img');
                const lightbox = document.getElementById('lightbox');
                console.log('Lightbox element found:', !!lightbox);
                
                if (!lightbox) {
                    console.error('Lightbox element not found!');
                    return;
                }
                
                const lightboxImage = document.getElementById('lightbox-img');
                const lightboxCaption = document.getElementById('lightbox-caption');
                const lightboxClose = document.querySelector('.lightbox-close');
                const lightboxPrev = document.querySelector('.lightbox-prev');
                const lightboxNext = document.querySelector('.lightbox-next');
                
                console.log('Image count:', images.length);
                
                let currentImageIndex = 0;
                
                // Open lightbox when an image is clicked
                images.forEach((img, index) => {
                    console.log('Adding click listener to image:', index, img.src);
                    img.addEventListener('click', () => {
                        console.log('Image clicked:', index);
                        currentImageIndex = index;
                        openLightbox(img.src, img.alt);
                    });
                });
                
                // Function to open lightbox
                function openLightbox(src, alt) {
                    console.log('Opening lightbox with:', src);
                    lightboxImage.src = src;
                    lightboxCaption.textContent = alt;
                    lightbox.classList.add('active');
                    document.body.style.overflow = 'hidden'; // Prevent scrolling when lightbox is open
                }
                
                // Close lightbox
                lightboxClose.addEventListener('click', closeLightbox);
                lightbox.addEventListener('click', (e) => {
                    if (e.target === lightbox) {
                        closeLightbox();
                    }
                });
                
                function closeLightbox() {
                    lightbox.classList.remove('active');
                    document.body.style.overflow = ''; // Restore scrolling
                }
                
                // Next image
                lightboxNext.addEventListener('click', () => {
                    currentImageIndex = (currentImageIndex + 1) % images.length;
                    const nextImg = images[currentImageIndex];
                    lightboxImage.src = nextImg.src;
                    lightboxCaption.textContent = nextImg.alt;
                });
                
                // Previous image
                lightboxPrev.addEventListener('click', () => {
                    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
                    const prevImg = images[currentImageIndex];
                    lightboxImage.src = prevImg.src;
                    lightboxCaption.textContent = prevImg.alt;
                });
                
                // Keyboard navigation
                document.addEventListener('keydown', (e) => {
                    if (!lightbox.classList.contains('active')) return;
                    
                    if (e.key === 'Escape') {
                        closeLightbox();
                    } else if (e.key === 'ArrowRight') {
                        lightboxNext.click();
                    } else if (e.key === 'ArrowLeft') {
                        lightboxPrev.click();
                    }
                });
            });
        }, 100);
    }
});

// Helper function to find elements with text content
Element.prototype.querySelector = function(selector) {
    return Element.prototype.querySelector.call(this, selector);
};

// Add a :contains selector to find elements containing text
document.querySelector = function(selector) {
    if (selector.includes(':contains(')) {
        const parts = selector.split(':contains(');
        const baseSelector = parts[0];
        const textContent = parts[1].slice(0, -1);
        
        const elements = document.querySelectorAll(baseSelector);
        for (const el of elements) {
            if (el.textContent.includes(textContent)) {
                return el;
            }
        }
        return null;
    }
    return Document.prototype.querySelector.call(this, selector);
};
