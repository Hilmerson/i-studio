// Gallery Data (In a real app, this would be fetched from an API or JSON)
const projects = {
    'sky-park': {
        title: 'Rezidencia Sky Park',
        images: [
            '/src/assets/images/kuchyne_hero.png',
            '/src/assets/images/podlahy_hero.png',
            '/src/assets/images/skrine_hero.png'
        ]
    },
    'vila-stupava': {
        title: 'Vila Stupava',
        images: [
            '/src/assets/images/skrine_hero.png',
            '/src/assets/images/dvere_hero.png',
            '/src/assets/images/hero.png'
        ]
    },
    'apt-karlova': {
        title: 'Apartmán Karlova Ves',
        images: [
            '/src/assets/images/podlahy_hero.png',
            '/src/assets/images/kuchyne_hero.png',
            '/src/assets/images/dvere_hero.png'
        ]
    },
    'penthouse-koliba': {
        title: 'Penthouse Koliba',
        images: [
            '/src/assets/images/dvere_hero.png',
            '/src/assets/images/hero.png',
            '/src/assets/images/skrine_hero.png'
        ]
    }
};

let currentImages = [];
let currentIndex = 0;
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxTitle = document.getElementById('lightbox-title');
const lightboxCounter = document.getElementById('lightbox-counter');

// Global functions for inline onclick handlers in HTML
window.openGallery = function (projectId) {
    const project = projects[projectId];
    if (!project) return;

    currentImages = project.images;
    currentIndex = 0;

    updateLightbox();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
};

window.closeGallery = function () {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
};

window.nextImage = function (e) {
    if (e) e.stopPropagation();
    currentIndex = (currentIndex + 1) % currentImages.length;
    updateLightbox();
};

window.prevImage = function (e) {
    if (e) e.stopPropagation();
    currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
    updateLightbox();
};

function updateLightbox() {
    lightboxImg.src = currentImages[currentIndex];
    lightboxCounter.textContent = `${currentIndex + 1} / ${currentImages.length}`;

    // Find title from current project
    // We could store currentTitle globally too, but for now we set it on open
    // Ideally we pass title to openGallery or store currentProject key

    // Simple way: re-find project key if needed, or just set title once. 
    // Wait, updateLightbox is called on nav. The title doesn't change on nav. 
    // Setting title happens in openGallery.
}

// Set title in openGallery
const _originalOpen = window.openGallery;
window.openGallery = function (projectId) {
    const project = projects[projectId];
    if (!project) return;

    lightboxTitle.textContent = project.title;
    _originalOpen(projectId);
};

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') window.closeGallery();
    if (e.key === 'ArrowRight') window.nextImage();
    if (e.key === 'ArrowLeft') window.prevImage();
});

// Close on background click
if (lightbox) {
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
            window.closeGallery();
        }
    });
}
