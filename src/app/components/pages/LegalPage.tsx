import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { useLocale, useTranslations } from 'next-intl';
import { GDPRContent as GDPRContentComponent } from './GDPRContent';
import { CancellationsContent as CancellationsContentComponent } from './CancellationsContent';
import { CookiesContent as CookiesContentComponent } from './CookiesContent';
import {
  Shield,
  Lock,
  FileText,
  XCircle,
  ArrowLeft,
  Languages,
  Moon,
  Sun,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Mail,
  Phone,
  MapPin,
  ArrowUp,
  Cookie
} from 'lucide-react';

type PageType = 'terms' | 'privacy' | 'gdpr' | 'cancellations' | 'cookies';

interface LegalPageProps {
  pageType: PageType;
  onBack: () => void;
}

export function LegalPage({ pageType, onBack }: LegalPageProps) {
  const locale = useLocale();
  const t = useTranslations('legal');
  const [isDark, setIsDark] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
      setShowBackToTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setLocale = (nextLocale: string) => {
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
    window.location.reload();
  };

  const getPageContent = () => {
    switch (pageType) {
      case 'terms':
        return <TermsContent locale={locale} />;
      case 'privacy':
        return <PrivacyContent locale={locale} />;
      case 'gdpr':
        return <GDPRContentComponent />;
      case 'cancellations':
        return <CancellationsContentComponent />;
      case 'cookies':
        return <CookiesContentComponent />;
      default:
        return null;
    }
  };

  const getPageIcon = () => {
    switch (pageType) {
      case 'terms':
        return FileText;
      case 'privacy':
        return Shield;
      case 'gdpr':
        return Lock;
      case 'cancellations':
        return XCircle;
      case 'cookies':
        return Cookie;
      default:
        return FileText;
    }
  };

  const Icon = getPageIcon();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50 to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors">
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-800 z-[60]">
        <div
          className="h-full bg-gradient-to-r from-teal-600 to-orange-500 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

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
                <span className="hidden sm:inline">{t('back')}</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="relative mb-12 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-orange-500/10 dark:from-teal-500/5 dark:to-orange-500/5 rounded-3xl"></div>
          <div className="relative p-8 md:p-12">
            <div className="flex items-start gap-6 mb-6">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-teal-600 to-orange-500 flex items-center justify-center shadow-xl">
                <Icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3">
                  {t(`${pageType}Title`)}
                </h1>
                <div className="flex items-center gap-3 flex-wrap">
                  <Badge className="bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 border-0 px-3 py-1">
                    <Calendar className="w-3 h-3 mr-1" />
                    {t('lastUpdated')}: {t('updateDate')}
                  </Badge>
                  <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-0 px-3 py-1">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    {t('legallyBinding')}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-2 border-gray-200 dark:border-gray-700 shadow-2xl dark:bg-gray-800 overflow-hidden">
              <div className="bg-gradient-to-r from-teal-600 to-orange-500 h-2"></div>
              <CardContent className="p-8 md:p-12">
                <div className="prose prose-lg prose-gray dark:prose-invert max-w-none
                  prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white
                  prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:pb-3 prose-h2:border-b prose-h2:border-teal-200 dark:prose-h2:border-teal-800
                  prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed
                  prose-a:text-teal-600 dark:prose-a:text-teal-400 prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-gray-900 dark:prose-strong:text-white
                  prose-ul:my-4 prose-li:my-2">
                  {getPageContent()}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contact Card */}
            <Card className="border-2 border-teal-200 dark:border-teal-700 bg-gradient-to-br from-teal-50 to-orange-50 dark:from-teal-900/20 dark:to-orange-900/20 shadow-xl sticky top-24">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl dark:text-white">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-600 to-orange-500 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  {t('contactUs')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl backdrop-blur-sm">
                  <p className="font-semibold text-base text-teal-800 dark:text-teal-300 mb-3">
                    {t('sidebar.tagline')}
                  </p>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/80 dark:hover:bg-gray-800/80 transition-colors">
                      <MapPin className="w-4 h-4 text-teal-600 dark:text-teal-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">
                        Santa Maria da Feira<br />
                        R. São Nicolau n.º 9, 4520-248
                      </span>
                    </div>
                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/80 dark:hover:bg-gray-800/80 transition-colors">
                      <Phone className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                      <a href="tel:+351123456789" className="text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                        +351 123 456 789
                      </a>
                    </div>
                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/80 dark:hover:bg-gray-800/80 transition-colors">
                      <Mail className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                      <a href="mailto:legal@akmleva.com" className="text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                        legal@akmleva.com
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Links Card */}
            <Card className="border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg dark:text-white">
                  <FileText className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  {t('quickLinks.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { type: 'terms', icon: FileText, label: t('quickLinks.terms') },
                  { type: 'privacy', icon: Shield, label: t('quickLinks.privacy') },
                  { type: 'gdpr', icon: Lock, label: t('quickLinks.gdpr') },
                  { type: 'cancellations', icon: XCircle, label: t('quickLinks.cancellations') },
                  { type: 'cookies', icon: Cookie, label: t('quickLinks.cookies') }
                ].map((item) => {
                  const ItemIcon = item.icon;
                  const isActive = pageType === item.type;
                  return (
                    <div
                      key={item.type}
                      className={`
                        flex items-center gap-3 p-3 rounded-lg transition-all cursor-pointer
                        ${isActive
                          ? 'bg-gradient-to-r from-teal-600 to-orange-500 text-white shadow-lg'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }
                      `}
                    >
                      <ItemIcon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-teal-600 dark:text-teal-400'}`} />
                      <span className="text-sm font-medium">{item.label}</span>
                      {isActive && <CheckCircle2 className="w-4 h-4 ml-auto" />}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 bg-gray-900 dark:bg-black text-white py-8 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-gray-400 text-sm">
              {t('footerCopyright')}
            </p>
          </div>
        </footer>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-teal-600 to-orange-500 hover:from-teal-700 hover:to-orange-600 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 z-40"
          aria-label={t('backToTop')}
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

// Terms Content Component
function TermsContent({ locale }: { locale: string }) {
  const content = {
    en: (
      <>
        <h2>1. Limitation of Liability</h2>
        <p>Our liability is limited by our role as intermediaries.</p>
        <p>We act in the booking and organization of services provided by third parties.</p>

        <h2>2. Exclusions of Liability</h2>
        <p>AKMLEVA is not responsible for:</p>
        <ul>
          <li>Delays or cancellations by airlines or carriers</li>
          <li>Damage, loss, or mishandling of baggage under the responsibility of third parties</li>
          <li>Force majeure events (natural disasters, political instability, pandemics)</li>
          <li>Refusal of entry into countries due to inadequate traveler documentation</li>
        </ul>

        <h2>3. Client Responsibilities</h2>
        <p>The client is responsible for ensuring they meet all travel requirements.</p>
        <ul>
          <li>Possess valid travel documentation (Passport, Visas, ID Card)</li>
          <li>Meet health and vaccination requirements for destinations</li>
          <li>Provide correct and complete information at the time of booking</li>
          <li>Verify all issued travel documents and immediately report errors</li>
        </ul>

        <h2>4. Company Responsibilities</h2>
        <p>We are committed to providing excellent and transparent service.</p>
        <ul>
          <li>Select trusted suppliers and partners</li>
          <li>Provide clear and accurate information about contracted services</li>
          <li>Provide customer support before, during, and after the trip</li>
          <li>Manage bookings and payments securely and efficiently</li>
        </ul>

        <h2>5. Insurance and Guarantees</h2>
        <p>The safety of our clients is a priority.</p>
        <ul>
          <li>Professional Liability Insurance</li>
          <li>Travel and Tourism Guarantee Fund</li>
          <li>Personal travel insurance options (recommended)</li>
        </ul>
        <p>Our insurance is mediated by certified insurers regulated by the ASF (Supervisory Authority of Insurance and Pension Funds).</p>

        <h2>6. Dispute Resolution</h2>
        <p>We prioritize the amicable resolution of any dispute.</p>
        <ul>
          <li>Initial contact with our customer support service</li>
          <li>Electronic Complaints Book</li>
          <li>Use of Alternative Consumer Dispute Resolution Entities</li>
        </ul>
        <p>For legal matters, Portuguese law applies and the jurisdiction of the company's registered office applies.</p>
      </>
    ),
    pt: (
      <>
        <h2>1. Limitação de Responsabilidade</h2>
        <p>A nossa responsabilidade é limitada pela atuação como intermediários.</p>
        <p>Atuamos na reserva e organização de serviços prestados por terceiros.</p>

        <h2>2. Exclusões de Responsabilidade</h2>
        <p>A AKMLEVA não é responsável por:</p>
        <ul>
          <li>Atrasos ou cancelamentos por parte de companhias aéreas ou transportadoras</li>
          <li>Danos, perdas ou extravios de bagagem sob responsabilidade de terceiros</li>
          <li>Eventos de força maior (catástrofes naturais, instabilidade política, pandemias)</li>
          <li>Recusa de entrada em países por falta de documentação adequada do viajante</li>
        </ul>

        <h2>3. Responsabilidades do Cliente</h2>
        <p>O cliente é responsável por garantir que cumpre todos os requisitos para a viagem.</p>
        <ul>
          <li>Possuir documentação de viagem válida (Passaporte, Vistos, Cartão de Cidadão)</li>
          <li>Cumprir requisitos de saúde e vacinação exigidos pelos destinos</li>
          <li>Fornecer informações corretas e completas no momento da reserva</li>
          <li>Verificar todos os documentos de viagem emitidos e comunicar erros imediatamente</li>
        </ul>

        <h2>4. Responsabilidades da Empresa</h2>
        <p>Comprometemo-nos a prestar um serviço de excelência e transparência.</p>
        <ul>
          <li>Selecionar fornecedores e parceiros de confiança</li>
          <li>Fornecer informações claras e precisas sobre os serviços contratados</li>
          <li>Prestar assistência ao cliente antes, durante e após a viagem</li>
          <li>Gerir reservas e pagamentos de forma segura e eficiente</li>
        </ul>

        <h2>5. Seguros e Garantias</h2>
        <p>A segurança dos nossos clientes é prioritária.</p>
        <ul>
          <li>Seguro de Responsabilidade Civil Profissional</li>
          <li>Fundo de Garantia de Viagens e Turismo</li>
          <li>Opções de seguro de viagem pessoal (recomendado)</li>
        </ul>
        <p>Os nossos seguros são mediados por seguradoras certificadas e reguladas pela ASF.</p>

        <h2>6. Resolução de Litígios</h2>
        <p>Privilegiamos a resolução amigável de qualquer diferendo.</p>
        <ul>
          <li>Contacto inicial com o nosso serviço de apoio ao cliente</li>
          <li>Livro de Reclamações Eletrónico</li>
          <li>Recurso a Entidades de Resolução Alternativa de Litígios de Consumo</li>
        </ul>
        <p>Para questões legais, aplica-se a lei portuguesa e o foro da comarca da sede da empresa.</p>
      </>
    ),
    es: (
      <>
        <h2>1. Limitación de Responsabilidad</h2>
        <p>Nuestra responsabilidad está limitada por nuestro papel como intermediarios.</p>
        <p>Actuamos en la reserva y organización de servicios prestados por terceros.</p>

        <h2>2. Exclusiones de Responsabilidad</h2>
        <p>AKMLEVA no es responsable de:</p>
        <ul>
          <li>Retrasos o cancelaciones por parte de compañías aéreas o transportistas</li>
          <li>Daños, pérdidas o extravíos de equipaje bajo responsabilidad de terceros</li>
          <li>Eventos de fuerza mayor (catástrofes naturales, inestabilidad política, pandemias)</li>
          <li>Rechazo de entrada a países por falta de documentación adecuada del viajero</li>
        </ul>

        <h2>3. Responsabilidades del Cliente</h2>
        <p>El cliente es responsable de garantizar que cumple con todos los requisitos para el viaje.</p>
        <ul>
          <li>Poseer documentación de viaje válida (Pasaporte, Visados, Tarjeta de Identidad)</li>
          <li>Cumplir con los requisitos de salud y vacunación exigidos por los destinos</li>
          <li>Proporcionar información correcta y completa en el momento de la reserva</li>
          <li>Verificar todos los documentos de viaje emitidos y comunicar errores inmediatamente</li>
        </ul>

        <h2>4. Responsabilidades de la Empresa</h2>
        <p>Nos comprometemos a prestar un servicio de excelencia y transparencia.</p>
        <ul>
          <li>Seleccionar proveedores y socios de confianza</li>
          <li>Proporcionar información clara y precisa sobre los servicios contratados</li>
          <li>Prestar asistencia al cliente antes, durante y después del viaje</li>
          <li>Gestionar reservas y pagos de forma segura y eficiente</li>
        </ul>

        <h2>5. Seguros y Garantías</h2>
        <p>La seguridad de nuestros clientes es prioritaria.</p>
        <ul>
          <li>Seguro de Responsabilidad Civil Profesional</li>
          <li>Fondo de Garantía de Viajes y Turismo</li>
          <li>Opciones de seguro de viaje personal (recomendado)</li>
        </ul>
        <p>Nuestros seguros son mediados por aseguradoras certificadas y reguladas por la ASF.</p>

        <h2>6. Resolución de Disputas</h2>
        <p>Privilegiamos la resolución amistosa de cualquier disputa.</p>
        <ul>
          <li>Contacto inicial con nuestro servicio de atención al cliente</li>
          <li>Libro de Reclamaciones Electrónico</li>
          <li>Recurso a Entidades de Resolución Alternativa de Litigios de Consumo</li>
        </ul>
        <p>Para cuestiones legales, se aplica la ley portuguesa y el foro de la sede de la empresa.</p>
      </>
    ),
    fr: (
      <>
        <h2>1. Limitation de Responsabilité</h2>
        <p>Notre responsabilité est limitée par notre rôle d'intermédiaires.</p>
        <p>Nous agissons dans la réservation et l'organisation de services fournis par des tiers.</p>

        <h2>2. Exclusions de Responsabilité</h2>
        <p>AKMLEVA n'est pas responsable de:</p>
        <ul>
          <li>Retards ou annulations de la part des compagnies aériennes ou des transporteurs</li>
          <li>Dommages, pertes ou égarements de bagages sous la responsabilité de tiers</li>
          <li>Événements de force majeure (catastrophes naturelles, instabilité politique, pandémies)</li>
          <li>Refus d'entrée dans les pays en raison d'une documentation inadéquate du voyageur</li>
        </ul>

        <h2>3. Responsabilités du Client</h2>
        <p>Le client est responsable de s'assurer qu'il remplit toutes les exigences de voyage.</p>
        <ul>
          <li>Posséder une documentation de voyage valide (Passeport, Visas, Carte d'identité)</li>
          <li>Respecter les exigences de santé et de vaccination des destinations</li>
          <li>Fournir des informations correctes et complètes au moment de la réservation</li>
          <li>Vérifier tous les documents de voyage émis et signaler immédiatement les erreurs</li>
        </ul>

        <h2>4. Responsabilités de l'Entreprise</h2>
        <p>Nous nous engageons à fournir un service d'excellence et de transparence.</p>
        <ul>
          <li>Sélectionner des fournisseurs et partenaires de confiance</li>
          <li>Fournir des informations claires et précises sur les services contractés</li>
          <li>Fournir une assistance au client avant, pendant et après le voyage</li>
          <li>Gérer les réservations et les paiements de manière sécurisée et efficace</li>
        </ul>

        <h2>5. Assurances et Garanties</h2>
        <p>La sécurité de nos clients est prioritaire.</p>
        <ul>
          <li>Assurance Responsabilité Civile Professionnelle</li>
          <li>Fonds de Garantie Voyages et Tourisme</li>
          <li>Options d'assurance voyage personnelle (recommandé)</li>
        </ul>
        <p>Nos assurances sont médiées par des assureurs certifiés et régulés par l'ASF.</p>

        <h2>6. Résolution des Litiges</h2>
        <p>Nous privilégions la résolution amiable de tout différend.</p>
        <ul>
          <li>Contact initial avec notre service d'assistance client</li>
          <li>Livre de Réclamations Électronique</li>
          <li>Recours aux Entités de Résolution Alternative des Litiges de Consommation</li>
        </ul>
        <p>Pour les questions juridiques, la loi portugaise s'applique ainsi que le for du siège de l'entreprise.</p>
      </>
    )
  };

  return content[(locale as keyof typeof content) ?? 'en'] ?? content.en;
}

// Privacy Content Component
function PrivacyContent({ locale }: { locale: string }) {
  const content = {
    en: (
      <>
        <div className="mb-8 p-6 bg-teal-50 dark:bg-teal-900/20 border-l-4 border-teal-600 rounded-lg">
          <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
            This Privacy Policy describes how we collect, use, and protect your personal information when you use our website and services. By using AKMLEVA, you agree to the collection and use of information in accordance with this policy.
          </p>
        </div>

        <h2>1. Intelligent Collection and Processing</h2>
        <p><strong>Data minimization: we only collect what powers your experience.</strong></p>
        <p>At AKMLEVA, we apply the "Privacy by Design" principle. In 2026, our AI systems process your preferences locally whenever possible, ensuring that your identity remains protected while your itineraries are optimized.</p>
        <ul>
          <li><strong>Biometric/Identity Data:</strong> Only for biometric check-ins (if authorized).</li>
          <li><strong>Contextual Preferences:</strong> Restrictions, travel rhythms, and cultural interests processed by private LLMs.</li>
          <li><strong>Connectivity Data:</strong> Technical metadata to ensure platform resilience on global networks.</li>
        </ul>

        <h2>2. AI Ethics and Algorithms</h2>
        <p><strong>Full control over how algorithms shape your journey.</strong></p>
        <p>We ensure that no automated profiling negatively affects the pricing of your bookings (Ethical Dynamic Pricing). You have the right to request a human review of any itinerary suggested by our AI.</p>

        <h2>3. Cyber Resilience</h2>
        <p><strong>Bank-level security with post-quantum encryption.</strong></p>
        <p>We use advanced security protocols that exceed current European standards, protecting your data against emerging threats through continuous monitoring and end-to-end encryption.</p>

        <h2>4. Changes to This Policy</h2>
        <p>We reserve the right to update this Privacy Policy periodically. When we do:</p>
        <div className="ml-6 space-y-4">
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">For minor changes:</p>
            <ul>
              <li>Update of revision date</li>
              <li>Publication on the website</li>
              <li>No additional notification</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">For significant changes:</p>
            <ul>
              <li>Email notification</li>
              <li>Prominent display on website</li>
              <li>30-day review period</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500 rounded">
          <p className="font-semibold text-orange-900 dark:text-orange-300">Important</p>
          <p className="text-gray-700 dark:text-gray-300">Continued use of our services after changes constitutes acceptance of the revised policy.</p>
        </div>
      </>
    ),
    pt: (
      <>
        <div className="mb-8 p-6 bg-teal-50 dark:bg-teal-900/20 border-l-4 border-teal-600 rounded-lg">
          <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
            Esta Política de Privacidade descreve como recolhemos, utilizamos e protegemos as suas informações pessoais quando utiliza o nosso website e serviços. Ao utilizar a AKMLEVA, concorda com a recolha e uso de informações de acordo com esta política.
          </p>
        </div>

        <h2>1. Recolha e Processamento Inteligente</h2>
        <p><strong>Minimização de dados: recolhemos apenas o que alimenta a sua experiência.</strong></p>
        <p>Na AKMLEVA, aplicamos o princípio da "Privacidade por Design". Em 2026, os nossos sistemas de IA processam as suas preferências localmente sempre que possível, garantindo que a sua identidade permanece protegida enquanto os seus roteiros são otimizados.</p>
        <ul>
          <li><strong>Dados Biométricos/Identidade:</strong> Apenas para check-ins biométricos (se autorizado).</li>
          <li><strong>Preferências Contextuais:</strong> Restrições, ritmos de viagem e interesses culturais processados por LLMs privados.</li>
          <li><strong>Dados de Conectividade:</strong> Metadados técnicos para garantir a resiliência da plataforma em redes globais.</li>
        </ul>

        <h2>2. Ética de IA e Algoritmos</h2>
        <p><strong>Controle total sobre como os algoritmos moldam a sua viagem.</strong></p>
        <p>Garantimos que nenhum perfilamento automatizado afeta negativamente o preço das suas reservas (Preço Dinâmico Ético). Tem o direito de solicitar uma revisão humana de qualquer itinerário sugerido pela nossa IA.</p>

        <h2>3. Resiliência Cibernética</h2>
        <p><strong>Segurança de nível bancário com encriptação pós-quântica.</strong></p>
        <p>Utilizamos protocolos de segurança avançados que excedem as normas europeias atuais, protegendo os seus dados contra ameaças emergentes através de monitorização contínua e encriptação end-to-end.</p>

        <h2>4. Alterações a Esta Política</h2>
        <p>Reservamo-nos o direito de actualizar esta Política de Privacidade periodicamente. Quando o fizermos:</p>
        <div className="ml-6 space-y-4">
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">Para alterações menores:</p>
            <ul>
              <li>Actualização da data de revisão</li>
              <li>Publicação na página web</li>
              <li>Sem notificação adicional</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">Para alterações significativas:</p>
            <ul>
              <li>Notificação por email</li>
              <li>Destaque no website</li>
              <li>Período de 30 dias para revisão</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500 rounded">
          <p className="font-semibold text-orange-900 dark:text-orange-300">Importante</p>
          <p className="text-gray-700 dark:text-gray-300">A continuação da utilização dos nossos serviços após as alterações constitui aceitação da política revista.</p>
        </div>
      </>
    ),
    es: (
      <>
        <div className="mb-8 p-6 bg-teal-50 dark:bg-teal-900/20 border-l-4 border-teal-600 rounded-lg">
          <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
            Esta Política de Privacidad describe cómo recopilamos, utilizamos y protegemos su información personal cuando utiliza nuestro sitio web y servicios. Al utilizar AKMLEVA, acepta la recopilación y el uso de información de acuerdo con esta política.
          </p>
        </div>

        <h2>1. Recopilación y Procesamiento Inteligente</h2>
        <p><strong>Minimización de datos: solo recopilamos lo que impulsa su experiencia.</strong></p>
        <p>En AKMLEVA, aplicamos el principio de "Privacidad por Diseño". En 2026, nuestros sistemas de IA procesan sus preferencias localmente siempre que sea posible, garantizando que su identidad permanezca protegida mientras sus itinerarios se optimizan.</p>
        <ul>
          <li><strong>Datos Biométricos/Identidad:</strong> Solo para check-ins biométricos (si está autorizado).</li>
          <li><strong>Preferencias Contextuales:</strong> Restricciones, ritmos de viaje e intereses culturales procesados por LLMs privados.</li>
          <li><strong>Datos de Conectividad:</strong> Metadatos técnicos para garantizar la resiliencia de la plataforma en redes globales.</li>
        </ul>

        <h2>2. Ética de IA y Algoritmos</h2>
        <p><strong>Control total sobre cómo los algoritmos dan forma a su viaje.</strong></p>
        <p>Garantizamos que ningún perfilado automatizado afecte negativamente el precio de sus reservas (Precio Dinámico Ético). Tiene derecho a solicitar una revisión humana de cualquier itinerario sugerido por nuestra IA.</p>

        <h2>3. Resiliencia Cibernética</h2>
        <p><strong>Seguridad de nivel bancario con encriptación post-cuántica.</strong></p>
        <p>Utilizamos protocolos de seguridad avanzados que superan los estándares europeos actuales, protegiendo sus datos contra amenazas emergentes mediante monitoreo continuo y encriptación end-to-end.</p>

        <h2>4. Cambios a Esta Política</h2>
        <p>Nos reservamos el derecho de actualizar esta Política de Privacidad periódicamente. Cuando lo hagamos:</p>
        <div className="ml-6 space-y-4">
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">Para cambios menores:</p>
            <ul>
              <li>Actualización de la fecha de revisión</li>
              <li>Publicación en el sitio web</li>
              <li>Sin notificación adicional</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">Para cambios significativos:</p>
            <ul>
              <li>Notificación por correo electrónico</li>
              <li>Destacado en el sitio web</li>
              <li>Período de revisión de 30 días</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500 rounded">
          <p className="font-semibold text-orange-900 dark:text-orange-300">Importante</p>
          <p className="text-gray-700 dark:text-gray-300">El uso continuado de nuestros servicios después de los cambios constituye la aceptación de la política revisada.</p>
        </div>
      </>
    ),
    fr: (
      <>
        <div className="mb-8 p-6 bg-teal-50 dark:bg-teal-900/20 border-l-4 border-teal-600 rounded-lg">
          <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
            Cette Politique de Confidentialité décrit comment nous collectons, utilisons et protégeons vos informations personnelles lorsque vous utilisez notre site Web et nos services. En utilisant AKMLEVA, vous acceptez la collecte et l'utilisation des informations conformément à cette politique.
          </p>
        </div>

        <h2>1. Collecte et Traitement Intelligent</h2>
        <p><strong>Minimisation des données: nous collectons uniquement ce qui alimente votre expérience.</strong></p>
        <p>Chez AKMLEVA, nous appliquons le principe de "Confidentialité dès la Conception". En 2026, nos systèmes d'IA traitent vos préférences localement autant que possible, garantissant que votre identité reste protégée pendant que vos itinéraires sont optimisés.</p>
        <ul>
          <li><strong>Données Biométriques/Identité:</strong> Uniquement pour les enregistrements biométriques (si autorisé).</li>
          <li><strong>Préférences Contextuelles:</strong> Restrictions, rythmes de voyage et intérêts culturels traités par des LLM privés.</li>
          <li><strong>Données de Connectivité:</strong> Métadonnées techniques pour garantir la résilience de la plateforme sur les réseaux mondiaux.</li>
        </ul>

        <h2>2. Éthique de l'IA et Algorithmes</h2>
        <p><strong>Contrôle total sur la façon dont les algorithmes façonnent votre voyage.</strong></p>
        <p>Nous garantissons qu'aucun profilage automatisé n'affecte négativement le prix de vos réservations (Tarification Dynamique Éthique). Vous avez le droit de demander une révision humaine de tout itinéraire suggéré par notre IA.</p>

        <h2>3. Résilience Cybernétique</h2>
        <p><strong>Sécurité de niveau bancaire avec cryptage post-quantique.</strong></p>
        <p>Nous utilisons des protocoles de sécurité avancés qui dépassent les normes européennes actuelles, protégeant vos données contre les menaces émergentes grâce à une surveillance continue et au cryptage de bout en bout.</p>

        <h2>4. Modifications de Cette Politique</h2>
        <p>Nous nous réservons le droit de mettre à jour cette Politique de Confidentialité périodiquement. Lorsque nous le faisons:</p>
        <div className="ml-6 space-y-4">
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">Pour les modifications mineures:</p>
            <ul>
              <li>Mise à jour de la date de révision</li>
              <li>Publication sur le site Web</li>
              <li>Aucune notification supplémentaire</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">Pour les modifications importantes:</p>
            <ul>
              <li>Notification par e-mail</li>
              <li>Mise en évidence sur le site Web</li>
              <li>Période de révision de 30 jours</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500 rounded">
          <p className="font-semibold text-orange-900 dark:text-orange-300">Important</p>
          <p className="text-gray-700 dark:text-gray-300">L'utilisation continue de nos services après les modifications constitue l'acceptation de la politique révisée.</p>
        </div>
      </>
    )
  };

  return content[(locale as keyof typeof content) ?? 'en'] ?? content.en;
}

// Note: GDPR/Cookies/Cancellations content components are rendered directly.

/*
const translations: { [key: string]: { en: string; pt: string; es: string; fr: string } } = {
  back: {
    en: 'Back',
    pt: 'Voltar',
    es: 'Volver',
    fr: 'Retour'
  },
  termsTitle: {
    en: 'Terms of Service',
    pt: 'Termos de Serviço',
    es: 'Términos de Servicio',
    fr: 'Conditions d\'Utilisation'
  },
  privacyTitle: {
    en: 'Privacy Policy',
    pt: 'Política de Privacidade',
    es: 'Política de Privacidad',
    fr: 'Politique de Confidentialité'
  },
  gdprTitle: {
    en: 'GDPR Compliance',
    pt: 'Conformidade GDPR',
    es: 'Cumplimiento GDPR',
    fr: 'Conformité RGPD'
  },
  cancellationsTitle: {
    en: 'Cancellation Policy',
    pt: 'Política de Cancelamento',
    es: 'Política de Cancelación',
    fr: 'Politique d\'Annulation'
  },
  cookiesTitle: {
    en: 'Cookies Policy',
    pt: 'Política de Cookies',
    es: 'Política de Cookies',
    fr: 'Politique de Cookies'
  },
  lastUpdated: {
    en: 'Last Updated',
    pt: 'Última Atualização',
    es: 'Última Actualización',
    fr: 'Dernière Mise à Jour'
  },
  updateDate: {
    en: 'April 28, 2026',
    pt: '28 de Abril de 2026',
    es: '28 de Abril de 2026',
    fr: '28 Avril 2026'
  },
  contactUs: {
    en: 'Contact Us',
    pt: 'Entre em Contato',
    es: 'Contáctanos',
    fr: 'Contactez-Nous'
  }
};
*/
