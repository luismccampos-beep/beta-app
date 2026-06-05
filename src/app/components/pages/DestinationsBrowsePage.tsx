'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Globe,
  Languages,
  Loader2,
  MapPin,
  Moon,
  Search,
  Sun,
  X,
} from 'lucide-react';

import { destinationDetailPath, destinationsBrowsePath } from '../../../lib/travel/destination-path';
import {
  DestinationBrowseCard,
  type DestinationBrowseItem,
} from '../travel/DestinationBrowseCard';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const PAGE_SIZE = 24;

const CONTINENT_VALUES = [
  'Europa',
  'Ásia',
  'África',
  'América do Norte',
  'América do Sul',
  'Oceania',
  'Antártida',
] as const;

type BrowseResponse = {
  ok: boolean;
  total: number;
  items: DestinationBrowseItem[];
  source?: string;
  message?: string;
};

type DestinationsBrowsePageProps = {
  onBack: () => void;
};

export function DestinationsBrowsePage({ onBack }: DestinationsBrowsePageProps) {
  const locale = useLocale();
  const t = useTranslations('destinationsBrowse');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isDark, setIsDark] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<BrowseResponse | null>(null);

  const qParam = searchParams.get('q') ?? '';
  const paisParam = searchParams.get('pais') ?? '';
  const continenteParam = searchParams.get('continente') ?? '';
  const pageParam = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10) || 1);

  const [qInput, setQInput] = useState(qParam);
  const [paisInput, setPaisInput] = useState(paisParam);

  useEffect(() => {
    setQInput(qParam);
  }, [qParam]);

  useEffect(() => {
    setPaisInput(paisParam);
  }, [paisParam]);

  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);

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

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    const offset = (pageParam - 1) * PAGE_SIZE;
    const params = new URLSearchParams();
    if (qParam) params.set('q', qParam);
    if (paisParam) params.set('pais', paisParam);
    if (continenteParam) params.set('continente', continenteParam);
    params.set('limit', String(PAGE_SIZE));
    params.set('offset', String(offset));

    fetch(`/api/travel/v1/destinations?${params}`, { signal: controller.signal })
      .then(async (res) => {
        const json = (await res.json()) as BrowseResponse;
        if (!res.ok || !json.ok) {
          throw new Error(json.message ?? t('loadError'));
        }
        setData(json);
      })
      .catch((e: unknown) => {
        if (e instanceof DOMException && e.name === 'AbortError') return;
        setError(e instanceof Error ? e.message : t('loadError'));
        setData(null);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [qParam, paisParam, continenteParam, pageParam, t]);

  const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1;
  const hasFilters = Boolean(qParam || paisParam || continenteParam);

  const setLocale = (nextLocale: string) => {
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
    window.location.href = destinationsBrowsePath(nextLocale);
  };

  const applySearch = () => {
    patchSearchParams({ q: qInput.trim() || null, pais: paisInput.trim() || null, page: '1' });
  };

  const clearFilters = () => {
    setQInput('');
    setPaisInput('');
    patchSearchParams({ q: null, pais: null, continente: null, page: '1' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50/40 to-orange-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors">
      <header className="sticky top-0 z-30 border-b border-gray-200/80 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Button variant="ghost" size="icon" onClick={onBack} aria-label={t('back')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
                {t('title')}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">{t('subtitle')}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Select value={locale} onValueChange={setLocale}>
              <SelectTrigger className="w-[110px] h-9">
                <Languages className="h-4 w-4 mr-1 shrink-0" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pt">PT</SelectItem>
                <SelectItem value="en">EN</SelectItem>
                <SelectItem value="es">ES</SelectItem>
                <SelectItem value="fr">FR</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" size="icon" onClick={() => setIsDark((d) => !d)} aria-label="Theme">
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Card className="mb-6 border-2 border-gray-200/80 dark:border-gray-700 shadow-lg dark:bg-gray-800/80">
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="dest-search">{t('searchLabel')}</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="dest-search"
                    value={qInput}
                    onChange={(e) => setQInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && applySearch()}
                    placeholder={t('searchPlaceholder')}
                    className="pl-9 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dest-pais">{t('countryLabel')}</Label>
                <Input
                  id="dest-pais"
                  value={paisInput}
                  onChange={(e) => setPaisInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && applySearch()}
                  placeholder={t('countryPlaceholder')}
                  className="dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <div className="space-y-2">
                <Label>{t('continentLabel')}</Label>
                <Select
                  value={continenteParam || '__all__'}
                  onValueChange={(v) =>
                    patchSearchParams({ continente: v === '__all__' ? null : v, page: '1' })
                  }
                >
                  <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600">
                    <SelectValue placeholder={t('allContinents')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">{t('allContinents')}</SelectItem>
                    {CONTINENT_VALUES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={applySearch}
                className="bg-gradient-to-r from-teal-600 to-orange-500 hover:from-teal-700 hover:to-orange-600"
              >
                <Search className="h-4 w-4 mr-1" />
                {t('searchButton')}
              </Button>
              {hasFilters && (
                <Button variant="outline" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-1" />
                  {t('clearFilters')}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Globe className="h-4 w-4 text-teal-600" />
            {loading ? (
              <span>{t('loading')}</span>
            ) : data ? (
              <span>
                {t('resultsCount', { count: data.total.toLocaleString(locale) })}
                {data.source ? (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {data.source}
                  </Badge>
                ) : null}
              </span>
            ) : null}
          </div>
          {!loading && data && totalPages > 1 && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('pageOf', { page: pageParam, total: totalPages })}
            </p>
          )}
        </div>

        {error && (
          <Card className="mb-6 border-red-200 dark:border-red-900">
            <CardContent className="p-6 text-center text-red-600 dark:text-red-400">{error}</CardContent>
          </Card>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-500">
            <Loader2 className="h-10 w-10 animate-spin text-teal-600 mb-3" />
            <p>{t('loading')}</p>
          </div>
        ) : data && data.items.length === 0 ? (
          <Card className="border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800">
            <CardContent className="p-12 text-center">
              <MapPin className="w-14 h-14 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">{t('emptyTitle')}</p>
              <p className="text-gray-500 dark:text-gray-400 mb-6">{t('emptyHint')}</p>
              {hasFilters && (
                <Button variant="outline" onClick={clearFilters}>
                  {t('clearFilters')}
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          data && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                {data.items.map((item) => (
                  <DestinationBrowseCard
                    key={item.id}
                    item={item}
                    href={destinationDetailPath(item.slug, locale)}
                    labels={{
                      viewDestination: t('viewDestination'),
                      hotels: t('hotels'),
                    }}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-10">
                  <Button
                    variant="outline"
                    disabled={pageParam <= 1}
                    onClick={() => patchSearchParams({ page: String(pageParam - 1) })}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    {t('prevPage')}
                  </Button>
                  <span className="text-sm text-gray-600 dark:text-gray-400 tabular-nums">
                    {pageParam} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={pageParam >= totalPages}
                    onClick={() => patchSearchParams({ page: String(pageParam + 1) })}
                  >
                    {t('nextPage')}
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              )}
            </>
          )
        )}
      </main>
    </div>
  );
}
