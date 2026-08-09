import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { books } from '../data/content';
import { useLazyLoad } from '../hooks/useLazyLoad';
import { useLanguage } from '../i18n/LanguageProvider';
import { Lightbox } from './Lightbox';

export function Books() {
  const { ref, isVisible } = useLazyLoad<HTMLDivElement>({ threshold: 0.1 });
  const { t } = useLanguage();
  const [selected, setSelected] = useState<number | null>(null);

  const copy = (key: string) => t.books.items[key] ?? { title: key, description: '' };

  return (
    <section
      id="books"
      className="py-24 lg:py-32 bg-white dark:bg-slate-900 relative overflow-hidden"
    >
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm font-medium mb-4">
            <BookOpen className="w-4 h-4 inline mr-1" />
            {t.books.badge}
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
            {t.books.titlePrefix}{' '}
            <span className="text-emerald-600 dark:text-emerald-400">{t.books.titleHighlight}</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {t.books.description}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto rounded-full mt-6" />
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-8">
          {books.map((book, index) => {
            const { title, description } = copy(book.key);
            return (
              <motion.div
                key={book.key}
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group cursor-pointer"
                onClick={() => setSelected(index)}
              >
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 bg-slate-100 dark:bg-slate-800">
                  <img
                    src={book.imageSrc}
                    alt={title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white text-xs leading-snug line-clamp-3">{description}</p>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {title}
                  </h3>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <Lightbox
        open={selected !== null}
        imageSrc={selected !== null ? books[selected].imageSrc : undefined}
        title={selected !== null ? copy(books[selected].key).title : undefined}
        description={selected !== null ? copy(books[selected].key).description : undefined}
        onClose={() => setSelected(null)}
        onPrev={() => setSelected((p) => (p === null ? p : (p - 1 + books.length) % books.length))}
        onNext={() => setSelected((p) => (p === null ? p : (p + 1) % books.length))}
      />
    </section>
  );
}
