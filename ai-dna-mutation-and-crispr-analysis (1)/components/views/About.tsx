import React from 'react';

export const About: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-900">
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="text-center">
                <h2 className="text-3xl font-extrabold text-blue-800 dark:text-blue-200">About the Project</h2>
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
                This platform utilizes advanced AI models to provide insights into DNA sequences for research, clinical, and educational purposes.
                </p>
            </div>

            <div className="mt-12 space-y-8 text-slate-600 dark:text-slate-300">
                <div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Our Mission</h3>
                <p className="mt-3">
                    Our goal is to democratize genomic analysis by providing an intuitive, powerful, and explainable AI-driven tool. We aim to bridge the gap between complex bioinformatics data and actionable insights for clinicians, researchers, and students, ultimately accelerating the pace of genetic research and personalized medicine.
                </p>
                </div>
                <div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Methodology</h3>
                <p className="mt-3">
                    Our system employs a sophisticated AI pipeline. For mutation detection, we use a model conceptually similar to a Long Short-Term Memory (LSTM) network with an attention mechanism. This allows the AI to "focus" on specific nucleotides that are most indicative of a mutation. For CRISPR analysis, the model identifies Protospacer Adjacent Motifs (PAM) sites and uses a predictive model to score guide RNAs based on on-target efficiency and potential off-target effects, trained on large-scale experimental data. The AI's knowledge is further enriched by its training on vast textual data from public clinical and genomic databases.
                </p>
                </div>
            </div>
        </div>
    </div>
  );
};