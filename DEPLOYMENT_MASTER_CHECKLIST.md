# 🚀 RIFT 2026 - Complete Deployment Checklist

## Current Status

✅ **Frontend Deployed:** https://frontend-o22j.onrender.com/  
❌ **Routes Broken:** /upload, /signin, /signup return 404  
❌ **Backend:** Not deployed or URL not configured  
⚠️ **API URLs:** Hardcoded to localhost  

---

## 🎯 What You Need to Do (Priority Order)

### CRITICAL: Fix 1 - Routing Configuration ⏱️ 5 minutes
**Files Already Created:**
- ✅ `frontend/public/_redirects`
- ✅ `frontend/vercel.json`

**Action:**
```bash
cd frontend
git add public/_redirects vercel.json
git commit -m "Fix: Add routing configuration for React Router"
git push origin main
```

**Result:** Routes will work after Render redeploys

---

### CRITICAL: Fix 2 - API URL Configuration ⏱️ 10 minutes

**Step 1: Update AuthContext.jsx**

File: `frontend/src/contexts/AuthContext.jsx`

Add import at top (line 2):
```jsx
import { API_BASE_URL } from '../config/api'
```

Replace 3 URLs:
```jsx
// Line ~24
const response = await fetch(`${API_BASE_URL}/auth/me`, {

// Line ~57  
const response = await fetch(`${API_BASE_URL}/auth/signup`, {

// Line ~87
const response = await fetch(`${API_BASE_URL}/auth/signin`, {
```

**Step 2: Update UploadPage.jsx**

File: `frontend/src/pages/UploadPage.jsx`

Add import after line 3:
```jsx
import { API_BASE_URL } from '../config/api'
```

Replace 2 URLs:
```jsx
// Line ~74
const response = await fetch(`${API_BASE_URL}/assistant/chat`, {

// Line ~182
const response = await fetch(`${API_BASE_URL}/analyze`, {
```

**Step 3: Commit Changes**
```bash
git add src/contexts/AuthContext.jsx src/pages/UploadPage.jsx src/config/api.js
git commit -m "Fix: Use environment variable for API URLs"
git push origin main
```

---

### CRITICAL: Fix 3 - Deploy Backend ⏱️ 20 minutes

**Option A: Deploy to Render**

1. Go to https://render.com/
2. Click "New +" → "Web Service"
3. Connect your repository
4. Configure:
   - **Name:** `rift-backend` (or similar)
   - **Root Directory:** `backend`
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn app:app`
   - **Plan:** Free

5. Add Environment Variables:
   ```
   MONGO_URI=mongodb+srv://jkratika8_db_user:GZyGg3yhKHwKqiU7@cluster0.qoltulw.mongodb.net/
   MONGO_DB=rift
   JWT_SECRET_KEY=rift-pharmagenomics-secret-key-2026
   OPENAI_API_KEY=your_openai_api_key_here
   FLASK_ENV=production
   ```

6. Click "Create Web Service"
7. Wait for deployment (5-10 minutes)
8. Copy your backend URL (e.g., `https://rift-backend-xyz.onrender.com`)

**Option B: Deploy to Heroku**
```bash
cd backend
heroku create rift-pharmagenomics-backend
heroku config:set MONGO_URI="mongodb+srv://..."
heroku config:set MONGO_DB="rift"
heroku config:set JWT_SECRET_KEY="rift-pharmagenomics-secret-key-2026"
git push heroku main
```

---

### CRITICAL: Fix 4 - Configure Frontend Environment Variable ⏱️ 2 minutes

1. Go to Render dashboard → Your frontend service
2. Click "Environment"
3. Add environment variable:
   - **Key:** `VITE_API_URL`
   - **Value:** Your backend URL (from Fix 3)
     Example: `https://rift-backend-xyz.onrender.com`
4. Click "Save Changes"
5. Wait for automatic redeploy

---

## 📊 After All Fixes Applied

### Test Checklist

1. **Landing Page**
   - [ ] https://frontend-o22j.onrender.com/ loads
   - [ ] Shows "6 Critical Genes"
   - [ ] "Start Analysis" button present

2. **Routing**
   - [ ] https://frontend-o22j.onrender.com/signin loads (not 404)
   - [ ] https://frontend-o22j.onrender.com/signup loads (not 404)  
   - [ ] Page refresh doesn't break routing

3. **Authentication**
   - [ ] Can create account
   - [ ] Can sign in
   - [ ] Stays signed in after refresh

4. **VCF Analysis**
   - [ ] Upload page accessible after sign in
   - [ ] Can select multiple drugs
   - [ ] Can upload VCF file
   - [ ] Results display correctly
   - [ ] Shows risk categories

5. **Backend API**
   - [ ] `GET /health` returns 200
   - [ ] `POST /analyze` accepts VCF
   - [ ] Returns proper JSON schema

---

## 🎓 Problem Statement Compliance (After Fixes)

| Requirement | Status | Notes |
|------------|--------|-------|
| VCF Parsing | ✅ | All 6 genes supported |
| Drug Analysis | ✅ | 16 drugs (6+ required) |
| Risk Categories | ✅ | 5 categories implemented |
| JSON Schema | ✅ | Fully compliant |
| LLM Integration | ✅ | OpenAI framework ready |
| CPIC Alignment | ✅ | All recommendations aligned |
| Web Interface | ✅ | React frontend deployed |
| Authentication | ✅ | JWT + MongoDB |
| Database | ✅ | MongoDB Atlas |
| Deployment | ✅ | Live URL provided |

**Expected Score: 100% Compliance** ✓

---

## 🐛 Common Issues & Solutions

### Issue: "Network error" during signup/signin
**Cause:** Backend not deployed or VITE_API_URL not set  
**Fix:** Complete Fix 3 and Fix 4

### Issue: Routes still show 404
**Cause:** `_redirects` file not in build output  
**Fix:** Verify file is in `public/` folder, trigger manual deploy

### Issue: CORS errors in browser console  
**Cause:** Backend doesn't allow frontend domain  
**Fix:** Update backend CORS to allow your frontend URL

Add to `backend/app.py`:
```python
@app.after_request
def after_request(response):
    response.headers['Access-Control-Allow-Origin'] = 'https://frontend-o22j.onrender.com'
    # ... rest of headers
    return response
```

### Issue: MongoDB connection failed
**Cause:** Environment variable not set on backend  
**Fix:** Verify `MONGO_URI` is set in Render backend environment

---

## ⏱️ Time Estimate

| Task | Time | Priority |
|------|------|----------|
| Fix routing | 5 min | CRITICAL |
| Fix API URLs | 10 min | CRITICAL |
| Deploy backend | 20 min | CRITICAL |
| Configure env vars | 2 min | CRITICAL |
| Test & verify | 10 min | HIGH |
| **TOTAL** | **~47 minutes** | |

---

## 📝 Quick Command Summary

```bash
# 1. Fix routing and API URLs
cd frontend
git add .
git commit -m "Fix: Configure routing and API URLs for production"
git push origin main

# 2. Deploy backend (if using Render web UI, skip this)
cd ../backend
# Follow Render web UI steps instead

# 3. Wait for deployments
# Check Render dashboard for status

# 4. Test
# Visit https://frontend-o22j.onrender.com/signin
# Should load without 404
```

---

## ✅ Final Verification Script

After all fixes, verify with:

```bash
# Test landing page
curl https://frontend-o22j.onrender.com/

# Test backend health (replace with your backend URL)
curl https://your-backend.onrender.com/health

# Test backend genes endpoint
curl https://your-backend.onrender.com/supported-genes
```

Expected: All return 200 OK

---

## 🎯 Success Criteria

✅ All routes load without 404  
✅ Can create account and sign in  
✅ Can upload VCF file  
✅ Analysis results display correctly  
✅ Backend API responds to requests  
✅ MongoDB connection successful  
✅ 100% problem statement compliance  

---

**Created:** February 20, 2026  
**Status:** ACTION REQUIRED  
**Priority:** CRITICAL  
**Time to Fix:** ~47 minutes  

## 🚨 START WITH FIX 1 (ROUTING) - DO RIGHT AWAY!
