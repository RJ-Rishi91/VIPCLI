/**
 * EnviroRise Clearance (ERC) — Main Application Script
 * Controls sticky navigation, drawers, toast alerts, mobile navigation, and global UI.
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initActiveNavLink();
  initMobileDrawer();
  initInquiryDrawer();
  initBackToTop();
  initTalkToExpertButtons();
});

// Toast Notification System
function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type === 'success' ? 'toast-success' : 'toast-error'}`;
  
  const icon = type === 'success' ? 'check_circle' : 'error';
  toast.innerHTML = `
    <span class="material-symbols-outlined text-[20px]">${icon}</span>
    <span class="flex-1">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
window.showToast = showToast;

// Sticky Header & Utility Bar Collapse
function initStickyHeader() {
  const utilityBar = document.getElementById('utility-bar');
  const mainNav = document.getElementById('main-nav');
  if (!mainNav) return;

  const handleScroll = () => {
    const scrollY = window.scrollY;
    if (scrollY > 50) {
      if (utilityBar) utilityBar.classList.add('collapsed');
      mainNav.classList.add('scrolled');
    } else {
      if (utilityBar) utilityBar.classList.remove('collapsed');
      mainNav.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

// Active Nav Link State
function initActiveNavLink() {
  const path = window.location.pathname.toLowerCase();
  const navLinks = document.querySelectorAll('header nav a, #mobile-drawer a');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const cleanHref = href.split('/').pop().replace('.html', '').toLowerCase();
    
    const isHome = (path.endsWith('/') || path.endsWith('index.html')) && (cleanHref === 'index' || cleanHref === '#' || cleanHref === '');
    const isMatch = cleanHref && cleanHref !== '#' && path.includes(cleanHref);

    if (isHome || isMatch) {
      link.classList.add('active-nav');
      if (link.closest('header nav') && !link.classList.contains('dropdown-item')) {
        link.classList.add('text-leaf-green', 'font-semibold', 'border-b-[3px]', 'border-fresh-green');
      }
    }
  });
}

// Mobile Navigation Drawer
function initMobileDrawer() {
  const openBtn = document.getElementById('mobile-menu-btn');
  const closeBtn = document.getElementById('close-drawer-btn');
  const drawer = document.getElementById('mobile-drawer');
  const backdrop = document.getElementById('drawer-backdrop');

  if (!openBtn || !drawer || !backdrop) return;

  const openDrawer = () => {
    drawer.classList.add('active');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('active');
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
  };

  openBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);

  // Close drawer when any internal navigation link is tapped
  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  // Keyboard accessibility: Close drawers on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDrawer();
      const inqDrawer = document.getElementById('inquiry-drawer');
      const inqBackdrop = document.getElementById('inquiry-backdrop');
      if (inqDrawer && inqDrawer.classList.contains('active')) {
        inqDrawer.classList.remove('active');
        if (inqBackdrop) inqBackdrop.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
  });

  // Mobile Accordion Dropdowns
  const accordionTriggers = drawer.querySelectorAll('.mobile-accordion-btn');
  accordionTriggers.forEach(btn => {
    btn.addEventListener('click', () => {
      const panel = btn.nextElementSibling;
      const icon = btn.querySelector('.accordion-chevron');
      if (panel) {
        panel.classList.toggle('hidden');
        if (icon) icon.classList.toggle('rotate-180');
      }
    });
  });
}

// Floating Inquiry Drawer
function initInquiryDrawer() {
  const triggerTab = document.getElementById('inquiry-floating-tab');
  const drawer = document.getElementById('inquiry-drawer');
  const backdrop = document.getElementById('inquiry-backdrop');
  const closeBtn = document.getElementById('close-inquiry-btn');
  const form = document.getElementById('inquiry-form');

  if (!drawer || !backdrop) return;

  const openInquiry = () => {
    drawer.classList.add('active');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
    const firstInput = drawer.querySelector('input');
    if (firstInput) setTimeout(() => firstInput.focus(), 200);
  };

  const closeInquiry = () => {
    drawer.classList.remove('active');
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (triggerTab) triggerTab.addEventListener('click', openInquiry);
  if (closeBtn) closeBtn.addEventListener('click', closeInquiry);
  backdrop.addEventListener('click', closeInquiry);

  // Global triggers
  document.querySelectorAll('[data-open-inquiry]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      openInquiry();
    });
  });

  // Handle Form Submission
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const origText = submitBtn ? submitBtn.innerHTML : 'Submit';

      const formData = {
        name: form.elements['name']?.value?.trim(),
        email: form.elements['email']?.value?.trim(),
        phone: form.elements['phone']?.value?.trim(),
        service: form.elements['service']?.value || 'General Inquiry',
        message: form.elements['message']?.value?.trim()
      };

      if (!formData.name || !formData.phone) {
        showToast('Please enter your name and contact phone number.', 'error');
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg> Submitting...
        `;
      }

      try {
        const result = await ERCApi.submitInquiry(formData);
        showToast('Thank you! Your inquiry has been submitted. Our team will contact you shortly.', 'success');
        form.reset();
        setTimeout(closeInquiry, 1000);
      } catch (err) {
        showToast('Submission failed. Please call our team directly at +91-9785552521.', 'error');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = origText;
        }
      }
    });
  }
}

// Back to Top Button
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Wire "Talk to Expert" buttons
function initTalkToExpertButtons() {
  document.querySelectorAll('[data-action="talk-to-expert"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const inquiryDrawer = document.getElementById('inquiry-drawer');
      const inquiryBackdrop = document.getElementById('inquiry-backdrop');
      if (inquiryDrawer && inquiryBackdrop) {
        inquiryDrawer.classList.add('active');
        inquiryBackdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
      } else {
        window.location.href = 'contact-us.html';
      }
    });
  });
}
