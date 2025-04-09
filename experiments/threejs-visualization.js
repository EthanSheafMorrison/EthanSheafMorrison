// Initialize Three.js scene
let scene, camera, renderer, controls;
let objects = [];
let rotationSpeed = 0.02;
let scale = 1;

function init() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8f8f8);

    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    // Add orbit controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Create geometry
    createGeometry();

    // Add event listeners
    window.addEventListener('resize', onWindowResize);
    document.getElementById('rotation-speed').addEventListener('input', updateRotationSpeed);
    document.getElementById('scale').addEventListener('input', updateScale);

    // Start animation loop
    animate();
}

function createGeometry() {
    // Clear existing objects
    objects.forEach(obj => scene.remove(obj));
    objects = [];

    // Create a group of geometric shapes
    const geometryTypes = [
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.SphereGeometry(0.7, 32, 32),
        new THREE.ConeGeometry(0.5, 1, 32)
    ];

    const materials = [
        new THREE.MeshPhongMaterial({ color: 0x2196f3, transparent: true, opacity: 0.8 }),
        new THREE.MeshPhongMaterial({ color: 0x4caf50, transparent: true, opacity: 0.8 }),
        new THREE.MeshPhongMaterial({ color: 0xff9800, transparent: true, opacity: 0.8 })
    ];

    geometryTypes.forEach((geometry, index) => {
        const material = materials[index];
        const mesh = new THREE.Mesh(geometry, material);
        
        // Position the shapes in a circle
        const angle = (index / geometryTypes.length) * Math.PI * 2;
        mesh.position.x = Math.cos(angle) * 2;
        mesh.position.z = Math.sin(angle) * 2;
        
        scene.add(mesh);
        objects.push(mesh);
    });
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function updateRotationSpeed(e) {
    rotationSpeed = parseFloat(e.target.value);
}

function updateScale(e) {
    scale = parseFloat(e.target.value);
    objects.forEach(obj => {
        obj.scale.set(scale, scale, scale);
    });
}

function animate() {
    requestAnimationFrame(animate);

    // Rotate objects
    objects.forEach(obj => {
        obj.rotation.x += rotationSpeed;
        obj.rotation.y += rotationSpeed;
    });

    controls.update();
    renderer.render(scene, camera);
}

// Initialize the scene when the page loads
window.addEventListener('load', init); 