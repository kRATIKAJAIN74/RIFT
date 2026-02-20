# RIFT Frontend - Routing Fix Guide

## 🐛 Problem: 404 Errors on Routes

Your deployed website at https://frontend-o22j.onrender.com/ shows 404 errors when accessing:
- `/upload`
- `/signin`
- `/signup`

**Cause:** React Router client-side routing not configured for static hosting.

---

## ✅ Solution Applied

### Files Created:

1. **`frontend/public/_redirects`** (for Render/Netlify)
   ```
   /*    /index.html   200
   ```

2. **`frontend/vercel.json`** (for Vercel, if you switch platforms)
   ```json
   {
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```

---

## 🚀 Next Steps

### Step 1: Commit Changes
```bash
cd frontend
git add public/_redirects vercel.json
git commit -m "Fix: Add routing configuration for React Router"
git push origin main
```

### Step 2: Redeploy on Render

The `_redirects` file should be automatically picked up by Render on the next deploy.

**Option A: Automatic Deploy (if enabled)**
- Render will auto-deploy when you push to main branch
- Wait 2-3 minutes for build to complete

**Option B: Manual Deploy**
1. Go to Render dashboard
2. Find your frontend service
3. Click "Manual Deploy" → "Deploy latest commit"
4. Wait for deployment to complete

### Step 3: Verify Routes
After deployment completes, test these URLs:
- ✅ https://frontend-o22j.onrender.com/ (landing page)
- 🔧 https://frontend-o22j.onrender.com/signin (should work now)
- 🔧 https://frontend-o22j.onrender.com/signup (should work now)
- 🔧 https://frontend-o22j.onrender.com/upload (should work now)

---

## 🔍 How to Verify It's Fixed

### Test 1: Direct URL Access
1. Open browser in incognito/private mode
2. Navigate directly to: https://frontend-o22j.onrender.com/signin
3. **Expected:** Sign in page loads (not 404)

### Test 2: Page Refresh
1. Navigate to upload page from homepage
2. Refresh the page (F5 or Ctrl+R)
3. **Expected:** Page reloads correctly (not 404)

### Test 3: Browser Back Button
1. Navigate: Home → Sign In → Sign Up
2. Click browser back button
3. **Expected:** Previous pages load correctly

---

## 📋 Backend Deployment Check

Your frontend is pointing to a backend API. Verify:

### Check Frontend Environment Variable
Look for API URL in your code or environment:
- `VITE_API_URL` or similar
- Should point to your deployed backend

### Common Backend Platforms
- **Render:** https://your-backend.onrender.com
- **Heroku:** https://your-app.herokuapp.com
- **Railway:** https://your-app.railway.app

### Backend Endpoints to Test
Once routes are fixed, verify these work:
- `GET /health` - Health check
- `POST /auth/signup` - User registration
- `POST /auth/signin` - User login
- `POST /analyze` - VCF analysis

---

## 🎯 Expected Results After Fix

### Frontend Routes: ALL ✅
- Landing page: Accessible
- Sign in: Accessible
- Sign up: Accessible
- Upload: Accessible (with authentication)

### User Flow: COMPLETE ✅
1. User visits landing page
2. Clicks "Start Analysis"
3. Redirected to sign up
4. Creates account
5. Signs in
6. Uploads VCF file
7. Receives analysis results

### Problem Statement Compliance: 100% ✅
All core requirements accessible and functional.

---

## 🆘 Troubleshooting

### If Routes Still Show 404 After Deploy

#### Check 1: Verify File Location
The `_redirects` file must be in `public/` folder:
```
frontend/
  public/
    _redirects  ← Must be here
    vite.svg
    dna.png
```

#### Check 2: Verify File Content
Open `_redirects` and ensure it contains exactly:
```
/*    /index.html   200
```
(No extra spaces, no comments)

#### Check 3: Check Render Build Settings
In Render dashboard:
- **Build Command:** `npm run build` or `vite build`
- **Publish Directory:** `dist` (for Vite)
- Ensure `_redirects` is being copied to dist folder

#### Check 4: Manual Copy (if needed)
If `_redirects` isn't being copied automatically, update `vite.config.js`:

```js
export default defineConfig({
  plugins: [react()],
  publicDir: 'public', // Ensure this line exists
})
```

### If Backend Connection Fails

#### Check CORS Settings
Backend should allow your frontend domain:
```python
@app.after_request
def after_request(response):
    response.headers['Access-Control-Allow-Origin'] = 'https://frontend-o22j.onrender.com'
    # ... other headers
    return response
```

#### Check Environment Variables
Frontend `.env` or Render environment:
```
VITE_API_URL=https://your-backend.onrender.com
```

---

## 📊 Before vs After

### BEFORE Fix
```
GET /signin → 404 Not Found
GET /signup → 404 Not Found  
GET /upload → 404 Not Found
```

### AFTER Fix
```
GET /signin → 200 OK (loads React app → shows signin page)
GET /signup → 200 OK (loads React app → shows signup page)
GET /upload → 200 OK (loads React app → checks auth → shows upload page)
```

---

## ✅ Deployment Checklist

After running the steps above, verify:

- [ ] `_redirects` file exists in `frontend/public/`
- [ ] Changes committed to git
- [ ] Changes pushed to repository
- [ ] Render deployment triggered
- [ ] Build completed successfully
- [ ] All routes accessible (test each URL)
- [ ] User can navigate between pages
- [ ] Page refresh doesn't break routing
- [ ] Backend API endpoints accessible
- [ ] VCF upload works end-to-end

---

## 🎬 Quick Command Reference

```bash
# From RIFT directory
cd frontend

# Verify files exist
ls public/_redirects

# Commit and push
git add .
git commit -m "Fix: Configure React Router for Render deployment"
git push origin main

# Check deployment logs on Render
# (via Render dashboard)
```

---

## 📞 Support Resources

### Render Docs
- [Static Site Redirects](https://render.com/docs/deploy-create-react-app#using-client-side-routing)
- [React Router Setup](https://render.com/docs/deploy-create-react-app)

### If You Need to Switch Platforms

**Vercel:** `vercel.json` already created ✅  
**Netlify:** Create `netlify.toml` with redirect rules  
**GitHub Pages:** Requires `404.html` workaround  

---

**Created:** February 20, 2026  
**Status:** READY TO APPLY  
**Time Required:** 5 minutes  
**Impact:** CRITICAL - Unlocks all functionality
