import { useState, useEffect, useMemo, useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { addDaysIso, defaultDepartureIso } from '../../../lib/travel/buildResultsQuery';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Slider } from '../ui/slider';
import { useLocale, useTranslations } from 'next-intl';
import {
  Sparkles,
  Globe,
  Shield,
  TrendingUp,
  Heart,
  MapPin,
  Clock,
  Star,
  Plane,
  Hotel,
  Ship,
  ExternalLink,
  Award,
  Filter,
  X,
  Check,
  Leaf,
  ArrowRight,
  Languages,
  Moon,
  Sun,
  DollarSign,
  Users,
  Calendar,
  LogOut,
} from 'lucide-react';
import { filterOptions, TravelResult } from '../data/mockResults';
import { DestinationResultCard } from '../travel/DestinationResultCard';
import { DestinationAirportBadge } from '../travel/DestinationAirportBadge';
import { RecommendationsSection } from '../travel/RecommendationsSection';
import { destinationDetailPath } from '../../../lib/travel/destination-path';
import { orderTipSectionsForProfile } from '../../../lib/travel/destination-tips';
import {
  decodeTravelPreferencesCompact,
  encodeTravelPreferencesCompact,
  readStoredTravelPreferences,
} from '../../../lib/travel/travel-preferences-query';

type Language = 'en' | 'pt' | 'es' | 'fr';

interface ResultsTranslations {
  [key: string]: {
    en: string;
    pt: string;
    es: string;
    fr: string;
  };
}

// Legacy inline translations (migrated into `src/messages/{locale}.json`).
// Kept temporarily to avoid a massive diff; safe to delete later.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const translations: ResultsTranslations = {
  title: {
    en: 'Your Personalized Travel Recommendations',
    pt: 'Suas Recomendações de Viagem Personalizadas',
    es: 'Tus Recomendaciones de Viaje Personalizadas',
    fr: 'Vos Recommandations de Voyage Personnalisées'
  },
  subtitle: {
    en: 'AI-curated destinations based on your preferences',
    pt: 'Destinos selecionados por IA com base em suas preferências',
    es: 'Destinos seleccionados por IA según tus preferencias',
    fr: 'Destinations sélectionnées par IA selon vos préférences'
  },
  resultsFound: {
    en: 'results found',
    pt: 'resultados encontrados',
    es: 'resultados encontrados',
    fr: 'résultats trouvés'
  },
  sortBy: {
    en: 'Sort by',
    pt: 'Ordenar por',
    es: 'Ordenar por',
    fr: 'Trier par'
  },
  filters: {
    en: 'Filters',
    pt: 'Filtros',
    es: 'Filtros',
    fr: 'Filtres'
  },
  clearFilters: {
    en: 'Clear All',
    pt: 'Limpar Tudo',
    es: 'Limpiar Todo',
    fr: 'Tout Effacer'
  },
  priceRange: {
    en: 'Price Range',
    pt: 'Faixa de Preço',
    es: 'Rango de Precio',
    fr: 'Fourchette de Prix'
  },
  continent: {
    en: 'Continent',
    pt: 'Continente',
    es: 'Continente',
    fr: 'Continent'
  },
  duration: {
    en: 'Duration',
    pt: 'Duração',
    es: 'Duración',
    fr: 'Durée'
  },
  sustainableOnly: {
    en: 'Sustainable Only',
    pt: 'Apenas Sustentável',
    es: 'Solo Sostenible',
    fr: 'Durable Uniquement'
  },
  aiMatch: {
    en: 'AI Match',
    pt: 'Correspondência IA',
    es: 'Coincidencia IA',
    fr: 'Correspondance IA'
  },
  perPerson: {
    en: 'per person',
    pt: 'por pessoa',
    es: 'por persona',
    fr: 'par personne'
  },
  days: {
    en: 'days',
    pt: 'dias',
    es: 'días',
    fr: 'jours'
  },
  reviews: {
    en: 'reviews',
    pt: 'avaliações',
    es: 'reseñas',
    fr: 'avis'
  },
  viewDetails: {
    en: 'View Details',
    pt: 'Ver Detalhes',
    es: 'Ver Detalles',
    fr: 'Voir Détails'
  },
  bookNow: {
    en: 'Book Now',
    pt: 'Reservar Agora',
    es: 'Reservar Ahora',
    fr: 'Réserver Maintenant'
  },
  highlights: {
    en: 'Highlights',
    pt: 'Destaques',
    es: 'Destacados',
    fr: 'Points Forts'
  },
  bestFor: {
    en: 'Best for',
    pt: 'Melhor para',
    es: 'Mejor para',
    fr: 'Idéal pour'
  },
  sustainable: {
    en: 'Sustainable',
    pt: 'Sustentável',
    es: 'Sostenible',
    fr: 'Durable'
  },
  home: {
    en: 'Home',
    pt: 'Início',
    es: 'Inicio',
    fr: 'Accueil'
  },
  dashboard: {
    en: 'Dashboard',
    pt: 'Painel',
    es: 'Panel',
    fr: 'Tableau de Bord'
  },
  logout: {
    en: 'Logout',
    pt: 'Sair',
    es: 'Cerrar Sesión',
    fr: 'Déconnexion'
  }
};

interface ResultsPageProps {
  onBackToHome: () => void;
  onLogout: () => void;
  onNavigateToLegal?: (pageType: 'terms' | 'privacy' | 'gdpr' | 'cancellations') => void;
  onNavigateToDashboard?: () => void;
}

export function ResultsPage({ onBackToHome, onLogout, onNavigateToLegal, onNavigateToDashboard }: ResultsPageProps) {
  const locale = useLocale();
  const t = useTranslations('results');
  const tDest = useTranslations('destination');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const resultsQuery = useMemo(() => searchParams.toString(), [searchParams]);
  const travelPrefs = useMemo(
    () =>
      decodeTravelPreferencesCompact(searchParams.get('prefs')) ??
      readStoredTravelPreferences(),
    [searchParams],
  );

  const patchSearchParams = useCallback(
    (updates: Record<string, string | null | undefined>) => {
      const p = new URLSearchParams(searchParams.toString());
      for (const [k, v] of Object.entries(updates)) {
        if (v == null || v === '') p.delete(k);
        else p.set(k, v);
      }
      router.replace(`${pathname}?${p.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const handleFocusLiveSearch = useCallback(
    (iata: string) => {
      patchSearchParams({ destinations: iata.toUpperCase(), mode: 'both' });
      requestAnimationFrame(() => {
        document.getElementById('live-offers')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    },
    [patchSearchParams],
  );

  const tripType = (searchParams.get('tripType') ?? 'oneway').toLowerCase() === 'roundtrip' ? 'roundtrip' : 'oneway';
  const mode = (searchParams.get('mode') ?? 'both').toLowerCase();
  const nightsParam = Math.min(30, Math.max(1, parseInt(searchParams.get('nights') ?? '3', 10) || 3));
  const adultsParam = Math.min(9, Math.max(1, parseInt(searchParams.get('adults') ?? '1', 10) || 1));
  const originParam =
    searchParams.get('origin')?.trim().toUpperCase() ||
    process.env.NEXT_PUBLIC_DEFAULT_ORIGIN_IATA?.trim().toUpperCase() ||
    'LIS';
  const departureParam = searchParams.get('departure')?.trim() || defaultDepartureIso(21);
  const isCruiseMode = mode === 'cruises' || mode === 'cruise';
  const defaultReturn = addDaysIso(departureParam, nightsParam);
  const returnParam = searchParams.get('return')?.trim() || defaultReturn;

  const [isDark, setIsDark] = useState(false);
  const [results, setResults] = useState<TravelResult[]>([]);
  const [filteredResults, setFilteredResults] = useState<TravelResult[]>([]);
  const [resultsLoading, setResultsLoading] = useState(true);
  const [resultsError, setResultsError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('ai');
  const [selectedContinent, setSelectedContinent] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedDuration, setSelectedDuration] = useState<string>('all');
  const [sustainableOnly, setSustainableOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setResultsLoading(true);
    setResultsError(null);
    const modeQ = new URLSearchParams(resultsQuery).get('mode') ?? 'both';
    const isCruise = modeQ === 'cruises' || modeQ === 'cruise';
    const base = isCruise ? '/api/travel/cruises' : '/api/travel/results';
    const qs = new URLSearchParams(resultsQuery);
    if (!qs.get('prefs')) {
      const fromUrl = decodeTravelPreferencesCompact(searchParams.get('prefs'));
      const stored = readStoredTravelPreferences();
      const compact = fromUrl ?? stored;
      if (compact && !isCruise) {
        const enc = encodeTravelPreferencesCompact(compact);
        if (enc.length <= 1800) qs.set('prefs', enc);
      }
    }
    const query = qs.toString();
    const url = query ? `${base}?${query}` : base;
    fetch(url)
      .then(async (res) => {
        const data = (await res.json().catch(() => ({}))) as {
          ok?: boolean;
          message?: string;
          results?: TravelResult[];
        };
        if (!res.ok) {
          throw new Error(data.message || `Search failed (${res.status})`);
        }
        return data.results ?? [];
      })
      .then((rows) => {
        if (cancelled) return;
        setResults(rows);
        if (rows.length === 0) {
          const modeQ = new URLSearchParams(resultsQuery).get('mode') ?? 'both';
          const m = new URLSearchParams(resultsQuery).get('mode') ?? 'both';
          setResultsError(
            m === 'cruises' || m === 'cruise'
              ? t('noCruiseResults')
              : m === 'hotels'
                ? t('noHotelResults')
                : t('noLiveResults'),
          );
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setResults([]);
          setResultsError(e instanceof Error ? e.message : 'Failed to load results');
        }
      })
      .finally(() => {
        if (!cancelled) setResultsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [resultsQuery, searchParams, t, mode]);

  useEffect(() => {
    if (results.length === 0) return;
    const maxPrice = Math.max(...results.map((r) => r.price), 500);
    const hi = Math.ceil(maxPrice * 1.15);
    setPriceRange((prev) => [prev[0], Math.max(prev[1], hi)]);
  }, [results]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const setLocale = (nextLocale: string) => {
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
    window.location.reload();
  };

  // Apply filters
  useEffect(() => {
    let filtered = [...results];

    // Continent filter
    if (selectedContinent !== 'All') {
      filtered = filtered.filter(r => r.continent === selectedContinent);
    }

    // Price filter
    filtered = filtered.filter(r => r.price >= priceRange[0] && r.price <= priceRange[1]);

    // Duration filter
    if (selectedDuration !== 'all') {
      const durRange = filterOptions.durations.find(d => d.label === selectedDuration);
      if (durRange) {
        filtered = filtered.filter(r => r.duration >= durRange.min && r.duration <= durRange.max);
      }
    }

    // Sustainable filter
    if (sustainableOnly) {
      filtered = filtered.filter(r => r.sustainable);
    }

    // Sort (values align with filterOptions.sortOptions)
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'duration':
        filtered.sort((a, b) => a.duration - b.duration);
        break;
      case 'ai':
      default:
        filtered.sort((a, b) => b.aiMatchScore - a.aiMatchScore);
        break;
    }

    setFilteredResults(filtered);
  }, [results, selectedContinent, priceRange, selectedDuration, sustainableOnly, sortBy]);

  const clearFilters = () => {
    setSelectedContinent('All');
    const hi =
      results.length > 0
        ? Math.ceil(Math.max(...results.map((r) => r.price), 500) * 1.15)
        : 5000;
    setPriceRange([0, Math.max(5000, hi)]);
    setSelectedDuration('all');
    setSustainableOnly(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50 to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors">
      {/* Header */}
      <header className="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={onNavigateToDashboard || onBackToHome}
              className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-teal-700 via-teal-600 to-orange-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity shrink-0"
            >
              AKMLEVA
            </button>

            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              {/* Theme Toggle */}
              <button
                onClick={() => setIsDark(!isDark)}
                className="p-2 rounded-lg border border-teal-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-teal-50 dark:hover:bg-gray-700 transition-colors"
              >
                {isDark ? <Sun className="w-5 h-5 text-orange-500" /> : <Moon className="w-5 h-5 text-teal-700" />}
              </button>

              {/* Language Selector */}
              <div className="flex items-center gap-1 sm:gap-2 min-w-0">
                <Languages className="w-4 h-4 text-teal-700 dark:text-teal-400 hidden sm:block shrink-0" />
                <div className="inline-flex rounded-lg border border-teal-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-0.5 sm:p-1 shadow-sm overflow-x-auto max-w-[9.5rem] sm:max-w-none">
                  {[
                    { code: 'en', label: '🇺🇸' },
                    { code: 'pt', label: '🇵🇹' },
                    { code: 'es', label: '🇪🇸' },
                    { code: 'fr', label: '🇫🇷' }
                  ].map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setLocale(lang.code)}
                      className={`px-2 sm:px-3 py-1.5 text-sm font-medium rounded-md transition-all shrink-0 touch-manipulation ${
                        locale === lang.code
                          ? 'bg-gradient-to-r from-teal-600 to-orange-500 text-white shadow-md'
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
                onClick={onLogout}
                size="sm"
                className="gap-2 text-red-600 dark:text-red-400 border-red-300 dark:border-gray-600 shrink-0 min-h-10 px-2.5 sm:px-4"
                aria-label={t('logout')}
              >
                <LogOut className="w-4 h-4 sm:hidden" />
                <span className="hidden sm:inline">{t('logout')}</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-12 overflow-x-hidden">
        <div className="text-center space-y-3 sm:space-y-4 mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 border border-teal-200 dark:border-gray-600 rounded-full px-4 py-2 shadow-sm">
            <Sparkles className="w-4 h-4 text-orange-500 animate-pulse" />
            <span className="text-sm font-medium text-teal-900 dark:text-teal-300">{t('aiPoweredResults')}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight px-1">
            {t('title')}
          </h1>

          <p className="text-base sm:text-xl text-gray-600 dark:text-gray-300 px-1">
            {t('subtitle')}
          </p>

          <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Award className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span className="font-semibold">{resultsLoading ? '…' : filteredResults.length}</span> {t('resultsFound')}
          </div>
          {resultsError && (
            <p className="text-sm text-amber-700 dark:text-amber-300 max-w-2xl mx-auto">{resultsError}</p>
          )}
        </div>

        <RecommendationsSection
          preferences={travelPrefs}
          nights={nightsParam}
          travelers={adultsParam}
          originIata={originParam}
          resultsQuery={resultsQuery}
          locale={locale}
          onFocusLiveSearch={handleFocusLiveSearch}
          enabled={!isCruiseMode && !!travelPrefs}
        />

        <Card className="mb-8 border-2 border-teal-100 dark:border-gray-700 dark:bg-gray-800/90 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg dark:text-white">{t('searchOptionsTitle')}</CardTitle>
            <CardDescription>{t('searchOptionsDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
              <div className="space-y-2">
                <Label className="text-sm dark:text-gray-300">{t('tripType')}</Label>
                <Select
                  value={tripType}
                  onValueChange={(v) => {
                    if (v === 'oneway') {
                      patchSearchParams({ tripType: 'oneway', return: null });
                    } else {
                      patchSearchParams({ tripType: 'roundtrip', return: returnParam });
                    }
                  }}
                >
                  <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="oneway">{t('tripOneway')}</SelectItem>
                    <SelectItem value="roundtrip">{t('tripRoundtrip')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm dark:text-gray-300">{t('searchMode')}</Label>
                <Select
                  value={['both', 'flights', 'hotels', 'cruises'].includes(mode) ? mode : 'both'}
                  onValueChange={(v) => patchSearchParams({ mode: v })}
                >
                  <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="both">{t('modeBoth')}</SelectItem>
                    <SelectItem value="flights">{t('modeFlights')}</SelectItem>
                    <SelectItem value="hotels">{t('modeHotels')}</SelectItem>
                    <SelectItem value="cruises">{t('modeCruises')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm dark:text-gray-300">{t('nightsStay')}</Label>
                <Input
                  type="number"
                  min={1}
                  max={30}
                  defaultValue={nightsParam}
                  key={`nights-${resultsQuery}`}
                  className="dark:bg-gray-700 dark:border-gray-600"
                  onBlur={(e) => {
                    const n = Math.min(30, Math.max(1, parseInt(e.target.value || '3', 10) || 3));
                    patchSearchParams({ nights: String(n) });
                  }}
                />
              </div>

              {tripType === 'roundtrip' && (
                <div className="space-y-2 sm:col-span-2 lg:col-span-2">
                  <Label className="text-sm dark:text-gray-300">{t('returnDate')}</Label>
                  <Input
                    type="date"
                    value={returnParam}
                    className="dark:bg-gray-700 dark:border-gray-600"
                    onChange={(e) => patchSearchParams({ return: e.target.value || null })}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">{t('returnDateHint')}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Filters and Sort */}
        <div className="flex flex-col md:flex-row gap-3 sm:gap-4 items-stretch md:items-center justify-between mb-6 sm:mb-8">
          <div className="flex gap-2 flex-wrap w-full md:w-auto">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2 dark:border-gray-600 dark:text-gray-300"
            >
              <Filter className="w-4 h-4" />
              {t('filters')}
              {(selectedContinent !== 'All' || sustainableOnly || selectedDuration !== 'all') && (
                <Badge className="ml-1 bg-teal-600">
                  {[selectedContinent !== 'All', sustainableOnly, selectedDuration !== 'all'].filter(Boolean).length}
                </Badge>
              )}
            </Button>

            {(selectedContinent !== 'All' || sustainableOnly || selectedDuration !== 'all') && (
              <Button variant="ghost" onClick={clearFilters} className="gap-2 text-red-600 dark:text-red-400">
                <X className="w-4 h-4" />
                {t('clearFilters')}
              </Button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full md:w-auto">
            <span className="text-sm text-gray-600 dark:text-gray-400 shrink-0">{t('sortBy')}:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[200px] dark:bg-gray-800 dark:border-gray-600 min-h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {filterOptions.sortOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label[(locale as keyof typeof option.label) ?? 'en'] ?? option.label.en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <Card className="mb-8 border-2 border-teal-200 dark:border-gray-700 dark:bg-gray-800">
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-4 gap-6">
                {/* Continent */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold dark:text-gray-200">{t('continent')}</label>
                  <Select value={selectedContinent} onValueChange={setSelectedContinent}>
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {filterOptions.continents.map(continent => (
                        <SelectItem key={continent} value={continent}>{continent}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Duration */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold dark:text-gray-200">{t('duration')}</label>
                  <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Durations</SelectItem>
                      {filterOptions.durations.map(dur => (
                        <SelectItem key={dur.label} value={dur.label}>{dur.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold dark:text-gray-200">{t('priceRange')}</label>
                  <div className="space-y-2">
                    <Slider
                      min={0}
                      max={Math.max(5000, priceRange[1])}
                      step={100}
                      value={priceRange}
                      onValueChange={setPriceRange}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                      <span>
                        {(results[0]?.priceCurrency ?? 'EUR')} {priceRange[0].toLocaleString()}
                      </span>
                      <span>
                        {(results[0]?.priceCurrency ?? 'EUR')} {priceRange[1].toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sustainable */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold dark:text-gray-200">{t('sustainableOnly')}</label>
                  <button
                    onClick={() => setSustainableOnly(!sustainableOnly)}
                    className={`w-full h-10 rounded-md border-2 transition-all flex items-center justify-center gap-2 ${
                      sustainableOnly
                        ? 'border-green-600 bg-green-50 dark:bg-green-900/20 text-green-900 dark:text-green-300'
                        : 'border-gray-300 dark:border-gray-600 hover:border-green-400 dark:text-gray-300'
                    }`}
                  >
                    <Leaf className="w-4 h-4" />
                    {sustainableOnly && <Check className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div id="live-offers" className="mb-5 sm:mb-6 scroll-mt-[4.5rem] sm:scroll-mt-24 pt-2 border-t border-teal-100/80 dark:border-gray-700/80">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{t('liveOffersTitle')}</h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">{t('liveOffersSubtitle')}</p>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {resultsLoading && (
            <div className="col-span-full text-center py-16 text-gray-600 dark:text-gray-400">
              {(mode === 'cruises' || mode === 'cruise') ? t('loadingCruiseResults') : t('loadingLiveResults')}
            </div>
          )}
          {!resultsLoading &&
            filteredResults.map((result) => {
            const prefsQ = searchParams.get('prefs');
            const detailHref = result.destinationSlug
              ? `${destinationDetailPath(result.destinationSlug, locale)}?rq=${encodeURIComponent(resultsQuery)}${prefsQ ? `&prefs=${encodeURIComponent(prefsQ)}` : ''}`
              : null;
            const tipKeys = orderTipSectionsForProfile(
              result.destinationCard?.dicas,
              travelPrefs,
            ).slice(0, 2);
            const tipPreviews = tipKeys
              .map((key) => {
                const tip = result.destinationCard?.dicas?.[key]?.[0];
                if (!tip) return null;
                return { label: tDest(key), text: tip };
              })
              .filter(Boolean) as { label: string; text: string }[];
            const cardLabels = {
              aiMatch: t('aiMatch'),
              matchExplain: t('matchExplain'),
              sustainable: t('sustainable'),
              reviews: t('reviews'),
              days: t('days'),
              cardSummary: t('cardSummary'),
              cardSee: t('cardSee'),
              cardDo: t('cardDo'),
              highlights: t('highlights'),
              perPerson: t('perPerson'),
              viewDestination: t('viewDestination'),
              from: t('from'),
            };
            if (detailHref) {
              return (
                <DestinationResultCard
                  key={result.id}
                  result={result}
                  href={detailHref}
                  labels={cardLabels}
                  tipPreviews={tipPreviews}
                />
              );
            }
            return (
            <Card key={result.id} className="border-2 border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:hover:border-teal-600 transition-all hover:shadow-2xl group overflow-hidden dark:bg-gray-800">
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={result.imageUrl}
                  alt={result.destination}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 flex flex-wrap gap-2 justify-end max-w-[70%]">
                  {result.airport && <DestinationAirportBadge airport={result.airport} />}
                  <Badge
                    className="bg-gradient-to-r from-teal-600 to-orange-500 text-white border-0"
                    title={t('matchExplain')}
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    {result.aiMatchScore}% {t('aiMatch')}
                  </Badge>
                </div>
                {result.sustainable && (
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-green-600 text-white border-0">
                      <Leaf className="w-3 h-3 mr-1" />
                      {t('sustainable')}
                    </Badge>
                  </div>
                )}
              </div>

              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl dark:text-white">{result.destination}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1 dark:text-gray-400">
                      <MapPin className="w-4 h-4" />
                      {result.country}, {result.continent}
                    </CardDescription>
                  </div>
                  <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <Heart className="w-5 h-5 text-gray-400 hover:text-red-500 dark:text-gray-500" />
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500 shrink-0" />
                    <span className="font-bold dark:text-white">{result.rating}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">({result.reviews} {t('reviews')})</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4 shrink-0" />
                    {result.duration} {t('days')}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {result.destinationCard?.resumo ? (
                  <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                    <div>
                      <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        {t('cardSummary')}
                      </p>
                      <p className="line-clamp-3">{result.destinationCard.resumo}</p>
                    </div>
                    {result.destinationCard.veja && result.destinationCard.veja.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                          {t('cardSee')}
                        </p>
                        <ul className="list-disc list-inside space-y-0.5 text-xs">
                          {result.destinationCard.veja.map((item) => (
                            <li key={item} className="line-clamp-1">
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {result.destinationCard.faca && result.destinationCard.faca.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                          {t('cardDo')}
                        </p>
                        <ul className="list-disc list-inside space-y-0.5 text-xs">
                          {result.destinationCard.faca.map((item) => (
                            <li key={item} className="line-clamp-1">
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {result.destinationCard.coma && result.destinationCard.coma.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                          {t('cardEat')}
                        </p>
                        <ul className="list-disc list-inside space-y-0.5 text-xs">
                          {result.destinationCard.coma.map((item) => (
                            <li key={item} className="line-clamp-1">
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                    {result.description[(locale as keyof typeof result.description) ?? 'en'] ??
                      result.description.en}
                  </p>
                )}

                {/* Highlights */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">{t('highlights')}:</p>
                  <div className="flex flex-wrap gap-2">
                    {result.highlights.slice(0, 3).map((highlight, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs dark:border-gray-600 dark:text-gray-300">
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Best For */}
                <div className="flex flex-wrap gap-2">
                  {result.bestFor.slice(0, 3).map((tag, idx) => (
                    <Badge key={idx} className="bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 border-0">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Price & CTA */}
                <div className="pt-4 border-t dark:border-gray-700">
                  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-3">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">From</p>
                      <div className="flex flex-wrap items-baseline gap-1">
                        <span className="text-2xl sm:text-3xl font-bold text-teal-700 dark:text-teal-400 tabular-nums">
                          {(result.priceCurrency ?? 'EUR')} {result.price.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{t('perPerson')}</span>
                      </div>
                    </div>
                    <div className="text-left sm:text-right text-xs text-gray-500 dark:text-gray-400">
                      {result.productType === 'cruise' && result.cruise ? (
                        <>
                          <div className="flex items-center justify-end gap-1 mb-1">
                            <Ship className="w-3 h-3" />
                            {result.cruise.shipName}
                          </div>
                          <div className="flex items-center justify-end gap-1">
                            <Award className="w-3 h-3" />
                            {result.cruise.brandName}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-1 mb-1 justify-end">
                            <Plane className="w-3 h-3" />
                            {result.flight.class}
                          </div>
                          <div className="flex items-center gap-1 justify-end">
                            <Hotel className="w-3 h-3" />
                            {result.accommodation.type}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {result.cruise?.link ? (
                      <Button variant="outline" asChild className="gap-2 min-h-11 w-full dark:border-gray-600 dark:text-gray-300 touch-manipulation">
                        <a href={result.cruise.link} target="_blank" rel="noopener noreferrer">
                          {t('viewOnSiloah')}
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    ) : result.sourceUrl ? (
                      <Button variant="outline" asChild className="gap-2 min-h-11 w-full dark:border-gray-600 dark:text-gray-300 touch-manipulation">
                        <a href={result.sourceUrl} target="_blank" rel="noopener noreferrer">
                          {result.destinationCard ? t('viewFullArticle') : t('viewOnWikivoyage')}
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    ) : result.sourceUrl ? (
                      <Button variant="outline" asChild className="gap-2 min-h-11 w-full dark:border-gray-600 dark:text-gray-300 touch-manipulation">
                        <a href={result.sourceUrl} target="_blank" rel="noopener noreferrer">
                          {t('viewDetails')}
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    ) : result.airport?.iata ? (
                      <Button
                        type="button"
                        variant="outline"
                        className="gap-2 min-h-11 w-full dark:border-gray-600 dark:text-gray-300 touch-manipulation"
                        onClick={() => handleFocusLiveSearch(result.airport!.iata!)}
                      >
                        {t('viewDetails')}
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button variant="outline" disabled className="gap-2 min-h-11 w-full dark:border-gray-600 dark:text-gray-300 touch-manipulation">
                        {t('viewDetails')}
                      </Button>
                    )}
                    {result.cruise?.link ? (
                      <Button
                        asChild
                        className="gap-2 min-h-11 w-full bg-gradient-to-r from-teal-600 to-orange-500 hover:from-teal-700 hover:to-orange-600 touch-manipulation"
                      >
                        <a href={result.cruise.link} target="_blank" rel="noopener noreferrer">
                          {t('bookNow')}
                          <ArrowRight className="w-4 h-4" />
                        </a>
                      </Button>
                    ) : result.airport?.iata ? (
                      <Button
                        type="button"
                        className="gap-2 min-h-11 w-full bg-gradient-to-r from-teal-600 to-orange-500 hover:from-teal-700 hover:to-orange-600 touch-manipulation"
                        onClick={() => handleFocusLiveSearch(result.airport!.iata!)}
                      >
                        {t('bookNow')}
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button disabled className="gap-2 min-h-11 w-full bg-gradient-to-r from-teal-600 to-orange-500 touch-manipulation">
                        {t('bookNow')}
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {!resultsLoading && filteredResults.length === 0 && (
          <Card className="p-12 text-center dark:bg-gray-800 dark:border-gray-700">
            <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No results found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Try adjusting your filters to see more options</p>
            <Button onClick={clearFilters} className="bg-gradient-to-r from-teal-600 to-orange-500">
              Clear Filters
            </Button>
          </Card>
        )}
      </div>

      {/* Footer */}
      {onNavigateToLegal && (
        <footer className="bg-gray-900 dark:bg-black text-white py-8 px-4 sm:px-6 lg:px-8 border-t border-gray-800 dark:border-gray-900 transition-colors mt-16">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center gap-6 flex-wrap text-sm mb-4">
              <button
                onClick={() => onNavigateToLegal('terms')}
                className="text-gray-400 hover:text-teal-400 transition-colors"
              >
                Terms of Service
              </button>
              <span className="text-gray-700">•</span>
              <button
                onClick={() => onNavigateToLegal('privacy')}
                className="text-gray-400 hover:text-teal-400 transition-colors"
              >
                Privacy Policy
              </button>
              <span className="text-gray-700">•</span>
              <button
                onClick={() => onNavigateToLegal('gdpr')}
                className="text-gray-400 hover:text-teal-400 transition-colors"
              >
                GDPR Compliance
              </button>
              <span className="text-gray-700">•</span>
              <button
                onClick={() => onNavigateToLegal('cancellations')}
                className="text-gray-400 hover:text-teal-400 transition-colors"
              >
                Cancellation Policy
              </button>
            </div>

            <div className="text-center text-gray-500 dark:text-gray-600 text-sm">
              © 2026 AKMLEVA. All rights reserved.
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
