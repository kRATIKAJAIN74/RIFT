"""
Diagnostic script to test MongoDB connection and auth endpoints
Run this to verify your setup is working correctly
"""

import sys
import requests
import json
from datetime import datetime

# Test MongoDB connection
print("=" * 60)
print("RIFT Authentication System Diagnostic")
print("=" * 60)

print("\n1. Testing MongoDB Connection...")
try:
    from pymongo import MongoClient
    client = MongoClient('mongodb://localhost:27017/', serverSelectionTimeoutMS=3000)
    client.server_info()  # Will raise exception if can't connect
    print("✓ MongoDB is running and accessible")
    
    # Test database
    db = client['rift']
    print(f"✓ Database 'rift' is accessible")
    print(f"✓ Collections: {db.list_collection_names()}")
except Exception as e:
    print(f"✗ MongoDB connection failed: {e}")
    print("  → Make sure MongoDB is running")
    print("  → Windows: Run 'mongod' in PowerShell")
    print("  → macOS: brew services start mongodb-community")
    sys.exit(1)

# Test Backend
print("\n2. Testing Backend Server...")
try:
    response = requests.get('http://localhost:5000/health', timeout=5)
    if response.status_code == 200:
        print("✓ Backend is running")
        data = response.json()
        print(f"  Service: {data.get('service')}")
        print(f"  Version: {data.get('version')}")
    else:
        print(f"✗ Backend returned status {response.status_code}")
except Exception as e:
    print(f"✗ Backend connection failed: {e}")
    print("  → Make sure backend is running")
    print("  → Run: cd backend && python app.py")
    sys.exit(1)

# Test Signup
print("\n3. Testing Signup Endpoint...")
try:
    test_email = f"test_{datetime.now().timestamp()}@example.com"
    payload = {
        "email": test_email,
        "password": "test123456",
        "first_name": "Test",
        "last_name": "User"
    }
    
    response = requests.post(
        'http://localhost:5000/auth/signup',
        json=payload,
        timeout=5,
        headers={'Content-Type': 'application/json'}
    )
    
    print(f"Status Code: {response.status_code}")
    data = response.json()
    
    if response.status_code == 201:
        print("✓ Signup endpoint is working")
        print(f"  User created: {data['user']['email']}")
        print(f"  Token: {data['access_token'][:20]}...")
    else:
        print(f"✗ Signup failed: {data}")
        
except Exception as e:
    print(f"✗ Signup test failed: {e}")

# Test Signin
print("\n4. Testing Signin Endpoint...")
try:
    payload = {
        "email": test_email,
        "password": "test123456"
    }
    
    response = requests.post(
        'http://localhost:5000/auth/signin',
        json=payload,
        timeout=5,
        headers={'Content-Type': 'application/json'}
    )
    
    if response.status_code == 200:
        print("✓ Signin endpoint is working")
        data = response.json()
        token = data['access_token']
        user = data['user']
        print(f"  Logged in as: {user['first_name']} {user['last_name']}")
        
        # Test authenticated endpoint
        print("\n5. Testing Authenticated Endpoint (/auth/me)...")
        response = requests.get(
            'http://localhost:5000/auth/me',
            headers={'Authorization': f'Bearer {token}'},
            timeout=5
        )
        
        if response.status_code == 200:
            print("✓ Authenticated endpoint is working")
            data = response.json()
            print(f"  User: {data['user']['email']}")
        else:
            print(f"✗ Auth endpoint failed: {response.json()}")
    else:
        print(f"✗ Signin failed: {response.json()}")
        
except Exception as e:
    print(f"✗ Signin test failed: {e}")

print("\n" + "=" * 60)
print("Diagnostic Complete!")
print("=" * 60)
