/**
 * STACKLY HEALTHCARE - MAIN JAVASCRIPT (js/main.js)
 * Core interactive scripts, GSAP animation system, Intersection Observer reveals,
 * shared navigation, FAQ accordions, and fail-safe visibility system
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initFaqAccordions();
  initGsapAnimations();
});

// Refresh triggers and ensure visibility when all assets/images finish loading
window.addEventListener('load', () => {
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.refresh();
  }
  ensureContentVisibility();
});

/**
 * Fail-safe check: ensures no content is accidentally left hidden or stuck at opacity: 0
 */
function ensureContentVisibility() {
  const animTargets = document.querySelectorAll(
    '.department-card, .doctor-card, .step-card, .testimonial-card, .resource-card, .why-us-card, .diagnostic-card, .facility-card, .branch-card, .counter-box, .home-hero-content, .home-hero-title, .home-hero-desc, .home-hero-badge, .home-hero-ctas, .inner-hero-content, .section-title, .badge-tag'
  );
  animTargets.forEach(el => {
    const compOpacity = window.getComputedStyle(el).opacity;
    if (compOpacity === '0' || el.style.opacity === '0') {
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.style.visibility = 'visible';
    }
  });
}

/**
 * Navbar interactions: Sticky styling, mobile drawer
 */
function initNavbar() {
  const header = document.querySelector('.site-header');
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const overlay = document.querySelector('.mobile-nav-overlay');

  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  if (toggleBtn && overlay) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = overlay.classList.contains('open');
      if (isOpen) {
        overlay.classList.remove('open');
        toggleBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
        toggleBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      } else {
        overlay.classList.add('open');
        toggleBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        toggleBtn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
      }
    });

    // Close overlay when clicking a nav link
    const mobileLinks = overlay.querySelectorAll('.nav-link, .nav-login-btn');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        overlay.classList.remove('open');
        toggleBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
        document.body.style.overflow = '';
      });
    });
  }
}

/**
 * Interactive FAQ Accordions
 */
function initFaqAccordions() {
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      if (!item) return;
      const isActive = item.classList.contains('active');
      
      // Close all other accordion items in the same container
      const parent = item.closest('.faq-accordion');
      if (parent) {
        parent.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      }

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/**
 * GSAP Signature Animation System with IntersectionObserver & ScrollTrigger
 */
function initGsapAnimations() {
  // Check user preference for reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    ensureContentVisibility();
    return;
  }

  // Check if GSAP is available
  if (typeof gsap === 'undefined') {
    ensureContentVisibility();
    return;
  }

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // 1. Hero entrance animations
  initHeroAnimation();

  // 2. Subtle hero image parallax
  initHeroParallax();

  // 3. Medical pulse & icon micro-animations (heartbeat effect)
  initMedicalMicroAnimations();

  // 4. Section headers entrance reveals
  initSectionHeaderReveals();

  // 5. Staggered card reveals via IntersectionObserver (Fail-safe across all screen heights)
  initCardReveals();

  // 6. Interactive card hover physics (GSAP micro-interactions)
  initCardHoverInteractions();

  // 7. Counter number animations
  initCounterAnimations();

  // 8. Button spring press feedback
  initButtonAnimations();
}

/**
 * Hero entrance animation
 */
function initHeroAnimation() {
  const heroBadge = document.querySelector('.home-hero-badge, .breadcrumbs');
  const heroTitle = document.querySelector('.home-hero-title, .inner-hero-title');
  const heroDesc = document.querySelector('.home-hero-desc, .inner-hero-desc');
  const heroCtas = document.querySelector('.home-hero-ctas, .inner-hero-content .btn');

  const tl = gsap.timeline({
    defaults: { ease: 'power3.out', duration: 0.8 },
    onComplete: () => {
      // Clear inline transform and opacity so elements render with native CSS
      if (heroBadge) gsap.set(heroBadge, { clearProps: 'all' });
      if (heroTitle) gsap.set(heroTitle, { clearProps: 'all' });
      if (heroDesc) gsap.set(heroDesc, { clearProps: 'all' });
      if (heroCtas) {
        gsap.set(heroCtas, { clearProps: 'all' });
        if (heroCtas.children) {
          Array.from(heroCtas.children).forEach(c => gsap.set(c, { clearProps: 'all' }));
        }
      }
    }
  });

  if (heroBadge) tl.fromTo(heroBadge, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 });
  if (heroTitle) tl.fromTo(heroTitle, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, '-=0.4');
  if (heroDesc) tl.fromTo(heroDesc, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.4');
  if (heroCtas) {
    if (heroCtas.children && heroCtas.children.length > 0) {
      tl.fromTo(heroCtas.children, { y: 15, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.12, duration: 0.5 }, '-=0.3');
    } else {
      tl.fromTo(heroCtas, { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, '-=0.3');
    }
  }
}

/**
 * Hero image parallax
 */
function initHeroParallax() {
  const heroBg = document.querySelector('.home-hero-bg, .inner-hero-bg');
  if (heroBg && typeof ScrollTrigger !== 'undefined') {
    gsap.to(heroBg, {
      y: 40,
      ease: 'none',
      scrollTrigger: {
        trigger: heroBg.parentElement,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.5
      }
    });
  }
}

/**
 * Medical micro-animations: Rhythmic heartbeat pulse on health icons
 */
function initMedicalMicroAnimations() {
  // Pulsing medical icons: badge shields, stethoscopes, emergency icons
  const pulseIcons = document.querySelectorAll(
    '.home-hero-badge i, .badge-tag i.fa-shield-heart, .error-pulse-icon i, .emergency-phone-box i'
  );

  pulseIcons.forEach(icon => {
    gsap.to(icon, {
      scale: 1.22,
      duration: 0.75,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    });
  });

  // Soft breathing pulse for online/live indicator pills
  const livePills = document.querySelectorAll('.status-pill.success, .status-pill.online');
  livePills.forEach(pill => {
    gsap.to(pill, {
      boxShadow: '0 0 14px rgba(66, 191, 165, 0.45)',
      duration: 1.2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
  });
}

/**
 * Section headers entrance reveals
 */
function initSectionHeaderReveals() {
  if (!('IntersectionObserver' in window)) return;

  const headerSections = document.querySelectorAll(
    '.section-header, .section-title-wrapper, .home-section-header, .departments-header'
  );

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sec = entry.target;
        const badge = sec.querySelector('.badge-tag');
        const title = sec.querySelector('.section-title');
        const subtitle = sec.querySelector('.section-subtitle');

        const tl = gsap.timeline({
          defaults: { ease: 'power2.out', duration: 0.6 },
          onComplete: () => {
            if (badge) gsap.set(badge, { clearProps: 'all' });
            if (title) gsap.set(title, { clearProps: 'all' });
            if (subtitle) gsap.set(subtitle, { clearProps: 'all' });
          }
        });

        if (badge) tl.fromTo(badge, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.45 });
        if (title) tl.fromTo(title, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.55 }, '-=0.3');
        if (subtitle) tl.fromTo(subtitle, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3');

        obs.unobserve(sec);
      }
    });
  }, { threshold: 0.15 });

  headerSections.forEach(sec => observer.observe(sec));
}

/**
 * Card reveals using IntersectionObserver
 * Completely avoids ScrollTrigger desynchronization glitches when images load or viewports resize
 */
function initCardReveals() {
  const cardGroups = [
    { selector: '.department-card', stagger: 0.08 },
    { selector: '.doctor-card', stagger: 0.1 },
    { selector: '.step-card', stagger: 0.12 },
    { selector: '.testimonial-card', stagger: 0.1 },
    { selector: '.resource-card', stagger: 0.1 },
    { selector: '.why-us-card', stagger: 0.08 },
    { selector: '.diagnostic-card', stagger: 0.1 },
    { selector: '.facility-card', stagger: 0.1 },
    { selector: '.branch-card', stagger: 0.1 }
  ];

  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.1
    };

    cardGroups.forEach(group => {
      const elements = document.querySelectorAll(group.selector);
      if (elements.length === 0) return;

      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            gsap.fromTo(el, 
              { opacity: 0, y: 32, scale: 0.98 },
              { 
                opacity: 1, 
                y: 0, 
                scale: 1,
                duration: 0.65, 
                ease: 'power2.out',
                clearProps: 'all' // removes inline opacity and transform upon completion
              }
            );
            obs.unobserve(el);
          }
        });
      }, observerOptions);

      elements.forEach(el => observer.observe(el));
    });
  } else {
    // Fallback for browsers without IntersectionObserver
    ensureContentVisibility();
  }

  // Double check after 1.5 seconds in case any elements were missed
  setTimeout(ensureContentVisibility, 1500);
}

/**
 * GSAP Card Hover Micro-Interactions (Fluid elevation on pointer hover)
 */
function initCardHoverInteractions() {
  if (window.matchMedia('(hover: none)').matches) return; // Skip on touch-only devices

  const hoverCards = document.querySelectorAll(
    '.department-card, .doctor-card, .step-card, .resource-card, .diagnostic-card, .facility-card'
  );

  hoverCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card, {
        y: -6,
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        y: 0,
        duration: 0.35,
        ease: 'power2.out',
        overwrite: 'auto',
        clearProps: 'transform'
      });
    });
  });
}

/**
 * Button spring micro-interactions
 */
function initButtonAnimations() {
  const buttons = document.querySelectorAll('.btn-primary, .btn-accent, .nav-login-btn');
  buttons.forEach(btn => {
    btn.addEventListener('mousedown', () => {
      gsap.to(btn, { scale: 0.96, duration: 0.15, ease: 'power1.out' });
    });
    btn.addEventListener('mouseup', () => {
      gsap.to(btn, { scale: 1, duration: 0.25, ease: 'back.out(2)' });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { scale: 1, duration: 0.2, ease: 'power1.out', clearProps: 'transform' });
    });
  });
}

/**
 * Counter animations
 */
function initCounterAnimations() {
  const counterElements = document.querySelectorAll('.counter-number');
  if (counterElements.length === 0) return;

  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const targetText = el.getAttribute('data-target') || el.innerText;
          const targetNum = parseInt(targetText.replace(/[^0-9]/g, ''), 10);
          const prefix = targetText.startsWith('+') ? '+' : '';
          const suffix = targetText.endsWith('+') ? '+' : (targetText.endsWith('%') ? '%' : '');

          if (!isNaN(targetNum)) {
            gsap.fromTo(
              { val: 0 },
              { val: targetNum },
              {
                duration: 2.0,
                ease: 'power2.out',
                onUpdate: function () {
                  el.innerText = prefix + Math.floor(this.targets()[0].val).toLocaleString() + suffix;
                },
                onComplete: function () {
                  el.innerText = targetText;
                }
              }
            );
          }
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.15 });

    counterElements.forEach(el => counterObserver.observe(el));
  }
}

/**
 * Global Toast notice
 */
function showToast(message, icon = 'fa-check') {
  let toast = document.querySelector('.toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3800);
}
