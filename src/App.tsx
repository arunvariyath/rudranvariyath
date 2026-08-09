import { useEffect, useState } from 'react';
import { LanguageProvider } from './i18n/LanguageProvider';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Poems } from './components/Poems';
import { Books } from './components/Books';
import { Awards } from './components/Awards';
import { Gallery } from './components/Gallery';
import { Family } from './components/Family';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { features } from './config/features';

function Splash() {
  return (
    <div className="fixed inset-0 bg-slate-900 flex items-center justify-center z-[200]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-white font-medium">Loading…</p>
      </div>
    </div>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <Splash />;

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-white dark:bg-slate-900">
        <Navigation />
        <main>
          <Hero />
          <About />
          <Poems />
          <Books />
          <Awards />
          <Gallery />
          {features.familyTree && <Family />}
          <Contact />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}

export default App;
