/**
 * Yashal Shende - Personal Portfolio Script
 * Week 1: Frontend Fundamentals - JavaScript ES6+ & Form Validation
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ---------------------------------------------------------------------------
  // 1. Dynamic Year in Footer
  // ---------------------------------------------------------------------------
  const currentYearEl = document.getElementById('currentYear');
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }

  // ---------------------------------------------------------------------------
  // 2. Responsive Mobile Navigation
  // ---------------------------------------------------------------------------
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNavMenu = document.getElementById('mobileNavMenu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  const toggleMobileNav = (forceState = null) => {
    const isCurrentlyOpen = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
    const shouldOpen = forceState !== null ? forceState : !isCurrentlyOpen;

    mobileMenuBtn.setAttribute('aria-expanded', String(shouldOpen));
    if (shouldOpen) {
      mobileNavMenu.removeAttribute('hidden');
    } else {
      mobileNavMenu.setAttribute('hidden', '');
    }
  };

  if (mobileMenuBtn && mobileNavMenu) {
    mobileMenuBtn.addEventListener('click', () => toggleMobileNav());

    // Close mobile nav when clicking any link
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => toggleMobileNav(false));
    });

    // Close when clicking outside of the header
    document.addEventListener('click', (event) => {
      const header = document.querySelector('.site-header');
      if (header && !header.contains(event.target)) {
        toggleMobileNav(false);
      }
    });

    // Close on Escape key press
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        toggleMobileNav(false);
      }
    });
  }

  // ---------------------------------------------------------------------------
  // 3. Active Link Highlight on Scroll (Intersection Observer)
  // ---------------------------------------------------------------------------
  const sections = document.querySelectorAll('main > section[id]');
  const desktopNavLinks = document.querySelectorAll('.desktop-nav .nav-link');

  if ('IntersectionObserver' in window && sections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          desktopNavLinks.forEach(link => {
            if (link.getAttribute('href') === `#${currentId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(sec => sectionObserver.observe(sec));
  }

  // ---------------------------------------------------------------------------
  // 4. E-Commerce Services Interaction: Pre-fill Contact Form Subject
  // ---------------------------------------------------------------------------
  const selectServiceBtns = document.querySelectorAll('.select-service-btn');
  const subjectInput = document.getElementById('contactSubject');

  selectServiceBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const serviceName = e.currentTarget.getAttribute('data-service');
      if (subjectInput && serviceName) {
        subjectInput.value = `Inquiry regarding: ${serviceName}`;
        // Scroll to contact form smoothly
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
          subjectInput.focus();
        }
      }
    });
  });

  // ---------------------------------------------------------------------------
  // 5. Back to Top Button
  // ---------------------------------------------------------------------------
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---------------------------------------------------------------------------
  // 6. JavaScript Form Validation (Accessible, Live Feedback, Clean ES6+)
  // ---------------------------------------------------------------------------
  const contactForm = document.getElementById('portfolioContactForm');
  const formStatusBanner = document.getElementById('formStatusBanner');
  const submitBtn = document.getElementById('submitBtn');
  const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
  const btnSpinner = submitBtn ? submitBtn.querySelector('.btn-spinner') : null;

  if (contactForm) {
    const fields = {
      name: {
        input: document.getElementById('contactName'),
        error: document.getElementById('error-name'),
        validate: (value) => {
          const trimmed = value.trim();
          if (!trimmed) return 'Full name is required.';
          if (trimmed.length < 2) return 'Full name must be at least 2 characters.';
          if (!/^[a-zA-Z\s.'-]+$/.test(trimmed)) return 'Name can only contain letters, spaces, and hyphens.';
          return '';
        }
      },
      email: {
        input: document.getElementById('contactEmail'),
        error: document.getElementById('error-email'),
        validate: (value) => {
          const trimmed = value.trim();
          if (!trimmed) return 'Email address is required.';
          const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          if (!emailRegex.test(trimmed)) return 'Please enter a valid email address (e.g. name@domain.com).';
          return '';
        }
      },
      subject: {
        input: document.getElementById('contactSubject'),
        error: document.getElementById('error-subject'),
        validate: (value) => {
          const trimmed = value.trim();
          if (!trimmed) return 'Subject is required.';
          if (trimmed.length < 3) return 'Subject must be at least 3 characters.';
          return '';
        }
      },
      message: {
        input: document.getElementById('contactMessage'),
        error: document.getElementById('error-message'),
        validate: (value) => {
          const trimmed = value.trim();
          if (!trimmed) return 'Message is required.';
          if (trimmed.length < 15) return `Message must be at least 15 characters (currently ${trimmed.length}).`;
          return '';
        }
      }
    };

    // Helper to validate a single field and update UI
    const validateField = (fieldName) => {
      const field = fields[fieldName];
      if (!field || !field.input) return true;

      const errorMsg = field.validate(field.input.value);
      if (errorMsg) {
        field.input.classList.add('is-invalid');
        field.input.classList.remove('is-valid');
        if (field.error) field.error.textContent = errorMsg;
        return false;
      } else {
        field.input.classList.remove('is-invalid');
        field.input.classList.add('is-valid');
        if (field.error) field.error.textContent = '';
        return true;
      }
    };

    // Attach live validation on blur and input events
    Object.keys(fields).forEach(key => {
      const field = fields[key];
      if (field.input) {
        field.input.addEventListener('blur', () => {
          validateField(key);
        });

        field.input.addEventListener('input', () => {
          // If already marked invalid, re-validate immediately to give positive feedback
          if (field.input.classList.contains('is-invalid')) {
            validateField(key);
          }
        });
      }
    });

    // Form Submit Handler
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();

      // Clear any previous status banner
      if (formStatusBanner) {
        formStatusBanner.hidden = true;
        formStatusBanner.className = 'form-status-banner';
        formStatusBanner.textContent = '';
      }

      // Validate all fields
      let isFormValid = true;
      Object.keys(fields).forEach(key => {
        const isValid = validateField(key);
        if (!isValid && isFormValid) {
          isFormValid = false;
          fields[key].input.focus();
        }
      });

      if (!isFormValid) {
        if (formStatusBanner) {
          formStatusBanner.hidden = false;
          formStatusBanner.classList.add('status-error');
          formStatusBanner.textContent = 'Please review and resolve the highlighted errors before submitting.';
        }
        return;
      }

      // Simulate form submission process
      if (submitBtn) submitBtn.disabled = true;
      if (btnText) btnText.hidden = true;
      if (btnSpinner) btnSpinner.hidden = false;

      setTimeout(() => {
        // Reset UI state
        if (submitBtn) submitBtn.disabled = false;
        if (btnText) btnText.hidden = false;
        if (btnSpinner) btnSpinner.hidden = true;

        // Show success message
        if (formStatusBanner) {
          formStatusBanner.hidden = false;
          formStatusBanner.classList.add('status-success');
          formStatusBanner.textContent = `Thank you, ${fields.name.input.value.trim()}! Your message has been received successfully. I will get back to you shortly.`;
        }

        // Reset form inputs & remove valid styling
        contactForm.reset();
        Object.keys(fields).forEach(key => {
          fields[key].input.classList.remove('is-valid');
          fields[key].input.classList.remove('is-invalid');
        });
      }, 1000);
    });
  }
});
