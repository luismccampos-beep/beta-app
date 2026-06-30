'use client';

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
import { RippleButton } from '../ui/ripple-button';
import {
  Sparkles,
  Globe,
  Heart,
  MapPin,
  Clock,
  Plane,
  X,
  Check,
  Leaf,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { AppHeader } from '../AppHeader';

import { fadeInUp, staggerContainer } from '../travel/destination-detail/constants/animations';
import { EmptyState } from '../ui/EmptyState';
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

interface ResultsPageProps {
  onLogout: () => void;
  onNavigateToDashboard?: () => void;
}

export function ResultsPage({ onLogout, onNavigateToDashboard }: ResultsPageProps) {
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
  }, [resultsQuery, searchParams, t]);

  useEffect(() => {
    if (results.length === 0) return;
    const maxPrice = Math.max(...results.map((r) => r.price), 500);
    const hi = Math.ceil(maxPrice * 1.15);
    setPriceRange((prev) => [prev[0], Math.max(prev[1], hi)]);
  }, [results]);

  // Apply filters
  useEffect(() => {
    let filtered = [...results];

    if (selectedContinent !== 'All') {
      filtered = filtered.filter(r => r.continent === selectedContinent);
    }
    filtered = filtered.filter(r => r.price >= priceRange[0] && r.price <= priceRange[1]);
    if (selectedDuration !== 'all') {
      const durRange = filterOptions.durations.find(d => d.label === selectedDuration);
      if (durRange) {
        filtered = filtered.filter(r => r.duration >= durRange.min && r.duration <= durRange.max);
      }
    }
    if (sustainableOnly) {
      filtered = filtered.filter(r => r.sustainable);
    }
    switch (sortBy) {
      case 'price-low': filtered.sort((a, b) => a.price - b.price); break;
      case 'price-high': filtered.sort((a, b) => b.price - a.price); break;
      case 'rating': filtered.sort((a, b) => b.rating - a.rating); break;
      case 'duration': filtered.sort((a, b) => a.duration - b.duration); break;
      default: filtered.sort((a, b) => b.aiMatchScore - a.aiMatchScore); break;
    }
    setFilteredResults(filtered);
  }, [results, selectedContinent, priceRange, selectedDuration, sustainableOnly, sortBy]);

  const clearFilters = () => {
    setSelectedContinent('All');
    const hi = results.length > 0 ? Math.ceil(Math.max(...results.map((r) => r.price), 500) * 1.15) : 5000;
    setPriceRange([0, Math.max(5000, hi)]);
    setSelectedDuration('all');
    setSustainableOnly(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50 to-accent-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors">
      <AppHeader showLogout onLogout={onLogout} showDashboard={!!onNavigateToDashboard} onDashboard={onNavigateToDashboard} />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-12 overflow-x-hidden">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 sm:space-y-6 mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 glass dark:bg-gray-800/50 border border-primary-200 dark:border-gray-700 rounded-full px-5 py-2.5 shadow-lg">
            <Sparkles className="w-5 h-5 text-accent animate-pulse" />
            <span className="text-sm font-bold text-primary-900 dark:text-primary-100 uppercase tracking-[0.2em]">{t('aiPoweredResults')}</span>
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-gray-950 dark:text-white leading-[1.1] tracking-tighter text-balance overflow-visible">
            {t('title')}
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed font-medium">
            {t('subtitle')}
          </p>
          {resultsError && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-3 rounded-xl inline-block">
              <p className="text-sm font-bold text-amber-800 dark:text-amber-300">{resultsError}</p>
            </div>
          )}
        </motion.div>

        <div className="mb-12">
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
        </div>

        <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}>
        <Card className="mb-12 glass dark:bg-gray-900/60 border-primary-100/50 dark:border-gray-800 shadow-xl overflow-hidden relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-brand-gray via-orange to-green" />
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-black dark:text-white uppercase tracking-tighter italic">{t('searchOptionsTitle')}</CardTitle>
            <CardDescription className="font-medium">{t('searchOptionsDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
              <div className="space-y-2">
                <Label className="text-sm dark:text-gray-300">{t('tripType')}</Label>
                <Select value={tripType} onValueChange={(v) => patchSearchParams(v === 'oneway' ? { tripType: 'oneway', return: null } : { tripType: 'roundtrip', return: returnParam })}>
                  <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="oneway">{t('tripOneway')}</SelectItem>
                    <SelectItem value="roundtrip">{t('tripRoundtrip')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm dark:text-gray-300">{t('searchMode')}</Label>
                <Select value={['both', 'flights', 'hotels', 'cruises'].includes(mode) ? mode : 'both'} onValueChange={(v) => patchSearchParams({ mode: v })}>
                  <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600"><SelectValue /></SelectTrigger>
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
                <Input type="number" min={1} max={30} defaultValue={nightsParam} key={`nights-${resultsQuery}`} className="dark:bg-gray-700 dark:border-gray-600"
                  onBlur={(e) => { const n = Math.min(30, Math.max(1, parseInt(e.target.value || '3', 10) || 3)); patchSearchParams({ nights: String(n) }); }} />
              </div>
              {tripType === 'roundtrip' && (
                <div className="space-y-2 sm:col-span-2 lg:col-span-2">
                  <Label className="text-sm dark:text-gray-300">{t('returnDate')}</Label>
                  <Input type="date" value={returnParam} className="dark:bg-gray-700 dark:border-gray-600" onChange={(e) => patchSearchParams({ return: e.target.value || null })} />
                  <p className="text-xs text-gray-500 dark:text-gray-400">{t('returnDateHint')}</p>
                </div>
              )}
            </div>          </CardContent>
        </Card>
        </motion.div>
        
        {/* Sidebar + Results layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters sidebar */}
          <div className="w-full lg:w-72 shrink-0">
            <div className="flex flex-wrap gap-2 mb-4">
              <RippleButton type="button" variant="outline" onClick={() => setShowFilters(!showFilters)} magnetic={false} className="gap-2 lg:hidden dark:border-gray-600 dark:text-gray-300">
                <SlidersHorizontal className="w-4 h-4" />
                {t('filters')}
                {(selectedContinent !== 'All' || sustainableOnly || selectedDuration !== 'all') && (
                  <Badge className="ml-1 bg-primary">
                    {[selectedContinent !== 'All', sustainableOnly, selectedDuration !== 'all'].filter(Boolean).length}
                  </Badge>
                )}
              </RippleButton>
              <RippleButton type="button" variant="ghost" onClick={clearFilters} magnetic={false} className="gap-2 text-red-600 dark:text-red-400">
                <X className="w-4 h-4" />
                {t('clearAll')}
              </RippleButton>
            </div>
            {showFilters && (
              <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}>
              <Card className="glass dark:bg-gray-900 shadow-2xl border-primary-100/50 dark:border-gray-800">
                <CardContent className="pt-8">
                  <div className="space-y-8">
                    <div className="space-y-3">
                      <label className="text-sm font-black text-gray-950 dark:text-white uppercase tracking-widest">{t('continent')}</label>
                      <Select value={selectedContinent} onValueChange={setSelectedContinent}>
                        <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700 min-h-12 font-medium"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {filterOptions.continents.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-black text-gray-950 dark:text-white uppercase tracking-widest">{t('duration')}</label>
                      <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                        <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700 min-h-12 font-medium"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Durations</SelectItem>
                          {filterOptions.durations.map(d => <SelectItem key={d.label} value={d.label}>{d.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-4">
                      <label className="text-sm font-black text-gray-950 dark:text-white uppercase tracking-widest">{t('priceRange')}</label>
                      <Slider min={0} max={Math.max(5000, priceRange[1])} step={100} value={priceRange} onValueChange={setPriceRange} className="py-4" />
                      <div className="flex justify-between text-xs font-bold text-primary-900 dark:text-primary-300">
                        <span className="glass px-2 py-1 rounded">{(results[0]?.priceCurrency ?? 'EUR')} {priceRange[0].toLocaleString()}</span>
                        <span className="glass px-2 py-1 rounded">{(results[0]?.priceCurrency ?? 'EUR')} {priceRange[1].toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-black text-gray-950 dark:text-white uppercase tracking-widest">{t('sustainableOnly')}</label>
                      <button type="button" onClick={() => setSustainableOnly(!sustainableOnly)}
                        className={`w-full h-12 rounded-xl border-2 flex items-center justify-center gap-2 transition-all font-bold ${sustainableOnly ? 'border-green-600 bg-green-500/10 text-green-700 dark:text-green-400' : 'border-gray-200 dark:border-gray-800 text-gray-500 hover:border-green-400'}`}>
                        <Leaf className="w-5 h-5" />
                        <span className="uppercase tracking-tighter">{t('sustainableOnly')}</span>
                        {sustainableOnly && <Check className="w-4 h-4 ml-1" />}
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              </motion.div>
            )}
          </div>

          {/* Results area */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2" aria-live="polite">
                <Search className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-semibold">{resultsLoading ? '…' : filteredResults.length}</span> {t('resultsFound')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400 shrink-0">{t('sortBy')}:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-[200px] dark:bg-gray-800 dark:border-gray-600 min-h-10"><SelectValue /></SelectTrigger>
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

            <div id="live-offers" className="mb-4 scroll-mt-24 pt-2 border-t border-primary-100/80 dark:border-gray-700/80">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{t('liveOffersTitle')}</h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">{t('liveOffersSubtitle')}</p>
            </div>

            {resultsLoading && (
              <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8" aria-label="Loading results">
                {Array.from({ length: 6 }).map((_, i) => (
                  <motion.div key={i} variants={fadeInUp} className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden relative">
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent animate-[shimmer_1.5s_infinite] pointer-events-none z-10" />
                    <div className="aspect-[4/3] bg-gray-200 dark:bg-gray-700" />
                    <div className="p-4 space-y-3">
                      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                      <div className="flex items-center gap-2">
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12" />
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                      </div>
                      <div className="flex gap-2">
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16" />
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20" />
                      </div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                      <div className="flex items-center justify-between pt-1">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-24" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {!resultsLoading && (
              <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                {filteredResults.map((result, idx) => {
                  const prefsQ = searchParams.get('prefs');
                  const detailHref = result.destinationSlug
                    ? `${destinationDetailPath(result.destinationSlug, locale)}?rq=${encodeURIComponent(resultsQuery)}${prefsQ ? `&prefs=${encodeURIComponent(prefsQ)}` : ''}`
                    : null;
                  const tipKeys = orderTipSectionsForProfile(result.destinationCard?.dicas, travelPrefs).slice(0, 2);
                  const tipPreviews = tipKeys.map((key) => {
                    const tip = result.destinationCard?.dicas?.[key]?.[0];
                    if (!tip) return null;
                    return { label: tDest(key), text: tip };
                  }).filter(Boolean) as { label: string; text: string }[];
                  const cardLabels = {
                    aiMatch: t('aiMatch'), matchExplain: t('matchExplain'), sustainable: t('sustainable'),
                    reviews: t('reviews'), days: t('days'), cardSummary: t('cardSummary'),
                    cardSee: t('cardSee'), cardDo: t('cardDo'), highlights: t('highlights'),
                    perPerson: t('perPerson'), viewDestination: t('viewDestination'), from: t('from'),
                    showMap: t('showMap'), hideMap: t('hideMap'),
                    accommodationTypes: {
                      hotel: t('accommodationTypes.hotel'),
                      resort: t('accommodationTypes.resort'),
                      apartamento: t('accommodationTypes.apartamento'),
                      guest_house: t('accommodationTypes.guest_house'),
                      hostel: t('accommodationTypes.hostel'),
                      motel: t('accommodationTypes.motel'),
                      pousada: t('accommodationTypes.pousada'),
                      eco_lodge: t('accommodationTypes.eco_lodge'),
                      villa: t('accommodationTypes.villa'),
                      camping: t('accommodationTypes.camping'),
                    },
                  };
                  if (detailHref) {
                    return <motion.div key={result.id} variants={fadeInUp} whileHover={{ y: -3 }} layout><DestinationResultCard result={result} href={detailHref} labels={cardLabels} tipPreviews={tipPreviews} /></motion.div>;
                  }
                  return (
                    <motion.div key={result.id} variants={fadeInUp} whileHover={{ y: -3 }} layout>
                    <Card className="group relative overflow-hidden border-0 bg-white dark:bg-gray-800 shadow-md hover:shadow-xl ring-1 ring-gray-200/60 dark:ring-gray-700/60 transition-all duration-300">
                      {/* Hero image */}
                      <div className="relative aspect-video overflow-hidden">
                        <img src={result.imageUrl} alt={result.destination} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute top-3 right-3">
                          <Badge className="border-0 bg-black/60 backdrop-blur-sm text-white text-xs shadow-sm" title={t('matchExplain')}>
                            <Sparkles className="mr-1 h-3 w-3 text-accent-500" />{result.aiMatchScore}% {t('aiMatch')}
                          </Badge>
                        </div>
                        {result.sustainable && (
                          <div className="absolute top-3 left-3">
                            <Badge className="border-0 bg-emerald-500/90 backdrop-blur-sm text-white text-xs shadow-sm">
                              <Leaf className="mr-1 h-3 w-3" />{t('sustainable')}
                            </Badge>
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="text-xl font-bold leading-tight text-white drop-shadow-md">{result.destination}</h3>
                          <p className="mt-1 flex items-center gap-1 text-sm text-white/85">
                            <MapPin className="h-3.5 w-3.5 shrink-0" />{result.country}, {result.continent}
                          </p>
                        </div>
                      </div>

                      {/* Meta row */}
                      <div className="flex items-center gap-x-4 gap-y-1 px-4 pt-3 pb-1 text-xs text-gray-500 dark:text-gray-400 flex-wrap">
                        {result.airport && <DestinationAirportBadge airport={result.airport} />}
                      </div>

                      {/* Price + CTA */}
                      <CardContent className="pt-2 pb-4">
                        <div className="flex items-end justify-between gap-3 pt-2 border-t border-gray-100 dark:border-gray-700/60">
                          <div>
                            <p className="text-xs text-gray-400 dark:text-gray-500 leading-none mb-0.5">{t('from')}</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white tabular-nums leading-tight">
                              {result.priceCurrency ?? 'EUR'} {result.price.toLocaleString()}
                              <span className="ml-1 text-xs font-normal text-gray-400 dark:text-gray-500">{t('perPerson')}</span>
                            </p>
                          </div>
                          <span className="text-xs text-primary dark:text-primary-300 font-medium">
                            {t('viewDestination')} →
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}

            {/* Empty state */}
            {!resultsLoading && filteredResults.length === 0 && (
              <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}>
              <Card className="p-12 text-center dark:bg-gray-800 dark:border-gray-700">
                <EmptyState
                  icon={Globe}
                  title={t('noResults')}
                  description={t('noResultsDesc')}
                  action={<Button type="button" onClick={clearFilters} className="bg-gradient-to-r from-primary to-accent">{t('clearFilters')}</Button>}
                />
              </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}