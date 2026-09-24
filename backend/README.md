# EnviroRise Clearance — Dynamic Backend & Management System

Production-ready backend API service and management portal for **EnviroRise Clearance Private Limited**.

---

## 🌟 Features

- **Consultation Inquiries API**: Capture client leads from floating drawers and hero CTAs.
- **Contact Messages API**: Receive and store messages submitted through the Contact Us form.
- **Dynamic Testimonials & Reviews**: Add, list, and delete client reviews with star ratings and industry tags.
- **Dynamic Project Gallery**: Upload and categorize project site photos with thumbnail previews and live sync.
- **Image Upload Pipeline**: Upload photos via Base64/files directly into `assets/images/uploads/`.
- **Integrated Admin Portal (`admin.html`)**: Clean, responsive management dashboard protected with admin key authentication (`envirorise2026`).
- **Render 1-Click Blueprint Support**: Native `render.yaml` configuration for zero-setup deployment.

---

## 🚀 Quick Start (Local Development)

```bash
# From project root:
npm start

# Or from backend directory:
cd backend
npm install
node server.js
```

- **Website**: `http://localhost:5000`
- **Admin Portal**: `http://localhost:5000/admin.html`
- **API Health Check**: `http://localhost:5000/api/health`

---

## 🌐 1-Click Free Deployment on Render

### Option A: Using Render Blueprint (Recommended - 1 Click)
1. Sign in to [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** ➔ **Blueprint**.
3. Connect your repository: `https://github.com/RJ-Rishi91/VIPCLI`.
4. Render will automatically read `render.yaml` and configure the web service with all settings!
5. Click **Apply**.

### Option B: Manual Web Service
1. In Render, click **New +** ➔ **Web Service**.
2. Connect your GitHub repository: `RJ-Rishi91/VIPCLI`.
3. Set the following parameters:
   - **Name**: `envirorise-api`
   - **Environment**: `Node`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: `Free`
   *(Note: If you leave Root Directory empty, set Start Command to `npm start` or `node backend/server.js`)*
4. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `ADMIN_KEY`: `envirorise2026` (or your chosen secret password)
5. Click **Create Web Service** (or **Save Changes**).

---

## 🔗 Connecting GitHub Pages to Render API

Once your Render Web Service is deployed, you will receive a public URL such as:
`https://envirorise-api.onrender.com`

To link your GitHub Pages frontend to your Render backend:
1. Open the website or Admin Portal (`admin.html`).
2. Click the ⚙️ **Settings** button in the top bar.
3. Paste your Render backend URL (e.g. `https://envirorise-api.onrender.com`) and click **Save**.
4. All inquiries, reviews, and gallery additions will now sync directly to your Render cloud database!

---

## 📡 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service status, uptime, and features |
| `POST` | `/api/admin/login` | Verify admin key for portal access |
| `GET` | `/api/reviews` | Fetch published reviews |
| `POST` | `/api/reviews` | Submit a new review |
| `DELETE`| `/api/reviews/:id` | Remove a review |
| `GET` | `/api/gallery` | Fetch project photos (optional `?category=...`) |
| `POST` | `/api/gallery` | Add a new project photo |
| `DELETE`| `/api/gallery/:id` | Remove a gallery photo |
| `POST` | `/api/upload` | Upload image file/base64 to `uploads/` |
| `GET` | `/api/inquiries` | List all consultation inquiries |
| `POST` | `/api/inquiries` | Submit new consultation inquiry |
| `PATCH`| `/api/inquiries/:id` | Update inquiry status (New / Contacted) |
| `DELETE`| `/api/inquiries/:id` | Delete an inquiry |
| `GET` | `/api/contact` | List Contact Us submissions |
| `POST` | `/api/contact` | Submit contact form |
| `DELETE`| `/api/contact/:id` | Delete contact message |
| `GET` | `/api/clientele` | Clientele data |
| `GET` | `/api/services` | Services catalog |
| `GET` | `/api/team` | Management and Core team profiles |
