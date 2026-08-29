import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useParallax } from '@/hooks/useParallax'
import { useTilt } from '@/hooks/useTilt'
import { useMagnetic } from '@/hooks/useMagnetic'
import { useRipple } from '@/hooks/useRipple'
import { fadeInUp, staggerContainer } from '@/lib/animations'
import { createTranslationsHook } from '@/lib/i18n-provider'
import { H3 } from '@/components/ui/typography'
import { Spinner } from '@/components/ui/spinner'
import { HomeRecommendations } from '@/components/travel/HomeRecommendations'
import {
  Sparkles,
  Globe,
  Shield,
  Users,
  Map,
  Star,
  ArrowRight,
  Search,
} from 'lucide-react'

const useT = createTranslationsHook('landing')

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'AKMLEVA — Viaje mais, planeie melhor' },
      { name: 'description', content: 'Inteligência artificial para criar itinerários de viagem autênticos e personalizados.' },
      { property: 'og:title', content: 'AKMLEVA' },
      { property: 'og:description', content: 'Inteligência artificial para criar itinerários de viagem autênticos e personalizados.' },
    ],
  }),
  component: HomePage,
})

/* ── Animated Title (letter-by-letter reveal) ── */
function AnimatedTitle({ text, as: tag = 'h2' }: { text: string; as?: 'h1' | 'h2' }) {
  const words = text.split(' ')
  let charCounter = 0
  const MotionTag = tag === 'h1' ? motion.h1 : motion.h2
  return (
    <MotionTag
      className="text-5xl md:text-7xl lg:text-8xl font-black text-gray-950 dark:text-white leading-[1.1] tracking-tighter text-balance"
      aria-label={text}
    >
      {words.map((word, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap">
          {word.split('').map((char) => {
            const idx = charCounter++
            return (
              <motion.span
                key={`${char}-${idx}`}
                className="inline-block"
                initial={{ opacity: 0, y: 40, rotateX: -90 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.3 + idx * 0.035,
                  ease: [0.21, 0.47, 0.32, 0.98],
                }}
              >
                {char}
              </motion.span>
            )
          })}
          {wi < words.length - 1 && '\u00A0'}
        </span>
      ))}
    </MotionTag>
  )
}

/* ── Stat Card with tilt + counter ── */
function StatCard({
  icon: Icon,
  value,
  suffix,
  label,
  sub,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  value: number
  suffix: string
  label: string
  sub: string
}) {
  const { ref, rotateX, rotateY, scale, glareX, glareY, glareOpacity } = useTilt({ maxTilt: 4, scale: 1.03 })

  return (
    <motion.div variants={fadeInUp}>
      <motion.div
        ref={ref}
        style={{ rotateX, rotateY, scale, transformStyle: 'preserve-3d' }}
        className="relative overflow-hidden rounded-3xl"
      >
        <motion.div
          className="absolute inset-0 z-10 pointer-events-none rounded-3xl"
          style={{
            background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.2) 0%, transparent 60%)`,
            opacity: glareOpacity,
          }}
        />
        <div className="text-center group p-8 bg-gradient-to-br from-primary/80 via-primary-600/60 to-accent/60 dark:from-primary/40 dark:to-accent/30 border border-white/10 dark:border-white/5 rounded-3xl hover:from-primary/90 hover:to-accent/80 dark:hover:from-primary/50 dark:hover:to-accent/40 transition-all duration-500">
          <Icon className="w-14 h-14 mx-auto mb-6 text-white group-hover:scale-110 transition-all duration-500" />
          <div className="text-6xl font-black text-white mb-3 tracking-tighter">
            {value}{suffix}
          </div>
          <div className="text-xl font-bold text-white mb-2">{label}</div>
          <div className="text-xs text-white/60 font-medium uppercase tracking-widest">{sub}</div>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ── Feature Card with tilt ── */
function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  title: string
  description: string
}) {
  const { ref, rotateX, rotateY, scale, glareX, glareY, glareOpacity } = useTilt({ maxTilt: 6 })

  return (
    <motion.div variants={fadeInUp}>
      <motion.div ref={ref} style={{ rotateX, rotateY, scale, transformStyle: 'preserve-3d' }}>
        <div className="h-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 relative overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
          <motion.div
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.25) 0%, transparent 60%)`,
              opacity: glareOpacity,
            }}
          />
          <div className="relative z-[5] text-center space-y-4">
            <motion.div style={{ transform: 'translateZ(30px)' }}>
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/30 dark:to-accent-900/30 flex items-center justify-center">
                <Icon className="w-8 h-8 text-primary dark:text-primary-300" />
              </div>
            </motion.div>
            <H3 headingColor="default" className="text-xl group-hover:text-primary dark:group-hover:text-primary-300 transition-colors" style={{ transform: 'translateZ(15px)' }}>
              {title}
            </H3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed" style={{ transform: 'translateZ(10px)' }}>
              {description}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ── Ripple + Magnetic Button ── */
interface RippleButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  variant?: 'primary' | 'outline'
  magnetic?: boolean
  disabled?: boolean
}

function RippleButton({
  children,
  onClick,
  className = '',
  variant = 'primary',
  magnetic = true,
  disabled = false,
}: RippleButtonProps) {
  const ripple = useRipple()
  const magnet = useMagnetic({ maxDistance: 5, stiffness: 250, damping: 15 })

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    ripple(e)
    onClick?.()
  }

  const baseStyles = variant === 'primary'
    ? 'bg-primary text-white hover:bg-primary-700 shadow-lg shadow-primary/25'
    : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'

  const content = (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`relative overflow-hidden px-8 py-3 text-base font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${baseStyles} ${className} ripple`}
    >
      {children}
    </button>
  )

  if (magnetic) {
    return (
      <span ref={magnet.ref}>
        <motion.span style={{ x: magnet.x, y: magnet.y }}>
          {content}
        </motion.span>
      </span>
    )
  }

  return content
}

/* ── Page Content ── */
function HomePage() {
  const router = useRouter()
  const sectionRef = useRef<HTMLElement>(null)
  const heroParallax = useParallax({ speed: 0.3, containerRef: sectionRef })
  const orbCyanParallax = useParallax({ speed: -0.4, containerRef: sectionRef })
  const orbPrimaryParallax = useParallax({ speed: -0.2, containerRef: sectionRef })
  const orbAccentParallax = useParallax({ speed: 0.2, containerRef: sectionRef })

  const [destination, setDestination] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  async function handleGenerateDraft() {
    if (!destination.trim()) return
    setIsGenerating(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      await router.navigate({ to: '/preferences/quick' })
    } finally {
      setIsGenerating(false)
    }
  }

  const t = useT()

  const features = [
    { icon: Globe, title: t('globalCoverage'), description: t('globalCoverageDesc') },
    { icon: Shield, title: t('enterpriseSecurity'), description: t('enterpriseSecurityDesc') },
    { icon: Sparkles, title: t('aiPersonalization'), description: t('aiPersonalizationDesc') },
  ]

  return (
    <div className="selection:bg-primary/20">
      {/* ═══════════ Hero Section ═══════════ */}
      <section
        ref={sectionRef}
        className="relative pt-24 pb-20 sm:pt-32 sm:pb-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 via-accent-50 to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors overflow-hidden"
      >
        {/* Background orbs with parallax */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div style={{ y: orbCyanParallax.y }} className="absolute -top-[10%] -right-[10%] w-[60%] h-[60%]">
            <div className="w-full h-full rounded-full bg-primary-200/30 dark:bg-primary-500/8 blur-[120px]" />
          </motion.div>
          <motion.div style={{ y: orbPrimaryParallax.y }} className="absolute -bottom-[10%] -left-[10%] w-[60%] h-[60%]">
            <div className="w-full h-full rounded-full bg-primary-200/30 dark:bg-primary-500/8 blur-[120px]" />
          </motion.div>
          <motion.div style={{ y: orbAccentParallax.y }} className="absolute top-[40%] left-[5%] w-[30%] h-[30%]">
            <motion.div
              animate={{ y: [0, -40, 0], x: [0, 30, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
              className="w-full h-full rounded-full bg-accent-200/25 dark:bg-accent-500/6 blur-[80px]"
            />
          </motion.div>

          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.06] dark:opacity-[0.03]"
            style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '40px 40px' }}
          />
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          style={{ y: heroParallax.y, scale: heroParallax.scale, opacity: heroParallax.opacity }}
          className="max-w-5xl mx-auto relative z-10"
        >
          <div className="text-center space-y-8 sm:space-y-10">
            {/* Badge */}
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 bg-white/80 dark:bg-gray-800/50 border border-primary-200 dark:border-gray-700 rounded-full px-5 py-2.5 shadow-lg backdrop-blur-sm"
            >
              <Sparkles className="w-4 h-4 text-accent animate-pulse" />
              <span className="text-sm font-bold text-primary-900 dark:text-primary-200 uppercase tracking-[0.2em]">
                {t('heroBadge')}
              </span>
            </motion.div>

            {/* Title with letter-by-letter reveal */}
            <motion.div variants={fadeInUp}>
              <AnimatedTitle text={t('hero')} as="h1" />
            </motion.div>

            {/* Description */}
            <motion.p
              variants={fadeInUp}
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed font-medium"
            >
              {t('heroDesc')}
            </motion.p>

            {/* CTA with destination input */}
            <motion.div variants={fadeInUp} className="w-full max-w-2xl mx-auto space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerateDraft()}
                    placeholder={t('heroInteractivePlaceholder')}
                    className="w-full pl-12 pr-5 py-3.5 text-lg rounded-xl border-2 border-primary-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all shadow-lg"
                  />
                </div>
                <RippleButton
                  onClick={handleGenerateDraft}
                  className="gap-2 text-lg px-8 py-3.5 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!destination.trim() || isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Spinner size="sm" />
                      {t('generatingDraft')}
                    </>
                  ) : (
                    <>
                      {t('generateDraft')}
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </RippleButton>
              </div>
            </motion.div>

            {/* Traditional CTA */}
            <motion.div variants={fadeInUp}>
              <RippleButton
                variant="outline"
                onClick={() => void router.navigate({ to: '/preferences/quick' })}
                className="gap-2 text-lg px-8 py-3.5"
              >
                {t('getStarted')}
                <ArrowRight className="w-4 h-4" />
              </RippleButton>
            </motion.div>

            {/* Social proof */}
            <motion.div variants={fadeInUp} className="flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400 flex-wrap">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent border-2 border-white dark:border-gray-900" />
                ))}
              </div>
              <span className="font-semibold">{t('trustedBy')}</span>
              <div className="flex items-center gap-1.5 bg-yellow-400/20 dark:bg-yellow-400/10 px-3 py-1 rounded-full border border-yellow-400/30">
                <svg className="w-4 h-4 fill-yellow-400 text-yellow-400" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-bold text-gray-900 dark:text-gray-100">4.9</span>
              </div>
            </motion.div>

            {/* Trust Badges */}
            <motion.div variants={fadeInUp} className="flex items-center justify-center gap-4 sm:gap-6 flex-wrap pt-8">
              {[
                { icon: Map, label: '28K+ Destinos' },
                { icon: Globe, label: '190+ Países' },
                { icon: Shield, label: 'AES-256 · GDPR' },
              ].map((badge, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 py-2.5 px-5 bg-white/80 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-full shadow-sm text-sm font-bold text-gray-700 dark:text-gray-300 backdrop-blur-sm"
                >
                  <badge.icon className="w-5 h-5 text-primary dark:text-primary-300" />
                  {badge.label}
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════ Personalized Recommendations ═══════════ */}
      <HomeRecommendations limit={8} />

      {/* ═══════════ Features Section ═══════════ */}
      <section id="features" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-950 transition-colors scroll-mt-20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <H3 headingColor="default" className="text-4xl sm:text-5xl mb-6 uppercase">
              {t('features')}
            </H3>
            <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-medium">
              {t('featuresDesc')}
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════ Stats Section ═══════════ */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-900 via-gray-950 to-accent-700/80 dark:from-black dark:via-gray-950 dark:to-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <H3 headingColor="white" className="text-4xl sm:text-5xl mb-6 uppercase">
              {t('stats')}
            </H3>
          </div>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
          >
            {[
              { icon: Globe, value: 28, suffix: 'K+', label: t('destinations'), sub: 'Wikivoyage + Wikidata' },
              { icon: Map, value: 190, suffix: '+', label: t('happyTravelers'), sub: 'Cobertura global' },
              { icon: Shield, value: 99, suffix: '%', label: t('aiAccuracy'), sub: 'AES-256 · GDPR' },
              { icon: Users, value: 50, suffix: 'K+', label: t('happyTravelers'), sub: 'Comunidade global' },
            ].map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════ Testimonials ═══════════ */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-950 transition-colors">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <H3 headingColor="default" className="text-4xl sm:text-5xl mb-6 uppercase">
              {t('testimonials')}
            </H3>
          </motion.div>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              { text: t('testimonial1'), author: t('testimonial1Author'), role: t('testimonial1Role'), gradient: 'from-primary to-accent' },
              { text: t('testimonial2'), author: t('testimonial2Author'), role: t('testimonial2Role'), gradient: 'from-accent to-primary' },
              { text: t('testimonial3'), author: t('testimonial3Author'), role: t('testimonial3Role'), gradient: 'from-brand-gray via-orange to-green' },
            ].map((testimonial, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <div className="h-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 hover:shadow-xl transition-shadow duration-500">
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed italic mb-6">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center text-white font-bold text-sm`}>
                      {testimonial.author.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white text-sm">{testimonial.author}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════ Final CTA ═══════════ */}
      <section className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 via-accent-50 to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-r from-primary-200/20 to-accent-200/20 dark:from-primary-500/5 dark:to-accent-500/5 blur-[160px]" />
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeInUp}
          className="max-w-3xl mx-auto text-center space-y-8 relative z-10"
        >
          <AnimatedTitle text={t('cta')} as="h2" />
          <p className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-medium">
            {t('ctaDesc')}
          </p>
          <div className="flex flex-col items-center gap-6">
            <RippleButton
              onClick={() => void router.navigate({ to: '/preferences/quick' })}
              className="gap-3 text-xl px-12 py-4 font-black rounded-2xl"
            >
              <Sparkles className="w-6 h-6" />
              {t('ctaButton')}
              <ArrowRight className="w-6 h-6" />
            </RippleButton>
            <div className="flex items-center justify-center gap-8 flex-wrap text-xs font-bold uppercase tracking-tight text-gray-400 dark:text-gray-500">
              <span className="flex items-center gap-2"><Shield className="w-4 h-4" /> AES-256 · GDPR</span>
              <span className="flex items-center gap-2"><Globe className="w-4 h-4" /> {t('statsCountries')}</span>
              <span className="flex items-center gap-2"><Users className="w-4 h-4" /> {t('statsTravelers')}</span>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
