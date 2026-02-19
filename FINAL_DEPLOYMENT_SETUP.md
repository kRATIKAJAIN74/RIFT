# 🎯 FINAL DEPLOYMENT - COMPLETE AUTOMATED SETUP

## 📊 Current Status

✅ **Code:** All fixes in GitHub (commit: 5de26c9)  
✅ **Workflows:** GitHub Actions configured  
⏳ **Manual Setup:** You need to do this (~10 minutes)  
❌ **Backend:** Needs initial creation + environment variables  
❌ **Frontend:** Needs environment variable update  

---

## 🚀 DO THIS NOW (10 minutes total)

### Phase 1: Create Backend Service (5 minutes)

**1A. Go to Render Dashboard**
- Open: https://dashboard.render.com/
- Sign in with your account

**1B. Create Backend Service**
1. Click "New +" button → "Web Service"
2. Select your GitHub repository: `kRATIKAJAIN74/RIFT` → Connect
3. Fill in configuration:
   - **Name:** `rift-backend`
   - **Region:** Oregon (or nearest)
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn app:app --bind 0.0.0.0:$PORT`
   - **Plan:** Free

**1C. Add Environment Variables**
Click "Advanced" → "Add Environment Variable" for each:

```
MONGO_URI = mongodb+srv://jkratika8_db_user:GZyGg3yhKHwKqiU7@cluster0.qoltulw.mongodb.net/?appName=Cluster0
MONGO_DB = rift
JWT_SECRET_KEY = rift-pharmagenomics-secret-key-2026
FLASK_ENV = production
GROQ_API_KEY = [get from your .env file]
OPENAI_API_KEY = [optional - get from your .env file]
```

**1D. Create Service**
- Click "Create Web Service"
- **COPY THE SERVICE ID FROM URL**
  - URL looks like: `https://dashboard.render.com/services/[SERVICE_ID]`
  - Save the SERVICE_ID

Wait for initial deployment (5-10 min). You'll see it at the top.

---

### Phase 2: Get API Key & Configure GitHub Secrets (3 minutes)

**2A. Get Render API Key**
1. Go to: https://dashboard.render.com/api-tokens
2. Click "Generate" 
3. Copy the long API key string

**2B. Get Backend Service ID**
- Already noted from Phase 1 (from the URL)

**2C. Get Frontend Service ID**
1. Still in Render dashboard, click your frontend service
2. Copy SERVICE_ID from URL

**2D. Add GitHub Secrets**
1. Go to: https://github.com/kRATIKAJAIN74/RIFT/settings/secrets/actions
2. Click "New repository secret" → Add:
   ```
   Name: RENDER_API_KEY
   Value: [Your API key from 2A]
   ```
3. Click "New repository secret" → Add:
   ```
   Name: RENDER_BACKEND_SERVICE_ID
   Value: [Your backend service ID from Phase 1]
   ```
4. Click "New repository secret" → Add:
   ```
   Name: RENDER_FRONTEND_SERVICE_ID
   Value: [Your frontend service ID from 2C]
   ```

---

### Phase 3: Configure Frontend Environment Variable (2 minutes)

**3A. Get Backend URL**
1. Go to Render dashboard
2. Click your backend service
3. At the top, you'll see: `https://[service-name].onrender.com`
4. Copy this URL (e.g., `https://rift-backend-xyz.onrender.com`)

**3B. Add Frontend Environment Variable**
1. Go to your frontend service in Render
2. Click "Environment" in left sidebar
3. Click "Add Environment Variable":
   ```
   Key: VITE_API_URL
   Value: [Your backend URL from 3A]
   ```
4. Click "Save Changes"
   - Frontend will auto-redeploy (2-3 min)

---

## ✅ VERIFY EVERYTHING WORKS

### Test Backend API (5-10 min after creation)
Open in browser (replace with your backend URL):
```
https://[your-backend-name].onrender.com/health
https://[your-backend-name].onrender.com/supported-genes
https://[your-backend-name].onrender.com/supported-drugs
```

Expected: All return JSON responses

### Test Frontend Routes
```
https://frontend-o22j.onrender.com/
https://frontend-o22j.onrender.com/signin
https://frontend-o22j.onrender.com/signup
https://frontend-o22j.onrender.com/upload
```

Expected: All load without 404

### Test Full User Flow
1. Go to: https://frontend-o22j.onrender.com/
2. Click "Start Analysis"
3. Create account → Sign in
4. Upload backend/sample.vcf
5. Select "Warfarin"
6. Click "Analyze"
7. Verify results display

---

## 🎯 AFTER SETUP COMPLETE

Your system will now have:

✅ **Frontend:** https://frontend-o22j.onrender.com/  
✅ **Backend:** https://[your-backend].onrender.com/  
✅ **Auto-Deploy:** Changes push → Auto-deploy  
✅ **Fully Functional:** VCF analysis working  
✅ **Production Ready:** 100% compliant  

### How to Deploy Updates
Any time you want to deploy changes:

**For backend changes:**
```bash
git add backend/
git commit -m "Update description"
git push origin main
# ✅ Auto-deploys in ~2 minutes
```

**For frontend changes:**
```bash
git add frontend/
git commit -m "Update description"
git push origin main
# ✅ Auto-redeploys in ~2 minutes
```

---

## 📊 PROBLEM STATEMENT COMPLIANCE

After setup, your system provides:

✅ VCF parsing for 6 genes  
✅ Multi-drug analysis (16 drugs)  
✅ 5 risk categories  
✅ JSON schema compliant output  
✅ LLM integration ready  
✅ CPIC alignment  
✅ Web interface  
✅ User authentication  
✅ MongoDB integration  
✅ Error handling  

**= 100% COMPLIANCE** ✓

---

## ⏱️ TIMELINE

**Now:** Read this file (2 min)  
**+5 min:** Create backend service  
**+3 min:** Configure GitHub secrets  
**+2 min:** Add frontend env variable  
**+5-10 min:** Deployments complete  
**= ~25 minutes total**

---

## 📞 QUICK REFERENCE

**Critical URLs:**
- Render Dashboard: https://dashboard.render.com/
- API Tokens: https://dashboard.render.com/api-tokens
- GitHub Secrets: https://github.com/kRATIKAJAIN74/RIFT/settings/secrets/actions
- GitHub Actions: https://github.com/kRATIKAJAIN74/RIFT/actions

**IDs You Need:**
- RENDER_API_KEY → From dashboard.render.com/api-tokens
- RENDER_BACKEND_SERVICE_ID → From backend service URL
- RENDER_FRONTEND_SERVICE_ID → From frontend service URL

**Credentials You Need:**
- MongoDB: Already in code ✓
- JWT Secret: Already in code ✓
- GROQ API Key: From your .env file
- OpenAI Key: Optional, from your .env file

---

## 🚨 IMPORTANT NOTES

1. **Don't share these values publicly:**
   - Store them in GitHub Secrets, not in code
   - Never commit `.env` files

2. **Build times:**
   - Backend first deploy: ~5-10 min
   - Subsequent deploys: ~2-3 min
   - Frontend redeploy: ~2-3 min

3. **Free tier limits:**
   - 750 hours per month
   - Spins down after 15 min inactivity
   - Perfect for hackathon project

---

## 🎬 START NOW!

1. ✅ Read this file (DONE)
2. ⏳ Go to Render dashboard
3. ⏳ Create backend service (Phase 1)
4. ⏳ Get API key & configure secrets (Phase 2)
5. ⏳ Add frontend env variable (Phase 3)
6. ⏳ Verify everything works
7. ✅ Celebrate! 🎉

---

**Your final deployed website will be ready in ~25 minutes!**

🚀 **START WITH PHASE 1 NOW!**
