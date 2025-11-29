import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Home } from './components/views/Home';
import { AnalysisTool } from './components/views/AnalysisTool';
import { About } from './components/views/About';
import { DataSources } from './components/views/DataSources';

type View = 'home' | 'tool' | 'about' | 'datasources';
type Theme = 'light' | 'dark';

const getInitialTheme = (): Theme => {
    if (typeof window !== 'undefined' && window.localStorage) {
        const storedPrefs = window.localStorage.getItem('theme');
        if (storedPrefs === 'light' || storedPrefs === 'dark') {
            return storedPrefs;
        }
    }
    return 'dark';
};

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('home');
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('theme', newTheme);
    }
  };

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'dark' ? 'light' : 'dark');
    root.classList.add(theme);
  }, [theme]);

  const renderView = () => {
    switch (activeView) {
      case 'home':
        return <Home setActiveView={setActiveView} />;
      case 'tool':
        return <AnalysisTool theme={theme} />;
      case 'about':
        return <About />;
      case 'datasources':
        return <DataSources />;
      default:
        return <Home setActiveView={setActiveView} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-800 dark:text-slate-200 flex flex-col">
      <Navbar activeView={activeView} setActiveView={setActiveView} theme={theme} setTheme={setTheme} />
      <div className="flex-grow">
        {renderView()}
      </div>
      <Footer />
    </div>
  );
};

export default App;