# 🚀 Quick Deployment Reference

## Pre-Deployment Checklist

- [ ] MongoDB Atlas cluster created and configured
- [ ] OpenAI API key obtained
- [ ] Groq API key obtained
- [ ] Code pushed to GitHub repository
- [ ] Render account created

## Render Dashboard Setup (5 minutes)

1. **Create Web Service**
   - Go to: https://dashboard.render.com
   - Click: "New +" → "Web Service"
   - Connect your GitHub repo
   - Render auto-detects `render.yaml`

2. **Set Environment Variables** (Go to Environment tab)

   ```
   JWT_SECRET_KEY        → [Auto-generate]
   OPENAI_API_KEY        → sk-...
   GROQ_API_KEY          → gsk_...
   MONGODB_URI           → mongodb+srv://...
   FRONTEND_URL          → Leave empty (or set after frontend deployed)
   ```

3. **Deploy**
   - Click "Create Web Service"
   - Wait 5-10 minutes for build
   - Your API URL: `https://your-app-name.onrender.com`

## Test Deployment

```bash
curl https://your-app-name.onrender.com/health

# Expected:
{"status":"healthy","service":"Pharmacogenomics API","version":"1.0.0"}
```

## Update Frontend

Replace `http://localhost:5000` with `https://your-app-name.onrender.com`

## Common Issues

| Issue               | Solution                                   |
| ------------------- | ------------------------------------------ |
| Build fails         | Check all dependencies in requirements.txt |
| 500 errors          | Verify environment variables are set       |
| CORS errors         | Update FRONTEND_URL to match your frontend |
| DB connection fails | Check MongoDB whitelist (0.0.0.0/0)        |

## Files Modified

- ✅ `app.py` - Added CORS + production config
- ✅ `requirements.txt` - Added flask-cors + gunicorn
- ✅ `render.yaml` - NEW deployment config
- ✅ `.env.example` - NEW environment template
- ✅ `RENDER_DEPLOYMENT.md` - NEW full guide

## Support

Full documentation: `RENDER_DEPLOYMENT.md`
Changes summary: `DEPLOYMENT_CHANGES.md`
