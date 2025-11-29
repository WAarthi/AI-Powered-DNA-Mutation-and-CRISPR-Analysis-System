export interface ClinicalImpact {
  gene: string;
  diseaseAssociation: string;
  proteinImpact: string;
  clinicalSignificance: 'Benign' | 'Likely Pathogenic' | 'Pathogenic' | 'Uncertain Significance';
}

export interface MutationAnalysis {
  classification: 'Mutated' | 'Normal';
  probability: number;
  clinicalImpact: ClinicalImpact;
  aiExplanation: string;
  attentionWeights: number[];
}

export interface CrisprTarget {
  position: number;
  sequence: string;
  gcContent: number;
  safetyScore: number;
  riskLevel: 'Safe' | 'Moderate' | 'Risky';
  justification: string;
}

export interface CrisprAnalysis {
  targets: CrisprTarget[];
}
