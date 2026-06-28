'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Counter } from '../ui/counter';
import {
  Sparkles,
  Globe,
  Shield,
  TrendingUp,
  Zap,
  Brain,
  Plane,
  Users,
  Award,
  CheckCircle2,
  ArrowRight,
  Palmtree,
  Lock,
  Map,
  Building2,
  Star,
  ChevronRight,
} from 'lucide-react';
import {
  fadeInUp,
  staggerContainer,
} from '../travel/destination-detail/constants/animations';
import { AppHeader } from '../AppHeader';
import { AppFooter } from '../AppFooter';

interface LandingPageProps {
  onGetStarted: () => void;
}



export function LandingPage({ onGetStarted }: LandingPageProps) {
  const router = useRouter();
  const t = useTranslations('landing');
  const goDashboard = useCallback(() => router.push('/dashboard'), [router]);

  function scrollToFeatures(e: React.MouseEvent) {
    e.preventDefault();
    const el = document.getElementById('features');
    if (!el) return;
    const headerOffset = 80;
    const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  return (
    <div className="min-h-screen selection:bg-primary/20">
      <AppHeader showDashboard showPreferences onDashboard={goDashboard} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 via-cyan-50 to-accent-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Mesh Gradient blobs */}
          <div className="absolute -top-[10%] -right-[10%] w-[60%] h-[60%] rounded-full bg-cyan-200/40 dark:bg-cyan-500/10 blur-[120px] animate-float-slow" />
          <div className="absolute -bottom-[10%] -left-[10%] w-[60%] h-[60%] rounded-full bg-primary-200/40 dark:bg-primary-500/10 blur-[120px] animate-float" />
          
          {/* Decorative floating icons */}
          <motion.div 
            animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[20%] left-[10%] text-primary-200 dark:text-primary-900/40 opacity-50 hidden lg:block"
          >
            <Plane size={120} />
          </motion.div>
          
          <motion.div 
            animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[20%] right-[10%] text-accent-200 dark:text-accent-900/40 opacity-50 hidden lg:block"
          >
            <Map size={140} />
          </motion.div>

          {/* Grid pattern */}
          <div 
            className="absolute inset-0 opacity-[0.05] dark:opacity-[0.03]" 
            style={{ 
              backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
              backgroundSize: '40px 40px'
            }} 
          />
        </div>

        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-7xl mx-auto relative z-10"
        >
          <div className="text-center space-y-12">
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 glass dark:bg-gray-800/50 border border-primary-200 dark:border-gray-700 rounded-full px-6 py-3 shadow-lg">
              <Sparkles className="w-5 h-5 text-accent animate-pulse" />
              <span className="text-sm font-bold text-primary-900 dark:text-primary-100 uppercase tracking-[0.2em]">{t('heroBadge')}</span>
            </motion.div>

            <motion.h2 variants={fadeInUp} className="text-6xl md:text-8xl lg:text-9xl font-black text-gray-900 dark:text-white leading-[1.1] tracking-tighter text-balance overflow-visible">
              {t('hero')}
            </motion.h2>

            <motion.p variants={fadeInUp} className="text-xl md:text-2xl lg:text-3xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed text-pretty font-medium">
              {t('heroDesc')}
            </motion.p>

            <motion.div variants={fadeInUp} className="flex items-center justify-center gap-6 flex-wrap">
              <motion.div whileHover={{ scale: 1.03 }}>
                <Button
                  onClick={onGetStarted}
                  variant="brand"
                  size="lg"
                  className="gap-4 text-2xl px-12 py-10 h-auto shadow-glow-primary hover:shadow-glow-accent transition-all group"
                >
                  {t('getStarted')}
                  <ArrowRight className="w-8 h-8 transition-transform group-hover:translate-x-2" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }}>
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-3 text-2xl px-12 py-10 h-auto border-primary-300 dark:border-gray-700 hover:bg-primary-50 dark:hover:bg-gray-800 dark:text-gray-100 group glass"
                  asChild
                >
                  <a href="#features" onClick={scrollToFeatures}>
                    {t('learnMore')}
                    <ChevronRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
                  </a>
                </Button>
              </motion.div>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex items-center justify-center gap-4 text-lg text-gray-600 dark:text-gray-400">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 border-2 border-white dark:border-gray-900" />
                ))}
              </div>
              <span className="font-semibold">{t('trustedBy')}</span>
              <motion.div whileHover={{ scale: 1.1 }} className="flex items-center gap-1.5 bg-yellow-400/20 dark:bg-yellow-400/10 px-3 py-1 rounded-full border border-yellow-400/30">
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
                <Badge key={i} variant="outline" className={`gap-2.5 py-4 px-8 border-${badge.color}-200 dark:border-${badge.color}-800 text-${badge.color}-950 dark:text-${badge.color}-100 glass dark:bg-${badge.color}-900/10 text-base font-bold shadow-sm hover:shadow-md transition-shadow`}>
                  <badge.icon className={`w-6 h-6 text-${badge.color}`} /> {badge.label}
                </Badge>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-950 transition-colors scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-24"
          >
            <h3 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-8 tracking-tighter uppercase italic">{t('features')}</h3>
            <p className="text-2xl lg:text-3xl text-gray-500 dark:text-gray-400 max-w-3xl mx-auto font-medium leading-relaxed">{t('featuresDesc')}</p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-12"
          >
            {[
              { icon: Brain, title: t('aiPersonalization'), description: t('aiPersonalizationDesc'), color: 'from-primary to-cyan-600' },
              { icon: Globe, title: t('globalCoverage'), description: t('globalCoverageDesc'), color: 'from-blue-500 to-indigo-600' },
              { icon: Lock, title: t('enterpriseSecurity'), description: t('enterpriseSecurityDesc'), color: 'from-green-500 to-emerald-600' },
              { icon: TrendingUp, title: t('smartRecommendations'), description: t('smartRecommendationsDesc'), color: 'from-accent to-red-600' },
              { icon: Zap, title: t('seamlessBooking'), description: t('seamlessBookingDesc'), color: 'from-yellow-500 to-amber-600' },
              { icon: Palmtree, title: t('sustainableTravel'), description: t('sustainableTravelDesc'), color: 'from-lime-500 to-green-600' }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ y: -4, boxShadow: '0 16px 32px rgba(0,0,0,0.1)' }}
                  className="transition-shadow"
                >
                  <Card className="h-full card-premium dark:bg-gray-900 group p-2">
                    <CardHeader>
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: -5 }}
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-8 shadow-xl group-hover:rotate-6 transition-transform`}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </motion.div>
                      <CardTitle className="text-2xl font-black dark:text-white group-hover:text-primary transition-colors tracking-tight">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-xl leading-relaxed dark:text-gray-400 font-medium">{feature.description}</CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-800 to-accent-800 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none" 
          style={{ 
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} 
        />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h3 className="text-5xl md:text-6xl font-black text-white mb-8 tracking-tighter italic uppercase">{t('stats')}</h3>
            <p className="text-2xl text-white/80 max-w-2xl mx-auto font-medium italic">Baseado em dados reais e atualizados</p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-16"
          >
            {[
              { icon: Globe, value: 28, label: t('destinations'), suffix: 'K+', sub: 'Wikivoyage + Wikidata' },
              { icon: Building2, value: 415, label: 'Hotéis', suffix: 'K+', sub: 'OSM + GeoNames' },
              { icon: Map, value: 190, label: 'Países', suffix: '+', sub: 'Cobertura global' },
              { icon: Shield, value: 99, label: 'Satisfação', suffix: '%', sub: 'AES-256 · GDPR' },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                variants={fadeInUp}
                whileHover={{ scale: 1.05, y: -4 }}
                className="text-center group p-8 glass bg-gradient-to-br from-green-600/30 to-orange-600/30 dark:from-green-500/20 dark:to-orange-500/20 border-white/10 dark:border-white/5 rounded-3xl hover:from-green-600/40 hover:to-orange-600/40 dark:hover:from-green-500/30 dark:hover:to-orange-500/30 transition-all duration-500"
              >
                <stat.icon className="w-16 h-16 text-white/50 mx-auto mb-8 group-hover:scale-110 group-hover:text-white transition-all duration-500" />
                <div className="text-7xl font-black text-white mb-4 tracking-tighter">
                  <Counter end={stat.value} suffix={stat.suffix} duration={3} />
                </div>
                <div className="text-2xl font-bold text-white mb-2">{stat.label}</div>
                <div className="text-sm text-white/60 font-medium uppercase tracking-widest">{stat.sub}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
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
          <motion.div whileHover={{ scale: 1.05 }} className="inline-flex items-center gap-3 glass dark:bg-gray-800/80 border border-primary-200 dark:border-gray-700 rounded-full px-8 py-3.5 shadow-xl transition-transform">
            <Award className="w-6 h-6 text-accent animate-bounce" />
            <span className="text-base font-black text-primary-950 dark:text-primary-50 uppercase tracking-widest">98% Satisfação Garantida</span>
          </motion.div>

          <h3 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black text-gray-900 dark:text-white leading-[1.1] tracking-[ -0.05em] text-balance italic overflow-visible">
            {t('cta')}
          </h3>
          
          <p className="text-2xl md:text-3xl text-gray-500 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed font-semibold">
            {t('ctaDesc')}
          </p>

          <div className="flex flex-col items-center gap-12">
            <Button
              onClick={onGetStarted}
              variant="brand"
              size="lg"
              className="gap-5 text-3xl px-20 py-12 h-auto shadow-glow-primary hover:shadow-glow-accent hover:scale-110 transition-all group font-black italic rounded-2xl"
            >
              <Sparkles className="w-10 h-10 animate-float" />
              {t('startYourJourney')}
              <ArrowRight className="w-10 h-10 transition-transform group-hover:translate-x-4" />
            </Button>

            <div className="flex items-center justify-center gap-12 flex-wrap opacity-60 dark:opacity-40">
              {[
                { icon: Shield, label: 'AES-256 · GDPR' },
                { icon: Globe, label: '190+ Países' },
                { icon: Users, label: '10K+ Viajantes' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-base font-black uppercase tracking-tighter text-gray-950 dark:text-white">
                  <item.icon className="w-6 h-6" />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      <AppFooter />
    </div>
  );
}
