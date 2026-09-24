/**
 * EnviroRise Clearance (ERC) — Dynamic Reviews Module
 * Manages reviews carousel on Home, filterable grid on Reviews page, and review submission modal.
 */

document.addEventListener('DOMContentLoaded', () => {
  initHomeReviewsCarousel();
  initReviewsPageGrid();
  initSubmitReviewModal();
});

// Category photo mapping for review cards
const categoryPhotoMap = {
  'built environment': 'assets/images/reviews/reviews_built_environment.jpg',
  'industry & manufacturing': 'assets/images/reviews/reviews_industry_manufacturing.jpg',
  'social impact': 'assets/images/about/commitments_sapling_planting.jpg',
  'renewable energy': 'assets/images/reviews/reviews_renewable_energy.jpg',
  'research & academia': 'assets/images/reviews/reviews_research_academia.jpg',
  'transport & logistics': 'assets/images/reviews/reviews_transport_logistics.jpg'
};

function getCategoryPhoto(cat) {
  const prefix = window.location.pathname.includes('/about-us/') || window.location.pathname.includes('/services/') ? '../' : './';
  const key = (cat || '').toLowerCase().trim();
  const relPath = categoryPhotoMap[key] || 'assets/images/reviews/reviews_built_environment.jpg';
  return prefix + relPath;
}

function renderStars(rating = 5) {
  let starsHtml = '';
  for (let i = 1; i <= 5; i++) {
    const filled = i <= rating;
    starsHtml += `<span class="material-symbols-outlined text-[18px] ${filled ? 'text-sun-yellow' : 'text-gray-300'}">star</span>`;
  }
  return `<div class="flex items-center gap-0.5 mb-3">${starsHtml}</div>`;
}

// 1. Home Reviews Carousel
async function initHomeReviewsCarousel() {
  const container = document.getElementById('home-reviews-track');
  if (!container) return;

  const reviews = await ERCApi.getReviews();
  if (!reviews || !reviews.length) return;

  let activeIndex = 0;
  const cardsPerView = window.innerWidth >= 1024 ? 3 : (window.innerWidth >= 640 ? 2 : 1);

  function renderCarousel() {
    container.innerHTML = reviews.map((rev, idx) => `
      <div class="erc-review-slide w-full sm:w-1/2 lg:w-1/3 shrink-0 px-3">
        <div class="erc-card bg-white rounded-[20px] p-7 shadow-[0_10px_30px_rgba(11,95,95,0.08)] flex flex-col justify-between h-full border border-border/50">
          <div>
            <div class="flex items-center justify-between mb-4">
              <span class="material-symbols-outlined text-[42px] text-fresh-green leading-none">format_quote</span>
              ${renderStars(rev.rating)}
            </div>
            <p class="font-body text-[16px] text-text-muted leading-relaxed italic mb-6">
              "${rev.quote}"
            </p>
          </div>
          <div>
            <div class="h-[1px] bg-fresh-green/30 w-full mb-4"></div>
            <div class="flex items-center gap-3">
              <div class="w-11 h-11 rounded-full bg-mint-tint flex items-center justify-center text-primary-teal font-bold text-sm shrink-0">
                ${(rev.author || 'C').substring(0, 2).toUpperCase()}
              </div>
              <div class="overflow-hidden">
                <h4 class="font-heading font-bold text-deep-teal text-[15px] truncate">${rev.author}</h4>
                <p class="font-body text-[13px] text-text-muted truncate">${rev.organisation}</p>
              </div>
            </div>
            <div class="mt-3">
              <span class="inline-block px-2.5 py-1 rounded-full bg-mint-tint text-leaf-green text-[11px] font-semibold tracking-wider uppercase">
                ${rev.category}
              </span>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  renderCarousel();

  const prevBtn = document.getElementById('reviews-prev');
  const nextBtn = document.getElementById('reviews-next');
  const dotsContainer = document.getElementById('reviews-dots');

  const maxIndex = Math.max(0, reviews.length - cardsPerView);

  function updateDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    for (let i = 0; i <= maxIndex; i++) {
      const dot = document.createElement('button');
      dot.className = `w-3 h-3 rounded-full transition-all duration-300 ${i === activeIndex ? 'bg-primary-teal w-7' : 'bg-gray-300'}`;
      dot.addEventListener('click', () => {
        activeIndex = i;
        slide();
      });
      dotsContainer.appendChild(dot);
    }
  }

  function slide() {
    const shiftPercent = (activeIndex * (100 / cardsPerView));
    container.style.transform = `translateX(-${shiftPercent}%)`;
    container.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    updateDots();
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      activeIndex = activeIndex > 0 ? activeIndex - 1 : maxIndex;
      slide();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      activeIndex = activeIndex < maxIndex ? activeIndex + 1 : 0;
      slide();
    });
  }

  updateDots();

  // Auto advance every 5s
  let autoTimer = setInterval(() => {
    if (nextBtn) nextBtn.click();
  }, 5000);

  container.addEventListener('mouseenter', () => clearInterval(autoTimer));
  container.addEventListener('mouseleave', () => {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => {
      if (nextBtn) nextBtn.click();
    }, 5000);
  });
}

// 2. Reviews Page Grid
async function initReviewsPageGrid() {
  const grid = document.getElementById('reviews-grid');
  if (!grid) return;

  let allReviews = await ERCApi.getReviews();
  let currentCategory = 'All';

  function renderGrid() {
    const filtered = currentCategory === 'All' 
      ? allReviews 
      : allReviews.filter(r => (r.category || '').toLowerCase() === currentCategory.toLowerCase());

    if (!filtered.length) {
      grid.innerHTML = `
        <div class="col-span-full text-center py-16">
          <span class="material-symbols-outlined text-[48px] text-muted mb-2">rate_review</span>
          <p class="font-body text-text-muted text-lg">No reviews found in this category.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(rev => `
      <div class="erc-card bg-white rounded-[20px] shadow-[0_10px_30px_rgba(11,95,95,0.08)] flex flex-col justify-between overflow-hidden border border-border/60 transition-all hover:-translate-y-1.5 hover:shadow-xl">
        <div class="p-8">
          <div class="flex items-center justify-between mb-4">
            <span class="material-symbols-outlined text-[44px] text-fresh-green">format_quote</span>
            ${renderStars(rev.rating)}
          </div>
          <p class="font-body text-[17px] text-text-main leading-relaxed mb-6">
            "${rev.quote}"
          </p>
          <div class="w-12 h-1 bg-fresh-green mb-5 rounded-full"></div>
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-full bg-mint-tint flex items-center justify-center text-primary-teal font-bold text-base shrink-0">
              ${(rev.author || 'C').substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 class="font-heading font-bold text-deep-teal text-[16px]">${rev.author}</h3>
              <p class="font-body text-[14px] text-text-muted">${rev.organisation}</p>
            </div>
          </div>
        </div>
        <div class="relative h-[130px] w-full overflow-hidden bg-deep-teal mt-auto">
          <img src="${getCategoryPhoto(rev.category)}" alt="${rev.category}" class="w-full h-full object-cover opacity-60 transition-transform duration-500 hover:scale-105" loading="lazy">
          <div class="absolute inset-0 bg-gradient-to-t from-deep-teal via-deep-teal/40 to-transparent"></div>
          <div class="absolute bottom-3 left-4 right-4 flex items-center justify-between">
            <span class="px-2.5 py-1 rounded-md bg-white/20 backdrop-blur-sm text-white font-eyebrow text-[11px] font-bold tracking-widest uppercase">
              ${rev.category}
            </span>
            ${rev.date ? `<span class="text-white/70 text-xs">${rev.date}</span>` : ''}
          </div>
        </div>
      </div>
    `).join('');
  }

  renderGrid();

  // Filter Buttons
  const filterBtns = document.querySelectorAll('.review-filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('bg-primary-teal', 'text-white');
        b.classList.add('bg-white', 'text-deep-teal');
      });
      btn.classList.add('bg-primary-teal', 'text-white');
      btn.classList.remove('bg-white', 'text-deep-teal');

      currentCategory = btn.getAttribute('data-category');
      renderGrid();
    });
  });

  window.refreshReviewsGrid = async () => {
    allReviews = await ERCApi.getReviews();
    renderGrid();
  };
}

// 3. Submit Review Modal
function initSubmitReviewModal() {
  const openBtn = document.getElementById('open-add-review-btn');
  const modal = document.getElementById('add-review-modal');
  const backdrop = document.getElementById('review-modal-backdrop');
  const closeBtn = document.getElementById('close-review-modal');
  const form = document.getElementById('submit-review-form');

  if (!modal || !backdrop) return;

  const openModal = () => {
    modal.classList.add('active');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('active');
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (openBtn) openBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);

  // Star Rating Interaction
  let selectedRating = 5;
  const starIcons = modal.querySelectorAll('.star-select-icon');
  starIcons.forEach(icon => {
    icon.addEventListener('click', () => {
      selectedRating = parseInt(icon.getAttribute('data-value'), 10);
      updateStarDisplay(selectedRating);
    });
  });

  function updateStarDisplay(rating) {
    starIcons.forEach(icon => {
      const val = parseInt(icon.getAttribute('data-value'), 10);
      if (val <= rating) {
        icon.classList.add('text-sun-yellow');
        icon.classList.remove('text-gray-300');
      } else {
        icon.classList.remove('text-sun-yellow');
        icon.classList.add('text-gray-300');
      }
    });
  }

  // Handle Form Submission
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      const origText = submitBtn.innerHTML;

      const reviewData = {
        author: form.elements['author']?.value?.trim(),
        organisation: form.elements['organisation']?.value?.trim(),
        category: form.elements['category']?.value || 'Built Environment',
        quote: form.elements['quote']?.value?.trim(),
        rating: selectedRating
      };

      if (!reviewData.author || !reviewData.quote) {
        showToast('Please provide your name and review testimonial.', 'error');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Submitting Review...';

      try {
        await ERCApi.submitReview(reviewData);
        showToast('Thank you! Your review has been added successfully.', 'success');
        form.reset();
        selectedRating = 5;
        updateStarDisplay(5);
        closeModal();

        // Refresh grid if on reviews page
        if (typeof window.refreshReviewsGrid === 'function') {
          window.refreshReviewsGrid();
        }
      } catch (err) {
        showToast('Unable to submit review right now. Please try again.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = origText;
      }
    });
  }
}
