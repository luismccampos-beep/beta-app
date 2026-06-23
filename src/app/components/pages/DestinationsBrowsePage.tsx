'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Compass,
  Globe,
  Hotel,
  Loader2,
  MapPin,
  Search,
  Sparkles,
  TrendingUp,
  X,
} from 'lucide-react';

import { destinationDetailPath } from '../../../lib/travel/destination-path';
import {
  DestinationBrowseCard,
  type DestinationBrowseItem,
} from '../travel/DestinationBrowseCard';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { AppHeader } from '../AppHeader';
import { AppFooter } from '../AppFooter';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { cn } from '../ui/utils';
import { ACCOMMODATION_ICONS, ACCOMMODATION_COLORS } from '../travel/accommodation-types';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ITEMS_PER_PAGE = 20;
const DEBOUNCE_MS = 300;

/** Well-known famous tourist destinations to show as curated picks. */
const FAMOUS_DESTINATIONS = [
  { key: 'paris', emoji: '🇫🇷', continent: 'Europe' },
  { key: 'tokyo', emoji: '🇯🇵', continent: 'Asia' },
  { key: 'new-york', emoji: '🇺🇸', continent: 'North America' },
  { key: 'rome', emoji: '🇮🇹', continent: 'Europe' },
  { key: 'bali', emoji: '🇮🇩', continent: 'Asia' },
  { key: 'london', emoji: '🇬🇧', continent: 'Europe' },
  { key: 'barcelona', emoji: '🇪🇸', continent: 'Europe' },
  { key: 'dubai', emoji: '🇦🇪', continent: 'Asia' },
  { key: 'sydney', emoji: '🇦🇺', continent: 'Oceania' },
  { key: 'rio-de-janeiro', emoji: '🇧🇷', continent: 'South America' },
  { key: 'lisboa', emoji: '🇵🇹', continent: 'Europe' },
  { key: 'cancun', emoji: '🇲🇽', continent: 'North America' },
  { key: 'marrakech', emoji: '🇲🇦', continent: 'Africa' },
  { key: 'bangkok', emoji: '🇹🇭', continent: 'Asia' },
  { key: 'istanbul', emoji: '🇹🇷', continent: 'Europe' },
  { key: 'cairo', emoji: '🇪🇬', continent: 'Africa' },
];

/** Continent / region chips with emoji and gradient colours. */
const CONTINENT_CHIPS: { value: string; emoji: string; gradient: string }[] = [
  { value: 'Europa', emoji: '🏰', gradient: 'from-blue-500 to-indigo-600' },
  { value: 'Ásia', emoji: '⛩️', gradient: 'from-red-500 to-orange-500' },
  { value: 'América', emoji: '🗽', gradient: 'from-emerald-500 to-teal-600' },
  { value: 'África', emoji: '🌍', gradient: 'from-amber-500 to-yellow-600' },
  { value: 'Oceânia', emoji: '🏝️', gradient: 'from-cyan-500 to-sky-600' },
];

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type CountryOption = { name: string; count: number };

interface DestinationsBrowsePageProps {
  onBack: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function DestinationsBrowsePage({ onBack }: DestinationsBrowsePageProps) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations('destinationsBrowse');

  // ---- state ---------------------------------------------------------------
  const [items, setItems] = useState<DestinationBrowseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  // Filter & pagination state (synced to URL search params)
  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [inputValue, setInputValue] = useState(query);
  const [continentFilter, setContinentFilter] = useState(searchParams.get('continent') ?? '');
  const [countryFilter, setCountryFilter] = useState(searchParams.get('country') ?? '');
  const [hotelTypeFilter, setHotelTypeFilter] = useState<string[]>(
    () => {
      const v = searchParams.get('hotelType');
      return v ? v.split(',').filter(Boolean) : [];
    },
  );
  const [page, setPage] = useState(Number(searchParams.get('page') ?? '1'));

  // Country autocomplete state
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [countryOpen, setCountryOpen] = useState(false);
  const [countriesLoading, setCountriesLoading] = useState(true);

  // Famous destinations
  const [famousItems, setFamousItems] = useState<DestinationBrowseItem[]>([]);
  const [famousLoading, setFamousLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const selectAllCooldown = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ---- data fetching -------------------------------------------------------

  // Fetch countries + continents on mount
  useEffect(() => {
    setCountriesLoading(true);
    fetch('/api/travel/v1/destinations/countries')
      .then((r) => r.json())
      .then((data: { countries?: CountryOption[]; continents?: CountryOption[] }) => {
        if (data.countries?.length) setCountries(data.countries);
      })
      .catch(() => {})
      .finally(() => setCountriesLoading(false));
  }, []);

  // Fetch famous tourist destinations on mount
  useEffect(() => {
    setFamousLoading(true);
    const qp = new URLSearchParams();
    qp.set('limit', '16');
    qp.set('lang', locale);
    fetch(`/api/travel/v1/destinations?${qp.toString()}`)
      .then((r) => r.json())
      .then((data: { items?: DestinationBrowseItem[] }) => {
        const allItems = data.items ?? [];
        if (allItems.length) {
          // Try to put famous ones first, then fill with the rest
          const famous = FAMOUS_DESTINATIONS.map((f) =>
            allItems.find((item: DestinationBrowseItem) => {
              const slug = item.slug?.toLowerCase() ?? '';
              const nome = item.nome?.toLowerCase() ?? '';
              return slug.includes(f.key) || nome.includes(f.key.replace(/-/g, ' '));
            }),
          ).filter(Boolean) as DestinationBrowseItem[];

          // Fill remaining slots
          const famousIds = new Set(famous.map((f) => f.id));
          const remaining = allItems.filter((i: DestinationBrowseItem) => !famousIds.has(i.id));
          setFamousItems([...famous, ...remaining].slice(0, 16));
        }
      })
      .catch(() => {})
      .finally(() => setFamousLoading(false));
  }, [locale]);

  // ---- derived data --------------------------------------------------------

  const continentList: { label: string; value: string }[] = useMemo(() => {
    try {
      return t.raw('continentOptions') as { label: string; value: string }[];
    } catch {
      return CONTINENT_CHIPS.map((c) => ({ label: c.value, value: c.value }));
    }
  }, [t]);

  const getContinentLabel = (value: string) => {
    const found = continentList.find((c) => c.value === value);
    return found?.label ?? value;
  };

  // ---- helpers -------------------------------------------------------------

  const updateUrl = useCallback(
    (p: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(p).forEach(([k, v]) => {
        if (v) params.set(k, v);
        else params.delete(k);
      });
      router.replace(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams],
  );

  const fetchItems = useCallback(
    async (q: string, continent: string, country: string, hotelTypes: string[], p: number) => {
      setLoading(true);
      setError(null);
      try {
        const qp = new URLSearchParams();
        if (q) qp.set('q', q);
        if (continent) qp.set('continent', continent);
        if (country) qp.set('country', country);
        if (hotelTypes.length > 0) qp.set('hotelType', hotelTypes.join(','));
        qp.set('page', String(p));
        qp.set('pageSize', String(ITEMS_PER_PAGE));
        qp.set('locale', locale);
        const res = await fetch(`/api/travel/destinations?${qp.toString()}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as {
          destinations: DestinationBrowseItem[];
          total: number;
        };
        setItems(data.destinations);
        setTotal(data.total);
      } catch {
        setError(t('errorLoading'));
      } finally {
        setLoading(false);
      }
    },
    [locale, t],
  );

  /** All available accommodation types for the filter chips. */
  const ACCOMMODATION_TYPES = [
    'hotel', 'resort', 'apartamento', 'guest_house', 'hostel',
    'motel', 'pousada', 'eco_lodge', 'villa', 'camping',
  ];

  // ---- side effects --------------------------------------------------------

  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery(inputValue);
      setPage(1);
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [inputValue]);

  useEffect(() => {
    updateUrl({
      q: query || undefined,
      continent: continentFilter || undefined,
      country: countryFilter || undefined,
      hotelType: hotelTypeFilter.length > 0 ? hotelTypeFilter.join(',') : undefined,
      page: page > 1 ? String(page) : undefined,
    });
    fetchItems(query, continentFilter, countryFilter, hotelTypeFilter, page);
  }, [query, continentFilter, countryFilter, hotelTypeFilter, page, fetchItems, updateUrl]);

  // ---- carousel scroll helpers ---------------------------------------------

  const updateScrollArrows = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || famousItems.length === 0) return;
    updateScrollArrows();
    el.addEventListener('scroll', updateScrollArrows, { passive: true });
    const ro = new ResizeObserver(updateScrollArrows);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', updateScrollArrows);
      ro.disconnect();
    };
  }, [famousItems, updateScrollArrows]);

  const scrollCarousel = useCallback((direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.75;
    el.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  }, []);

  // ---- derived render data -------------------------------------------------

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  const hasActiveFilters = !!(query || continentFilter || countryFilter || hotelTypeFilter.length > 0);



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50 to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors">
      <AppHeader showBack onBack={onBack} />

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        {/* ─── Hero Section with Search ─── */}
        <div className="relative mb-8 sm:mb-12 overflow-hidden rounded-2xl sm:rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-600 via-cyan-600 to-orange-500 opacity-90 dark:opacity-80" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzEuNjU3IDAgMy0xLjM0MyAzLTNzLTEuMzQzLTMtMy0zLTMgMS4zNDMtMyAzIDEuMzQzIDMgMyAzeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
          <div className="relative p-8 sm:p-12 md:p-16 text-center">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4 sm:mb-6">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="text-xs sm:text-sm font-medium text-white/90">{t('title')}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-3 sm:mb-4 tracking-tight">
              {t('title')}
            </h1>
            <p className="text-sm sm:text-lg text-white/80 max-w-2xl mx-auto mb-8">{t('subtitle')}</p>

            {/* Main Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <div className="flex items-center bg-white dark:bg-gray-800 rounded-2xl shadow-2xl shadow-black/20 p-1.5 sm:p-2">
                <Search className="ml-3 sm:ml-4 w-5 h-5 text-gray-400 shrink-0" />
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={t('searchPlaceholder')}
                  className="flex-1 px-3 py-3 sm:py-3.5 bg-transparent text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none text-sm sm:text-base"
                />
                {inputValue && (
                  <button
                    onClick={() => { setInputValue(''); setQuery(''); }}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <div className="h-6 w-px bg-gray-200 dark:bg-gray-600 mx-1" />
                {/* Country picker */}
                <Popover open={countryOpen} onOpenChange={setCountryOpen}>
                  <PopoverTrigger asChild>
                    <button
                      className={cn(
                        'flex items-center gap-1.5 px-3 py-2 sm:py-2.5 rounded-xl text-sm font-medium transition-colors shrink-0',
                        countryFilter
                          ? 'bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300'
                          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700',
                      )}
                    >
                      <MapPin className="w-4 h-4" />
                      <span className="hidden sm:inline max-w-[100px] truncate">
                        {countryFilter || t('countryPlaceholder')}
                      </span>
                      <ChevronsUpDown className="w-3 h-3 opacity-50" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0" align="end">
                    <Command>
                      <CommandInput placeholder={t('searchCountryPlaceholder')} />
                      <CommandEmpty>{t('noCountriesFound')}</CommandEmpty>
                      <CommandList>
                        {countriesLoading ? (
                          <CommandGroup>
                            <div className="px-2 py-1.5">
                              {Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} className="flex items-center gap-2 py-1.5 px-2">
                                  <div className="w-4 h-4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse shrink-0" />
                                  <div className="h-3 flex-1 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" style={{ width: `${55 + (i * 7) % 35}%` }} />
                                  <div className="w-8 h-4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse shrink-0" />
                                </div>
                              ))}
                            </div>
                          </CommandGroup>
                        ) : (
                          <CommandGroup>
                            <ScrollArea className="max-h-[300px]">
                              <CommandItem
                                value="__all__"
                                onSelect={() => { setCountryFilter(''); setCountryOpen(false); setPage(1); }}
                              >
                                <Check className={cn('mr-2 h-4 w-4', !countryFilter ? 'opacity-100' : 'opacity-0')} />
                                {t('allCountries')}
                              </CommandItem>
                              {countries.map((c) => (
                                <CommandItem
                                  key={c.name}
                                  value={c.name}
                                  onSelect={() => {
                                    setCountryFilter(c.name === countryFilter ? '' : c.name);
                                    setCountryOpen(false);
                                    setPage(1);
                                  }}
                                >
                                  <Check className={cn('mr-2 h-4 w-4', countryFilter === c.name ? 'opacity-100' : 'opacity-0')} />
                                  <span className="flex-1">{c.name}</span>
                                  <Badge variant="secondary" className="ml-auto text-xs">{c.count}</Badge>
                                </CommandItem>
                              ))}
                            </ScrollArea>
                          </CommandGroup>
                        )}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Continent / Region Chips ─── */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              {t('continentLabel')}
            </h2>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <button
              onClick={() => { setContinentFilter(''); setPage(1); }}
              className={cn(
                'group flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                !continentFilter
                  ? 'bg-gradient-to-r from-teal-600 to-orange-500 text-white shadow-lg shadow-teal-500/25 scale-[1.02]'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 ring-1 ring-gray-200 dark:ring-gray-700 hover:ring-teal-300 dark:hover:ring-teal-700',
              )}
            >
              <Compass className="w-4 h-4" />
              {t('allContinents')}
            </button>
            {CONTINENT_CHIPS.map((chip) => {
              const isActive = continentFilter === chip.value;
              return (
                <button
                  key={chip.value}
                  onClick={() => { setContinentFilter(isActive ? '' : chip.value); setPage(1); }}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                    isActive
                      ? `bg-gradient-to-r ${chip.gradient} text-white shadow-lg scale-[1.02]`
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 ring-1 ring-gray-200 dark:ring-gray-700 hover:ring-teal-300 dark:hover:ring-teal-700',
                  )}
                >
                  <span className="text-base">{chip.emoji}</span>
                  {getContinentLabel(chip.value)}
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── Accommodation Type Filter ─── */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Hotel className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              {t('accommodationTypeLabel') ?? 'Accommodation Type'}
            </h2>
            <button
              onClick={() => {
                if (selectAllCooldown.current) return;
                selectAllCooldown.current = setTimeout(() => { selectAllCooldown.current = null; }, 500);
                setHotelTypeFilter((prev) =>
                  prev.length === ACCOMMODATION_TYPES.length ? [] : [...ACCOMMODATION_TYPES],
                );
                setPage(1);
              }}
              className="text-xs text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium underline underline-offset-2 transition-colors"
            >
              {hotelTypeFilter.length > 0 ? t('clearAll') : t('selectAll')}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {ACCOMMODATION_TYPES.map((tipo) => {
              const Icon = ACCOMMODATION_ICONS[tipo] ?? Hotel;
              const isActive = hotelTypeFilter.includes(tipo);
              const colorClass = isActive
                ? ACCOMMODATION_COLORS[tipo] ?? ACCOMMODATION_COLORS.hotel
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 ring-1 ring-gray-200 dark:ring-gray-700';
              return (
                <button
                  key={tipo}
                  onClick={() => {
                    setHotelTypeFilter((prev) => {
                      const next = prev.includes(tipo) ? prev.filter((t) => t !== tipo) : [...prev, tipo];
                      return next;
                    });
                    setPage(1);
                  }}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border-0',
                    colorClass,
                    isActive && 'ring-2 ring-teal-400 dark:ring-teal-500 shadow-sm scale-[1.02]',
                  )}
                >
                  <Icon className="h-3 w-3" />
                  {t(`accommodationTypes.${tipo}`) ?? tipo}
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── Active Filters Summary ─── */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">{t('filters')}:</span>
            {query && (
              <Badge variant="secondary" className="flex items-center gap-1.5 pl-2 pr-1 py-1 text-xs">
                <Search className="w-3 h-3" />{query}
                <button onClick={() => { setInputValue(''); setQuery(''); }} className="p-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {continentFilter && (
              <Badge variant="secondary" className="flex items-center gap-1.5 pl-2 pr-1 py-1 text-xs">
                <Globe className="w-3 h-3" />{getContinentLabel(continentFilter)}
                <button onClick={() => { setContinentFilter(''); setPage(1); }} className="p-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {countryFilter && (
              <Badge variant="secondary" className="flex items-center gap-1.5 pl-2 pr-1 py-1 text-xs bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300">
                <MapPin className="w-3 h-3" />{countryFilter}
                <button onClick={() => { setCountryFilter(''); setPage(1); }} className="p-0.5 rounded hover:bg-teal-200 dark:hover:bg-teal-800">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {hotelTypeFilter.map((tipo) => (
              <Badge key={tipo} variant="secondary" className="flex items-center gap-1.5 pl-2 pr-1 py-1 text-xs">
                <Hotel className="w-3 h-3" />{t(`accommodationTypes.${tipo}`) ?? tipo}
                <button onClick={() => { setHotelTypeFilter((prev) => prev.filter((t) => t !== tipo)); setPage(1); }} className="p-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
            <button
              onClick={() => { setInputValue(''); setQuery(''); setContinentFilter(''); setCountryFilter(''); setHotelTypeFilter([]); setPage(1); }}
              className="text-xs text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 font-medium ml-1 underline underline-offset-2"
            >
              {t('clearFilters')}
            </button>
          </div>
        )}

        {/* ─── Famous Tourist Destinations ─── */}
        {!hasActiveFilters && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-orange-500" />
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                {t('famousDestinations')}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-5">{t('famousSubtitle')}</p>
            {famousLoading ? (
              <div className="flex gap-4 overflow-hidden">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="shrink-0 w-48 sm:w-56 h-32 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
                ))}
              </div>
            ) : famousItems.length > 0 ? (
              <div className="relative group/carousel">
                {/* Left arrow */}
                {canScrollLeft && (
                  <button
                    onClick={() => scrollCarousel('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg ring-1 ring-black/5 dark:ring-white/10 text-gray-700 dark:text-gray-200 opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-200 hover:bg-white dark:hover:bg-gray-700 hover:scale-110"
                    aria-label="Scroll left"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                )}
                {/* Right arrow */}
                {canScrollRight && (
                  <button
                    onClick={() => scrollCarousel('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg ring-1 ring-black/5 dark:ring-white/10 text-gray-700 dark:text-gray-200 opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-200 hover:bg-white dark:hover:bg-gray-700 hover:scale-110"
                    aria-label="Scroll right"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}
                {/* Fade edges when scrollable */}
                {canScrollLeft && (
                  <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-50 dark:from-gray-900 to-transparent z-[5] pointer-events-none" />
                )}
                {canScrollRight && (
                  <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-50 dark:from-gray-900 to-transparent z-[5] pointer-events-none" />
                )}
                <div
                  ref={scrollRef}
                  className="flex gap-4 overflow-x-auto pb-4 snap-x snap-proximity [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                  style={{ overscrollBehaviorX: 'contain' } as React.CSSProperties}
                >
                  {famousItems.map((item, idx) => (
                    <a key={item.id} href={destinationDetailPath(locale, item.slug)} className="group shrink-0 w-48 sm:w-56 snap-start select-none">
                      <div className="relative h-32 sm:h-36 rounded-xl overflow-hidden ring-1 ring-black/5 dark:ring-white/10">
                        <img
                          src={item.imageUrl}
                          alt={item.nome}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute top-2 left-2">
                          <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-xs font-bold text-white">
                            {idx + 1}
                          </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <h3 className="text-sm font-bold text-white leading-tight line-clamp-1 drop-shadow-sm">{item.nome}</h3>
                          <p className="text-[11px] text-white/80 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 shrink-0" />{item.pais}
                          </p>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* ─── Results info ─── */}
        <Separator className="mb-6" />
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                {t('loading')}
              </span>
            ) : (
              <>{t('results', { count: total })}</>
            )}
          </p>
          {totalPages > 1 && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span>
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Error state */}
        {error && (
          <Card className="border-2 border-red-200 dark:border-red-700 mb-6">
            <CardContent className="p-6 text-center">
              <p className="text-red-600 dark:text-red-400">{error}</p>
              <Button onClick={() => fetchItems(query, continentFilter, countryFilter, hotelTypeFilter, page)} variant="outline" className="mt-4">
                {t('retry')}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Loading skeleton */}
        {loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden animate-pulse">
                <div className="h-40 bg-gray-200 dark:bg-gray-700" />
                <div className="p-4 space-y-3">
                  <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-3 w-1/3 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Cards grid */}
        {!loading && !error && (
          <>
            {items.length === 0 ? (
              <div className="text-center py-12 sm:py-16">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                </div>
                <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 mb-1">{t('emptyTitle')}</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">{t('emptyHint')}</p>
                {hasActiveFilters && (
                  <Button variant="outline" className="mt-4" onClick={() => { setInputValue(''); setQuery(''); setContinentFilter(''); setCountryFilter(''); setHotelTypeFilter([]); setPage(1); }}>
                    {t('clearFilters')}
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {items.map((item) => (
                  <DestinationBrowseCard
                    key={item.id}
                    item={item}
                    href={destinationDetailPath(locale, item.slug)}
                    labels={{
                      viewDestination: t('viewDestination'),
                      hotels: t('hotels'),
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
                    }}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8 sm:mt-12">
                <button
                  onClick={() => { setPage((p) => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  disabled={page <= 1}
                  className="flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  {t('prevPage')}
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const start = Math.max(1, Math.min(page - 2, totalPages - 4));
                  const p = start + i;
                  if (p > totalPages) return null;
                  return (
                    <button
                      key={p}
                      onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className={cn(
                        'w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200',
                        p === page
                          ? 'bg-gradient-to-r from-teal-600 to-orange-500 text-white shadow-md scale-110'
                          : 'border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700',
                      )}
                    >
                      {p}
                    </button>
                  );
                })}
                <button
                  onClick={() => { setPage((p) => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  disabled={page >= totalPages}
                  className="flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  {t('nextPage')}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <AppFooter />
    </div>
  );
}