'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { useTranslations } from 'next-intl';
import {
  Heart,
  Leaf,
  Shield,
  CheckCircle2,
  Award,
  Users,
  MapPin,
  Phone,
  Mail,
  Briefcase,
  Target,
  Globe,
  X,
  GraduationCap,
  Lightbulb,
  Rocket
} from 'lucide-react';
import {
  fadeInUp,
  staggerContainer,
} from '@/app/components/travel/destination-detail/constants/animations';
import { AppHeader } from '../AppHeader';
import { AppFooter } from '../AppFooter';

interface AboutPageProps {
  onBack: () => void;
}

export function AboutPage({ onBack }: AboutPageProps) {
  const t = useTranslations('about');
  const [showCEOModal, setShowCEOModal] = useState(false);
  const ceoTriggerRef = useRef<HTMLButtonElement>(null);
  const ceoModalRef = useRef<HTMLDivElement>(null);
  const ceoCloseRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const triggerRef = ceoTriggerRef.current;
    const closeRef = ceoCloseRef.current;
    const modalRef = ceoModalRef.current;
    if (showCEOModal) {
      document.body.style.overflow = 'hidden';
      closeRef?.focus();
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setShowCEOModal(false);
      };
      const handleClickOutside = (e: MouseEvent) => {
        if (modalRef && !modalRef.contains(e.target as Node)) {
          setShowCEOModal(false);
        }
      };
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('mousedown', handleClickOutside);
        triggerRef?.focus();
      };
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [showCEOModal]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50 to-accent-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-cyan-200/30 dark:bg-cyan-500/10 blur-[120px]" />
        <div className="absolute -bottom-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary-200/30 dark:bg-primary-500/10 blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.05] dark:opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </div>

      <AppHeader showBack onBack={onBack} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 relative z-10">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 sm:mb-24"
        >
          <div className="inline-flex items-center gap-2 glass dark:bg-gray-800/50 border border-primary-200 dark:border-gray-700 rounded-full px-5 py-2.5 shadow-lg mb-6">
            <Rocket className="w-5 h-5 text-accent animate-pulse" />
            <span className="text-sm font-bold text-primary-900 dark:text-primary-100 uppercase tracking-[0.2em]">{t('pageTitle')}</span>
          </div>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-gray-950 dark:text-white leading-[1.1] tracking-tighter uppercase italic text-balance mb-8 overflow-visible">
            Nossa Missão é <span className="bg-gradient-to-r from-brand-gray via-orange to-green bg-clip-text text-transparent">Inspirar</span>
          </h1>
          <div className="h-1.5 w-32 bg-gradient-to-r from-brand-gray via-orange to-green mx-auto rounded-full shadow-glow-primary" />
        </motion.div>

        {/* Our Story */}
        <motion.section variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} className="mb-16 sm:mb-24">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="p-3 rounded-2xl bg-primary/10 text-primary dark:text-primary-300">
              <Heart className="w-8 h-8" />
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-950 dark:text-white tracking-tighter uppercase italic">{t('ourStoryTitle')}</h2>
          </motion.div>
          
          <Card className="card-premium dark:bg-gray-900 group">
            <CardContent className="p-0">
              <div className="flex flex-col lg:flex-row min-h-[500px]">
                {/* Castle Image */}
                <div className="lg:w-1/2 relative min-h-[300px] overflow-hidden">
                  <img
                    src="/Assets/castelo.png"
                    alt={t('ourStoryTitle')}
                    className="w-full h-full object-cover absolute inset-0 group-hover:scale-110 transition-transform duration-1000"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
                </div>
                {/* Story Text */}
                <div className="lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center space-y-6">
                  <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 leading-relaxed font-medium">{t('ourStory')}</p>
                  <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 leading-relaxed font-medium">{t('ourStory2')}</p>
                  <p className="text-xl sm:text-2xl font-black text-primary dark:text-primary-300 tracking-tight uppercase italic">{t('ourStory3')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Where We're From */}
        <motion.section variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} className="mb-16 sm:mb-24">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-end gap-3 mb-8 text-right"
          >
            <h2 className="text-4xl sm:text-5xl font-black text-gray-950 dark:text-white tracking-tighter uppercase italic">{t('whereWereFromTitle')}</h2>
            <div className="p-3 rounded-2xl bg-accent/10 text-accent dark:text-accent-500">
              <MapPin className="w-8 h-8" />
            </div>
          </motion.div>
          
          <Card className="card-premium dark:bg-gray-900 group">
            <CardContent className="p-0">
              <div className="flex flex-col-reverse lg:flex-row min-h-[500px]">
                {/* Text */}
                <div className="lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center space-y-6">
                  <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 leading-relaxed font-medium">{t('whereWereFromText1')}</p>
                  <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 leading-relaxed font-medium">{t('whereWereFromText2')}</p>
                  <p className="text-xl sm:text-2xl font-black text-accent-700 dark:text-accent-500 tracking-tight uppercase italic">{t('whereWereFromText3')}</p>
                </div>
                {/* Castle Image */}
                <div className="lg:w-1/2 relative min-h-[300px] overflow-hidden">
                  <img
                    src="/Assets/realcastelo.png"
                    alt={t('whereWereFromTitle')}
                    className="w-full h-full object-cover absolute inset-0 group-hover:scale-110 transition-transform duration-1000"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-l from-black/20 to-transparent" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Core Values */}
        <section className="mb-16 sm:mb-24">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-4xl sm:text-6xl font-black text-gray-950 dark:text-white tracking-tighter uppercase italic mb-4">{t('valuesTitle')}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 font-medium max-w-2xl mx-auto">{t('valuesSubtitle')}</p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              { icon: Heart, title: t('value1Title'), desc: t('value1Desc'), bg: 'bg-primary' },
              { icon: Leaf, title: t('value2Title'), desc: t('value2Desc'), bg: 'bg-green' },
              { icon: Shield, title: t('value3Title'), desc: t('value3Desc'), bg: 'bg-accent' }
            ].map((v, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                whileHover={{ y: -4, boxShadow: '0 16px 32px rgba(0,0,0,0.1)' }}
              >
                <Card className="card-premium dark:bg-gray-900 group h-full transition-shadow">
                  <CardContent className="p-8">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: -5 }}
                      className={`w-16 h-16 rounded-2xl ${v.bg} flex items-center justify-center mb-8 shadow-xl group-hover:rotate-6 transition-transform`}
                    >
                      <v.icon className="w-8 h-8 text-white" />
                    </motion.div>
                    <h3 className="text-2xl font-black text-gray-950 dark:text-white uppercase tracking-tighter mb-4">{v.title}</h3>
                    <p className="text-lg text-gray-700 dark:text-gray-400 font-medium leading-relaxed">{v.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Leadership */}
        <motion.section variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} className="mb-16 sm:mb-24">
          <div className="flex flex-col lg:flex-row items-center gap-12 sm:gap-20">
            <div className="lg:w-1/2 space-y-8">
              <div className="space-y-4">
                <div className="p-3 rounded-2xl bg-orange/10 text-orange w-fit">
                  <Users className="w-8 h-8" />
                </div>
                <h2 className="text-4xl sm:text-6xl font-black text-gray-950 dark:text-white tracking-tighter uppercase italic">{t('leadershipTitle')}</h2>
                <p className="text-xl text-gray-600 dark:text-gray-400 font-medium leading-relaxed">{t('leadershipSubtitle')}</p>
              </div>
              
              <motion.div whileHover={{ y: -3, boxShadow: '0 16px 32px rgba(0,0,0,0.1)' }}>
                <Card className="card-premium dark:bg-gray-900 group transition-shadow">
                  <CardContent className="p-8 sm:p-12">
                    <div className="flex flex-col sm:flex-row items-start gap-8">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: -5 }}
                        className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-br from-primary to-accent overflow-hidden shadow-2xl group-hover:scale-105 transition-transform flex-shrink-0 mx-auto sm:mx-0 ring-4 ring-white dark:ring-gray-800"
                      >
                        <img
                          src="/about/luiscampos.webp"
                          alt={t('ceoName')}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </motion.div>
                      <div className="space-y-4 flex-1">
                        <div>
                          <h3 className="text-2xl sm:text-3xl font-black text-gray-950 dark:text-white tracking-tighter uppercase italic mb-1">{t('ceoName')}</h3>
                          <p className="text-lg font-black bg-gradient-to-r from-brand-gray via-orange to-green bg-clip-text text-transparent uppercase tracking-widest flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-orange" />
                            {t('ceoTitle')}
                          </p>
                        </div>
                        <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed font-medium">{t('ceoBio')}</p>
                        <div className="flex flex-wrap items-center gap-4">
                          <motion.div whileHover={{ scale: 1.05 }}>
                            <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20 px-4 py-2 font-black uppercase tracking-tighter italic">
                              <CheckCircle2 className="w-4 h-4 mr-2" />
                              {t('ceoAvailable')}
                            </Badge>
                          </motion.div>
                          <button type="button"
                            ref={ceoTriggerRef}
                            onClick={() => setShowCEOModal(true)}
                            className="text-primary dark:text-primary-300 font-black uppercase tracking-widest hover:translate-x-2 transition-all flex items-center gap-2"
                          >
                            {t('ceoLearnMore')} <Rocket className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
            
            <div className="lg:w-1/2 grid grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square rounded-3xl bg-gray-100 dark:bg-gray-800 overflow-hidden shadow-inner border border-gray-200 dark:border-gray-700">
                  <img src={`https://picsum.photos/400/400?random=${i}`} alt="Office life" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Certifications & Partners */}
        <section className="mb-16 sm:mb-24 space-y-12">
          <div className="text-center">
            <h2 className="text-4xl sm:text-6xl font-black text-gray-950 dark:text-white tracking-tighter uppercase italic mb-4">Confiança & Excelência</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 font-medium max-w-2xl mx-auto">Parcerias e certificações que garantem a melhor experiência para você.</p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              { title: t('cert1Title'), name: t('cert1Name'), desc: t('cert1Desc'), color: 'from-blue-600 to-blue-800' },
              { title: t('cert2Title'), name: t('cert2Name'), desc: t('cert2Desc'), color: 'from-purple-600 to-purple-800' },
              { title: t('cert3Title'), name: t('cert3Name'), desc: t('cert3Desc'), color: 'from-orange to-red-700' }
            ].map((c, i) => (
              <motion.div key={i} variants={fadeInUp} whileHover={{ y: -4, boxShadow: '0 16px 32px rgba(0,0,0,0.1)' }}>
                <Card className="card-premium dark:bg-gray-900 group h-full transition-shadow">
                  <CardContent className="p-8">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className={`px-4 py-1.5 rounded-full bg-gradient-to-r ${c.color} text-white text-[10px] font-black uppercase tracking-widest mb-4 w-fit shadow-lg`}
                    >
                      {c.title}
                    </motion.div>
                    <h3 className="text-xl font-black text-gray-950 dark:text-white mb-3 tracking-tight">{c.name}</h3>
                    <p className="text-base text-gray-600 dark:text-gray-400 font-medium mb-6 leading-relaxed">{c.desc}</p>
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                      <div className="flex items-center gap-1.5 bg-green-500/10 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {t('verified')}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} className="flex flex-wrap justify-center items-center gap-8 sm:gap-16 opacity-60 dark:opacity-40 grayscale hover:opacity-100 transition-all duration-700">
            {[
              { src: '/about/partners/dgconsulting.png', alt: 'DG Consulting', href: null },
              { src: '/about/partners/gea.png', alt: 'GEA', href: null },
              { src: '/about/partners/iapmei.svg', alt: 'IAPMEI', href: null },
              { src: '/about/partners/sanjotec.png', alt: 'Sanjotec', href: 'https://www.sanjotec.com/pt/empresas/akmleva' },
              { src: '/about/partners/startupportugal.svg', alt: 'StartUP Portugal', href: null },
              { src: '/about/partners/turismodeportugal.png', alt: 'Turismo de Portugal', href: null }
            ].map((partner, i) => (
              <motion.div key={i} whileHover={{ scale: 1.1 }} className="h-10 sm:h-12 w-32 sm:w-40 relative">
                {partner.href ? (
                  <a href={partner.href} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                    <img src={partner.src} alt={partner.alt} className="w-full h-full object-contain" onError={(e) => { e.currentTarget.parentElement!.style.display = 'none'; }} />
                  </a>
                ) : (
                  <img src={partner.src} alt={partner.alt} className="w-full h-full object-contain" onError={(e) => { e.currentTarget.parentElement!.style.display = 'none'; }} />
                )}
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Final CTA */}
        <motion.section variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} className="mb-8">
          <Card className="card-premium dark:bg-gray-950 group border-0 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-gray via-orange to-green" />
            <CardContent className="p-12 sm:p-20 text-center space-y-10">
              <h2 className="text-4xl sm:text-6xl md:text-7xl font-black text-gray-950 dark:text-white tracking-tighter uppercase italic leading-[1.1] overflow-visible">{t('contactTitle')}</h2>
              <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto font-medium">{t('contactSubtitle')}</p>
              
              <div className="grid sm:grid-cols-3 gap-8 py-4">
                {[
                  { icon: MapPin, label: t('address'), val: null },
                  { icon: Phone, label: '+351 256 372 092', val: 'tel:+351256372092' },
                  { icon: Mail, label: 'geral@akmleva.pt', val: 'mailto:geral@akmleva.pt' }
                ].map((item, i) => (
                  <div key={i} className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary dark:text-primary-300 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                      <item.icon className="w-6 h-6" />
                    </div>
                    {item.val ? (
                      <a href={item.val} className="text-sm font-black uppercase tracking-tighter text-gray-950 dark:text-white hover:text-orange transition-colors">{item.label}</a>
                    ) : (
                      <p className="text-sm font-black uppercase tracking-tighter text-gray-950 dark:text-white whitespace-pre-line">{item.label}</p>
                    )}
                  </div>
                ))}
              </div>

              <Button type="button" variant="brand" size="lg" className="px-16 py-10 text-2xl shadow-glow-primary hover:scale-110">
                {t('contactButton')}
              </Button>
            </CardContent>
          </Card>
        </motion.section>
      </div>

      <AppFooter />

      {/* CEO Bio Modal */}
      {showCEOModal && (
        <div
          ref={ceoModalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="ceo-dialog-title"
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-t-[2.5rem] sm:rounded-3xl max-w-3xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl border-t sm:border border-white/20 dark:border-gray-800"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={() => {}}
            role="none"
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-brand-gray via-orange to-green p-6 sm:p-8 flex items-center justify-between z-10 shadow-xl">
              <div className="flex items-center gap-4 sm:gap-6 flex-1 min-w-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center flex-shrink-0 overflow-hidden ring-2 ring-white/30">
                  <img
                    src="/about/luiscampos.webp"
                    alt={t('ceoName')}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 id="ceo-dialog-title" className="text-xl sm:text-3xl font-black text-white truncate tracking-tighter uppercase italic">{t('ceoBioTitle')}</h2>
                  <p className="text-white/90 text-sm sm:text-base font-bold uppercase tracking-widest truncate">{t('ceoName')} · {t('ceoTitle')}</p>
                </div>
              </div>
              <button type="button"
                ref={ceoCloseRef}
                onClick={() => setShowCEOModal(false)}
                className="w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/30 flex items-center justify-center text-white transition-all flex-shrink-0 ml-4 border border-white/20"
                aria-label="Close dialog"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 sm:p-12 space-y-8">
              {[
                { icon: GraduationCap, title: t('ceoBioSection1Title'), text: t('ceoBioSection1'), color: 'from-primary to-primary-700' },
                { icon: Briefcase, title: t('ceoBioSection2Title'), text: t('ceoBioSection2'), color: 'from-blue-600 to-blue-800' },
                { icon: Lightbulb, title: t('ceoBioSection3Title'), text: t('ceoBioSection3'), color: 'from-purple-600 to-purple-800' },
                { icon: Rocket, title: t('ceoBioSection4Title'), text: t('ceoBioSection4'), color: 'from-accent to-accent-700' }
              ].map((section, i) => (
                <div key={i} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                      <section.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-gray-950 dark:text-white tracking-tighter uppercase italic">{section.title}</h3>
                  </div>
                  <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                    {section.text}
                  </p>
                </div>
              ))}

              {/* Contact Button */}
              <div className="pt-8 border-t border-gray-100 dark:border-gray-800">
                <Button type="button"
                  variant="brand"
                  size="lg"
                  onClick={() => setShowCEOModal(false)}
                  className="w-full h-16 text-xl shadow-glow-primary hover:scale-105"
                >
                  <Mail className="w-6 h-6 mr-3" />
                  {t('contactCTA')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}