import './css/global.css';
import './css/layout.css'; /* Added styling for Header/Footer */
import './css/hero-industrial.css';
import './css/sections.css';
import './css/glass.css'; /* Enabled for premium glass look */

// Prevent FOUC (Flash of Unstyled Content) by revealing body after CSS logic loads
document.body.style.opacity = '1';

// Image imports are now handled via static HTML paths in index.html
// This file now focuses purely on behavior and initialization

// Calculate Years of Practice
const startYear = 2007;
const currentYear = new Date().getFullYear();
const yearsOfPractice = currentYear - startYear;
const yearsEl = document.getElementById('years-count');
if (yearsEl) {
  yearsEl.textContent = yearsOfPractice;
}

// Initialize Lenis Smooth Scroll
import Lenis from 'lenis';

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

// Sticky Header Logic
const header = document.querySelector('.main-header');
// Safety check if header exists (it should now be in index.html)
if (header) {
  lenis.on('scroll', ({ scroll }) => {
    if (scroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

import { initScrollAnimations, initHeroEntrance, initCursorParallax, initHoverReveal } from './js/animations.js';

// Add Noise Overlay
const noise = document.createElement('div');
noise.className = 'noise-overlay';
document.body.appendChild(noise);

// Mobile Menu Toggle
// We need to wait for DOM parsing, but since this is module type, it defers automatically.
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mainNav = document.querySelector('.main-nav');

if (mobileMenuBtn && mainNav) {
  mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    mainNav.classList.toggle('mobile-active');
    // Prevent body scroll when menu is open
    document.body.style.overflow = mainNav.classList.contains('mobile-active') ? 'hidden' : '';
  });

  // Close menu when clicking a link
  const navLinks = mainNav.querySelectorAll('a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenuBtn.classList.remove('active');
      mainNav.classList.remove('mobile-active');
      document.body.style.overflow = '';
    });
  });
}

// Animations Init
initScrollAnimations();
initCursorParallax();
initHoverReveal();

// Direct Hero Entrance (No Preloader)
initHeroEntrance();
