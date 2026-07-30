'use client'

import { Link } from '@tanstack/react-router'
import { useI18n } from '@/lib/i18n-provider'
import { Shield, Lock, Globe, Award } from 'lucide-react'

export function AppFooter() {
  const { t } = useI18n()
  const landing = (t as Record<string, unknown>).landing as Record<string, unknown> | undefined

  const footerBadgesData = (landing?.footerBadges as Record<string, string> | undefined) || {}
const footerBadges = {
    soc2Certified: footerBadgesData.soc2Certified || 'Infraestrutura Segura SOC 2',
    encryption256: footerBadgesData.encryption256 || 'Criptografia de 256 bits',
    gdprCompliant: footerBadgesData.gdprCompliant || 'Conforme GDPR',
    iso27001: footerBadgesData.iso27001 || 'Infraestrutura Certificada ISO 27001',
  }

  const footerLinksData = (landing?.footerLinks as Record<string, string> | undefined) || {}
  const footerLinks = {
    destinations: footerLinksData.destinations || 'Destinos',
    about: footerLinksData.about || 'Sobre Nós',
    contact: footerLinksData.contact || 'Contacto',
    faq: footerLinksData.faq || 'FAQ',
    terms: footerLinksData.terms || 'Termos de Serviço',
    privacy: footerLinksData.privacy || 'Política de Privacidade',
    gdpr: footerLinksData.gdpr || 'Conformidade GDPR',
    cancellations: footerLinksData.cancellations || 'Política de Cancelamento',
    cookies: footerLinksData.cookies || 'Política de Cookies',
  }

  const footerCopyright = (landing?.footerCopyright as string) || `© ${new Date().getFullYear()} AKMLEVA. Todos os direitos reservados.`

  return (
    <footer className="bg-gray-950 text-white py-12 sm:py-20 px-4 sm:px-6 lg:px-8 border-t border-white/5 transition-colors">
      <div className="max-w-7xl mx-auto">
        {/* Top section: Brand + Badges */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-12 mb-16">
          <div className="space-y-4 text-center md:text-left">
            <div className="text-3xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              AKMLEVA
            </div>
            <p className="text-gray-400 max-w-sm font-medium">
              Viaje mais e planeie melhor com a nossa inteligência artificial: tecnologia de ponta para criar itinerários autênticos e personalizados.
            </p>
          </div>

          {/* Badges */}
          <div className="flex items-center gap-8 flex-wrap justify-center">
            {[
              { icon: Shield, label: footerBadges.soc2Certified, color: 'text-emerald-400' },
              { icon: Lock, label: footerBadges.encryption256, color: 'text-blue-400' },
              { icon: Globe, label: footerBadges.gdprCompliant, color: 'text-cyan-400' },
              { icon: Award, label: footerBadges.iso27001, color: 'text-amber-400' },
            ].map((badge, i) => (
              <div key={i} className="flex flex-col items-center gap-2 group cursor-help">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-colors">
                  <badge.icon className={`w-6 h-6 ${badge.color}`} />
                </div>
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.1em] sm:tracking-[0.2em] text-gray-400 text-center leading-tight">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-12" />

        {/* Link columns */}
        <div className="flex items-center justify-center gap-x-4 sm:gap-x-8 gap-y-3 sm:gap-y-4 flex-wrap text-xs sm:text-sm font-bold uppercase tracking-wide sm:tracking-widest mb-12">
          <Link to="/destinations" className="text-gray-400 hover:text-blue-300 transition-colors font-medium">
            {footerLinks.destinations}
          </Link>
          <span className="text-gray-700">·</span>
          <Link to="/about" className="text-gray-400 hover:text-blue-300 transition-colors font-medium">
            {footerLinks.about}
          </Link>
          <span className="text-gray-700">·</span>
          <Link to="/contact" className="text-gray-400 hover:text-blue-300 transition-colors font-medium">
            {footerLinks.contact}
          </Link>
          <span className="text-gray-700">·</span>
          <Link to="/faq" className="text-gray-400 hover:text-blue-300 transition-colors font-medium">
            {footerLinks.faq}
          </Link>
          <span className="text-gray-700">·</span>
          <Link to="/legal/$pageType" params={{ pageType: 'terms' }} className="text-gray-400 hover:text-blue-300 transition-colors">
            {footerLinks.terms}
          </Link>
          <span className="text-gray-700">·</span>
          <Link to="/legal/$pageType" params={{ pageType: 'privacy' }} className="text-gray-400 hover:text-blue-300 transition-colors">
            {footerLinks.privacy}
          </Link>
          <span className="text-gray-700">·</span>
          <Link to="/legal/$pageType" params={{ pageType: 'gdpr' }} className="text-gray-400 hover:text-blue-300 transition-colors">
            {footerLinks.gdpr}
          </Link>
          <span className="text-gray-700">·</span>
          <Link to="/legal/$pageType" params={{ pageType: 'cancellations' }} className="text-gray-400 hover:text-blue-300 transition-colors">
            {footerLinks.cancellations}
          </Link>
          <span className="text-gray-700">·</span>
          <Link to="/legal/$pageType" params={{ pageType: 'cookies' }} className="text-gray-400 hover:text-blue-300 transition-colors">
            {footerLinks.cookies}
          </Link>
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-400 text-sm">
          {footerCopyright}
        </div>
      </div>
    </footer>
  )
}
