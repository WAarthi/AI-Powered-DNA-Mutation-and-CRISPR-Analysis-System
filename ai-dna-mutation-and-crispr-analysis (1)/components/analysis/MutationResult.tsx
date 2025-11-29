import React, { useRef, useEffect } from 'react';
import type { MutationAnalysis } from '../../types';

interface MutationResultProps {
  result: MutationAnalysis | null;
  sequence: string;
  reportMode: 'doctor' | 'public';
  theme: 'light' | 'dark';
}

const getHeatmapColor = (weight: number) => `hsla(0, 90%, 65%, ${weight})`;

const AttentionHeatmap: React.FC<{ sequence: string; weights: number[] }> = ({ sequence, weights }) => {
    if (!sequence || !weights || sequence.length !== weights.length) return null;
    return (
        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg font-mono text-sm break-all leading-relaxed whitespace-pre-wrap">
        {sequence.split('').map((n, i) => (
            <span key={i} className="p-0.5 rounded" style={{ backgroundColor: getHeatmapColor(weights[i]) }} title={`Attention: ${weights[i].toFixed(3)}`}>{n}</span>
        ))}
        </div>
    );
};

const DataCard: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className = '' }) => (
  <div className={`bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg ${className}`}>
    <h4 className="font-semibold text-slate-700 dark:text-slate-300">{title}</h4>
    <div className="mt-2">{children}</div>
  </div>
);

const ProbabilityChart: React.FC<{ probability: number, isMutated: boolean, theme: 'light' | 'dark' }> = ({ probability, isMutated, theme }) => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstance = useRef<any>(null);

    useEffect(() => {
        if (chartRef.current) {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
            const ctx = chartRef.current.getContext('2d');
            if (ctx) {
                const isDark = theme === 'dark';
                const mainColor = isMutated ? 'rgba(239, 68, 68, 0.8)' : 'rgba(34, 197, 94, 0.8)';
                const mainBorderColor = isMutated ? 'rgb(239, 68, 68)' : 'rgb(34, 197, 94)';
                
                chartInstance.current = new (window as any).Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        datasets: [{
                            data: [probability, 1 - probability],
                            backgroundColor: [
                                mainColor,
                                isDark ? 'rgba(71, 85, 105, 0.5)' : 'rgba(226, 232, 240, 0.8)'
                            ],
                            borderColor: [
                                mainBorderColor,
                                isDark ? 'rgb(51, 65, 85)' : 'rgb(241, 245, 249)'
                            ],
                            borderWidth: 2,
                            hoverBorderWidth: 4,
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false }, tooltip: { enabled: false } },
                        cutout: '75%'
                    }
                });
            }
        }
        return () => {
            if (chartInstance.current) chartInstance.current.destroy();
        };
    }, [probability, isMutated, theme]);

    return (
        <div className="relative w-36 h-36">
            <canvas ref={chartRef}></canvas>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className={`text-3xl font-bold ${isMutated ? 'text-red-500' : 'text-green-600'}`}>
                    {(probability * 100).toFixed(1)}%
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">Probability</span>
            </div>
        </div>
    );
};


const DoctorMutationView: React.FC<{ result: MutationAnalysis; sequence: string; theme: 'light' | 'dark' }> = ({ result, sequence, theme }) => {
  const { classification, probability, clinicalImpact, aiExplanation, attentionWeights } = result;
  const isMutated = classification === 'Mutated';
  
  const significanceColor = {
    'Pathogenic': 'text-red-500 dark:text-red-400',
    'Likely Pathogenic': 'text-orange-500 dark:text-orange-400',
    'Benign': 'text-green-600 dark:text-green-400',
    'Uncertain Significance': 'text-yellow-500 dark:text-yellow-400',
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DataCard title="Classification & Probability">
            <div className="flex items-center space-x-4">
                 <ProbabilityChart probability={probability} isMutated={isMutated} theme={theme} />
                 <div className="flex-1">
                     <p className={`text-2xl font-bold ${isMutated ? 'text-red-500' : 'text-green-600'}`}>{classification}</p>
                     <p className="text-sm text-slate-500 dark:text-slate-400">AI-driven classification based on genomic markers.</p>
                 </div>
            </div>
        </DataCard>
         <DataCard title="Clinical Impact Analysis (Simulated)">
            <div className="space-y-2 text-sm">
                <div><strong className="text-slate-500 dark:text-slate-400 w-28 inline-block">Gene:</strong> <span className="font-medium">{clinicalImpact.gene}</span></div>
                <div><strong className="text-slate-500 dark:text-slate-400 w-28 inline-block">Significance:</strong> <span className={`font-bold ${significanceColor[clinicalImpact.clinicalSignificance]}`}>{clinicalImpact.clinicalSignificance}</span></div>
                <div><strong className="text-slate-500 dark:text-slate-400 w-28 inline-block">Association:</strong> <span className="font-medium">{clinicalImpact.diseaseAssociation}</span></div>
            </div>
        </DataCard>
      </div>

       <DataCard title="AI Explanation & Protein Impact">
         <p className="text-sm text-slate-600 dark:text-slate-300 italic mb-3 pb-3 border-b border-slate-200 dark:border-slate-600">{aiExplanation}</p>
         <p className="text-sm"><strong className="text-slate-500 dark:text-slate-400">Predicted Protein Impact:</strong> <span className="font-medium">{clinicalImpact.proteinImpact}</span></p>
      </DataCard>

      <div>
        <h4 className="font-semibold text-slate-700 dark:text-slate-200 mb-2">AI Attention Heatmap</h4>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Highlights nucleotides that most influenced the AI's decision. Brighter red indicates higher importance.</p>
        <AttentionHeatmap sequence={sequence} weights={attentionWeights} />
      </div>
    </div>
  );
};

const PublicMutationView: React.FC<{ result: MutationAnalysis }> = ({ result }) => {
    const { classification, probability, clinicalImpact } = result;
    const isMutated = classification === 'Mutated';
    
    let summaryText, riskColor;

    if (!isMutated) {
        summaryText = "The AI analysis indicates this DNA sequence appears to be normal and does not show significant signs of a disease-related mutation.";
        riskColor = "border-green-500";
    } else {
        summaryText = `The AI analysis found a potential mutation. Based on its knowledge of clinical databases, this genetic variation may be associated with **${clinicalImpact.diseaseAssociation}**.`;
        if (probability > 0.75) {
             riskColor = "border-red-500";
        } else {
             riskColor = "border-yellow-500";
        }
    }

    return (
        <div className={`p-6 rounded-lg bg-slate-50 dark:bg-slate-700/50 border-l-4 ${riskColor}`}>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Simple Summary</h3>
            <p className="mt-4 text-slate-600 dark:text-slate-300" dangerouslySetInnerHTML={{ __html: summaryText }}></p>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                <strong>Disclaimer:</strong> This is an AI-generated summary for educational purposes and is not a medical diagnosis. Please consult a healthcare professional for any health concerns.
            </p>
        </div>
    );
}

export const MutationResult: React.FC<MutationResultProps> = ({ result, sequence, reportMode, theme }) => {
  if (!result) {
    return (
      <div className="text-center py-10 min-h-[300px] flex flex-col justify-center items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
        <p className="mt-4 text-slate-500 dark:text-slate-400">Run the mutation analysis to see the results here.</p>
      </div>
    );
  }

  return reportMode === 'doctor' 
    ? <DoctorMutationView result={result} sequence={sequence} theme={theme} /> 
    : <PublicMutationView result={result} />;
};