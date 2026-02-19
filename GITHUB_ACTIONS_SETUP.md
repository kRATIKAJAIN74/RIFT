# 🚀 GITHUB ACTIONS AUTOMATED DEPLOYMENT SETUP

## What This Does

GitHub Actions will **automatically deploy your backend and frontend** whenever you push changes. No manual Render dashboard clicks needed!

---

## ⚙️ SETUP (One-Time Configuration - 5 minutes)

### Step 1: Get Render API Key (1 minute)

1. Go to: https://dashboard.render.com/api-tokens
2. Click "Generate" button
3. Copy the API key
4. Keep it safe - you'll use it in Step 4

### Step 2: Get Backend Service ID (1 minute)

1. Go to: https://dashboard.render.com/
2. Click on your backend service (if it exists) OR create one first
3. Look at the URL: `https://dashboard.render.com/services/[SERVICE_ID]`
4. Copy the SERVICE_ID part

**If backend not deployed yet:**
1. Click "New +" → "Web Service"
2. Connect GitHub repo (kRATIKAJAIN74/RIFT)
3. Set root directory to `backend`
4. Create service (get ID from URL)

### Step 3: Get Frontend Service ID (1 minute)

1. Go to: https://dashboard.render.com/
2. Click your frontend service (frontend-o22j.onrender.com)
3. Copy the SERVICE_ID from URL

### Step 4: Add GitHub Secrets (2 minutes)

1. Go to: https://github.com/kRATIKAJAIN74/RIFT/settings/secrets/actions
2. Click "New repository secret"
3. Add Secret 1:
   - **Name:** `RENDER_API_KEY`
   - **Value:** [Your API key from Step 1]
   - Click "Add secret"

4. Click "New repository secret" again
5. Add Secret 2:
   - **Name:** `RENDER_BACKEND_SERVICE_ID`
   - **Value:** [Your backend service ID from Step 2]
   - Click "Add secret"

6. Click "New repository secret" again
7. Add Secret 3:
   - **Name:** `RENDER_FRONTEND_SERVICE_ID`
   - **Value:** [Your frontend service ID from Step 3]
   - Click "Add secret"

---

## ✅ VERIFY SETUP

To test if everything works:

```bash
cd C:\Users\surya\OneDrive\Desktop\Hackathon\RIFT
touch backend/test-trigger.txt
git add .
git commit -m "Test: Trigger GitHub Actions"
git push origin main
```

Then:
1. Go to: https://github.com/kRATIKAJAIN74/RIFT/actions
2. You should see workflows running
3. Check Render dashboard - deployments should be triggered!

---

## 📊 DEPLOYMENT TRIGGERS

Your workflows are set up to trigger automatically:

| Changed File | Triggers |
|---|---|
| Anything in `backend/` | Backend deploy |
| Anything in `frontend/` | Frontend redeploy |

Example:
```bash
# This triggers BACKEND deployment
git add backend/utils/pharmacogenomics.py
git commit -m "Update analysis"
git push origin main
# → GitHub Actions runs deploy-backend.yml
# → Render backend service redeploys

# This triggers FRONTEND deployment
git add frontend/src/pages/UploadPage.jsx
git commit -m "Update UI"
git push origin main
# → GitHub Actions runs deploy-frontend.yml
# → Render frontend service redeploys
```

---

## 🎯 HOW TO USE

### To Deploy Backend Changes:
```bash
cd backend
# Make changes
git add .
git commit -m "Update: [description]"
git push origin main
# ✅ Automatic deployment starts
```

### To Deploy Frontend Changes:
```bash
cd frontend
# Make changes
git add .
git commit -m "Update: [description]"
git push origin main
# ✅ Automatic deployment starts
```

### To Deploy Both:
```bash
git add .
git commit -m "Update: both backend and frontend"
git push origin main
# ✅ Both deployments trigger automatically
```

---

## 📈 MONITOR DEPLOYMENTS

### Check GitHub Actions Status:
1. Go to: https://github.com/kRATIKAJAIN74/RIFT/actions
2. Click the latest workflow
3. See real-time deployment progress

### Check Render Deployment:
1. Go to: https://dashboard.render.com/
2. Click your service
3. See deployment history and logs

---

## 🆘 TROUBLESHOOTING

### Workflow doesn't trigger
**Causes:**
- GitHub Secrets not configured
- Service IDs incorrect
- Credentials expired

**Solution:**
- Verify all 3 secrets are set correctly
- Check GitHub Actions logs for errors

### Deployment fails
**Check Render logs:**
1. Go to dashboard.render.com
2. Click service
3. Check "Events" tab for error messages

**Common issues:**
- Build command failed → Check requirements.txt
- Start command wrong → Verify Procfile syntax
- Environment variables missing → Check Render dashboard

### Manual deployment still needed
If something goes wrong:
1. Go to Render dashboard
2. Click service
3. Click "Manual Deploy" → "Clear build cache & deploy"

---

## 🎬 NEXT ACTIONS

### Immediate (Do Now):
1. ✅ GitHub Actions workflows created (already done)
2. Get Render API key
3. Get Service IDs
4. Add GitHub Secrets
5. Test with dummy commit

### Result:
- ✅ Automated deployments working
- ✅ Backend auto-deploys on changes
- ✅ Frontend auto-redeploys on changes
- ✅ No more manual Render dashboard clicks!

---

## 📝 QUICK REFERENCE

### GitHub Actions Workflows:
- `.github/workflows/deploy-backend.yml` - Deploys backend
- `.github/workflows/deploy-frontend.yml` - Redeploys frontend

### Render Credentials Needed:
- **RENDER_API_KEY** - From API tokens page
- **RENDER_BACKEND_SERVICE_ID** - From backend service URL
- **RENDER_FRONTEND_SERVICE_ID** - From frontend service URL

### GitHub Secrets Location:
`https://github.com/kRATIKAJAIN74/RIFT/settings/secrets/actions`

---

## 🎯 FINAL CHECKLIST

Setup Complete When:
- [ ] API key from Render obtained
- [ ] Backend Service ID obtained
- [ ] Frontend Service ID obtained
- [ ] 3 GitHub Secrets configured
- [ ] Test workflow runs successfully
- [ ] Backend deployed via workflow
- [ ] Frontend redeployed via workflow

---

**Status:** GitHub Actions workflows created, waiting for API key setup  
**Next:** Get API key and configure 3 secrets  
**Then:** Auto-deployment ready!  

🚀 **LET'S GET AUTOMATED DEPLOYMENTS WORKING!**
