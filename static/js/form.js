/**
 * M5 — Contact Form AJAX submit handler (§3.3)
 * ==============================================
 * - Intercepts form submit → fetch POST with JSON response handling
 * - CSRF token read from hidden <input name="csrf_token"> in the form
 * - Inline success/error feedback matching §8.1 color tokens
 * - Honeypot hidden field included (handled server-side)
 */
(function () {
  'use strict';

  var form = document.getElementById('contact-form');
  if (!form) return;

  var feedback = document.getElementById('form-feedback');
  var submitBtn = form.querySelector('button[type="submit"]');
  var inputs = form.querySelectorAll('input, textarea');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Disable button + show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    // Clear previous feedback
    clearFeedback();
    clearFieldErrors();

    var formData = new FormData(form);

    fetch('/contact', {
      method: 'POST',
      body: formData,
    })
      .then(function (response) {
        return response.json().then(function (data) {
          return { status: response.status, data: data };
        });
      })
      .then(function (result) {
        if (result.data.status === 'success') {
          showFeedback('success', result.data.message || 'Message sent successfully!');
          form.reset();
        } else if (result.data.status === 'error') {
          // Field-level errors
          if (result.data.errors) {
            var hasFieldErrors = false;
            Object.keys(result.data.errors).forEach(function (field) {
              if (field === '_form') return; // global error
              hasFieldErrors = true;
              showFieldError(field, result.data.errors[field]);
            });
            if (result.data.errors._form) {
              showFeedback('error', result.data.errors._form);
            } else if (!hasFieldErrors) {
              showFeedback('error', 'Please check your input and try again.');
            }
          } else {
            showFeedback('error', 'Please check your input and try again.');
          }
        }
      })
      .catch(function () {
        showFeedback('error', 'Network error. Please try again.');
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      });
  });

  /* ── Helper: show feedback banner ── */
  function showFeedback(type, message) {
    if (!feedback) return;
    feedback.textContent = message;
    feedback.className = 'form-feedback form-feedback--' + type;
    feedback.style.display = 'block';
    feedback.setAttribute('role', 'alert');
  }

  /* ── Helper: clear feedback banner ── */
  function clearFeedback() {
    if (!feedback) return;
    feedback.textContent = '';
    feedback.className = 'form-feedback';
    feedback.style.display = 'none';
    feedback.removeAttribute('role');
  }

  /* ── Helper: show field-level error ── */
  function showFieldError(fieldName, message) {
    var input = form.querySelector('[name="' + fieldName + '"]');
    if (!input) return;
    input.classList.add('input-error');

    // Find or create error message element
    var errEl = input.parentNode.querySelector('.field-error');
    if (!errEl) {
      errEl = document.createElement('span');
      errEl.className = 'field-error';
      errEl.setAttribute('role', 'alert');
      input.parentNode.appendChild(errEl);
    }
    errEl.textContent = message;
  }

  /* ── Helper: clear field error styles ── */
  function clearFieldErrors() {
    inputs.forEach(function (input) {
      input.classList.remove('input-error');
      var errEl = input.parentNode.querySelector('.field-error');
      if (errEl) errEl.remove();
    });
  }
})();

