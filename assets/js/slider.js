/**
 * EnviroRise Clearance (ERC) — Hero Slider Module
 * Supports 3 dynamic slides, autoplay, touch swipe, dots, and responsive transitions.
 */

class HeroSlider {
  constructor(sliderEl) {
    this.slider = sliderEl;
    if (!this.slider) return;

    this.slides = this.slider.querySelectorAll('.hero-slide');
    this.dots = this.slider.querySelectorAll('.hero-dot');
    this.prevBtn = this.slider.querySelector('.hero-prev');
    this.nextBtn = this.slider.querySelector('.hero-next');
    this.currentIndex = 0;
    this.totalSlides = this.slides.length;
    this.timer = null;
    this.interval = 6500;

    this.init();
  }

  init() {
    if (this.totalSlides <= 1) return;

    this.goToSlide(0);

    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.prev();
        this.resetTimer();
      });
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.next();
        this.resetTimer();
      });
    }

    this.dots.forEach((dot, idx) => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        this.goToSlide(idx);
        this.resetTimer();
      });
    });

    // Touch swipe support
    let startX = 0;
    this.slider.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    this.slider.addEventListener('touchend', (e) => {
      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) this.next();
        else this.prev();
        this.resetTimer();
      }
    }, { passive: true });

    // Pause on hover
    this.slider.addEventListener('mouseenter', () => this.stopTimer());
    this.slider.addEventListener('mouseleave', () => this.startTimer());

    this.startTimer();
  }

  goToSlide(index) {
    this.currentIndex = (index + this.totalSlides) % this.totalSlides;
    this.slides.forEach((slide, idx) => {
      if (idx === this.currentIndex) {
        slide.classList.remove('opacity-0', 'pointer-events-none', 'z-0');
        slide.classList.add('opacity-100', 'z-10');
      } else {
        slide.classList.remove('opacity-100', 'z-10');
        slide.classList.add('opacity-0', 'pointer-events-none', 'z-0');
      }
    });

    this.dots.forEach((dot, idx) => {
      if (idx === this.currentIndex) {
        dot.classList.add('bg-sun-yellow', 'w-8');
        dot.classList.remove('bg-white/50', 'w-3');
      } else {
        dot.classList.remove('bg-sun-yellow', 'w-8');
        dot.classList.add('bg-white/50', 'w-3');
      }
    });
  }

  next() {
    this.goToSlide(this.currentIndex + 1);
  }

  prev() {
    this.goToSlide(this.currentIndex - 1);
  }

  startTimer() {
    this.stopTimer();
    this.timer = setInterval(() => this.next(), this.interval);
  }

  stopTimer() {
    if (this.timer) clearInterval(this.timer);
  }

  resetTimer() {
    this.startTimer();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const sliderEl = document.getElementById('hero-slider');
  if (sliderEl) {
    new HeroSlider(sliderEl);
  }
});
