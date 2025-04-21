document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.draggable-container');
    const addButton = document.querySelector('.add-image-btn');
    const resetButton = document.querySelector('.reset-btn');
    let activeImage = null;
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    // Function to get all images from the adlibsimg directory
    async function getLocalImages() {
        try {
            const response = await fetch('/adlib/adlibsimg/');
            const data = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(data, 'text/html');
            const images = Array.from(doc.querySelectorAll('a'))
                .filter(a => a.href.match(/\.(jpg|jpeg|png|gif|webp)$/i))
                .map(a => `/adlib/adlibsimg/${a.href.split('/').pop()}`);
            return images.length > 0 ? images : fallbackImages;
        } catch (error) {
            console.warn('Error loading local images:', error);
            return fallbackImages;
        }
    }

    // Fallback images
    const fallbackImages = [
        'adlib/adlibsimg/Adlib small.png'
    ];

    // Array of quotes
    const quotesArray = [
        "Design is not just what it looks like and feels like. Design is how it works. - Steve Jobs",
        "Less is more. - Ludwig Mies van der Rohe",
        "Form follows function. - Louis Sullivan",
        "Good design is obvious. Great design is transparent. - Joe Sparano",
        "Design is intelligence made visible. - Alina Wheeler",
        "Simplicity is the ultimate sophistication. - Leonardo da Vinci",
        "Design is thinking made visual. - Saul Bass",
        "Everything is designed. Few things are designed well. - Brian Reed",
        "Design creates culture. Culture shapes values. Values determine the future. - Robert L. Peters",
        "There are three responses to a piece of design – yes, no, and WOW! Wow is the one to aim for. - Milton Glaser"
    ];

    // Shape generators
    const shapeGenerators = {
        circle: (size) => {
            const strokeWidth = Math.random() * 6 + 1; // Random stroke between 1 and 7
            return `
                <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" class="animated-shape">
                    <circle cx="${size/2}" cy="${size/2}" r="${size/2 - strokeWidth}" 
                        stroke="white" stroke-width="${strokeWidth}" fill="none"
                        class="shape-path circle-path"/>
                </svg>
            `;
        },
        square: (size) => {
            const strokeWidth = Math.random() * 6 + 1;
            return `
                <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" class="animated-shape">
                    <rect x="${strokeWidth/2}" y="${strokeWidth/2}" 
                        width="${size-strokeWidth}" height="${size-strokeWidth}" 
                        stroke="white" stroke-width="${strokeWidth}" fill="none"
                        class="shape-path square-path"/>
                </svg>
            `;
        },
        triangle: (size) => {
            const strokeWidth = Math.random() * 6 + 1;
            return `
                <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" class="animated-shape">
                    <polygon points="${size/2},${strokeWidth} ${size-strokeWidth},${size-strokeWidth} ${strokeWidth},${size-strokeWidth}" 
                        stroke="white" stroke-width="${strokeWidth}" fill="none"
                        class="shape-path triangle-path"/>
                </svg>
            `;
        },
        zigzag: (size) => {
            const strokeWidth = Math.random() * 4 + 1; // Slightly thinner for zigzag
            const points = [];
            const steps = 8;
            const stepSize = size / steps;
            for (let i = 0; i <= steps; i++) {
                const x = i * stepSize;
                const y = i % 2 === 0 ? strokeWidth : size - strokeWidth;
                points.push(`${x},${y}`);
            }
            return `
                <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" class="animated-shape">
                    <polyline points="${points.join(' ')}" 
                        stroke="white" stroke-width="${strokeWidth}" fill="none"
                        class="shape-path zigzag-path"/>
                </svg>
            `;
        },
        cross: (size) => {
            const strokeWidth = Math.random() * 6 + 1;
            return `
                <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" class="animated-shape">
                    <line x1="${strokeWidth}" y1="${strokeWidth}" 
                        x2="${size-strokeWidth}" y2="${size-strokeWidth}" 
                        stroke="white" stroke-width="${strokeWidth}"
                        class="shape-path cross-path-1"/>
                    <line x1="${strokeWidth}" y1="${size-strokeWidth}" 
                        x2="${size-strokeWidth}" y2="${strokeWidth}" 
                        stroke="white" stroke-width="${strokeWidth}"
                        class="shape-path cross-path-2"/>
                </svg>
            `;
        },
        dots: (size) => {
            const dots = [];
            const count = 5;
            const spacing = size / count;
            const baseRadius = Math.random() * 3 + 2; // Random base radius between 2 and 5
            
            for (let i = 0; i < count; i++) {
                for (let j = 0; j < count; j++) {
                    if (Math.random() < 0.5) {
                        const radius = baseRadius * (Math.random() * 0.5 + 0.75); // Vary each dot size
                        dots.push(`<circle 
                            cx="${(i + 0.5) * spacing}" 
                            cy="${(j + 0.5) * spacing}" 
                            r="${radius}" 
                            fill="white"
                            class="dot-path"
                            style="animation-delay: ${Math.random() * 2}s"
                        />`);
                    }
                }
            }
            return `
                <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" class="animated-shape">
                    ${dots.join('')}
                </svg>
            `;
        }
    };

    let availableImages = fallbackImages;

    // Initialize available images
    getLocalImages().then(images => {
        availableImages = images;
    });

    function createShape() {
        const shapeContainer = document.createElement('div');
        shapeContainer.className = 'shape-container';
        
        // Random size between 100 and 300
        const size = Math.floor(Math.random() * 200) + 100;
        
        // Random shape
        const shapes = Object.keys(shapeGenerators);
        const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
        const shapeSvg = shapeGenerators[randomShape](size);
        
        shapeContainer.style.width = `${size}px`;
        shapeContainer.style.height = `${size}px`;
        shapeContainer.innerHTML = shapeSvg;
        
        return shapeContainer;
    }

    // Function to create and remove fullscreen text
    function createFullscreenText() {
        // Remove any existing fullscreen text
        const existingText = document.querySelector('.fullscreen-text');
        if (existingText) {
            existingText.remove();
        }

        const textElement = document.createElement('div');
        textElement.className = 'fullscreen-text';
        textElement.innerHTML = '<span>ADLIB</span>';
        document.body.appendChild(textElement);

        // Remove the text after 2 seconds
        setTimeout(() => {
            textElement.remove();
        }, 2000);
    }

    async function createDraggableElement() {
        const element = document.createElement('div');
        const rand = Math.random() * 100;
        
        // 1% chance for fullscreen text
        if (rand < 1) {
            createFullscreenText();
        }
        
        // 70% images, 5% quotes, 25% shapes (adjusted to account for text chance)
        if (rand < 70) {
            element.className = 'draggable-image';
            // Create image
            const img = document.createElement('img');
            img.src = availableImages[Math.floor(Math.random() * availableImages.length)];
            img.alt = 'Random brutalist image';
            element.appendChild(img);
            
            // Create drag handle for draggable elements
            const dragHandle = document.createElement('div');
            dragHandle.className = 'drag-handle';
            dragHandle.textContent = '⋮⋮';
            element.appendChild(dragHandle);
            
            // Set random initial position for draggable elements
            const randomX = Math.random() * (window.innerWidth - 300);
            const randomY = Math.random() * (window.innerHeight - 200);
            setTranslate(randomX, randomY, element);
            element.setAttribute('data-x', randomX);
            element.setAttribute('data-y', randomY);
        } else if (rand < 75) {
            element.className = 'draggable-image';
            // Create quote container
            const quoteContainer = document.createElement('div');
            quoteContainer.className = 'quote-container';
            
            const quoteText = document.createElement('p');
            quoteText.className = 'quote-text';
            quoteText.textContent = quotesArray[Math.floor(Math.random() * quotesArray.length)];
            
            quoteContainer.appendChild(quoteText);
            element.appendChild(quoteContainer);
            
            // Create drag handle for draggable elements
            const dragHandle = document.createElement('div');
            dragHandle.className = 'drag-handle';
            dragHandle.textContent = '⋮⋮';
            element.appendChild(dragHandle);
            
            // Set random initial position for draggable elements
            const randomX = Math.random() * (window.innerWidth - 300);
            const randomY = Math.random() * (window.innerHeight - 200);
            setTranslate(randomX, randomY, element);
            element.setAttribute('data-x', randomX);
            element.setAttribute('data-y', randomY);
        } else {
            element.className = 'fixed-shape';
            // Create shape
            const shape = createShape();
            element.appendChild(shape);
            
            // Set random position for fixed shapes
            const randomX = Math.random() * (window.innerWidth - 300);
            const randomY = Math.random() * (window.innerHeight - 200);
            element.style.left = `${randomX}px`;
            element.style.top = `${randomY}px`;
        }

        // Add to container
        container.appendChild(element);
        return element;
    }

    function dragStart(e) {
        const target = e.target.closest('.draggable-image');
        if (!target) return;

        activeImage = target;
        
        if (e.type === "touchstart") {
            initialX = e.touches[0].clientX - parseFloat(activeImage.getAttribute('data-x'));
            initialY = e.touches[0].clientY - parseFloat(activeImage.getAttribute('data-y'));
        } else {
            initialX = e.clientX - parseFloat(activeImage.getAttribute('data-x'));
            initialY = e.clientY - parseFloat(activeImage.getAttribute('data-y'));
        }

        if (e.target === activeImage || e.target.closest('.draggable-image')) {
            isDragging = true;
            activeImage.classList.add('dragging');
            activeImage.style.zIndex = getHighestZIndex() + 1;
        }
    }

    function dragEnd() {
        if (!activeImage) return;
        
        initialX = currentX;
        initialY = currentY;
        
        activeImage.setAttribute('data-x', currentX);
        activeImage.setAttribute('data-y', currentY);
        
        isDragging = false;
        activeImage.classList.remove('dragging');
        activeImage = null;
    }

    function drag(e) {
        if (isDragging && activeImage) {
            e.preventDefault();

            if (e.type === "touchmove") {
                currentX = e.touches[0].clientX - initialX;
                currentY = e.touches[0].clientY - initialY;
            } else {
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
            }

            // Boundary checking
            currentX = Math.min(Math.max(currentX, 0), window.innerWidth - 300);
            currentY = Math.min(Math.max(currentY, 0), window.innerHeight - 200);

            setTranslate(currentX, currentY, activeImage);
        }
    }

    function setTranslate(xPos, yPos, el) {
        el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
    }

    function getHighestZIndex() {
        const images = document.querySelectorAll('.draggable-image');
        let highest = 10;
        images.forEach(img => {
            const zIndex = parseInt(window.getComputedStyle(img).zIndex);
            if (zIndex > highest) highest = zIndex;
        });
        return highest;
    }

    function resetAll() {
        // Add fade-out animation to all elements
        const elements = document.querySelectorAll('.draggable-image');
        elements.forEach(el => {
            el.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            el.style.opacity = '0';
            el.style.transform = 'scale(0.8)';
        });

        // Remove elements after animation
        setTimeout(() => {
            container.innerHTML = '';
            // Create a new initial element
            createDraggableElement();
        }, 300);
    }

    // Add new image button click handler
    addButton.addEventListener('click', createDraggableElement);

    // Reset button click handler
    resetButton.addEventListener('click', resetAll);

    // Touch events
    container.addEventListener('touchstart', dragStart, false);
    document.addEventListener('touchend', dragEnd, false);
    document.addEventListener('touchmove', drag, false);

    // Mouse events
    container.addEventListener('mousedown', dragStart, false);
    document.addEventListener('mouseup', dragEnd, false);
    document.addEventListener('mousemove', drag, false);

    // Create initial element
    createDraggableElement();
}); 