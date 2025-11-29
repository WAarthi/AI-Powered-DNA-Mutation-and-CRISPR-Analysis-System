import React, { useRef, useEffect } from 'react';
import type { CrisprAnalysis, CrisprTarget } from '../../types';

interface CrisprResultProps {
  result: CrisprAnalysis | null;
  sequence: string;
  reportMode: 'doctor' | 'public';
  theme: 'light' | 'dark';
}

const RiskBadge: React.FC<{ level: 'Safe' | 'Moderate' | 'Risky' }> = ({ level }) => {
  const colorClasses = {
    Safe: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    Moderate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    Risky: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
  };
  return <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${colorClasses[level]}`}>{level}</span>;
};

const SequenceHighlight: React.FC<{ sequence: string; targets: CrisprTarget[] }> = ({ sequence, targets }) => {
  const highlighted = [];
  let lastIndex = 0;

  const sortedTargets = [...targets].sort((a,b) => a.position - b.position);

  sortedTargets.forEach((target, i) => {
    const startIndex = target.position - 1;
    const endIndex = startIndex + 20;

    if (startIndex >= 0 && endIndex <= sequence.length) {
        if (startIndex > lastIndex) {
            highlighted.push(<span key={`seq-${lastIndex}`}>{sequence.substring(lastIndex, startIndex)}</span>);
        }
        highlighted.push(
            <span key={`target-${i}`} className="bg-blue-200 dark:bg-blue-800 rounded px-0.5" title={`Target ${i+1}: ${target.sequence}`}>
            {sequence.substring(startIndex, endIndex)}
            </span>
        );
        lastIndex = endIndex;
    }
  });

  if (lastIndex < sequence.length) {
    highlighted.push(<span key={`seq-end`}>{sequence.substring(lastIndex)}</span>);
  }

  return <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg font-mono text-sm break-all leading-relaxed whitespace-pre-wrap">{highlighted}</div>;
};

const RiskDistributionChart: React.FC<{ targets: CrisprTarget[], theme: 'light' | 'dark' }> = ({ targets, theme }) => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstance = useRef<any>(null);

    useEffect(() => {
        if (chartRef.current) {
            if (chartInstance.current) chartInstance.current.destroy();

            const ctx = chartRef.current.getContext('2d');
            if (ctx) {
                const isDark = theme === 'dark';
                const riskCounts = { Safe: 0, Moderate: 0, Risky: 0 };
                targets.forEach(t => riskCounts[t.riskLevel]++);

                chartInstance.current = new (window as any).Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: ['Safe', 'Moderate', 'Risky'],
                        datasets: [{
                            data: [riskCounts.Safe, riskCounts.Moderate, riskCounts.Risky],
                            backgroundColor: ['rgba(34, 197, 94, 0.7)', 'rgba(234, 179, 8, 0.7)', 'rgba(239, 68, 68, 0.7)'],
                            borderColor: ['rgb(34, 197, 94)', 'rgb(234, 179, 8)', 'rgb(239, 68, 68)'],
                            borderWidth: 1,
                            barThickness: 25,
                        }]
                    },
                    options: {
                        indexAxis: 'y',
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: {
                            x: { ticks: { color: isDark ? '#cbd5e1' : '#475569', precision: 0 }, grid: { color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' } },
                            y: { ticks: { color: isDark ? '#cbd5e1' : '#475569' }, grid: { display: false } }
                        }
                    }
                });
            }
        }
        return () => { if (chartInstance.current) chartInstance.current.destroy() };
    }, [targets, theme]);
    
    return <div className="h-40"><canvas ref={chartRef}></canvas></div>;
};


const DoctorCrisprView: React.FC<{ result: CrisprAnalysis; sequence: string; theme: 'light' | 'dark' }> = ({ result, sequence, theme }) => {
    if (result.targets.length === 0) {
        return <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800/50 text-yellow-800 dark:text-yellow-300 px-4 py-3 rounded-lg">No suitable CRISPR target sites (preceded by NGG PAM site) were found.</div>;
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <h4 className="font-semibold text-slate-700 dark:text-slate-200 mb-2">CRISPR Target Visualization</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Predicted gRNA target sites are highlighted in blue on the DNA sequence.</p>
                    <SequenceHighlight sequence={sequence} targets={result.targets} />
                </div>
                 <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
                    <h4 className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Risk Distribution</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Count of potential targets by predicted safety level.</p>
                    <RiskDistributionChart targets={result.targets} theme={theme} />
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                    <thead className="bg-slate-50 dark:bg-slate-700">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Position</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Guide RNA Sequence (20nt)</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">GC Content</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Safety Score</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Risk Level</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                    {result.targets.map((target, index) => (
                        <tr key={index} title={target.justification}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-100">{target.position}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-600 dark:text-slate-300">{target.sequence}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{target.gcContent.toFixed(1)}%</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{target.safetyScore.toFixed(2)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm"><RiskBadge level={target.riskLevel} /></td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const PublicCrisprView: React.FC<{ result: CrisprAnalysis }> = ({ result }) => {
    const safeTargets = result.targets.filter(t => t.riskLevel === 'Safe').length;
    const totalTargets = result.targets.length;

    return (
        <div className="p-6 rounded-lg bg-slate-50 dark:bg-slate-700/50 border-l-4 border-blue-500">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">What is CRISPR Analysis?</h3>
            <p className="mt-4 text-slate-600 dark:text-slate-300">CRISPR is a gene-editing technology that can precisely cut DNA. This analysis identifies the best places in the sequence for the CRISPR tool to target, which is the first step in using it for research or therapy.</p>
            {totalTargets > 0 ? (
                <p className="mt-4 text-slate-600 dark:text-slate-300">The AI found <strong>{totalTargets} potential target sites</strong> in this DNA sequence, of which <strong>{safeTargets} are predicted to be 'Safe'</strong> with a lower risk of side effects.</p>
            ) : (
                 <p className="mt-4 text-slate-600 dark:text-slate-300">The AI did not find any suitable target sites for the CRISPR tool in this particular DNA sequence.</p>
            )}
        </div>
    );
}

export const CrisprResult: React.FC<CrisprResultProps> = ({ result, sequence, reportMode, theme }) => {
  if (!result) {
    return (
      <div className="text-center py-10 min-h-[300px] flex flex-col justify-center items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121M12 12l2.879-2.879M12 12L19 5M4.929 4.929L10 10m-7 7l7-7m-7 7l2.879-2.879" /></svg>
        <p className="mt-4 text-slate-500 dark:text-slate-400">Run the CRISPR analysis to see predicted target sites here.</p>
      </div>
    );
  }
  
  return reportMode === 'doctor'
    ? <DoctorCrisprView result={result} sequence={sequence} theme={theme} />
    : <PublicCrisprView result={result} />;
};