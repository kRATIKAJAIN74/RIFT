"""
OpenAI API integration for generating LLM explanations
"""

import os
try:
    from openai import OpenAI
except ImportError:
    OpenAI = None


class OpenAIExplainer:
    """Generate clinical explanations using OpenAI API"""
    
    def __init__(self, api_key=None):
        """
        Initialize OpenAI explainer
        
        Args:
            api_key: OpenAI API key (can also be set via OPENAI_API_KEY env var)
        """
        self.api_key = api_key or os.getenv('OPENAI_API_KEY')
        self.client = None
        
        if self.api_key and OpenAI:
            try:
                self.client = OpenAI(api_key=self.api_key)
            except Exception as e:
                print(f"Warning: Failed to initialize OpenAI client: {str(e)}")
    
    def generate_explanation(self, drug, risk_label, phenotype, primary_gene, clinical_recommendation):
        """
        Generate a clinical explanation using OpenAI GPT
        
        Args:
            drug: Drug name
            risk_label: Risk assessment label
            phenotype: Inferred metabolizer phenotype
            primary_gene: Primary gene involved in metabolism
            clinical_recommendation: Clinical recommendation text
            
        Returns:
            LLM-generated clinical explanation string
        """
        if not self.client:
            return self._get_fallback_explanation(drug, risk_label, phenotype, primary_gene)
        
        try:
            prompt = self._build_prompt(drug, risk_label, phenotype, primary_gene, clinical_recommendation)
            
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a clinical pharmacist expert in pharmacogenomics. Provide concise, evidence-based explanations of pharmacogenomic findings for healthcare professionals. Keep responses under 150 words."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.7,
                max_tokens=200
            )
            
            return response.choices[0].message.content.strip()
        
        except Exception as e:
            print(f"Error generating OpenAI explanation: {str(e)}")
            return self._get_fallback_explanation(drug, risk_label, phenotype, primary_gene)
    
    def _build_prompt(self, drug, risk_label, phenotype, primary_gene, clinical_recommendation):
        """Build prompt for OpenAI API"""
        return f"""Based on the following pharmacogenomic profile, provide a brief clinical explanation suitable for healthcare providers.

Drug: {drug}
Primary Gene: {primary_gene}
Metabolizer Phenotype: {phenotype}
Risk Assessment: {risk_label}
Clinical Recommendation: {clinical_recommendation}

Please explain:
1. What this metabolizer phenotype means for this drug
2. Relevant clinical implications
3. Any special considerations for treatment

Keep the response concise and actionable for clinical practice."""
    
    def _get_fallback_explanation(self, drug, risk_label, phenotype, primary_gene):
        """
        Generate fallback explanation when OpenAI API is unavailable
        
        Args:
            drug: Drug name
            risk_label: Risk label
            phenotype: Metabolizer phenotype
            primary_gene: Primary gene
            
        Returns:
            Fallback explanation string
        """
        explanations = {
            ('Safe', 'Normal Metabolizer'): 
                f"Patient is a normal metabolizer of {drug} via {primary_gene}. Standard doses are expected to be effective and safe.",
            
            ('Safe', 'Extensive Metabolizer'):
                f"Patient has extensive metabolism of {drug} through {primary_gene}. Standard dosing is appropriate.",
            
            ('Adjust Dosage', 'Intermediate Metabolizer'):
                f"Patient is an intermediate metabolizer of {drug} via {primary_gene}. Dose reduction may be needed to avoid toxicity while maintaining efficacy.",
            
            ('Adjust Dosage', 'Reduced'):
                f"Patient has reduced {primary_gene} activity. Lower doses of {drug} are recommended to minimize side effects.",
            
            ('Toxic', 'Poor Metabolizer'):
                f"Patient is a poor metabolizer of {drug} via {primary_gene}. Standard doses may lead to toxic accumulation. Consider alternative medications or substantial dose reduction.",
            
            ('Ineffective', 'Ultra-Rapid Metabolizer'):
                f"Patient metabolizes {drug} very rapidly through {primary_gene}. Standard doses may be ineffective. Higher doses or alternative agents may be considered.",
            
            ('Unknown', 'Unknown'):
                f"Insufficient genetic data available to make definitive recommendations for {drug}."
        }
        
        key = (risk_label, phenotype)
        return explanations.get(key, f"Pharmacogenomic analysis suggests risk level '{risk_label}' for {drug} in patients with {phenotype} status.")
