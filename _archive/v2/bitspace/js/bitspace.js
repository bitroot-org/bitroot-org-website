/**
 * Bitspace - Main JavaScript
 * Handles mobile menu and interactions
 */

(function() {
  'use strict';

  // DOM Elements
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const nav = document.querySelector('.nav');

  // ==========================================================================
  // Mobile Menu
  // ==========================================================================

  function toggleMobileMenu() {
    mobileMenuBtn.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  }

  function closeMobileMenu() {
    mobileMenuBtn.classList.remove('active');
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
  }

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
      closeMobileMenu();
    }
  });

  // Close on resize to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && mobileMenu.classList.contains('active')) {
      closeMobileMenu();
    }
  });

  // ==========================================================================
  // Smooth Scroll
  // ==========================================================================

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = nav ? nav.offsetHeight : 0;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Close mobile menu if open
        closeMobileMenu();
      }
    });
  });

  // ==========================================================================
  // Console Easter Egg
  // ==========================================================================

  console.log('%c[bit.space]', 'color: #3b82f6; font-size: 20px; font-weight: bold;');
  console.log('%cHere\'s your startup_', 'color: #888; font-size: 14px;');
  console.log('%c\nReady for liftoff? https://bitroot.org', 'color: #06b6d4;');

})();
