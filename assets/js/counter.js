/**
 * EnviroRise Clearance (ERC) — Numbers Counter Animation
 * Animates numbers (18+, 10, 7, 13) when scrolled into view.
 */

document.addEventListener('DOMContentLoaded', () => {
  const counterElements = document.querySelectorAll('[data-counter]');
  if (!counterElements.length) return;

  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        animateCounters();
      }
    });
  }, { threshold: 0.25 });

  const numbersStrip = document.getElementById('numbers-strip');
  if (numbersStrip) {
    observer.observe(numbersStrip);
  } else if (counterElements[0]) {
    observer.observe(counterElements[0]);
  }

  function animateCounters() {
    counterElements.forEach(el => {
      const target = parseInt(el.getAttribute('data-counter'), 10);
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 1800; // ms
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing: easeOutExpo
        const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const currentVal = Math.floor(ease * target);

        el.textContent = currentVal + (progress === 1 ? suffix : '');

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.textContent = target + suffix;
        }
      }

      requestAnimationFrame(update);
    });
  }
});
