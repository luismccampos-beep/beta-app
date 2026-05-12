import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { useLocale, useTranslations } from 'next-intl';
import {
  ArrowLeft,
  Languages,
  Moon,
  Sun,
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageSquare,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  CheckCircle2
} from 'lucide-react';

interface ContactPageProps {
  onBack: () => void;
}

export function ContactPage({ onBack }: ContactPageProps) {
  const locale = useLocale();
  const t = useTranslations('contact');
  const [isDark, setIsDark] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
  const setLocale = (nextLocale: string) => {
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50 to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors">
      {/* Header */}
      <header className="sticky top-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="text-xl font-bold bg-gradient-to-r from-teal-700 via-teal-600 to-orange-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
            >
              AKMLEVA
            </button>

            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <button
                onClick={() => setIsDark(!isDark)}
                className="p-2 rounded-lg border border-teal-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-teal-50 dark:hover:bg-gray-700 transition-colors"
                title={isDark ? t('header.lightMode') : t('header.darkMode')}
              >
                {isDark ? <Sun className="w-4 h-4 text-orange-500" /> : <Moon className="w-4 h-4 text-teal-700" />}
              </button>

              {/* Language Selector */}
              <div className="flex items-center gap-2">
                <Languages className="w-4 h-4 text-teal-700 dark:text-teal-400 hidden sm:block" />
                <div className="inline-flex rounded-lg border border-teal-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-0.5 shadow-sm">
                  {[
                    { code: 'en', label: '🇺🇸' },
                    { code: 'pt', label: '🇵🇹' },
                    { code: 'es', label: '🇪🇸' },
                    { code: 'fr', label: '🇫🇷' }
                  ].map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setLocale(lang.code)}
                      className={`px-2.5 py-1 text-sm font-medium rounded-md transition-all ${
                        locale === lang.code
                          ? 'bg-gradient-to-r from-teal-600 to-orange-500 text-white shadow-md scale-105'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                variant="outline"
                onClick={onBack}
                size="sm"
                className="gap-2 border-teal-300 dark:border-gray-600 hover:bg-teal-50 dark:hover:bg-gray-700 dark:text-gray-200"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">{t('header.back')}</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        {/* Hero Section */}
        <div className="relative mb-8 sm:mb-12 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-orange-500/10 dark:from-teal-500/5 dark:to-orange-500/5 rounded-2xl sm:rounded-3xl"></div>
          <div className="relative p-6 sm:p-8 md:p-12 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-teal-600 to-orange-500 flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-xl">
              <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              {t('pageTitle')}
            </h1>
            <p className="text-base sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t('pageSubtitle')}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-2 border-teal-200 dark:border-teal-700 shadow-xl dark:bg-gray-800">
              <div className="bg-gradient-to-r from-teal-600 to-orange-500 h-2"></div>
              <CardContent className="p-4 sm:p-8">
                <div className="mb-6">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('formTitle')}</h2>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{t('formSubtitle')}</p>
                </div>

                {isSubmitted ? (
                  <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-xl p-6 sm:p-8 text-center">
                    <CheckCircle2 className="w-12 h-12 sm:w-16 sm:h-16 text-green-600 dark:text-green-400 mx-auto mb-4" />
                    <p className="text-lg sm:text-xl font-semibold text-green-900 dark:text-green-200">{t('submitted')}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t('nameLabel')} *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder={t('namePlaceholder')}
                          className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-teal-500 dark:focus:border-teal-400 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors text-sm sm:text-base"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t('emailLabel')} *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder={t('emailPlaceholder')}
                          className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-teal-500 dark:focus:border-teal-400 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors text-sm sm:text-base"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t('phoneLabel')}
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder={t('phonePlaceholder')}
                          className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-teal-500 dark:focus:border-teal-400 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors text-sm sm:text-base"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t('subjectLabel')} *
                        </label>
                        <select
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-teal-500 dark:focus:border-teal-400 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors text-sm sm:text-base"
                        >
                          <option value="">{t('subjectPlaceholder')}</option>
                          <option value="general">{t('subjectGeneral')}</option>
                          <option value="booking">{t('subjectBooking')}</option>
                          <option value="support">{t('subjectSupport')}</option>
                          <option value="other">{t('subjectOther')}</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('messageLabel')} *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        placeholder={t('messagePlaceholder')}
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-teal-500 dark:focus:border-teal-400 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors resize-none text-sm sm:text-base"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-teal-600 to-orange-500 hover:from-teal-700 hover:to-orange-600 text-white py-4 sm:py-6 text-base sm:text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          {t('submitting')}
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          {t('submitButton')}
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Contact Info Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card className="border-2 border-orange-200 dark:border-orange-700 shadow-xl dark:bg-gray-800">
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">{t('contactInfoTitle')}</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-600 to-teal-500 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">{t('addressTitle')}</p>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        Rua São Nicolau, 9<br />
                        4520-248 Santa Maria da Feira<br />
                        Portugal
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">{t('phoneTitle')}</p>
                      <a href="tel:+351256372092" className="text-xs sm:text-sm text-teal-600 dark:text-teal-400 hover:underline">
                        +351 256 372 092
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-600 to-orange-500 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">{t('emailTitle')}</p>
                      <a href="mailto:info@akmleva.com" className="text-xs sm:text-sm text-teal-600 dark:text-teal-400 hover:underline">
                        info@akmleva.com
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Business Hours */}
            <Card className="border-2 border-teal-200 dark:border-teal-700 shadow-xl dark:bg-gray-800">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-4 sm:mb-6">
                  <Clock className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{t('hoursTitle')}</h3>
                </div>
                <div className="space-y-2 text-sm sm:text-base">
                  <div className="flex justify-between">
                    <span className="text-gray-700 dark:text-gray-300">{t('monday')} - {t('friday')}</span>
                    <span className="font-semibold text-gray-900 dark:text-white">09:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700 dark:text-gray-300">{t('saturday')}</span>
                    <span className="font-semibold text-gray-900 dark:text-white">09:00 - 13:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700 dark:text-gray-300">{t('sunday')}</span>
                    <span className="font-semibold text-red-600 dark:text-red-400">{t('closed')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card className="border-2 border-gray-200 dark:border-gray-700 shadow-xl dark:bg-gray-800">
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4">{t('socialTitle')}</h3>
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors group"
                  >
                    <Facebook className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium text-blue-900 dark:text-blue-300 group-hover:underline">Facebook</span>
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 p-3 bg-pink-50 dark:bg-pink-900/20 hover:bg-pink-100 dark:hover:bg-pink-900/30 rounded-lg transition-colors group"
                  >
                    <Instagram className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                    <span className="text-sm font-medium text-pink-900 dark:text-pink-300 group-hover:underline">Instagram</span>
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors group"
                  >
                    <Linkedin className="w-5 h-5 text-blue-700 dark:text-blue-400" />
                    <span className="text-sm font-medium text-blue-900 dark:text-blue-300 group-hover:underline">LinkedIn</span>
                  </a>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors group"
                  >
                    <Youtube className="w-5 h-5 text-red-600 dark:text-red-400" />
                    <span className="text-sm font-medium text-red-900 dark:text-red-300 group-hover:underline">YouTube</span>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map */}
        <div className="mt-8 sm:mt-12">
          <Card className="border-2 border-gray-200 dark:border-gray-700 shadow-xl dark:bg-gray-800 overflow-hidden">
            <div className="bg-gradient-to-r from-teal-600 to-orange-500 h-2"></div>
            <CardContent className="p-4 sm:p-6">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">{t('mapTitle')}</h3>
              <div className="aspect-video rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3008.8445856844947!2d-8.541649!3d40.928889!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd23761d6f12e085%3A0x500ebbde49051a0!2sR.%20S%C3%A3o%20Nicolau%209%2C%204520-248%20Santa%20Maria%20da%20Feira!5e0!3m2!1spt-PT!2spt!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="AKMLEVA Location"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
