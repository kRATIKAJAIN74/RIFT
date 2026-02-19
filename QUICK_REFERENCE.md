# ⚡ RIFT 2026 - QUICK REFERENCE CARD

**Print this or bookmark it!**

---

## 🚀 YOUR 25-MINUTE DEPLOYMENT PLAYBOOK

### ✅ BEFORE YOU START
- [ ] You have a Render account (free at render.com)
- [ ] You can access GitHub settings
- [ ] You have your Groq API key from .env
- [ ] ~25 minutes available

---

## 🎯 PHASE 1: CREATE BACKEND (5 minutes)

1. Go to **[https://dashboard.render.com/](https://dashboard.render.com/)**
2. Click **"New Web Service"** → Connect GitHub
3. Select **kRATIKAJAIN74/RIFT** repo
4. Enter settings:
   - **Name:** `rift-backend`
   - **Root Directory:** `backend`
   - **Runtime:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn app:app --bind 0.0.0.0:$PORT`

5. **Add Environment Variables** (click "Advanced"):
   ```
   GROQ_API_KEY = [YOUR_GROQ_KEY]
   MONGO_URI = [YOUR_MONGO_URI]
   MONGO_DB = rift_db
   JWT_SECRET = [ANY_RANDOM_STRING]
   OPENAI_API_KEY = [IF_YOU_HAVE_IT]
   DATABASE_URL = [SAME_AS_MONGO_URI]
   ```

6. Click **"Create Web Service"**
7. **Wait for deployment** (~5-10 minutes)
8. **Note the URL** from the page (e.g., `https://rift-backend-abc123.onrender.com`)

✅ **PHASE 1 DONE** when you see a green "Live" status

---

## 🔑 PHASE 2: CONFIGURE SECRETS (3 minutes)

1. Go to **[https://dashboard.render.com/api-tokens](https://dashboard.render.com/api-tokens)**
2. Create new API token → Copy it
3. Find your **Backend Service ID**:
   - Go back to your backend service
   - Copy the ID from the URL: `https://dashboard.render.com/services/web/srv_XXXXXXXXXXXX`
   - The XXXX part is your ID

4. Find your **Frontend Service ID**:
   - Go to Services → Find "frontend"
   - Copy its ID from URL same way

5. Go to **[GitHub Secrets](https://github.com/kRATIKAJAIN74/RIFT/settings/secrets/actions)**
6. Add 3 New Secrets (**New repository secret** button):
   ```
   RENDER_API_KEY = [TOKEN_YOU_COPIED]
   RENDER_BACKEND_SERVICE_ID = [BACKEND_ID]
   RENDER_FRONTEND_SERVICE_ID = [FRONTEND_ID]
   ```

✅ **PHASE 2 DONE** when all 3 secrets appear in the list

---

## 🔗 PHASE 3: CONNECT FRONTEND (2 minutes)

1. Go back to **Render Dashboard**
2. Find your **frontend** service
3. Go to **Environment** tab
4. Add new environment variable:
   ```
   VITE_API_URL = [YOUR_BACKEND_URL]
   ```
   (Example: `https://rift-backend-abc123.onrender.com`)

5. Click **Save** → Frontend auto-redeploys

✅ **PHASE 3 DONE** when frontend shows "Live" again

---

## ✅ PHASE 4: TEST EVERYTHING (5-10 minutes)

### Test Backend
1. Open: `https://rift-backend-[yourID].onrender.com/api/health`
2. Should see: `{"status": "OK"}`

### Test Frontend Routes
1. Landing: `https://frontend-o22j.onrender.com/` ← Should work
2. Sign Up: `https://frontend-o22j.onrender.com/signup` ← Should NOT be 404
3. Sign In: `https://frontend-o22j.onrender.com/signin` ← Should NOT be 404
4. Upload: `https://frontend-o22j.onrender.com/upload` ← Should NOT be 404

### Test Full Flow
1. Go to `/signup`
2. Create account (any email, password)
3. Go to `/signin`
4. Log in with same credentials
5. Go to `/upload`
6. Upload VCF file
7. Select drugs
8. Click analyze
9. Wait for results
10. **See risk predictions!**

✅ **PHASE 4 DONE** when you complete the full flow

---

## 📊 WHAT YOU'LL SEE

### After Backend Deployment
```
✅ API is Live
✅ Database connected
✅ Ready to accept requests
```

### After Frontend Connection
```
✅ No more 404 errors
✅ Sign up/login working
✅ File upload enabled
✅ Ready for use
```

### After User Flow Test
```
✅ User created
✅ Authenticated
✅ Analysis complete
✅ Results displayed
✅ System WORKING
```

---

## 🛑 TROUBLESHOOTING

### Backend won't deploy
- Check logs on Render dashboard
- Verify all environment variables are set
- Check requirements.txt syntax

### Frontend still shows 404
- Wait 2-3 minutes after saving VITE_API_URL
- Check it actually saved (reload page)
- Check backend URL is correct

### Can't sign up
- Check MongoDB URI is correct
- Check JWT_SECRET is set
- Check backend logs

### File upload fails
- Check backend is running (green Live status)
- Check VITE_API_URL is pointing to correct backend
- Check file is valid VCF format

### Workflows not working
- Verify all 3 GitHub Secrets are added
- Check the Actions tab to see logs
- Secrets are case-sensitive!

---

## 🎬 FUTURE DEPLOYMENTS

After initial setup, deployments are **AUTOMATIC**:

```
You: git push origin main
GitHub: Sees code changed in backend/
GitHub Actions: Automatically deploys backend
Result: Live in 2 minutes (no manual steps!)
```

---

## 📱 TEST WITH SAMPLE VCF

You can use the sample file provided: `backend/sample.vcf`

It has:
- CYP2D6 variants
- CYP2C19 variants
- CYP2C9 variants
- SLCO1B1 variants
- TPMT variants
- DPYD variants

All analyzable by your system!

---

## 🎯 SUCCESS CHECKLIST

- [ ] Phase 1 complete (backend deployed, green Live)
- [ ] Phase 2 complete (3 GitHub Secrets added)
- [ ] Phase 3 complete (frontend VITE_API_URL set)
- [ ] Phase 4 complete (full flow tested)
- [ ] Backend API test passed
- [ ] Frontend routes accessible
- [ ] Sign up works
- [ ] Sign in works
- [ ] File upload works
- [ ] Analysis produces results
- [ ] Risk predictions displayed
- [ ] Ready to demo! 🎉

---

## ⏱️ TIME TRACKERS

| Phase | Estimated | Actual | Status |
|-------|-----------|--------|--------|
| Phase 1 | 5 min | ___ | ⏳ |
| Phase 2 | 3 min | ___ | ⏳ |
| Phase 3 | 2 min | ___ | ⏳ |
| Phase 4 | 10 min | ___ | ⏳ |
| **TOTAL** | **25 min** | ___ | ⏳ |

---

## 🆘 QUICK HELP

| Problem | Fix |
|---------|-----|
| 404 errors on /signup | Wait, refresh, check VITE_API_URL |
| API connection refused | Add VITE_API_URL environment variable |
| Workflows don't run | Check GitHub Secrets are added correctly |
| Database error | Verify MONGO_URI environment variable |
| Blank results page | Check backend logs on Render |

---

## 📖 NEED MORE HELP?

- **Setup Questions:** Read [FINAL_DEPLOYMENT_SETUP.md](FINAL_DEPLOYMENT_SETUP.md)
- **Understanding Workflows:** Read [GITHUB_ACTIONS_SETUP.md](GITHUB_ACTIONS_SETUP.md)
- **All Documentation:** See [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)
- **Test Results:** See [COMPREHENSIVE_TEST_REPORT.md](COMPREHENSIVE_TEST_REPORT.md)

---

## 🎉 YOU'RE READY!

This card has everything you need. Print it. Post it. Reference it.

In 25 minutes, you'll have a live, production-ready pharmacogenomics platform.

**Let's go!** 🚀

---

**Time to Deploy:** 25 minutes ⏱️  
**Difficulty:** Easy (just follow steps)  
**Outcome:** Professional website ✅  
**Status:** Ready NOW 🚀
