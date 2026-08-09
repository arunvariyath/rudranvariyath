import { useState } from 'react';
import { motion } from 'framer-motion';
import { ImageIcon, Grid3X3 } from 'lucide-react';
import { useLazyLoad } from '../hooks/useLazyLoad';
import { useMediaManifest } from '../hooks/useMediaManifest';
import { useLanguage } from '../i18n/LanguageProvider';
import { Lightbox } from './Lightbox';

const INITIAL_COUNT = 12;
const LOAD_MORE_COUNT = 12;

export function Gallery() {
  const { ref, isVisible } = useLazyLoad<HTMLDivElement>({ threshold: 0.1 });
  const { t } = useLanguage();
  const { items } = useMediaManifest('gallery');
  const [selected, setSelected] = useState<number | null>(null);
  const [displayCount, setDisplayCount] = useState(INITIAL_COUNT);

  const shown = items.slice(0, displayCount);
  const hasMore = displayCount < items.length;

  return (
    <section id="gallery" className="py-24 lg:py-32 bg-slate-50 dark:bg-slate-900 relative">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium mb-4">
            <ImageIcon className="w-4 h-4 inline mr-1" />
            {t.gallery.badge}
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
            {t.gallery.titlePrefix}{' '}
            <span className="text-purple-600 dark:text-purple-400">{t.gallery.titleHighlight}</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {t.gallery.description}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full mt-6" />
        </motion.div>

        {/* Masonry grid */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 [&>*]:mb-4">
          {shown.map((image, index) => (
            <motion.div
              key={image.key}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: (index % 12) * 0.03 }}
              className="break-inside-avoid group cursor-pointer"
              onClick={() => setSelected(index)}
            >
              <div
                className="relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-slate-200 dark:bg-slate-800 bg-cover bg-center"
                // Blur placeholder avoids a flash of empty grey while loading.
                style={image.blur ? { backgroundImage: `url(${image.blur})` } : undefined}
              >
                <img
                  src={image.thumb}
                  alt={`${t.gallery.imageAlt} ${index + 1}`}
                  loading="lazy"
                  decoding="async"
                  // Intrinsic size reserves the right space — no layout shift.
                  width={image.width}
                  height={image.height}
                  style={
                    image.aspectRatio
                      ? { aspectRatio: String(image.aspectRatio) }
                      : undefined
                  }
                  className="w-full h-auto group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Grid3X3 className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {hasMore && (
          <div className="text-center mt-12">
            <motion.button
              onClick={() => setDisplayCount((p) => Math.min(p + LOAD_MORE_COUNT, items.length))}
              className="px-8 py-3 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-full font-medium hover:bg-purple-500 hover:text-white dark:hover:bg-purple-600 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t.gallery.loadMore} ({items.length - displayCount} {t.gallery.remaining})
            </motion.button>
          </div>
        )}
      </div>

      {/* Lightbox shows the full-size variant, not the thumbnail. */}
      <Lightbox
        open={selected !== null}
        imageSrc={selected !== null ? shown[selected]?.src : undefined}
        counter={selected !== null ? `${selected + 1} / ${shown.length}` : undefined}
        onClose={() => setSelected(null)}
        onPrev={() => setSelected((p) => (p === null ? p : (p - 1 + shown.length) % shown.length))}
        onNext={() => setSelected((p) => (p === null ? p : (p + 1) % shown.length))}
      />
    </section>
  );
}
