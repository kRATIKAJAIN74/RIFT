# Sample VCF Files for Testing Pharmacogenomics Analysis

## Available Test Files

### 1. **comprehensive_test.vcf** - Complete Test Suite
- Tests all 6 pharmacogenes (CYP2D6, CYP2C19, CYP2C9, SLCO1B1, TPMT, DPYD)
- Includes variants with different genotypes (heterozygous 0/1 and homozygous 1/1)
- Tests all 16 supported drugs
- **Expected Results:**
  - CYP2D6: Normal Metabolizer (Safe for codeine, tramadol, etc.)
  - CYP2C19: Poor Metabolizer (Toxic risk for citalopram, sertraline)
  - CYP2C9: Poor Metabolizer (Toxic risk for warfarin, phenytoin)
  - SLCO1B1: Poor function (Toxic risk for statins)
  - TPMT: Intermediate Activity (Adjust dosage for azathioprine)
  - DPYD: Intermediate Metabolizer (Adjust dosage for 5-FU)

### 2. **normal_metabolizer.vcf** - Normal/Safe Profile
- No clinically significant variants (all 0/0 genotypes)
- **Expected Results:**
  - All drugs should show "Safe" risk level
  - Normal metabolizer phenotype for all genes
  - Standard dosing recommendations

### 3. **intermediate_metabolizer.vcf** - Moderate Risk Profile
- Heterozygous variants (0/1) in multiple genes
- **Expected Results:**
  - Intermediate metabolizer phenotypes
  - "Adjust Dosage" recommendations
  - Reduced function variants in CYP2D6, CYP2C19, CYP2C9, SLCO1B1

### 4. **high_risk_patient.vcf** - High-Risk Profile
- Homozygous variants (1/1) representing poor metabolizers
- **Expected Results:**
  - Poor metabolizer phenotypes
  - "Toxic" risk levels
  - Recommendations for alternative medications
  - Covers CYP2D6, CYP2C19, CYP2C9, TPMT, DPYD

### 5. **sample.vcf** - Original Simple Test
- Basic test file with mixed genotypes
- Good for quick testing

## How to Test

### Via Terminal/API:
```bash
python test_all_drugs.py
python test_phenotype.py
```

### Via Web Interface:
1. Open browser to http://localhost:5174/upload
2. Upload any of the VCF files
3. Select drugs to analyze
4. View results with phenotypes, risk levels, and recommendations

## Variants Included

### Key rsIDs by Gene:
- **CYP2D6** (chr22): rs28371725, rs1135840
- **CYP2C19** (chr10): rs28399499, rs4244285
- **CYP2C9** (chr10): rs1799853, rs1057910
- **SLCO1B1** (chr12): rs4149056
- **TPMT** (chr6): rs1800462, rs1800460
- **DPYD** (chr1): rs75017182, rs67376798

## Expected Risk Distributions

**comprehensive_test.vcf:**
- Safe: 6 drugs
- Adjust Dosage: 3 drugs
- Toxic: 7 drugs

**normal_metabolizer.vcf:**
- Safe: All drugs

**intermediate_metabolizer.vcf:**
- Adjust Dosage: Most drugs

**high_risk_patient.vcf:**
- Toxic: Most drugs
