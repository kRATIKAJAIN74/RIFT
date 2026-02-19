# Signup Route Troubleshooting Guide

## Quick Checklist

Before testing, ensure:

- [ ] MongoDB is running (`mongod` in PowerShell)
- [ ] Backend server is running (`python app.py` in backend folder)
- [ ] Frontend is running (`npm run dev` in frontend folder)
- [ ] Browser console is open (F12 or right-click → Inspect)

## Testing Steps

### Step 1: Verify Backend Connectivity

Open browser console and run:

```javascript
fetch("http://localhost:5000/health")
  .then((r) => r.json())
  .then((d) => console.log("Backend OK:", d))
  .catch((e) => console.error("Backend Down:", e));
```

Expected output: `Backend OK: {status: 'healthy', ...}`

If you see an error, the backend isn't running.

### Step 2: Run Diagnostic Script

In a PowerShell terminal:

```bash
cd "c:\Users\jkrat\OneDrive\Desktop\RIFT\backend"
python test_auth_diagnostic.py
```

This will test:

1. MongoDB connection
2. Backend server status
3. Signup endpoint
4. Signin endpoint
5. Authenticated endpoint

### Step 3: Monitor Console Logs

When signing up:

1. Open Browser DevTools (F12)
2. Go to Console tab
3. Try signup
4. Look for logs like:
   ```
   Sending signup request: {email: "...", ...}
   Signup response: 201 {success: true, ...}
   ```

If you see errors like "Network error", the backend isn't responding.

## Common Issues & Solutions

### Issue 1: "Network error. Make sure backend is running."

**Cause**: Backend server is not running

**Solution**:

```bash
cd "c:\Users\jkrat\OneDrive\Desktop\RIFT\backend"
python app.py
```

You should see:

```
WARNING: This is a development server. Do not use it in production.
Running on http://0.0.0.0:5000
```

### Issue 2: "Database connection failed"

**Cause**: MongoDB is not running or not accessible

**Solution**:

**Windows:**

```powershell
# Option 1: Start MongoDB service
Start-Service MongoDB  # If installed as service

# Option 2: Run mongod directly
mongod
```

**macOS:**

```bash
brew services start mongodb-community
```

**Verify MongoDB is running:**

```bash
mongosh  # Should connect without errors
```

### Issue 3: "User already exists"

**Cause**: You already signed up with that email

**Solution**: Use a different email or clear MongoDB:

```bash
# In mongosh
db.users.deleteMany({})
```

### Issue 4: CORS errors in browser console

**Cause**: Frontend-backend communication issue

**Example error:**

```
Access to XMLHttpRequest at 'http://localhost:5000/auth/signup' from
origin 'http://localhost:5175' has been blocked by CORS policy
```

**Solution**: Make sure both backend and frontend are running with CORS enabled (which they are by default)

### Issue 5: Empty error message or blank screen after signup

**Cause**: Response parsing issue

**Solution**: Check browser console for detailed error logs

## Backend Environment Variables

Make sure `.env` file in backend folder has:

```
MONGO_URI=mongodb://localhost:27017/
MONGO_DB=rift
JWT_SECRET_KEY=rift-pharmagenomics-secret-key-2026
```

## Authentication Flow Verification

### Frontend (Browser Console)

Try this in browser console:

```javascript
// Test signup
const signupData = {
  email: "test@example.com",
  password: "test123456",
  first_name: "Test",
  last_name: "User",
};

fetch("http://localhost:5000/auth/signup", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(signupData),
})
  .then((r) => {
    console.log("Status:", r.status);
    return r.json();
  })
  .then((d) => console.log("Response:", d))
  .catch((e) => console.error("Error:", e));
```

### Backend (Python Console)

Test MongoDB directly:

```python
from pymongo import MongoClient

client = MongoClient('mongodb://localhost:27017/')
db = client['rift']
users = db['users']

# Check if any users exist
print(users.find_one())

# Or list all users (be careful about passwords)
for user in users.find({}, {'password': 0}):
    print(user)
```

## Performance Optimization

Clear browser cache if having issues:

```javascript
// In browser console
localStorage.clear();
sessionStorage.clear();
```

Then refresh the page.

## Still Having Issues?

1. **Check Backend Logs**: Look for error messages when you try to signup
2. **Use Diagnostic Script**: Run `python test_auth_diagnostic.py`
3. **Check MongoDB**: `mongosh` to verify connection
4. **Clear Cache**: `localStorage.clear()` and hard refresh browser
5. **Restart Services**:
   - Stop and restart MongoDB
   - Stop and restart Flask backend
   - Hard refresh browser (Ctrl+Shift+R)

## Expected Flow

1. User visits http://localhost:5175
2. Clicks "Start Analysis"
3. Redirected to /signin
4. User fills signup form
5. Frontend sends POST to http://localhost:5000/auth/signup
6. Backend creates user in MongoDB
7. Backend returns JWT token
8. Frontend stores token in localStorage
9. Frontend redirects to /upload
10. User can now use the app

## Debug Mode

To see detailed logs:

**Backend**: The Flask server prints request logs. Look for:

```
POST /auth/signup HTTP/1.1" 201
POST /auth/signin HTTP/1.1" 200
```

**Frontend**: Check browser console for `console.log` statements showing:

- `Sending signup request: {...}`
- `Signup response: 201 {...}`
