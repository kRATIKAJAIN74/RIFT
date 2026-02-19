"""
Pharmacogenomics Risk Prediction Flask API
Analyzes VCF files and predicts drug response risks based on genetic profiles
"""

import json
import uuid
from datetime import datetime, timezone
from functools import wraps
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import os
from dotenv import load_dotenv

from utils.vcf_parser import VCFParser
from utils.pharmacogenomics import PharmacogenomicsAnalyzer
from utils.openai_integration import OpenAIExplainer

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Configuration
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB
ALLOWED_EXTENSIONS = {'vcf'}
UPLOAD_FOLDER = 'uploads'

# Create uploads folder if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_FILE_SIZE

# Enable CORS for frontend
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
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


@app.route('/analyze', methods=['POST'])
@validate_input()
def analyze():
    """
    Analyze VCF file and predict drug response risks
    
    Expected request:
    - file: VCF format file (multipart/form-data)
    - drug: Drug name or JSON array of drug names
    - patient_id (optional): Patient identifier
    """
    try:
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
