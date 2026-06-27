'use client';

import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { BookOpen, ExternalLink, Eye, Compass, UtensilsCrossed, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { useDarkMode } from '../../../../lib/use-dark-mode';
import { summarizeCostOfLiving } from '../../../../lib/travel/cost-tier';
import { resultsListPath } from '../../../../lib/travel/destination-path';
import { resolveOriginIata, originFromResultsQuery } from '../../../../lib/travel/flight-connectivity';
import { DestinationMap } from '../../travel/DestinationMap';
import { DestinationTipsPanel } from '../../travel/DestinationTipsPanel';
import { DESTINATION_PLACEHOLDER } from '../../travel/destination-image-fallback';
import { useDestinationDetail } from './hooks/useDestinationDetail';
import { HeroSection } from './sections/HeroSection';
import { QuickFactsBar } from './sections/QuickFactsBar';
import { SummaryCard } from './sections/SummaryCard';
import { WeatherCard } from './sections/WeatherCard';
import { BudgetCard } from './sections/BudgetCard';
import { TransportCard } from './sections/TransportCard';
import { TripGoCard } from './sections/TripGoCard';
import { HotelsSection } from './sections/HotelsSection';
import { AttributionFooter } from './sections/AttributionFooter';
import { SectionBlock } from './components/SectionBlock';
import { DestinationGallery } from './components/DestinationGallery';
import { LoadingSkeleton } from './components/SkeletonCard';
import { AnimatedSection } from './components/AnimatedSection';
import { fadeInUp, staggerContainer, fadeIn } from './constants/animations';
import type { CompactTravelPreferences } from '../../../../lib/travel/preference-match';
import type { DestinationTipsMap, TipSectionKey } from '../../../../lib/travel/destination-tips';
import type { DestinationMapMarker } from '../../../../lib/travel/destination-map';

export type DestinationDetailData = {
  slug: string;
  nome: string;
  pais: string;
  continente: string;
  iata: string | null;
  tipo: string;
  clima: string;
  imageUrl: string;
  videos?: {
    url: string;
    thumbUrl?: string | null;
    posterUrl?: string | null;
    width?: number | null;
    height?: number | null;
    durationSec?: number | null;
    author?: string | null;
    license: string;
    sourceUrl?: string | null;
    isVerified: boolean;
  }[];
  resumo?: string;
  descricao?: string;
  descricaoCompleta?: string;
  veja: string[];
  faca: string[];
  coma: string[];
  tags: string[];
  wikivoyageUrl?: string;
  license?: string;
  videoUrl?: string;
  galleryImages?: string[];
  localizedNome?: string;
  localizedDescricao?: string;
  localizedResumo?: string;
  localizedFonte?: string;
  hotels: {
    id: number;
    nome: string;
    estrelas: number;
    preco_por_noite: number;
    comodidades: string[];
  }[];
  hotelTypes?: Record<string, number> | null;
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
      Record<
        'mochileiro' | 'conforto' | 'luxo',
        { total_dia: number; moeda: string; itens?: string[] }
      >
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
  imageAttribution?: {
    fotografo?: string;
    fotografo_url?: string;
    fonte?: string;
    licenca?: string;
  };
};

type DestinationDetailPageProps = {
  slug: string;
  resultsSearchQuery?: string;
  travelPreferences?: CompactTravelPreferences | null;
  onBackToResults?: () => void;
};

export function DestinationDetailPage({
  slug,
  resultsSearchQuery = '',
  travelPreferences = null,
  onBackToResults,
}: DestinationDetailPageProps) {
  const locale = useLocale();
  const t = useTranslations('destination');
  const { data, error, loading } = useDestinationDetail(slug, locale);
  const { isDark, toggle: toggleDark } = useDarkMode();

  const resultsHref = resultsListPath(locale, resultsSearchQuery);
  const originIata = resolveOriginIata(originFromResultsQuery(resultsSearchQuery), travelPreferences);

  if (loading) return <LoadingSkeleton />;
  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="text-red-600 dark:text-red-400 text-lg font-medium"
        >
          {error ?? t('notFound')}
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Button asChild variant="outline">
            <Link href={resultsHref}>{t('backToResults')}</Link>
          </Button>
        </motion.div>
      </div>
    );
  }

  const displayNome = data.localizedNome ?? data.nome;
  const displayDescricao = data.localizedDescricao ?? data.descricao;
  const displayResumo = data.localizedResumo ?? data.resumo;
  const summary = displayResumo ?? displayDescricao ?? data.descricaoCompleta ?? '';
  const costSummary = data ? summarizeCostOfLiving(data.custo_de_vida) : null;

  const galleryImages: string[] = data.galleryImages ?? [];
  if (galleryImages.length === 0 && data.imageUrl && !data.imageUrl.endsWith('/travel-images/placeholder.svg')) {
    galleryImages.push(data.imageUrl);
  }

  const tipLabels = {
    panelTitle: t('tipsTitle'),
    seguranca: t('seguranca'),
    respeite: t('respeite'),
    comunique: t('comunique'),
    beba: t('beba'),
    dinheiro: t('dinheiro'),
    saude: t('saude'),
    transporte: t('transporte'),
    horarios: t('horarios'),
    compre: t('compre'),
    clima: t('clima'),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary-50/20 to-accent-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-500">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'TouristDestination',
            name: displayNome,
            description: displayResumo ?? displayDescricao,
            image: data.imageUrl || undefined,
            address: { '@type': 'PostalAddress', addressCountry: data.pais },
            url: typeof window !== 'undefined' ? window.location.href : undefined,
          }),
        }}
      />

      <HeroSection data={data} displayNome={displayNome} costSummary={costSummary}
        isDark={isDark} toggleDark={toggleDark} resultsHref={resultsHref}
        onBackToResults={onBackToResults} t={t}
      />

      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12 space-y-10">

        <QuickFactsBar data={data} t={t} />
        <SummaryCard summary={summary} t={t} />

        {galleryImages.length > 0 && (
          <AnimatedSection>
            <DestinationGallery images={galleryImages} title={t('gallery') ?? 'Galeria'} />
          </AnimatedSection>
        )}

        <AnimatedSection>
          <DestinationMap data={data} markers={data.mapMarkers} />
        </AnimatedSection>

        {data.wikipedia_resumo && (
          <AnimatedSection>
            <Card className="bg-white/70 dark:bg-gray-800/60 backdrop-blur-md border-violet-200/40 dark:border-violet-900/40 hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg dark:text-white">
                  <BookOpen className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                  {t('historyTitle')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{data.wikipedia_resumo}</p>
                {data.wikipedia_url && (
                  <a href={data.wikipedia_url} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-violet-600 dark:text-violet-400 hover:underline inline-flex items-center gap-1 transition-colors"
                  >
                    Wikipedia <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </CardContent>
            </Card>
          </AnimatedSection>
        )}

        {data.clima_tempo && <WeatherCard clima_tempo={data.clima_tempo} t={t} />}
        {data.custo_de_vida && <BudgetCard custo_de_vida={data.custo_de_vida} t={t} />}
        {data.transporte && <TransportCard transporte={data.transporte} originIata={originIata} t={t} />}
        <TripGoCard data={data} t={t} />

        <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="flex flex-wrap gap-2"
        >
          {(data.tags ?? []).map((tag, i) => (
            <motion.span key={tag} initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
            >
              <Badge className="bg-primary-100/90 text-primary-900 dark:bg-primary-900/60 dark:text-primary-100 border-0 px-3 py-1 text-sm hover:bg-primary-200 dark:hover:bg-primary-700/80 transition-colors">{tag}</Badge>
            </motion.span>
          ))}
        </motion.div>

        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
          className="grid md:grid-cols-2 gap-6"
        >
          <SectionBlock title={t('cardSee')} icon={Eye} items={data.veja} />
          <SectionBlock title={t('cardDo')} icon={Compass} items={data.faca} />
          <SectionBlock title={t('cardEat')} icon={UtensilsCrossed} items={data.coma} />
        </motion.div>

        {data.dicas && Object.keys(data.dicas).length > 0 && (
          <AnimatedSection>
            <DestinationTipsPanel dicas={data.dicas} labels={tipLabels} preferences={travelPreferences} defaultOpenCount={3} />
          </AnimatedSection>
        )}

        {data.descricaoCompleta && data.descricaoCompleta !== summary && (
          <AnimatedSection>
            <Card className="bg-white/70 dark:bg-gray-800/60 backdrop-blur-md hover:shadow-lg transition-all duration-300">
              <CardHeader><CardTitle className="dark:text-white">{t('moreInfo')}</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">{data.descricaoCompleta}</p></CardContent>
            </Card>
          </AnimatedSection>
        )}

        <HotelsSection hotels={data.hotels} hotelTypes={data.hotelTypes} t={t} />
        <AttributionFooter wikivoyageUrl={data.wikivoyageUrl} license={data.license} t={t} />
      </div>
    </div>
  );
}
