# EnviroRise Clearance (ERC) — Production Website & API

Comprehensive, responsive, dynamic web platform for **EnviroRise Clearance Private Limited (ERCPL)** — an environmental consulting company based in Jaipur, Rajasthan, providing statutory environmental clearances (EC, CTE, CTO, CGWA), EIA assessments, environmental monitoring, compliance audits, and sustainability advisory across India.

---

## 🚀 Live Architecture Overview

- **Frontend**: Responsive multi-page web application built with HTML5, Tailwind CSS, Google Fonts (Montserrat & Inter), and modular JavaScript.
- **Hosting Target (Frontend)**: GitHub Pages (pre-configured with `.github/workflows/deploy.yml` for automated continuous deployment).
- **Backend**: Node.js & Express REST API (`/backend`) with JSON persistence and CORS.
- **Hosting Target (Backend)**: Render (pre-configured with `render.yaml` for 1-click free deployment).
- **Offline / Static Hybrid Mode**: The client-side API layer (`assets/js/api.js`) automatically detects backend availability. When offline or prior to backend deployment, all dynamic features (reviews, inquiries, messages, gallery) operate seamlessly with local seed data and browser persistence.

---

## 📂 Site Structure (All 12 Pages Implemented)

| Page | URL | Key Features & Modules |
|------|-----|------------------------|
| **Home** | `index.html` | Dynamic 3-slide Hero Slider with autoplay & touch swipe, About ERC with Know More CTA, Why Us (6 service cards), 4 Service Tiles, Numbers Strip with count-up animations (18+, 10, 7, 13), Client Logo Marquee, Reviews Carousel. |
| **Our Company** | `our-company.html` | Welcome & Philosophy, Credentials mosaic (8 high-res field photos), 4 Accreditation cards (ISO 9001:2015, NABL & MoEF&CC, NABET, Multidisciplinary), 7 Commitments checklist, Celebrated Clientele logos. |
| **Management Team** | `management-team.html` | Executive Leadership profiles for **Hari Nandiwal** (Director, 18+ Years) and **Ravi Sharma** (Director, 16+ Years) with verified portraits, experience badges, and credential bios. |
| **Core Team** | `core-team.html` | Comprehensive team directory featuring all 11 core multidisciplinary professionals with high-res headshots, experience pills, role tags, and expandable bios. |
| **Assessment** | `assessment.html` | Understand the Environmental Reality: 10 statutory assessment offerings, interactive Assessment Hub diagram with live preview node selection. |
| **Clearances** | `clearances.html` | Enabling Responsible Growth: EC, CTE, CTO, CGWA NOCs, Forest & Wildlife approvals, Mining Plans, and 5-step interactive statutory approval timeline. |
| **Monitoring** | `monitoring.html` | Real Data. A Cleaner Tomorrow: Air, Water, Soil, Noise, Field Sampling, Laboratory Testing, and interactive Monitoring Hub. |
| **Audit & Compliance** | `audit-compliance.html` | Continuous Compliance: 5-stage compliance cycle, Environmental Audits, post-clearance compliance, and 7 ESG & Sustainability advisory services. |
| **Clientele** | `clientele.html` | Trusted across 7 industrial sectors: Mining, Manufacturing, Chemicals, Healthcare, Education, Built Environment, and Infrastructure, with animated partner marquee. |
| **Reviews** | `reviews.html` | Verified partner testimonials with sector filtering tabs ("Built Environment", "Industry", "Social Impact", etc.) and an interactive **"Share Your Review" modal** with star rating and optimistic list updates. |
| **Gallery** | `gallery.html` | 29 client photographs organized by category ("Projects", "Field Visits", "Community Engagement", "Our Journey"), live keyword search, **fullscreen interactive Lightbox** with next/previous & keyboard navigation, and "Load More" pagination. |
| **Contact Us** | `contact-us.html` | Registered Office, Corporate Office (Cassandra Business Tower), Branch locations (Gurugram, Ahmedabad, Goa, Lucknow), direct call/email links, interactive message form, and embedded Google Map with directions. |

---

## 🛠️ Dynamic Interactive Elements

1. **Sticky Header**: Collapses the utility bar and shrinks the navbar (84px → 68px) with shadow when scrolling past 50px.
2. **Mobile Drawer Navigation**: Slide-out navigation drawer from the right with collapsible accordion menus for "About Us" and "Services".
3. **Floating "Inquiry Now" Drawer**: Accessible on every page via the right-edge vertical tab or "Talk to Expert" buttons. Captures Name, Email, Phone, Service Interest, and Project Details with validation and toast alerts.
4. **Floating Back-to-Top**: Appears smoothly after 300px scroll; returns to top on click.
5. **Hero Slider (`assets/js/slider.js`)**: 3 full-width slides with crossfade animations, touch gestures on mobile, dot pagination, and auto-rotation.
6. **Dynamic Numbers Strip (`assets/js/counter.js`)**: `IntersectionObserver` smoothly counts up numbers (18+, 10, 7, 13) when scrolled into view.
7. **Reviews Management (`assets/js/reviews.js`)**: Real-time review submissions persist to localStorage and sync to the backend API.
8. **Interactive Gallery (`assets/js/gallery.js`)**: Instant category switching, debounce live search, and modal lightbox.
9. **Interactive Diagrams (`assets/js/diagrams.js`)**: Clickable nodes and process steps on Assessment, Clearances, Monitoring, and Compliance pages.

---

## 💻 Local Quickstart

### Running the Frontend
```bash
# Option 1: Using npx serve (recommended)
npx -y serve . -p 3000

# Option 2: Using Python built-in server
python3 -m http.server 3000
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Running the Backend
```bash
cd backend
npm install
npm run dev
# Server runs on http://localhost:5000
```

---

## 🌐 Deployment Instructions

### 1. Frontend on GitHub Pages
1. Initialize Git in the project root (if not already done):
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit of EnviroRise Clearance website"
   ```
2. Push to your GitHub repository:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```
3. In your GitHub repository settings:
   - Navigate to **Settings** → **Pages**.
   - Under **Build and deployment** → **Source**, select **GitHub Actions**.
   - The `.github/workflows/deploy.yml` workflow will automatically build and publish your site!

### 2. Backend on Render
1. Sign in to [Render](https://render.com/).
2. Click **New +** → **Web Service**.
3. Connect your GitHub repository.
4. Set the configuration:
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: `Free`
5. Click **Create Web Service**. Render will output your service URL (e.g. `https://envirorise-api.onrender.com`).
6. Once deployed, visitors' inquiries and reviews will automatically sync to your Render service!
