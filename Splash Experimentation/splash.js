document.addEventListener("DOMContentLoaded", function() {
    const splashScreen = document.getElementById('splash-screen');
    const animatedName = document.getElementById('animated-name');
    const mainContent = document.getElementById('main-content');

    // Simulate typing effect using setTimeout
    setTimeout(() => {
        animatedName.style.opacity = 1;
        animatedName.style.width = 'auto';
        animatedName.style.borderRight = 'none';

        // After typing, trigger the fall animation
        setTimeout(() => {
            animatedName.style.animation = "fall 1.5s forwards ease-out";

            // Once the fall finishes, hide the splash screen
            setTimeout(() => {
                splashScreen.classList.add('hidden');
                mainContent.style.display = 'block';
            }, 1500); // Time to wait until the text falls
        }, 2000); // Delay before the fall begins (after typing is done)
    }, 500); // Delay before typing begins
});
