"""
VCF file parsing and variant extraction utilities
Pure Python VCF parser - no external dependencies
"""

from collections import defaultdict


class VCFParser:
    """Parse and extract variants from VCF files"""
    
    # Target genes for pharmacogenomics analysis
    TARGET_GENES = {'CYP2D6', 'CYP2C19', 'CYP2C9', 'SLCO1B1', 'TPMT', 'DPYD'}
    
    # Gene annotation mappings (these would come from real VCF headers or external databases)
    GENE_POSITION_MAPPING = {
        'CYP2D6': {'chr': '22', 'start': 42126499, 'end': 42135544},
        'CYP2C19': {'chr': '10', 'start': 96522463, 'end': 96541053},
        'CYP2C9': {'chr': '10', 'start': 94942858, 'end': 94987273},
        'SLCO1B1': {'chr': '12', 'start': 21100000, 'end': 21410000},  # Extended to include rs4149056
        'TPMT': {'chr': '6', 'start': 18130000, 'end': 18170000},
        'DPYD': {'chr': '1', 'start': 97500000, 'end': 98348885}  # Extended to include all variants
    }
    
    def __init__(self):
        """Initialize VCF parser"""
        pass
    
    def parse_vcf(self, filepath):
        """
        Parse VCF file and extract variant records
        
        Args:
            filepath: Path to VCF file
            
        Returns:
            List of variant records (as dictionaries)
        """
        try:
            variants = []
            with open(filepath, 'r') as f:
                for line in f:
                    line = line.strip()
                    # Skip empty lines and headers
                    if not line or line.startswith('##') or line.startswith('#CHROM'):
                        continue
                    # Skip header info lines
                    if line.startswith('#'):
                        continue
                    
                    # Parse variant line
                    parts = line.split('\t')
                    if len(parts) < 8:
                        continue
                    
                    variant = self._parse_variant_line(parts)
                    if variant:
                        variants.append(variant)
            
            return variants
        except Exception as e:
            raise Exception(f"Error parsing VCF file: {str(e)}")
    
    def _parse_variant_line(self, parts):
        """
        Parse a single VCF variant line
        
        Args:
            parts: Split VCF line
            
        Returns:
            Variant dictionary or None
        """
        try:
            chrom = parts[0]
            pos = int(parts[1])
            variant_id = parts[2] if parts[2] != '.' else None
            ref = parts[3]
            alt = parts[4].split(',') if parts[4] != '.' else []
            qual = parts[5]
            filt = parts[6]
            info = parts[7]
            
            # Parse genotype if present
            genotype = None
            if len(parts) > 9:
                gt_field = parts[9]
                genotype = gt_field.split(':')[0] if ':' in gt_field else gt_field
            
            return {
                'CHROM': chrom,
                'POS': pos,
                'ID': variant_id,
                'REF': ref,
                'ALT': alt,
                'QUAL': qual,
                'INFO': info,
                'genotype': genotype
            }
        except:
            return None
    
    def extract_gene_variants(self, variants):
        """
        Extract variants for target genes
        
        Args:
            variants: List of variant records
            
        Returns:
            Dictionary with gene -> list of variants mapping
        """
        gene_variants = defaultdict(list)
        
        for variant in variants:
            # Map chromosome position to gene
            chrom = str(variant['CHROM']).replace('chr', '')
            gene = self._map_variant_to_gene(chrom, variant['POS'])
            
            if gene:
                # Get rsID or create position-based ID
                rsid = variant['ID'] if variant['ID'] else f'chr{chrom}:{variant["POS"]}'
                
                gene_variants[gene].append({
                    'rsid': rsid,
                    'chromosome': chrom,
                    'position': variant['POS'],
                    'ref': variant['REF'],
                    'alt': variant['ALT'],
                    'qual': variant['QUAL'],
                    'genotype': variant.get('genotype'),
                    'annotation': None
                })
        
        return dict(gene_variants)
    
    def _map_variant_to_gene(self, chrom, position):
        """
        Map chromosome position to gene
        
        Args:
            chrom: Chromosome identifier
            position: Position on chromosome
            
        Returns:
            Gene name if found, else None
        """
        # Normalize chromosome format (remove 'chr' prefix if present)
        chrom_str = str(chrom).replace('chr', '')
        
        for gene, coords in self.GENE_POSITION_MAPPING.items():
            chr_id = coords['chr'].replace('chr', '')
            if chrom_str == chr_id:
                if coords['start'] <= position <= coords['end']:
                    return gene
        return None
    
    
    def get_target_genes(self):
        """Get list of target genes"""
        return list(self.TARGET_GENES)
