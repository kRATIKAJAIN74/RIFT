# Fix Frontend API URLs for Production Deployment

## Files That Need Updates

### 1. AuthContext.jsx
Replace all `http://localhost:5000` with `${API_BASE_URL}`

### 2. UploadPage.jsx  
Replace all `http://localhost:5000` with `${API_BASE_URL}`

## Manual Steps (Quick Fix)

### Step 1: Add API Config Import to AuthContext.jsx
At the top of `frontend/src/contexts/AuthContext.jsx`, change:
```jsx
import { createContext, useContext, useState, useEffect } from 'react'
```

To:
```jsx
import { createContext, useContext, useState, useEffect } from 'react'
import { API_BASE_URL } from '../config/api'
```

### Step 2: Update AuthContext.jsx URLs
Replace these 3 lines:
- Line ~24: `'http://localhost:5000/auth/me'` → `` `${API_BASE_URL}/auth/me` ``
- Line ~57: `'http://localhost:5000/auth/signup'` → `` `${API_BASE_URL}/auth/signup` ``
- Line ~87: `'http://localhost:5000/auth/signin'` → `` `${API_BASE_URL}/auth/signin` ``

### Step 3: Add API Config Import to UploadPage.jsx
At the top of `frontend/src/pages/UploadPage.jsx`, change:
```jsx
import { useAuth } from '../contexts/AuthContext'
```

To:
```jsx
import { useAuth } from '../contexts/AuthContext'
import { API_BASE_URL } from '../config/api'
```

### Step 4: Update UploadPage.jsx URLs
Replace these 2 lines:
- Line ~74: `'http://localhost:5000/assistant/chat'` → `` `${API_BASE_URL}/assistant/chat` ``
- Line ~182: `'http://localhost:5000/analyze'` → `` `${API_BASE_URL}/analyze` ``

## OR Use VS Code Find & Replace

1. Open each file in questions
2. Press `Ctrl+H` (Find & Replace)
3. Find: `'http://localhost:5000`
4. Replace: `` `${API_BASE_URL} ``
5. Click "Replace All"

## Set Environment Variable on Render

After updating the code, set environment variable on Render: Dashboard:

**Variable Name:** `VITE_API_URL`  
**Value:** Your backend URL (e.g., `https://your-backend.onrender.com`)

## Files Already Created ✓

- ✓ `frontend/src/config/api.js` - API configuration
- ✓ `frontend/public/_redirects` - Routing fix
- ✓ `frontend/vercel.json` - Alternative platform config

## After Making Changes

```bash
cd frontend
git add .
git commit -m "Fix: Use environment variable for API URL"
git push origin main
```

Then on Render:
1. Set `VITE_API_URL` environment variable
2. Trigger redeploy
3. Wait for build to complete
4. Test website

## Expected Result

Frontend will use:
- **Local development:** `http://localhost:5000` (default)
- **Production:** Your deployed backend URL (from env var)
