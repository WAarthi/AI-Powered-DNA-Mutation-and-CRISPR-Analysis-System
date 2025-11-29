import { GoogleGenAI, Type } from "@google/genai";
import type { MutationAnalysis, CrisprAnalysis, CrisprTarget } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const findPotentialTargets = (sequence: string): { position: number; sequence: string }[] => {
    const targets = [];
    const pamRegex = /GG/g;
    let match;
    while ((match = pamRegex.exec(sequence)) !== null) {
        const pamPosition = match.index - 1;
        if (pamPosition >= 20) {
            const guideRnaStartPosition = pamPosition - 20;
            const guideRnaSequence = sequence.substring(guideRnaStartPosition, pamPosition);
            targets.push({
                position: guideRnaStartPosition + 1,
                sequence: guideRnaSequence,
            });
        }
    }
    return targets;
};

export async function analyzeMutation(dnaSequence: string): Promise<MutationAnalysis> {
  const mutationPrompt = `
    You are a clinical bioinformatics AI. Your knowledge is based on models trained on datasets like the 1000 Genomes Project, IGVC, and databases like ClinVar, COSMIC, and UniProt.
    Analyze the following DNA sequence of length ${dnaSequence.length} characters: "${dnaSequence}".
    
    Perform the following tasks:
    1.  **Classification**: Classify the sequence as 'Mutated' or 'Normal'.
    2.  **Probability**: Provide a mutation probability score from 0.0 to 1.0.
    3.  **Clinical Impact**: Based on simulated queries to ClinVar, COSMIC, and UniProt, identify the most likely biological impact. Provide the gene name, associated disease, protein impact, and clinical significance ('Benign', 'Likely Pathogenic', 'Pathogenic', 'Uncertain'). If no specific impact is found, state that.
    4.  **AI Explanation**: Write a brief paragraph explaining which regions of the sequence most influenced your decision, as if you were explaining it to a clinician.
    5.  **Attention Weights**: Generate an 'attentionWeights' array of ${dnaSequence.length} numbers (between 0.0 and 1.0). This array MUST have the exact same length as the sequence.
    
    Return a single, valid JSON object.`;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: mutationPrompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    classification: { type: Type.STRING, enum: ['Mutated', 'Normal'] },
                    probability: { type: Type.NUMBER },
                    clinicalImpact: {
                        type: Type.OBJECT,
                        properties: {
                            gene: { type: Type.STRING },
                            diseaseAssociation: { type: Type.STRING },
                            proteinImpact: { type: Type.STRING },
                            clinicalSignificance: { type: Type.STRING, enum: ['Benign', 'Likely Pathogenic', 'Pathogenic', 'Uncertain Significance'] }
                        },
                        required: ['gene', 'diseaseAssociation', 'proteinImpact', 'clinicalSignificance']
                    },
                    aiExplanation: { type: Type.STRING },
                    attentionWeights: { 
                        type: Type.ARRAY,
                        items: { type: Type.NUMBER }
                    }
                },
                required: ['classification', 'probability', 'clinicalImpact', 'aiExplanation', 'attentionWeights']
            },
        },
    });

    const resultText = response.text.trim();
    const resultJson = JSON.parse(resultText);

    if (resultJson.attentionWeights.length !== dnaSequence.length) {
      console.warn(`AI attention weights length mismatch. Normalizing.`);
      resultJson.attentionWeights = new Array(dnaSequence.length).fill(0);
    }

    return resultJson as MutationAnalysis;

  } catch (error) {
    console.error("Error in analyzeMutation:", error);
    throw new Error("Failed to get mutation analysis from AI. The AI's response may have been malformed. Please try again.");
  }
}

export async function analyzeCrisprTargets(dnaSequence: string): Promise<CrisprAnalysis> {
  const potentialTargets = findPotentialTargets(dnaSequence);

  if (potentialTargets.length === 0) {
    return { targets: [] };
  }
  
  const crisprPrompt = `
    You are a CRISPR-Cas9 analysis AI, with knowledge from E-CRISP, CRISPRBench, and Addgene. I have identified potential gRNA sequences preceding NGG PAM sites.
    
    Potential targets:
    ${potentialTargets.map(t => `- Position ${t.position}: ${t.sequence}`).join('\n')}
    
    For each target, perform a comprehensive analysis:
    1.  **GC Content**: Calculate the GC content percentage of the gRNA sequence.
    2.  **Safety Score**: Provide a safety score from 0.0 to 1.0 (1.0 being safest) based on predicted off-target effects.
    3.  **Risk Level**: Classify the risk as 'Safe', 'Moderate', or 'Risky'.
    4.  **Justification**: Provide a brief justification for the risk assessment.
    
    Return a valid JSON array of objects, one for each target. Ensure position and sequence match the input exactly.`;
  
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: crisprPrompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        position: { type: Type.INTEGER },
                        sequence: { type: Type.STRING },
                        gcContent: { type: Type.NUMBER },
                        safetyScore: { type: Type.NUMBER },
                        riskLevel: { type: Type.STRING, enum: ['Safe', 'Moderate', 'Risky'] },
                        justification: { type: Type.STRING }
                    },
                    required: ['position', 'sequence', 'gcContent', 'safetyScore', 'riskLevel', 'justification']
                }
            },
        },
    });

    const resultText = response.text.trim();
    const resultJson = JSON.parse(resultText);

    return { targets: resultJson as CrisprTarget[] };
    
  } catch (error) {
    console.error("Error in analyzeCrisprTargets:", error);
    throw new Error("Failed to get CRISPR analysis from AI. Please check the sequence or try again.");
  }
}