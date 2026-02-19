# Quick Frontend Deployment Reference

## ⚙️ Environment Variable

**Name:** `VITE_API_URL`  
**Value:** `https://backend-server-onsc.onrender.com`

---

## 🚀 Deploy on Vercel (Recommended - 2 minutes)

1. Visit: https://vercel.com/new
2. Import your GitHub repo
3. Set Root Directory: `frontend`
4. Add Environment Variable:
   - `VITE_API_URL` = `https://backend-server-onsc.onrender.com`
5. Click Deploy

**After deployment:**

- Update backend `FRONTEND_URL` in Render to your Vercel URL

---

## 🚀 Deploy on Netlify

1. Visit: https://app.netlify.com/start
2. Choose GitHub repo
3. Configure:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
   - Environment: `VITE_API_URL` = `https://backend-server-onsc.onrender.com`
4. Deploy

---

## 🚀 Deploy on Render

1. New Static Site
2. Root directory: `frontend`
3. Build: `npm install && npm run build`
4. Publish: `frontend/dist`
5. Environment: `VITE_API_URL` = `https://backend-server-onsc.onrender.com`

---

## ⚠️ Important After Deployment

Update backend CORS in Render:

```
FRONTEND_URL=https://your-deployed-frontend-url.com
```

---

For detailed instructions: See [DEPLOYMENT.md](DEPLOYMENT.md)
