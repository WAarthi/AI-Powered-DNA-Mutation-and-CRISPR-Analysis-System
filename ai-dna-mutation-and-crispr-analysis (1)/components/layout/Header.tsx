import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 21h4v-9H10v9zM4 21h4v-5H4v5zM16 21h4v-7h-4v7z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 12a3 3 0 100-6 3 3 0 000 6z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.6 7.6a3 3 0 10-4.24-4.24 3 3 0 004.24 4.24z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.34 7.6a3 3 0 104.24-4.24 3 3 0 00-4.24 4.24z" />
                </svg>
            </div>
            <div>
                <h1 className="text-3xl font-bold text-blue-800 dark:text-blue-200">AI-Powered DNA Analysis System</h1>
                <p className="mt-1 text-md text-slate-600 dark:text-slate-400">Clinical Mutation Detection & CRISPR Target Identification</p>
            </div>
        </div>
      </div>
    </header>
  );
};