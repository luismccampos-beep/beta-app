import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { generatePageHead } from '@/lib/seo'
import { createTranslationsHook } from '@/lib/i18n-provider'
import { fadeInUp, staggerContainer } from '@/lib/animations'
import {
  MapPin, Phone, Mail, Clock, Send, MessageSquare,
  CheckCircle2
} from 'lucide-react'
import { H1, H3, H5, H6 } from '@/components/ui/typography'
import { Spinner } from '@/components/ui/spinner'

const useT = createTranslationsHook('contact')

export const Route = createFileRoute('/contact')({
  head: () => generatePageHead({
    title: 'Contacto',
    description: 'Entre em contacto com a equipa AKMLEVA.',
    path: '/contact',
  }),
  component: ContactPage,
})

function ContactPage() {
  const t = useT()
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!res.ok) throw new Error(t('sendError'))
      setIsSubmitted(true)
    } catch {
      setError(t('errorMessage'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const infoCards = [
    { icon: MapPin, title: t('addressTitle'), value: t('address'), href: null, gradient: 'from-primary to-primary-700' },
    { icon: Phone, title: t('phoneTitle'), value: '+351 256 372 092', href: 'tel:+351256372092', gradient: 'from-accent to-accent-700' },
    { icon: Mail, title: t('emailTitle'), value: 'geral@akmleva.pt', href: 'mailto:geral@akmleva.pt', gradient: 'from-orange to-orange-700' },
    { icon: Clock, title: t('hoursTitle'), value: t('hours'), href: null, gradient: 'from-green to-green-700' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50 to-accent-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-primary-200/20 dark:bg-primary-500/5 blur-[120px]" />
        <div className="absolute -bottom-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-accent-200/20 dark:bg-accent-500/5 blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 relative z-10">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-gray-800/50 border border-primary-200 dark:border-gray-700 rounded-full px-5 py-2.5 shadow-lg mb-6 backdrop-blur-sm">
            <MessageSquare className="w-5 h-5 text-primary animate-pulse" />
            <span className="text-sm font-bold text-primary-800 dark:text-primary-200 uppercase tracking-[0.2em]">{t('pageTitle')}</span>
          </div>
          <H1 headingColor="default" className="uppercase mb-4">
            {t('heroTitle')} <span className="bg-gradient-to-r from-primary via-accent to-orange bg-clip-text text-transparent">{t('heroHighlight')}</span> {t('heroTitleEnd')}
          </H1>
          <p className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">{t('pageSubtitle')}</p>
        </motion.div>

        {/* Contact Info Cards */}
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {infoCards.map((card, i) => (
            <motion.div key={i} variants={fadeInUp} whileHover={{ y: -4 }}>
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 text-center shadow-lg hover:shadow-xl transition-shadow h-full">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mx-auto mb-4 shadow-md`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
                <H6 headingColor="default" className="uppercase tracking-wider mb-2">{card.title}</H6>
                {card.href ? (
                  <a href={card.href} className="text-sm font-bold text-primary dark:text-primary-300 hover:underline">{card.value}</a>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 whitespace-pre-line">{card.value}</p>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Form + Social */}
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Form */}
          <motion.div variants={fadeInUp} className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden relative">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-gray via-orange to-green" />
              <div className="p-8 sm:p-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary dark:text-primary-300">
                    <Send className="w-6 h-6" />
                  </div>
                  <H3 headingColor="default" className="uppercase">{t('formTitle')}</H3>
                </div>

                {isSubmitted ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
                    </div>
                    <H3 headingColor="default" className="mb-3">{t('successTitle')}</H3>
                    <p className="text-gray-500 dark:text-gray-400 mb-8">{t('successMessage')}</p>
                    <button onClick={() => { setIsSubmitted(false); setFormData({ name: '', email: '', phone: '', subject: '', message: '' }) }} className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      {t('sendAnother')}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                      <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 text-sm font-bold text-red-700 dark:text-red-400">{error}</div>
                    )}
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label htmlFor="name" className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">{t('nameLabel')} *</label>
                        <input id="name" name="name" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} required className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:outline-none transition-colors font-medium" placeholder={t('namePlaceholder')} />
                      </div>
                      <div className="space-y-1.5">
                        <label htmlFor="email" className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">{t('emailLabel')} *</label>
                        <input id="email" name="email" type="email" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} required className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:outline-none transition-colors font-medium" placeholder={t('emailPlaceholder')} />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label htmlFor="phone" className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">{t('phoneLabel')}</label>
                        <input id="phone" name="phone" type="tel" value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:outline-none transition-colors font-medium" placeholder={t('phonePlaceholder')} />
                      </div>
                      <div className="space-y-1.5">
                        <label htmlFor="subject" className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">{t('subjectLabel')} *</label>
                        <select id="subject" name="subject" value={formData.subject} onChange={e => setFormData(p => ({ ...p, subject: e.target.value }))} required className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:outline-none transition-colors font-medium cursor-pointer">
                          <option value="">{t('subjectPlaceholder')}</option>
                          <option value="booking">{t('subjectBooking')}</option>
                          <option value="support">{t('subjectSupport')}</option>
                          <option value="partnership">{t('subjectPartnership')}</option>
                          <option value="feedback">{t('subjectFeedback')}</option>
                          <option value="other">{t('subjectOther')}</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="message" className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">{t('messageLabel')} *</label>
                      <textarea id="message" name="message" value={formData.message} onChange={e => setFormData(p => ({ ...p, message: e.target.value }))} required rows={5} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:outline-none transition-colors font-medium resize-none" placeholder={t('messagePlaceholder')} />
                    </div>
                    <button type="submit" disabled={isSubmitting} className="w-full h-14 bg-gradient-to-r from-brand-gray via-orange to-green text-white font-bold rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-lg flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2">
                      {isSubmitting ? (
                        <><Spinner size="sm" />{t('submitting')}</>
                      ) : (
                        <><Send className="w-5 h-5" />{t('sendMessage')}</>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div variants={fadeInUp} className="space-y-6">
            {/* Social */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
              <H5 headingColor="default" className="uppercase tracking-wider mb-4 font-black">{t('socialTitle')}</H5>
              <div className="space-y-3">
                {[
                  { name: 'Facebook', url: 'https://www.facebook.com/profile.php?id=61586650558724', color: 'text-blue-600 bg-blue-50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800' },
                  { name: 'Instagram', url: 'https://www.instagram.com/akmleva.ia', color: 'text-pink-600 bg-pink-50 border-pink-100 dark:bg-pink-900/20 dark:border-pink-800' },
                  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/akmleva-travel-agency-a772373a6/', color: 'text-blue-700 bg-blue-50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800' },
                ].map((social, i) => (
                  <a key={i} href={social.url} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-3 p-3 rounded-xl border ${social.color} font-bold text-sm hover:brightness-95 transition-all`}>
                    {social.name}
                  </a>
                ))}
              </div>
            </div>

            {/* Response Time */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
              <H5 headingColor="default" className="uppercase tracking-wider mb-4 font-black">{t('responseTitle')}</H5>
              <div className="space-y-3">
                <span className="inline-flex items-center gap-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 rounded-full px-3 py-1 text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />{t('responseTime')}
                </span>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{t('responseNote')}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Map */}
        <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden">
            <div className="p-8 sm:p-10 text-center">
              <div className="w-14 h-14 rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary dark:text-primary-300 flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-7 h-7" />
              </div>
              <H3 headingColor="default" className="mb-3">{t('mapTitle')}</H3>
              <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-xl mx-auto">{t('mapDescription')}</p>
              <div className="rounded-2xl overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg">
                <iframe
                  title="Localização da AKMLEVA"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=-8.6%2C40.88%2C-8.5%2C40.92&amp;layer=mapnik&amp;marker=40.8986%2C-8.5499"
                  className="w-full h-[350px] sm:h-[450px] border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
