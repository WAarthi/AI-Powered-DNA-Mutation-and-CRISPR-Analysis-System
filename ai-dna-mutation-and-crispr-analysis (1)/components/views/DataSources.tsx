import React from 'react';

const DatasetCard: React.FC<{ name: string; description: string; source: string; logo: string }> = ({ name, description, source, logo }) => (
    <div className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg p-4 flex items-start space-x-4">
        <img src={logo} alt={`${name} logo`} className="h-10 w-10 object-contain"/>
        <div>
            <h4 className="font-semibold text-blue-700 dark:text-blue-400">{name}</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{description}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Source: {source}</p>
        </div>
    </div>
);

export const DataSources: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-900">
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
            <h2 className="text-3xl font-extrabold text-blue-800 dark:text-blue-200">Data Sources & Clinical Databases</h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
                Our AI's analytical capabilities are conceptually trained on information from the world's leading genomic and clinical databases to provide relevant, context-aware insights.
            </p>
        </div>

        <div className="mt-12">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6">Referenced Databases</h3>
            <div className="grid grid-cols-1 gap-6">
                <DatasetCard 
                    name="ClinVar"
                    description="An archive of reports of the relationships among human variations and phenotypes, with supporting evidence. Crucial for identifying pathogenic variants."
                    source="NCBI / NIH"
                    logo="https://www.ncbi.nlm.nih.gov/clinvar/static/images/clinvar_logo.png"
                />
                <DatasetCard 
                    name="COSMIC"
                    description="The Catalogue Of Somatic Mutations In Cancer, the world's largest and most comprehensive resource for exploring the impact of somatic mutations in human cancer."
                    source="Sanger Institute"
                    logo="https://cancer.sanger.ac.uk/cosmic/images/cosmic-logo.svg"
                />
                <DatasetCard 
                    name="UniProt"
                    description="A comprehensive, high-quality and freely accessible resource of protein sequence and functional information, used here to assess mutation impact on proteins."
                    source="UniProt Consortium"
                    logo="https://www.uniprot.org/assets/images/uniprot-logo-transparent.svg"
                />
                 <DatasetCard 
                    name="1000 Genomes Project"
                    description="Provides a comprehensive public resource on human genetic variation, serving as a baseline for 'normal' sequences and population genetics."
                    source="International Genome Sample Resource (IGSR)"
                    logo="https://www.internationalgenome.org/sites/internationalgenome.org/files/ighg-logo_0.png"
                />
                <DatasetCard 
                    name="Ensembl VEP"
                    description="The Variant Effect Predictor determines the effect of genomic variants on genes, transcripts, and protein sequence, as well as regulatory regions."
                    source="EMBL-EBI"
                    logo="https://www.ensembl.org/img/ensembl-logo-2020.svg"
                />
            </div>
        </div>
        </div>
    </div>
  );
};
