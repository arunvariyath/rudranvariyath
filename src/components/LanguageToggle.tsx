import { motion } from 'framer-motion';
import { Languages } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageProvider';
import { translations, languageOrder } from '../locales';
import { cn } from '../utils/cn';

interface Props {
  variant?: 'light' | 'dark';
  /** `auto` shows short codes on narrow screens; `full` always shows native names. */
  labels?: 'auto' | 'full';
  className?: string;
}

/**
 * Segmented EN / മലയാളം switch with an animated sliding pill.
 */
export function LanguageToggle({ variant = 'dark', labels = 'auto', className }: Props) {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div
      role="group"
      aria-label={t.nav.switchLanguage}
      className={cn(
        'relative flex items-center gap-1 rounded-full p-1 border backdrop-blur-sm shrink-0',
        variant === 'dark'
          ? 'bg-slate-100/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700'
          : 'bg-white/10 border-white/20',
        className
      )}
    >
      <Languages
        className={cn(
          'w-4 h-4 ml-2 mr-0.5 shrink-0',
          variant === 'dark' ? 'text-slate-500 dark:text-slate-400' : 'text-white/70'
        )}
      />
      {languageOrder.map((code) => {
        const active = language === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLanguage(code)}
            aria-pressed={active}
            className={cn(
              'relative px-2.5 xl:px-3 py-1.5 rounded-full text-xs font-semibold transition-colors duration-300 whitespace-nowrap',
              active
                ? 'text-white'
                : variant === 'dark'
                  ? 'text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400'
                  : 'text-white/70 hover:text-white'
            )}
          >
            {active && (
              <motion.span
                layoutId={`lang-pill-${variant}-${labels}`}
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 shadow-md shadow-amber-500/25"
              />
            )}
            {labels === 'full' ? (
              <span className="relative z-10">{translations[code].meta.nativeLabel}</span>
            ) : (
              <>
                {/* Short code when space is tight, native name once there's room */}
                <span className="relative z-10 xl:hidden">{translations[code].meta.short}</span>
                <span className="relative z-10 hidden xl:inline">
                  {translations[code].meta.nativeLabel}
                </span>
              </>
            )}
          </button>
        );
      })}
    </div>
  );
}
