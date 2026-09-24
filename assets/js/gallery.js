/**
 * EnviroRise Clearance (ERC) — Dynamic Gallery Module
 * Handles category filtering, live search, pagination (Load More), and full-screen lightbox.
 */

document.addEventListener('DOMContentLoaded', () => {
  initGallery();
});

async function initGallery() {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  const filterTabs = document.querySelectorAll('.gallery-filter-btn');
  const searchInput = document.getElementById('gallery-search');
  const loadMoreBtn = document.getElementById('gallery-load-more');
  const lightbox = document.getElementById('gallery-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxCat = document.getElementById('lightbox-cat');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  let allPhotos = await ERCApi.getGallery('All');
  let currentCategory = 'All';
  let searchQuery = '';
  let itemsPerPage = 12;
  let visibleCount = 12;
  let activeLightboxIndex = 0;
  let filteredList = [];

  function filterAndRender() {
    filteredList = allPhotos.filter(item => {
      const matchCat = currentCategory === 'All' || item.category.toLowerCase() === currentCategory.toLowerCase();
      const matchSearch = !searchQuery || 
        item.title.toLowerCase().includes(searchQuery) || 
        item.description.toLowerCase().includes(searchQuery) ||
        item.category.toLowerCase().includes(searchQuery);
      return matchCat && matchSearch;
    });

    const displayList = filteredList.slice(0, visibleCount);

    if (displayList.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full py-16 text-center text-text-muted">
          <span class="material-symbols-outlined text-5xl mb-2 text-primary-teal/50">photo_library</span>
          <p class="text-lg">No photos found matching your criteria.</p>
        </div>
      `;
      if (loadMoreBtn) loadMoreBtn.classList.add('hidden');
      return;
    }

    grid.innerHTML = displayList.map((item, index) => `
      <div class="gallery-item group relative overflow-hidden rounded-[16px] bg-gray-100 shadow-[0_4px_20px_rgba(11,95,95,0.06)] cursor-pointer aspect-[4/3] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
           data-index="${index}">
        <img src="${item.thumb}" alt="${item.title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy">
        <div class="absolute inset-0 bg-gradient-to-t from-deep-teal/90 via-deep-teal/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
          <span class="inline-block self-start px-2.5 py-0.5 rounded-full bg-fresh-green text-white text-[11px] font-semibold tracking-wider uppercase mb-1.5">
            ${item.category}
          </span>
          <h4 class="font-heading font-bold text-white text-base leading-snug drop-shadow-sm">${item.title}</h4>
          <p class="font-body text-white/80 text-xs mt-1 line-clamp-2">${item.description}</p>
          <div class="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
            <span class="material-symbols-outlined text-[20px]">zoom_in</span>
          </div>
        </div>
      </div>
    `).join('');

    // Attach click for lightbox
    grid.querySelectorAll('.gallery-item').forEach(el => {
      el.addEventListener('click', () => {
        const idx = parseInt(el.getAttribute('data-index'), 10);
        openLightbox(idx);
      });
    });

    // Update Load More Button visibility
    if (loadMoreBtn) {
      if (visibleCount >= filteredList.length) {
        loadMoreBtn.classList.add('hidden');
      } else {
        loadMoreBtn.classList.remove('hidden');
      }
    }
  }

  // Filter Tabs Event
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => {
        t.classList.remove('bg-primary-teal', 'text-white');
        t.classList.add('bg-white', 'text-deep-teal');
      });
      tab.classList.add('bg-primary-teal', 'text-white');
      tab.classList.remove('bg-white', 'text-deep-teal');

      currentCategory = tab.getAttribute('data-category');
      visibleCount = itemsPerPage;
      filterAndRender();
    });
  });

  // Search Input Event
  if (searchInput) {
    let debounceTimer;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        searchQuery = e.target.value.toLowerCase().trim();
        visibleCount = itemsPerPage;
        filterAndRender();
      }, 250);
    });
  }

  // Load More Button Event
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      visibleCount += 8;
      filterAndRender();
    });
  }

  // Lightbox Implementation
  function openLightbox(index) {
    if (!lightbox || !filteredList[index]) return;
    activeLightboxIndex = index;
    updateLightboxContent();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function updateLightboxContent() {
    const item = filteredList[activeLightboxIndex];
    if (!item) return;

    if (lightboxImg) lightboxImg.src = item.image;
    if (lightboxTitle) lightboxTitle.textContent = item.title;
    if (lightboxCat) lightboxCat.textContent = item.category;
    if (lightboxDesc) lightboxDesc.textContent = item.description;
    if (lightboxCounter) {
      lightboxCounter.textContent = `${activeLightboxIndex + 1} / ${filteredList.length}`;
    }
  }

  function nextPhoto() {
    activeLightboxIndex = (activeLightboxIndex + 1) % filteredList.length;
    updateLightboxContent();
  }

  function prevPhoto() {
    activeLightboxIndex = (activeLightboxIndex - 1 + filteredList.length) % filteredList.length;
    updateLightboxContent();
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', nextPhoto);
  if (lightboxPrev) lightboxPrev.addEventListener('click', prevPhoto);

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('lightbox-backdrop')) {
        closeLightbox();
      }
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowRight') nextPhoto();
    else if (e.key === 'ArrowLeft') prevPhoto();
  });

  // Initial render
  filterAndRender();
}
