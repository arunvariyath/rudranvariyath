import { motion } from 'framer-motion';
import { MapPin, Mail, Send, ExternalLink } from 'lucide-react';
import { poetLinks } from '../data/content';
import { useLazyLoad } from '../hooks/useLazyLoad';
import { useLanguage } from '../i18n/LanguageProvider';
import { YoutubeIcon } from './icons/YoutubeIcon';

export function Contact() {
  const { ref, isVisible } = useLazyLoad<HTMLDivElement>({ threshold: 0.2 });
  const { t } = useLanguage();

  const contactInfo = [
    {
      icon: MapPin,
      label: t.contact.addressLabel,
      value: t.contact.addressValue,
      href: `https://maps.google.com/?q=${encodeURIComponent(t.contact.addressValue)}`,
    },
    {
      icon: Mail,
      label: t.contact.emailLabel,
      value: poetLinks.email,
      href: `mailto:${poetLinks.email}`,
    },
    {
      icon: YoutubeIcon,
      label: t.contact.youtubeLabel,
      value: t.contact.youtubeValue,
      href: poetLinks.youtubeUrl,
    },
  ];

  return (
    <section
      id="contact"
      className="py-24 lg:py-32 bg-slate-900 dark:bg-slate-950 relative overflow-hidden"
    >
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />

      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-400 text-sm font-medium mb-4">
            <Send className="w-4 h-4 inline mr-1" />
            {t.contact.badge}
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            {t.contact.titlePrefix}{' '}
            <span className="text-amber-400">{t.contact.titleHighlight}</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">{t.contact.description}</p>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto rounded-full mt-6" />
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {contactInfo.map((item, index) => (
            <motion.a
              key={item.label}
              href={item.href}
              target={item.href.startsWith('http') ? '_blank' : undefined}
              rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 hover:border-amber-500/30 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-amber-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <item.icon className="w-7 h-7 text-amber-400" />
              </div>

              <h3 className="text-lg font-semibold text-white mb-2">{item.label}</h3>
              <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors break-words">
                {item.value}
              </p>

              {item.href.startsWith('http') && (
                <ExternalLink className="absolute top-6 right-6 w-4 h-4 text-slate-600 group-hover:text-amber-400 transition-colors" />
              )}
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-2xl border border-amber-500/20">
            <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div className="text-center sm:text-left">
              <h4 className="text-white font-semibold mb-1">{t.contact.ctaTitle}</h4>
              <p className="text-slate-400 text-sm">
                {t.contact.ctaText}{' '}
                <a
                  href={`mailto:${poetLinks.email}`}
                  className="text-amber-400 hover:text-amber-300 underline underline-offset-2 break-all"
                >
                  {poetLinks.email}
                </a>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
