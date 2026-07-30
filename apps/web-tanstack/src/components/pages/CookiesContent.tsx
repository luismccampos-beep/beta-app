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
import { useLegalTranslations } from '@/lib/i18n-namespaces';
import {
  fadeInUp,
  staggerContainer,
} from '@/lib/animations';

export function CookiesContent() {
  const t = useLegalTranslations();

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
          <p className="text-gray-800 dark:text-gray-200 leading-relaxed">{t('cookies.intro')}</p>
        </div>
      </motion.div>

      {/* Section 1: What Are Cookies */}
      <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-md flex-shrink-0">
          <Cookie className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{t('cookies.section1Title')}</h2>
      </motion.div>
      <motion.p variants={fadeInUp}>{t('cookies.section1p1')}</motion.p>
      <motion.p variants={fadeInUp} className="mt-4">{t('cookies.section1p2')}</motion.p>

      {/* Section 2: Why Do We Use Cookies */}
      <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-4 mt-8">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center shadow-md flex-shrink-0">
          <Shield className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{t('cookies.section2Title')}</h2>
      </motion.div>
        <motion.ul variants={staggerContainer} className="my-4 space-y-2">
        <motion.li variants={fadeInUp} whileHover={{ x: 3 }} className="flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-primary-700 dark:text-primary-300 mt-0.5 flex-shrink-0" />
          <span>{t('cookies.section2Essential')}</span>
        </motion.li>
        <motion.li variants={fadeInUp} whileHover={{ x: 3 }} className="flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-primary-700 dark:text-primary-300 mt-0.5 flex-shrink-0" />
          <span>{t('cookies.section2Functional')}</span>
        </motion.li>
        <motion.li variants={fadeInUp} whileHover={{ x: 3 }} className="flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-primary-700 dark:text-primary-300 mt-0.5 flex-shrink-0" />
          <span>{t('cookies.section2Analytics')}</span>
        </motion.li>
        <motion.li variants={fadeInUp} whileHover={{ x: 3 }} className="flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-primary-700 dark:text-primary-300 mt-0.5 flex-shrink-0" />
          <span>{t('cookies.section2Marketing')}</span>
        </motion.li>
      </motion.ul>

      {/* Section 3: Types of Cookies */}
      <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-4 mt-8">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center shadow-md flex-shrink-0">
          <Settings className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{t('cookies.section3Title')}</h2>
      </motion.div>

      <motion.div variants={staggerContainer} className="space-y-6 my-6">
        {/* Essential Cookies */}
        <motion.div variants={fadeInUp} whileHover={{ y: -2 }} className="p-5 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-600 rounded-lg">
          <h3 className="text-lg font-semibold text-green-900 dark:text-green-300 mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            {t('cookies.catEssentialTitle')}
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-3">{t('cookies.catEssentialDesc')}</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-green-600 dark:border-green-400">
                  <th className="text-left py-2 pr-4 font-semibold text-green-900 dark:text-green-200">{t('cookies.tableCookieName')}</th>
                  <th className="text-left py-2 pr-4 font-semibold text-green-900 dark:text-green-200">{t('cookies.tablePurpose')}</th>
                  <th className="text-left py-2 font-semibold text-green-900 dark:text-green-200">{t('cookies.tableDuration')}</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-gray-300">
                <tr className="border-b border-green-200 dark:border-green-800">
                  <td className="py-2 pr-4 font-medium">{t('cookies.cookieSessionName')}</td>
                  <td className="py-2 pr-4">{t('cookies.cookieSessionPurpose')}</td>
                  <td className="py-2">{t('cookies.cookieSessionDur')}</td>
                </tr>
                <tr className="border-b border-green-200 dark:border-green-800">
                  <td className="py-2 pr-4 font-medium">{t('cookies.cookieCsrfName')}</td>
                  <td className="py-2 pr-4">{t('cookies.cookieCsrfPurpose')}</td>
                  <td className="py-2">{t('cookies.cookieCsrfDur')}</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">{t('cookies.cookieConsentName')}</td>
                  <td className="py-2 pr-4">{t('cookies.cookieConsentPurpose')}</td>
                  <td className="py-2">{t('cookies.cookieConsentDur')}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Functional Cookies */}
        <motion.div variants={fadeInUp} whileHover={{ y: -2 }} className="p-5 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-3 flex items-center gap-2">
            <Info className="w-5 h-5" />
            {t('cookies.catFunctionalTitle')}
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-3">{t('cookies.catFunctionalDesc')}</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-blue-600 dark:border-blue-400">
                  <th className="text-left py-2 pr-4 font-semibold text-blue-900 dark:text-blue-200">{t('cookies.tableCookieName')}</th>
                  <th className="text-left py-2 pr-4 font-semibold text-blue-900 dark:text-blue-200">{t('cookies.tablePurpose')}</th>
                  <th className="text-left py-2 font-semibold text-blue-900 dark:text-blue-200">{t('cookies.tableDuration')}</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-gray-300">
                <tr className="border-b border-blue-200 dark:border-blue-800">
                  <td className="py-2 pr-4 font-medium">{t('cookies.cookieLangName')}</td>
                  <td className="py-2 pr-4">{t('cookies.cookieLangPurp')}</td>
                  <td className="py-2">{t('cookies.cookieLangDur')}</td>
                </tr>
                <tr className="border-b border-blue-200 dark:border-blue-800">
                  <td className="py-2 pr-4 font-medium">{t('cookies.cookieThemeName')}</td>
                  <td className="py-2 pr-4">{t('cookies.cookieThemePurp')}</td>
                  <td className="py-2">{t('cookies.cookieThemeDur')}</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">{t('cookies.cookieCurrencyName')}</td>
                  <td className="py-2 pr-4">{t('cookies.cookieCurrencyPurp')}</td>
                  <td className="py-2">{t('cookies.cookieCurrencyDur')}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Analytics Cookies */}
        <motion.div variants={fadeInUp} whileHover={{ y: -2 }} className="p-5 bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary rounded-lg">
          <h3 className="text-lg font-semibold text-primary-900 dark:text-primary-200 mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            {t('cookies.catAnalyticsTitle')}
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-3">{t('cookies.catAnalyticsDesc')}</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-primary dark:border-primary-300">
                  <th className="text-left py-2 pr-4 font-semibold text-primary-900 dark:text-primary-200">{t('cookies.tableService')}</th>
                  <th className="text-left py-2 pr-4 font-semibold text-primary-900 dark:text-primary-200">{t('cookies.tablePurpose')}</th>
                  <th className="text-left py-2 font-semibold text-primary-900 dark:text-primary-200">{t('cookies.tableDuration')}</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-gray-300">
                <tr className="border-b border-primary-200 dark:border-primary-700">
                  <td className="py-2 pr-4 font-medium">{t('cookies.cookieGaName')}</td>
                  <td className="py-2 pr-4">{t('cookies.cookieGaPurp')}</td>
                  <td className="py-2">{t('cookies.cookieGaDur')}</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">{t('cookies.cookieHotjarName')}</td>
                  <td className="py-2 pr-4">{t('cookies.cookieHotjarPurp')}</td>
                  <td className="py-2">{t('cookies.cookieHotjarDur')}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Marketing Cookies */}
        <motion.div variants={fadeInUp} whileHover={{ y: -2 }} className="p-5 bg-accent-50 dark:bg-accent-700/20 border-l-4 border-accent rounded-lg">
          <h3 className="text-lg font-semibold text-accent-700 dark:text-accent-200 mb-3 flex items-center gap-2">
            <Info className="w-5 h-5" />
            {t('cookies.catMarketingTitle')}
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-3">{t('cookies.catMarketingDesc')}</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-accent dark:border-accent-200">
                  <th className="text-left py-2 pr-4 font-semibold text-accent-700 dark:text-accent-200">{t('cookies.tableService')}</th>
                  <th className="text-left py-2 pr-4 font-semibold text-accent-700 dark:text-accent-200">{t('cookies.tablePurpose')}</th>
                  <th className="text-left py-2 font-semibold text-accent-700 dark:text-accent-200">{t('cookies.tableDuration')}</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-gray-300">
                <tr className="border-b border-accent-200 dark:border-accent-700">
                  <td className="py-2 pr-4 font-medium">{t('cookies.cookieAdsName')}</td>
                  <td className="py-2 pr-4">{t('cookies.cookieAdsPurp')}</td>
                  <td className="py-2">{t('cookies.cookieAdsDur')}</td>
                </tr>
                <tr className="border-b border-accent-200 dark:border-accent-700">
                  <td className="py-2 pr-4 font-medium">{t('cookies.cookieFbName')}</td>
                  <td className="py-2 pr-4">{t('cookies.cookieFbPurp')}</td>
                  <td className="py-2">{t('cookies.cookieFbDur')}</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">{t('cookies.cookieLinName')}</td>
                  <td className="py-2 pr-4">{t('cookies.cookieLinPurp')}</td>
                  <td className="py-2">{t('cookies.cookieLinDur')}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>

      {/* Section 4: How to Control */}
      <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-4 mt-8">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-600 to-accent-800 flex items-center justify-center shadow-md flex-shrink-0">
          <Sliders className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{t('cookies.section4Title')}</h2>
      </motion.div>
      <motion.p variants={fadeInUp}>{t('cookies.section4Intro')}</motion.p>

      <motion.div variants={staggerContainer} className="ml-6 space-y-4 my-4">
        <div>
          <p className="font-semibold text-gray-900 dark:text-white mb-2">{t('cookies.controlBannerTitle')}</p>
          <p className="text-gray-700 dark:text-gray-300">{t('cookies.controlBannerDesc')}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-900 dark:text-white mb-2">{t('cookies.controlBrowserTitle')}</p>
          <p className="text-gray-700 dark:text-gray-300">{t('cookies.controlBrowserDesc')}</p>
          <ul className="mt-2 ml-4 space-y-1 text-sm text-gray-700 dark:text-gray-300">
            <li>{t('cookies.controlBrowserChrome')}</li>
            <li>{t('cookies.controlBrowserFirefox')}</li>
            <li>{t('cookies.controlBrowserSafari')}</li>
            <li>{t('cookies.controlBrowserEdge')}</li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-gray-900 dark:text-white mb-2">{t('cookies.controlThirdTitle')}</p>
          <p className="text-gray-700 dark:text-gray-300">{t('cookies.controlThirdDesc')}</p>
          <ul className="mt-2 ml-4 space-y-1">
            <li>{t('cookies.choiceYourOnline')}: <a href="https://www.youronlinechoices.com/" className="text-primary dark:text-primary-300 hover:underline" target="_blank" rel="noopener noreferrer">www.youronlinechoices.com</a></li>
            <li>{t('cookies.choiceNai')}: <a href="https://optout.networkadvertising.org/" className="text-primary dark:text-primary-300 hover:underline" target="_blank" rel="noopener noreferrer">optout.networkadvertising.org</a></li>
            <li>{t('cookies.choiceDaa')}: <a href="https://optout.aboutads.info/" className="text-primary dark:text-primary-300 hover:underline" target="_blank" rel="noopener noreferrer">optout.aboutads.info</a></li>
          </ul>
        </div>
      </motion.div>

      {/* Section 5: Updates */}
      <motion.h2 variants={fadeInUp}>{t('cookies.section5Title')}</motion.h2>
      <motion.p variants={fadeInUp}>{t('cookies.section5')}</motion.p>

      <motion.div variants={fadeInUp} className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600">
        <p className="text-sm text-gray-700 dark:text-gray-300"><strong>{t('cookies.lastUpdated')}</strong></p>
        <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
          {t('cookies.contactText')} <a href="mailto:privacy@akmleva.pt" className="text-primary dark:text-primary-300 hover:underline">privacy@akmleva.pt</a>
        </p>
      </motion.div>
    </motion.div>
  );
}
