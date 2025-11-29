import React from 'react';

// FIX: Corrected TypeScript definition for the 'lottie-player' custom element.
declare global {
    namespace JSX {
        interface IntrinsicElements {
            'lottie-player': React.HTMLAttributes<HTMLElement> & {
                src: string;
                background: string;
                speed: string;
                loop?: boolean;
                autoplay?: boolean;
            };
        }
    }
}

interface HomeProps {
    setActiveView: (view: 'tool') => void;
}

const FeatureCard: React.FC<{ title: string; description: string; icon: React.ReactNode }> = ({ title, description, icon }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-lg p-3">
                {icon}
            </div>
            <div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
                <p className="mt-1 text-slate-500 dark:text-slate-400">{description}</p>
            </div>
        </div>
    </div>
);

export const Home: React.FC<HomeProps> = ({ setActiveView }) => {
  return (
    <div className="fade-in">
      <div className="relative text-center bg-gradient-to-br from-blue-50 dark:from-slate-900 to-white dark:to-blue-900/20 py-16 px-4 sm:py-20 sm:px-6 lg:px-8 overflow-hidden">
        <div className="relative z-10">
            <div className="flex justify-center">
                <lottie-player
                    src="https://assets9.lottiefiles.com/packages/lf20_v23Gcl.json"
                    background="transparent"
                    speed="1"
                    style={{ width: '220px', height: '220px' }}
                    loop
                    autoplay
                ></lottie-player>
            </div>
            <h1 className="text-4xl font-extrabold text-blue-800 dark:text-blue-200 sm:text-5xl lg:text-6xl tracking-tight">
                AI-Powered DNA Analysis
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-slate-600 dark:text-slate-300">
                Smart Mutation & CRISPR Insight for Genomic Research
            </p>
            <div className="mt-8 flex justify-center">
                <button
                onClick={() => setActiveView('tool')}
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 shadow hover:shadow-lg"
                >
                Go to Analysis Tool
                </button>
            </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FeatureCard 
                    title="Clinical Mutation Insights"
                    description="Identify disease-related mutations with an AI model trained on clinical datasets like ClinVar and COSMIC, with full explainability."
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>}
                />
                <FeatureCard 
                    title="Advanced CRISPR Safety Scoring"
                    description="Automatically scan sequences for PAM sites, predict gRNA targets, and receive an AI-driven safety score and risk assessment."
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121M12 12l2.879-2.879M12 12L19 5M4.929 4.929L10 10m-7 7l7-7m-7 7l2.879-2.879" /></svg>}
                />
            </div>
        </div>
      </div>
    </div>
  );
};