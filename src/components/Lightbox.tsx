import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageProvider';

interface LightboxProps {
  open: boolean;
  imageSrc?: string;
  title?: string;
  description?: string;
  counter?: string;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export function Lightbox({
  open,
  imageSrc,
  title,
  description,
  counter,
  onClose,
  onPrev,
  onNext,
}: LightboxProps) {
  const { t } = useLanguage();

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [open, onClose, onPrev, onNext]);

  return (
    <AnimatePresence>
      {open && imageSrc && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/95"
          onClick={onClose}
        >
          <button
            onClick={onClose}
            aria-label={t.common.close}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-10"
          >
            <X className="w-8 h-8" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            aria-label={t.common.previous}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 text-white/70 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-8 h-8 sm:w-10 sm:h-10" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            aria-label={t.common.next}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 text-white/70 hover:text-white transition-colors"
          >
            <ChevronRight className="w-8 h-8 sm:w-10 sm:h-10" />
          </button>

          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            className="max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={imageSrc}
              alt={title ?? ''}
              className="w-full h-auto max-h-[75vh] object-contain rounded-lg"
            />
            <div className="mt-4 text-center">
              {title && <h3 className="text-xl font-semibold text-white">{title}</h3>}
              {description && <p className="text-white/70 mt-2">{description}</p>}
              {counter && <p className="text-white/50 mt-2 text-sm">{counter}</p>}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
