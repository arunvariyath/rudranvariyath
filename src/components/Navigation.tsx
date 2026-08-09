import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Feather } from 'lucide-react';
import { cn } from '../utils/cn';
import { navSections } from '../data/content';
import { useScrollProgress } from '../hooks/useScrollProgress';
import { useLanguage } from '../i18n/LanguageProvider';
import { LanguageToggle } from './LanguageToggle';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { progress } = useScrollProgress();
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id: string) => {
    setIsOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 z-[100]"
        style={{ scaleX: progress / 100, transformOrigin: 'left' }}
      />

      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={cn(
          'fixed top-0 left-0 right-0 z-[99] transition-all duration-500',
          isScrolled
            ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20 gap-2">
            {/* Logo */}
            <motion.a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('home');
              }}
              className="flex items-center gap-2 group shrink-0"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shrink-0">
                <Feather className="w-5 h-5 text-white" />
              </div>
              <span
                className={cn(
                  'font-bold text-base xl:text-lg hidden sm:block transition-colors whitespace-nowrap',
                  isScrolled ? 'text-slate-800 dark:text-white' : 'text-white'
                )}
              >
                {t.nav.brand}
              </span>
            </motion.a>

            {/* Desktop Navigation — min-w-0 lets it shrink instead of pushing
                the language toggle out of the bar (Malayalam labels are wider). */}
            <div className="hidden lg:flex items-center gap-0.5 min-w-0">
              {navSections.map((item) => (
                <motion.a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.id);
                  }}
                  className={cn(
                    'px-2 xl:px-3 py-2 rounded-full text-[13px] xl:text-sm font-medium transition-all duration-300 whitespace-nowrap',
                    isScrolled
                      ? 'text-slate-700 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t.nav[item.key]}
                </motion.a>
              ))}
            </div>

            {/* shrink-0 keeps this group pinned no matter how wide the labels get */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Language Toggle - Desktop */}
              <div className="hidden md:block">
                <LanguageToggle variant={isScrolled ? 'dark' : 'light'} />
              </div>

              {/* Mobile Menu Button */}
              <motion.button
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Menu"
                className={cn(
                  'lg:hidden p-2 rounded-full transition-colors',
                  isScrolled
                    ? 'text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                    : 'text-white hover:bg-white/10'
                )}
                whileTap={{ scale: 0.95 }}
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white dark:bg-slate-900 border-t dark:border-slate-800 overflow-hidden"
            >
              <div className="px-4 py-4 space-y-1">
                {navSections.map((item, index) => (
                  <motion.a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(item.id);
                    }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="block px-4 py-3 rounded-lg text-slate-700 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 font-medium transition-colors"
                  >
                    {t.nav[item.key]}
                  </motion.a>
                ))}

                {/* Language Toggle - Mobile */}
                <div className="pt-3 mt-2 border-t border-slate-100 dark:border-slate-800 flex justify-center">
                  <LanguageToggle variant="dark" labels="full" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
