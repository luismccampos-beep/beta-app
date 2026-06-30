'use client';

import { useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Counter } from '../ui/counter';
import {
  Sparkles,
  Globe,
  Shield,
  Users,
  Map,
  Building2,
  Star,
  ArrowRight,
  ChevronRight,
  Search,
} from 'lucide-react';
import {
  fadeInUp,
  staggerContainer,
} from '../travel/destination-detail/constants/animations';
import { useTilt } from '../../../hooks/useTilt';
import { useParallax } from '../../../hooks/useParallax';
import { RippleButton } from '../ui/ripple-button';
import { SandboxPreview } from '../ui/SandboxPreview';

/* ── Stat card with tilt ── */
function StatCard({
  icon: Icon,
  value,
  suffix,
  label,
  sub,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  value: number;
  suffix: string;
  label: string;
  sub: string;
}) {
  const { ref, rotateX, rotateY, scale, glareX, glareY, glareOpacity } = useTilt({ maxTilt: 4, scale: 1.03 });

  return (
    <motion.div variants={fadeInUp}>
      <motion.div
        ref={ref}
        style={{ rotateX, rotateY, scale, transformStyle: 'preserve-3d' }}
        className="relative overflow-hidden rounded-3xl"
      >
        {/* Glare overlay */}
        <motion.div
          className="absolute inset-0 z-10 pointer-events-none rounded-3xl"
          style={{
            background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.2) 0%, transparent 60%)`,
            opacity: glareOpacity,
          }}
        />
        <div className="text-center group p-8 glass bg-gradient-to-br from-green-600/30 to-orange-600/30 dark:from-green-500/20 dark:to-orange-500/20 border-white/10 dark:border-white/5 rounded-3xl hover:from-green-600/40 hover:to-orange-600/40 dark:hover:from-green-500/30 dark:hover:to-orange-500/30 transition-all duration-500">
          <Icon className="w-16 h-16 mx-auto mb-8 group-hover:scale-110 transition-all duration-500" />
          <div className="text-7xl font-black text-white mb-4 tracking-tighter">
            <Counter end={value} suffix={suffix} duration={3} />
          </div>
          <div className="text-2xl font-bold text-white mb-2">{label}</div>
          <div className="text-sm text-white/60 font-medium uppercase tracking-widest">{sub}</div>
        </div>
      </motion.div>
    </motion.div>
  );
}
import {
  AIllustration,
  GlobeIllustration,
  SecurityIllustration,
  TrendingIllustration,
  ZapIllustration,
  NatureIllustration,
  MapIllustration,
  BuildingIllustration,
  AwardIllustration,
  PlaneIllustration,
} from '../ui/FeatureIllustrations';
import { AppHeader } from '../AppHeader';

interface LandingPageProps {
  onGetStarted: () => void;
}

/* ── Letter-by-letter reveal ── */
function AnimatedTitle({ text }: { text: string }) {
  const words = text.split(' ');
  let charCounter = 0;
  return (
    <motion.h2
      className="text-6xl md:text-8xl lg:text-9xl font-black text-gray-900 dark:text-white leading-[1.1] tracking-tighter text-balance overflow-visible"
      aria-label={text}
    >
      {words.map((word, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap">
          {word.split('').map((char) => {
            const idx = charCounter++;
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
            );
          })}
          {wi < words.length - 1 && '\u00A0'}
        </span>
      ))}
    </motion.h2>
  );
}

/* ── Feature card with tilt + illustration ── */
function FeatureCard({
  Illustration,
  title,
  description,
  index,
}: {
  Illustration: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  index: number;
}) {
  const { ref, rotateX, rotateY, scale, glareX, glareY, glareOpacity } = useTilt({ maxTilt: 6 });

  return (
    <motion.div
      variants={fadeInUp}
    >
      <motion.div
        ref={ref}
        style={{ rotateX, rotateY, scale, transformStyle: 'preserve-3d' }}
        className="transition-shadow"
      >
        <Card className="h-full card-premium dark:bg-gray-900 group p-2 relative overflow-hidden">
          {/* Glare overlay */}
          <motion.div
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.25) 0%, transparent 60%)`,
              opacity: glareOpacity,
            }}
          />

          <div className="relative z-[5]">
            <CardHeader>
              <motion.div
                className="flex justify-center mb-6"
                style={{ transform: 'translateZ(30px)' }}
              >
                <div className="relative w-24 h-24 flex-shrink-0">
                  <Illustration className="w-full h-full" />
                </div>
              </motion.div>
              <CardTitle
                className="text-2xl font-black dark:text-white group-hover:text-primary transition-colors tracking-tight text-center"
                style={{ transform: 'translateZ(15px)' }}
              >
                {title}
              </CardTitle>
            </CardHeader>
            <CardContent style={{ transform: 'translateZ(10px)' }}>
              <CardDescription className="text-xl leading-relaxed dark:text-gray-400 font-medium text-center">
                {description}
              </CardDescription>
            </CardContent>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}


export function LandingPage({ onGetStarted }: LandingPageProps) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('landing');
  const goDashboard = useCallback(() => router.push('/dashboard'), [router]);

  const sectionRef = useRef<HTMLElement>(null);
  const heroParallax = useParallax({ speed: 0.3, containerRef: sectionRef });
  const orbCyanParallax = useParallax({ speed: -0.4, containerRef: sectionRef });
  const orbPrimaryParallax = useParallax({ speed: -0.2, containerRef: sectionRef });
  const orbAccentParallax = useParallax({ speed: 0.2, containerRef: sectionRef });
  const orbLightParallax = useParallax({ speed: -0.25, containerRef: sectionRef });

  const [destination, setDestination] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  function scrollToFeatures(e: React.MouseEvent) {
    e.preventDefault();
    const el = document.getElementById('features');
    if (!el) return;
    const headerOffset = 80;
    const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  async function handleGenerateDraft() {
    if (!destination.trim()) return;
    setIsGenerating(true);
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    onGetStarted();
  }

  /* ── Ripple + magnetic on CTAs via RippleButton ── */

  return (
    <div className="min-h-screen selection:bg-primary/20">
      <AppHeader showDashboard showPreferences onDashboard={goDashboard} />

      {/* ═══════════ Hero Section ═══════════ */}
      <section
        ref={sectionRef}
        className="relative pt-32 pb-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 via-cyan-50 to-accent-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors"
      >
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* 3D-like floating orbs with parallax */}
          <motion.div
            style={{ y: orbCyanParallax.y }}
            className="absolute -top-[10%] -right-[10%] w-[60%] h-[60%]"
          >
            <div className="w-full h-full rounded-full bg-cyan-200/40 dark:bg-cyan-500/10 blur-[120px] animate-float-slow" />
          </motion.div>
          <motion.div
            style={{ y: orbPrimaryParallax.y }}
            className="absolute -bottom-[10%] -left-[10%] w-[60%] h-[60%]"
          >
            <div className="w-full h-full rounded-full bg-primary-200/40 dark:bg-primary-500/10 blur-[120px] animate-float" />
          </motion.div>

          {/* Secondary orbs for depth with parallax */}
          <motion.div
            style={{ y: orbAccentParallax.y }}
            className="absolute top-[40%] left-[5%] w-[30%] h-[30%]"
          >
            <motion.div
              animate={{ y: [0, -40, 0], x: [0, 30, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
              className="w-full h-full rounded-full bg-accent-200/30 dark:bg-accent-500/8 blur-[80px]"
            />
          </motion.div>
          <motion.div
            style={{ y: orbLightParallax.y }}
            className="absolute top-[10%] right-[20%] w-[25%] h-[25%]"
          >
            <motion.div
              animate={{ y: [0, 30, 0], x: [0, -20, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
              className="w-full h-full rounded-full bg-primary-100/30 dark:bg-primary-500/8 blur-[100px]"
            />
          </motion.div>

          {/* Decorative floating icons */}
          <motion.div
            animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-[15%] left-[5%] w-36 h-36 opacity-50 hidden lg:block"
          >
            <PlaneIllustration className="w-full h-full" />
          </motion.div>

          <motion.div
            animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-[20%] right-[5%] w-44 h-44 opacity-50 hidden lg:block"
          >
            <MapIllustration className="w-full h-full" />
          </motion.div>

          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.05] dark:opacity-[0.03]"
            style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
              backgroundSize: '40px 40px',
            }}
          />

          {/* Subtle noise texture overlay */}
          <div
            className="absolute inset-0 opacity-[0.015] dark:opacity-[0.01]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            }}
          />
        </div>        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          style={{ y: heroParallax.y, scale: heroParallax.scale, opacity: heroParallax.opacity }}
          className="max-w-7xl mx-auto relative z-10"
        >
          <div className="text-center space-y-12">
            {/* Badge */}
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 glass-strong dark:bg-gray-800/50 border border-primary-200 dark:border-gray-700 rounded-full px-6 py-3 shadow-lg"
            >
              <Sparkles className="w-5 h-5 text-accent animate-pulse" />
              <span className="text-sm font-bold text-primary-900 dark:text-primary-100 uppercase tracking-[0.2em]">
                {t('heroBadge')}
              </span>
            </motion.div>

            {/* Title with letter-by-letter reveal */}
            <motion.div variants={fadeInUp}>
              <AnimatedTitle text={t('hero')} />
            </motion.div>

            {/* Description */}
            <motion.p
              variants={fadeInUp}
              className="text-xl md:text-2xl lg:text-3xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed text-pretty font-medium"
            >
              {t('heroDesc')}
            </motion.p>

            {/* Interactive CTA with destination input */}
            <motion.div variants={fadeInUp} className="w-full max-w-3xl mx-auto space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerateDraft()}
                    placeholder={t('heroInteractivePlaceholder')}
                    className="w-full pl-14 pr-6 py-5 text-xl rounded-2xl border-2 border-primary-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all shadow-lg"
                  />
                </div>
                <RippleButton
                  onClick={handleGenerateDraft}
                  disabled={!destination.trim() || isGenerating}
                  variant="brand"
                  size="lg"
                  magneticDistance={4}
                  className="gap-3 text-2xl px-10 py-5 h-auto shadow-glow-primary hover:shadow-glow-accent transition-all group whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <Sparkles className="w-6 h-6" />
                      </motion.div>
                      {t('generatingDraft')}
                    </>
                  ) : (
                    <>
                      {t('generateDraft')}
                      <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-2" />
                    </>
                  )}
                </RippleButton>
              </div>
              <p className="text-center text-lg text-gray-500 dark:text-gray-400 font-medium">
                {t('heroInteractive')}
              </p>
            </motion.div>

            {/* Traditional CTA Button */}
            <motion.div variants={fadeInUp}>
              <RippleButton
                onClick={onGetStarted}
                variant="outline"
                size="lg"
                magneticDistance={4}
                className="gap-3 text-xl px-8 py-4 h-auto border-primary-300 dark:border-gray-700 hover:bg-primary-50 dark:hover:bg-gray-800 dark:text-gray-100 group glass"
              >
                {t('getStarted')}
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </RippleButton>
            </motion.div>

            {/* Social proof */}
            <motion.div
              variants={fadeInUp}
              className="flex items-center justify-center gap-4 text-lg text-gray-600 dark:text-gray-400"
            >
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 border-2 border-white dark:border-gray-900"
                  />
                ))}
              </div>
              <span className="font-semibold">{t('trustedBy')}</span>
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="flex items-center gap-1.5 bg-yellow-400/20 dark:bg-yellow-400/10 px-3 py-1 rounded-full border border-yellow-400/30"
              >
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-bold text-gray-900 dark:text-gray-100">4.9</span>
              </motion.div>
            </motion.div>

            {/* Trust Badges */}
            <motion.div variants={fadeInUp} className="flex items-center justify-center gap-6 flex-wrap pt-12">
              {[
                { icon: Map, label: '28K+ Destinos', color: 'primary' },
                { icon: Globe, label: '190+ Países', color: 'primary' },
                { icon: Building2, label: '415K+ Hotéis', color: 'accent' },
                { icon: Shield, label: 'AES-256 · GDPR', color: 'accent' },
              ].map((badge, i) => (
                <Badge
                  key={i}
                  variant="outline"
                  className={`gap-2.5 py-4 px-8 border-${badge.color}-200 dark:border-${badge.color}-800 text-${badge.color}-950 dark:text-${badge.color}-100 glass-strong dark:bg-${badge.color}-900/10 text-base font-bold shadow-sm hover:shadow-md transition-shadow`}
                >
                  <badge.icon className={`w-6 h-6 text-${badge.color}`} />{' '}
                  {badge.label}
                </Badge>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════ Sandbox Preview Section ═══════════ */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 via-cyan-50 to-accent-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-cyan-200/10 to-primary-200/10 dark:from-cyan-500/5 dark:to-primary-500/5 blur-[120px]" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-primary-100 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800 rounded-full px-6 py-2 mb-6">
              <Sparkles className="w-5 h-5 text-accent" />
              <span className="text-sm font-bold text-primary-800 dark:text-primary-200 uppercase tracking-widest">
                {t('sandboxTitle') || 'Experimente grátis'}
              </span>
            </div>
            <h3 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-8 tracking-tighter uppercase italic">
              {t('visualPreview')}
            </h3>
            <p className="text-2xl lg:text-3xl text-gray-500 dark:text-gray-400 max-w-3xl mx-auto font-medium leading-relaxed">
              {t('visualPreviewDesc')}
            </p>
          </motion.div>

          <SandboxPreview
            onRegister={onGetStarted}
            locale={locale}
            texts={{
              title: t('sandboxTitle'),
              subtitle: t('sandboxSubtitle'),
              destinationLabel: t('sandboxDestinationLabel'),
              destinationPlaceholder: t('sandboxDestinationPlaceholder'),
              checkInLabel: t('sandboxCheckInLabel'),
              checkOutLabel: t('sandboxCheckOutLabel'),
              budgetLabel: t('sandboxBudgetLabel'),
              generateLabel: t('sandboxGenerateLabel'),
              generatingLabel: t('sandboxGeneratingLabel'),
              errorMessage: t('sandboxErrorMessage'),
              tryAgainLabel: t('sandboxTryAgainLabel'),
              newSearchLabel: t('sandboxNewSearchLabel'),
              totalHotels: t('sandboxTotalHotels'),
              cheapestHotel: t('sandboxCheapestHotel'),
              estimatedCost: t('sandboxEstimatedCost'),
              mealTip: t('sandboxMealTip'),
              accommodation: t('sandboxAccommodation'),
              mealsActivities: t('sandboxMealsActivities'),
              totalDay: t('sandboxTotalDay'),
              lockedTitle: t('sandboxLockedTitle'),
              lockedDesc: t('sandboxLockedDesc'),
              registerCta: t('sandboxRegisterCta'),
              viewFullCta: t('sandboxViewFullCta'),
              noAccountNote: t('sandboxNoAccountNote'),
              errorTitle: t('sandboxErrorMessage'),
            }}
          />
        </div>
      </section>

      {/* ═══════════ Features Section ═══════════ */}
      <section
        id="features"
        className="py-32 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-950 transition-colors scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="text-center mb-24"
          >
            <h3 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-8 tracking-tighter uppercase italic">
              {t('features')}
            </h3>
            <p className="text-2xl lg:text-3xl text-gray-500 dark:text-gray-400 max-w-3xl mx-auto font-medium leading-relaxed">
              {t('featuresDesc')}
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-12"
          >
            <FeatureCard
              Illustration={AIllustration}
              title={t('aiPersonalization')}
              description={t('aiPersonalizationDesc')}
              index={0}
            />
            <FeatureCard
              Illustration={GlobeIllustration}
              title={t('globalCoverage')}
              description={t('globalCoverageDesc')}
              index={1}
            />
            <FeatureCard
              Illustration={SecurityIllustration}
              title={t('enterpriseSecurity')}
              description={t('enterpriseSecurityDesc')}
              index={2}
            />
            <FeatureCard
              Illustration={TrendingIllustration}
              title={t('smartRecommendations')}
              description={t('smartRecommendationsDesc')}
              index={3}
            />
            <FeatureCard
              Illustration={ZapIllustration}
              title={t('seamlessBooking')}
              description={t('seamlessBookingDesc')}
              index={4}
            />
            <FeatureCard
              Illustration={NatureIllustration}
              title={t('sustainableTravel')}
              description={t('sustainableTravelDesc')}
              index={5}
            />
            <FeatureCard
              Illustration={BuildingIllustration}
              title={t('bookingIntegration')}
              description={t('bookingIntegrationDesc')}
              index={6}
            />
          </motion.div>
        </div>
      </section>

      {/* ═══════════ Stats Section ═══════════ */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-800 to-accent-800 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h3 className="text-5xl md:text-6xl font-black text-white mb-8 tracking-tighter italic uppercase">
              {t('stats')}
            </h3>
            <p className="text-2xl text-white/80 max-w-2xl mx-auto font-medium italic">
              Baseado em dados reais e atualizados
            </p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-16"
          >
            {[
              { icon: GlobeIllustration, value: 28, label: t('destinations'), suffix: 'K+', sub: 'Wikivoyage + Wikidata' },
              { icon: BuildingIllustration, value: 415, label: 'Hotéis', suffix: 'K+', sub: 'OSM + GeoNames' },
              { icon: MapIllustration, value: 190, label: 'Países', suffix: '+', sub: 'Cobertura global' },
              { icon: SecurityIllustration, value: 99, label: 'Satisfação', suffix: '%', sub: 'AES-256 · GDPR' },
            ].map((stat, i) => (
              <StatCard
                key={i}
                icon={stat.icon}
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
                sub={stat.sub}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════ Testimonials Section ═══════════ */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-950 transition-colors">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h3 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-8 tracking-tighter uppercase italic">
              {t('testimonials')}
            </h3>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                text: t('testimonial1'),
                author: t('testimonial1Author'),
                role: t('testimonial1Role'),
                gradient: 'from-primary-400 to-accent-400',
              },
              {
                text: t('testimonial2'),
                author: t('testimonial2Author'),
                role: t('testimonial2Role'),
                gradient: 'from-accent-400 to-primary-400',
              },
              {
                text: t('testimonial3'),
                author: t('testimonial3Author'),
                role: t('testimonial3Role'),
                gradient: 'from-primary-500 to-accent-500',
              },
            ].map((testimonial, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <Card className="h-full card-premium dark:bg-gray-900 p-8 hover:shadow-2xl transition-shadow duration-500">
                  <CardContent className="p-0 space-y-6">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed italic">
                      "{testimonial.text}"
                    </p>
                    <div className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center text-white font-bold text-lg`}>
                        {testimonial.author.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">{testimonial.author}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════ Final CTA Section ═══════════ */}
      <section className="relative py-40 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 via-cyan-50 to-accent-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full bg-gradient-to-r from-cyan-200/20 to-primary-200/20 dark:from-cyan-500/5 dark:to-primary-500/5 blur-[160px]" />
        </div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="max-w-5xl mx-auto text-center space-y-16 relative z-10"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-3 glass dark:bg-gray-800/80 border border-primary-200 dark:border-gray-700 rounded-full px-8 py-3.5 shadow-xl transition-transform"
          >
            <div className="w-14 h-14 flex-shrink-0">
              <AwardIllustration className="w-full h-full" />
            </div>
            <span className="text-base font-black text-primary-950 dark:text-primary-50 uppercase tracking-widest">
              98% Satisfação Garantida
            </span>
          </motion.div>

          <AnimatedTitle text={t('cta')} />

          <p className="text-2xl md:text-3xl text-gray-500 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed font-semibold">
            {t('ctaDesc')}
          </p>

          <div className="flex flex-col items-center gap-12">
            <RippleButton
              onClick={onGetStarted}
              variant="brand"
              size="lg"
              magneticDistance={5}
              className="gap-5 text-3xl px-20 py-12 h-auto shadow-glow-primary hover:shadow-glow-accent hover:scale-110 transition-all group font-black italic rounded-2xl"
            >
              <Sparkles className="w-10 h-10 animate-float" />
              {t('startYourJourney')}
              <ArrowRight className="w-10 h-10 transition-transform group-hover:translate-x-4" />
            </RippleButton>

            <div className="flex items-center justify-center gap-12 flex-wrap opacity-60 dark:opacity-40">
              {[
                { icon: Shield, label: 'AES-256 · GDPR' },
                { icon: Globe, label: '190+ Países' },
                { icon: Users, label: '10K+ Viajantes' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 text-base font-black uppercase tracking-tighter text-gray-950 dark:text-white"
                >
                  <item.icon className="w-6 h-6" />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

    </div>
  );
}
