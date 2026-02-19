"""
User authentication and database management
"""

import bcrypt
from datetime import datetime, timezone
from pymongo import MongoClient
from bson.objectid import ObjectId
import os
from dotenv import load_dotenv

load_dotenv()

# MongoDB connection
MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
MONGO_DB = os.getenv('MONGO_DB', 'rift')

users_collection = None

def init_mongodb():
    """Initialize MongoDB connection with verification"""
    global users_collection
    try:
        # Create client with connection timeout
        client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
        
        # Verify connection by pinging the server
        client.admin.command('ping')
        print("✓ MongoDB Atlas connection established")
        
        db = client[MONGO_DB]
        users_collection = db['users']
        
        # Ensure collection exists with proper settings
        if 'users' not in db.list_collection_names():
            db.create_collection('users')
            print(f"✓ Created 'users' collection in '{MONGO_DB}' database")
        
        return True
    except Exception as e:
        print(f"✗ MongoDB connection error: {e}")
        users_collection = None
        return False

# Initialize connection on import
init_mongodb()


class UserManager:
    """Manage user authentication and database operations"""
    
    @staticmethod
    def hash_password(password):
        """Hash password using bcrypt"""
        salt = bcrypt.gensalt(rounds=10)
        return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')
    
    @staticmethod
    def verify_password(password, hashed):
        """Verify password against hash"""
        return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))
    
    @staticmethod
    def create_user(email, password, first_name, last_name):
        """Create a new user in MongoDB"""
        if users_collection is None:
            print(f"[ERROR] MongoDB not connected - cannot create user {email}")
            return None, "Database connection failed"
        
        try:
            # Check if user already exists
            existing_user = users_collection.find_one({'email': email})
            if existing_user:
                print(f"[INFO] User already exists: {email}")
                return None, "User already exists"
            
            # Hash password
            hashed_password = UserManager.hash_password(password)
            
            # Create user document
            user_doc = {
                'email': email,
                'password': hashed_password,
                'first_name': first_name,
                'last_name': last_name,
                'username': email.split('@')[0],
                'created_at': datetime.now(timezone.utc),
                'updated_at': datetime.now(timezone.utc),
                'analyses': []
            }
            
            # Insert user with explicit write concern
            result = users_collection.insert_one(user_doc)
            
            if result.inserted_id:
                print(f"[SUCCESS] User created: {email} (ID: {result.inserted_id})")
                
                # Verify user was written
                verify_user = users_collection.find_one({'_id': result.inserted_id})
                if verify_user:
                    print(f"[VERIFIED] User confirmed in database: {email}")
                else:
                    print(f"[WARNING] User insertion returned ID but not verified in DB: {email}")
                
                return {
                    '_id': str(result.inserted_id),
                    'email': user_doc['email'],
                    'first_name': user_doc['first_name'],
                    'last_name': user_doc['last_name'],
                    'username': user_doc['username'],
                    'created_at': user_doc['created_at'].isoformat(),
                    'updated_at': user_doc['updated_at'].isoformat()
                }, None
            else:
                print(f"[ERROR] User insertion failed - no ID returned for {email}")
                return None, "Failed to create user - no insertion ID"
                
        except Exception as e:
            print(f"[ERROR] Exception creating user {email}: {str(e)}")
            return None, str(e)
    
    @staticmethod
    def authenticate_user(email, password):
        """Authenticate user and return user data"""
        if users_collection is None:
            return None, "Database connection failed"
        
        user = users_collection.find_one({'email': email})
        
        if not user:
            return None, "User not found"
        
        if not UserManager.verify_password(password, user['password']):
            return None, "Invalid password"
        
        # Return user data without password
        user_data = {
            '_id': str(user['_id']),
            'email': user['email'],
            'first_name': user['first_name'],
            'last_name': user['last_name'],
            'username': user['username']
        }
        return user_data, None
    
    @staticmethod
    def get_user_by_id(user_id):
        """Get user by ID"""
        if users_collection is None:
            return None
        
        try:
            user = users_collection.find_one({'_id': ObjectId(user_id)})
            if user:
                return {
                    '_id': str(user['_id']),
                    'email': user['email'],
                    'first_name': user['first_name'],
                    'last_name': user['last_name'],
                    'username': user['username']
                }
        except Exception as e:
            print(f"Error fetching user: {e}")
        
        return None
    
    @staticmethod
    def add_analysis_to_user(user_id, analysis_data):
        """Add analysis to user's analysis history"""
        if users_collection is None:
            return False
        
        try:
            users_collection.update_one(
                {'_id': ObjectId(user_id)},
                {
                    '$push': {
                        'analyses': {
                            'analysis_id': analysis_data.get('analysis_id'),
                            'timestamp': datetime.now(timezone.utc),
                            'patient_id': analysis_data.get('patient_id'),
                            'drugs': analysis_data.get('drugs', [])
                        }
                    }
                }
            )
            return True
        except Exception as e:
            print(f"Error adding analysis: {e}")
            return False
