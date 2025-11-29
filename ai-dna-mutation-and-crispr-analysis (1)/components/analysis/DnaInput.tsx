import React, { useRef, useState, useEffect } from 'react';
import type { AnalysisState } from '../../constants';
import { AnalysisState as AnalysisStateEnum, DemoDnaSequence } from '../../constants';

interface DnaInputProps {
  dnaSequence: string;
  setDnaSequence: (sequence: string) => void;
  onAnalyzeMutation: () => void;
  onAnalyzeCrispr: () => void;
  analysisState: AnalysisState;
}

export const DnaInput: React.FC<DnaInputProps> = ({
  dnaSequence,
  setDnaSequence,
  onAnalyzeMutation,
  onAnalyzeCrispr,
  analysisState,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [localSequence, setLocalSequence] = useState(dnaSequence);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    setLocalSequence(dnaSequence);
  }, [dnaSequence]);

  const validateAndSetSequence = (value: string) => {
    const uppercaseValue = value.toUpperCase();
    if (/[^ATGC]/.test(uppercaseValue)) {
      setValidationError('Invalid DNA characters detected. Only A, T, G, C are allowed.');
      const cleaned = uppercaseValue.replace(/[^ATGC]/g, '');
      setLocalSequence(cleaned);
      setDnaSequence(cleaned);
    } else {
      setValidationError(null);
      setLocalSequence(uppercaseValue);
      setDnaSequence(uppercaseValue);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const sequenceOnly = text
          .replace(/>.*/g, '') // Remove FASTA headers
          .replace(/[\r\n\s]/g, ''); // Remove whitespace
        validateAndSetSequence(sequenceOnly);
      };
      reader.readAsText(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSequenceChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    validateAndSetSequence(event.target.value);
  };
  
  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const isAnalyzing = analysisState !== AnalysisStateEnum.Idle;
  const isAnalyzingMutation = analysisState === AnalysisStateEnum.AnalyzingMutation;
  const isAnalyzingCrispr = analysisState === AnalysisStateEnum.AnalyzingCrispr;
  const hasValidationError = !!validationError;
  const isSequenceEmpty = !localSequence.trim();

  return (
    <div className="bg-white dark:bg-slate-800 p-6 shadow-lg rounded-xl">
      <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-4">Enter DNA Sequence</h2>
      <textarea
        value={localSequence}
        onChange={handleSequenceChange}
        placeholder="Paste your DNA sequence here or load a demo sequence"
        className={`w-full h-48 p-3 font-mono text-sm border rounded-md focus:ring-2 transition-shadow duration-200 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 ${
          hasValidationError 
            ? 'border-red-500 focus:ring-red-300 focus:border-red-500' 
            : 'border-slate-300 dark:border-slate-600 focus:ring-blue-500 focus:border-blue-500'
        }`}
        disabled={isAnalyzing}
        aria-invalid={hasValidationError}
        aria-describedby="dna-validation-error"
      />
      {validationError && (
        <p id="dna-validation-error" className="mt-2 text-sm text-red-600" role="alert">
          {validationError}
        </p>
      )}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".fasta,.fa,.txt"
            />
            <button
              onClick={() => validateAndSetSequence(DemoDnaSequence)}
              className="px-4 py-2 text-sm font-medium text-purple-600 bg-purple-100 dark:bg-purple-900/50 dark:text-purple-300 rounded-md hover:bg-purple-200 dark:hover:bg-purple-900 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isAnalyzing}
            >
              Load Demo Sequence
            </button>
            <button
              onClick={triggerFileUpload}
              className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-100 dark:bg-blue-900/50 dark:text-blue-300 rounded-md hover:bg-blue-200 dark:hover:bg-blue-900 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isAnalyzing}
            >
              Upload File
            </button>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={onAnalyzeMutation}
            disabled={isAnalyzing || hasValidationError || isSequenceEmpty}
            className="w-full sm:w-auto flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-blue-400 dark:disabled:bg-blue-800"
          >
            {isAnalyzingMutation ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : 'Analyze Mutation'}
          </button>
          <button
            onClick={onAnalyzeCrispr}
            disabled={isAnalyzing || hasValidationError || isSequenceEmpty}
            className="w-full sm:w-auto flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-green-400 dark:disabled:bg-green-800"
          >
            {isAnalyzingCrispr ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : 'Predict CRISPR Sites'}
          </button>
        </div>
      </div>
    </div>
  );
};