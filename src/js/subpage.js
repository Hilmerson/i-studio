import '../css/global.css';
import '../css/layout.css';
import '../css/subpages.css'; /* New styles */
import '../css/glass.css';

// Prevent FOUC
document.body.style.opacity = '1';

// Shared Logic Imports
import Lenis from 'lenis';

// Smooth Scroll
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Sticky Header
const header = document.querySelector('.main-header');
if (header) {
    lenis.on('scroll', ({ scroll }) => {
        if (scroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Mobile Menu
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mainNav = document.querySelector('.main-nav');

if (mobileMenuBtn && mainNav) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        mainNav.classList.toggle('mobile-active');
        document.body.style.overflow = mainNav.classList.contains('mobile-active') ? 'hidden' : '';
    });
}

// Import ONLY relevant animations
// Parallax for Editorial Hero
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const heroImg = document.querySelector('.hero-bg-container img');
if (heroImg) {
    gsap.to(heroImg, {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
            trigger: '.editorial-hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    });
}
const heroText = document.querySelector('.hero-title-container');
if (heroText) {
    gsap.to(heroText, {
        yPercent: -50, // Move text up faster
        ease: 'none',
        scrollTrigger: {
            trigger: '.editorial-hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    });
}
