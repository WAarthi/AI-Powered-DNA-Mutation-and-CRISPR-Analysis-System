import React from 'react';

interface NavbarProps {
    activeView: 'home' | 'tool' | 'about' | 'datasources';
    setActiveView: (view: 'home' | 'tool' | 'about' | 'datasources') => void;
    theme: 'light' | 'dark';
    setTheme: (theme: 'light' | 'dark') => void;
}

const NavButton: React.FC<{
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
            isActive
                ? 'bg-blue-600 text-white'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
        }`}
    >
        {label}
    </button>
);

const ThemeToggle: React.FC<{ theme: 'light' | 'dark'; setTheme: (theme: 'light' | 'dark') => void; }> = ({ theme, setTheme }) => {
    const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');
    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            aria-label="Toggle theme"
        >
            {theme === 'light' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            )}
        </button>
    );
};


export const Navbar: React.FC<NavbarProps> = ({ activeView, setActiveView, theme, setTheme }) => {
  return (
    <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
             <div className="flex-shrink-0 flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 21h4v-9H10v9zM4 21h4v-5H4v5zM16 21h4v-7h-4v7z" />
                </svg>
                <span className="font-bold text-xl text-slate-800 dark:text-slate-100">GenoAI</span>
             </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-1">
                <NavButton label="Home" isActive={activeView === 'home'} onClick={() => setActiveView('home')} />
                <NavButton label="Analysis Tool" isActive={activeView === 'tool'} onClick={() => setActiveView('tool')} />
                <NavButton label="Data Sources" isActive={activeView === 'datasources'} onClick={() => setActiveView('datasources')} />
                <NavButton label="About" isActive={activeView === 'about'} onClick={() => setActiveView('about')} />
                <div className="ml-3 border-l border-slate-200 dark:border-slate-700 pl-4">
                  <ThemeToggle theme={theme} setTheme={setTheme} />
                </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};