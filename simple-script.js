// Filters, hover effects, dark mode, and dropdowns for the index page.
// Project rendering is handled by projects-renderer.js from projects-data.js.
document.addEventListener('DOMContentLoaded', function() {
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
