/* ============================================================
   NUTRIGENIX — ANIMATIONS.JS
   IntersectionObserver scroll reveals, counters, sliders, marquee
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initCounters();
  initTestimonialSlider();
  initAccordion();
  initProgressBars();
  initTabSwitcher();
});

/* ══════════════════════════════════════════
   SCROLL REVEAL — IntersectionObserver
   ══════════════════════════════════════════ */
function initScrollReveal() {
  const elements = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .reveal-scale'
  );
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}

/* ══════════════════════════════════════════
   ANIMATED COUNTERS
   ══════════════════════════════════════════ */
function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  const animateCounter = (el) => {
    const target   = parseFloat(el.dataset.counter);
    const suffix   = el.dataset.suffix || '';
    const prefix   = el.dataset.prefix || '';
    const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
    const duration = el.dataset.duration ? parseInt(el.dataset.duration) : 2000;
    const start    = performance.now();

    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value = target * easeOut(progress);
      el.textContent = prefix + value.toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

/* ══════════════════════════════════════════
   TESTIMONIAL SLIDER
   ══════════════════════════════════════════ */
function initTestimonialSlider() {
  const slider = document.getElementById('testimonials-track');
  const prevBtn = document.getElementById('slider-prev');
  const nextBtn = document.getElementById('slider-next');
  const dotsContainer = document.getElementById('slider-dots');
  if (!slider) return;

  const cards = Array.from(slider.children);
  if (!cards.length) return;

  let current = 0;
  let autoPlay;
  let cardsPerView = getCardsPerView();

  function getCardsPerView() {
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 640)  return 2;
    return 1;
  }

  const totalSlides = Math.max(1, cards.length - cardsPerView + 1);

  // Create dots
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('button');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }
  }

  function updateDots() {
    dotsContainer?.querySelectorAll('.dot').forEach((d, i) =>
      d.classList.toggle('active', i === current)
    );
  }

  function goTo(index) {
    current = Math.max(0, Math.min(index, totalSlides - 1));
    const cardWidth = cards[0].offsetWidth + 24; // 24 = gap
    slider.style.transform = `translateX(-${current * cardWidth}px)`;
    updateDots();
  }

  prevBtn?.addEventListener('click', () => { goTo(current - 1); resetAutoPlay(); });
  nextBtn?.addEventListener('click', () => { goTo(current + 1); resetAutoPlay(); });

  function startAutoPlay() {
    autoPlay = setInterval(() => {
      goTo(current >= totalSlides - 1 ? 0 : current + 1);
    }, 5000);
  }

  function resetAutoPlay() {
    clearInterval(autoPlay);
    startAutoPlay();
  }

  // Touch/swipe support
  let touchStartX = 0;
  slider.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  slider.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      goTo(diff > 0 ? current + 1 : current - 1);
      resetAutoPlay();
    }
  }, { passive: true });

  // Resize handler
  window.addEventListener('resize', () => {
    cardsPerView = getCardsPerView();
    goTo(0);
  });

  startAutoPlay();
  goTo(0);
}

/* ══════════════════════════════════════════
   ACCORDION / FAQ
   ══════════════════════════════════════════ */
function initAccordion() {
  document.querySelectorAll('.accordion-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item    = trigger.closest('.accordion-item');
      const content = item?.querySelector('.accordion-content');
      const isOpen  = trigger.getAttribute('aria-expanded') === 'true';

      // Close all (single open) within same accordion
      const accordion = item?.closest('.accordion');
      accordion?.querySelectorAll('.accordion-trigger').forEach(t => {
        if (t !== trigger) {
          t.setAttribute('aria-expanded', 'false');
          t.closest('.accordion-item')
            ?.querySelector('.accordion-content')
            ?.classList.remove('open');
        }
      });

      // Toggle current
      trigger.setAttribute('aria-expanded', !isOpen);
      content?.classList.toggle('open', !isOpen);
    });
  });
}

/* ══════════════════════════════════════════
   PROGRESS BARS — animate on scroll
   ══════════════════════════════════════════ */
function initProgressBars() {
  const bars = document.querySelectorAll('.progress-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
}

/* ══════════════════════════════════════════
   TAB SWITCHER (Services / Recipes)
   ══════════════════════════════════════════ */
function initTabSwitcher() {
  document.querySelectorAll('.tab-nav').forEach(nav => {
    const tabs = nav.querySelectorAll('[data-tab]');
    const container = nav.closest('[data-tabs-container]') || nav.nextElementSibling;

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Update active tab
        tabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        // Show matching panel
        const targetId = tab.dataset.tab;
        document.querySelectorAll('[data-tab-panel]').forEach(panel => {
          const isTarget = panel.dataset.tabPanel === targetId;
          panel.hidden = !isTarget;
          if (isTarget) {
            panel.style.animation = 'fadeInUp 0.35s ease';
          }
        });
      });
    });
  });
}

/* ══════════════════════════════════════════
   IMAGE LAZY LOAD
   ══════════════════════════════════════════ */
(function lazyLoadImages() {
  const images = document.querySelectorAll('img[data-src]');
  if (!images.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        if (img.dataset.srcset) img.srcset = img.dataset.srcset;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  }, { rootMargin: '200px' });

  images.forEach(img => observer.observe(img));
})();
