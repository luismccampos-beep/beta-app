'use client';

import { motion } from 'framer-motion';
import { Badge } from '../ui/badge';
import {
  CheckCircle2,
  Shield,
  Building2,
  Database,
  Target,
  UserCheck,
  Lock,
  Mail,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  fadeInUp,
  staggerContainer,
} from '@/app/components/travel/destination-detail/constants/animations';

export function GDPRContent() {
  const t = useTranslations('legal.gdpr');

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
    >
      {/* Intro */}
      <div className="mb-8 p-6 bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary rounded-lg">
        <p className="text-gray-800 dark:text-gray-200 leading-relaxed">{t('intro')}</p>
        <div className="mt-4 flex items-center gap-4 flex-wrap">
          <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-0">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            {t('badgeTransparency')}
          </Badge>
          <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-0">
            <Shield className="w-3 h-3 mr-1" />
            {t('badgeGdpr')}
          </Badge>
        </div>
      </div>

      {/* Section 1: Data Controller */}
      <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-700 flex items-center justify-center shadow-md flex-shrink-0">
          <Building2 className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{t('section1Title')}</h2>
      </motion.div>
      <motion.p variants={fadeInUp}>{t('section1')}</motion.p>
      <motion.div variants={fadeInUp} whileHover={{ y: -2 }} className="my-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div><strong>{t('controllerEntity')}</strong></div>
          <div><strong>{t('labelEmail')}:</strong> {t('controllerEmail')}</div>
          <div><strong>{t('labelPhone')}:</strong> {t('controllerPhone')}</div>
          <div><strong>{t('labelAddress')}:</strong> {t('controllerAddress')}</div>
        </div>
        <p className="text-xs mt-3 text-gray-600 dark:text-gray-400">{t('controllerNote')}</p>
      </motion.div>

      {/* Section 2: Categories */}
      <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-4 mt-8">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-md flex-shrink-0">
          <Database className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{t('section2Title')}</h2>
      </motion.div>
      <motion.div variants={fadeInUp} className="overflow-x-auto my-4">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">{t('tableCategory')}</th>
              <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">{t('tableExamples')}</th>
              <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">{t('tableRetention')}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 dark:border-gray-600 p-3 font-medium">{t('tableCatId')}</td>
              <td className="border border-gray-300 dark:border-gray-600 p-3">{t('tableCatIdEx')}</td>
              <td className="border border-gray-300 dark:border-gray-600 p-3">{t('tableCatIdRet')}</td>
            </tr>
            <tr className="bg-gray-50 dark:bg-gray-900/50">
              <td className="border border-gray-300 dark:border-gray-600 p-3 font-medium">{t('tableCatContact')}</td>
              <td className="border border-gray-300 dark:border-gray-600 p-3">{t('tableCatContactEx')}</td>
              <td className="border border-gray-300 dark:border-gray-600 p-3">{t('tableCatContactRet')}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 dark:border-gray-600 p-3 font-medium">{t('tableCatBooking')}</td>
              <td className="border border-gray-300 dark:border-gray-600 p-3">{t('tableCatBookingEx')}</td>
              <td className="border border-gray-300 dark:border-gray-600 p-3">{t('tableCatBookingRet')}</td>
            </tr>
            <tr className="bg-gray-50 dark:bg-gray-900/50">
              <td className="border border-gray-300 dark:border-gray-600 p-3 font-medium">{t('tableCatTechnical')}</td>
              <td className="border border-gray-300 dark:border-gray-600 p-3">{t('tableCatTechnicalEx')}</td>
              <td className="border border-gray-300 dark:border-gray-600 p-3">{t('tableCatTechnicalRet')}</td>
            </tr>
          </tbody>
        </table>
        <p className="text-xs mt-2 text-gray-600 dark:text-gray-400">{t('tableNote')}</p>
      </motion.div>

      {/* Section 3: Processing Purposes */}
      <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-4 mt-8">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent-700 flex items-center justify-center shadow-md flex-shrink-0">
          <Target className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{t('section3Title')}</h2>
      </motion.div>
      <motion.p variants={fadeInUp}>{t('section3')}</motion.p>
      <motion.div variants={staggerContainer} className="space-y-4 my-4">
        <motion.div variants={fadeInUp} whileHover={{ x: 4 }} className="p-4 border-l-4 border-primary bg-primary-50 dark:bg-primary-900/20 rounded-r">
          <p className="font-semibold text-lg">{t('purpose1Title')}</p>
          <p className="text-sm mt-1">{t('purpose1Desc')}</p>
          <p className="text-xs mt-2 text-gray-600 dark:text-gray-400"><strong>{t('labelLegalBasis')}:</strong> {t('purpose1Basis')}</p>
        </motion.div>
        <motion.div variants={fadeInUp} whileHover={{ x: 4 }} className="p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 rounded-r">
          <p className="font-semibold text-lg">{t('purpose2Title')}</p>
          <p className="text-sm mt-1">{t('purpose2Desc')}</p>
          <p className="text-xs mt-2 text-gray-600 dark:text-gray-400"><strong>{t('labelLegalBasis')}:</strong> {t('purpose2Basis')}</p>
        </motion.div>
        <motion.div variants={fadeInUp} whileHover={{ x: 4 }} className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20 rounded-r">
          <p className="font-semibold text-lg">{t('purpose3Title')}</p>
          <p className="text-sm mt-1">{t('purpose3Desc')}</p>
          <p className="text-xs mt-2 text-gray-600 dark:text-gray-400"><strong>{t('labelLegalBasis')}:</strong> {t('purpose3Basis')}</p>
        </motion.div>
        <motion.div variants={fadeInUp} whileHover={{ x: 4 }} className="p-4 border-l-4 border-accent bg-accent-50 dark:bg-accent-700/20 rounded-r">
          <p className="font-semibold text-lg">{t('purpose4Title')}</p>
          <p className="text-sm mt-1">{t('purpose4Desc')}</p>
          <p className="text-xs mt-2 text-gray-600 dark:text-gray-400"><strong>{t('labelLegalBasis')}:</strong> {t('purpose4Basis')}</p>
        </motion.div>
      </motion.div>
      <motion.p variants={fadeInUp} className="text-sm text-gray-600 dark:text-gray-400">{t('purposeNote')}</motion.p>

      {/* Section 4: GDPR Rights */}
      <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-4 mt-8">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center shadow-md flex-shrink-0">
          <UserCheck className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{t('section4Title')}</h2>
      </motion.div>
      <motion.p variants={fadeInUp}>{t('section4')}</motion.p>
      <motion.div variants={staggerContainer} className="grid md:grid-cols-2 gap-4 my-4">
        {[1,2,3,4,5,6,7,8].map((i) => (
          <motion.div
            key={i}
            variants={fadeInUp}
            whileHover={{ y: -3, boxShadow: '0 8px 20px rgba(0,0,0,0.08)' }}
            className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 transition-shadow"
          >
            <h3 className="font-semibold flex items-center gap-2 text-base">
              <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
              {t(`right${i}Title`)}
            </h3>
            <p className="text-sm mt-2 text-gray-700 dark:text-gray-300">{t(`right${i}Desc`)}</p>
          </motion.div>
        ))}
      </motion.div>
      <motion.p variants={fadeInUp} className="text-sm text-gray-600 dark:text-gray-400">{t('rightsFooter')}</motion.p>

      {/* Section 5: Data Security */}
      <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-4 mt-8">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center shadow-md flex-shrink-0">
          <Lock className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{t('section5Title')}</h2>
      </motion.div>
      <motion.p variants={fadeInUp}>{t('section5')}</motion.p>
      <motion.ul variants={staggerContainer} className="space-y-2 my-4">
        {[1,2,3,4,5,6,7].map((i) => (
          <motion.li key={i} variants={fadeInUp} whileHover={{ x: 3 }} className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary-700 dark:text-primary-300 mt-0.5 flex-shrink-0" />
            <span>{t(`security${i}`)}</span>
          </motion.li>
        ))}
      </motion.ul>
      <motion.div
        variants={fadeInUp}
        whileHover={{ x: 4 }}
        className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 rounded-r"
      >
        <p className="text-sm text-gray-700 dark:text-gray-300">{t('securityWarning')}</p>
      </motion.div>

      {/* Section 6: Contact */}
      <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-4 mt-8">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-md flex-shrink-0">
          <Mail className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{t('section6Title')}</h2>
      </motion.div>
      <motion.p variants={fadeInUp}>{t('section6')}</motion.p>
      <motion.div variants={fadeInUp} whileHover={{ y: -2 }} className="my-4 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="grid md:grid-cols-2 gap-4 text-sm mb-4">
          <div><strong>{t('labelGeneralEmail')}:</strong> {t('contactEmail')}</div>
          <div><strong>{t('labelPhone')}:</strong> {t('contactPhone')}</div>
          <div className="md:col-span-2"><strong>{t('labelDpo')}:</strong> {t('contactDpo')}</div>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400">{t('contactResponse')}</p>
      </motion.div>

      {/* Footer */}
      <motion.div
        variants={fadeInUp}
        className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-300 dark:border-blue-700 rounded-lg"
      >
        <p className="font-semibold text-blue-900 dark:text-blue-300"><strong>{t('footerDate')}</strong></p>
        <p className="text-sm mt-2 text-blue-800 dark:text-blue-400">{t('footerCompliant')}</p>
        <p className="text-sm mt-2 text-blue-800 dark:text-blue-400 italic">{t('footerItalic')}</p>
      </motion.div>
    </motion.div>
  );
}
