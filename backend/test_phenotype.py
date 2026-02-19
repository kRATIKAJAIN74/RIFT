"""
Test script to verify phenotype inference with sample VCF
"""

import requests

# Test the analyze endpoint with sample VCF
url = 'http://localhost:5000/analyze'

# Read the sample VCF file
with open('sample.vcf', 'rb') as f:
    files = {'file': ('sample.vcf', f, 'text/plain')}
    data = {
        'drug': '["warfarin", "codeine", "simvastatin"]',
        'patient_id': 'test_patient_001'
    }
    
    print("Uploading sample VCF file for analysis...")
    response = requests.post(url, files=files, data=data)
    
    if response.status_code == 200:
        result = response.json()
        print("\n" + "="*80)
        print("ANALYSIS RESULTS")
        print("="*80)
        print(f"\nPatient ID: {result.get('patient_id')}")
        print(f"Timestamp: {result.get('timestamp')}")
        print(f"Success: {result.get('success')}")
        
        for analysis in result.get('analyses', []):
            print("\n" + "-"*80)
            print(f"Drug: {analysis.get('drug')}")
            print(f"Primary Gene: {analysis['pharmacogenomic_profile']['primary_gene']}")
            print(f"Diplotype: {analysis['pharmacogenomic_profile']['diplotype']}")
            print(f"Phenotype: {analysis['pharmacogenomic_profile']['phenotype']}")
            print(f"Risk Label: {analysis['risk_assessment']['risk_label']}")
            print(f"Confidence: {analysis['risk_assessment']['confidence_score']}")
            print(f"Detected Variants: {', '.join(analysis['pharmacogenomic_profile']['detected_variants'])}")
            print(f"\nRecommendation: {analysis.get('clinical_recommendation')}")
    else:
        print(f"Error: {response.status_code}")
        print(response.text)
