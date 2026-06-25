'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
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
} from 'lucide-react';
import { AppHeader } from '../AppHeader';
import { AppFooter } from '../AppFooter';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const router = useRouter();
  const t = useTranslations('landing');
  const goDashboard = useCallback(() => router.push('/dashboard'), [router]);
  const goForm = useCallback(() => router.push('/preferences/edit'), [router]);

  function scrollToFeatures(e: React.MouseEvent) {
    e.preventDefault();
    const el = document.getElementById('features');
    if (!el) return;
    const headerOffset = 80;
    const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  return (
    <div className="min-h-screen">
      <AppHeader showDashboard showPreferences onDashboard={goDashboard} />

      {/* Hero Section */}
      <section className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-teal-50 via-cyan-50 to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 border border-teal-200 dark:border-gray-600 rounded-full px-4 py-2 shadow-sm">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium text-teal-900 dark:text-teal-300">{t('heroBadge')}</span>
            </div>

            <h2 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white leading-tight">
              {t('hero')}
            </h2>

            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {t('heroDesc')}
            </p>

            <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-3xl mx-auto">
              {t('heroSubDesc')}
            </p>

            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Button
                onClick={onGetStarted}
                size="lg"
                className="gap-2 bg-gradient-to-r from-teal-600 to-orange-500 hover:from-teal-700 hover:to-orange-600 text-lg px-8 py-6 h-auto shadow-lg"
              >
                {t('getStarted')}
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="gap-2 text-lg px-8 py-6 h-auto border-teal-300 dark:border-gray-600 hover:bg-teal-50 dark:hover:bg-gray-800 dark:text-gray-200"
                asChild
              >
                <a href="#features" onClick={scrollToFeatures}>{t('learnMore')}</a>
              </Button>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-500" />
              <span>{t('trustedBy')}</span>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-6 flex-wrap pt-8">
              <Badge variant="outline" className="gap-1.5 py-2 px-4 border-teal-300 dark:border-teal-700 text-teal-700 dark:text-teal-400 dark:bg-gray-800">
                <Map className="w-4 h-4" /> 28K+ Destinos
              </Badge>
              <Badge variant="outline" className="gap-1.5 py-2 px-4 border-teal-300 dark:border-teal-700 text-teal-700 dark:text-teal-400 dark:bg-gray-800">
                <Globe className="w-4 h-4" /> 190+ Países
              </Badge>
              <Badge variant="outline" className="gap-1.5 py-2 px-4 border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-400 dark:bg-gray-800">
                <Building2 className="w-4 h-4" /> 415K+ Hotéis
              </Badge>
              <Badge variant="outline" className="gap-1.5 py-2 px-4 border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-400 dark:bg-gray-800">
                <Shield className="w-4 h-4" /> AES-256 · GDPR
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 transition-colors scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('features')}</h3>
            <p className="text-xl text-gray-600 dark:text-gray-300">{t('featuresDesc')}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: t('aiPersonalization'),
                description: t('aiPersonalizationDesc'),
                color: 'from-teal-500 to-cyan-600'
              },
              {
                icon: Globe,
                title: t('globalCoverage'),
                description: t('globalCoverageDesc'),
                color: 'from-blue-500 to-indigo-600'
              },
              {
                icon: Lock,
                title: t('enterpriseSecurity'),
                description: t('enterpriseSecurityDesc'),
                color: 'from-green-500 to-emerald-600'
              },
              {
                icon: TrendingUp,
                title: t('smartRecommendations'),
                description: t('smartRecommendationsDesc'),
                color: 'from-orange-500 to-red-600'
              },
              {
                icon: Zap,
                title: t('seamlessBooking'),
                description: t('seamlessBookingDesc'),
                color: 'from-yellow-500 to-amber-600'
              },
              {
                icon: Palmtree,
                title: t('sustainableTravel'),
                description: t('sustainableTravelDesc'),
                color: 'from-lime-500 to-green-600'
              }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-2 border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:hover:border-teal-600 transition-all hover:shadow-xl dark:bg-gray-800">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl dark:text-white">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base dark:text-gray-300">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-teal-50 dark:from-gray-800 dark:to-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('howItWorks')}</h3>
            <p className="text-xl text-gray-600 dark:text-gray-300">{t('howItWorksDesc')}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                number: '01',
                title: t('step1'),
                description: t('step1Desc')
              },
              {
                icon: Brain,
                number: '02',
                title: t('step2'),
                description: t('step2Desc')
              },
              {
                icon: Plane,
                number: '03',
                title: t('step3'),
                description: t('step3Desc')
              }
            ].map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative">
                  <Card className="h-full border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-teal-300 dark:hover:border-teal-600 transition-all">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-600 to-orange-500 flex items-center justify-center">
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <span className="text-6xl font-bold text-teal-100 dark:text-gray-700">{step.number}</span>
                      </div>
                      <CardTitle className="text-2xl dark:text-white">{step.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 dark:text-gray-300 text-base">{step.description}</p>
                    </CardContent>
                  </Card>
                  {index < 2 && (
                    <ArrowRight className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 w-8 h-8 text-teal-300 dark:text-teal-700" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section — valores baseados em dados reais */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-teal-700 to-orange-600">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-white mb-4">{t('stats')}</h3>
            <p className="text-lg text-white/80">Baseado em dados reais do Wikivoyage, OpenStreetMap e GeoNames</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <Globe className="w-12 h-12 text-white/80 mx-auto mb-4" />
              <div className="text-5xl font-bold text-white mb-2">28K+</div>
              <div className="text-lg text-white/90">{t('destinations')}</div>
              <div className="text-sm text-white/60 mt-1">Wikivoyage + Wikidata</div>
            </div>
            <div className="text-center">
              <Building2 className="w-12 h-12 text-white/80 mx-auto mb-4" />
              <div className="text-5xl font-bold text-white mb-2">415K+</div>
              <div className="text-lg text-white/90">Hotéis Georreferenciados</div>
              <div className="text-sm text-white/60 mt-1">OpenStreetMap + GeoNames</div>
            </div>
            <div className="text-center">
              <Map className="w-12 h-12 text-white/80 mx-auto mb-4" />
              <div className="text-5xl font-bold text-white mb-2">190+</div>
              <div className="text-lg text-white/90">Países e Territórios</div>
              <div className="text-sm text-white/60 mt-1">Cobertura global</div>
            </div>
            <div className="text-center">
              <Shield className="w-12 h-12 text-white/80 mx-auto mb-4" />
              <div className="text-5xl font-bold text-white mb-2">{t('statsBadges.soc2Value')}</div>
              <div className="text-lg text-white/90">{t('statsBadges.soc2Label')}</div>
              <div className="text-sm text-white/60 mt-1">AES-256 · GDPR</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-teal-50 via-cyan-50 to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h3 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            {t('cta')}
          </h3>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {t('ctaDesc')}
          </p>
          <Button
            onClick={onGetStarted}
            size="lg"
            className="gap-2 bg-gradient-to-r from-teal-600 to-orange-500 hover:from-teal-700 hover:to-orange-600 text-xl px-12 py-8 h-auto shadow-xl hover:shadow-2xl transition-all"
          >
            <Sparkles className="w-6 h-6" />
            {t('startYourJourney')}
            <ArrowRight className="w-6 h-6" />
          </Button>
        </div>
      </section>

      <AppFooter />
    </div>
  );
}