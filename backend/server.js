/**
 * EnviroRise Clearance (ERC) — Express Backend Server
 * Designed for deployment on Render (Web Service).
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Data file paths
const DATA_DIR = path.join(__dirname, 'data');
const REVIEWS_FILE = path.join(DATA_DIR, 'reviews.json');
const GALLERY_FILE = path.join(DATA_DIR, 'gallery.json');
const INQUIRIES_FILE = path.join(DATA_DIR, 'inquiries.json');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');

// Helper to safely read JSON
function readJson(filePath, defaultData = []) {
  try {
    if (!fs.existsSync(filePath)) {
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

// Helper to safely write JSON
function writeJson(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
    return false;
  }
}

// Ensure files exist
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(INQUIRIES_FILE)) fs.writeFileSync(INQUIRIES_FILE, JSON.stringify([], null, 2));
if (!fs.existsSync(MESSAGES_FILE)) fs.writeFileSync(MESSAGES_FILE, JSON.stringify([], null, 2));

// ==================== ROUTES ====================

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'EnviroRise Clearance API',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 1. REVIEWS ENDPOINTS
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
    author,
    organisation: organisation || 'Industry Client',
    category: category || 'Built Environment',
    quote,
    rating: Number(rating) || 5,
    date: new Date().toISOString().split('T')[0],
    verified: true
  };

  reviews.unshift(newReview);
  writeJson(REVIEWS_FILE, reviews);

  res.status(201).json({ success: true, review: newReview });
});

// 2. GALLERY ENDPOINTS
app.get('/api/gallery', (req, res) => {
  const { category } = req.query;
  let gallery = readJson(GALLERY_FILE, []);

  if (category && category !== 'All') {
    gallery = gallery.filter(item => (item.category || '').toLowerCase() === category.toLowerCase());
  }

  res.json(gallery);
});

app.post('/api/gallery', (req, res) => {
  const { title, category, description, image, thumb } = req.body;
  if (!title || !category || !image) {
    return res.status(400).json({ error: 'Title, category, and image URL are required' });
  }

  const gallery = readJson(GALLERY_FILE, []);
  const newItem = {
    id: `gal-${Date.now()}`,
    title,
    category,
    description: description || '',
    image,
    thumb: thumb || image,
    aspect: req.body.aspect || 'landscape'
  };

  gallery.unshift(newItem);
  writeJson(GALLERY_FILE, gallery);

  res.status(201).json({ success: true, item: newItem });
});

// 3. INQUIRIES ENDPOINTS (From Floating Drawer & CTA buttons)
app.post(['/api/inquiries', '/api/inquiry'], (req, res) => {
  const { name, email, phone, service, message } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ error: 'Name and phone are required' });
  }

  const inquiries = readJson(INQUIRIES_FILE, []);
  const newInquiry = {
    id: `inq-${Date.now()}`,
    name,
    email: email || '',
    phone,
    service: service || 'General Inquiry',
    message: message || '',
    submittedAt: new Date().toISOString()
  };

  inquiries.unshift(newInquiry);
  writeJson(INQUIRIES_FILE, inquiries);

  console.log(`[INQUIRY RECEIVED] from ${name} (${phone}) for ${newInquiry.service}`);
  res.status(201).json({ success: true, inquiry: newInquiry });
});

app.get(['/api/inquiries', '/api/inquiry'], (req, res) => {
  const inquiries = readJson(INQUIRIES_FILE, []);
  res.json(inquiries);
});

// 4. CONTACT MESSAGES ENDPOINTS (From Contact Us page)
app.post(['/api/contact', '/api/contacts'], (req, res) => {
  const { name, email, phone, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }

  const messages = readJson(MESSAGES_FILE, []);
  const newMessage = {
    id: `msg-${Date.now()}`,
    name,
    email,
    phone: phone || '',
    message,
    submittedAt: new Date().toISOString()
  };

  messages.unshift(newMessage);
  writeJson(MESSAGES_FILE, messages);

  console.log(`[MESSAGE RECEIVED] from ${name} (${email})`);
  res.status(201).json({ success: true, message: newMessage });
});

app.get('/api/contact', (req, res) => {
  const messages = readJson(MESSAGES_FILE, []);
  res.json(messages);
});

// ==================== STATIC FRONTEND SERVING ====================
// Serves the full website when running the backend locally or on preview host
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
  console.log(`=======================================================`);
});
