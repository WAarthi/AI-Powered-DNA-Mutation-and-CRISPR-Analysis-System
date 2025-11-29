import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-slate-900 mt-12 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-sm text-slate-500 dark:text-slate-400">
        <p>&copy; {new Date().getFullYear()} GenoAI Analysis System. All rights reserved.</p>
        <p className="mt-2">
          Dataset Credits: Model concepts trained on data from NCBI, 1000 Genomes Project, IGVC, ClinVar, COSMIC, and Addgene.
        </p>
      </div>
    </footer>
  );
};