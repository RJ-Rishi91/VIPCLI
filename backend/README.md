# EnviroRise Clearance — Backend API

Dynamic backend service for EnviroRise Clearance, supporting:
- Client Inquiries (via Floating Drawer & Quick CTA)
- Contact Us Messages
- Dynamic Testimonials / Client Reviews
- Dynamic Project Gallery & Categorization

## Local Development

```bash
cd backend
npm install
npm run dev
# Server runs on http://localhost:5000
```

## Free Deployment on Render

1. Push your repository to GitHub.
2. Sign in to [Render](https://render.com/).
3. Click **New +** -> **Web Service**.
4. Connect your GitHub repository.
5. Set the following settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: Free
6. Render will assign you a public URL like: `https://envirorise-api.onrender.com`.
7. In your frontend, the API client automatically connects to your Render instance, or you can set:
   ```javascript
   localStorage.setItem('erc_api_url', 'https://your-app.onrender.com');
   ```
