/**
 * EnviroRise Clearance (ERC) — Dynamic API Client Layer
 * Handles communication with Render backend or seamless offline/mock mode.
 */

const ERCApi = (() => {
  // Configurable Backend URL (Auto-detects localhost or defaults to Render)
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const defaultLocalApi = window.location.port === '5000' ? '' : 'http://localhost:5000';
  let baseUrl = window.ERC_API_URL || 
                localStorage.getItem('erc_api_url') || 
                (isLocal ? defaultLocalApi : 'https://envirorise-backend.onrender.com');

  const getHeaders = (extraHeaders = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...extraHeaders
    };
    const token = localStorage.getItem('erc_admin_token');
    if (token) {
      headers['x-admin-key'] = token;
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  return {
    getBaseUrl: () => baseUrl,
    setBaseUrl: (newUrl) => {
      baseUrl = newUrl.replace(/\/+$/, '');
      localStorage.setItem('erc_api_url', baseUrl);
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

    // Admin Authentication
    adminLogin: async (password) => {
      try {
        const res = await fetch(`${baseUrl}/api/admin/login`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({ password })
        });
        const data = await res.json();
        if (data.success && data.token) {
          localStorage.setItem('erc_admin_token', data.token);
          return { success: true };
        }
        return { success: false, error: data.error || 'Invalid credentials' };
      } catch (e) {
        // Fallback offline password check
        if (password === 'envirorise2026' || password === 'admin123') {
          localStorage.setItem('erc_admin_token', password);
          return { success: true, offline: true };
        }
        return { success: false, error: 'Connection failed: ' + e.message };
      }
    },

    logout: () => {
      localStorage.removeItem('erc_admin_token');
    },

    isAdminLoggedIn: () => {
      return !!localStorage.getItem('erc_admin_token');
    },

    // Get Reviews (from API with fallback to static seed data + localStorage)
    getReviews: async () => {
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
        const prefix = window.location.pathname.includes('/about-us/') || window.location.pathname.includes('/services/') ? '../' : './';
        const res = await fetch(`${prefix}data/reviews.json`);
        let list = await res.json();
        
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

      const current = JSON.parse(localStorage.getItem('erc_local_reviews') || '[]');
      current.unshift(newReview);
      localStorage.setItem('erc_local_reviews', JSON.stringify(current));

      return { success: true, review: newReview, remote: false };
    },

    // Delete Review (Admin)
    deleteReview: async (id) => {
      try {
        const res = await fetch(`${baseUrl}/api/reviews/${id}`, {
          method: 'DELETE',
          headers: getHeaders()
        });
        if (res.ok) return { success: true };
      } catch (e) {
        console.warn('Backend delete failed, removing locally.');
      }
      let current = JSON.parse(localStorage.getItem('erc_local_reviews') || '[]');
      current = current.filter(r => r.id !== id);
      localStorage.setItem('erc_local_reviews', JSON.stringify(current));
      return { success: true };
    },

    // Get Gallery Photos
    getGallery: async (category = 'All') => {
      try {
        const url = `${baseUrl}/api/gallery` + (category && category !== 'All' ? `?category=${encodeURIComponent(category)}` : '');
        const res = await fetch(url, { method: 'GET', signal: AbortSignal.timeout(3500) });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) return data;
        }
      } catch (err) {
        // Fallback
      }

      try {
        const prefix = window.location.pathname.includes('/about-us/') || window.location.pathname.includes('/services/') ? '../' : './';
        const res = await fetch(`${prefix}data/gallery.json`);
        let items = await res.json();
        const localGallery = JSON.parse(localStorage.getItem('erc_local_gallery') || '[]');
        if (Array.isArray(localGallery) && localGallery.length > 0) {
          items = [...localGallery, ...items];
        }
        if (category && category !== 'All') {
          items = items.filter(item => (item.category || '').toLowerCase() === category.toLowerCase());
        }
        return items;
      } catch (e) {
        console.error('Failed to load gallery items:', e);
        return [];
      }
    },

    // Submit Gallery Item (Admin)
    submitGalleryItem: async (item) => {
      const newItem = {
        id: 'gal-' + Date.now(),
        ...item
      };

      try {
        const res = await fetch(`${baseUrl}/api/gallery`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify(newItem),
          signal: AbortSignal.timeout(5000)
        });
        if (res.ok) {
          const result = await res.json();
          return { success: true, item: result.item || newItem, remote: true };
        }
      } catch (e) {
        console.warn('Backend offline, saving gallery item locally.');
      }

      const stored = JSON.parse(localStorage.getItem('erc_local_gallery') || '[]');
      stored.unshift(newItem);
      localStorage.setItem('erc_local_gallery', JSON.stringify(stored));
      return { success: true, item: newItem, remote: false };
    },

    // Delete Gallery Item (Admin)
    deleteGalleryItem: async (id) => {
      try {
        const res = await fetch(`${baseUrl}/api/gallery/${id}`, {
          method: 'DELETE',
          headers: getHeaders()
        });
        if (res.ok) return { success: true };
      } catch (e) {
        console.warn('Backend delete failed, removing locally.');
      }
      let stored = JSON.parse(localStorage.getItem('erc_local_gallery') || '[]');
      stored = stored.filter(g => g.id !== id);
      localStorage.setItem('erc_local_gallery', JSON.stringify(stored));
      return { success: true };
    },

    // Submit Inquiry (from floating drawer or Talk to Expert)
    submitInquiry: async (inquiry) => {
      const record = {
        id: 'inq-' + Date.now(),
        ...inquiry,
        submittedAt: new Date().toISOString()
      };

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

    // Get Inquiries (Admin)
    getInquiries: async () => {
      try {
        const res = await fetch(`${baseUrl}/api/inquiries`, {
          method: 'GET',
          headers: getHeaders()
        });
        if (res.ok) return await res.json();
      } catch (e) {
        // Fallback to local
      }
      return JSON.parse(localStorage.getItem('erc_inquiries') || '[]');
    },

    // Update Inquiry Status (Admin)
    updateInquiryStatus: async (id, status) => {
      try {
        const res = await fetch(`${baseUrl}/api/inquiries/${id}`, {
          method: 'PATCH',
          headers: getHeaders(),
          body: JSON.stringify({ status })
        });
        if (res.ok) return { success: true };
      } catch (e) {
        console.warn('Backend update failed, updating locally.');
      }
      const list = JSON.parse(localStorage.getItem('erc_inquiries') || '[]');
      const target = list.find(i => i.id === id);
      if (target) target.status = status;
      localStorage.setItem('erc_inquiries', JSON.stringify(list));
      return { success: true };
    },

    // Delete Inquiry (Admin)
    deleteInquiry: async (id) => {
      try {
        const res = await fetch(`${baseUrl}/api/inquiries/${id}`, {
          method: 'DELETE',
          headers: getHeaders()
        });
        if (res.ok) return { success: true };
      } catch (e) {
        // Fallback
      }
      let list = JSON.parse(localStorage.getItem('erc_inquiries') || '[]');
      list = list.filter(i => i.id !== id);
      localStorage.setItem('erc_inquiries', JSON.stringify(list));
      return { success: true };
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
    },

    // Get Contact Messages (Admin)
    getContactMessages: async () => {
      try {
        const res = await fetch(`${baseUrl}/api/contact`, {
          method: 'GET',
          headers: getHeaders()
        });
        if (res.ok) return await res.json();
      } catch (e) {
        // Fallback
      }
      return JSON.parse(localStorage.getItem('erc_contact_messages') || '[]');
    },

    // Delete Contact Message (Admin)
    deleteContactMessage: async (id) => {
      try {
        const res = await fetch(`${baseUrl}/api/contact/${id}`, {
          method: 'DELETE',
          headers: getHeaders()
        });
        if (res.ok) return { success: true };
      } catch (e) {
        // Fallback
      }
      let list = JSON.parse(localStorage.getItem('erc_contact_messages') || '[]');
      list = list.filter(m => m.id !== id);
      localStorage.setItem('erc_contact_messages', JSON.stringify(list));
      return { success: true };
    },

    // Image Upload
    uploadImage: async (base64Data, filename) => {
      try {
        const res = await fetch(`${baseUrl}/api/upload`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({ data: base64Data, filename })
        });
        if (res.ok) {
          return await res.json();
        }
      } catch (e) {
        console.warn('Upload API failed:', e);
      }
      // Fallback: return base64 data directly for immediate rendering
      return { success: true, url: base64Data };
    }
  };
})();

window.ERCApi = ERCApi;
