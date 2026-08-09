import { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Trophy } from 'lucide-react';
import { useLazyLoad } from '../hooks/useLazyLoad';
import { useMediaManifest } from '../hooks/useMediaManifest';
import { useLanguage } from '../i18n/LanguageProvider';
import { Lightbox } from './Lightbox';

export function Awards() {
  const { ref, isVisible } = useLazyLoad<HTMLDivElement>({ threshold: 0.1 });
  const { t } = useLanguage();
  const { items } = useMediaManifest('awards');
  const [selected, setSelected] = useState<number | null>(null);

  /** Locale text keyed by filename; unknown keys fall back to the filename. */
  const copy = (key: string, fallbackTitle: string) =>
    t.awards.items[key] ?? { title: fallbackTitle, description: '' };

  return (
    <section
      id="awards"
      className="py-24 lg:py-32 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-900 dark:to-slate-800 relative overflow-hidden"
    >
      <div className="absolute top-20 left-10 w-32 h-32 bg-amber-300/20 dark:bg-amber-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-orange-300/20 dark:bg-orange-500/10 rounded-full blur-3xl" />

      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-sm font-medium mb-4">
            <Trophy className="w-4 h-4 inline mr-1" />
            {t.awards.badge}
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
            {t.awards.titlePrefix}{' '}
            <span className="text-amber-600 dark:text-amber-400">{t.awards.titleHighlight}</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {t.awards.description}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto rounded-full mt-6" />
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((award, index) => {
            const { title, description } = copy(award.key, award.title);
            return (
              <motion.div
                key={award.key}
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
                className="group cursor-pointer"
                onClick={() => setSelected(index)}
              >
                <div className="relative bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                  <div
                    className="aspect-[4/3] overflow-hidden bg-cover bg-center"
                    style={award.blur ? { backgroundImage: `url(${award.blur})` } : undefined}
                  >
                    <img
                      src={award.thumb}
                      alt={title}
                      loading="lazy"
                      decoding="async"
                      width={award.width}
                      height={award.height}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-start gap-2 mb-2">
                      <Award className="w-4 h-4 text-amber-500 mt-1 shrink-0" />
                      <h3 className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                        {title}
                      </h3>
                    </div>
                    {description && (
                      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                        {description}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <Lightbox
        open={selected !== null}
        imageSrc={selected !== null ? items[selected]?.src : undefined}
        title={
          selected !== null ? copy(items[selected].key, items[selected].title).title : undefined
        }
        description={
          selected !== null
            ? copy(items[selected].key, items[selected].title).description
            : undefined
        }
        onClose={() => setSelected(null)}
        onPrev={() => setSelected((p) => (p === null ? p : (p - 1 + items.length) % items.length))}
        onNext={() => setSelected((p) => (p === null ? p : (p + 1) % items.length))}
      />
    </section>
  );
}
