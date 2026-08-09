import { motion } from 'framer-motion';
import { Heart, Feather, ArrowUp } from 'lucide-react';
import { navSections } from '../data/content';
import { useLanguage } from '../i18n/LanguageProvider';
import { LanguageToggle } from './LanguageToggle';

export function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="bg-slate-950 dark:bg-black border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 grid md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <Feather className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">{t.nav.brand}</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">{t.footer.tagline}</p>
          </div>

          {/* Quick Links */}
          <div className="md:text-center">
            <h4 className="text-white font-semibold mb-4">{t.footer.quickLinks}</h4>
            <ul className="space-y-2">
              {navSections.slice(1).map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-slate-400 hover:text-amber-400 transition-colors text-sm"
                  >
                    {t.nav[item.key]}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation + language */}
          <div className="md:text-right">
            <h4 className="text-white font-semibold mb-4">{t.footer.navigation}</h4>
            <div className="flex md:justify-end mb-4">
              <LanguageToggle variant="light" labels="full" />
            </div>
            <motion.button
              onClick={scrollToTop}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-amber-500/20 text-slate-300 hover:text-amber-400 rounded-full transition-all text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowUp className="w-4 h-4" />
              {t.footer.backToTop}
            </motion.button>
          </div>
        </div>

        <div className="py-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm text-center sm:text-left">
            © {currentYear} {t.nav.brand}. {t.footer.rights}
          </p>
          <p className="text-slate-500 text-sm flex items-center gap-1.5 flex-wrap justify-center">
            {t.footer.madeWith} <Heart className="w-4 h-4 text-red-500 fill-red-500" />{' '}
            {t.footer.by} {t.footer.developer}
          </p>
        </div>
      </div>
    </footer>
  );
}
