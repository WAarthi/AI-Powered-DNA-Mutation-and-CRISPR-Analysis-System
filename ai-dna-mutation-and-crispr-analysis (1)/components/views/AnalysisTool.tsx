import React, { useState, useCallback } from 'react';
import { Header } from '../layout/Header';
import { DnaInput } from '../analysis/DnaInput';
import { MutationResult } from '../analysis/MutationResult';
import { CrisprResult } from '../analysis/CrisprResult';
import { ReportView } from '../analysis/ReportView';
import { analyzeMutation, analyzeCrisprTargets } from '../../services/geminiService';
import type { MutationAnalysis, CrisprAnalysis } from '../../types';
import { AnalysisState } from '../../constants';

type ReportMode = 'doctor' | 'public';
type Theme = 'light' | 'dark';

interface AnalysisToolProps {
  theme: Theme;
}

export const AnalysisTool: React.FC<AnalysisToolProps> = ({ theme }) => {
  const [dnaSequence, setDnaSequence] = useState<string>('');
  const [mutationResult, setMutationResult] = useState<MutationAnalysis | null>(null);
  const [crisprResult, setCrisprResult] = useState<CrisprAnalysis | null>(null);
  const [analysisState, setAnalysisState] = useState<AnalysisState>(AnalysisState.Idle);
  const [activeTab, setActiveTab] = useState<'mutation' | 'crispr' | 'report'>('mutation');
  const [reportMode, setReportMode] = useState<ReportMode>('doctor');
  const [error, setError] = useState<string | null>(null);

  const handleAnalyzeMutation = useCallback(async () => {
    if (!dnaSequence.trim()) return;
    setAnalysisState(AnalysisState.AnalyzingMutation);
    setError(null);
    setMutationResult(null);
    try {
      const result = await analyzeMutation(dnaSequence);
      setMutationResult(result);
      setActiveTab('mutation');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setAnalysisState(AnalysisState.Idle);
    }
  }, [dnaSequence]);

  const handleAnalyzeCrispr = useCallback(async () => {
    if (!dnaSequence.trim()) return;
    setAnalysisState(AnalysisState.AnalyzingCrispr);
    setError(null);
    setCrisprResult(null);
    try {
      const result = await analyzeCrisprTargets(dnaSequence);
      setCrisprResult(result);
      setActiveTab('crispr');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setAnalysisState(AnalysisState.Idle);
    }
  }, [dnaSequence]);

  const renderContent = () => {
    if (activeTab === 'mutation') {
      return <MutationResult result={mutationResult} sequence={dnaSequence} reportMode={reportMode} theme={theme} />;
    }
    if (activeTab === 'crispr') {
      return <CrisprResult result={crisprResult} sequence={dnaSequence} reportMode={reportMode} theme={theme} />;
    }
    if (activeTab === 'report') {
      return <ReportView mutationResult={mutationResult} crisprResult={crisprResult} dnaSequence={dnaSequence} />;
    }
    return null;
  };
  
  const TabButton: React.FC<{ tabName: 'mutation' | 'crispr' | 'report'; label: string; disabled: boolean }> = ({ tabName, label, disabled }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      disabled={disabled}
      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
        activeTab === tabName
          ? 'bg-blue-600 text-white'
          : 'bg-white dark:bg-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-600'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {label}
    </button>
  );

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 fade-in">
        <DnaInput
          dnaSequence={dnaSequence}
          setDnaSequence={setDnaSequence}
          onAnalyzeMutation={handleAnalyzeMutation}
          onAnalyzeCrispr={handleAnalyzeCrispr}
          analysisState={analysisState}
        />
        
        {error && (
          <div className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        {(mutationResult || crisprResult || analysisState !== AnalysisState.Idle) && (
          <div className="mt-8 bg-white dark:bg-slate-800 shadow-lg rounded-xl overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
              <div className="flex space-x-2">
                <TabButton tabName="mutation" label="Mutation Analysis" disabled={!mutationResult} />
                <TabButton tabName="crispr" label="CRISPR Analysis" disabled={!crisprResult} />
                <TabButton tabName="report" label="DNA Health Report" disabled={!mutationResult || !crisprResult} />
              </div>
               <div className="bg-slate-200 dark:bg-slate-700 p-1 rounded-lg flex text-sm">
                <button
                    onClick={() => setReportMode('doctor')}
                    className={`px-3 py-1 rounded-md transition-colors ${reportMode === 'doctor' ? 'bg-white dark:bg-slate-600 shadow' : ''}`}
                >👨‍⚕️ Doctor's Report</button>
                <button
                    onClick={() => setReportMode('public')}
                    className={`px-3 py-1 rounded-md transition-colors ${reportMode === 'public' ? 'bg-white dark:bg-slate-600 shadow' : ''}`}
                >🧬 Simple Explanation</button>
            </div>
            </div>
            <div className="p-6">
              {analysisState !== AnalysisState.Idle ? (
                 <div className="flex flex-col items-center justify-center min-h-[300px]">
                   <svg className="animate-spin h-10 w-10 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                   </svg>
                   <p className="mt-4 text-lg font-medium text-slate-600 dark:text-slate-300">
                      {analysisState === AnalysisState.AnalyzingMutation ? 'Analyzing for mutations...' : 'Predicting CRISPR targets...'}
                   </p>
                   <p className="text-sm text-slate-500 dark:text-slate-400">This may take a moment.</p>
                 </div>
              ) : renderContent()}
            </div>
          </div>
        )}
      </main>
    </>
  );
};