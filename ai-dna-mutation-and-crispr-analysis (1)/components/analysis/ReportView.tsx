import React from 'react';
import type { MutationAnalysis, CrisprAnalysis } from '../../types';

interface ReportViewProps {
    mutationResult: MutationAnalysis | null;
    crisprResult: CrisprAnalysis | null;
    dnaSequence: string;
}

export const ReportView: React.FC<ReportViewProps> = ({ mutationResult, crisprResult, dnaSequence }) => {
    if (!mutationResult || !crisprResult) {
        return (
            <div className="text-center py-10 min-h-[300px] flex flex-col justify-center items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                <p className="mt-4 text-slate-500 dark:text-slate-400">Complete both Mutation and CRISPR analyses to generate a report.</p>
            </div>
        );
    }
    
    const generateReportText = () => {
        let report = ` G E N O - A I :   C L I N I C A L   D N A   R E P O R T\n`;
        report += `============================================================\n\n`;
        report += `  Report Generated: ${new Date().toLocaleString()}\n`;
        report += `  Sequence Length: ${dnaSequence.length} bp\n\n`;

        report += `------------------------------------------------------------\n`;
        report += `  SECTION 1: MUTATION ANALYSIS\n`;
        report += `------------------------------------------------------------\n`;
        report += `  OVERALL CLASSIFICATION: ${mutationResult.classification.toUpperCase()}\n`;
        report += `  MUTATION PROBABILITY: ${(mutationResult.probability * 100).toFixed(1)}%\n\n`;

        report += `  CLINICAL IMPACT (SIMULATED DATABASE LOOKUP):\n`;
        report += `  - Gene Name: ${mutationResult.clinicalImpact.gene}\n`;
        report += `  - Disease Association: ${mutationResult.clinicalImpact.diseaseAssociation}\n`;
        report += `  - Protein Impact: ${mutationResult.clinicalImpact.proteinImpact}\n`;
        report += `  - Clinical Significance: ${mutationResult.clinicalImpact.clinicalSignificance.toUpperCase()}\n\n`;

        report += `  AI EXPLANATION FOR CLINICIAN:\n`;
        report += `  ${mutationResult.aiExplanation.replace(/(?![^\n]{1,65}$)([^\n]{1,65})\s/g, '$1\n  ')}\n\n`;


        report += `------------------------------------------------------------\n`;
        report += `  SECTION 2: CRISPR-CAS9 TARGET ANALYSIS\n`;
        report += `------------------------------------------------------------\n`;
        if (crisprResult.targets.length > 0) {
            const riskCounts = { Safe: 0, Moderate: 0, Risky: 0 };
            crisprResult.targets.forEach(t => riskCounts[t.riskLevel]++);

            report += `  SUMMARY: Found ${crisprResult.targets.length} potential target sites.\n`;
            report += `           Safe: ${riskCounts.Safe}, Moderate: ${riskCounts.Moderate}, Risky: ${riskCounts.Risky}\n\n`;
            
            report += `  RECOMMENDED TARGETS (sorted by Safety Score):\n`;
            crisprResult.targets
              .sort((a,b) => b.safetyScore - a.safetyScore)
              .forEach((target, i) => {
                report += `  [${i + 1}] Position: ${target.position}\n`;
                report += `      gRNA Sequence: ${target.sequence}\n`;
                report += `      GC Content: ${target.gcContent.toFixed(1)}%\n`;
                report += `      Safety Score: ${target.safetyScore.toFixed(2)}/1.00\n`;
                report += `      Risk Level: ${target.riskLevel}\n\n`;
            });
        } else {
            report += `  No suitable CRISPR targets were identified in this sequence.\n\n`;
        }
        
        report += `============================================================\n`;
        report += `  END OF REPORT.\n`;
        report += `  Disclaimer: This AI-generated report is for research and\n`;
        report += `  educational purposes only and is not a substitute for\n`;
        report += `  professional medical advice or genetic counseling.\n`;
        return report;
    };

    const handleDownloadPdf = () => {
        if (!mutationResult || !crisprResult) return;
    
        const { jsPDF } = (window as any).jspdf;
        const doc = new jsPDF();
    
        // Header
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text("GenoAI Clinical DNA Report", 105, 20, { align: 'center' });
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Report Date: ${new Date().toLocaleString()}`, 105, 28, { align: 'center' });
    
        // Section 1: Mutation Analysis
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text("Section 1: Mutation Analysis", 14, 45);
    
        (doc as any).autoTable({
            startY: 50,
            head: [['Metric', 'Result']],
            body: [
                ['Classification', mutationResult.classification],
                ['Mutation Probability', `${(mutationResult.probability * 100).toFixed(1)}%`],
                ['Associated Gene', mutationResult.clinicalImpact.gene],
                ['Disease Association', mutationResult.clinicalImpact.diseaseAssociation],
                ['Protein Impact', mutationResult.clinicalImpact.proteinImpact],
                ['Clinical Significance', mutationResult.clinicalImpact.clinicalSignificance],
            ],
            theme: 'grid',
            columnStyles: {
                0: { cellWidth: 45 },
                1: { cellWidth: 'auto' },
            }
        });
    
        let finalY = (doc as any).lastAutoTable.finalY;
    
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        const explanationYStart = finalY + 15;
        doc.text("AI Explanation:", 14, explanationYStart);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const splitExplanation = doc.splitTextToSize(mutationResult.aiExplanation, 180);
        doc.text(splitExplanation, 14, explanationYStart + 6);
        finalY = explanationYStart + 6 + (splitExplanation.length * 4.5);
    
        // Section 2: CRISPR Analysis
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        const crisprSectionYStart = finalY + 15;
        doc.text("Section 2: CRISPR-Cas9 Target Analysis", 14, crisprSectionYStart);
        
        if(crisprResult.targets.length > 0) {
            (doc as any).autoTable({
                startY: crisprSectionYStart + 5,
                head: [['Pos', 'Sequence (gRNA)', 'GC %', 'Safety', 'Risk']],
                body: crisprResult.targets
                    .sort((a,b) => b.safetyScore - a.safetyScore)
                    .map(t => [t.position, t.sequence, t.gcContent.toFixed(1), t.safetyScore.toFixed(2), t.riskLevel]),
                theme: 'striped',
                headStyles: { fillColor: [41, 128, 185] },
            });
        } else {
            doc.text("No suitable CRISPR targets identified in the provided sequence.", 14, crisprSectionYStart + 5);
        }
        
        // Footer / Disclaimer
        const pageHeight = doc.internal.pageSize.getHeight();
        doc.setFontSize(8);
        doc.text("Disclaimer: This AI-generated report is for research and educational purposes only and is not a substitute for professional medical advice or genetic counseling.", 105, pageHeight - 10, { align: 'center', maxWidth: 180 });
    
        doc.save(`GenoAI_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Clinical DNA Health Report</h3>
                <p className="mt-1 text-slate-600 dark:text-slate-400">
                    A comprehensive summary of the mutation and CRISPR analysis results. You can download this report as a PDF file.
                </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                <pre className="whitespace-pre-wrap font-mono text-xs text-slate-800 dark:text-slate-200 max-h-96 overflow-y-auto">
                    {generateReportText()}
                </pre>
            </div>
            <div className="text-center">
                <button
                    onClick={handleDownloadPdf}
                    className="inline-flex items-center px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 transition-colors duration-200"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    Download PDF Report
                </button>
            </div>
        </div>
    );
};