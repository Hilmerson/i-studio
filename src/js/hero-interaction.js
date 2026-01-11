import gsap from 'gsap';

export function initHeroInteraction() {
    const heroSection = document.querySelector('.hero');
    const blueprintLayer = document.querySelector('#hero-blueprint');

    if (!heroSection || !blueprintLayer) return;

    // Initial Text Animation
    const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 1.2 } });

    tl.to('.hero h1', { opacity: 1, y: 0, delay: 0.2 })
        .to('.hero-subtitle', { opacity: 1, y: 0 }, "-=0.8");

    // Mouse Move Interaction
    // Optimization: Use CSS Variables for high-performance updates
    const radius = 250;

    // Set initial clip-path via CSS variable + fallback
    gsap.set(blueprintLayer, {
        clipPath: `circle(${radius}px at var(--x, 50%) var(--y, 50%))`
    });

    const xSet = gsap.quickSetter(blueprintLayer, "--x", "px");
    const ySet = gsap.quickSetter(blueprintLayer, "--y", "px");

    const onMouseMove = (e) => {
        const rect = heroSection.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        xSet(x);
        ySet(y);
    };

    const onMouseLeave = () => {
        // Animate variables back to center
        gsap.to(blueprintLayer, {
            "--x": "50%",
            "--y": "50%",
            duration: 0.6,
            ease: "power2.inOut"
        });
    };

    heroSection.addEventListener('mousemove', onMouseMove);
    heroSection.addEventListener('mouseleave', onMouseLeave);

    // Mobile fallback
    if ('ontouchstart' in window) {
        gsap.to(blueprintLayer, {
            clipPath: `circle(${radius * 0.8}px at 50% 50%)`,
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }
}
