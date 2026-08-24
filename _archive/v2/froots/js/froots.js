/**
 * Bitroot Labs - Main JavaScript
 * Handles mobile menu, filters, and interactions
 */

(function() {
  'use strict';

  // DOM Elements
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const filterTabs = document.querySelectorAll('.filter-tab');
  const projectCards = document.querySelectorAll('.project-card');
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
  // Filter Tabs
  // ==========================================================================

  function filterProjects(filter) {
    projectCards.forEach(card => {
      const category = card.dataset.category;

      if (filter === 'all' || category === filter) {
        card.classList.remove('hidden');
        card.style.display = '';
      } else {
        card.classList.add('hidden');
        card.style.display = 'none';
      }
    });
  }

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Update active state
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Filter projects
      const filter = tab.dataset.filter;
      filterProjects(filter);
    });
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
  // Typing Effect for Hero (optional enhancement)
  // ==========================================================================

  function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';

    function type() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    }

    type();
  }

  // ==========================================================================
  // Console Easter Egg
  // ==========================================================================

  console.log('%c[bitroot.froots]', 'color: #00ff88; font-size: 20px; font-weight: bold;');
  console.log('%cWhat we make, the world gets_', 'color: #888; font-size: 14px;');
  console.log('%c\nWant to grow a froot? https://github.com/bitroot-org', 'color: #00ccff;');

})();
