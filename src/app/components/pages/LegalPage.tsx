import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
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
  Cookie
} from 'lucide-react';
import { AppHeader } from '../AppHeader';
import { AppFooter } from '../AppFooter';

type PageType = 'terms' | 'privacy' | 'gdpr' | 'cancellations' | 'cookies';

interface LegalPageProps {
  pageType: PageType;
  onBack: () => void;
}

function TermsContent() {
  const t = useTranslations('legal.terms');
  return (
    <div className="space-y-6 sm:space-y-8">
      <Card className="border-2 border-teal-200 dark:border-teal-700 shadow-xl dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl dark:text-white">
            <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600 dark:text-teal-400" />
            {t('title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm sm:text-base text-gray-700 dark:text-gray-300">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span className="font-medium">{t('lastUpdated')}</span>
          </div>
          <p>{t('intro')}</p>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('section1Title')}</h3>
          <p>{t('section1')}</p>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('section2Title')}</h3>
          <p>{t('section2')}</p>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('section3Title')}</h3>
          <p>{t('section3')}</p>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('section4Title')}</h3>
          <p>{t('section4')}</p>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('section5Title')}</h3>
          <p>{t('section5')}</p>
        </CardContent>
      </Card>
    </div>
  );
}

function PrivacyContent() {
  const t = useTranslations('legal.privacy');
  return (
    <div className="space-y-6 sm:space-y-8">
      <Card className="border-2 border-blue-200 dark:border-blue-700 shadow-xl dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl dark:text-white">
            <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
            {t('title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm sm:text-base text-gray-700 dark:text-gray-300">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="font-medium">{t('lastUpdated')}</span>
          </div>
          <p>{t('intro')}</p>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('section1Title')}</h3>
          <p>{t('section1')}</p>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('section2Title')}</h3>
          <p>{t('section2')}</p>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('section3Title')}</h3>
          <p>{t('section3')}</p>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('section4Title')}</h3>
          <p>{t('section4')}</p>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('section5Title')}</h3>
          <p>{t('section5')}</p>
        </CardContent>
      </Card>
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
    switch (pageType) {
      case 'terms':
      return <TermsContent />;
      case 'privacy':
      return <PrivacyContent />;
      case 'gdpr':
        return <GDPRContentComponent />;
      case 'cancellations':
        return <CancellationsContentComponent />;
      case 'cookies':
        return <CookiesContentComponent />;
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50 to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors">
      <AppHeader showBack onBack={onBack} />

      {/* Scroll Progress Bar */}
      <div className="sticky top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 z-50">
        <div
          className="h-full bg-gradient-to-r from-teal-600 to-orange-500 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        {/* Hero */}
        <div className="relative mb-8 sm:mb-12 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-orange-500/10 dark:from-teal-500/5 dark:to-orange-500/5 rounded-2xl sm:rounded-3xl"></div>
          <div className="relative p-6 sm:p-8 md:p-12 text-center">
            <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-teal-600 to-orange-500 flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-xl">
              <PageIcon className="w-7 h-7 sm:w-10 sm:h-10 text-white" />
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              {getPageTitle()}
            </h1>
            <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-teal-600 to-orange-500 mx-auto"></div>
          </div>
        </div>

        {getPageContent()}

        {/* Contact Section */}
        <Card className="border-2 border-orange-200 dark:border-orange-700 shadow-2xl dark:bg-gray-800 overflow-hidden mt-8 sm:mt-12">
          <div className="bg-gradient-to-r from-teal-600 to-orange-500 h-2"></div>
          <CardContent className="p-4 sm:p-8">
            <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 dark:text-orange-400" />
              {t('questionsTitle')}
            </h2>
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-4 sm:mb-6">
              {t('questionsSubtitle')}
            </p>
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="flex items-start gap-2 sm:gap-3">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600 dark:text-teal-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{t('emailLabel')}</p>
                  <a href="mailto:privacy@akmleva.com" className="text-xs sm:text-sm text-teal-600 dark:text-teal-400 hover:underline">privacy@akmleva.com</a>
                </div>
              </div>
              <div className="flex items-start gap-2 sm:gap-3">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600 dark:text-teal-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{t('phoneLabel')}</p>
                  <a href="tel:+351256372092" className="text-xs sm:text-sm text-teal-600 dark:text-teal-400 hover:underline">+351 256 372 092</a>
                </div>
              </div>
              <div className="sm:col-span-2 flex items-start gap-2 sm:gap-3">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600 dark:text-teal-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{t('addressLabel')}</p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{t('address')}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-gradient-to-r from-teal-600 to-orange-500 text-white shadow-xl hover:from-teal-700 hover:to-orange-600 transition-all"
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      <AppFooter />
    </div>
  );
}