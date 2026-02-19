# Frontend Deployment Guide

## Environment Variables

When deploying the frontend, you need to configure the backend API URL.

### Environment Variable Name

```
VITE_API_URL
```

### Environment Variable Value

```
https://backend-server-onsc.onrender.com
```

---

## Deployment Instructions by Platform

### 🔷 Vercel Deployment

1. **Push to GitHub** (if not done)

   ```bash
   git add .
   git commit -m "Configure production API"
   git push origin main
   ```

2. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Click "Add New" → "Project"

3. **Import Repository**
   - Select your GitHub repository
   - Click "Import"

4. **Configure Project**
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `dist` (auto-detected)

5. **Add Environment Variable**
   - Under "Environment Variables" section
   - **Name:** `VITE_API_URL`
   - **Value:** `https://backend-server-onsc.onrender.com`
   - Click "Add"

6. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build
   - Your app will be live at: `https://your-app.vercel.app`

7. **Update Backend CORS**
   - Go to Render dashboard → Your backend service
   - Environment tab
   - Add/Update: `FRONTEND_URL` = `https://your-app.vercel.app`
   - Save changes (service will redeploy)

---

### 🟢 Netlify Deployment

1. **Push to GitHub** (if not done)

2. **Go to Netlify Dashboard**
   - Visit: https://app.netlify.com
   - Click "Add new site" → "Import an existing project"

3. **Connect Repository**
   - Choose GitHub
   - Select your repository

4. **Configure Build Settings**
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/dist`

5. **Add Environment Variable**
   - Click "Show advanced" → "New variable"
   - **Key:** `VITE_API_URL`
   - **Value:** `https://backend-server-onsc.onrender.com`

6. **Deploy**
   - Click "Deploy site"
   - Wait 2-3 minutes
   - Your app will be live at: `https://your-app.netlify.app`

7. **Update Backend CORS**
   - Go to Render dashboard
   - Set `FRONTEND_URL` = `https://your-app.netlify.app`

---

### 🟣 Render Deployment (Static Site)

1. **Push to GitHub** (if not done)

2. **Go to Render Dashboard**
   - Visit: https://dashboard.render.com
   - Click "New +" → "Static Site"

3. **Connect Repository**
   - Connect your GitHub repository
   - Select the repository

4. **Configure Build**
   - **Name:** `pharmaguard-frontend`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `frontend/dist`

5. **Add Environment Variable**
   - Under "Environment Variables"
   - **Key:** `VITE_API_URL`
   - **Value:** `https://backend-server-onsc.onrender.com`

6. **Deploy**
   - Click "Create Static Site"
   - Wait for deployment
   - Your app will be live at: `https://your-app.onrender.com`

7. **Update Backend CORS**
   - Go to your backend service in Render
   - Set `FRONTEND_URL` = `https://your-app.onrender.com`

---

## Testing After Deployment

1. **Health Check**
   - Visit your deployed frontend URL
   - Open browser console (F12)
   - Check for no CORS errors

2. **Test Authentication**
   - Click "Sign Up" and create an account
   - Should redirect to upload page

3. **Test VCF Upload**
   - Upload a VCF file
   - Select drugs
   - Click "Start Analysis"
   - Verify results display

4. **Test Assistant**
   - Click the assistant button (bottom right)
   - Send a message
   - Verify response

---

## Environment Variable Details

### Why `VITE_` prefix?

Vite (your build tool) requires environment variables to be prefixed with `VITE_` to be exposed to your frontend code. Variables without this prefix are ignored for security.

### Default Behavior

If `VITE_API_URL` is not set, the app will use:

```
https://backend-server-onsc.onrender.com
```

This means the app will work even without setting the environment variable.

### For Local Development

Create a `.env.local` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000
```

This overrides the production URL for local testing.

---

## Troubleshooting

### CORS Errors

**Error:** `Access-Control-Allow-Origin header is missing`

**Solution:**

1. Ensure `FRONTEND_URL` is set in backend Render environment
2. Value should match your deployed frontend URL exactly
3. No trailing slash: `https://app.com` not `https://app.com/`
4. Wait 1-2 minutes for backend to redeploy after changing env vars

### API Not Found (404)

**Error:** API endpoints return 404

**Solution:**

1. Check `VITE_API_URL` is set correctly
2. Verify backend is deployed and running
3. Test backend health: `curl https://backend-server-onsc.onrender.com/health`

### Build Fails

**Error:** Build fails during deployment

**Solution:**

1. Ensure `Root Directory` is set to `frontend`
2. Check build command is `npm run build`
3. Verify `package.json` exists in frontend folder

### Environment Variable Not Working

**Error:** Still using wrong API URL

**Solution:**

1. Environment variables **must** start with `VITE_`
2. Redeploy after adding env vars (trigger new build)
3. Check browser console for actual URL being used

---

## Custom Domain (Optional)

After successful deployment:

### Vercel

- Project Settings → Domains
- Add your custom domain
- Follow DNS instructions

### Netlify

- Domain Settings → Add custom domain
- Configure DNS records

### Render

- Settings → Custom Domain
- Add domain and configure DNS

---

## Summary

**Environment Variable to Set:**

```
VITE_API_URL=https://backend-server-onsc.onrender.com
```

**After Frontend Deploys:**

```
Backend: FRONTEND_URL=https://your-frontend-url.com
```

That's it! Your full-stack app will be live. 🚀
