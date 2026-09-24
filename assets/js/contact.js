/**
 * EnviroRise Clearance (ERC) — Contact Form Module
 * Handles contact form validation, API submission, and UI feedback.
 */

document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const origText = submitBtn ? submitBtn.innerHTML : 'Submit';

    const payload = {
      name: contactForm.elements['name']?.value?.trim(),
      email: contactForm.elements['email']?.value?.trim(),
      phone: contactForm.elements['phone']?.value?.trim(),
      message: contactForm.elements['message']?.value?.trim()
    };

    if (!payload.name || !payload.email || !payload.phone || !payload.message) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(payload.email)) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg> Sending Message...
      `;
    }

    try {
      await ERCApi.submitContact(payload);
      showToast('Message sent successfully! Our advisory team will get in touch promptly.', 'success');
      contactForm.reset();
    } catch (err) {
      showToast('Message could not be sent. Please contact us directly at info@enviro-rise.com.', 'error');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = origText;
      }
    }
  });
});
