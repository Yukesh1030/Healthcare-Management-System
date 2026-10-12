/**
 * STACKLY HEALTHCARE - CONTACT PAGE SCRIPTS (js/contact.js)
 * Form validation, inline errors, success states, and branch office selector
 */

document.addEventListener('DOMContentLoaded', () => {
  initContactForm();
  initBranchSelector();
});

function initContactForm() {
  const form = document.getElementById('healthcare-contact-form');
  const successBanner = document.getElementById('contact-success-banner');

  if (!form) return;

  const fields = {
    name: document.getElementById('contact-name'),
    email: document.getElementById('contact-email'),
    phone: document.getElementById('contact-phone'),
    category: document.getElementById('contact-category'),
    message: document.getElementById('contact-message')
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let hasError = false;

    // Reset previous errors
    Object.values(fields).forEach(input => {
      if (input) {
        const group = input.closest('.form-group');
        if (group) group.classList.remove('has-error');
      }
    });

    // Validate Name
    if (!fields.name.value.trim()) {
      showFieldError(fields.name, 'Full name is required');
      hasError = true;
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!fields.email.value.trim() || !emailRegex.test(fields.email.value.trim())) {
      showFieldError(fields.email, 'Please enter a valid email address');
      hasError = true;
    }

    // Validate Phone
    const phoneRegex = /^[0-9+\-\s()]{7,16}$/;
    if (!fields.phone.value.trim() || !phoneRegex.test(fields.phone.value.trim())) {
      showFieldError(fields.phone, 'Please enter a valid phone number');
      hasError = true;
    }

    // Validate Category
    if (!fields.category.value) {
      showFieldError(fields.category, 'Please select an inquiry category');
      hasError = true;
    }

    // Validate Message
    if (!fields.message.value.trim() || fields.message.value.trim().length < 10) {
      showFieldError(fields.message, 'Message should be at least 10 characters');
      hasError = true;
    }

    if (hasError) {
      if (typeof showToast === 'function') {
        showToast('Please correct the highlighted form errors.', 'fa-triangle-exclamation');
      }
      return;
    }

    // Success State
    if (successBanner) {
      successBanner.style.display = 'flex';
      form.reset();
      form.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => {
        successBanner.style.display = 'none';
      }, 7000);
    }
  });

  function showFieldError(input, msg) {
    const group = input.closest('.form-group');
    if (group) {
      group.classList.add('has-error');
      const errEl = group.querySelector('.form-error');
      if (errEl) errEl.innerText = msg;
    }
  }
}

function initBranchSelector() {
  const branchBtns = document.querySelectorAll('.branch-tab-btn');
  const branchCards = document.querySelectorAll('.branch-card');

  if (branchBtns.length === 0) return;

  branchBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      branchBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const targetCity = btn.getAttribute('data-city');

      branchCards.forEach(card => {
        if (targetCity === 'all' || card.getAttribute('data-city') === targetCity) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}
