'use client';

import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Info,
  Cookie,
  Settings,
  BarChart3,
  Megaphone,
  Shield,
  Sliders,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  fadeInUp,
  staggerContainer,
} from '@/app/components/travel/destination-detail/constants/animations';

export function CookiesContent() {
  const t = useTranslations('legal.cookies');

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
    >
      {/* Intro */}
      <motion.div variants={fadeInUp} className="mb-8 p-6 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 rounded-lg">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <p className="text-gray-800 dark:text-gray-200 leading-relaxed">{t('intro')}</p>
        </div>
      </motion.div>

      {/* Section 1: What Are Cookies */}
      <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-md flex-shrink-0">
          <Cookie className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{t('section1Title')}</h2>
      </motion.div>
      <motion.p variants={fadeInUp}>{t('section1p1')}</motion.p>
      <motion.p variants={fadeInUp} className="mt-4">{t('section1p2')}</motion.p>

      {/* Section 2: Why Do We Use Cookies */}
      <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-4 mt-8">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center shadow-md flex-shrink-0">
          <Shield className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{t('section2Title')}</h2>
      </motion.div>
      <motion.ul variants={staggerContainer} className="my-4 space-y-2">
        <motion.li variants={fadeInUp} whileHover={{ x: 3 }} className="flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-primary dark:text-primary-300 mt-0.5 flex-shrink-0" />
          <span>{t('section2Essential')}</span>
        </motion.li>
        <motion.li variants={fadeInUp} whileHover={{ x: 3 }} className="flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-primary dark:text-primary-300 mt-0.5 flex-shrink-0" />
          <span>{t('section2Functional')}</span>
        </motion.li>
        <motion.li variants={fadeInUp} whileHover={{ x: 3 }} className="flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-primary dark:text-primary-300 mt-0.5 flex-shrink-0" />
          <span>{t('section2Analytics')}</span>
        </motion.li>
        <motion.li variants={fadeInUp} whileHover={{ x: 3 }} className="flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-primary dark:text-primary-300 mt-0.5 flex-shrink-0" />
          <span>{t('section2Marketing')}</span>
        </motion.li>
      </motion.ul>

      {/* Section 3: Types of Cookies */}
      <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-4 mt-8">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center shadow-md flex-shrink-0">
          <Settings className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{t('section3Title')}</h2>
      </motion.div>

      <motion.div variants={staggerContainer} className="space-y-6 my-6">
        {/* Essential Cookies */}
        <motion.div variants={fadeInUp} whileHover={{ y: -2 }} className="p-5 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-600 rounded-lg">
          <h3 className="text-lg font-semibold text-green-900 dark:text-green-300 mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            {t('catEssentialTitle')}
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-3">{t('catEssentialDesc')}</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-green-600 dark:border-green-400">
                  <th className="text-left py-2 pr-4 font-semibold text-green-900 dark:text-green-200">{t('tableCookieName')}</th>
                  <th className="text-left py-2 pr-4 font-semibold text-green-900 dark:text-green-200">{t('tablePurpose')}</th>
                  <th className="text-left py-2 font-semibold text-green-900 dark:text-green-200">{t('tableDuration')}</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-gray-300">
                <tr className="border-b border-green-200 dark:border-green-800">
                  <td className="py-2 pr-4 font-medium">{t('cookieSessionName')}</td>
                  <td className="py-2 pr-4">{t('cookieSessionPurpose')}</td>
                  <td className="py-2">{t('cookieSessionDur')}</td>
                </tr>
                <tr className="border-b border-green-200 dark:border-green-800">
                  <td className="py-2 pr-4 font-medium">{t('cookieCsrfName')}</td>
                  <td className="py-2 pr-4">{t('cookieCsrfPurpose')}</td>
                  <td className="py-2">{t('cookieCsrfDur')}</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">{t('cookieConsentName')}</td>
                  <td className="py-2 pr-4">{t('cookieConsentPurpose')}</td>
                  <td className="py-2">{t('cookieConsentDur')}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Functional Cookies */}
        <motion.div variants={fadeInUp} whileHover={{ y: -2 }} className="p-5 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-3 flex items-center gap-2">
            <Info className="w-5 h-5" />
            {t('catFunctionalTitle')}
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-3">{t('catFunctionalDesc')}</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-blue-600 dark:border-blue-400">
                  <th className="text-left py-2 pr-4 font-semibold text-blue-900 dark:text-blue-200">{t('tableCookieName')}</th>
                  <th className="text-left py-2 pr-4 font-semibold text-blue-900 dark:text-blue-200">{t('tablePurpose')}</th>
                  <th className="text-left py-2 font-semibold text-blue-900 dark:text-blue-200">{t('tableDuration')}</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-gray-300">
                <tr className="border-b border-blue-200 dark:border-blue-800">
                  <td className="py-2 pr-4 font-medium">{t('cookieLangName')}</td>
                  <td className="py-2 pr-4">{t('cookieLangPurp')}</td>
                  <td className="py-2">{t('cookieLangDur')}</td>
                </tr>
                <tr className="border-b border-blue-200 dark:border-blue-800">
                  <td className="py-2 pr-4 font-medium">{t('cookieThemeName')}</td>
                  <td className="py-2 pr-4">{t('cookieThemePurp')}</td>
                  <td className="py-2">{t('cookieThemeDur')}</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">{t('cookieCurrencyName')}</td>
                  <td className="py-2 pr-4">{t('cookieCurrencyPurp')}</td>
                  <td className="py-2">{t('cookieCurrencyDur')}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Analytics Cookies */}
        <motion.div variants={fadeInUp} whileHover={{ y: -2 }} className="p-5 bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary rounded-lg">
          <h3 className="text-lg font-semibold text-primary-900 dark:text-primary-200 mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            {t('catAnalyticsTitle')}
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-3">{t('catAnalyticsDesc')}</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-primary dark:border-primary-300">
                  <th className="text-left py-2 pr-4 font-semibold text-primary-900 dark:text-primary-200">{t('tableService')}</th>
                  <th className="text-left py-2 pr-4 font-semibold text-primary-900 dark:text-primary-200">{t('tablePurpose')}</th>
                  <th className="text-left py-2 font-semibold text-primary-900 dark:text-primary-200">{t('tableDuration')}</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-gray-300">
                <tr className="border-b border-primary-200 dark:border-primary-700">
                  <td className="py-2 pr-4 font-medium">{t('cookieGaName')}</td>
                  <td className="py-2 pr-4">{t('cookieGaPurp')}</td>
                  <td className="py-2">{t('cookieGaDur')}</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">{t('cookieHotjarName')}</td>
                  <td className="py-2 pr-4">{t('cookieHotjarPurp')}</td>
                  <td className="py-2">{t('cookieHotjarDur')}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Marketing Cookies */}
        <motion.div variants={fadeInUp} whileHover={{ y: -2 }} className="p-5 bg-accent-50 dark:bg-accent-700/20 border-l-4 border-accent rounded-lg">
          <h3 className="text-lg font-semibold text-accent-700 dark:text-accent-200 mb-3 flex items-center gap-2">
            <Info className="w-5 h-5" />
            {t('catMarketingTitle')}
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-3">{t('catMarketingDesc')}</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-accent dark:border-accent-200">
                  <th className="text-left py-2 pr-4 font-semibold text-accent-700 dark:text-accent-200">{t('tableService')}</th>
                  <th className="text-left py-2 pr-4 font-semibold text-accent-700 dark:text-accent-200">{t('tablePurpose')}</th>
                  <th className="text-left py-2 font-semibold text-accent-700 dark:text-accent-200">{t('tableDuration')}</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-gray-300">
                <tr className="border-b border-accent-200 dark:border-accent-700">
                  <td className="py-2 pr-4 font-medium">{t('cookieAdsName')}</td>
                  <td className="py-2 pr-4">{t('cookieAdsPurp')}</td>
                  <td className="py-2">{t('cookieAdsDur')}</td>
                </tr>
                <tr className="border-b border-accent-200 dark:border-accent-700">
                  <td className="py-2 pr-4 font-medium">{t('cookieFbName')}</td>
                  <td className="py-2 pr-4">{t('cookieFbPurp')}</td>
                  <td className="py-2">{t('cookieFbDur')}</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">{t('cookieLinName')}</td>
                  <td className="py-2 pr-4">{t('cookieLinPurp')}</td>
                  <td className="py-2">{t('cookieLinDur')}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>

      {/* Section 4: How to Control */}
      <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-4 mt-8">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent-700 flex items-center justify-center shadow-md flex-shrink-0">
          <Sliders className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{t('section4Title')}</h2>
      </motion.div>
      <motion.p variants={fadeInUp}>{t('section4Intro')}</motion.p>

      <motion.div variants={staggerContainer} className="ml-6 space-y-4 my-4">
        <div>
          <p className="font-semibold text-gray-900 dark:text-white mb-2">{t('controlBannerTitle')}</p>
          <p className="text-gray-700 dark:text-gray-300">{t('controlBannerDesc')}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-900 dark:text-white mb-2">{t('controlBrowserTitle')}</p>
          <p className="text-gray-700 dark:text-gray-300">{t('controlBrowserDesc')}</p>
          <ul className="mt-2 ml-4 space-y-1 text-sm text-gray-700 dark:text-gray-300">
            <li>{t('controlBrowserChrome')}</li>
            <li>{t('controlBrowserFirefox')}</li>
            <li>{t('controlBrowserSafari')}</li>
            <li>{t('controlBrowserEdge')}</li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-gray-900 dark:text-white mb-2">{t('controlThirdTitle')}</p>
          <p className="text-gray-700 dark:text-gray-300">{t('controlThirdDesc')}</p>
          <ul className="mt-2 ml-4 space-y-1">
            <li>{t('choiceYourOnline')}: <a href="https://www.youronlinechoices.com/" className="text-primary dark:text-primary-300 hover:underline" target="_blank" rel="noopener noreferrer">www.youronlinechoices.com</a></li>
            <li>{t('choiceNai')}: <a href="https://optout.networkadvertising.org/" className="text-primary dark:text-primary-300 hover:underline" target="_blank" rel="noopener noreferrer">optout.networkadvertising.org</a></li>
            <li>{t('choiceDaa')}: <a href="https://optout.aboutads.info/" className="text-primary dark:text-primary-300 hover:underline" target="_blank" rel="noopener noreferrer">optout.aboutads.info</a></li>
          </ul>
        </div>
      </motion.div>

      {/* Section 5: Updates */}
      <motion.h2 variants={fadeInUp}>{t('section5Title')}</motion.h2>
      <motion.p variants={fadeInUp}>{t('section5')}</motion.p>

      <motion.div variants={fadeInUp} className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600">
        <p className="text-sm text-gray-700 dark:text-gray-300"><strong>{t('lastUpdated')}</strong></p>
        <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
          {t('contactText')} <a href="mailto:privacy@akmleva.pt" className="text-primary dark:text-primary-300 hover:underline">privacy@akmleva.pt</a>
        </p>
      </motion.div>
    </motion.div>
  );
}
