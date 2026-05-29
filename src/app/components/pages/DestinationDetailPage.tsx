'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import {
  ArrowLeft,
  Clock,
  ExternalLink,
  Eye,
  Compass,
  BookOpen,
  CloudSun,
  Hotel,
  MapPin,
  Star,
  UtensilsCrossed,
  Wallet,
  Plane,
  Bus,
} from 'lucide-react';

import { resultsListPath } from '../../../lib/travel/destination-path';
import type { DestinationTipsMap, TipSectionKey } from '../../../lib/travel/destination-tips';
import type { CompactTravelPreferences } from '../../../lib/travel/preference-match';
import { CostOfLivingBadge } from '../travel/CostOfLivingBadge';
import { DestinationConnectivityPanel } from '../travel/DestinationConnectivityPanel';
import { DestinationMap } from '../travel/DestinationMap';
import { LocalRoutePanel } from '../travel/LocalRoutePanel';
import { DestinationTipsPanel } from '../travel/DestinationTipsPanel';
import { tripGoEndpointsFromDestination } from '../../../lib/travel/tripgo-from-destination';
import {
  originFromResultsQuery,
  resolveOriginIata,
} from '../../../lib/travel/flight-connectivity';
import { summarizeCostOfLiving } from '../../../lib/travel/cost-tier';
import type { DestinationMapMarker } from '../../../lib/travel/destination-map';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export type DestinationDetailData = {
  slug: string;
  nome: string;
  pais: string;
  continente: string;
  iata: string | null;
  tipo: string;
  clima: string;
  imageUrl: string;
  resumo?: string;
  descricao?: string;
  descricaoCompleta?: string;
  veja: string[];
  faca: string[];
  coma: string[];
  tags: string[];
  wikivoyageUrl?: string;
  license?: string;
  hotels: {
    id: number;
    nome: string;
    estrelas: number;
    preco_por_noite: number;
    comodidades: string[];
  }[];
  dicas?: DestinationTipsMap;
  wikipedia_resumo?: string;
  wikipedia_url?: string;
  clima_tempo?: {
    descricao?: string | null;
    temperatura_c?: number | null;
    sensacao_c?: number | null;
    humidade_pct?: number | null;
    atualizado?: string;
  };
  custo_de_vida?: {
    moeda: string;
    fonte: string;
    nivel: 'cidade' | 'pais' | 'continente' | 'global';
    estimado?: boolean;
    confianca?: 'alta' | 'media' | 'baixa';
    orcamentos?: Partial<
      Record<'mochileiro' | 'conforto' | 'luxo', { total_dia: number; moeda: string; itens?: string[] }>
    >;
  };
  transporte?: {
    fonte: string;
    aeroporto: {
      iata: string;
      nome: string;
      tipo: string;
      municipio?: string;
      pais_code: string;
      lat: number;
      lon: number;
      scheduled_service: boolean;
      distancia_km?: number;
      match: 'iata' | 'cidade' | 'pais' | 'proximo';
    };
    rede?: {
      ligacoes_diretas: number;
      rotas_registadas: number;
      hubs_com_ligacao?: string[];
      ligacoes_desde_hubs?: Record<string, boolean>;
      top_destinos?: { iata: string; nome: string }[];
      preco_indicativo_desde?: Record<string, number>;
      aeronaves_frequentes?: { code: string; nome: string; rotas?: number }[];
    };
  };
  latitude?: number;
  longitude?: number;
  mapMarkers?: DestinationMapMarker[];
};

type DestinationDetailPageProps = {
  slug: string;
  resultsSearchQuery?: string;
  travelPreferences?: CompactTravelPreferences | null;
  onBackToResults?: () => void;
};

const TIP_KEYS: TipSectionKey[] = [
  'seguranca',
  'respeite',
  'comunique',
  'beba',
  'dinheiro',
  'saude',
  'transporte',
  'horarios',
  'compre',
  'clima',
];

function SectionBlock({
  title,
  icon: Icon,
  items,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  items: string[];
}) {
  if (!items.length) return null;
  return (
    <Card className="border-gray-200/80 dark:border-gray-700 dark:bg-gray-800/80">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg dark:text-white">
          <Icon className="h-5 w-5 text-teal-600" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {items.map((item) => (
            <li
              key={item}
              className="flex gap-2 text-sm text-gray-700 dark:text-gray-300 before:content-['•'] before:text-teal-500 before:font-bold"
            >
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export function DestinationDetailPage({
  slug,
  resultsSearchQuery = '',
  travelPreferences = null,
  onBackToResults,
}: DestinationDetailPageProps) {
  const locale = useLocale();
  const t = useTranslations('destination');
  const tipLabels = {
    panelTitle: t('tipsTitle'),
    ...Object.fromEntries(TIP_KEYS.map((k) => [k, t(k)])) as Record<TipSectionKey, string>,
  };
  const [data, setData] = useState<DestinationDetailData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const costSummary = data ? summarizeCostOfLiving(data.custo_de_vida) : null;
  const resultsHref = resultsListPath(locale, resultsSearchQuery);
  const originIata = resolveOriginIata(
    originFromResultsQuery(resultsSearchQuery),
    travelPreferences,
  );

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(`/api/travel/destinations/${encodeURIComponent(slug)}`)
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error ?? `HTTP ${res.status}`);
        }
        return res.json() as Promise<DestinationDetailData>;
      })
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Erro ao carregar');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-teal-50/30 to-orange-50/40 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <p className="text-gray-600 dark:text-gray-400">{t('loading')}</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-red-600 dark:text-red-400">{error ?? t('notFound')}</p>
        <Button asChild variant="outline">
          <Link href={resultsHref}>{t('backToResults')}</Link>
        </Button>
      </div>
    );
  }

  const summary = data.resumo ?? data.descricao ?? data.descricaoCompleta ?? '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/20 to-orange-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="relative h-[42vh] min-h-[280px] max-h-[480px] w-full overflow-hidden">
        <img
          src={data.imageUrl || '/travel-images/placeholder.svg'}
          alt={data.nome}
          className="h-full w-full object-cover"
          onError={(e) => {
            const img = e.currentTarget;
            if (!img.src.endsWith('/travel-images/placeholder.svg')) {
              img.src = '/travel-images/placeholder.svg';
            }
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 pointer-events-none" />
        <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-start">
          {onBackToResults ? (
            <Button
              type="button"
              variant="secondary"
              className="gap-1 min-h-11 bg-white/90 dark:bg-gray-900/90 backdrop-blur touch-manipulation"
              onClick={onBackToResults}
            >
              <ArrowLeft className="h-4 w-4" />
              {t('backToResults')}
            </Button>
          ) : (
            <Button
              variant="secondary"
              asChild
              className="gap-1 min-h-11 bg-white/90 dark:bg-gray-900/90 backdrop-blur touch-manipulation"
            >
              <Link href={resultsHref}>
                <ArrowLeft className="h-4 w-4" />
                {t('backToResults')}
              </Link>
            </Button>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-10 p-6 md:p-10 max-w-5xl pointer-events-none">
          <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg">{data.nome}</h1>
          <p className="mt-2 flex flex-wrap items-center gap-3 text-white/90">
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {data.pais}, {data.continente}
            </span>
            {data.iata && (
              <Badge variant="secondary" className="bg-white/20 text-white border-0">
                {data.iata}
              </Badge>
            )}
            <span className="flex items-center gap-1 text-sm">
              <Clock className="h-4 w-4" />
              {data.tipo} · {data.clima}
            </span>
            {costSummary && <CostOfLivingBadge cost={costSummary} className="bg-white/20 text-white" />}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12 space-y-8">
        {summary && (
          <Card className="border-teal-200/60 dark:border-teal-800 bg-white/90 dark:bg-gray-800/90 shadow-md">
            <CardHeader>
              <CardTitle className="text-xl dark:text-white">{t('cardSummary')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{summary}</p>
            </CardContent>
          </Card>
        )}

        <DestinationMap data={data} markers={data.mapMarkers} />

        {data.wikipedia_resumo && (
          <Card className="dark:bg-gray-800/80 border-violet-200/50 dark:border-violet-900/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg dark:text-white">
                <BookOpen className="h-5 w-5 text-violet-600" />
                {t('historyTitle')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {data.wikipedia_resumo}
              </p>
              {data.wikipedia_url && (
                <a
                  href={data.wikipedia_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-violet-600 hover:underline inline-flex items-center gap-1"
                >
                  Wikipedia
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </CardContent>
          </Card>
        )}

        {data.clima_tempo && data.clima_tempo.temperatura_c != null && (
          <Card className="dark:bg-gray-800/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg dark:text-white">
                <CloudSun className="h-5 w-5 text-sky-500" />
                {t('weatherTitle')}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4 text-sm">
              <div>
                <p className="text-3xl font-bold text-sky-600 dark:text-sky-400">
                  {Math.round(data.clima_tempo.temperatura_c)}°C
                </p>
                <p className="text-gray-500 capitalize">{data.clima_tempo.descricao}</p>
              </div>
              {data.clima_tempo.sensacao_c != null && (
                <p className="text-gray-600 dark:text-gray-400">
                  {t('feelsLike')}: {Math.round(data.clima_tempo.sensacao_c)}°C
                </p>
              )}
              {data.clima_tempo.humidade_pct != null && (
                <p className="text-gray-600 dark:text-gray-400">
                  {t('humidity')}: {data.clima_tempo.humidade_pct}%
                </p>
              )}
              <p className="text-xs text-gray-400 w-full">{t('weatherSnapshot')}</p>
            </CardContent>
          </Card>
        )}

        {data.custo_de_vida?.orcamentos && (
          <Card className="dark:bg-gray-800/80 border-emerald-200/50 dark:border-emerald-900/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg dark:text-white">
                <Wallet className="h-5 w-5 text-emerald-600" />
                {t('budgetTitle')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">{t('budgetHint')}</p>
              {data.custo_de_vida.fonte && (
                <p className="text-xs text-gray-400 mb-3">{data.custo_de_vida.fonte}</p>
              )}
              <div className="grid sm:grid-cols-3 gap-3">
                {(['mochileiro', 'conforto', 'luxo'] as const).map((perfil) => {
                  const o = data.custo_de_vida?.orcamentos?.[perfil];
                  if (!o) return null;
                  return (
                    <div
                      key={perfil}
                      className="rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 p-3 border border-emerald-100 dark:border-emerald-900/50"
                    >
                      <p className="font-semibold text-sm dark:text-white">{t(`budget_${perfil}`)}</p>
                      <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mt-1">
                        {o.moeda} {o.total_dia}
                        <span className="text-xs font-normal text-gray-500">/{t('perDay')}</span>
                      </p>
                      {o.itens?.slice(0, 2).map((line) => (
                        <p key={line} className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">
                          {line}
                        </p>
                      ))}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {data.transporte?.aeroporto && (
          <Card className="dark:bg-gray-800/80 border-sky-200/50 dark:border-sky-900/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg dark:text-white">
                <Plane className="h-5 w-5 text-sky-600" />
                {t('transportTitle')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-gray-500 dark:text-gray-400">{t('transportHint')}</p>
              <div className="rounded-xl bg-sky-50/80 dark:bg-sky-950/30 p-4 border border-sky-100 dark:border-sky-900/50">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-2xl font-bold text-sky-700 dark:text-sky-400">
                    {data.transporte.aeroporto.iata}
                  </span>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {data.transporte.aeroporto.nome}
                  </span>
                </div>
                {data.transporte.aeroporto.municipio && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {data.transporte.aeroporto.municipio}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  {t(`transportMatch_${data.transporte.aeroporto.match}`)}
                  {data.transporte.aeroporto.distancia_km != null &&
                    data.transporte.aeroporto.distancia_km > 0 &&
                    ` · ${data.transporte.aeroporto.distancia_km} km`}
                </p>
              </div>
              {data.transporte.rede && (
                <>
                  <div className="grid sm:grid-cols-2 gap-3 text-sm">
                    <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                      <p className="text-xs text-gray-500">{t('transportDirectRoutes')}</p>
                      <p className="text-xl font-semibold dark:text-white">
                        {data.transporte.rede.ligacoes_diretas}
                      </p>
                    </div>
                    {(data.transporte.rede.hubs_com_ligacao?.length ?? 0) > 0 && (
                      <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                        <p className="text-xs text-gray-500 mb-2">{t('transportHubs')}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {data.transporte.rede.hubs_com_ligacao!.map((hub) => (
                            <Badge key={hub} variant="secondary" className="font-mono">
                              {hub}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <DestinationConnectivityPanel
                    destIata={data.transporte.aeroporto.iata}
                    rede={data.transporte.rede}
                    originIata={originIata}
                  />
                </>
              )}
              {data.transporte.fonte && (
                <p className="text-xs text-gray-400">{data.transporte.fonte}</p>
              )}
            </CardContent>
          </Card>
        )}

        {data && tripGoEndpointsFromDestination(data) && (
          <Card className="dark:bg-gray-800/80 border-violet-200/50 dark:border-violet-900/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg dark:text-white">
                <Bus className="h-5 w-5 text-violet-600" />
                {t('tripgo.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">{t('tripgo.subtitle')}</p>
              <LocalRoutePanel {...tripGoEndpointsFromDestination(data)!} />
            </CardContent>
          </Card>
        )}

        <div className="flex flex-wrap gap-2">
          {data.tags.map((tag) => (
            <Badge
              key={tag}
              className="bg-teal-100 text-teal-900 dark:bg-teal-900/60 dark:text-teal-100 border-0"
            >
              {tag}
            </Badge>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <SectionBlock title={t('cardSee')} icon={Eye} items={data.veja} />
          <SectionBlock title={t('cardDo')} icon={Compass} items={data.faca} />
          <SectionBlock title={t('cardEat')} icon={UtensilsCrossed} items={data.coma} />
        </div>

        {data.dicas && Object.keys(data.dicas).length > 0 && (
          <DestinationTipsPanel
            dicas={data.dicas}
            labels={tipLabels}
            preferences={travelPreferences}
            defaultOpenCount={3}
          />
        )}

        {data.descricaoCompleta && data.descricaoCompleta !== summary && (
          <Card className="dark:bg-gray-800/80">
            <CardHeader>
              <CardTitle className="dark:text-white">{t('moreInfo')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {data.descricaoCompleta}
              </p>
            </CardContent>
          </Card>
        )}

        {data.hotels.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 dark:text-white">
              <Hotel className="h-5 w-5 text-teal-600" />
              {t('hotels')}
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {data.hotels.map((h) => (
                <Card key={h.id} className="dark:bg-gray-800/80">
                  <CardContent className="pt-4">
                    <p className="font-semibold dark:text-white">{h.nome}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      {h.estrelas} ★ · EUR {h.preco_por_noite}/noite
                    </p>
                    {h.comodidades.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {h.comodidades.slice(0, 4).map((c) => (
                          <Badge key={c} variant="outline" className="text-xs">
                            {c}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {data.wikivoyageUrl && (
          <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-600 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/50 dark:bg-gray-800/50">
            <p className="text-xs text-gray-500 dark:text-gray-400">{t('attribution', { license: data.license ?? 'CC BY-SA 3.0' })}</p>
            <Button asChild variant="outline" className="gap-2 min-h-11 shrink-0 touch-manipulation">
              <a href={data.wikivoyageUrl} target="_blank" rel="noopener noreferrer">
                {t('viewFullArticle')}
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
