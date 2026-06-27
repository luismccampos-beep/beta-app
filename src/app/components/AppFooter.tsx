'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Shield, Lock, Globe, Award } from 'lucide-react';

export function AppFooter() {
  const t = useTranslations('landing');

  return (
    <footer className="bg-gray-900 dark:bg-black text-white py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-800 dark:border-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto">
        {/* Badges */}
        <div className="flex items-center justify-center gap-8 flex-wrap text-sm text-gray-400 dark:text-gray-500 mb-6">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-500" />
            <span>{t('footerBadges.soc2Certified')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-primary dark:text-primary-300" />
            <span>{t('footerBadges.encryption256')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary dark:text-primary-300" />
            <span>{t('footerBadges.gdprCompliant')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-accent dark:text-accent-500" />
            <span>{t('footerBadges.iso27001')}</span>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center justify-center gap-6 flex-wrap text-sm mb-6">
          <Link
            href="/destinations"
            className="text-gray-400 hover:text-primary-300 transition-colors font-medium"
          >
            {t('footerLinks.destinations')}
          </Link>
          <span className="text-gray-700">•</span>
          <Link
            href="/about"
            className="text-gray-400 hover:text-primary-300 transition-colors font-medium"
          >
            {t('footerLinks.about')}
          </Link>
          <span className="text-gray-700">•</span>
          <Link
            href="/contact"
            className="text-gray-400 hover:text-primary-300 transition-colors font-medium"
          >
            {t('footerLinks.contact')}
          </Link>
          <span className="text-gray-700">•</span>
          <Link
            href="/faq"
            className="text-gray-400 hover:text-primary-300 transition-colors font-medium"
          >
            {t('footerLinks.faq')}
          </Link>
          <span className="text-gray-700">•</span>
          <Link
            href="/legal/terms"
            className="text-gray-400 hover:text-primary-300 transition-colors"
          >
            {t('footerLinks.terms')}
          </Link>
          <span className="text-gray-700">•</span>
          <Link
            href="/legal/privacy"
            className="text-gray-400 hover:text-primary-300 transition-colors"
          >
            {t('footerLinks.privacy')}
          </Link>
          <span className="text-gray-700">•</span>
          <Link
            href="/legal/gdpr"
            className="text-gray-400 hover:text-primary-300 transition-colors"
          >
            {t('footerLinks.gdpr')}
          </Link>
          <span className="text-gray-700">•</span>
          <Link
            href="/legal/cancellations"
            className="text-gray-400 hover:text-primary-300 transition-colors"
          >
            {t('footerLinks.cancellations')}
          </Link>
          <span className="text-gray-700">•</span>
          <Link
            href="/legal/cookies"
            className="text-gray-400 hover:text-primary-300 transition-colors"
          >
            {t('footerLinks.cookies')}
          </Link>
        </div>

        <div className="text-center text-gray-400 dark:text-gray-400 text-sm">
          {t('footerCopyright')}
        </div>
      </div>
    </footer>
  );
}