import gsap from 'gsap';
import heroImg from '../assets/images/hero.png';

export function initScrollAnimations() {
    // Existing Observer Logic...
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateElement(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const targets = document.querySelectorAll('.service-item, .category-block, .services-intro, .footer-col');
    targets.forEach(target => {
        gsap.set(target, { opacity: 0, y: 50 });
        observer.observe(target);
    });

    function animateElement(element) {
        gsap.to(element, { opacity: 1, y: 0, duration: 1, ease: "power3.out" });
    }
}

export function initHeroEntrance() {
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    // Initial states set in CSS or here
    // But let's set them here to be safe
    gsap.set(".hero-headline > div", { y: 100, opacity: 0 });
    gsap.set(".value-prop-sticker", { scale: 0, rotation: -90 });
    gsap.set(".hero-visuals", { y: 50, opacity: 0 });
    gsap.set(".pill-media", { scale: 0 });

    tl.to(".hero-headline > div", {
        y: 0,
        opacity: 1,
        duration: 1.5,
        stagger: 0.2
    })
        .to(".pill-media", {
            scale: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "back.out(1.7)"
        }, "-=1.0")
        .to(".value-prop-sticker", {
            scale: 1,
            rotation: 15,
            duration: 1,
            ease: "elastic.out(1, 0.5)"
        }, "-=0.8")
        .to(".hero-visuals", {
            y: 0,
            opacity: 1,
            duration: 1
        }, "-=0.6");
}

export function initCursorParallax() {
    const sticker = document.querySelector(".value-prop-sticker");
    const visualLarge = document.querySelector(".visual-large");

    // Performance: If elements don't exist, don't run listeners
    if (!sticker && !visualLarge) return;

    // Use quickTo for high performance (no garbage collection)
    const xModelSticker = sticker ? gsap.quickTo(sticker, "x", { duration: 1.5, ease: "power2.out" }) : null;
    const yModelSticker = sticker ? gsap.quickTo(sticker, "y", { duration: 1.5, ease: "power2.out" }) : null;

    // Restore 3D Perspective settings for Tilt
    if (visualLarge) {
        gsap.set(visualLarge, {
            transformPerspective: 1000,
            transformOrigin: "center center"
        });
    }

    const rotYModel = visualLarge ? gsap.quickTo(visualLarge, "rotationY", { duration: 1, ease: "power2.out" }) : null;
    const rotXModel = visualLarge ? gsap.quickTo(visualLarge, "rotationX", { duration: 1, ease: "power2.out" }) : null;

    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;

        // Only animate if element exists
        if (xModelSticker && yModelSticker) {
            xModelSticker(mouseX * 30);
            yModelSticker(mouseY * 30);
        }

        if (rotYModel && rotXModel) {
            rotYModel(mouseX * 10);
            rotXModel(-mouseY * 10);
        }
    });

    document.addEventListener('mouseleave', () => {
        if (xModelSticker && yModelSticker) {
            xModelSticker(0);
            yModelSticker(0);
        }
        if (rotYModel && rotXModel) {
            rotYModel(0);
            rotXModel(0);
        }
    });
}

export function initHoverReveal() {
    const previewContainer = document.querySelector('.services-preview');
    const items = document.querySelectorAll('.service-item');
    const images = document.querySelectorAll('.service-preview-img');

    if (!previewContainer || items.length === 0 || images.length === 0) return;

    // Ensure first image is visible
    gsap.set(images, { opacity: 0, zIndex: 1 });
    gsap.set(images[0], { opacity: 1, zIndex: 2 });

    let activeIndex = 0;

    items.forEach((item, index) => {
        item.addEventListener('mouseenter', () => {
            if (index === activeIndex) return;

            const outgoing = images[activeIndex];
            const incoming = images[index];

            if (!incoming) return; // Safety check

            activeIndex = index;

            // Animate
            const tl = gsap.timeline();

            // Incoming: Fade In and Scale Down slightly for focus
            gsap.set(incoming, { zIndex: 3, scale: 1.1 }); // Start slightly zoomed
            tl.to(incoming, {
                opacity: 1,
                scale: 1,
                duration: 0.4,
                ease: "power2.out"
            });

            // Outgoing: Fade Out and Blur
            // Note: We use a separate tween for outgoing so it happens simultaneously
            gsap.to(outgoing, {
                opacity: 0,
                duration: 0.4,
                delay: 0, // No delay for instant response
                zIndex: 1,
                ease: "power2.out"
            });
        });
    });
}
