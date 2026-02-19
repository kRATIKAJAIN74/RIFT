"""
Test the signup process end-to-end
"""

import sys
from utils.auth import UserManager
import bcrypt

print("=" * 60)
print("MongoDB Atlas Signup Test")
print("=" * 60)

# Test 1: Direct user creation
print("\n1. Testing Direct User Creation...")
try:
    test_email = "direct_signup_test@example.com"
    user_data, error = UserManager.create_user(
        email=test_email,
        password="testpass123",
        first_name="Direct",
        last_name="Signup"
    )
    
    if error:
        print(f"✗ User creation failed: {error}")
    else:
        print(f"✓ User created: {user_data['email']}")
        print(f"  ID: {user_data['_id']}")
        print(f"  Name: {user_data['first_name']} {user_data['last_name']}")
        
except Exception as e:
    print(f"✗ Exception: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

# Test 2: Authentication
print("\n2. Testing User Authentication...")
try:
    auth_user, auth_error = UserManager.authenticate_user(
        email=test_email,
        password="testpass123"
    )
    
    if auth_error:
        print(f"✗ Authentication failed: {auth_error}")
    else:
        print(f"✓ Authentication successful: {auth_user['email']}")
        
except Exception as e:
    print(f"✗ Exception: {e}")

# Test 3: Verify in database
print("\n3. Verifying in MongoDB...")
try:
    from utils.auth import users_collection
    
    if users_collection is None:
        print("✗ MongoDB connection is None")
        sys.exit(1)
    
    found_user = users_collection.find_one({'email': test_email})
    
    if found_user:
        print(f"✓ User found in database")
        print(f"  Email: {found_user.get('email')}")
        print(f"  First Name: {found_user.get('first_name')}")
        print(f"  Has Password Hash: {'password' in found_user}")
        
        # Verify password hash
        stored_hash = found_user.get('password')
        is_valid = bcrypt.checkpw(
            "testpass123".encode('utf-8'),
            stored_hash.encode('utf-8')
        )
        print(f"  Password Valid: {is_valid}")
    else:
        print(f"✗ User not found in database: {test_email}")
        
except Exception as e:
    print(f"✗ Exception: {e}")
    import traceback
    traceback.print_exc()

print("\n" + "=" * 60)
print("Test Complete!")
print("=" * 60)
