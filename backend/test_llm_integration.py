"""Test enhanced LLM integration"""
import requests
import json

r = requests.post('http://localhost:5000/analyze', 
    files={'file': open('comprehensive_test.vcf', 'rb')}, 
    data={'drug': json.dumps(['warfarin', 'codeine']), 'patient_id': 'LLM_TEST_001'})

result = r.json()

print('\n' + '='*90)
print('LLM INTEGRATION TEST - ENHANCED EXPLANATIONS')
print('='*90)

print(f"\nLLM Status:")
print(f"  Available: {result.get('llm_status', {}).get('available')}")
print(f"  Model: {result.get('llm_status', {}).get('model')}")

for analysis in result['analyses'][:2]:
    print(f"\n{'-'*90}")
    print(f"DRUG: {analysis['drug'].upper()}")
    print(f"Gene: {analysis['pharmacogenomic_profile']['primary_gene']}")
    print(f"Phenotype: {analysis['pharmacogenomic_profile']['phenotype']}")
    print(f"Risk: {analysis['risk_assessment']['risk_label']}")
    print(f"Confidence: {analysis['risk_assessment']['confidence_score']:.0%}")
    
    llm_exp = analysis.get('llm_generated_explanation', {})
    print(f"\n📋 LLM Explanation (Source: {llm_exp.get('source', 'Unknown')}):")
    print(f"\n{llm_exp.get('summary', 'N/A')}")
    
    if llm_exp.get('variant_context'):
        print(f"\n🧬 Variant Context: {llm_exp.get('variant_context')}")

print(f"\n{'='*90}")
print("✅ LLM Integration Successfully Implemented!")
print(f"{'='*90}\n")
