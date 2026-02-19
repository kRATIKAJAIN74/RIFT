# Authentication System Setup Guide

## Overview

The RIFT application now has a complete authentication system using JWT tokens and MongoDB for user storage.

## Backend Setup

### 1. MongoDB Installation

The application uses MongoDB to store user credentials and analysis history. You have two options:

#### Option A: Local MongoDB Installation

**Windows:**

1. Download MongoDB Community Edition from https://www.mongodb.com/try/download/community
2. Run the installer and follow the setup wizard
3. MongoDB will run as a Windows Service by default
4. Verify it's running: `mongosh` should connect successfully

**macOS:**

```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu):**

```bash
sudo apt-get install -y mongodb
sudo systemctl start mongodb
```

#### Option B: MongoDB Atlas (Cloud)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account and cluster
3. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
4. Update `MONGO_URI` in `.env` file

### 2. Environment Variables

Create/update `.env` file in `backend/` folder with:

```
MONGO_URI=mongodb://localhost:27017/
MONGO_DB=rift
JWT_SECRET_KEY=rift-pharmagenomics-secret-key-2026
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 4. Start Backend Server

```bash
python app.py
```

Server runs on `http://localhost:5000`

## Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

Frontend runs on `http://localhost:5175` (or next available port)

## Authentication Flow

### User Registration

1. Navigate to http://localhost:5175/signup
2. Fill in:
   - First Name
   - Last Name
   - Email
   - Password (min 6 characters)
   - Confirm Password
3. Click "Sign Up"
4. Automatically logged in and redirected to `/upload`

### User Login

1. Navigate to http://localhost:5175/signin
2. Enter email and password
3. Click "Sign In"
4. Redirected to `/upload`

### Protected Routes

- `/upload` - Requires authentication
  - If not logged in → redirects to `/signin`
  - Shows user info in navbar
  - Can upload VCF files and select medications

### User Profile

After login, you'll see:

- User's First Name and Last Name in a badge
- User's Email
- Logout button to end session

## API Endpoints

### Authentication Endpoints

**POST /auth/signup**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "first_name": "John",
  "last_name": "Doe"
}
```

Response: `{ access_token, user: { _id, email, first_name, last_name, username } }`

**POST /auth/signin**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response: `{ access_token, user: {...} }`

**GET /auth/me**
Header: `Authorization: Bearer {token}`
Response: `{ user: {...} }`

### Analysis Endpoint (Now Requires Auth)

**POST /analyze**
Header: `Authorization: Bearer {token}`
Body: FormData with:

- `file`: VCF file
- `drug`: JSON array of drug names

## Database Schema

### Users Collection

```javascript
{
  _id: ObjectId,
  email: String,
  password: String (hashed with bcrypt),
  first_name: String,
  last_name: String,
  username: String,
  created_at: Date,
  updated_at: Date,
  analyses: [
    {
      analysis_id: String,
      timestamp: Date,
      patient_id: String,
      drugs: [String]
    }
  ]
}
```

## Security Features

1. **Password Hashing**: Passwords are hashed using bcrypt with 10 rounds
2. **JWT Tokens**: Access tokens expire after 30 days
3. **CORS**: Enabled for development (adjust for production)
4. **Authorization**: All analysis routes require valid JWT token

## Testing the System

### Test Signup/Signin

1. Open http://localhost:5175
2. Click "Start Analysis"
3. You'll be redirected to signin page
4. Click "Sign Up" to create an account
5. Fill in the form and submit
6. You'll be logged in automatically

### Test Protected Routes

1. Try accessing http://localhost:5175/upload directly without logging in
2. You should be redirected to /signin
3. After login, you can access /upload

### Test Analysis with Auth

1. Login to the application
2. Go to Upload page
3. Upload a VCF file
4. Select medications
5. Click "Start Analysis"
6. The request will include your JWT token automatically

## Troubleshooting

### MongoDB Connection Error

- Ensure MongoDB is running: `mongosh` should connect
- Check `MONGO_URI` in `.env` file
- If using Atlas, ensure IP is whitelisted

### JWT Token Errors

- Ensure `JWT_SECRET_KEY` is set in `.env`
- Check Authorization header format: `Bearer {token}`
- Tokens expire after 30 days

### CORS Errors

- Ensure backend is running on http://localhost:5000
- Check `Access-Control-Allow-Origin` headers
- Frontend must be on different port than backend

### Authentication not working

- Clear browser localStorage: `localStorage.clear()`
- Check Network tab in browser DevTools for auth requests
- Verify backend logs for detailed error messages

## Future Enhancements

1. Email verification
2. Password reset functionality
3. Role-based access control (Admin, Doctor, Patient)
4. Analysis history and sharing
5. OAuth integration (Google, GitHub)
6. Rate limiting and API keys
7. Refresh token implementation
