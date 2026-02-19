"""
Pharmacogenomics Risk Prediction Flask API
Analyzes VCF files and predicts drug response risks based on genetic profiles
"""

import json
import uuid
from datetime import datetime, timezone, timedelta
from functools import wraps
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import os
from dotenv import load_dotenv
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity

from utils.vcf_parser import VCFParser
from utils.pharmacogenomics import PharmacogenomicsAnalyzer
from utils.openai_integration import OpenAIExplainer
from utils.auth import UserManager

# Load environment variables
load_dotenv()

app = Flask(__name__)

# JWT Configuration
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=30)
jwt = JWTManager(app)

# Configuration
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB
ALLOWED_EXTENSIONS = {'vcf'}
UPLOAD_FOLDER = 'uploads'

# Create uploads folder if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_FILE_SIZE

# Enable CORS for frontend
@app.before_request
def handle_preflight():
    if request.method == 'OPTIONS':
        return '', 204

@app.after_request
def after_request(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    response.headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,OPTIONS'
    return response

# Initialize components
vcf_parser = VCFParser()
analyzer = PharmacogenomicsAnalyzer()
llm_explainer = OpenAIExplainer(api_key=os.getenv('OPENAI_API_KEY'))


def validate_file_extension(filename):
    """Validate file extension"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def validate_input():
    """Decorator to validate request input"""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            # Check for file in request
            if 'file' not in request.files:
                return jsonify({'error': 'No file part in request'}), 400
            
            file = request.files['file']
            if file.filename == '':
                return jsonify({'error': 'No file selected'}), 400
            
            if not validate_file_extension(file.filename):
                return jsonify({'error': 'Invalid file format. Only .vcf files allowed'}), 400
            
            # Check for drug input
            if 'drug' not in request.form:
                return jsonify({'error': 'Drug parameter is required'}), 400
            
            drug_input = request.form.get('drug', '').strip()
            if not drug_input:
                return jsonify({'error': 'Drug cannot be empty'}), 400
            
            # Check file size
            file.seek(0, os.SEEK_END)
            file_size = file.tell()
            file.seek(0)
            
            if file_size == 0:
                return jsonify({'error': 'File is empty'}), 400
            
            if file_size > MAX_FILE_SIZE:
                return jsonify({'error': f'File exceeds maximum size of {MAX_FILE_SIZE / 1024 / 1024} MB'}), 400
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'Pharmacogenomics API',
        'version': '1.0.0'
    }), 200


@app.route('/auth/signup', methods=['POST'])
def signup():
    """
    Register a new user
    
    Expected request body (JSON):
    {
        "email": "user@example.com",
        "password": "password123",
        "first_name": "John",
        "last_name": "Doe"
    }
    """
    try:
        data = request.get_json()
        print(f"[SIGNUP] Request received for email: {data.get('email')}")
        
        # Validate input
        required_fields = ['email', 'password', 'first_name', 'last_name']
        for field in required_fields:
            if field not in data or not data[field]:
                print(f"[SIGNUP] Validation failed: {field} is required")
                return jsonify({'error': f'{field} is required'}), 400
        
        # Validate email format
        if '@' not in data['email'] or '.' not in data['email']:
            print(f"[SIGNUP] Invalid email format: {data['email']}")
            return jsonify({'error': 'Invalid email format'}), 400
        
        # Validate password length
        if len(data['password']) < 6:
            print(f"[SIGNUP] Password too short for: {data['email']}")
            return jsonify({'error': 'Password must be at least 6 characters'}), 400
        
        # Create user
        print(f"[SIGNUP] Creating user: {data['email']}")
        user_data, error = UserManager.create_user(
            email=data['email'].lower(),
            password=data['password'],
            first_name=data['first_name'],
            last_name=data['last_name']
        )
        
        if error:
            print(f"[SIGNUP] User creation failed: {error}")
            return jsonify({'error': error}), 400
        
        print(f"[SIGNUP] User created successfully: {user_data['email']}")
        
        # Create access token
        access_token = create_access_token(identity=user_data['_id'])
        
        return jsonify({
            'success': True,
            'message': 'User registered successfully',
            'access_token': access_token,
            'user': user_data
        }), 201
        
    except Exception as e:
        print(f"[SIGNUP] Exception: {str(e)}")
        return jsonify({'error': f'Signup failed: {str(e)}'}), 500


@app.route('/auth/signin', methods=['POST'])

@app.route('/auth/signin', methods=['POST'])
def signin():
    """
    Authenticate user and return access token
    
    Expected request body (JSON):
    {
        "email": "user@example.com",
        "password": "password123"
    }
    """
    try:
        data = request.get_json()
        
        # Validate input
        if 'email' not in data or not data['email']:
            return jsonify({'error': 'Email is required'}), 400
        
        if 'password' not in data or not data['password']:
            return jsonify({'error': 'Password is required'}), 400
        
        # Authenticate user
        user_data, error = UserManager.authenticate_user(
            email=data['email'].lower(),
            password=data['password']
        )
        
        if error:
            return jsonify({'error': error}), 401
        
        # Create access token
        access_token = create_access_token(identity=user_data['_id'])
        
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'access_token': access_token,
            'user': user_data
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Login failed: {str(e)}'}), 500


@app.route('/auth/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """Get current authenticated user info"""
    try:
        user_id = get_jwt_identity()
        user_data = UserManager.get_user_by_id(user_id)
        
        if not user_data:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({
            'success': True,
            'user': user_data
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to get user: {str(e)}'}), 500


@app.route('/analyze', methods=['POST'])
@jwt_required()
@validate_input()
def analyze():
    """
    Analyze VCF file and predict drug response risks
    Requires JWT authentication
    
    Expected request:
    - file: VCF format file (multipart/form-data)
    - drug: Drug name or JSON array of drug names
    - patient_id (optional): Patient identifier
    """
    try:
        # Get current user
        user_id = get_jwt_identity()
        
        # Extract parameters
        file = request.files['file']
        drug_input = request.form.get('drug', '')
        patient_id = request.form.get('patient_id', str(uuid.uuid4()))
        
        # Parse drug input (can be single string or JSON array)
        try:
            drugs = json.loads(drug_input) if drug_input.startswith('[') else [drug_input]
        except json.JSONDecodeError:
            drugs = [drug_input]
        
        # Save uploaded file
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Parse VCF file
        try:
            variants = vcf_parser.parse_vcf(filepath)
        except Exception as e:
            return jsonify({'error': f'Failed to parse VCF file: {str(e)}'}), 400
        
        # Extract variants for relevant genes
        try:
            gene_variants = vcf_parser.extract_gene_variants(variants)
        except Exception as e:
            return jsonify({'error': f'Failed to extract gene variants: {str(e)}'}), 400
        
        # Generate analysis results for each drug
        results = []
        for drug in drugs:
            try:
                analysis = analyzer.analyze(
                    gene_variants=gene_variants,
                    drug=drug,
                    patient_id=patient_id
                )
                
                # Generate LLM explanation
                try:
                    llm_explanation = llm_explainer.generate_explanation(
                        drug=drug,
                        risk_label=analysis['risk_assessment']['risk_label'],
                        phenotype=analysis['pharmacogenomic_profile']['phenotype'],
                        primary_gene=analysis['pharmacogenomic_profile']['primary_gene'],
                        clinical_recommendation=analysis['clinical_recommendation']
                    )
                    analysis['llm_explanation'] = llm_explanation
                except Exception as e:
                    analysis['llm_explanation'] = f"LLM explanation generation failed: {str(e)}"
                
                results.append(analysis)
            except Exception as e:
                results.append({
                    'error': f'Analysis failed for drug {drug}: {str(e)}',
                    'drug': drug,
                    'patient_id': patient_id
                })
        
        # Clean up uploaded file
        try:
            os.remove(filepath)
        except:
            pass
        
        return jsonify({
            'success': True,
            'patient_id': patient_id,
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'analyses': results
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Unexpected error: {str(e)}'}), 500


@app.route('/supported-genes', methods=['GET'])
def supported_genes():
    """Return list of supported genes for analysis"""
    return jsonify({
        'supported_genes': ['CYP2D6', 'CYP2C19', 'CYP2C9', 'SLCO1B1', 'TPMT', 'DPYD'],
        'description': 'Genes used for pharmacogenomics analysis'
    }), 200


@app.route('/supported-drugs', methods=['GET'])
def supported_drugs():
    """Return list of supported drugs"""
    drugs = analyzer.get_supported_drugs()
    return jsonify({
        'supported_drugs': drugs,
        'description': 'Drugs with available pharmacogenomics data'
    }), 200


@app.errorhandler(413)
def request_entity_too_large(error):
    """Handle file too large error"""
    return jsonify({'error': 'File is too large. Maximum size is 5 MB'}), 413


@app.errorhandler(400)
def bad_request(error):
    """Handle bad request errors"""
    return jsonify({'error': 'Bad request'}), 400


@app.errorhandler(500)
def internal_error(error):
    """Handle internal server errors"""
    return jsonify({'error': 'Internal server error'}), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
