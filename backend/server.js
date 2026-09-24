/**
 * EnviroRise Clearance (ERC) — Dynamic Express Backend Server & API
 * Production-ready for Render (Web Service) & Local Development
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const ADMIN_KEY = process.env.ADMIN_KEY || 'envirorise2026';

// Request body parser with 20MB limit for image uploads
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-key']
}));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));

// Data file paths
const DATA_DIR = path.join(__dirname, 'data');
const ROOT_DATA_DIR = path.join(__dirname, '..', 'data');
const REVIEWS_FILE = path.join(DATA_DIR, 'reviews.json');
const GALLERY_FILE = path.join(DATA_DIR, 'gallery.json');
const INQUIRIES_FILE = path.join(DATA_DIR, 'inquiries.json');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');
const CLIENTELE_FILE = path.join(DATA_DIR, 'clientele.json');
const SERVICES_FILE = path.join(DATA_DIR, 'services.json');
const TEAM_FILE = path.join(DATA_DIR, 'team.json');

// Uploads directory
const UPLOADS_DIR = path.join(__dirname, '..', 'assets', 'images', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  try {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  } catch (e) {
    console.warn('Could not create uploads directory:', e.message);
  }
}

// Helpers for safe JSON I/O
function readJson(filePath, defaultData = []) {
  try {
    if (!fs.existsSync(filePath)) {
      // Check if root data exists as fallback
      const baseName = path.basename(filePath);
      const rootFallback = path.join(ROOT_DATA_DIR, baseName);
      if (fs.existsSync(rootFallback)) {
        const content = fs.readFileSync(rootFallback, 'utf-8');
        fs.writeFileSync(filePath, content);
        return JSON.parse(content);
      }
      fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
      return defaultData;
    }
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return defaultData;
  }
}

function writeJson(filePath, data) {
  try {
    const formatted = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, formatted);

    // Also mirror to root data directory if it exists
    const baseName = path.basename(filePath);
    const rootFallback = path.join(ROOT_DATA_DIR, baseName);
    if (fs.existsSync(ROOT_DATA_DIR)) {
      fs.writeFileSync(rootFallback, formatted);
    }
    return true;
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
    return false;
  }
}

// Initialize required files
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(INQUIRIES_FILE)) writeJson(INQUIRIES_FILE, []);
if (!fs.existsSync(MESSAGES_FILE)) writeJson(MESSAGES_FILE, []);

// Simple Admin Authentication Middleware
function requireAdmin(req, res, next) {
  const authHeader = req.headers['authorization'];
  const headerKey = req.headers['x-admin-key'];
  const token = headerKey || (authHeader && authHeader.replace(/^Bearer\s+/i, ''));

  if (!token || token !== ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorized: Invalid Admin Key' });
  }
  next();
}

// ==================== API ROUTES ====================

// 1. Healthcheck
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'EnviroRise Clearance API',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    features: ['reviews', 'gallery', 'inquiries', 'contact', 'clientele', 'services', 'team', 'uploads']
  });
});

// Admin login verification
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_KEY) {
    return res.json({ success: true, token: ADMIN_KEY });
  }
  return res.status(401).json({ success: false, error: 'Incorrect password' });
});

// 2. REVIEWS & TESTIMONIALS ENDPOINTS
app.get('/api/reviews', (req, res) => {
  const reviews = readJson(REVIEWS_FILE, []);
  res.json(reviews);
});

app.post('/api/reviews', (req, res) => {
  const { author, organisation, category, quote, rating } = req.body;
  if (!author || !quote) {
    return res.status(400).json({ error: 'Author and quote are required' });
  }

  const reviews = readJson(REVIEWS_FILE, []);
  const newReview = {
    id: `rev-${Date.now()}`,
    author: String(author).trim(),
    organisation: String(organisation || 'Industry Client').trim(),
    category: String(category || 'Built Environment').trim(),
    quote: String(quote).trim(),
    rating: Number(rating) || 5,
    date: new Date().toISOString().split('T')[0],
    verified: true
  };

  reviews.unshift(newReview);
  writeJson(REVIEWS_FILE, reviews);

  console.log(`[REVIEW ADDED] by ${newReview.author} (${newReview.organisation})`);
  res.status(201).json({ success: true, review: newReview });
});

app.delete('/api/reviews/:id', (req, res) => {
  const { id } = req.params;
  let reviews = readJson(REVIEWS_FILE, []);
  const initialLength = reviews.length;
  reviews = reviews.filter(r => r.id !== id);

  if (reviews.length === initialLength) {
    return res.status(404).json({ error: 'Review not found' });
  }

  writeJson(REVIEWS_FILE, reviews);
  console.log(`[REVIEW DELETED] id: ${id}`);
  res.json({ success: true, message: 'Review deleted successfully' });
});

// 3. GALLERY ENDPOINTS
app.get('/api/gallery', (req, res) => {
  const { category } = req.query;
  let gallery = readJson(GALLERY_FILE, []);

  if (category && category !== 'All') {
    gallery = gallery.filter(item => (item.category || '').toLowerCase() === category.toLowerCase());
  }

  res.json(gallery);
});

app.post('/api/gallery', (req, res) => {
  const { title, category, description, image, thumb, aspect } = req.body;
  if (!title || !category || !image) {
    return res.status(400).json({ error: 'Title, category, and image URL are required' });
  }

  const gallery = readJson(GALLERY_FILE, []);
  const newItem = {
    id: `gal-${Date.now()}`,
    title: String(title).trim(),
    category: String(category).trim(),
    description: String(description || '').trim(),
    image: String(image).trim(),
    thumb: String(thumb || image).trim(),
    aspect: aspect || 'landscape',
    addedAt: new Date().toISOString()
  };

  gallery.unshift(newItem);
  writeJson(GALLERY_FILE, gallery);

  console.log(`[GALLERY ITEM ADDED] ${newItem.title} (${newItem.category})`);
  res.status(201).json({ success: true, item: newItem });
});

app.delete('/api/gallery/:id', (req, res) => {
  const { id } = req.params;
  let gallery = readJson(GALLERY_FILE, []);
  const initialLength = gallery.length;
  gallery = gallery.filter(g => g.id !== id);

  if (gallery.length === initialLength) {
    return res.status(404).json({ error: 'Gallery photo not found' });
  }

  writeJson(GALLERY_FILE, gallery);
  console.log(`[GALLERY PHOTO DELETED] id: ${id}`);
  res.json({ success: true, message: 'Gallery item deleted successfully' });
});

// 4. INQUIRIES ENDPOINTS (Consultation Drawer & Hero CTAs)
app.post(['/api/inquiries', '/api/inquiry'], (req, res) => {
  const { name, email, phone, service, message } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ error: 'Name and phone are required' });
  }

  const inquiries = readJson(INQUIRIES_FILE, []);
  const newInquiry = {
    id: `inq-${Date.now()}`,
    name: String(name).trim(),
    email: String(email || '').trim(),
    phone: String(phone).trim(),
    service: String(service || 'General Inquiry').trim(),
    message: String(message || '').trim(),
    status: 'New',
    submittedAt: new Date().toISOString()
  };

  inquiries.unshift(newInquiry);
  writeJson(INQUIRIES_FILE, inquiries);

  console.log(`[INQUIRY RECEIVED] from ${newInquiry.name} (${newInquiry.phone}) for ${newInquiry.service}`);
  res.status(201).json({ success: true, inquiry: newInquiry });
});

app.get(['/api/inquiries', '/api/inquiry'], (req, res) => {
  const inquiries = readJson(INQUIRIES_FILE, []);
  res.json(inquiries);
});

app.patch('/api/inquiries/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const inquiries = readJson(INQUIRIES_FILE, []);
  const target = inquiries.find(i => i.id === id);

  if (!target) return res.status(404).json({ error: 'Inquiry not found' });
  if (status) target.status = status;
  writeJson(INQUIRIES_FILE, inquiries);

  res.json({ success: true, inquiry: target });
});

app.delete('/api/inquiries/:id', (req, res) => {
  const { id } = req.params;
  let inquiries = readJson(INQUIRIES_FILE, []);
  inquiries = inquiries.filter(i => i.id !== id);
  writeJson(INQUIRIES_FILE, inquiries);
  res.json({ success: true });
});

// 5. CONTACT MESSAGES ENDPOINTS (Contact Us Page)
app.post(['/api/contact', '/api/contacts'], (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }

  const messages = readJson(MESSAGES_FILE, []);
  const newMessage = {
    id: `msg-${Date.now()}`,
    name: String(name).trim(),
    email: String(email).trim(),
    phone: String(phone || '').trim(),
    subject: String(subject || 'General Inquiry').trim(),
    message: String(message).trim(),
    status: 'Unread',
    submittedAt: new Date().toISOString()
  };

  messages.unshift(newMessage);
  writeJson(MESSAGES_FILE, messages);

  console.log(`[CONTACT MESSAGE] from ${newMessage.name} (${newMessage.email})`);
  res.status(201).json({ success: true, message: newMessage });
});

app.get('/api/contact', (req, res) => {
  const messages = readJson(MESSAGES_FILE, []);
  res.json(messages);
});

app.delete('/api/contact/:id', (req, res) => {
  const { id } = req.params;
  let messages = readJson(MESSAGES_FILE, []);
  messages = messages.filter(m => m.id !== id);
  writeJson(MESSAGES_FILE, messages);
  res.json({ success: true });
});

// 6. CLIENTELE, SERVICES & TEAM READ-ONLY ENDPOINTS
app.get('/api/clientele', (req, res) => {
  const data = readJson(CLIENTELE_FILE, {});
  res.json(data);
});

app.get('/api/services', (req, res) => {
  const data = readJson(SERVICES_FILE, {});
  res.json(data);
});

app.get('/api/team', (req, res) => {
  const data = readJson(TEAM_FILE, {});
  res.json(data);
});

// 7. FILE / IMAGE UPLOAD (Base64 data handler)
app.post('/api/upload', (req, res) => {
  try {
    const { filename, data } = req.body;
    if (!data) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    // Match data:image/png;base64,...
    const matches = data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let buffer;
    let ext = 'jpg';

    if (matches && matches.length === 3) {
      const mime = matches[1];
      if (mime.includes('png')) ext = 'png';
      else if (mime.includes('webp')) ext = 'webp';
      else if (mime.includes('svg')) ext = 'svg';
      buffer = Buffer.from(matches[2], 'base64');
    } else {
      buffer = Buffer.from(data, 'base64');
    }

    const safeName = (filename ? filename.replace(/[^a-zA-Z0-9_-]/g, '_') : `upload_${Date.now()}`) + '.' + ext;
    const savePath = path.join(UPLOADS_DIR, safeName);

    fs.writeFileSync(savePath, buffer);
    const publicUrl = `assets/images/uploads/${safeName}`;

    console.log(`[FILE UPLOADED] ${safeName} (${buffer.length} bytes)`);
    res.json({ success: true, url: publicUrl, filename: safeName, size: buffer.length });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Upload failed: ' + err.message });
  }
});

// ==================== STATIC FRONTEND SERVING ====================
const ROOT_DIR = path.join(__dirname, '..');
app.use(express.static(ROOT_DIR));

// Clean URL routing: e.g. /our-company -> our-company.html
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();

  const cleanPath = req.path.replace(/^\/+|\/+$/g, '');
  if (!cleanPath) {
    return res.sendFile(path.join(ROOT_DIR, 'index.html'));
  }

  const directFile = path.join(ROOT_DIR, cleanPath);
  if (fs.existsSync(directFile) && fs.statSync(directFile).isFile()) {
    return res.sendFile(directFile);
  }

  const htmlFile = path.join(ROOT_DIR, `${cleanPath}.html`);
  if (fs.existsSync(htmlFile) && fs.statSync(htmlFile).isFile()) {
    return res.sendFile(htmlFile);
  }

  const notFoundFile = path.join(ROOT_DIR, '404.html');
  if (fs.existsSync(notFoundFile)) {
    return res.status(404).sendFile(notFoundFile);
  }
  return res.status(404).send('Page Not Found');
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`=======================================================`);
  console.log(` EnviroRise Clearance Website & API running on port ${PORT}`);
  console.log(` Website:     http://localhost:${PORT}`);
  console.log(` Healthcheck: http://localhost:${PORT}/api/health`);
  console.log(` Admin Key:   ${ADMIN_KEY}`);
  console.log(`=======================================================`);
});
