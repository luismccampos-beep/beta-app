'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Shield, Lock, Globe, Award } from 'lucide-react';

export function AppFooter() {
  const t = useTranslations('landing');

  return (
    <footer className="bg-gray-950 text-white py-20 px-4 sm:px-6 lg:px-8 border-t border-white/5 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-12 mb-16">
          <div className="space-y-4 text-center md:text-left">
            <div className="text-3xl font-black bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
              AKMLEVA
            </div>
            <p className="text-gray-400 max-w-sm font-medium">
              Transformando a forma como planeias as tuas viagens com inteligência artificial e dados reais.
            </p>
          </div>
          
          <div className="flex items-center gap-8 flex-wrap justify-center">
            {[
              { icon: Shield, label: t('footerBadges.soc2Certified'), color: 'text-green-500' },
              { icon: Lock, label: t('footerBadges.encryption256'), color: 'text-primary-400' },
              { icon: Globe, label: t('footerBadges.gdprCompliant'), color: 'text-primary-400' },
              { icon: Award, label: t('footerBadges.iso27001'), color: 'text-accent-400' },
            ].map((badge, i) => (
              <div key={i} className="flex flex-col items-center gap-2 group cursor-help">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-colors">
                  <badge.icon className={`w-6 h-6 ${badge.color}`} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-12" />

        {/* Navigation Links */}
        <div className="flex items-center justify-center gap-x-8 gap-y-4 flex-wrap text-sm font-bold uppercase tracking-widest mb-12">
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