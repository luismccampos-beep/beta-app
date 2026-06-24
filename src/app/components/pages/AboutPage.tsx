import { useState } from 'react';
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
import { AppHeader } from '../AppHeader';
import { AppFooter } from '../AppFooter';

interface AboutPageProps {
  onBack: () => void;
}

export function AboutPage({ onBack }: AboutPageProps) {
  const t = useTranslations('about');
  const [showCEOModal, setShowCEOModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50 to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors overflow-x-hidden">
      <AppHeader showBack onBack={onBack} />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        {/* Hero Section */}
        <div className="relative mb-8 sm:mb-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-orange-500/10 dark:from-teal-500/5 dark:to-orange-500/5 rounded-2xl sm:rounded-3xl"></div>
          <div className="relative p-6 sm:p-8 md:p-12 text-center">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              {t('pageTitle')}
            </h1>
            <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-teal-600 to-orange-500 mx-auto"></div>
          </div>
        </div>

        {/* Our Story */}
        <section className="mb-8 sm:mb-16">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-teal-600 dark:text-teal-400 flex-shrink-0" />
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{t('ourStoryTitle')}</h2>
          </div>
          <Card className="border-2 border-teal-200 dark:border-teal-700 shadow-xl dark:bg-gray-800 overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                {/* Castle Image */}
                <div className="md:w-2/5 w-full relative min-h-[200px] sm:min-h-[280px] md:min-h-full bg-gradient-to-br from-teal-100 to-orange-100 dark:from-teal-900/30 dark:to-orange-900/30">
                  <img
                    src="/Assets/castelo.png"
                    alt={t('ourStoryTitle')}
                    className="w-full h-full object-cover absolute inset-0"
                    loading="lazy"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                </div>
                {/* Story Text */}
                <div className="md:w-3/5 w-full p-4 sm:p-8 space-y-3 sm:space-y-4">
                  <p className="text-sm sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">{t('ourStory')}</p>
                  <p className="text-sm sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">{t('ourStory2')}</p>
                  <p className="text-sm sm:text-lg font-semibold text-teal-700 dark:text-teal-400">{t('ourStory3')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Where We're From */}
        <section className="mb-8 sm:mb-16">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600 dark:text-orange-400 flex-shrink-0" />
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{t('whereWereFromTitle')}</h2>
          </div>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-8">{t('whereWereFromSubtitle')}</p>

          <Card className="border-2 border-orange-200 dark:border-orange-700 shadow-xl dark:bg-gray-800 overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                {/* Text */}
                <div className="md:w-3/5 w-full p-4 sm:p-8 space-y-3 sm:space-y-4">
                  <p className="text-sm sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">{t('whereWereFromText1')}</p>
                  <p className="text-sm sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">{t('whereWereFromText2')}</p>
                  <p className="text-sm sm:text-lg font-semibold text-orange-700 dark:text-orange-400">{t('whereWereFromText3')}</p>
                </div>
                {/* Castle Image */}
                <div className="md:w-2/5 w-full relative min-h-[200px] sm:min-h-[280px] md:min-h-full bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30">
                  <img
                    src="/Assets/realcastelo.png"
                    alt={t('whereWereFromTitle')}
                    className="w-full h-full object-cover absolute inset-0"
                    loading="lazy"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Leadership */}
        <section className="mb-8 sm:mb-16">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <Users className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600 dark:text-orange-400 flex-shrink-0" />
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{t('leadershipTitle')}</h2>
          </div>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-8">{t('leadershipSubtitle')}</p>

          <Card className="border-2 border-orange-200 dark:border-orange-700 shadow-xl dark:bg-gray-800 max-w-2xl">
            <CardContent className="p-4 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-teal-600 to-orange-500 flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0 overflow-hidden">
                  <img
                    src="/about/luiscampos.webp"
                    alt={t('ceoName')}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 w-full">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1 text-center sm:text-left">{t('ceoName')}</h3>
                  <p className="text-teal-600 dark:text-teal-400 font-semibold mb-3 flex items-center gap-2 justify-center sm:justify-start text-sm sm:text-base">
                    <Briefcase className="w-3 h-3 sm:w-4 sm:h-4" />
                    {t('ceoTitle')}
                  </p>
                  <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-4">{t('ceoBio')}</p>
                  <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                    <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-0 text-xs sm:text-sm">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      {t('ceoAvailable')}
                    </Badge>
                    <button
                      onClick={() => setShowCEOModal(true)}
                      className="text-teal-600 dark:text-teal-400 hover:underline text-xs sm:text-sm font-medium"
                    >
                      {t('ceoLearnMore')} →
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Core Values */}
        <section className="mb-8 sm:mb-16">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <Target className="w-6 h-6 sm:w-8 sm:h-8 text-teal-600 dark:text-teal-400 flex-shrink-0" />
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{t('valuesTitle')}</h2>
          </div>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-8">{t('valuesSubtitle')}</p>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            <Card className="border-2 border-teal-200 dark:border-teal-700 shadow-xl dark:bg-gray-800 hover:scale-105 transition-transform">
              <CardContent className="p-4 sm:p-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-teal-600 to-teal-500 flex items-center justify-center mb-3 sm:mb-4">
                  <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">{t('value1Title')}</h3>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">{t('value1Desc')}</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200 dark:border-green-700 shadow-xl dark:bg-gray-800 hover:scale-105 transition-transform">
              <CardContent className="p-4 sm:p-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-green-600 to-green-500 flex items-center justify-center mb-3 sm:mb-4">
                  <Leaf className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">{t('value2Title')}</h3>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">{t('value2Desc')}</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-200 dark:border-orange-700 shadow-xl dark:bg-gray-800 hover:scale-105 transition-transform sm:col-span-2 md:col-span-1">
              <CardContent className="p-4 sm:p-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-orange-600 to-orange-500 flex items-center justify-center mb-3 sm:mb-4">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">{t('value3Title')}</h3>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">{t('value3Desc')}</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Certifications */}
        <section className="mb-8 sm:mb-16">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <Award className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600 dark:text-orange-400 flex-shrink-0" />
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{t('certificationsTitle')}</h2>
          </div>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-8">{t('certificationsSubtitle')}</p>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            <Card className="border-2 border-blue-200 dark:border-blue-700 shadow-xl dark:bg-gray-800">
              <CardContent className="p-4 sm:p-6">
                <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-0 mb-2 sm:mb-3 text-xs sm:text-sm">
                  {t('cert1Title')}
                </Badge>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2">{t('cert1Name')}</h3>
                <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mb-3 sm:mb-4">{t('cert1Desc')}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-0 text-xs">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                      {t('verified')}
                  </Badge>
                  <Badge className="bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 border-0 text-xs">
                      {t('active')}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200 dark:border-purple-700 shadow-xl dark:bg-gray-800">
              <CardContent className="p-4 sm:p-6">
                <Badge className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 border-0 mb-2 sm:mb-3 text-xs sm:text-sm">
                  {t('cert2Title')}
                </Badge>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2">{t('cert2Name')}</h3>
                <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mb-3 sm:mb-4">{t('cert2Desc')}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-0 text-xs">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                      {t('verified')}
                  </Badge>
                  <Badge className="bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 border-0 text-xs">
                      {t('active')}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-amber-200 dark:border-amber-700 shadow-xl dark:bg-gray-800 sm:col-span-2 md:col-span-1">
              <CardContent className="p-4 sm:p-6">
                <Badge className="bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 border-0 mb-2 sm:mb-3 text-xs sm:text-sm">
                  {t('cert3Title')}
                </Badge>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2">{t('cert3Name')}</h3>
                <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mb-3 sm:mb-4">{t('cert3Desc')}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-0 text-xs">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                      {t('verified')}
                  </Badge>
                  <Badge className="bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 border-0 text-xs">
                      {t('active')}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Strategic Partnerships */}
        <section className="mb-8 sm:mb-16">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <Globe className="w-6 h-6 sm:w-8 sm:h-8 text-teal-600 dark:text-teal-400 flex-shrink-0" />
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{t('partnershipsTitle')}</h2>
          </div>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-8">{t('partnershipsSubtitle')}</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              { name: t('partner1Name'), desc: t('partner1Desc'), img: '/about/partners/gea.png' },
              { name: t('partner2Name'), desc: t('partner2Desc'), img: '/about/partners/iapmei.svg' },
              { name: t('partner3Name'), desc: t('partner3Desc'), img: '/about/partners/sanjotec.png' },
              { name: t('partner4Name'), desc: t('partner4Desc'), img: '/about/partners/turismodeportugal.png' },
              { name: t('partner5Name'), desc: t('partner5Desc'), img: '/about/partners/dgconsulting.png' },
              { name: t('partner6Name'), desc: t('partner6Desc'), img: '/about/partners/startupportugal.svg' }
            ].map((partner, index) => (
              <Card key={index} className="border-2 border-gray-200 dark:border-gray-700 shadow-xl dark:bg-gray-800 hover:border-teal-400 dark:hover:border-teal-500 transition-all">
                <CardContent className="p-4 sm:p-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-teal-600 to-orange-500 flex items-center justify-center text-white font-bold text-base sm:text-lg mb-3 sm:mb-4 overflow-hidden relative">
                    <img
                      src={partner.img}
                      alt={partner.name}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                    {partner.name.substring(0, 2)}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2">{partner.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mb-3 sm:mb-4 line-clamp-3">{partner.desc}</p>
                  <Badge className="bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 border-0 text-xs sm:text-sm">
                    {t('officialPartner')}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="mb-6 sm:mb-8">
          <Card className="border-2 border-orange-200 dark:border-orange-700 shadow-2xl dark:bg-gray-800 overflow-hidden">
            <div className="bg-gradient-to-r from-teal-600 to-orange-500 h-2"></div>
            <CardContent className="p-6 sm:p-8 md:p-12 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">{t('contactTitle')}</h2>
              <p className="text-sm sm:text-lg text-gray-700 dark:text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto">{t('contactSubtitle')}</p>

              <div className="flex flex-col items-center justify-center gap-3 sm:gap-6 mb-6 sm:mb-8">
                <div className="flex items-start gap-2 text-gray-700 dark:text-gray-300 w-full sm:w-auto justify-center">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600 dark:text-teal-400 mt-0.5 flex-shrink-0" />
                  <span className="text-xs sm:text-sm whitespace-pre-line text-left">{t('address')}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                  <a href="tel:+351256372092" className="text-xs sm:text-sm hover:text-teal-600 dark:hover:text-teal-400 transition-colors">+351 256 372 092</a>
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                  <a href="mailto:info@akmleva.com" className="text-xs sm:text-sm hover:text-teal-600 dark:hover:text-teal-400 transition-colors">info@akmleva.com</a>
                </div>
              </div>

              <Button className="bg-gradient-to-r from-teal-600 to-orange-500 hover:from-teal-700 hover:to-orange-600 active:scale-[0.98] text-white px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg shadow-lg w-full sm:w-auto transition-transform">
                {t('contactButton')}
              </Button>
            </CardContent>
          </Card>
        </section>

      </div>

      <AppFooter />

      {/* CEO Bio Modal */}
      {showCEOModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => setShowCEOModal(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-t-3xl sm:rounded-2xl max-w-3xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-teal-600 to-orange-500 p-4 sm:p-6 flex items-center justify-between rounded-t-3xl sm:rounded-t-2xl z-10">
              <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <img
                    src="/about/luiscampos.webp"
                    alt={t('ceoName')}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg sm:text-2xl font-bold text-white truncate">{t('ceoBioTitle')}</h2>
                  <p className="text-white/90 text-xs sm:text-sm truncate">{t('ceoName')} - {t('ceoTitle')}</p>
                </div>
              </div>
              <button
                onClick={() => setShowCEOModal(false)}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 hover:bg-white/30 active:bg-white/40 flex items-center justify-center text-white transition-colors flex-shrink-0 ml-2"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-8 space-y-5 sm:space-y-6">
              {/* Section 1 */}
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-teal-600 to-teal-500 flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <h3 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{t('ceoBioSection1Title')}</h3>
                </div>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                  {t('ceoBioSection1')}
                </p>
              </div>

              {/* Section 2 */}
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <h3 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{t('ceoBioSection2Title')}</h3>
                </div>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                  {t('ceoBioSection2')}
                </p>
              </div>

              {/* Section 3 */}
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-purple-600 to-purple-500 flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <h3 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{t('ceoBioSection3Title')}</h3>
                </div>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                  {t('ceoBioSection3')}
                </p>
              </div>

              {/* Section 4 */}
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-orange-600 to-orange-500 flex items-center justify-center flex-shrink-0">
                    <Rocket className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <h3 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{t('ceoBioSection4Title')}</h3>
                </div>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                  {t('ceoBioSection4')}
                </p>
              </div>

              {/* Contact Button */}
              <div className="pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button
                  onClick={() => setShowCEOModal(false)}
                  className="w-full bg-gradient-to-r from-teal-600 to-orange-500 hover:from-teal-700 hover:to-orange-600 active:scale-[0.98] text-white py-4 sm:py-6 text-base sm:text-lg shadow-lg transition-transform"
                >
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  {t('contactCTA')}
                </Button>
              </div>

              {/* Mobile Safe Area */}
              <div className="h-4 sm:hidden" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}