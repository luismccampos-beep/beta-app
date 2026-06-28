'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../ui/card';
import { useTranslations } from 'next-intl';
import { GDPRContent as GDPRContentComponent } from './GDPRContent';
import { CancellationsContent as CancellationsContentComponent } from './CancellationsContent';
import { CookiesContent as CookiesContentComponent } from './CookiesContent';
import {
  Shield,
  Lock,
  FileText,
  XCircle,
  AlertCircle,
  Calendar,
  Mail,
  Phone,
  MapPin,
  ArrowUp,
  Cookie,
  ScrollText,
  UserCheck,
  CreditCard,
  Globe2,
  Ban,
  CheckCircle2,
  Scale
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { AppHeader } from '../AppHeader';
import { AppFooter } from '../AppFooter';
import {
  fadeInUp,
  staggerContainer,
} from '@/app/components/travel/destination-detail/constants/animations';
import { AnimatedSection } from '@/app/components/ui/AnimatedSection';

type PageType = 'terms' | 'privacy' | 'gdpr' | 'cancellations' | 'cookies';

interface LegalPageProps {
  pageType: PageType;
  onBack: () => void;
}

const SECTION_ICONS: React.ComponentType<{ className?: string }>[] = [
  ScrollText, UserCheck, CreditCard, Ban, Shield, Globe2, FileText, Scale
];

const SECTIONS_META = [
  { key: 'section1', color: 'from-primary to-primary-700' },
  { key: 'section2', color: 'from-blue-600 to-blue-800' },
  { key: 'section3', color: 'from-accent to-accent-700' },
  { key: 'section4', color: 'from-purple-600 to-purple-800' },
  { key: 'section5', color: 'from-green-600 to-green-800' },
];

function TermsContent() {
  const t = useTranslations('legal.terms');
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* ── Intro Banner ─────────────────────────────────── */}
      <div className="rounded-2xl border-2 border-primary-200 dark:border-primary-700 bg-white dark:bg-gray-800 shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-accent h-1.5" />
        <div className="p-5 sm:p-8">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-primary-700 dark:text-primary-300" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{t('title')}</h2>
          </div>
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className="inline-flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="w-4 h-4 text-primary dark:text-primary-300" />
              <span className="font-medium">{t('lastUpdated')}</span>
            </span>
            <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-0">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              {t('legallyBinding') || 'Legally Binding'}
            </Badge>
            <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-0">
              <Scale className="w-3 h-3 mr-1" />
              {t('jurisdiction') || 'Portuguese Law'}
            </Badge>
          </div>
          <div className="p-4 sm:p-5 bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary rounded-lg">
            <p className="text-sm sm:text-base text-gray-900 dark:text-gray-200 leading-relaxed">{t('intro')}</p>
          </div>
        </div>
      </div>

      {/* ── Numbered Sections ────────────────────────────── */}
      <AnimatedSection as="ol" variants={staggerContainer} className="space-y-5 sm:space-y-6">
        {SECTIONS_META.map((meta, index) => {
          const Icon = SECTION_ICONS[index % SECTION_ICONS.length];
          return (
            <motion.li
              key={meta.key}
              variants={fadeInUp}
              whileHover={{ y: -3, boxShadow: '0 12px 28px rgba(0,0,0,0.1)' }}
              className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg overflow-hidden transition-shadow"
            >
              <div className="p-5 sm:p-7">
                <h3 className="flex items-start gap-3 text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3">
                  <motion.span
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    className={`flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br ${meta.color} text-white flex items-center justify-center shadow-md`}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.span>
                  <span className="pt-1">
                    <span className="text-primary-700 dark:text-primary-300 mr-1.5">{index + 1}.</span>
                    {t(`${meta.key}Title`)}
                  </span>
                </h3>
                <div className="pl-0 sm:pl-12 text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                  <p>{t(meta.key)}</p>
                </div>
              </div>
            </motion.li>
          );
        })}
      </AnimatedSection>

      {/* ── Governing Law Strip ──────────────────────────── */}
      <AnimatedSection>
        <div className="rounded-2xl bg-gradient-to-r from-primary to-accent text-white shadow-xl p-5 sm:p-7">
          <div className="flex items-start gap-3">
            <motion.div
              animate={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Shield className="w-6 h-6 flex-shrink-0 mt-0.5" />
            </motion.div>
            <div>
              <h3 className="text-base sm:text-lg font-bold mb-1.5">{t('governingTitle') || 'Governing Law'}</h3>
              <p className="text-sm sm:text-base text-white/90 leading-relaxed">{t('governing')}</p>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}

function PrivacyContent() {
  const t = useTranslations('legal.privacy');
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* ── Intro Banner ─────────────────────────────────── */}
      <div className="rounded-2xl border-2 border-blue-200 dark:border-blue-700 bg-white dark:bg-gray-800 shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-accent h-1.5" />
        <div className="p-5 sm:p-8">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-blue-700 dark:text-blue-400" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{t('title')}</h2>
          </div>
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className="inline-flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="w-4 h-4 text-blue-700 dark:text-blue-400" />
              <span className="font-medium">{t('lastUpdated')}</span>
            </span>
            <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-0">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              {t('compliant') || 'GDPR Compliant'}
            </Badge>
          </div>
          <div className="p-4 sm:p-5 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 rounded-lg">
            <p className="text-sm sm:text-base text-gray-900 dark:text-gray-200 leading-relaxed">{t('intro')}</p>
          </div>
        </div>
      </div>

      {/* ── Numbered Sections ────────────────────────────── */}
      <AnimatedSection as="ol" variants={staggerContainer} className="space-y-5 sm:space-y-6">
        {SECTIONS_META.map((meta, index) => {
          const Icon = SECTION_ICONS[index % SECTION_ICONS.length];
          return (
            <motion.li
              key={meta.key}
              variants={fadeInUp}
              whileHover={{ y: -3, boxShadow: '0 12px 28px rgba(0,0,0,0.1)' }}
              className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg overflow-hidden transition-shadow"
            >
              <div className="p-5 sm:p-7">
                <h3 className="flex items-start gap-3 text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3">
                  <motion.span
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    className={`flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br ${meta.color} text-white flex items-center justify-center shadow-md`}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.span>
                  <span className="pt-1">
                    <span className="text-blue-700 dark:text-blue-400 mr-1.5">{index + 1}.</span>
                    {t(`${meta.key}Title`)}
                  </span>
                </h3>
                <div className="pl-0 sm:pl-12 text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                  <p>{t(meta.key)}</p>
                </div>
              </div>
            </motion.li>
          );
        })}
      </AnimatedSection>

      {/* ── Commitment Strip ─────────────────────────────── */}
      <AnimatedSection>
        <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-accent text-white shadow-xl p-5 sm:p-7">
          <div className="flex items-start gap-3">
            <motion.div
              animate={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Lock className="w-6 h-6 flex-shrink-0 mt-0.5" />
            </motion.div>
            <div>
              <h3 className="text-base sm:text-lg font-bold mb-1.5">{t('commitmentTitle') || 'Our Commitment'}</h3>
              <p className="text-sm sm:text-base text-white/90 leading-relaxed">{t('commitment')}</p>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}

export function LegalPage({ pageType, onBack }: LegalPageProps) {
  const t = useTranslations('legal');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
      setShowBackToTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPageContent = () => {
    const wrapperClass = pageType === 'gdpr' || pageType === 'cancellations' || pageType === 'cookies'
      ? 'rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg overflow-hidden'
      : '';

    switch (pageType) {
      case 'terms':
        return <TermsContent />;
      case 'privacy':
        return <PrivacyContent />;
      case 'gdpr':
        return (
          <div className={wrapperClass}>
            <div className="bg-gradient-to-r from-primary to-accent h-1.5" />
            <div className="p-5 sm:p-8">
              <GDPRContentComponent />
            </div>
          </div>
        );
      case 'cancellations':
        return (
          <div className={wrapperClass}>
            <div className="bg-gradient-to-r from-accent to-primary h-1.5" />
            <div className="p-5 sm:p-8">
              <CancellationsContentComponent />
            </div>
          </div>
        );
      case 'cookies':
        return (
          <div className={wrapperClass}>
            <div className="bg-gradient-to-r from-blue-600 to-accent h-1.5" />
            <div className="p-5 sm:p-8">
              <CookiesContentComponent />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const getPageIcon = () => {
    switch (pageType) {
      case 'terms':
        return FileText;
      case 'privacy':
        return Shield;
      case 'gdpr':
        return Lock;
      case 'cancellations':
        return XCircle;
      case 'cookies':
        return Cookie;
      default:
        return FileText;
    }
  };

  const getPageTitle = () => {
    switch (pageType) {
      case 'terms':
        return t('termsTitle');
      case 'privacy':
        return t('privacyTitle');
      case 'gdpr':
        return t('gdprTitle');
      case 'cancellations':
        return t('cancellationsTitle');
      case 'cookies':
        return t('cookiesTitle');
      default:
        return '';
    }
  };

  const PageIcon = getPageIcon();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50 to-accent-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-cyan-200/30 dark:bg-cyan-500/10 blur-[120px]" />
        <div className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-primary-200/30 dark:bg-primary-500/10 blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.05] dark:opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </div>

      <AppHeader showBack onBack={onBack} />

      {/* Scroll Progress Bar */}
      <div className="sticky top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 z-50">
        <div
          className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative mb-8 sm:mb-12 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent-500/10 dark:from-primary/5 dark:to-accent-500/5 rounded-2xl sm:rounded-3xl"></div>
          <div className="relative p-6 sm:p-8 md:p-12 text-center">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-xl"
            >
              <PageIcon className="w-7 h-7 sm:w-10 sm:h-10 text-white" />
            </motion.div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              {getPageTitle()}
            </h1>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '6rem' }}
              transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
              className="h-1 bg-gradient-to-r from-primary to-accent mx-auto"
            />
          </div>
        </motion.div>

        <AnimatedSection>{getPageContent()}</AnimatedSection>

        {/* Contact Section */}
        <AnimatedSection>
          <Card className="border-2 border-accent-200 dark:border-accent-700 shadow-2xl dark:bg-gray-800 overflow-hidden mt-8 sm:mt-12">
            <div className="bg-gradient-to-r from-primary to-accent h-2"></div>
            <CardContent className="p-4 sm:p-8">
              <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-accent-700 dark:text-accent-500" />
                {t('questionsTitle')}
              </h2>
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-4 sm:mb-6">
                {t('questionsSubtitle')}
              </p>
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                <motion.div
                  whileHover={{ x: 4 }}
                  className="flex items-start gap-2 sm:gap-3"
                >
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-primary-700 dark:text-primary-300 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">{t('emailLabel')}</p>
                    <a href="mailto:privacy@akmleva.pt" className="text-xs sm:text-sm text-primary dark:text-primary-300 hover:underline">privacy@akmleva.pt</a>
                  </div>
                </motion.div>
                <motion.div
                  whileHover={{ x: 4 }}
                  className="flex items-start gap-2 sm:gap-3"
                >
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-primary-700 dark:text-primary-300 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">{t('phoneLabel')}</p>
                    <a href="tel:+351256372092" className="text-xs sm:text-sm text-primary dark:text-primary-300 hover:underline">+351 256 372 092</a>
                  </div>
                </motion.div>
                <motion.div
                  whileHover={{ x: 4 }}
                  className="sm:col-span-2 flex items-start gap-2 sm:gap-3"
                >
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary-700 dark:text-primary-300 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">{t('addressLabel')}</p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{t('address')}</p>
                  </div>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>
      </div>

      {showBackToTop && (
        <motion.button
          type="button"
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          whileHover={{ scale: 1.15, rotate: -5 }}
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-gradient-to-r from-primary to-accent text-white shadow-xl hover:shadow-2xl transition-shadow"
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}

      <AppFooter />
    </div>
  );
}