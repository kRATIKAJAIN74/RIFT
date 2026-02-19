"""
Comprehensive test script to verify all drug analysis results
Tests with comprehensive_test.vcf file
"""

import requests
import json

# Test the analyze endpoint with comprehensive VCF
url = 'http://localhost:5000/analyze'

# All supported drugs
drugs_to_test = [
    'warfarin', 'phenytoin',  # CYP2C9
    'citalopram', 'escitalopram', 'sertraline',  # CYP2C19
    'codeine', 'tramadol', 'paroxetine', 'fluoxetine', 'venlafaxine', 'metoprolol',  # CYP2D6
    'simvastatin', 'atorvastatin',  # SLCO1B1
    'azathioprine', '6-mercaptopurine',  # TPMT
    '5-fluorouracil'  # DPYD
]

# Read the comprehensive test VCF file
with open('comprehensive_test.vcf', 'rb') as f:
    files = {'file': ('comprehensive_test.vcf', f, 'text/plain')}
    data = {
        'drug': json.dumps(drugs_to_test),
        'patient_id': 'comprehensive_test_patient'
    }
    
    print("="*90)
    print("COMPREHENSIVE PHARMACOGENOMICS ANALYSIS TEST")
    print("="*90)
    print(f"\nTesting {len(drugs_to_test)} drugs across all pharmacogenes...")
    print("Upload in progress...\n")
    
    response = requests.post(url, files=files, data=data)
    
    if response.status_code == 200:
        result = response.json()
        
        print(f"Patient ID: {result.get('patient_id')}")
        print(f"Analysis Time: {result.get('timestamp')}")
        print(f"Success: {result.get('success')}\n")
        
        # Group results by gene
        gene_groups = {}
        for analysis in result.get('analyses', []):
            gene = analysis['pharmacogenomic_profile']['primary_gene']
            if gene not in gene_groups:
                gene_groups[gene] = []
            gene_groups[gene].append(analysis)
        
        # Display results grouped by gene
        for gene in sorted(gene_groups.keys()):
            print("\n" + "="*90)
            print(f"GENE: {gene}")
            print("="*90)
            
            analyses = gene_groups[gene]
            first = analyses[0]
            
            # Show gene-level info once
            print(f"Diplotype: {first['pharmacogenomic_profile']['diplotype']}")
            print(f"Phenotype: {first['pharmacogenomic_profile']['phenotype']}")
            print(f"Detected Variants: {', '.join(first['pharmacogenomic_profile']['detected_variants'])}")
            print(f"\nDrugs metabolized by {gene}:")
            print("-"*90)
            
            # Show each drug's results
            for analysis in analyses:
                risk = analysis['risk_assessment']
                drug = analysis.get('drug', 'Unknown').upper()
                
                # Color-code risk labels
                risk_symbol = {
                    'Safe': '✓',
                    'Adjust Dosage': '⚠',
                    'Toxic': '✗',
                    'Ineffective': '⚠',
                    'Unknown': '?'
                }.get(risk['risk_label'], '?')
                
                print(f"\n  [{risk_symbol}] {drug}")
                print(f"      Risk: {risk['risk_label']} | Confidence: {risk['confidence_score']:.0%} | Severity: {risk['severity']}")
                print(f"      Recommendation: {analysis.get('clinical_recommendation', 'N/A')}")
        
        print("\n" + "="*90)
        print("TEST SUMMARY")
        print("="*90)
        
        # Count risk categories
        risk_counts = {}
        for analysis in result.get('analyses', []):
            risk_label = analysis['risk_assessment']['risk_label']
            risk_counts[risk_label] = risk_counts.get(risk_label, 0) + 1
        
        print(f"\nTotal drugs analyzed: {len(result.get('analyses', []))}")
        print(f"Risk distribution:")
        for risk, count in sorted(risk_counts.items()):
            print(f"  - {risk}: {count}")
        
        # Show genes with variants detected
        genes_with_variants = set(a['pharmacogenomic_profile']['primary_gene'] 
                                  for a in result.get('analyses', []) 
                                  if a['pharmacogenomic_profile']['detected_variants'])
        print(f"\nGenes with variants detected: {', '.join(sorted(genes_with_variants))}")
        
    else:
        print(f"❌ Error: HTTP {response.status_code}")
        print(response.text)

print("\n" + "="*90)
print("Test completed!")
print("="*90)
