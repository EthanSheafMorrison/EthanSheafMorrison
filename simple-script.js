// Simple script for loading projects without all the complexity
document.addEventListener('DOMContentLoaded', function() {
    // Load data
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            if (data.projects && data.projects.length > 0) {
                displayProjects(data.projects);
                setupProjectPreviews(data.projects);
            } else {
                console.error('No projects found in data.json');
            }
        })
        .catch(error => {
            console.error('Error loading data:', error);
        });
    
    function displayProjects(projects) {
        // Display featured projects in the "Selected Works" section
        const featuredProjects = projects.filter(project => project.featured);
        
        // Get all section elements with class "projects-list"
        const sections = document.querySelectorAll('section.projects-list');
        // Find the Selected Works section
        let selectedWorksUl = null;
        for (let i = 0; i < sections.length; i++) {
            const heading = sections[i].querySelector('h2');
            if (heading && heading.textContent.trim() === 'Selected Works') {
                selectedWorksUl = sections[i].querySelector('ul');
                break;
            }
        }
        
        if (selectedWorksUl && featuredProjects.length > 0) {
            selectedWorksUl.innerHTML = '';
            featuredProjects.forEach(project => {
                const li = createProjectListItem(project);
                selectedWorksUl.appendChild(li);
            });
        } else {
        }
        
        // Display projects by year
        const years = [...new Set(projects.map(p => p.date))].sort().reverse();
        years.forEach(year => {
            const yearProjects = projects.filter(p => p.date === year);
            const yearUl = document.getElementById(`projects-${year}`);
            
            if (yearUl && yearProjects.length > 0) {
                yearUl.innerHTML = '';
                yearProjects.forEach(project => {
                    const li = createProjectListItem(project);
                    yearUl.appendChild(li);
                });
            } else {
            }
        });
        
        // Display group projects
        const groupProjects = projects.filter(project => project.group);
        
        // Find the Group Projects section
        let groupProjectsUl = null;
        for (let i = 0; i < sections.length; i++) {
            const heading = sections[i].querySelector('h2');
            if (heading && heading.textContent.trim() === 'Group Projects') {
                groupProjectsUl = sections[i].querySelector('ul');
                break;
            }
        }
        
        if (groupProjectsUl && groupProjects.length > 0) {
            groupProjectsUl.innerHTML = '';
            groupProjects.forEach(project => {
                const li = createProjectListItem(project);
                groupProjectsUl.appendChild(li);
            });
        } else {
        }
    }
    
    function createProjectListItem(project) {
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
        
        // Add data attribute for project ID to use with hover images
        li.setAttribute('data-project-id', project.id);
        
        return li;
    }
    
    function setupProjectPreviews(projects) {
        // Get the project preview container
        const previewContainer = document.querySelector('.project-preview');
        if (!previewContainer) {
            return;
        }
        
        // Create a mapping of project IDs to image paths
        const projectImages = {};
        projects.forEach(project => {
            // Use a default image path pattern based on project ID
            projectImages[project.id] = `images/projects/${project.id}/main.jpg`;
        });
        
        // Add event listeners to all project list items
        const projectItems = document.querySelectorAll('.projects-list li');
        projectItems.forEach(item => {
            const projectId = item.getAttribute('data-project-id');
            if (!projectId) return;
            
            // Store the image path
            const imagePath = projectImages[projectId];
            
            item.addEventListener('mouseenter', function(e) {
                // Show the preview with the project image
                previewContainer.style.backgroundImage = `url(${imagePath})`;
                previewContainer.style.opacity = '1';
                previewContainer.style.visibility = 'visible';
                
                // Update position on initial hover
                updatePreviewPosition(e, previewContainer);
            });
            
            item.addEventListener('mousemove', function(e) {
                // Update the position as the mouse moves
                updatePreviewPosition(e, previewContainer);
            });
            
            item.addEventListener('mouseleave', function() {
                // Hide the preview when mouse leaves
                previewContainer.style.opacity = '0';
                previewContainer.style.visibility = 'hidden';
            });
        });
    }
    
    function updatePreviewPosition(e, previewContainer) {
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
    }
    
    // Initialize filtering system
    const filterCheckboxes = document.querySelectorAll('.filter-option input[type="checkbox"]');
    const clearFiltersBtn = document.querySelector('.clear-filters');
    const activeFilters = new Set();

    // Setup filter event listeners
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('click', (e) => {
            checkbox.classList.add('checkbox-clicked');
            setTimeout(() => {
                checkbox.classList.remove('checkbox-clicked');
            }, 200);
        });

        checkbox.addEventListener('change', () => {
            const selectedTag = checkbox.getAttribute('data-tag');
            if (checkbox.checked) {
                activeFilters.add(selectedTag);
            } else {
                activeFilters.delete(selectedTag);
            }
            updateProjectVisibility();
        });
    });

    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', () => {
            filterCheckboxes.forEach(checkbox => checkbox.checked = false);
            activeFilters.clear();
            updateProjectVisibility();
        });
    }

    function clearProjectHoverState() {
        const selectionBar = document.getElementById('projectSelectionBar');
        const hoverBgA = document.getElementById('hoverBgA');
        const hoverBgB = document.getElementById('hoverBgB');
        if (selectionBar) {
            selectionBar.classList.remove('visible');
            selectionBar.style.height = '0';
            selectionBar.style.transform = 'translateY(0)';
        }
        if (hoverBgA) hoverBgA.classList.remove('visible');
        if (hoverBgB) hoverBgB.classList.remove('visible');
    }

    function updateProjectVisibility() {
        const projectRows = document.querySelectorAll('.project-row');
        const staggerMs = 20;

        projectRows.forEach((row, index) => {
            if (activeFilters.size === 0) {
                row.style.transitionDelay = '';
                row.classList.remove('filter-hidden');
                return;
            }

            const projectTags = Array.from(row.querySelectorAll('.project-tags span'))
                .map(span => span.textContent.trim().toLowerCase());

            const hasMatchingTag = Array.from(activeFilters)
                .some(filter => projectTags.includes(filter.toLowerCase()));

            if (hasMatchingTag) {
                row.style.transitionDelay = '';
                row.classList.remove('filter-hidden');
            } else {
                row.style.transitionDelay = index * staggerMs + 'ms';
                row.classList.add('filter-hidden');
            }
        });

        clearProjectHoverState();
    }

    // Setup project hover effects (skip if enhanced selection bar exists)
    const hoverBg = document.querySelector('.project-hover-bg');
    const selectionBarEl = document.getElementById('projectSelectionBar');
    if (hoverBg && !selectionBarEl) {
        // Create a video element for video thumbnails
        let hoverVideo = hoverBg.querySelector('video');
        if (!hoverVideo) {
            hoverVideo = document.createElement('video');
            hoverVideo.autoplay = true;
            hoverVideo.loop = true;
            hoverVideo.muted = true;
            hoverVideo.playsInline = true;
            hoverVideo.style.width = '100%';
            hoverVideo.style.height = '100%';
            hoverVideo.style.objectFit = 'cover';
            hoverVideo.style.position = 'absolute';
            hoverVideo.style.top = '0';
            hoverVideo.style.left = '0';
            hoverBg.appendChild(hoverVideo);
        }

        projectRows.forEach(row => {
            row.addEventListener('mouseenter', () => {
                const mediaUrl = row.getAttribute('data-image');
                if (mediaUrl) {
                    // Check if it's a video file
                    const isVideo = mediaUrl.match(/\.(webm|mp4)(\?|$)/i);
                    if (isVideo) {
                        // Hide background image and show video
                        hoverBg.style.backgroundImage = 'none';
                        hoverVideo.style.display = 'block';
                        // Set video source (prefer webm, fallback to mp4)
                        const baseUrl = mediaUrl.replace(/\.(webm|mp4)$/i, '');
                        hoverVideo.innerHTML = `
                            <source src="${baseUrl}.webm" type="video/webm">
                            <source src="${baseUrl}.mp4" type="video/mp4">
                        `;
                        hoverVideo.load();
                        hoverVideo.play().catch(e => console.log('Video autoplay prevented:', e));
                    } else {
                        // Hide video and show background image
                        hoverVideo.style.display = 'none';
                        hoverBg.style.backgroundImage = `url('${mediaUrl}')`;
                    }
                    hoverBg.classList.add('visible');
                }
            });

            row.addEventListener('mouseleave', () => {
                hoverBg.classList.remove('visible');
                if (hoverVideo) {
                    hoverVideo.pause();
                }
            });
        });
    }

    // Setup dark mode toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;

    if (darkModeToggle) {
        // Check for saved dark mode preference
        if (localStorage.getItem('darkMode') === 'true') {
            body.classList.add('dark-mode');
        }

        darkModeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            localStorage.setItem('darkMode', body.classList.contains('dark-mode'));
        });
    } else {
    }

    // Setup dropdowns
    document.querySelectorAll('.dropdown-header').forEach(header => {
        header.addEventListener('click', () => {
            const targetId = header.getAttribute('data-target');
            const targetList = document.getElementById(targetId);
            
            if (targetList) {
                targetList.classList.toggle('expanded');
                header.classList.toggle('expanded');
                
                const indicator = header.querySelector('.dropdown-indicator');
                if (indicator) {
                    indicator.textContent = targetList.classList.contains('expanded') ? '−' : '+';
                }
            }
        });
    });
}); 