'use client';

import { motion } from 'framer-motion';
import {
  CheckCircle2,
  AlertCircle,
  Mail,
  FileText,
  CalendarClock,
  Plane,
  HelpCircle,
  Info,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  fadeInUp,
  staggerContainer,
} from '@/app/components/travel/destination-detail/constants/animations';

export function CancellationsContent() {
  const t = useTranslations('legal.cancellations');

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
    >
      {/* Warning Banner */}
      <motion.div variants={fadeInUp} className="mb-8 p-6 bg-accent-50 dark:bg-accent-700/20 border-l-4 border-accent rounded-lg">
        <p className="font-semibold text-lg text-accent-700 dark:text-accent-200 mb-2">{t('warningTitle')}</p>
        <p className="text-gray-800 dark:text-gray-200 leading-relaxed">{t('warningText')}</p>
      </motion.div>

      {/* Section 1: General Conditions */}
      <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-700 flex items-center justify-center shadow-md flex-shrink-0">
          <FileText className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{t('section1Title')}</h2>
      </motion.div>
        <motion.ul variants={staggerContainer} className="space-y-2 my-4">
        <motion.li variants={fadeInUp} whileHover={{ x: 3 }} className="flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-primary-700 dark:text-primary-300 mt-0.5 flex-shrink-0" />
          <span>{t('section1a')}</span>
        </motion.li>
        <motion.li variants={fadeInUp} whileHover={{ x: 3 }} className="flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-primary-700 dark:text-primary-300 mt-0.5 flex-shrink-0" />
          <span>{t('section1b')}</span>
        </motion.li>
        <motion.li variants={fadeInUp} whileHover={{ x: 3 }} className="flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-primary-700 dark:text-primary-300 mt-0.5 flex-shrink-0" />
          <span>{t('section1c')}</span>
        </motion.li>
      </motion.ul>

      {/* Section 2: Deadlines */}
      <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-4 mt-8">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent-700 flex items-center justify-center shadow-md flex-shrink-0">
          <CalendarClock className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{t('section2Title')}</h2>
      </motion.div>
      <motion.div variants={fadeInUp} className="overflow-x-auto my-4">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">{t('tablePeriod')}</th>
              <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">{t('tableFee')}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 dark:border-gray-600 p-3">{t('period30')}</td>
              <td className="border border-gray-300 dark:border-gray-600 p-3 font-semibold text-green-700 dark:text-green-400">{t('fee30')}</td>
            </tr>
            <tr className="bg-gray-50 dark:bg-gray-900/50">
              <td className="border border-gray-300 dark:border-gray-600 p-3">{t('period15')}</td>
              <td className="border border-gray-300 dark:border-gray-600 p-3 font-semibold text-accent-700 dark:text-accent-500">{t('fee15')}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 dark:border-gray-600 p-3">{t('period14')}</td>
              <td className="border border-gray-300 dark:border-gray-600 p-3 font-semibold text-red-700 dark:text-red-400">{t('fee14')}</td>
            </tr>
          </tbody>
        </table>
      </motion.div>

      <motion.div variants={staggerContainer} className="my-4 space-y-3">
        <motion.div variants={fadeInUp} whileHover={{ x: 4 }} className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20 rounded-r">
          <p className="font-semibold">{t('section2a')}</p>
        </motion.div>
        <motion.div variants={fadeInUp} whileHover={{ x: 4 }} className="p-4 border-l-4 border-accent bg-accent-50 dark:bg-accent-700/20 rounded-r">
          <p className="font-semibold">{t('section2b')}</p>
        </motion.div>
        <motion.div variants={fadeInUp} whileHover={{ x: 4 }} className="p-4 border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20 rounded-r">
          <p className="font-semibold">{t('section2c')}</p>
        </motion.div>
      </motion.div>

      {/* Section 3: Flights */}
      <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-4 mt-8">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-md flex-shrink-0">
          <Plane className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{t('section3Title')}</h2>
      </motion.div>
      <motion.p variants={fadeInUp}>{t('section3')}</motion.p>
      <motion.div variants={fadeInUp} whileHover={{ x: 4 }} className="my-4 p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-r">
        <p className="font-semibold text-blue-900 dark:text-blue-300 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {t('forceMajeureTitle')}
        </p>
        <p className="text-sm mt-2 text-blue-800 dark:text-blue-400">{t('forceMajeureText')}</p>
      </motion.div>

      {/* Section 4: How to Request */}
      <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-4 mt-8">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center shadow-md flex-shrink-0">
          <Info className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{t('section4Title')}</h2>
      </motion.div>
      <motion.p variants={fadeInUp} className="mb-4">{t('section4Intro')}</motion.p>

      <motion.div variants={staggerContainer} className="space-y-4 my-6">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            variants={fadeInUp}
            whileHover={{ y: -3, boxShadow: '0 8px 20px rgba(0,0,0,0.08)' }}
            className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 transition-shadow"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold flex-shrink-0">{i}</div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">{t(`step${i}Title`)}</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">{t(`step${i}Desc`)}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div variants={fadeInUp} className="my-6 p-6 bg-primary-50 dark:bg-primary-900/20 border-2 border-primary-300 dark:border-primary-700 rounded-lg text-center">
        <Mail className="w-8 h-8 text-primary-700 dark:text-primary-300 mx-auto mb-3" />
        <p className="font-semibold text-lg text-primary-900 dark:text-primary-200">{t('ctaTitle')}</p>
        <p className="text-sm text-primary-700 dark:text-primary-300 mt-1">{t('ctaDesc')}</p>
      </motion.div>

      {/* Section 5: FAQ */}
      <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-4 mt-8">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center shadow-md flex-shrink-0">
          <HelpCircle className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{t('section5Title')}</h2>
      </motion.div>
      <motion.p variants={fadeInUp} className="mb-4">{t('section5Intro')}</motion.p>

      <motion.div variants={staggerContainer} className="space-y-4 my-4">
        {[1, 2, 3].map((i) => (
          <motion.details key={i} variants={fadeInUp} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <summary className="font-semibold cursor-pointer flex items-center gap-2">
              <span className="text-primary-700 dark:text-primary-300">{i}.</span> {t(`faq${i}Question`)}
            </summary>
            <p className="text-sm mt-3 text-gray-700 dark:text-gray-300 pl-6">{t(`faq${i}Answer`)}</p>
          </motion.details>
        ))}
      </motion.div>

      <motion.div variants={fadeInUp} className="my-6 p-4 bg-gray-100 dark:bg-gray-800 border-l-4 border-gray-400 dark:border-gray-600 rounded-r">
        <p className="text-sm text-gray-700 dark:text-gray-300 italic">{t('faqFallback')}</p>
      </motion.div>

      <motion.div variants={fadeInUp} className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-600 dark:text-gray-400"><strong>{t('lastUpdated')}</strong></p>
      </motion.div>
    </motion.div>
  );
}
