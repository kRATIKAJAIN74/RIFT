"""Quick test of normal metabolizer VCF"""
import requests

files = {'file': open('normal_metabolizer.vcf', 'rb')}
data = {'drug': '["warfarin", "codeine", "citalopram"]', 'patient_id': 'normal_test'}

r = requests.post('http://localhost:5000/analyze', files=files, data=data)
result = r.json()

print("\n========== Normal Metabolizer Profile Test ==========\n")
for a in result['analyses']:
    print(f"{a['drug'].upper()}")
    print(f"  Gene: {a['pharmacogenomic_profile']['primary_gene']}")
    print(f"  Phenotype: {a['pharmacogenomic_profile']['phenotype']}")
    print(f"  Risk: {a['risk_assessment']['risk_label']}")
    print(f"  Confidence: {a['risk_assessment']['confidence_score']:.0%}")
    print()
