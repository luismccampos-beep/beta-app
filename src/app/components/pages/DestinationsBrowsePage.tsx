'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Globe,
  Loader2,
  MapPin,
  Search,
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

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ITEMS_PER_PAGE = 20;
const DEBOUNCE_MS = 300;

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

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
  const [iataFilter, setIataFilter] = useState(searchParams.get('iata') ?? '');
  const [page, setPage] = useState(Number(searchParams.get('page') ?? '1'));

  // derived filter list for mobile slide-over
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const continentList: { label: string; value: string }[] =
    t.raw('continentOptions') as { label: string; value: string }[];

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
    async (q: string, continent: string, iata: string, p: number) => {
      setLoading(true);
      setError(null);
      try {
        const qp = new URLSearchParams();
        if (q) qp.set('q', q);
        if (continent) qp.set('continent', continent);
        if (iata) qp.set('iata', iata);
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

  // ---- side effects --------------------------------------------------------

  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery(inputValue);
      setPage(1);
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [inputValue]);

  useEffect(() => {
    updateUrl({ q: query || undefined, continent: continentFilter || undefined, page: page > 1 ? String(page) : undefined });
    fetchItems(query, continentFilter, iataFilter, page);
  }, [query, continentFilter, iataFilter, page, fetchItems, updateUrl]);

  // ---- render --------------------------------------------------------------

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50 to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors">
      <AppHeader showBack onBack={onBack} />

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        {/* Hero */}
        <div className="relative mb-8 sm:mb-12 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-orange-500/10 dark:from-teal-500/5 dark:to-orange-500/5 rounded-2xl sm:rounded-3xl" />
          <div className="relative p-6 sm:p-8 md:p-12 text-center">
            <Globe className="w-12 h-12 sm:w-16 sm:h-16 text-teal-600 dark:text-teal-400 mx-auto mb-3 sm:mb-4" />
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              {t('title')}
            </h1>
            <p className="text-sm sm:text-lg text-gray-600 dark:text-gray-400">{t('subtitle')}</p>
          </div>
        </div>

        {/* Mobile filter toggle */}
        <button
          onClick={() => setMobileFiltersOpen((o) => !o)}
          className="flex items-center gap-2 px-4 py-2 mb-4 sm:hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium"
        >
          {mobileFiltersOpen ? <X className="w-4 h-4" /> : <ChevronsUpDown className="w-4 h-4" />}
          {mobileFiltersOpen ? t('hideFilters') : t('showFilters')}
        </button>

        {/* Filters row */}
        <div className={`flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6 ${mobileFiltersOpen ? '' : 'hidden sm:flex'}`}>
          {/* Search box */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
            />
            {inputValue && (
              <button
                onClick={() => {
                  setInputValue('');
                  setQuery('');
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Continent select */}
          <select
            value={continentFilter}
            onChange={(e) => {
              setContinentFilter(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            <option value="">{t('allContinents')}</option>
            {continentList.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>

          {/* IATA filter chip */}
          {iataFilter && (
            <Badge className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 border-teal-300 dark:border-teal-700">
              <MapPin className="w-3 h-3" />
              {iataFilter}
              <button onClick={() => setIataFilter('')}>
                <X className="w-3 h-3 ml-1" />
              </button>
            </Badge>
          )}
        </div>

        {/* Results info */}
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
              <Button onClick={() => fetchItems(query, continentFilter, iataFilter, page)} variant="outline" className="mt-4">
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
                <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400">{t('noResults')}</p>
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
                      hotels: t('hotels')
                    }}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8 sm:mt-12">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <ChevronLeft className="w-4 h-4" />
                  {t('previous')}
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const start = Math.max(1, Math.min(page - 2, totalPages - 4));
                  const p = start + i;
                  if (p > totalPages) return null;
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium ${
                        p === page
                          ? 'bg-gradient-to-r from-teal-600 to-orange-500 text-white shadow-md'
                          : 'border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  {t('next')}
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