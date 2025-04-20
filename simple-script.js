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
        
        return li;
    }
    
    // Setup dark mode toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
        });
        
        // Check for saved preference
        if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('dark-mode');
        }
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