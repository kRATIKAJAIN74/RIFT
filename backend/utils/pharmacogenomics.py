"""
Pharmacogenomics analysis and risk assessment
"""

import json
import os
from datetime import datetime, timezone
from collections import defaultdict


class PharmacogenomicsAnalyzer:
    """Analyze genetic profiles and predict drug response risks"""
    
    def __init__(self):
        """Initialize analyzer with CPIC lookup data"""
        self.cpic_data = self._load_cpic_data()
        self.drug_gene_mapping = self._build_drug_gene_mapping()
    
    def _load_cpic_data(self):
        """Load CPIC and PharmGKB lookup data"""
        data_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'cpic_lookup.json')
        
        if os.path.exists(data_path):
            with open(data_path, 'r') as f:
                return json.load(f)
        else:
            # Return default mock data if file doesn't exist
            return self._get_default_cpic_data()
    
    def _get_default_cpic_data(self):
        """Default CPIC data structure"""
        return {
            'CYP2D6': {
                'diplotypes': {
                    '*1/*1': {'phenotype': 'Normal Metabolizer', 'activity': 'normal'},
                    '*1/*2': {'phenotype': 'Normal Metabolizer', 'activity': 'normal'},
                    '*4/*4': {'phenotype': 'Poor Metabolizer', 'activity': 'poor'},
                    '*1/*4': {'phenotype': 'Intermediate Metabolizer', 'activity': 'reduced'},
                    '*2/*4': {'phenotype': 'Intermediate Metabolizer', 'activity': 'reduced'},
                    '*5/*5': {'phenotype': 'Ultra-Rapid Metabolizer', 'activity': 'ultra-rapid'}
                }
            },
            'CYP2C19': {
                'diplotypes': {
                    '*1/*1': {'phenotype': 'Extensive Metabolizer', 'activity': 'normal'},
                    '*1/*2': {'phenotype': 'Intermediate Metabolizer', 'activity': 'reduced'},
                    '*2/*2': {'phenotype': 'Poor Metabolizer', 'activity': 'poor'},
                    '*1/*3': {'phenotype': 'Intermediate Metabolizer', 'activity': 'reduced'}
                }
            },
            'CYP2C9': {
                'diplotypes': {
                    '*1/*1': {'phenotype': 'Normal Metabolizer', 'activity': 'normal'},
                    '*1/*2': {'phenotype': 'Intermediate Metabolizer', 'activity': 'reduced'},
                    '*1/*3': {'phenotype': 'Intermediate Metabolizer', 'activity': 'reduced'},
                    '*2/*2': {'phenotype': 'Poor Metabolizer', 'activity': 'poor'},
                    '*2/*3': {'phenotype': 'Poor Metabolizer', 'activity': 'poor'},
                    '*3/*3': {'phenotype': 'Poor Metabolizer', 'activity': 'poor'}
                }
            },
            'TPMT': {
                'diplotypes': {
                    '*1/*1': {'phenotype': 'Normal Activity', 'activity': 'normal'},
                    '*1/*3': {'phenotype': 'Intermediate Activity', 'activity': 'reduced'},
                    '*3/*3': {'phenotype': 'Low/Absent Activity', 'activity': 'poor'}
                }
            },
            'DPYD': {
                'diplotypes': {
                    'Normal': {'phenotype': 'Normal Metabolizer', 'activity': 'normal'},
                    'Heterozygous': {'phenotype': 'Intermediate Metabolizer', 'activity': 'reduced'},
                    'Homozygous': {'phenotype': 'Poor Metabolizer', 'activity': 'poor'}
                }
            },
            'SLCO1B1': {
                'diplotypes': {
                    '*1a/*1a': {'phenotype': 'Normal', 'activity': 'normal'},
                    '*1a/*1b': {'phenotype': 'Normal', 'activity': 'normal'},
                    '*1b/*1b': {'phenotype': 'Reduced', 'activity': 'reduced'}
                }
            }
        }
    
    def _build_drug_gene_mapping(self):
        """Build mapping of drugs to primary genes"""
        return {
            'citalopram': 'CYP2C19',
            'escitalopram': 'CYP2C19',
            'sertraline': 'CYP2C19',
            'paroxetine': 'CYP2D6',
            'fluoxetine': 'CYP2D6',
            'venlafaxine': 'CYP2D6',
            'metoprolol': 'CYP2D6',
            'codeine': 'CYP2D6',
            'tramadol': 'CYP2D6',
            'warfarin': 'CYP2C9',
            'phenytoin': 'CYP2C9',
            'atorvastatin': 'SLCO1B1',
            'simvastatin': 'SLCO1B1',
            'azathioprine': 'TPMT',
            '6-mercaptopurine': 'TPMT',
            '5-fluorouracil': 'DPYD'
        }
    
    def analyze(self, gene_variants, drug, patient_id):
        """
        Analyze genetic profile for drug response
        
        Args:
            gene_variants: Dictionary of gene -> variants
            drug: Drug name
            patient_id: Patient identifier
            
        Returns:
            Analysis result with risk assessment
        """
        drug_lower = drug.lower()
        primary_gene = self.drug_gene_mapping.get(drug_lower, None)
        
        # Determine diplotype and phenotype
        if primary_gene and primary_gene in gene_variants:
            variants = gene_variants[primary_gene]
            diplotype, phenotype = self._infer_diplotype_phenotype(primary_gene, variants)
        else:
            diplotype = 'Unknown'
            phenotype = 'Unknown'
        
        # Assess risk based on phenotype
        risk_data = self._assess_drug_risk(drug_lower, phenotype, primary_gene)
        
        # Collect detected rsIDs
        detected_variants = []
        if primary_gene and primary_gene in gene_variants:
            detected_variants = [v['rsid'] for v in gene_variants[primary_gene]]
        
        # Calculate data completeness and guideline alignment
        data_completeness = len(detected_variants) / 10.0 if detected_variants else 0.0
        data_completeness = min(data_completeness, 1.0)
        guideline_alignment = 0.8 if primary_gene else 0.0
        
        return {
            'patient_id': patient_id,
            'drug': drug,
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'risk_assessment': {
                'risk_label': risk_data['risk_label'],
                'confidence_score': risk_data['confidence_score'],
                'severity': risk_data['severity']
            },
            'pharmacogenomic_profile': {
                'primary_gene': primary_gene if primary_gene else 'Unknown',
                'diplotype': diplotype,
                'phenotype': phenotype,
                'detected_variants': detected_variants
            },
            'clinical_recommendation': risk_data['clinical_recommendation'],
            'quality_metrics': {
                'data_completeness': round(data_completeness, 2),
                'guideline_alignment': round(guideline_alignment, 2)
            }
        }
    
    def _infer_diplotype_phenotype(self, gene, variants):
        """
        Infer diplotype and phenotype from variants
        
        Args:
            gene: Gene name
            variants: List of variant records
            
        Returns:
            Tuple of (diplotype, phenotype)
        """
        if not variants:
            return 'Unknown', 'Unknown'
        
        # Count allele types based on variants
        alt_count = sum(1 for v in variants if '1' in v.get('genotype', '0/0'))
        
        # Simplified diplotype inference logic
        if alt_count == 0:
            diplotype = '*1/*1'
        elif alt_count == 1:
            diplotype = '*1/*2'
        else:
            diplotype = '*2/*2'
        
        # Look up phenotype from CPIC data
        if gene in self.cpic_data:
            gene_data = self.cpic_data[gene]
            if 'diplotypes' in gene_data and diplotype in gene_data['diplotypes']:
                phenotype = gene_data['diplotypes'][diplotype]['phenotype']
                return diplotype, phenotype
        
        return diplotype, 'Unknown'
    
    def _assess_drug_risk(self, drug, phenotype, primary_gene):
        """
        Assess drug risk based on phenotype
        
        Args:
            drug: Drug name (normalized)
            phenotype: Inferred phenotype
            primary_gene: Primary gene for drug metabolism
            
        Returns:
            Risk assessment with label, confidence, and recommendation
        """
        # Risk mapping based on metabolism phenotype
        risk_mapping = {
            'Normal Metabolizer': {
                'risk_label': 'Safe',
                'confidence': 0.95,
                'severity': 'low'
            },
            'Extensive Metabolizer': {
                'risk_label': 'Safe',
                'confidence': 0.9,
                'severity': 'low'
            },
            'Intermediate Metabolizer': {
                'risk_label': 'Adjust Dosage',
                'confidence': 0.85,
                'severity': 'medium'
            },
            'Reduced': {
                'risk_label': 'Adjust Dosage',
                'confidence': 0.85,
                'severity': 'medium'
            },
            'Poor Metabolizer': {
                'risk_label': 'Toxic',
                'confidence': 0.9,
                'severity': 'high'
            },
            'Ultra-Rapid Metabolizer': {
                'risk_label': 'Ineffective',
                'confidence': 0.8,
                'severity': 'medium'
            },
            'Unknown': {
                'risk_label': 'Unknown',
                'confidence': 0.0,
                'severity': 'low'
            }
        }
        
        risk_data = risk_mapping.get(phenotype, risk_mapping['Unknown'])
        
        # Generate clinical recommendation
        recommendation = self._generate_recommendation(drug, risk_data['risk_label'], phenotype, primary_gene)
        
        return {
            'risk_label': risk_data['risk_label'],
            'confidence_score': risk_data['confidence'],
            'severity': risk_data['severity'],
            'clinical_recommendation': recommendation
        }
    
    def _generate_recommendation(self, drug, risk_label, phenotype, primary_gene):
        """Generate clinical recommendation based on risk assessment"""
        recommendations = {
            'Safe': f'{drug.capitalize()} is generally safe at standard doses for this patient based on {primary_gene} phenotype ({phenotype}).',
            'Adjust Dosage': f'{drug.capitalize()} dosing should be adjusted. Patient has {phenotype} phenotype for {primary_gene}. Consider lower doses.',
            'Toxic': f'{drug.capitalize()} is not recommended or requires careful monitoring. Patient has {phenotype} phenotype for {primary_gene}. Consider alternative treatment.',
            'Ineffective': f'{drug.capitalize()} may be ineffective. Patient is {phenotype} for {primary_gene}. Higher doses or alternative drug may be needed.',
            'Unknown': f'Insufficient genetic data available for {drug.capitalize()} recommendations.'
        }
        
        return recommendations.get(risk_label, 'Unable to generate recommendation.')
    
    def get_supported_drugs(self):
        """Get list of supported drugs"""
        return list(self.drug_gene_mapping.keys())
