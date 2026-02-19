"""
Test script to verify MongoDB Atlas write operations
"""

import sys
from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
MONGO_DB = os.getenv('MONGO_DB', 'rift')

print("=" * 60)
print("MongoDB Atlas Write Test")
print("=" * 60)

print("\n1. Testing Connection...")
try:
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    client.admin.command('ping')
    print("✓ Connected to MongoDB Atlas")
except Exception as e:
    print(f"✗ Connection failed: {e}")
    sys.exit(1)

print("\n2. Accessing Database...")
try:
    db = client[MONGO_DB]
    print(f"✓ Database '{MONGO_DB}' accessed")
except Exception as e:
    print(f"✗ Failed to access database: {e}")
    sys.exit(1)

print("\n3. Accessing Users Collection...")
try:
    users_collection = db['users']
    print(f"✓ Collection 'users' accessed")
except Exception as e:
    print(f"✗ Failed to access collection: {e}")
    sys.exit(1)

print("\n4. Writing Test Document...")
try:
    test_doc = {
        'email': 'write_test@example.com',
        'first_name': 'Write',
        'last_name': 'Test',
        'test': True
    }
    
    result = users_collection.insert_one(test_doc)
    print(f"✓ Document inserted with ID: {result.inserted_id}")
    
    # Verify write
    print("\n5. Verifying Write...")
    found_doc = users_collection.find_one({'_id': result.inserted_id})
    
    if found_doc:
        print(f"✓ Document verified in database")
        print(f"  Email: {found_doc.get('email')}")
        print(f"  Name: {found_doc.get('first_name')} {found_doc.get('last_name')}")
    else:
        print(f"✗ Document not found after insertion!")
        
except Exception as e:
    print(f"✗ Write operation failed: {e}")
    sys.exit(1)

print("\n6. Listing All Users...")
try:
    user_count = users_collection.count_documents({})
    print(f"✓ Total users in database: {user_count}")
    
    # Show recent users
    print("\nRecent users:")
    for i, user in enumerate(users_collection.find({}, {'password': 0}).sort('_id', -1).limit(5), 1):
        print(f"  {i}. {user.get('email')} ({user.get('first_name')} {user.get('last_name')})")
        
except Exception as e:
    print(f"✗ Failed to list users: {e}")

print("\n" + "=" * 60)
print("Write Test Complete!")
print("=" * 60)
