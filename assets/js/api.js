/**
 * EnviroRise Clearance (ERC) — Dynamic API Client Layer
 * Handles communication with Render backend or seamless offline/mock mode.
 */

const ERCApi = (() => {
  // Configurable Backend URL (Default pointing to Render instance or localStorage override)
  let baseUrl = window.ERC_API_URL || localStorage.getItem('erc_api_url') || 'https://envirorise-backend.onrender.com';

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  });

  return {
    getBaseUrl: () => baseUrl,
    setBaseUrl: (newUrl) => {
      baseUrl = newUrl;
      localStorage.setItem('erc_api_url', newUrl);
    },

    // Check if backend server is accessible
    checkHealth: async () => {
      try {
        const res = await fetch(`${baseUrl}/api/health`, { method: 'GET', signal: AbortSignal.timeout(3000) });
        return res.ok;
      } catch (err) {
        return false;
      }
    },

    // Get Reviews (from API with fallback to static seed data + localStorage)
    getReviews: async () => {
      // Try backend first
      try {
        const res = await fetch(`${baseUrl}/api/reviews`, { method: 'GET', signal: AbortSignal.timeout(3500) });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            return data;
          }
        }
      } catch (err) {
        console.warn('Backend API unavailable. Loading local fallback reviews data.');
      }

      // Fallback: Fetch seed JSON + localStorage
      try {
        // Handle path whether on root or nested folder
        const prefix = window.location.pathname.includes('/about-us/') || window.location.pathname.includes('/services/') ? '../' : './';
        const res = await fetch(`${prefix}data/reviews.json`);
        let list = await res.json();
        
        // Merge user-submitted local reviews
        const localReviews = JSON.parse(localStorage.getItem('erc_local_reviews') || '[]');
        if (Array.isArray(localReviews) && localReviews.length > 0) {
          list = [...localReviews, ...list];
        }
        return list;
      } catch (e) {
        console.error('Failed to load seed reviews:', e);
        return [];
      }
    },

    // Submit Review
    submitReview: async (review) => {
      const newReview = {
        id: 'rev-' + Date.now(),
        ...review,
        date: new Date().toISOString().split('T')[0],
        verified: true
      };

      // Try sending to Render API
      try {
        const res = await fetch(`${baseUrl}/api/reviews`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify(newReview),
          signal: AbortSignal.timeout(4000)
        });
        if (res.ok) {
          const result = await res.json();
          return { success: true, review: result.review || newReview, remote: true };
        }
      } catch (err) {
        console.warn('Backend API offline. Storing review locally in browser.');
      }

      // Store in local storage for immediate persistence
      const current = JSON.parse(localStorage.getItem('erc_local_reviews') || '[]');
      current.unshift(newReview);
      localStorage.setItem('erc_local_reviews', JSON.stringify(current));

      return { success: true, review: newReview, remote: false };
    },

    // Get Gallery Photos
    getGallery: async (category = 'All') => {
      // Try backend first
      try {
        const url = `${baseUrl}/api/gallery` + (category && category !== 'All' ? `?category=${encodeURIComponent(category)}` : '');
        const res = await fetch(url, { method: 'GET', signal: AbortSignal.timeout(3500) });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) return data;
        }
      } catch (err) {
        // Fallback to local
      }

      try {
        const prefix = window.location.pathname.includes('/about-us/') || window.location.pathname.includes('/services/') ? '../' : './';
        const res = await fetch(`${prefix}data/gallery.json`);
        let items = await res.json();
        if (category && category !== 'All') {
          items = items.filter(item => item.category.toLowerCase() === category.toLowerCase());
        }
        return items;
      } catch (e) {
        console.error('Failed to load gallery items:', e);
        return [];
      }
    },

    // Submit Inquiry (from floating drawer or Talk to Expert)
    submitInquiry: async (inquiry) => {
      const record = {
        id: 'inq-' + Date.now(),
        ...inquiry,
        submittedAt: new Date().toISOString()
      };

      // Try backend
      try {
        const res = await fetch(`${baseUrl}/api/inquiries`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify(record),
          signal: AbortSignal.timeout(4000)
        });
        if (res.ok) {
          return { success: true, remote: true };
        }
      } catch (err) {
        console.warn('Backend offline. Saving inquiry to browser cache.');
      }

      const stored = JSON.parse(localStorage.getItem('erc_inquiries') || '[]');
      stored.unshift(record);
      localStorage.setItem('erc_inquiries', JSON.stringify(stored));

      return { success: true, remote: false };
    },

    // Submit Contact Message
    submitContact: async (message) => {
      const record = {
        id: 'msg-' + Date.now(),
        ...message,
        submittedAt: new Date().toISOString()
      };

      try {
        const res = await fetch(`${baseUrl}/api/contact`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify(record),
          signal: AbortSignal.timeout(4000)
        });
        if (res.ok) {
          return { success: true, remote: true };
        }
      } catch (err) {
        console.warn('Backend offline. Saving contact message to browser cache.');
      }

      const stored = JSON.parse(localStorage.getItem('erc_contact_messages') || '[]');
      stored.unshift(record);
      localStorage.setItem('erc_contact_messages', JSON.stringify(stored));

      return { success: true, remote: false };
    }
  };
})();

window.ERCApi = ERCApi;
