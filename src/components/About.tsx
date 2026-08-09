import { motion } from 'framer-motion';
import { Calendar, MapPin, GraduationCap, Mail, Sparkles } from 'lucide-react';
import { YoutubeIcon } from './icons/YoutubeIcon';
import { poetLinks } from '../data/content';
import { useLazyLoad } from '../hooks/useLazyLoad';
import { useLanguage } from '../i18n/LanguageProvider';
import { useMemo } from 'react';

function calculateAge(isoDate: string): number {
  const birthDate = new Date(isoDate);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
}

export function About() {
  const { ref, isVisible } = useLazyLoad<HTMLDivElement>({ threshold: 0.2 });
  const { t } = useLanguage();

  const age = useMemo(() => calculateAge(poetLinks.birthDate), []);

  const stats = [
    { icon: Calendar, label: t.about.labels.birthday, value: t.about.values.birthday },
    { icon: MapPin, label: t.about.labels.location, value: t.about.values.location },
    { icon: GraduationCap, label: t.about.labels.education, value: t.about.values.education },
    { icon: Sparkles, label: t.about.labels.age, value: `${age} ${t.about.values.ageSuffix}` },
  ];

  return (
    <section
      id="about"
      className="py-24 lg:py-32 bg-white dark:bg-slate-900 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-100 dark:bg-amber-900/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-100 dark:bg-orange-900/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-sm font-medium mb-4">
            {t.about.badge}
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
            {t.about.titlePrefix}{' '}
            <span className="text-amber-600 dark:text-amber-400">{t.about.titleHighlight}</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto rounded-full" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={poetLinks.profileImage}
                alt={t.about.name}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="absolute bottom-6 left-6 right-6"
              >
                <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                  <p className="text-slate-800 dark:text-white font-semibold">{t.about.name}</p>
                  <p className="text-amber-600 dark:text-amber-400 text-sm">{t.about.role}</p>
                </div>
              </motion.div>
            </div>

            <div className="absolute -top-4 -left-4 w-24 h-24 border-2 border-amber-500/30 rounded-3xl" />
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-amber-500/10 rounded-3xl" />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
              {t.about.bio}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                    <stat.icon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                      {stat.label}
                    </p>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 break-words">
                      {stat.value}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <motion.a
                href={`mailto:${poetLinks.email}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-full text-sm font-medium hover:bg-amber-100 dark:hover:bg-amber-900/30 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Mail className="w-4 h-4" />
                {t.about.emailButton}
              </motion.a>
              <motion.a
                href={poetLinks.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <YoutubeIcon className="w-4 h-4" />
                {t.about.youtubeButton}
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
