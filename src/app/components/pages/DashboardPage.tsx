import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { useLocale, useTranslations } from 'next-intl';
import {
  ArrowLeft,
  Languages,
  Moon,
  Sun,
  User,
  Plane,
  Calendar,
  MapPin,
  CreditCard,
  Settings,
  Heart,
  Clock,
  CheckCircle2,
  XCircle,
  Edit,
  Save,
  Mail,
  Phone,
  Globe,
  Briefcase,
  Users,
  Palmtree,
  Hotel,
  Utensils,
  Mountain
} from 'lucide-react';

type TabType = 'bookings' | 'history' | 'profile' | 'preferences';

type SavedPreferences = {
  budgetRange?: number[];
  currency?: string;
  preferredDestinations?: string[];
  travelStyles?: string[];
  accommodationType?: string[];
  activityTypes?: string[];
  dietaryRestrictions?: string[];
};

interface DashboardPageProps {
  onBack: () => void;
  onNewBooking?: () => void;
  initialTab?: TabType;
}

interface Booking {
  id: string;
  destination: string;
  dates: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  price: string;
  type: string;
  bookingDate: string;
}

interface TravelHistory {
  id: string;
  destination: string;
  dates: string;
  rating: number;
  type: string;
}

export function DashboardPage({ onBack, onNewBooking, initialTab }: DashboardPageProps) {
  const locale = useLocale();
  const t = useTranslations('dashboard');
  const [isDark, setIsDark] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>(initialTab ?? 'bookings');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [savedPreferences, setSavedPreferences] = useState<SavedPreferences | null>(null);
  const [isLoadingPreferences, setIsLoadingPreferences] = useState(false);
  const [hbAccommodationLabels, setHbAccommodationLabels] = useState<Record<string, string>>({});

  const [profileData, setProfileData] = useState({
    name: 'João Silva',
    email: 'joao.silva@email.com',
    phone: '+351 912 345 678',
    dateOfBirth: '1985-06-15',
    nationality: 'Portuguese',
    passportNumber: 'N1234567',
    address: 'Rua da Liberdade, 123, Santa Maria da Feira'
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    if (activeTab !== 'preferences') return;
    fetch(`/api/travel/catalog?locale=${encodeURIComponent(locale)}`)
      .then(async (res) => {
        const data = (await res.json().catch(() => ({}))) as {
          accommodations?: { code: string; label: string }[];
        };
        if (!res.ok) return;
        const map: Record<string, string> = {};
        for (const row of data.accommodations ?? []) {
          if (row.code && row.label) map[row.code] = row.label;
        }
        setHbAccommodationLabels(map);
      })
      .catch(() => setHbAccommodationLabels({}));
  }, [activeTab, locale]);

  useEffect(() => {
    setIsLoadingPreferences(true);
    fetch('/api/user/preferences', { method: 'GET' })
      .then(async (res) => {
        const data = (await res.json().catch(() => ({}))) as {
          authenticated?: boolean;
          preference?: { aiSettings?: unknown };
        };
        if (!res.ok || data.authenticated === false) return null;
        const prefs = data.preference?.aiSettings;
        return prefs && typeof prefs === 'object' ? (prefs as SavedPreferences) : null;
      })
      .then((prefs) => setSavedPreferences(prefs))
      .catch(() => setSavedPreferences(null))
      .finally(() => setIsLoadingPreferences(false));
  }, []);

  const setLocale = (nextLocale: string) => {
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
    window.location.reload();
  };

  /*
   * Legacy inline translations (migrated to next-intl JSON).
   * Remove once you're happy with the migration.
   */
  /* const content = {
    en: {
      title: 'My Dashboard',
      subtitle: 'Manage your bookings and preferences',
      newBooking: 'New Booking',
      tabBookings: 'My Bookings',
      tabHistory: 'Travel History',
      tabProfile: 'Personal Data',
      tabPreferences: 'Saved Preferences',
      activeBookings: 'Active Bookings',
      noBookings: 'You have no active bookings',
      bookNow: 'Book Now',
      status: 'Status',
      confirmed: 'Confirmed',
      pending: 'Pending',
      cancelled: 'Cancelled',
      bookingDate: 'Booking Date',
      viewDetails: 'View Details',
      cancelBooking: 'Cancel',
      pastTrips: 'Past Trips',
      noHistory: 'No travel history yet',
      rating: 'Rating',
      personalInfo: 'Personal Information',
      editProfile: 'Edit Profile',
      saveProfile: 'Save Changes',
      name: 'Full Name',
      email: 'Email',
      phone: 'Phone',
      dateOfBirth: 'Date of Birth',
      nationality: 'Nationality',
      passportNumber: 'Passport Number',
      address: 'Address',
      travelPreferences: 'Travel Preferences',
      budgetRange: 'Budget Range',
      preferredDestinations: 'Preferred Destinations',
      travelStyle: 'Travel Style',
      accommodation: 'Accommodation Type',
      activities: 'Preferred Activities',
      dietary: 'Dietary Requirements',
      budget: 'Budget',
      moderate: 'Moderate (€1000-€3000)',
      luxury: 'Luxury (€3000+)',
      adventure: 'Adventure',
      relaxation: 'Relaxation',
      cultural: 'Cultural',
      boutique: 'Boutique Hotels',
      resort: 'Beach Resorts',
      hiking: 'Hiking & Nature',
      dining: 'Fine Dining',
      sightseeing: 'Sightseeing',
      vegetarian: 'Vegetarian',
      none: 'None'
    },
    pt: {
      title: 'Meu Painel',
      subtitle: 'Gerir as suas reservas e preferências',
      newBooking: 'Nova Reserva',
      tabBookings: 'Minhas Reservas',
      tabHistory: 'Histórico de Viagens',
      tabProfile: 'Dados Pessoais',
      tabPreferences: 'Preferências Guardadas',
      activeBookings: 'Reservas Ativas',
      noBookings: 'Não tem reservas ativas',
      bookNow: 'Reservar Agora',
      status: 'Estado',
      confirmed: 'Confirmada',
      pending: 'Pendente',
      cancelled: 'Cancelada',
      bookingDate: 'Data da Reserva',
      viewDetails: 'Ver Detalhes',
      cancelBooking: 'Cancelar',
      pastTrips: 'Viagens Anteriores',
      noHistory: 'Ainda sem histórico de viagens',
      rating: 'Avaliação',
      personalInfo: 'Informações Pessoais',
      editProfile: 'Editar Perfil',
      saveProfile: 'Guardar Alterações',
      name: 'Nome Completo',
      email: 'Email',
      phone: 'Telefone',
      dateOfBirth: 'Data de Nascimento',
      nationality: 'Nacionalidade',
      passportNumber: 'Número do Passaporte',
      address: 'Morada',
      travelPreferences: 'Preferências de Viagem',
      budgetRange: 'Orçamento',
      preferredDestinations: 'Destinos Preferidos',
      travelStyle: 'Estilo de Viagem',
      accommodation: 'Tipo de Alojamento',
      activities: 'Atividades Preferidas',
      dietary: 'Requisitos Alimentares',
      budget: 'Orçamento',
      moderate: 'Moderado (€1000-€3000)',
      luxury: 'Luxo (€3000+)',
      adventure: 'Aventura',
      relaxation: 'Relaxamento',
      cultural: 'Cultural',
      boutique: 'Hotéis Boutique',
      resort: 'Resorts de Praia',
      hiking: 'Caminhadas & Natureza',
      dining: 'Gastronomia',
      sightseeing: 'Turismo',
      vegetarian: 'Vegetariano',
      none: 'Nenhum'
    },
    es: {
      title: 'Mi Panel',
      subtitle: 'Gestione sus reservas y preferencias',
      newBooking: 'Nueva Reserva',
      tabBookings: 'Mis Reservas',
      tabHistory: 'Historial de Viajes',
      tabProfile: 'Datos Personales',
      tabPreferences: 'Preferencias Guardadas',
      activeBookings: 'Reservas Activas',
      noBookings: 'No tiene reservas activas',
      bookNow: 'Reservar Ahora',
      status: 'Estado',
      confirmed: 'Confirmada',
      pending: 'Pendiente',
      cancelled: 'Cancelada',
      bookingDate: 'Fecha de Reserva',
      viewDetails: 'Ver Detalles',
      cancelBooking: 'Cancelar',
      pastTrips: 'Viajes Anteriores',
      noHistory: 'Aún sin historial de viajes',
      rating: 'Calificación',
      personalInfo: 'Información Personal',
      editProfile: 'Editar Perfil',
      saveProfile: 'Guardar Cambios',
      name: 'Nombre Completo',
      email: 'Email',
      phone: 'Teléfono',
      dateOfBirth: 'Fecha de Nacimiento',
      nationality: 'Nacionalidad',
      passportNumber: 'Número de Pasaporte',
      address: 'Dirección',
      travelPreferences: 'Preferencias de Viaje',
      budgetRange: 'Presupuesto',
      preferredDestinations: 'Destinos Preferidos',
      travelStyle: 'Estilo de Viaje',
      accommodation: 'Tipo de Alojamiento',
      activities: 'Actividades Preferidas',
      dietary: 'Requisitos Dietéticos',
      budget: 'Presupuesto',
      moderate: 'Moderado (€1000-€3000)',
      luxury: 'Lujo (€3000+)',
      adventure: 'Aventura',
      relaxation: 'Relajación',
      cultural: 'Cultural',
      boutique: 'Hoteles Boutique',
      resort: 'Resorts de Playa',
      hiking: 'Senderismo y Naturaleza',
      dining: 'Gastronomía',
      sightseeing: 'Turismo',
      vegetarian: 'Vegetariano',
      none: 'Ninguno'
    },
    fr: {
      title: 'Mon Tableau de Bord',
      subtitle: 'Gérez vos réservations et préférences',
      newBooking: 'Nouvelle Réservation',
      tabBookings: 'Mes Réservations',
      tabHistory: 'Historique des Voyages',
      tabProfile: 'Données Personnelles',
      tabPreferences: 'Préférences Enregistrées',
      activeBookings: 'Réservations Actives',
      noBookings: 'Vous n\'avez pas de réservations actives',
      bookNow: 'Réserver Maintenant',
      status: 'Statut',
      confirmed: 'Confirmée',
      pending: 'En attente',
      cancelled: 'Annulée',
      bookingDate: 'Date de Réservation',
      viewDetails: 'Voir les Détails',
      cancelBooking: 'Annuler',
      pastTrips: 'Voyages Précédents',
      noHistory: 'Pas encore d\'historique de voyages',
      rating: 'Évaluation',
      personalInfo: 'Informations Personnelles',
      editProfile: 'Modifier le Profil',
      saveProfile: 'Enregistrer les Modifications',
      name: 'Nom Complet',
      email: 'Email',
      phone: 'Téléphone',
      dateOfBirth: 'Date de Naissance',
      nationality: 'Nationalité',
      passportNumber: 'Numéro de Passeport',
      address: 'Adresse',
      travelPreferences: 'Préférences de Voyage',
      budgetRange: 'Budget',
      preferredDestinations: 'Destinations Préférées',
      travelStyle: 'Style de Voyage',
      accommodation: 'Type d\'Hébergement',
      activities: 'Activités Préférées',
      dietary: 'Exigences Alimentaires',
      budget: 'Budget',
      moderate: 'Modéré (€1000-€3000)',
      luxury: 'Luxe (€3000+)',
      adventure: 'Aventure',
      relaxation: 'Détente',
      cultural: 'Culturel',
      boutique: 'Hôtels Boutique',
      resort: 'Stations Balnéaires',
      hiking: 'Randonnée et Nature',
      dining: 'Gastronomie',
      sightseeing: 'Tourisme',
      vegetarian: 'Végétarien',
      none: 'Aucun'
    }
  };

  const t = content[language]; */

  // Mock data
  const mockBookings: Booking[] = [
    {
      id: '1',
      destination: 'Paris, France',
      dates: '15 May 2026 - 22 May 2026',
      status: 'confirmed',
      price: '€2,450',
      type: 'Package: Flights + Hotel + Tours',
      bookingDate: '10 Apr 2026'
    },
    {
      id: '2',
      destination: 'Tokyo, Japan',
      dates: '10 Jul 2026 - 24 Jul 2026',
      status: 'pending',
      price: '€4,200',
      type: 'Custom Package',
      bookingDate: '25 Apr 2026'
    }
  ];

  const mockHistory: TravelHistory[] = [
    {
      id: '1',
      destination: 'Barcelona, Spain',
      dates: '20 Sep 2025 - 27 Sep 2025',
      rating: 5,
      type: 'City Break'
    },
    {
      id: '2',
      destination: 'Lisbon, Portugal',
      dates: '15 Jun 2025 - 20 Jun 2025',
      rating: 5,
      type: 'Cultural Tour'
    },
    {
      id: '3',
      destination: 'Rome, Italy',
      dates: '10 Mar 2025 - 17 Mar 2025',
      rating: 4,
      type: 'Historical Tour'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-300 dark:border-green-700';
      case 'pending':
        return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-300 dark:border-orange-700';
      case 'cancelled':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-300 dark:border-red-700';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-orange-500' : 'text-gray-300 dark:text-gray-600'}>
        ★
      </span>
    ));
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
              <button
                onClick={() => setIsDark(!isDark)}
                className="p-2 rounded-lg border border-teal-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-teal-50 dark:hover:bg-gray-700 transition-colors"
              >
                {isDark ? <Sun className="w-4 h-4 text-orange-500" /> : <Moon className="w-4 h-4 text-teal-700" />}
              </button>

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
        {/* Hero */}
        <div className="mb-8">
          <div className="flex items-center justify-between gap-4 mb-2">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-teal-600 to-orange-500 flex items-center justify-center shadow-xl">
                <User className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                  {t('title')}
                </h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{t('subtitle')}</p>
              </div>
            </div>
            {onNewBooking && (
              <Button
                onClick={onNewBooking}
                className="bg-gradient-to-r from-teal-600 to-orange-500 hover:from-teal-700 hover:to-orange-600 gap-2 hidden sm:flex"
              >
                <Plane className="w-4 h-4" />
                {t('newBooking')}
              </Button>
            )}
          </div>
          {onNewBooking && (
            <Button
              onClick={onNewBooking}
              className="bg-gradient-to-r from-teal-600 to-orange-500 hover:from-teal-700 hover:to-orange-600 gap-2 w-full sm:hidden mt-4"
            >
              <Plane className="w-4 h-4" />
              {t('newBooking')}
            </Button>
          )}
        </div>

        {/* Tabs */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex gap-2 pb-2 min-w-max sm:min-w-0 border-b border-gray-200 dark:border-gray-700">
            {[
              { id: 'bookings' as TabType, label: t('tabBookings'), icon: Calendar },
              { id: 'history' as TabType, label: t('tabHistory'), icon: Clock },
              { id: 'profile' as TabType, label: t('tabProfile'), icon: User },
              { id: 'preferences' as TabType, label: t('tabPreferences'), icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 sm:px-6 py-3 rounded-t-lg font-medium transition-all flex items-center gap-2 whitespace-nowrap text-sm sm:text-base ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-teal-600 to-orange-500 text-white shadow-lg'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('activeBookings')}</h2>
              {mockBookings.length === 0 ? (
                <Card className="border-2 border-gray-200 dark:border-gray-700 shadow-xl dark:bg-gray-800">
                  <CardContent className="p-12 text-center">
                    <Plane className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">{t('noBookings')}</p>
                    <Button
                      onClick={onNewBooking}
                      className="bg-gradient-to-r from-teal-600 to-orange-500 hover:from-teal-700 hover:to-orange-600"
                    >
                      {t('bookNow')}
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6">
                  {mockBookings.map((booking) => (
                    <Card key={booking.id} className="border-2 border-gray-200 dark:border-gray-700 hover:border-teal-400 dark:hover:border-teal-500 transition-all shadow-lg dark:bg-gray-800">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <MapPin className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                              <CardTitle className="text-xl dark:text-white">{booking.destination}</CardTitle>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <Calendar className="w-4 h-4" />
                              <span>{booking.dates}</span>
                            </div>
                          </div>
                          <Badge className={`gap-1.5 ${getStatusColor(booking.status)}`}>
                            {getStatusIcon(booking.status)}
                            {booking.status === 'confirmed'
                              ? t('confirmed')
                              : booking.status === 'pending'
                                ? t('pending')
                                : t('cancelled')}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">{booking.type}</span>
                          <span className="font-bold text-lg text-teal-700 dark:text-teal-400">{booking.price}</span>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-500">
                          {t('bookingDate')}: {booking.bookingDate}
                        </div>
                        <div className="flex gap-3 pt-2">
                          <Button variant="outline" className="flex-1 border-teal-300 dark:border-gray-600 hover:bg-teal-50 dark:hover:bg-gray-700 dark:text-gray-200">
                            {t('viewDetails')}
                          </Button>
                          {booking.status !== 'cancelled' && (
                            <Button variant="outline" className="border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
                              {t('cancelBooking')}
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('pastTrips')}</h2>
              {mockHistory.length === 0 ? (
                <Card className="border-2 border-gray-200 dark:border-gray-700 shadow-xl dark:bg-gray-800">
                  <CardContent className="p-12 text-center">
                    <Clock className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-lg text-gray-600 dark:text-gray-400">{t('noHistory')}</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockHistory.map((trip) => (
                    <Card key={trip.id} className="border-2 border-gray-200 dark:border-gray-700 hover:border-teal-400 dark:hover:border-teal-500 transition-all shadow-lg dark:bg-gray-800">
                      <CardHeader>
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                          <CardTitle className="text-lg dark:text-white">{trip.destination}</CardTitle>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{trip.dates}</div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Badge variant="outline" className="text-xs">{trip.type}</Badge>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">{t('rating')}:</span>
                          <div className="text-lg">{renderStars(trip.rating)}</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('personalInfo')}</h2>
                <Button
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className={isEditingProfile ? 'bg-gradient-to-r from-teal-600 to-orange-500' : ''}
                  variant={isEditingProfile ? 'default' : 'outline'}
                >
                  {isEditingProfile ? (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {t('saveProfile')}
                    </>
                  ) : (
                    <>
                      <Edit className="w-4 h-4 mr-2" />
                      {t('editProfile')}
                    </>
                  )}
                </Button>
              </div>

              <Card className="border-2 border-gray-200 dark:border-gray-700 shadow-xl dark:bg-gray-800">
                <CardContent className="p-6 sm:p-8">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('name')}
                      </label>
                      <div className="flex items-center gap-2">
                        <User className="w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                          disabled={!isEditingProfile}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-600 dark:disabled:text-gray-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('email')}
                      </label>
                      <div className="flex items-center gap-2">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                          disabled={!isEditingProfile}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-600 dark:disabled:text-gray-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('phone')}
                      </label>
                      <div className="flex items-center gap-2">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          disabled={!isEditingProfile}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-600 dark:disabled:text-gray-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('dateOfBirth')}
                      </label>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <input
                          type="date"
                          value={profileData.dateOfBirth}
                          onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
                          disabled={!isEditingProfile}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-600 dark:disabled:text-gray-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('nationality')}
                      </label>
                      <div className="flex items-center gap-2">
                        <Globe className="w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={profileData.nationality}
                          onChange={(e) => setProfileData({ ...profileData, nationality: e.target.value })}
                          disabled={!isEditingProfile}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-600 dark:disabled:text-gray-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('passportNumber')}
                      </label>
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={profileData.passportNumber}
                          onChange={(e) => setProfileData({ ...profileData, passportNumber: e.target.value })}
                          disabled={!isEditingProfile}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-600 dark:disabled:text-gray-400"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('address')}
                      </label>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={profileData.address}
                          onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                          disabled={!isEditingProfile}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-600 dark:disabled:text-gray-400"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div>
              <div className="flex items-center justify-between gap-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('travelPreferences')}</h2>
                <Button
                  onClick={() => (window.location.href = '/preferences/edit')}
                  className="bg-gradient-to-r from-teal-600 to-orange-500 hover:from-teal-700 hover:to-orange-600"
                  size="sm"
                >
                  Edit preferences
                </Button>
              </div>

              <div className="grid gap-6">
                <Card className="border-2 border-gray-200 dark:border-gray-700 shadow-xl dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 dark:text-white">
                      <Briefcase className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                      {t('budgetRange')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoadingPreferences ? (
                      <Badge variant="outline">Loading…</Badge>
                    ) : savedPreferences?.budgetRange ? (
                      <Badge className="bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 border-teal-300 dark:border-teal-700">
                        {(savedPreferences.currency ?? 'USD')}{' '}
                        {savedPreferences.budgetRange[0]?.toLocaleString?.() ?? savedPreferences.budgetRange[0]} -{' '}
                        {(savedPreferences.currency ?? 'USD')}{' '}
                        {savedPreferences.budgetRange[1]?.toLocaleString?.() ?? savedPreferences.budgetRange[1]}
                      </Badge>
                    ) : (
                      <Badge variant="outline">Not set</Badge>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-2 border-gray-200 dark:border-gray-700 shadow-xl dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 dark:text-white">
                      <MapPin className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                      {t('preferredDestinations')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {isLoadingPreferences ? (
                        <Badge variant="outline">Loading…</Badge>
                      ) : (savedPreferences?.preferredDestinations?.length ?? 0) > 0 ? (
                        savedPreferences!.preferredDestinations!.slice(0, 8).map((d) => (
                          <Badge key={d} variant="outline">
                            {d}
                          </Badge>
                        ))
                      ) : (
                        <Badge variant="outline">Not set</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-gray-200 dark:border-gray-700 shadow-xl dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 dark:text-white">
                      <Palmtree className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                      {t('travelStyle')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {isLoadingPreferences ? (
                        <Badge variant="outline">Loading…</Badge>
                      ) : (savedPreferences?.travelStyles?.length ?? 0) > 0 ? (
                        savedPreferences!.travelStyles!.slice(0, 8).map((s) => (
                          <Badge key={s} variant="outline">
                            {s}
                          </Badge>
                        ))
                      ) : (
                        <Badge variant="outline">Not set</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-gray-200 dark:border-gray-700 shadow-xl dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 dark:text-white">
                      <Hotel className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                      {t('accommodation')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {isLoadingPreferences ? (
                        <Badge variant="outline">Loading…</Badge>
                      ) : (savedPreferences?.accommodationType?.length ?? 0) > 0 ? (
                        savedPreferences!.accommodationType!.slice(0, 8).map((a) => (
                          <Badge key={a} variant="outline">
                            {hbAccommodationLabels[a] ?? a}
                          </Badge>
                        ))
                      ) : (
                        <Badge variant="outline">Not set</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-gray-200 dark:border-gray-700 shadow-xl dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 dark:text-white">
                      <Heart className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                      {t('activities')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {isLoadingPreferences ? (
                        <Badge variant="outline">Loading…</Badge>
                      ) : (savedPreferences?.activityTypes?.length ?? 0) > 0 ? (
                        savedPreferences!.activityTypes!.slice(0, 10).map((a) => (
                          <Badge key={a} variant="outline">
                            {a}
                          </Badge>
                        ))
                      ) : (
                        <Badge variant="outline">Not set</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-gray-200 dark:border-gray-700 shadow-xl dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 dark:text-white">
                      <Utensils className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                      {t('dietary')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {isLoadingPreferences ? (
                        <Badge variant="outline">Loading…</Badge>
                      ) : (savedPreferences?.dietaryRestrictions?.length ?? 0) > 0 ? (
                        savedPreferences!.dietaryRestrictions!.slice(0, 10).map((d) => (
                          <Badge key={d} variant="outline">
                            {d}
                          </Badge>
                        ))
                      ) : (
                        <Badge variant="outline">Not set</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
