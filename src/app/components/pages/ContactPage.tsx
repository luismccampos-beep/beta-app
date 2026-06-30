'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { useTranslations } from 'next-intl';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageSquare,
  CheckCircle2
} from 'lucide-react';
import {
  fadeInUp,
  staggerContainer,
} from '@/app/components/travel/destination-detail/constants/animations';
import { AppHeader } from '../AppHeader';

interface ContactPageProps {
}

export function ContactPage({}: ContactPageProps) {
  const t = useTranslations('contact');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Erro ao enviar mensagem');

      setIsSubmitted(true);
      setSubmitError('');
    } catch {
      setSubmitError('Ocorreu um erro ao enviar a mensagem. Tenta novamente ou envia email para geral@akmleva.pt.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50 to-accent-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-cyan-200/30 dark:bg-cyan-500/10 blur-[120px]" />
        <div className="absolute -bottom-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary-200/30 dark:bg-primary-500/10 blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.05] dark:opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </div>

      <AppHeader showBack onBack={onBack} />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 relative z-10">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 sm:mb-24"
        >
          <div className="inline-flex items-center gap-2 glass dark:bg-gray-800/50 border border-primary-200 dark:border-gray-700 rounded-full px-5 py-2.5 shadow-lg mb-6">
            <MessageSquare className="w-5 h-5 text-accent animate-pulse" />
            <span className="text-sm font-bold text-primary-900 dark:text-primary-100 uppercase tracking-[0.2em]">{t('pageTitle')}</span>
          </div>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-gray-950 dark:text-white leading-[1.1] tracking-tighter uppercase italic text-balance mb-6 overflow-visible">
            Estamos <span className="bg-gradient-to-r from-brand-gray via-orange to-green bg-clip-text text-transparent">Próximos</span> de Ti
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed">
            {t('pageSubtitle')}
          </p>
        </motion.div>

        {/* Contact Info Cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 sm:mb-24"
        >
          {[
            { icon: MapPin, title: t('addressTitle'), val: t('address'), color: 'from-primary to-primary-700' },
            { icon: Phone, title: t('phoneTitle'), val: '+351 256 372 092', valHref: 'tel:+351256372092', color: 'from-blue-600 to-blue-800' },
            { icon: Mail, title: t('emailTitle'), val: 'geral@akmleva.pt', valHref: 'mailto:geral@akmleva.pt', color: 'from-purple-600 to-purple-800' },
            { icon: Clock, title: t('hoursTitle'), val: t('hours'), color: 'from-accent-600 to-accent-800' }
          ].map((item, i) => (
            <motion.div key={i} variants={fadeInUp} whileHover={{ y: -4, boxShadow: '0 16px 32px rgba(0,0,0,0.1)' }}>
              <Card className="card-premium dark:bg-gray-900 group h-full text-center transition-shadow">
                <CardContent className="p-8">
                  <motion.div
                    whileHover={{ scale: 1.15, rotate: -5 }}
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform`}
                  >
                    <item.icon className="w-7 h-7 text-white" />
                  </motion.div>
                  <h3 className="text-lg font-black text-gray-950 dark:text-white uppercase tracking-tighter mb-3">{item.title}</h3>
                  {item.valHref ? (
                    <a href={item.valHref} className="text-base font-bold text-primary dark:text-primary-300 hover:underline">{item.val}</a>
                  ) : (
                    <p className="text-base font-medium text-gray-600 dark:text-gray-400 whitespace-pre-line">{item.val}</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Contact Form & Social */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid lg:grid-cols-3 gap-8 mb-16 sm:mb-24"
        >
          {/* Contact Form */}
          <motion.div variants={fadeInUp} className="lg:col-span-2">
            <Card className="card-premium dark:bg-gray-950 group h-full relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-gray via-orange to-green" />
              <CardContent className="p-8 sm:p-12">
                <div className="flex items-center gap-4 mb-10">
                  <div className="p-3 rounded-2xl bg-primary/10 text-primary dark:text-primary-300">
                    <Send className="w-8 h-8" />
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-black text-gray-950 dark:text-white tracking-tighter uppercase italic">{t('formTitle')}</h2>
                </div>

                {isSubmitted ? (
                  <div className="text-center py-12 sm:py-20">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-8">
                      <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
                    </motion.div>
                    <h3 className="text-3xl font-black text-gray-950 dark:text-white mb-4 tracking-tight uppercase">{t('successTitle') || 'Mensagem Enviada!'}</h3>
                    <p className="text-xl text-gray-600 dark:text-gray-400 font-medium">
                      {t('successMessage') || 'Recebemos a tua mensagem e responderemos em breve. Obrigado!'}
                    </p>
                    <Button
                      onClick={() => { setIsSubmitted(false); setFormData({ name: '', email: '', phone: '', subject: '', message: '' }); }}
                      variant="outline"
                      size="lg"
                      className="mt-10 font-black uppercase tracking-widest glass"
                    >
                      {t('sendAnother') || 'Enviar outra'}
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-8">
                    {submitError && (
                      <div role="alert" className="rounded-2xl bg-red-500/10 border border-red-500/20 p-6 text-base font-bold text-red-700 dark:text-red-400">
                        {submitError}
                      </div>
                    )}
                    <div className="grid sm:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label htmlFor="contact-name" className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">
                          {t('formName')} *
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full h-14 px-6 rounded-2xl border-2 border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-900 text-gray-950 dark:text-white focus:border-primary focus:ring-0 transition-all text-lg font-bold"
                          placeholder={t('formNamePlaceholder')}
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="contact-email" className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">
                          {t('formEmail')} *
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full h-14 px-6 rounded-2xl border-2 border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-900 text-gray-950 dark:text-white focus:border-primary focus:ring-0 transition-all text-lg font-bold"
                          placeholder={t('formEmailPlaceholder')}
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label htmlFor="contact-phone" className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">
                          {t('formPhone')}
                        </label>
                        <input
                          id="contact-phone"
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full h-14 px-6 rounded-2xl border-2 border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-900 text-gray-950 dark:text-white focus:border-primary focus:ring-0 transition-all text-lg font-bold"
                          placeholder={t('formPhonePlaceholder')}
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="contact-subject" className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">
                          {t('formSubject')} *
                        </label>
                        <select
                          id="contact-subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="w-full h-14 px-6 rounded-2xl border-2 border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-900 text-gray-950 dark:text-white focus:border-primary focus:ring-0 transition-all text-lg font-bold appearance-none cursor-pointer"
                        >
                          <option value="">{t('formSubjectPlaceholder')}</option>
                          <option value="booking">{t('subjectBooking')}</option>
                          <option value="support">{t('subjectSupport')}</option>
                          <option value="partnership">{t('subjectPartnership')}</option>
                          <option value="feedback">{t('subjectFeedback')}</option>
                          <option value="other">{t('subjectOther')}</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="contact-message" className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">
                        {t('formMessage')} *
                      </label>
                      <textarea
                        id="contact-message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-900 text-gray-950 dark:text-white focus:border-primary focus:ring-0 transition-all text-lg font-bold resize-none"
                        placeholder={t('formMessagePlaceholder')}
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      variant="brand"
                      size="lg"
                      className="w-full h-16 text-xl shadow-glow-primary hover:scale-105"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-3 font-black uppercase tracking-widest italic">
                          <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          {t('sending')}
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-3 font-black uppercase tracking-widest italic">
                          <Send className="w-6 h-6" />
                          {t('sendMessage')}
                        </span>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Social & Additional Info */}
          <motion.div variants={fadeInUp} className="space-y-8">
            <Card className="card-premium dark:bg-gray-900 group">
              <CardContent className="p-8">
                <h3 className="text-xl font-black text-gray-950 dark:text-white uppercase tracking-tighter mb-6">{t('socialTitle')}</h3>
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { name: 'Facebook', url: 'https://www.facebook.com/profile.php?id=61586650558724', icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z', color: 'text-blue-600 bg-blue-500/10 border-blue-500/20' },
                    { name: 'Instagram', url: 'https://www.instagram.com/akmleva.ia?igsh=MTk1dWI3Ym5nMndjZQ==', icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z', color: 'text-pink-600 bg-pink-500/10 border-pink-500/20' },
                    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/akmleva-travel-agency-a772373a6/', icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z', color: 'text-blue-700 bg-blue-700/10 border-blue-700/20' },
                    { name: 'YouTube', url: 'https://youtube.com/@akmleva', icon: 'M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z', color: 'text-red-600 bg-red-500/10 border-red-500/20' }
                  ].map((social, i) => (
                    <a 
                      key={i} 
                      href={social.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className={`flex items-center gap-4 p-4 rounded-2xl border ${social.color} hover:brightness-110 transition-all font-black uppercase tracking-tighter italic`}
                    >
                      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d={social.icon}/></svg>
                      {social.name}
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="card-premium dark:bg-gray-900 group">
              <CardContent className="p-8">
                <h3 className="text-xl font-black text-gray-950 dark:text-white uppercase tracking-tighter mb-6">{t('responseTitle')}</h3>
                <div className="space-y-4">
                  <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20 px-4 py-2 font-black uppercase tracking-tighter italic w-fit">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    {t('responseTime')}
                  </Badge>
                  <p className="text-lg text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                    {t('responseNote')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Map Placeholder */}
        <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}>
          <Card className="card-premium dark:bg-gray-950 group border-0 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-gray via-orange to-green" />
            <CardContent className="p-8 sm:p-12 text-center">
              <motion.div
                whileHover={{ scale: 1.1, rotate: -5 }}
                className="w-16 h-16 rounded-2xl bg-primary/10 text-primary dark:text-primary-300 flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform"
              >
                <MapPin className="w-8 h-8" />
              </motion.div>
              <h3 className="text-3xl sm:text-4xl font-black text-gray-950 dark:text-white mb-4 tracking-tighter uppercase italic">{t('mapTitle')}</h3>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 font-medium max-w-2xl mx-auto">{t('mapDescription')}</p>
              <motion.div whileHover={{ scale: 1.02 }} className="rounded-3xl overflow-hidden border-4 border-white dark:border-gray-800 shadow-2xl transition-transform">
                <iframe
                  title="Localização da AKMLeva"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=-8.5%2C40.5%2C-8.0%2C41.0&amp;layer=mapnik&amp;marker=40.75%2C-8.25"
                  className="w-full h-[400px] sm:h-[500px] border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

      </div>
    </div>
  );
}