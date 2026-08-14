/**
 * CBR Model School — Main JavaScript
 * Vanilla JS only — no frameworks or jQuery
 */

(function () {
  'use strict';

  /* --------------------------------------------------------------------------
     DOM References
     -------------------------------------------------------------------------- */
  const header = document.querySelector('.site-header');
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const hero = document.querySelector('.hero');
  const heroBg = document.querySelector('.hero__background');
  const lazyImages = document.querySelectorAll('img[data-src]');
  const statNumbers = document.querySelectorAll('[data-count]');

  /* --------------------------------------------------------------------------
     1. Mobile Menu Toggle
     Opens/closes navigation and animates hamburger to X
     -------------------------------------------------------------------------- */
  function initMobileMenu() {
    if (!navToggle || !navMenu) return;

    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('is-open');
      navToggle.classList.toggle('is-active', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.classList.toggle('nav-open', isOpen);
    });

    // Close menu when a link is clicked (mobile)
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('is-open');
        navToggle.classList.remove('is-active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-open');
      });
    });
  }

  /* --------------------------------------------------------------------------
     2. Navbar Background on Scroll
     Adds 'scrolled' class after 50px for backdrop blur and shadow
     -------------------------------------------------------------------------- */
  function initNavbarScroll() {
    if (!header) return;

    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 50);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* --------------------------------------------------------------------------
     3. Smooth Scroll to Anchor Links
     Offsets for sticky header height
     -------------------------------------------------------------------------- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (event) => {
        const targetId = anchor.getAttribute('href');
        if (!targetId || targetId === '#') return;

        const target = document.querySelector(targetId);
        if (!target) return;

        event.preventDefault();

        const headerOffset = header ? header.offsetHeight : 0;
        const top =
          target.getBoundingClientRect().top + window.scrollY - headerOffset;

        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  }

  /* --------------------------------------------------------------------------
     4. Parallax Hero Effect
     Background moves slower than scroll for subtle depth
     -------------------------------------------------------------------------- */
  function initParallax() {
    if (!heroBg || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const onScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = hero ? hero.offsetHeight : 0;

      if (scrollY <= heroHeight) {
        heroBg.style.transform = `translateY(${scrollY * 0.35}px)`;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* --------------------------------------------------------------------------
     5. Lazy Load Images
     Loads data-src when image enters viewport
     -------------------------------------------------------------------------- */
  function initLazyLoad() {
    if (!lazyImages.length) return;

    const loadImage = (img) => {
      const src = img.getAttribute('data-src');
      if (!src) return;

      img.src = src;
      img.removeAttribute('data-src');
      img.classList.add('is-loaded');
    };

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              loadImage(entry.target);
              obs.unobserve(entry.target);
            }
          });
        },
        { rootMargin: '100px' }
      );

      lazyImages.forEach((img) => observer.observe(img));
    } else {
      lazyImages.forEach(loadImage);
    }
  }

  /* --------------------------------------------------------------------------
     6. Active Link Highlighting
     Highlights nav link matching current scroll section
     -------------------------------------------------------------------------- */
  function initActiveNav() {
    const sections = document.querySelectorAll('main section[id]');
    if (!sections.length || !navLinks.length) return;

    const sectionMap = Array.from(sections).map((section) => ({
      id: section.id,
      element: section,
    }));

    const onScroll = () => {
      const scrollPos = window.scrollY + (header ? header.offsetHeight + 20 : 80);
      let currentId = sectionMap[0]?.id;

      sectionMap.forEach(({ id, element }) => {
        if (element.offsetTop <= scrollPos) {
          currentId = id;
        }
      });

      navLinks.forEach((link) => {
        const href = link.getAttribute('href');
        link.classList.toggle('is-active', href === `#${currentId}`);
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* --------------------------------------------------------------------------
     7. Stats Counter Animation
     Counts up from 0 when stat enters viewport
     -------------------------------------------------------------------------- */
  function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'), 10);
    const suffix = element.getAttribute('data-suffix') || '';
    const prefix = element.getAttribute('data-prefix') || '';
    const duration = 1500;
    const startTime = performance.now();

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(eased * target);

      element.textContent = `${prefix}${value}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        element.textContent = `${prefix}${target}${suffix}`;
      }
    };

    requestAnimationFrame(step);
  }

  function initStatsCounter() {
    if (!statNumbers.length) return;

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateCounter(entry.target);
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );

      statNumbers.forEach((stat) => observer.observe(stat));
    } else {
      statNumbers.forEach(animateCounter);
    }
  }

  /* --------------------------------------------------------------------------
     Initialize All Modules
     -------------------------------------------------------------------------- */
  function init() {
    initMobileMenu();
    initNavbarScroll();
    initSmoothScroll();
    initParallax();
    initLazyLoad();
    initActiveNav();
    initStatsCounter();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
