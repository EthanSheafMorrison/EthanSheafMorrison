// Render projects for both desktop and mobile from a single data source
// This eliminates the need to update projects in two places

function renderDesktopProject(project) {
    const displayStyle = project.visible ? '' : 'style="display: none;"';
    
    return `
        <div class="project-row" data-image="${project.image}" ${displayStyle}>
            <div class="project-number">${project.number}</div>
            <a href="${project.url}" class="project-title">
                ${project.title}
            </a>
            <div class="project-tags">
                ${project.tags.map(tag => `<span>${tag}</span>`).join('')}
            </div>
            <div></div>
            <div class="project-description">
                ${project.description}
            </div>
        </div>
    `;
}

function renderMobileProject(project) {
    const displayStyle = project.visible ? '' : 'style="display: none;"';
    
    return `
        <div class="mobile-project-item" data-image="${project.image}" ${displayStyle}>
            <div class="mobile-project-number">${project.number}</div>
            <a href="${project.url}" class="mobile-project-title">
                ${project.title}
            </a>
            <div class="mobile-project-tags">
                ${project.tags.map(tag => `<span class="mobile-project-tag">${tag}</span>`).join('')}
            </div>
            <p class="mobile-project-description">
                ${project.description}
            </p>
        </div>
    `;
}

function renderAllProjects() {
    // Filter to only visible projects for rendering
    const visibleProjects = projectsData.filter(p => p.visible);
    
    // Render desktop projects
    const desktopContainer = document.querySelector('.projects-list');
    if (desktopContainer) {
        desktopContainer.innerHTML = visibleProjects.map(renderDesktopProject).join('');
    }
    
    // Render mobile projects
    const mobileContainer = document.querySelector('.mobile-projects-list');
    if (mobileContainer) {
        mobileContainer.innerHTML = visibleProjects.map(renderMobileProject).join('');
    }
    
    // Re-initialize desktop hover selection bar and crossfade background
    // This code is moved from inline script to ensure it runs after dynamic rendering
    setTimeout(() => {
        const selectionBar = document.getElementById('projectSelectionBar');
        const hoverBgA = document.getElementById('hoverBgA');
        const hoverBgB = document.getElementById('hoverBgB');
        const rows = document.querySelectorAll('.project-row');
        if (selectionBar && rows.length) {
            const list = document.querySelector('.projects-list');
            let activeIsA = true;
            rows.forEach(row => {
                row.addEventListener('mouseenter', () => {
                    const rowRect = row.getBoundingClientRect();
                    const containerRect = projectsContainer.getBoundingClientRect();
                    const translateY = rowRect.top - containerRect.top;
                    selectionBar.style.height = `${rowRect.height}px`;
                    selectionBar.style.transform = `translateY(${translateY}px)`;
                    selectionBar.classList.add('visible');
                    const imageUrl = row.getAttribute('data-image');
                    if (!imageUrl) return;
                    const incoming = activeIsA ? hoverBgB : hoverBgA;
                    const outgoing = activeIsA ? hoverBgA : hoverBgB;
                    incoming.style.backgroundImage = `url('${imageUrl}')`;
                    incoming.classList.add('visible');
                    outgoing.classList.remove('visible');
                    activeIsA = !activeIsA;
                });
            });
            const projectsContainer = document.querySelector('.projects-container');
            if (projectsContainer) {
                projectsContainer.addEventListener('mouseleave', () => {
                    hoverBgA.classList.remove('visible');
                    hoverBgB.classList.remove('visible');
                    selectionBar.classList.remove('visible');
                    selectionBar.style.height = '0';
                    selectionBar.style.transform = 'translateY(0)';
                });
            }
        }
        
        // Re-initialize mobile background updates
        if (typeof window.updateMobileBgTight === 'function') {
            window.updateMobileBgTight(true);
        }
    }, 100);
}

// Auto-render when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderAllProjects);
} else {
    renderAllProjects();
}
