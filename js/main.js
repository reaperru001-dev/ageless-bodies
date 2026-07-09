/* ============================================================
   NUTRIGENIX — MAIN.JS
   Global: Nav, Mobile Menu, WhatsApp, Sticky CTA, Cookie
   ============================================================ */

'use strict';

// ── DOM Ready ──
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initWhatsApp();
  initBackToTop();
  initStickyCTA();
  initCookieBanner();
  initSmoothScroll();
  initDropdowns();
});

/* ══════════════════════════════════════════
   NAVBAR — Transparent → Frosted on scroll
   ══════════════════════════════════════════ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run on load
}

/* ══════════════════════════════════════════
   MOBILE MENU
   ══════════════════════════════════════════ */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];

  if (!hamburger || !mobileMenu) return;

  const toggle = () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  hamburger.addEventListener('click', toggle);

  // Close on link click
  mobileLinks.forEach(link => link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }));

  // Close on outside click
  mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) toggle();
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) toggle();
  });
}

/* ══════════════════════════════════════════
   WHATSAPP FLOATING BUTTON
   ══════════════════════════════════════════ */
function initWhatsApp() {
  // WhatsApp button is rendered in HTML; this sets up the click handler
  const whatsappBtn = document.getElementById('whatsapp-float-btn');
  if (!whatsappBtn) return;

  const phone = whatsappBtn.dataset.phone || '911234567890';
  const message = encodeURIComponent(
    'Hello! I\'m interested in a personalized nutrition consultation. Please share more details.'
  );

  whatsappBtn.addEventListener('click', () => {
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank', 'noopener,noreferrer');
  });
}

/* ══════════════════════════════════════════
   BACK TO TOP
   ══════════════════════════════════════════ */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ══════════════════════════════════════════
   STICKY CONSULTATION CTA BAR (bottom)
   ══════════════════════════════════════════ */
function initStickyCTA() {
  const bar = document.getElementById('sticky-cta-bar');
  const closeBtn = document.getElementById('sticky-cta-close');
  if (!bar) return;

  let dismissed = sessionStorage.getItem('sticky-cta-dismissed');
  if (dismissed) return;

  // Show after 5s or after user scrolls 40%
  const showBar = () => {
    if (!sessionStorage.getItem('sticky-cta-dismissed')) {
      bar.classList.add('show');
    }
  };

  setTimeout(showBar, 5000);

  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    if (pct > 0.4) showBar();
  }, { passive: true, once: true });

  closeBtn?.addEventListener('click', () => {
    bar.classList.remove('show');
    sessionStorage.setItem('sticky-cta-dismissed', '1');
  });
}

/* ══════════════════════════════════════════
   COOKIE BANNER
   ══════════════════════════════════════════ */
function initCookieBanner() {
  const banner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const rejectBtn = document.getElementById('cookie-reject');
  if (!banner) return;

  // Show if not already accepted
  if (!localStorage.getItem('cookie-consent')) {
    setTimeout(() => banner.classList.add('show'), 1500);
  }

  acceptBtn?.addEventListener('click', () => {
    localStorage.setItem('cookie-consent', 'accepted');
    banner.classList.remove('show');
    // Here you'd enable analytics, etc.
  });

  rejectBtn?.addEventListener('click', () => {
    localStorage.setItem('cookie-consent', 'rejected');
    banner.classList.remove('show');
  });
}

/* ══════════════════════════════════════════
   SMOOTH SCROLL for anchor links
   ══════════════════════════════════════════ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navHeight = document.getElementById('navbar')?.offsetHeight || 80;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ══════════════════════════════════════════
   DROPDOWN MENUS (keyboard accessible)
   ══════════════════════════════════════════ */
function initDropdowns() {
  document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
    const trigger = dropdown.querySelector('.nav-link');
    const menu    = dropdown.querySelector('.nav-dropdown-menu');
    if (!trigger || !menu) return;

    trigger.setAttribute('aria-haspopup', 'true');
    trigger.setAttribute('aria-expanded', 'false');

    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const isOpen = menu.style.opacity === '1';
        menu.style.opacity = isOpen ? '0' : '1';
        menu.style.visibility = isOpen ? 'hidden' : 'visible';
        menu.style.transform = isOpen ? 'translateY(-8px)' : 'translateY(0)';
        trigger.setAttribute('aria-expanded', !isOpen);
      }
    });
  });
}

/* ══════════════════════════════════════════
   UTILITY: Show toast notification
   ══════════════════════════════════════════ */
function showToast(message, type = 'success', duration = 4000) {
  const container = document.getElementById('toast-container') || createToastContainer();
  const toast = document.createElement('div');
  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';

  toast.className = `toast toast-${type}`;
  toast.setAttribute('role', 'alert');
  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-msg">${message}</span>
    <button class="toast-close" aria-label="Close">✕</button>
  `;

  toast.style.cssText = `
    display: flex; align-items: center; gap: 12px;
    background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6'};
    color: white; padding: 14px 20px; border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2); font-size: 14px; font-weight: 500;
    margin-bottom: 12px; max-width: 380px; width: 100%;
    animation: fadeInRight 0.3s ease; font-family: 'Inter', sans-serif;
  `;

  toast.querySelector('.toast-close').style.cssText = `
    margin-left: auto; background: none; border: none; color: white;
    cursor: pointer; font-size: 16px; padding: 0 0 0 8px; opacity: 0.8;
  `;

  toast.querySelector('.toast-close').addEventListener('click', () => removeToast(toast));
  container.appendChild(toast);

  if (duration > 0) setTimeout(() => removeToast(toast), duration);
  return toast;
}

function removeToast(toast) {
  toast.style.opacity = '0';
  toast.style.transform = 'translateX(100%)';
  toast.style.transition = 'all 0.3s ease';
  setTimeout(() => toast.remove(), 300);
}

function createToastContainer() {
  const div = document.createElement('div');
  div.id = 'toast-container';
  div.style.cssText = `
    position: fixed; top: 1.5rem; right: 1.5rem; z-index: 9999;
    display: flex; flex-direction: column; align-items: flex-end;
  `;
  document.body.appendChild(div);
  return div;
}

/* ══════════════════════════════════════════
   UTILITY: Sanitize text input
   ══════════════════════════════════════════ */
function sanitize(str) {
  const div = document.createElement('div');
  div.textContent = String(str);
  return div.innerHTML;
}

/* ══════════════════════════════════════════
   UTILITY: AJAX form submit
   ══════════════════════════════════════════ */
async function submitForm(form, endpoint) {
  const formData = new FormData(form);
  const submitBtn = form.querySelector('[type="submit"]');
  const originalText = submitBtn?.innerHTML;

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner"></span> Sending...';
  }

  try {
    const res = await fetch(endpoint, { method: 'POST', body: formData });
    const data = await res.json();
    if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = originalText; }
    return data;
  } catch (err) {
    if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = originalText; }
    throw err;
  }
}

// Expose globals
window.showToast  = showToast;
window.submitForm = submitForm;
window.sanitize   = sanitize;
