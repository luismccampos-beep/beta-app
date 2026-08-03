'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
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
import { useLegalTranslations } from '@/lib/i18n-namespaces';
import {
  fadeInUp,
  staggerContainer,
} from '@/lib/animations';

export function GDPRContent() {
  const t = useLegalTranslations();

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
    >
      {/* Intro */}
      <div className="mb-8 p-6 bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary rounded-lg">
        <p className="text-gray-800 dark:text-gray-200 leading-relaxed">{t('gdpr.intro')}</p>
        <div className="mt-4 flex items-center gap-4 flex-wrap">
          <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-0">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            {t('gdpr.badgeTransparency')}
          </Badge>
          <Badge className="bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 border-0">
            <Shield className="w-3 h-3 mr-1" />
            {t('gdpr.badgeGdpr')}
          </Badge>
        </div>
      </div>

      {/* Section 1: Data Controller */}
      <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-700 flex items-center justify-center shadow-md flex-shrink-0">
          <Building2 className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{t('gdpr.section1Title')}</h2>
      </motion.div>
      <motion.p variants={fadeInUp}>{t('gdpr.section1')}</motion.p>
      <motion.div variants={fadeInUp} whileHover={{ y: -2 }} className="my-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div><strong>{t('gdpr.controllerEntity')}</strong></div>
          <div><strong>{t('gdpr.labelEmail')}:</strong> {t('gdpr.controllerEmail')}</div>
          <div><strong>{t('gdpr.labelPhone')}:</strong> {t('gdpr.controllerPhone')}</div>
          <div><strong>{t('gdpr.labelAddress')}:</strong> {t('gdpr.controllerAddress')}</div>
        </div>
        <p className="text-xs mt-3 text-gray-600 dark:text-gray-400">{t('gdpr.controllerNote')}</p>
      </motion.div>

      {/* Section 2: Categories */}
      <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-4 mt-8">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-700 flex items-center justify-center shadow-md flex-shrink-0">
          <Database className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{t('gdpr.section2Title')}</h2>
      </motion.div>
      <motion.div variants={fadeInUp} className="overflow-x-auto my-4">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">{t('gdpr.tableCategory')}</th>
              <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">{t('gdpr.tableExamples')}</th>
              <th className="border border-gray-300 dark:border-gray-600 p-3 text-left">{t('gdpr.tableRetention')}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 dark:border-gray-600 p-3 font-medium">{t('gdpr.tableCatId')}</td>
              <td className="border border-gray-300 dark:border-gray-600 p-3">{t('gdpr.tableCatIdEx')}</td>
              <td className="border border-gray-300 dark:border-gray-600 p-3">{t('gdpr.tableCatIdRet')}</td>
            </tr>
            <tr className="bg-gray-50 dark:bg-gray-900/50">
              <td className="border border-gray-300 dark:border-gray-600 p-3 font-medium">{t('gdpr.tableCatContact')}</td>
              <td className="border border-gray-300 dark:border-gray-600 p-3">{t('gdpr.tableCatContactEx')}</td>
              <td className="border border-gray-300 dark:border-gray-600 p-3">{t('gdpr.tableCatContactRet')}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 dark:border-gray-600 p-3 font-medium">{t('gdpr.tableCatBooking')}</td>
              <td className="border border-gray-300 dark:border-gray-600 p-3">{t('gdpr.tableCatBookingEx')}</td>
              <td className="border border-gray-300 dark:border-gray-600 p-3">{t('gdpr.tableCatBookingRet')}</td>
            </tr>
            <tr className="bg-gray-50 dark:bg-gray-900/50">
              <td className="border border-gray-300 dark:border-gray-600 p-3 font-medium">{t('gdpr.tableCatTechnical')}</td>
              <td className="border border-gray-300 dark:border-gray-600 p-3">{t('gdpr.tableCatTechnicalEx')}</td>
              <td className="border border-gray-300 dark:border-gray-600 p-3">{t('gdpr.tableCatTechnicalRet')}</td>
            </tr>
          </tbody>
        </table>
        <p className="text-xs mt-2 text-gray-600 dark:text-gray-400">{t('gdpr.tableNote')}</p>
      </motion.div>

      {/* Section 3: Processing Purposes */}
      <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-4 mt-8">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-600 to-accent-800 flex items-center justify-center shadow-md flex-shrink-0">
          <Target className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{t('gdpr.section3Title')}</h2>
      </motion.div>
      <motion.p variants={fadeInUp}>{t('gdpr.section3')}</motion.p>
      <motion.div variants={staggerContainer} className="space-y-4 my-4">
        <motion.div variants={fadeInUp} whileHover={{ x: 4 }} className="p-4 border-l-4 border-primary bg-primary-50 dark:bg-primary-900/20 rounded-r">
          <p className="font-semibold text-lg">{t('gdpr.purpose1Title')}</p>
          <p className="text-sm mt-1">{t('gdpr.purpose1Desc')}</p>
            <p className="text-xs mt-2 text-gray-700 dark:text-gray-400"><strong>{t('gdpr.labelLegalBasis')}:</strong> {t('gdpr.purpose1Basis')}</p>
        </motion.div>
        <motion.div variants={fadeInUp} whileHover={{ x: 4 }} className="p-4 border-l-4 border-primary bg-primary-50 dark:bg-primary-900/20 rounded-r">
          <p className="font-semibold text-lg">{t('gdpr.purpose2Title')}</p>
          <p className="text-sm mt-1">{t('gdpr.purpose2Desc')}</p>
          <p className="text-xs mt-2 text-gray-700 dark:text-gray-400"><strong>{t('gdpr.labelLegalBasis')}:</strong> {t('gdpr.purpose2Basis')}</p>
        </motion.div>
        <motion.div variants={fadeInUp} whileHover={{ x: 4 }} className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20 rounded-r">
          <p className="font-semibold text-lg">{t('gdpr.purpose3Title')}</p>
          <p className="text-sm mt-1">{t('gdpr.purpose3Desc')}</p>
          <p className="text-xs mt-2 text-gray-700 dark:text-gray-400"><strong>{t('gdpr.labelLegalBasis')}:</strong> {t('gdpr.purpose3Basis')}</p>
        </motion.div>
        <motion.div variants={fadeInUp} whileHover={{ x: 4 }} className="p-4 border-l-4 border-accent bg-accent-50 dark:bg-accent-700/20 rounded-r">
          <p className="font-semibold text-lg">{t('gdpr.purpose4Title')}</p>
          <p className="text-sm mt-1">{t('gdpr.purpose4Desc')}</p>
          <p className="text-xs mt-2 text-gray-700 dark:text-gray-400"><strong>{t('gdpr.labelLegalBasis')}:</strong> {t('gdpr.purpose4Basis')}</p>
        </motion.div>
      </motion.div>
      <motion.p variants={fadeInUp} className="text-sm text-gray-700 dark:text-gray-400">{t('gdpr.purposeNote')}</motion.p>

      {/* Section 4: GDPR Rights */}
      <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-4 mt-8">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center shadow-md flex-shrink-0">
          <UserCheck className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{t('gdpr.section4Title')}</h2>
      </motion.div>
      <motion.p variants={fadeInUp}>{t('gdpr.section4')}</motion.p>
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
              {t(`gdpr.right${i}Title`)}
            </h3>
            <p className="text-sm mt-2 text-gray-700 dark:text-gray-300">{t(`gdpr.right${i}Desc`)}</p>
          </motion.div>
        ))}
      </motion.div>
      <motion.p variants={fadeInUp} className="text-sm text-gray-700 dark:text-gray-400">{t('gdpr.rightsFooter')}</motion.p>

      {/* Section 5: Data Security */}
      <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-4 mt-8">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent-700 flex items-center justify-center shadow-md flex-shrink-0">
          <Lock className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{t('gdpr.section5Title')}</h2>
      </motion.div>
      <motion.p variants={fadeInUp}>{t('gdpr.section5')}</motion.p>
      <motion.ul variants={staggerContainer} className="space-y-2 my-4">
        {[1,2,3,4,5,6,7].map((i) => (
          <motion.li key={i} variants={fadeInUp} whileHover={{ x: 3 }} className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary-700 dark:text-primary-300 mt-0.5 flex-shrink-0" />
            <span>{t(`gdpr.security${i}`)}</span>
          </motion.li>
        ))}
      </motion.ul>
      <motion.div
        variants={fadeInUp}
        whileHover={{ x: 4 }}
        className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 rounded-r"
      >
        <p className="text-sm text-gray-700 dark:text-gray-300">{t('gdpr.securityWarning')}</p>
      </motion.div>

      {/* Section 6: Contact */}
      <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-4 mt-8">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-700 flex items-center justify-center shadow-md flex-shrink-0">
          <Mail className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{t('gdpr.section6Title')}</h2>
      </motion.div>
      <motion.p variants={fadeInUp}>{t('gdpr.section6')}</motion.p>
      <motion.div variants={fadeInUp} whileHover={{ y: -2 }} className="my-4 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="grid md:grid-cols-2 gap-4 text-sm mb-4">
          <div><strong>{t('gdpr.labelGeneralEmail')}:</strong> {t('gdpr.contactEmail')}</div>
          <div><strong>{t('gdpr.labelPhone')}:</strong> {t('gdpr.contactPhone')}</div>
          <div className="md:col-span-2"><strong>{t('gdpr.labelDpo')}:</strong> {t('gdpr.contactDpo')}</div>
        </div>
        <p className="text-xs text-gray-700 dark:text-gray-400">{t('gdpr.contactResponse')}</p>
      </motion.div>

      {/* Footer */}
      <motion.div
        variants={fadeInUp}
        className="mt-8 p-6 bg-primary-50 dark:bg-primary-900/20 border-2 border-primary-300 dark:border-primary-700 rounded-lg"
      >
        <p className="font-semibold text-primary-900 dark:text-primary-300"><strong>{t('gdpr.footerDate')}</strong></p>
        <p className="text-sm mt-2 text-primary-800 dark:text-primary-400">{t('gdpr.footerCompliant')}</p>
        <p className="text-sm mt-2 text-primary-800 dark:text-primary-400 italic">{t('gdpr.footerItalic')}</p>
      </motion.div>
    </motion.div>
  );
}
