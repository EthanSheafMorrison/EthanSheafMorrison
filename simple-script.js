// Simple script for loading projects without all the complexity
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - simple script');
    
    // Load data
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            console.log('Data loaded:', data);
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
        console.log('Found sections:', sections.length);
        
        // Find the Selected Works section
        let selectedWorksUl = null;
        for (let i = 0; i < sections.length; i++) {
            const heading = sections[i].querySelector('h2');
            if (heading && heading.textContent.trim() === 'Selected Works') {
                selectedWorksUl = sections[i].querySelector('ul');
                console.log('Found Selected Works section with heading:', heading.textContent);
                break;
            }
        }
        
        if (selectedWorksUl && featuredProjects.length > 0) {
            selectedWorksUl.innerHTML = '';
            featuredProjects.forEach(project => {
                const li = createProjectListItem(project);
                selectedWorksUl.appendChild(li);
            });
            console.log('Featured projects displayed:', featuredProjects.length);
        } else {
            console.warn('Selected Works section not found or no featured projects', 
                         'Found UL:', !!selectedWorksUl, 
                         'Featured projects:', featuredProjects.length);
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
                console.log(`Year ${year} projects displayed:`, yearProjects.length);
            } else {
                console.warn(`Year ${year} section not found or no projects for this year`);
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
                console.log('Found Group Projects section with heading:', heading.textContent);
                break;
            }
        }
        
        if (groupProjectsUl && groupProjects.length > 0) {
            groupProjectsUl.innerHTML = '';
            groupProjects.forEach(project => {
                const li = createProjectListItem(project);
                groupProjectsUl.appendChild(li);
            });
            console.log('Group projects displayed:', groupProjects.length);
        } else {
            console.warn('Group Projects section not found or no group projects',
                         'Found UL:', !!groupProjectsUl,
                         'Group projects:', groupProjects.length);
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
            console.warn('Project preview container not found');
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
        
        console.log('Project preview hover effects set up');
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
    const projectRows = document.querySelectorAll('.project-row');
    const clearFiltersBtn = document.querySelector('.clear-filters');
    const activeFilters = new Set();

    if (filterCheckboxes.length === 0) {
        console.warn('No filter checkboxes found');
    } else {
        console.log('Found filter checkboxes:', filterCheckboxes.length);
    }

    if (projectRows.length === 0) {
        console.warn('No project rows found');
    } else {
        console.log('Found project rows:', projectRows.length);
    }

    // Setup filter event listeners
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const selectedTag = checkbox.getAttribute('data-tag');
            console.log('Checkbox changed:', selectedTag, checkbox.checked);
            
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
            console.log('Clearing filters');
            filterCheckboxes.forEach(checkbox => checkbox.checked = false);
            activeFilters.clear();
            updateProjectVisibility();
        });
    } else {
        console.warn('Clear filters button not found');
    }

    function updateProjectVisibility() {
        console.log('Active filters:', Array.from(activeFilters));
        
        projectRows.forEach(row => {
            if (activeFilters.size === 0) {
                row.style.display = 'grid';
                return;
            }

            const projectTags = Array.from(row.querySelectorAll('.project-tags span'))
                .map(span => span.textContent.trim().toLowerCase());
            
            console.log('Project tags:', projectTags);
            
            // Show project if it matches ANY of the active filters
            const hasMatchingTag = Array.from(activeFilters)
                .some(filter => projectTags.includes(filter.toLowerCase()));
            
            row.style.display = hasMatchingTag ? 'grid' : 'none';
        });
    }

    // Setup project hover effects
    const hoverBg = document.querySelector('.project-hover-bg');
    if (hoverBg) {
        projectRows.forEach(row => {
            row.addEventListener('mouseenter', () => {
                const imageUrl = row.getAttribute('data-image');
                if (imageUrl) {
                    hoverBg.style.backgroundImage = `url('${imageUrl}')`;
                    hoverBg.classList.add('visible');
                }
            });

            row.addEventListener('mouseleave', () => {
                hoverBg.classList.remove('visible');
            });
        });
    } else {
        console.warn('Project hover background element not found');
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
        console.warn('Dark mode toggle button not found');
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