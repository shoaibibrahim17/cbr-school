/**
 * C.B.R Model School — Premium Site JavaScript
 * Vanilla JS only — no frameworks
 */

(function () {
  'use strict';

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  /* --------------------------------------------------------------------------
     1. Mobile menu
     -------------------------------------------------------------------------- */
  function initMobileMenu() {
    const toggle = $('.nav-toggle');
    const menu = $('.nav-menu');
    if (!toggle || !menu) return;

    const close = () => {
      menu.classList.remove('is-open');
      toggle.classList.remove('is-active');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-open');
    };

    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('is-open');
      toggle.classList.toggle('is-active', open);
      toggle.setAttribute('aria-expanded', String(open));
      document.body.classList.toggle('nav-open', open);
    });

    $$('.nav-link', menu).forEach((link) => link.addEventListener('click', close));
  }

  /* --------------------------------------------------------------------------
     2. Header scroll state
     -------------------------------------------------------------------------- */
  function initHeaderScroll() {
    const header = $('.site-header');
    if (!header) return;

    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* --------------------------------------------------------------------------
     3. Smooth scroll for in-page anchors
     -------------------------------------------------------------------------- */
  function initSmoothScroll() {
    const header = $('.site-header');
    $$('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const id = anchor.getAttribute('href');
        if (!id || id === '#') return;
        const target = $(id);
        if (!target) return;

        e.preventDefault();
        const offset = header ? header.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - offset - 10;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  }

  /* --------------------------------------------------------------------------
     4. Reveal-on-scroll
     -------------------------------------------------------------------------- */
  function initReveal() {
    const items = $$('.reveal');
    if (!items.length) return;

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
      );
      items.forEach((el) => io.observe(el));
    } else {
      items.forEach((el) => el.classList.add('is-visible'));
    }
  }

  /* --------------------------------------------------------------------------
     5. Animated counters
     -------------------------------------------------------------------------- */
  function animateCounter(el) {
    const target = parseFloat(el.getAttribute('data-count'));
    const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1800;
    const start = performance.now();

    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const value = (target * eased).toFixed(decimals);
      el.textContent = `${value}${suffix}`;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = `${target.toFixed(decimals)}${suffix}`;
    };

    requestAnimationFrame(step);
  }

  function initCounters() {
    const nums = $$('[data-count]');
    if (!nums.length) return;

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateCounter(entry.target);
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.4 }
      );
      nums.forEach((n) => io.observe(n));
    } else {
      nums.forEach(animateCounter);
    }
  }

  /* --------------------------------------------------------------------------
     6. Testimonial slider
     -------------------------------------------------------------------------- */
  function initTestimonials() {
    const cards = $$('.testimonial-card');
    const dotsWrap = $('.testimonial-nav');
    if (!cards.length) return;

    let current = 0;
    let timer = null;

    const show = (i) => {
      cards[current].classList.remove('is-active');
      dots[current].classList.remove('is-active');
      current = (i + cards.length) % cards.length;
      cards[current].classList.add('is-active');
      dots[current].classList.add('is-active');
    };

    const dots = cards.map((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'testimonial-dot' + (i === 0 ? ' is-active' : '');
      dot.setAttribute('aria-label', `Show testimonial ${i + 1}`);
      dot.addEventListener('click', () => {
        show(i);
        restart();
      });
      dotsWrap.appendChild(dot);
      return dot;
    });

    const restart = () => {
      clearInterval(timer);
      timer = setInterval(() => show(current + 1), 6000);
    };

    restart();
  }

  /* --------------------------------------------------------------------------
     7. Accordions
     -------------------------------------------------------------------------- */
  function initAccordions() {
    $$('.acc-item').forEach((item) => {
      const head = $('.acc-head', item);
      const body = $('.acc-body', item);
      if (!head || !body) return;

      head.addEventListener('click', () => {
        const open = item.classList.toggle('is-open');
        body.style.maxHeight = open ? body.scrollHeight + 'px' : '0px';
      });
    });
  }

  /* --------------------------------------------------------------------------
     8. Gallery lightbox
     -------------------------------------------------------------------------- */
  function initLightbox() {
    const items = $$('.g-item');
    const lb = $('.lightbox');
    if (!items.length || !lb) return;

    const img = $('.lightbox img', lb);
    const cap = $('.lightbox__caption', lb);
    const closeBtn = $('.lightbox__close', lb);
    const prevBtn = $('.lightbox__nav--prev', lb);
    const nextBtn = $('.lightbox__nav--next', lb);
    let index = 0;

    const show = (i) => {
      index = (i + items.length) % items.length;
      const src = $('img', items[index]).src;
      const alt = $('img', items[index]).alt;
      img.src = src;
      img.alt = alt;
      if (cap) cap.textContent = alt;
    };

    const open = (i) => {
      show(i);
      lb.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    };

    const close = () => {
      lb.classList.remove('is-open');
      document.body.style.overflow = '';
    };

    items.forEach((item, i) => item.addEventListener('click', () => open(i)));
    closeBtn.addEventListener('click', close);
    prevBtn.addEventListener('click', () => show(index - 1));
    nextBtn.addEventListener('click', () => show(index + 1));
    lb.addEventListener('click', (e) => {
      if (e.target === lb) close();
    });
    document.addEventListener('keydown', (e) => {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(index - 1);
      if (e.key === 'ArrowRight') show(index + 1);
    });
  }

  /* --------------------------------------------------------------------------
     9. Contact form (demo submission)
     -------------------------------------------------------------------------- */
  function initContactForm() {
    const form = $('.contact-form form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const success = $('.form-success', form);
      if (success) success.classList.add('is-visible');
      form.reset();
      setTimeout(() => success && success.classList.remove('is-visible'), 6000);
    });
  }

  /* --------------------------------------------------------------------------
     10. Footer year
     -------------------------------------------------------------------------- */
  function initYear() {
    $$('.js-year').forEach((el) => {
      el.textContent = new Date().getFullYear();
    });
  }

  /* --------------------------------------------------------------------------
     Init
     -------------------------------------------------------------------------- */
  function init() {
    initMobileMenu();
    initHeaderScroll();
    initSmoothScroll();
    initReveal();
    initCounters();
    initTestimonials();
    initAccordions();
    initLightbox();
    initContactForm();
    initYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
