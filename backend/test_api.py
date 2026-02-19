"""
Test script for Pharmacogenomics API
Demonstrates how to use the API endpoints
"""

import requests
import json
import time

# API base URL
BASE_URL = 'http://localhost:5000'

def test_health():
    """Test health check endpoint"""
    print("\n=== Testing Health Check ===")
    response = requests.get(f'{BASE_URL}/health')
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    return response.status_code == 200

def test_supported_genes():
    """Test supported genes endpoint"""
    print("\n=== Testing Supported Genes ===")
    response = requests.get(f'{BASE_URL}/supported-genes')
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    return response.status_code == 200

def test_supported_drugs():
    """Test supported drugs endpoint"""
    print("\n=== Testing Supported Drugs ===")
    response = requests.get(f'{BASE_URL}/supported-drugs')
    print(f"Status Code: {response.status_code}")
    data = response.json()
    print(f"Number of supported drugs: {len(data['supported_drugs'])}")
    print(f"Drugs: {', '.join(data['supported_drugs'][:5])}...")
    return response.status_code == 200

def test_analyze_single_drug():
    """Test analysis with a single drug"""
    print("\n=== Testing Analysis with Single Drug ===")
    
    try:
        with open('sample.vcf', 'rb') as f:
            files = {'file': f}
            data = {
                'drug': 'warfarin',
                'patient_id': 'TEST001'
            }
            response = requests.post(f'{BASE_URL}/analyze', files=files, data=data)
    except FileNotFoundError:
        print("ERROR: sample.vcf not found. Make sure you're in the project directory.")
        return False
    
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        print(f"Patient ID: {result['patient_id']}")
        print(f"Number of analyses: {len(result['analyses'])}")
        
        if result['analyses']:
            analysis = result['analyses'][0]
            print(f"\nFirst Analysis:")
            print(f"  Drug: {analysis['drug']}")
            print(f"  Risk Label: {analysis['risk_assessment']['risk_label']}")
            print(f"  Confidence: {analysis['risk_assessment']['confidence_score']}")
            print(f"  Severity: {analysis['risk_assessment']['severity']}")
            print(f"  Primary Gene: {analysis['pharmacogenomic_profile']['primary_gene']}")
            print(f"  Phenotype: {analysis['pharmacogenomic_profile']['phenotype']}")
            print(f"  Detected Variants: {len(analysis['pharmacogenomic_profile']['detected_variants'])}")
            print(f"\nClinical Recommendation:")
            print(f"  {analysis['clinical_recommendation']}")
            
            if 'llm_explanation' in analysis and analysis['llm_explanation']:
                print(f"\nLLM Explanation:")
                print(f"  {analysis['llm_explanation'][:200]}...")
    else:
        print(f"Error: {response.json()}")
    
    return response.status_code == 200

def test_analyze_multiple_drugs():
    """Test analysis with multiple drugs"""
    print("\n=== Testing Analysis with Multiple Drugs ===")
    
    try:
        with open('sample.vcf', 'rb') as f:
            files = {'file': f}
            data = {
                'drug': json.dumps(['warfarin', 'codeine', 'citalopram']),
                'patient_id': 'TEST002'
            }
            response = requests.post(f'{BASE_URL}/analyze', files=files, data=data)
    except FileNotFoundError:
        print("ERROR: sample.vcf not found. Make sure you're in the project directory.")
        return False
    
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        print(f"Patient ID: {result['patient_id']}")
        print(f"Number of analyses: {len(result['analyses'])}")
        
        for i, analysis in enumerate(result['analyses'], 1):
            if 'error' not in analysis:
                print(f"\nAnalysis {i}:")
                print(f"  Drug: {analysis['drug']}")
                print(f"  Risk Label: {analysis['risk_assessment']['risk_label']}")
                print(f"  Primary Gene: {analysis['pharmacogenomic_profile']['primary_gene']}")
            else:
                print(f"\nAnalysis {i}: ERROR - {analysis['error']}")
    else:
        print(f"Error: {response.json()}")
    
    return response.status_code == 200

def test_error_handling():
    """Test error handling"""
    print("\n=== Testing Error Handling ===")
    
    # Test missing file
    print("\n1. Testing missing file:")
    data = {'drug': 'warfarin'}
    response = requests.post(f'{BASE_URL}/analyze', data=data)
    print(f"   Status: {response.status_code} - {response.json()['error']}")
    
    # Test missing drug
    print("\n2. Testing missing drug:")
    try:
        with open('sample.vcf', 'rb') as f:
            files = {'file': f}
            response = requests.post(f'{BASE_URL}/analyze', files=files)
    except FileNotFoundError:
        print("   ERROR: sample.vcf not found")
        return False
    
    print(f"   Status: {response.status_code} - {response.json()['error']}")
    
    # Test invalid file format
    print("\n3. Testing invalid file format:")
    try:
        with open('README.md', 'rb') as f:
            files = {'file': f}
            data = {'drug': 'warfarin'}
            response = requests.post(f'{BASE_URL}/analyze', files=files, data=data)
    except FileNotFoundError:
        print("   ERROR: README.md not found")
        return False
    
    print(f"   Status: {response.status_code} - {response.json()['error']}")
    
    return True

def run_all_tests():
    """Run all tests"""
    print("=" * 60)
    print("Pharmacogenomics API - Test Suite")
    print("=" * 60)
    
    tests = [
        ('Health Check', test_health),
        ('Supported Genes', test_supported_genes),
        ('Supported Drugs', test_supported_drugs),
        ('Single Drug Analysis', test_analyze_single_drug),
        ('Multiple Drug Analysis', test_analyze_multiple_drugs),
        ('Error Handling', test_error_handling),
    ]
    
    results = {}
    for test_name, test_func in tests:
        try:
            results[test_name] = test_func()
            time.sleep(1)  # Brief pause between tests
        except Exception as e:
            print(f"\nERROR in {test_name}: {str(e)}")
            results[test_name] = False
    
    # Summary
    print("\n" + "=" * 60)
    print("Test Summary")
    print("=" * 60)
    for test_name, result in results.items():
        status = "✓ PASSED" if result else "✗ FAILED"
        print(f"{test_name}: {status}")
    
    passed = sum(1 for r in results.values() if r)
    total = len(results)
    print(f"\nTotal: {passed}/{total} tests passed")
    
    return all(results.values())

if __name__ == '__main__':
    print("\nMake sure the Flask API is running on http://localhost:5000")
    print("Start it with: python app.py\n")
    
    try:
        # Quick connectivity test
        response = requests.get(f'{BASE_URL}/health', timeout=2)
        print("✓ API is accessible\n")
    except requests.exceptions.ConnectionError:
        print("✗ ERROR: Cannot connect to API at http://localhost:5000")
        print("  Make sure the Flask app is running: python app.py")
        exit(1)
    
    success = run_all_tests()
    exit(0 if success else 1)
