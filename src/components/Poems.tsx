import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ExternalLink, Loader2, X, Volume2, Calendar } from 'lucide-react';
import { useLazyLoad } from '../hooks/useLazyLoad';
import { useLanguage } from '../i18n/LanguageProvider';
import { poetLinks } from '../data/content';
import { formatPoemDate, formatRelativeDate, sortByNewest } from '../utils/formatDate';
import type { Poem } from '../types';

const INITIAL_DISPLAY_COUNT = 8;
const LOAD_MORE_COUNT = 8;

const FALLBACK: Poem[] = [
  { poemSrc: 'W_8etpfnaUk', poemTitle: 'മൃത്യഞ്ജയ ഹോമം (രുദ്ര രാമായണം ഭാഗം 24)' },
  { poemSrc: 'gZfwGxEe230', poemTitle: 'തേരാളിയായി മാതലിയെത്തുന്നു (രുദ്ര രാമായണം ഭാഗം 25)' },
  { poemSrc: 'kSbhlUTpqWk', poemTitle: 'ശുക്രാചാര്യർ സമക്ഷം (രുദ്ര രാമായണം ഭാഗം 23)' },
  { poemSrc: 'EAtiIsTE65k', poemTitle: 'ഇന്ദ്രജിത്ത് വധം (രുദ്ര രാമായണം ഭാഗം 22)' },
];

export function Poems() {
  const { ref, isVisible } = useLazyLoad<HTMLDivElement>({ threshold: 0.1 });
  const { t, language } = useLanguage();
  const [poems, setPoems] = useState<Poem[]>([]);
  const [displayCount, setDisplayCount] = useState(INITIAL_DISPLAY_COUNT);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      // Try each source in order; use the first one that returns a usable list.
      for (const url of poetLinks.poemSources) {
        try {
          const res = await fetch(url);
          if (!res.ok) continue;
          const data = (await res.json()) as Poem[];
          if (Array.isArray(data) && data.length) {
            if (!cancelled) {
              setPoems(data);
              setLoading(false);
            }
            return;
          }
        } catch {
          /* try the next source */
        }
      }
      if (!cancelled) {
        setPoems(FALLBACK);
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const loadMore = useCallback(
    () => setDisplayCount((p) => Math.min(p + LOAD_MORE_COUNT, poems.length)),
    [poems.length]
  );

  // Newest first when dates are available; undated entries keep their order at the end.
  const ordered = useMemo(() => sortByNewest(poems), [poems]);
  const displayed = ordered.slice(0, displayCount);
  const hasMore = displayCount < ordered.length;

  return (
    <section id="poems" className="py-24 lg:py-32 bg-slate-50 dark:bg-slate-800/50 relative">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm font-medium mb-4">
            <Volume2 className="w-4 h-4 inline mr-1" />
            {t.poems.badge}
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
            {t.poems.titlePrefix}{' '}
            <span className="text-red-600 dark:text-red-400">{t.poems.titleHighlight}</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {t.poems.description}
          </p>
          {!loading && ordered.length > 0 && (
            <p className="mt-4 text-sm font-medium text-red-600 dark:text-red-400">
              {ordered.length} {t.poems.totalCount}
            </p>
          )}
          <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-orange-500 mx-auto rounded-full mt-6" />
        </motion.div>

        {loading ? (
          <div className="flex flex-col justify-center items-center py-20 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
            <p className="text-slate-500 dark:text-slate-400 text-sm">{t.poems.loading}</p>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayed.map((poem, index) => {
                const absoluteDate = formatPoemDate(poem.publishedAt, language);
                const relativeDate = formatRelativeDate(poem.publishedAt, language);

                return (
                  <motion.div
                    key={poem.poemSrc}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.4, delay: (index % 8) * 0.05 }}
                    className="group relative bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col"
                  >
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={`https://img.youtube.com/vi/${poem.poemSrc}/mqdefault.jpg`}
                        alt={poem.poemTitle}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/25 to-slate-900/40 group-hover:from-slate-900/85 transition-colors" />

                      <motion.button
                        onClick={() => setSelectedVideo(poem.poemSrc)}
                        aria-label={t.poems.watchLabel}
                        className="absolute inset-0 flex items-center justify-center"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center shadow-lg">
                          <Play className="w-6 h-6 text-white ml-1" fill="white" />
                        </div>
                      </motion.button>

                      {/* Upload date — bottom-left, only when we actually know it */}
                      {absoluteDate && (
                        <div
                          className="absolute bottom-2 left-2 inline-flex items-center gap-1.5 px-2 py-1 bg-black/75 backdrop-blur-sm rounded text-white text-[11px] font-medium"
                          title={`${t.poems.publishedOn} ${absoluteDate}`}
                        >
                          <Calendar className="w-3 h-3 shrink-0" />
                          {absoluteDate}
                        </div>
                      )}

                      <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/75 backdrop-blur-sm rounded text-white text-[11px] font-medium">
                        {t.poems.watchLabel}
                      </div>
                    </div>

                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                        {poem.poemTitle}
                      </h3>

                      <div className="mt-auto pt-3 flex items-center justify-between gap-2">
                        <a
                          href={`https://www.youtube.com/watch?v=${poem.poemSrc}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-red-600 transition-colors"
                        >
                          {t.poems.watchOnYoutube}
                          <ExternalLink className="w-3 h-3" />
                        </a>

                        {relativeDate && (
                          <span className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">
                            {relativeDate}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {hasMore && (
              <div className="text-center mt-12">
                <motion.button
                  onClick={loadMore}
                  className="px-8 py-3 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-full font-medium hover:bg-amber-500 hover:text-white dark:hover:bg-amber-600 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t.poems.loadMore} ({ordered.length - displayCount} {t.poems.remaining})
                </motion.button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/90"
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedVideo(null)}
                aria-label={t.common.close}
                className="absolute -top-12 right-0 text-white hover:text-red-400 transition-colors"
              >
                <X className="w-8 h-8" />
              </button>
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
