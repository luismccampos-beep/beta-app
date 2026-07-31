import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { generatePageHead } from '@/lib/seo'
import { createTranslationsHook } from '@/lib/i18n-provider'
import { fadeInUp, staggerContainer } from '@/lib/animations'
import {
  Heart, MapPin, Rocket, Users, Briefcase, Shield,
  Phone, Mail, GraduationCap, Lightbulb, CheckCircle2, X,
  Globe, Building2
} from 'lucide-react'

const useT = createTranslationsHook('about')

export const Route = createFileRoute('/about')({
  head: () => generatePageHead({
    title: 'Sobre Nós',
    description: 'Conheça a equipa AKMLEVA e a nossa missão de tornar a viagem mais acessível.',
    path: '/about',
  }),
  component: AboutPage,
})

function AboutPage() {
  const t = useT()
  const [showCEOModal, setShowCEOModal] = useState(false)

  useEffect(() => {
    if (showCEOModal) {
      document.body.style.overflow = 'hidden'
      const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setShowCEOModal(false) }
      document.addEventListener('keydown', handleKey)
      return () => {
        document.body.style.overflow = ''
        document.removeEventListener('keydown', handleKey)
      }
    }
    return () => { document.body.style.overflow = '' }
  }, [showCEOModal])

  const values = [
    { icon: Heart, title: t('value1Title'), desc: t('value1Desc'), color: 'bg-blue-600' },
    { icon: Globe, title: t('value2Title'), desc: t('value2Desc'), color: 'bg-green-600' },
    { icon: Shield, title: t('value3Title'), desc: t('value3Desc'), color: 'bg-purple-600' },
  ]

  const certs = [
    { title: t('cert1Title'), name: t('cert1Name'), desc: t('cert1Desc'), gradient: 'from-blue-600 to-blue-800', href: null as string | null },
    { title: t('cert2Title'), name: t('cert2Name'), desc: t('cert2Desc'), gradient: 'from-purple-600 to-purple-800', href: null as string | null },
    { title: t('cert3Title'), name: t('cert3Name'), desc: t('cert3Desc'), gradient: 'from-orange-500 to-red-700', href: 'https://www.livroreclamacoes.pt/inicio/' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-cyan-200/20 dark:bg-cyan-500/5 blur-[120px]" />
        <div className="absolute -bottom-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-200/20 dark:bg-blue-500/5 blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 relative z-10">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16 sm:mb-24">
          <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-gray-800/50 border border-blue-200 dark:border-gray-700 rounded-full px-5 py-2.5 shadow-lg mb-6 backdrop-blur-sm">
            <Rocket className="w-5 h-5 text-purple-500 animate-pulse" />
            <span className="text-sm font-bold text-blue-800 dark:text-blue-200 uppercase tracking-[0.2em]">{t('pageTitle')}</span>
          </div>
          <h1 className="text-5xl sm:text-7xl font-black text-gray-950 dark:text-white leading-[1.1] tracking-tighter uppercase mb-8">
            {t('heroTitle')} <span className="bg-gradient-to-r from-blue-600 via-purple-500 to-orange-500 bg-clip-text text-transparent">{t('heroHighlight')}</span>
          </h1>
          <div className="h-1.5 w-32 bg-gradient-to-r from-blue-600 via-purple-500 to-orange-500 mx-auto rounded-full" />
        </motion.div>

        {/* Our Story */}
        <motion.section variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} className="mb-16 sm:mb-24">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <Heart className="w-8 h-8" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-950 dark:text-white tracking-tighter uppercase">{t('ourStoryTitle')}</h2>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
            <div className="flex flex-col lg:flex-row min-h-[400px]">
              <div className="lg:w-1/2 relative min-h-[250px] overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center">
                  <Building2 className="w-20 h-20 text-blue-400 dark:text-blue-500/50" />
                </div>
              </div>
              <div className="lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center space-y-4">
                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">{t('ourStory')}</p>
                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">{t('ourStory2')}</p>
                <p className="text-lg sm:text-xl font-black text-blue-600 dark:text-blue-400 tracking-tight">{t('ourStory3')}</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Where We're From */}
        <motion.section variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} className="mb-16 sm:mb-24">
          <div className="flex items-center justify-end gap-3 mb-8 text-right">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-950 dark:text-white tracking-tighter uppercase">{t('whereWereFromTitle')}</h2>
            <div className="p-3 rounded-2xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
              <MapPin className="w-8 h-8" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
            <div className="flex flex-col-reverse lg:flex-row min-h-[400px]">
              <div className="lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center space-y-4">
                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">{t('whereWereFromText1')}</p>
                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">{t('whereWereFromText2')}</p>
                <p className="text-lg sm:text-xl font-black text-purple-600 dark:text-purple-400 tracking-tight">{t('whereWereFromText3')}</p>
              </div>
              <div className="lg:w-1/2 relative min-h-[250px] overflow-hidden">
                <div className="w-full h-full bg-gradient-to-bl from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 flex items-center justify-center">
                  <Globe className="w-20 h-20 text-purple-400 dark:text-purple-500/50" />
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Core Values */}
        <section className="mb-16 sm:mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-5xl font-black text-gray-950 dark:text-white tracking-tighter uppercase mb-4">{t('valuesTitle')}</h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">{t('valuesSubtitle')}</p>
          </div>
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <motion.div key={i} variants={fadeInUp} whileHover={{ y: -4 }} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className={`w-14 h-14 rounded-2xl ${v.color} flex items-center justify-center mb-6 shadow-lg`}>
                  <v.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3">{v.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Leadership */}
        <motion.section variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} className="mb-16 sm:mb-24">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 space-y-6">
              <div className="p-3 rounded-2xl bg-orange-100 dark:bg-orange-900/30 text-orange-600 w-fit">
                <Users className="w-8 h-8" />
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-gray-950 dark:text-white tracking-tighter uppercase">{t('leadershipTitle')}</h2>
              <p className="text-lg text-gray-500 dark:text-gray-400">{t('leadershipSubtitle')}</p>
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-lg">
                <div className="flex flex-col sm:flex-row items-start gap-6">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-black text-3xl shadow-lg flex-shrink-0">
                    LC
                  </div>
                  <div className="space-y-3 flex-1">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">{t('ceoName')}</h3>
                      <p className="text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent uppercase tracking-wider flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-purple-500" />{t('ceoTitle')}
                      </p>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{t('ceoBio')}</p>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="inline-flex items-center gap-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 rounded-full px-3 py-1 text-xs font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />{t('ceoAvailable')}
                      </span>
                      <button onClick={() => setShowCEOModal(true)} className="text-blue-600 dark:text-blue-400 font-bold text-sm hover:underline flex items-center gap-1">
                        {t('ceoLearnMore')} <Rocket className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square rounded-2xl bg-gray-100 dark:bg-gray-800 overflow-hidden flex items-center justify-center">
                  <Users className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Certifications */}
        <section className="mb-16 sm:mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-5xl font-black text-gray-950 dark:text-white tracking-tighter uppercase mb-4">{t('certificationsTitle')}</h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">{t('certificationsSubtitle')}</p>
          </div>
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} className="grid md:grid-cols-3 gap-6">
            {certs.map((c, i) => {
              const Card = c.href ? 'a' : 'div'
              const cardProps = c.href ? { href: c.href, target: '_blank', rel: 'noopener noreferrer' } : {}
              return (
                <motion.div key={i} variants={fadeInUp} whileHover={{ y: -4 }}>
                  <Card {...cardProps} className="block h-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-lg hover:shadow-xl transition-shadow">
                    <div className={`inline-block px-4 py-1.5 rounded-full bg-gradient-to-r ${c.gradient} text-white text-[10px] font-black uppercase tracking-wider mb-4 shadow-md`}>
                      {c.title}
                    </div>
                    <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2">{c.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">{c.desc}</p>
                    <div className="flex items-center gap-2 pt-4 border-t border-gray-100 dark:border-gray-800">
                      <span className="inline-flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full px-3 py-0.5 text-[10px] font-bold">
                        <CheckCircle2 className="w-3 h-3" /> {t('verified')}
                      </span>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        </section>

        {/* Final CTA */}
        <motion.section variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-purple-500 to-orange-500" />
            <div className="p-10 sm:p-16 text-center space-y-8">
              <h2 className="text-3xl sm:text-5xl font-black text-gray-950 dark:text-white tracking-tighter uppercase">{t('contactTitle')}</h2>
              <p className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">{t('contactSubtitle')}</p>
              <div className="grid sm:grid-cols-3 gap-6">
                {[
                  { icon: MapPin, label: t('address'), href: null },
                  { icon: Phone, label: '+351 256 372 092', href: 'tel:+351256372092' },
                  { icon: Mail, label: 'geral@akmleva.pt', href: 'mailto:geral@akmleva.pt' },
                ].map((item, i) => (
                  <div key={i} className="space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
                      <item.icon className="w-6 h-6" />
                    </div>
                    {item.href ? (
                      <a href={item.href} className="block text-sm font-bold text-gray-900 dark:text-white hover:text-purple-500 transition-colors">{item.label}</a>
                    ) : (
                      <p className="text-sm font-bold text-gray-900 dark:text-white whitespace-pre-line">{item.label}</p>
                    )}
                  </div>
                ))}
              </div>
              <a href="/contact" className="inline-block px-12 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/25 text-lg">
                {t('contactButton')}
              </a>
            </div>
          </div>
        </motion.section>
      </div>

      {/* CEO Modal */}
      {showCEOModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            aria-label="Close modal"
            onClick={() => setShowCEOModal(false)}
          />
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 via-purple-500 to-orange-500 p-6 flex items-center justify-between z-10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center text-white font-black text-2xl">LC</div>
                <div>
                  <h2 className="text-xl font-black text-white">{t('ceoBioTitle')}</h2>
                  <p className="text-white/80 text-sm font-bold">{t('ceoName')} · {t('ceoTitle')}</p>
                </div>
              </div>
              <button onClick={() => setShowCEOModal(false)} className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-8 space-y-6">
              {[
                { icon: GraduationCap, title: t('ceoBioSection1Title'), text: t('ceoBioSection1'), color: 'from-blue-600 to-blue-800' },
                { icon: Briefcase, title: t('ceoBioSection2Title'), text: t('ceoBioSection2'), color: 'from-purple-600 to-purple-800' },
                { icon: Lightbulb, title: t('ceoBioSection3Title'), text: t('ceoBioSection3'), color: 'from-orange-500 to-orange-700' },
                { icon: Rocket, title: t('ceoBioSection4Title'), text: t('ceoBioSection4'), color: 'from-green-600 to-green-800' },
              ].map((s, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center flex-shrink-0`}>
                      <s.icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-black text-gray-900 dark:text-white">{s.title}</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed ml-13">{s.text}</p>
                </div>
              ))}
              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <button onClick={() => setShowCEOModal(false)} className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors text-lg flex items-center justify-center gap-2">
                  <Mail className="w-5 h-5" />{t('contactCTA')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
