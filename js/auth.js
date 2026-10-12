/**
 * STACKLY HEALTHCARE - AUTHENTICATION LOGIC (js/auth.js)
 * Matching UI & functionality from screenshots 1 & 3:
 * - GSAP Entrance Animation
 * - Password Show/Hide Toggle
 * - Login Validation & Redirection: Admin -> AdminDashboard.html, Client -> ClientDashboard.html
 * - Signup Validation & Redirection -> Login.html
 */

document.addEventListener('DOMContentLoaded', () => {
  initAuthGsapEntrance();
  initPasswordToggles();
  initLoginForm();
  initSignupForm();
});

// Fail-safe: ensure submit button and elements are 100% visible on window load
window.addEventListener('load', ensureAuthVisibility);

/**
 * Fail-safe function to guarantee all auth elements are visible
 */
function ensureAuthVisibility() {
  const elements = document.querySelectorAll(
    '.auth-submit-btn, .auth-card, .auth-form-group, .auth-title-block, .auth-header-bar, .auth-footer-prompt'
  );
  elements.forEach(el => {
    if (typeof gsap !== 'undefined') {
      gsap.set(el, { clearProps: 'all' });
    }
    el.style.opacity = '1';
    el.style.visibility = 'visible';
    el.style.transform = 'none';
  });
}

/**
 * GSAP Entrance Animation for Auth Pages
 */
function initAuthGsapEntrance() {
  // Check user preference for reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion || typeof gsap === 'undefined') {
    ensureAuthVisibility();
    return;
  }

  const tl = gsap.timeline({ 
    defaults: { ease: 'power3.out' },
    onComplete: ensureAuthVisibility
  });

  tl.fromTo('.auth-header-bar', 
    { y: -25, opacity: 0 }, 
    { y: 0, opacity: 1, duration: 0.5, clearProps: 'all' }
  )
  .fromTo('.auth-card', 
    { y: 30, opacity: 0, scale: 0.98 }, 
    { y: 0, opacity: 1, scale: 1, duration: 0.6, clearProps: 'all' }, 
    '-=0.3'
  )
  .fromTo('.auth-title-block', 
    { y: 15, opacity: 0 }, 
    { y: 0, opacity: 1, duration: 0.4, clearProps: 'all' }, 
    '-=0.3'
  )
  .fromTo('.auth-form-group', 
    { y: 12, opacity: 0 }, 
    { y: 0, opacity: 1, stagger: 0.06, duration: 0.4, clearProps: 'all' }, 
    '-=0.2'
  )
  .fromTo('.auth-submit-btn', 
    { y: 10, opacity: 0 }, 
    { y: 0, opacity: 1, duration: 0.4, clearProps: 'all' }, 
    '-=0.1'
  )
  .fromTo('.auth-footer-prompt', 
    { opacity: 0 }, 
    { opacity: 1, duration: 0.4, clearProps: 'all' }, 
    '-=0.2'
  );

  // Fallback safety timeout in case GSAP is paused or throttled in background tabs
  setTimeout(ensureAuthVisibility, 650);
}

/**
 * Password Visibility Toggle
 */
function initPasswordToggles() {
  const toggleButtons = document.querySelectorAll('.auth-password-toggle');
  toggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.previousElementSibling;
      if (!input) return;

      const icon = btn.querySelector('i');
      if (input.type === 'password') {
        input.type = 'text';
        if (icon) {
          icon.classList.remove('fa-eye');
          icon.classList.add('fa-eye-slash');
        }
      } else {
        input.type = 'password';
        if (icon) {
          icon.classList.remove('fa-eye-slash');
          icon.classList.add('fa-eye');
        }
      }
    });
  });
}

/**
 * Login Handler & Redirection Logic
 */
function initLoginForm() {
  const form = document.getElementById('login-form');
  if (!form) return;

  const roleSelect = document.getElementById('login-role');
  const emailInput = document.getElementById('login-email');
  const passwordInput = document.getElementById('login-password');
  const alertEl = document.getElementById('login-alert');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let hasError = false;

    // Reset errors
    form.querySelectorAll('.auth-form-group').forEach(g => g.classList.remove('has-error'));
    if (alertEl) alertEl.style.display = 'none';

    // Validate email
    const emailVal = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailVal || !emailRegex.test(emailVal)) {
      showError(emailInput, 'Please enter a valid email address');
      hasError = true;
    }

    // Validate password
    const passVal = passwordInput.value;
    if (!passVal || passVal.length < 4) {
      showError(passwordInput, 'Password must be at least 4 characters');
      hasError = true;
    }

    if (hasError) return;

    // Check Role
    const selectedRole = roleSelect.value; // 'Admin' or 'Client'

    // Button loading state
    const submitBtn = form.querySelector('.auth-submit-btn');
    const originalText = submitBtn.innerText;
    submitBtn.innerText = 'Signing In...';
    submitBtn.disabled = true;

    // Store authenticated role in sessionStorage for dashboard greetings
    sessionStorage.setItem('stackly_user_role', selectedRole);
    sessionStorage.setItem('stackly_user_email', emailVal);

    setTimeout(() => {
      if (selectedRole === 'Admin') {
        window.location.href = 'AdminDashboard.html';
      } else {
        window.location.href = 'ClientDashboard.html';
      }
    }, 700);
  });

  function showError(input, msg) {
    const group = input.closest('.auth-form-group');
    if (group) {
      group.classList.add('has-error');
      const err = group.querySelector('.auth-field-error');
      if (err) err.innerText = msg;
    }
  }
}

/**
 * Signup Handler & Redirection Logic
 */
function initSignupForm() {
  const form = document.getElementById('signup-form');
  if (!form) return;

  const roleSelect = document.getElementById('signup-role');
  const nameInput = document.getElementById('signup-name');
  const emailInput = document.getElementById('signup-email');
  const passwordInput = document.getElementById('signup-password');
  const alertSuccess = document.getElementById('signup-alert-success');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let hasError = false;

    // Reset errors
    form.querySelectorAll('.auth-form-group').forEach(g => g.classList.remove('has-error'));

    // Validate Name
    if (!nameInput.value.trim()) {
      showError(nameInput, 'Full name is required');
      hasError = true;
    }

    // Validate Email
    const emailVal = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailVal || !emailRegex.test(emailVal)) {
      showError(emailInput, 'Please enter a valid email address');
      hasError = true;
    }

    // Validate Password
    const passVal = passwordInput.value;
    if (!passVal || passVal.length < 6) {
      showError(passwordInput, 'Password must be at least 6 characters');
      hasError = true;
    }

    if (hasError) return;

    // Success State
    const submitBtn = form.querySelector('.auth-submit-btn');
    submitBtn.innerText = 'Creating Account...';
    submitBtn.disabled = true;

    if (alertSuccess) {
      alertSuccess.style.display = 'flex';
      alertSuccess.innerHTML = '<i class="fa-solid fa-circle-check"></i> <span>Account created! Redirecting to login...</span>';
    }

    // Redirect to Login page after 1.2s
    setTimeout(() => {
      window.location.href = 'Login.html';
    }, 1200);
  });

  function showError(input, msg) {
    const group = input.closest('.auth-form-group');
    if (group) {
      group.classList.add('has-error');
      const err = group.querySelector('.auth-field-error');
      if (err) err.innerText = msg;
    }
  }
}
