'use client'

import { Link } from '@tanstack/react-router'
import { useI18n } from '@/lib/i18n-provider'
import { Shield, Lock, Globe, Award, Plane } from 'lucide-react'
import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@/lib/animations'

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

  const linkColumns = [
    {
      heading: footerLinks.destinations,
      links: [
        { label: footerLinks.destinations, to: '/destinations', params: undefined },
      ],
    },
    {
      heading: footerLinks.about,
      links: [
        { label: footerLinks.about, to: '/about', params: undefined },
        { label: footerLinks.contact, to: '/contact', params: undefined },
        { label: footerLinks.faq, to: '/faq', params: undefined },
      ],
    },
    {
      heading: footerLinks.terms,
      links: [
        { label: footerLinks.terms, to: '/legal/$pageType', params: { pageType: 'terms' } },
        { label: footerLinks.privacy, to: '/legal/$pageType', params: { pageType: 'privacy' } },
        { label: footerLinks.gdpr, to: '/legal/$pageType', params: { pageType: 'gdpr' } },
        { label: footerLinks.cancellations, to: '/legal/$pageType', params: { pageType: 'cancellations' } },
        { label: footerLinks.cookies, to: '/legal/$pageType', params: { pageType: 'cookies' } },
      ],
    },
  ]

  return (
    <footer className="relative bg-gray-950 text-white py-12 sm:py-20 px-4 sm:px-6 lg:px-8 border-t border-white/5 transition-colors overflow-hidden">
      {/* Decorative background orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 rounded-full bg-accent/5 blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Top section: Brand + Badges */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="flex flex-col md:flex-row justify-between items-center gap-12 mb-16"
        >
          <motion.div variants={fadeInUp} className="space-y-4 text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-brand-gray via-orange to-green flex items-center justify-center shadow-lg">
                <Plane className="w-5 h-5 text-white -rotate-12" />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-brand-gray via-orange to-green blur-md opacity-40" />
              </div>
              <div className="text-3xl font-black bg-gradient-to-r from-brand-gray via-orange to-green bg-clip-text text-transparent">
                AKMLEVA
              </div>
            </div>
            <p className="text-gray-400 max-w-sm font-medium">
              Viaje mais e planeie melhor com a nossa inteligência artificial: tecnologia de ponta para criar itinerários autênticos e personalizados.
            </p>
          </motion.div>

          {/* Badges */}
          <motion.div variants={fadeInUp} className="flex items-center gap-6 sm:gap-8 flex-wrap justify-center">
            {[
              { icon: Shield, label: footerBadges.soc2Certified, color: 'text-emerald-400', glow: 'group-hover:shadow-emerald-500/20' },
              { icon: Lock, label: footerBadges.encryption256, color: 'text-primary-300', glow: 'group-hover:shadow-primary/20' },
              { icon: Globe, label: footerBadges.gdprCompliant, color: 'text-cyan-400', glow: 'group-hover:shadow-cyan-500/20' },
              { icon: Award, label: footerBadges.iso27001, color: 'text-amber-400', glow: 'group-hover:shadow-amber-500/20' },
            ].map((badge, i) => (
              <div key={i} className="flex flex-col items-center gap-2 group cursor-help">
                <motion.div
                  whileHover={{ scale: 1.1, y: -2 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  className={`relative w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-all shadow-lg ${badge.glow}`}
                >
                  <badge.icon className={`w-6 h-6 ${badge.color}`} />
                </motion.div>
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.1em] sm:tracking-[0.2em] text-gray-400 text-center leading-tight">{badge.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-12" />

        {/* Link columns */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12"
        >
          {linkColumns.map((col) => (
            <motion.div key={col.heading} variants={fadeInUp}>
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">{col.heading}</h3>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to as never}
                      params={link.params as never}
                      className="group/link text-sm text-gray-400 hover:text-white transition-colors font-medium inline-flex items-center gap-1"
                    >
                      <span className="w-0 group-hover/link:w-3 h-px bg-primary transition-all duration-300" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Copyright */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center text-gray-400 text-sm"
        >
          {footerCopyright}
        </motion.div>
      </div>
    </footer>
  )
}
