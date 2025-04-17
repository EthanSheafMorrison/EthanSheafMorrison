// Cloth simulation using Three.js
// Global variables
let clothScene, clothCamera, clothRenderer;
let cloth, clothGeometry;
let particles = [];
let constraints = [];
let isMouseDown = false;
let windEnabled = true;
let colorIndex = 0;

// Initialize cloth simulation after the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Short delay to ensure all resources are loaded
    setTimeout(initClothSimulation, 500);
});

// Main cloth simulation initialization function
function initClothSimulation() {
    console.log("Initializing cloth simulation...");
    const clothOverlay = document.getElementById('cloth-overlay');
    
    if (!clothOverlay) {
        console.error("Cloth overlay element not found!");
        return;
    }
    
    // Constants for simulation
    const CLOTH_SIZE = 80;
    const DAMPING = 0.03;
    const DRAG = 1 - DAMPING;
    const MASS = 0.1;
    const restDistance = 2;
    
    // Create cloth particles grid
    function createParticles() {
        particles = [];
        constraints = [];
        
        const u = 20, v = 15; // Resolution of cloth grid
        
        // Create particles in a grid
        for (let i = 0; i <= u; i++) {
            for (let j = 0; j <= v; j++) {
                const x = (i / u - 0.5) * CLOTH_SIZE;
                const y = (j / v + 0.5) * CLOTH_SIZE;
                const z = 0;
                
                particles.push({
                    position: new THREE.Vector3(x, y, z),
                    previous: new THREE.Vector3(x, y, z),
                    original: new THREE.Vector3(x, y, z),
                    mass: MASS,
                    locked: j === v, // Lock the top row of particles
                    velocity: new THREE.Vector3(0, 0, 0),
                    acceleration: new THREE.Vector3(0, 0, 0)
                });
            }
        }
        
        // Create constraints (connections) between particles
        for (let i = 0; i <= u; i++) {
            for (let j = 0; j <= v; j++) {
                if (i < u) {
                    constraints.push([
                        particles[index(i, j)],
                        particles[index(i + 1, j)],
                        restDistance
                    ]);
                }
                
                if (j < v) {
                    constraints.push([
                        particles[index(i, j)],
                        particles[index(i, j + 1)],
                        restDistance
                    ]);
                }
            }
        }
        
        // Helper function to get the particle index from grid coordinates
        function index(i, j) {
            return i * (v + 1) + j;
        }
    }
    
    // Initialize the three.js scene
    function init() {
        console.log("Setting up Three.js scene...");
        
        // Create scene with transparent background
        clothScene = new THREE.Scene();
        clothScene.background = null;
        
        // Camera setup
        clothCamera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
        clothCamera.position.set(0, -5, 60);
        
        // Renderer with transparency
        clothRenderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true 
        });
        clothRenderer.setSize(window.innerWidth, window.innerHeight);
        clothRenderer.setClearColor(0x000000, 0);
        
        // Clear any existing canvas
        while (clothOverlay.firstChild) {
            clothOverlay.removeChild(clothOverlay.firstChild);
        }
        
        // Add renderer to the DOM
        clothOverlay.appendChild(clothRenderer.domElement);
        
        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        clothScene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(0, 10, 50);
        clothScene.add(directionalLight);
        
        // Create the cloth particles
        createParticles();
        
        // Create cloth geometry
        clothGeometry = new THREE.PlaneGeometry(CLOTH_SIZE, CLOTH_SIZE, 20, 15);
        
        // Available colors for the cloth
        const clothColors = [0xff0000, 0x00ff2f, 0xffffff];
        
        // Create cloth material
        const clothMaterial = new THREE.MeshPhongMaterial({
            color: clothColors[colorIndex],
            side: THREE.DoubleSide,
            wireframe: true,
            specular: 0x111111,
            shininess: 50,
            transparent: true,
            opacity: 0.7
        });
        
        // Create cloth mesh and add to scene
        cloth = new THREE.Mesh(clothGeometry, clothMaterial);
        clothScene.add(cloth);
        
        // Setup event listeners
        document.addEventListener('mousemove', onMouseMove);
        window.addEventListener('resize', onWindowResize);
        document.addEventListener('mousedown', onMouseDown);
        document.addEventListener('mouseup', onMouseUp);
        
        // Setup control buttons
        setupControlButtons(clothColors);
        
        console.log("Three.js scene initialized");
    }
    
    // Setup the control buttons
    function setupControlButtons(clothColors) {
        console.log("Setting up control buttons...");
        
        const resetBtn = document.getElementById('reset-cloth');
        const windBtn = document.getElementById('toggle-wind');
        const wireframeBtn = document.getElementById('toggle-wireframe');
        const colorBtn = document.getElementById('change-color');
        const toggleBtn = document.getElementById('toggle-cloth');
        
        // Reset button - restore original cloth position
        if (resetBtn) {
            resetBtn.addEventListener('click', function() {
                console.log("Resetting cloth...");
                
                for (let i = 0; i < particles.length; i++) {
                    const particle = particles[i];
                    particle.position.copy(particle.original);
                    particle.previous.copy(particle.original);
                    particle.velocity.set(0, 0, 0);
                    particle.acceleration.set(0, 0, 0);
                }
            });
        }
        
        // Wind toggle button
        if (windBtn) {
            windBtn.addEventListener('click', function() {
                windEnabled = !windEnabled;
                windBtn.textContent = windEnabled ? 'Disable Wind' : 'Enable Wind';
                console.log("Wind " + (windEnabled ? "enabled" : "disabled"));
            });
        }
        
        // Wireframe toggle button
        if (wireframeBtn) {
            wireframeBtn.addEventListener('click', function() {
                cloth.material.wireframe = !cloth.material.wireframe;
                console.log("Wireframe " + (cloth.material.wireframe ? "enabled" : "disabled"));
            });
        }
        
        // Color change button
        if (colorBtn) {
            colorBtn.addEventListener('click', function() {
                colorIndex = (colorIndex + 1) % clothColors.length;
                cloth.material.color.setHex(clothColors[colorIndex]);
                console.log("Changed cloth color");
            });
        }
        
        // Toggle visibility button
        if (toggleBtn) {
            toggleBtn.addEventListener('click', function() {
                const isVisible = clothOverlay.style.display !== 'none';
                clothOverlay.style.display = isVisible ? 'none' : 'block';
                toggleBtn.textContent = isVisible ? 'Show Cloth' : 'Hide Cloth';
                console.log("Cloth visibility " + (!isVisible ? "enabled" : "disabled"));
            });
        }
    }
    
    // Physics simulation step
    function simulate() {
        // Gravity force
        const gravity = new THREE.Vector3(0, -0.1, 0);
        
        // Wind effect with time variation
        const windStrength = Math.cos(Date.now() / 7000) * 0.3;
        const wind = new THREE.Vector3(
            Math.sin(Date.now() / 2000), 
            Math.cos(Date.now() / 3000), 
            Math.sin(Date.now() / 1000)
        );
        wind.normalize().multiplyScalar(windStrength);
        
        // Update particles with physics
        for (let i = 0; i < particles.length; i++) {
            const particle = particles[i];
            
            if (!particle.locked) {
                // Reset acceleration and add gravity
                particle.acceleration.copy(gravity);
                
                // Add wind if enabled
                if (windEnabled) {
                    particle.acceleration.add(wind);
                }
                
                particle.acceleration.multiplyScalar(particle.mass);
                
                // Verlet integration for physics
                const temp = new THREE.Vector3().copy(particle.position);
                particle.position.addScaledVector(particle.velocity, 1);
                particle.velocity.multiplyScalar(DRAG);
                particle.velocity.addScaledVector(particle.acceleration, 1);
                particle.previous.copy(temp);
            }
        }
        
        // Satisfy constraints between particles
        for (let i = 0; i < constraints.length; i++) {
            const [p1, p2, distance] = constraints[i];
            const currentDist = p1.position.distanceTo(p2.position);
            const correction = currentDist - distance;
            
            // Direction from p1 to p2
            const correctionVector = new THREE.Vector3().subVectors(p2.position, p1.position);
            correctionVector.normalize().multiplyScalar(correction * 0.5);
            
            // Apply constraint correction
            if (!p1.locked) {
                p1.position.add(correctionVector);
            }
            if (!p2.locked) {
                p2.position.sub(correctionVector);
            }
        }
        
        // Update cloth geometry with new particle positions
        const positions = clothGeometry.attributes.position.array;
        
        for (let i = 0, j = 0; i < particles.length; i++, j += 3) {
            positions[j] = particles[i].position.x;
            positions[j + 1] = particles[i].position.y;
            positions[j + 2] = particles[i].position.z;
        }
        
        clothGeometry.attributes.position.needsUpdate = true;
        clothGeometry.computeVertexNormals();
    }
    
    // Mouse interaction
    const mouse = new THREE.Vector3();
    const lastMouse = new THREE.Vector3();
    
    function onMouseMove(event) {
        // Convert mouse position to normalized device coordinates
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        // Apply forces to cloth based on mouse movement when dragging
        if (isMouseDown) {
            const mouseForce = new THREE.Vector3()
                .subVectors(mouse, lastMouse)
                .multiplyScalar(2);
            
            for (let i = 0; i < particles.length; i++) {
                const particle = particles[i];
                if (!particle.locked) {
                    // Apply force based on distance from mouse
                    const distance = new THREE.Vector3()
                        .copy(mouse)
                        .sub(particle.position)
                        .length();
                    
                    if (distance < 10) {
                        particle.velocity.add(mouseForce);
                    }
                }
            }
        }
        
        lastMouse.copy(mouse);
    }
    
    function onMouseDown() {
        isMouseDown = true;
        clothOverlay.style.pointerEvents = 'auto';
    }
    
    function onMouseUp() {
        isMouseDown = false;
        clothOverlay.style.pointerEvents = 'none';
    }
    
    // Handle window resize
    function onWindowResize() {
        clothCamera.aspect = window.innerWidth / window.innerHeight;
        clothCamera.updateProjectionMatrix();
        clothRenderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        simulate();
        clothRenderer.render(clothScene, clothCamera);
    }
    
    // Start everything
    init();
    animate();
    console.log("Cloth simulation running");
} 