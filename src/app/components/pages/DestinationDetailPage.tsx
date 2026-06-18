'use client';

import { useEffect, useRef, useState } from 'react';
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
  Globe,
  Thermometer,
  Languages,
  Banknote,
  Camera,
  Play,
  X,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

import { useDarkMode } from '../../../lib/use-dark-mode';
import { LanguageSwitcher } from '../../../components/LanguageSwitcher';
import { resultsListPath } from '../../../lib/travel/destination-path';
import type { DestinationTipsMap, TipSectionKey } from '../../../lib/travel/destination-tips';
import type { CompactTravelPreferences } from '../../../lib/travel/preference-match';
import { CostOfLivingBadge } from '../travel/CostOfLivingBadge';
import { DestinationConnectivityPanel } from '../travel/DestinationConnectivityPanel';
import { DestinationMap } from '../travel/DestinationMap';
import { LocalRoutePanel } from '../travel/LocalRoutePanel';
import { DestinationTipsPanel } from '../travel/DestinationTipsPanel';
import {
  tripGoEndpointsFromDestination,
} from '../../../lib/travel/tripgo-from-destination';
import {
  originFromResultsQuery,
  resolveOriginIata,
} from '../../../lib/travel/flight-connectivity';
import { summarizeCostOfLiving } from '../../../lib/travel/cost-tier';
import type { DestinationMapMarker } from '../../../lib/travel/destination-map';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  DESTINATION_PLACEHOLDER,
  onDestinationImageError,
} from '../travel/destination-image-fallback';

// ── Types ──────────────────────────────────────────────────────────────────────

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
  videoUrl?: string;
  galleryImages?: string[];
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
  /** Atribuição do fotógrafo para a imagem principal. */
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

// ── Animation variants ─────────────────────────────────────────────────────────

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

// ── Constants ──────────────────────────────────────────────────────────────────

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

// ── Sub-components ─────────────────────────────────────────────────────────────

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
    <motion.div variants={fadeInUp}>
      <Card className="group border-gray-200/60 dark:border-gray-700/60 bg-white/80 dark:bg-gray-800/60 backdrop-blur-sm hover:border-teal-300/60 dark:hover:border-teal-700/60 hover:shadow-md transition-all duration-300">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg dark:text-white">
            <Icon className="h-5 w-5 text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform duration-300" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <motion.ul
            className="space-y-2"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {items.map((item) => (
              <motion.li
                key={item}
                variants={fadeInUp}
                className="flex gap-2 text-sm text-gray-700 dark:text-gray-300 before:content-['•'] before:text-teal-500 dark:before:text-teal-400 before:font-bold"
              >
                <span>{item}</span>
              </motion.li>
            ))}
          </motion.ul>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/** Animated skeleton for loading state */
function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div
      className={`rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse ${className}`}
    />
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/20 to-orange-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Hero skeleton */}
      <div className="relative h-[42vh] min-h-[280px] max-h-[480px] w-full bg-gray-200 dark:bg-gray-800 animate-pulse" />
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12 space-y-8">
        <SkeletonCard className="h-32" />
        <SkeletonCard className="h-64" />
        <SkeletonCard className="h-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SkeletonCard className="h-40" />
          <SkeletonCard className="h-40" />
        </div>
      </div>
    </div>
  );
}

/** Inline lightbox gallery */
function DestinationGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images.length) return null;

  const prev = () =>
    setCurrentIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setCurrentIndex((i) => (i + 1) % images.length);
  const close = () => setLightboxOpen(false);

  // Keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxOpen]);

  return (
    <>
      <div className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
          <Camera className="h-4 w-4" />
          {title}
        </h3>
        <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
          {images.map((url, i) => (
            <motion.button
              key={url}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setCurrentIndex(i);
                setLightboxOpen(true);
              }}
              aria-label={`${title} ${i + 1} of ${images.length}`}
              className="relative shrink-0 w-40 h-28 rounded-xl overflow-hidden snap-start cursor-pointer ring-1 ring-gray-200/60 dark:ring-gray-700/60 hover:ring-teal-400 dark:hover:ring-teal-500 transition-all duration-200"
            >
              <img
                src={url}
                alt={`${title} ${i + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  const img = e.currentTarget;
                  if (!img.src.endsWith(DESTINATION_PLACEHOLDER)) {
                    img.src = DESTINATION_PLACEHOLDER;
                  }
                }}
              />
              <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-200" />
            </motion.button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              type="button"
              aria-label="Close gallery"
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              onClick={close}
            >
              <X className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Previous image"
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <motion.img
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              src={images[currentIndex]}
              alt={`${title} ${currentIndex + 1}`}
              className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
              onError={(e) => {
                const img = e.currentTarget;
                if (!img.src.endsWith(DESTINATION_PLACEHOLDER)) {
                  img.src = DESTINATION_PLACEHOLDER;
                }
              }}
            />
            <button
              type="button"
              aria-label="Next image"
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-sm">
              {currentIndex + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

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
    ...(Object.fromEntries(TIP_KEYS.map((k) => [k, t(k)])) as Record<
      TipSectionKey,
      string
    >),
  };
  const [data, setData] = useState<DestinationDetailData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const { isDark, toggle: toggleDark } = useDarkMode();

  const setLocaleCookie = (nextLocale: string) => {
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
    window.location.reload();
  };

  // ── Parallax hero ──────────────────────────────────────────────────────
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 180]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.5]);

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
        if (!cancelled)
          setError(e instanceof Error ? e.message : 'Erro ao carregar');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  // ── Loading state ──────────────────────────────────────────────────────
  if (loading) return <LoadingSkeleton />;

  // ── Error state ────────────────────────────────────────────────────────
  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-600 dark:text-red-400 text-lg font-medium"
        >
          {error ?? t('notFound')}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Button asChild variant="outline">
            <Link href={resultsHref}>{t('backToResults')}</Link>
          </Button>
        </motion.div>
      </div>
    );
  }

  const summary = data.resumo ?? data.descricao ?? data.descricaoCompleta ?? '';
  const hasVideo = Boolean(data.videoUrl);

  // ── Gallery images: explicit galleryImages or build from available ─────
  const galleryImages: string[] = data.galleryImages ?? [];
  if (
    galleryImages.length === 0 &&
    data.imageUrl &&
    !data.imageUrl.endsWith('/travel-images/placeholder.svg')
  ) {
    galleryImages.push(data.imageUrl);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/20 to-orange-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-500">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div
        ref={heroRef}
        className="relative h-[50vh] min-h-[320px] max-h-[520px] w-full overflow-hidden"
      >
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute inset-0 will-change-transform"
        >
          {hasVideo && showVideo ? (
            <video
              src={data.videoUrl}
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover"
            />
          ) : (
            <img
              src={data.imageUrl || DESTINATION_PLACEHOLDER}
              alt={data.nome}
              className="h-full w-full object-cover scale-105"
              onError={onDestinationImageError}
            />
          )}
        </motion.div>

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10 pointer-events-none" />

        {/* Video toggle (if video exists) */}
        {hasVideo && (
          <div className="absolute top-20 right-4 z-20">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => setShowVideo((v) => !v)}
              className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/15 backdrop-blur-md text-white text-sm hover:bg-white/25 transition-colors"
            >
              {showVideo ? (
                <>
                  <Camera className="h-4 w-4" />
                  {t('showPhoto') ?? 'Photo'}
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  {t('showVideo') ?? 'Video'}
                </>
              )}
            </motion.button>
          </div>
        )}

        {/* Top controls: Back button + Theme Toggle + Lang Selector */}
        <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-start">
          <div className="flex items-center gap-2">
            {onBackToResults ? (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Button
                  type="button"
                  variant="secondary"
                  className="gap-1 min-h-9 sm:min-h-11 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-0 shadow-lg hover:shadow-xl transition-all duration-200 text-xs sm:text-sm px-2 sm:px-4"
                  onClick={onBackToResults}
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">{t('backToResults')}</span>
                </Button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Button
                  variant="secondary"
                  asChild
                  className="gap-1 min-h-9 sm:min-h-11 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-0 shadow-lg hover:shadow-xl transition-all duration-200 text-xs sm:text-sm px-2 sm:px-4"
                >
                  <Link href={resultsHref}>
                    <ArrowLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">{t('backToResults')}</span>
                  </Link>
                </Button>
              </motion.div>
            )}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={toggleDark}
              className="p-2 rounded-lg bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-0 shadow-lg hover:shadow-xl transition-all duration-200"
              title={isDark ? 'Light mode' : 'Dark mode'}
            >
              {isDark ? <Sun className="h-4 w-4 text-orange-400" /> : <Moon className="h-4 w-4 text-gray-700" />}
            </motion.button>

            {/* Language Selector */}
            {/* Language Selector */}
            <LanguageSwitcher variant="overlay" showIcon={false} />
          </div>
        </div>

        {/* Photo attribution overlay */}
        {data.imageAttribution?.fotografo && (
          <div className="absolute bottom-4 right-4 z-10 pointer-events-none">
            {data.imageAttribution.fotografo_url ? (
              <a
                href={data.imageAttribution.fotografo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/30 backdrop-blur-sm text-white/80 text-xs hover:bg-black/50 hover:text-white transition-all duration-200 pointer-events-auto"
              >
                <Camera className="h-3 w-3" />
                <span>
                  {t('photoBy', { name: data.imageAttribution.fotografo })}
                </span>
                {data.imageAttribution.fonte?.trim() && (
                  <span className="opacity-60">
                    {t('onSource', { source: data.imageAttribution.fonte })}
                  </span>
                )}
              </a>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/30 backdrop-blur-sm text-white/80 text-xs pointer-events-auto">
                <Camera className="h-3 w-3" />
                <span>
                  {t('photoBy', { name: data.imageAttribution.fotografo })}
                </span>
                {data.imageAttribution.fonte?.trim() && (
                  <span className="opacity-60">
                    {t('onSource', { source: data.imageAttribution.fonte })}
                  </span>
                )}
              </span>
            )}
          </div>
        )}

        {/* Hero text */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-6 md:p-10 max-w-5xl pointer-events-none">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
            className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg"
          >
            {data.nome}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease: 'easeOut' }}
            className="mt-2 flex flex-wrap items-center gap-3 text-white/90"
          >
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {data.pais}, {data.continente}
            </span>
            {data.iata && (
              <Badge
                variant="secondary"
                className="bg-white/20 text-white border-0 backdrop-blur-sm"
              >
                {data.iata}
              </Badge>
            )}
            <span className="flex items-center gap-1 text-sm">
              <Clock className="h-4 w-4" />
              {data.tipo} · {data.clima}
            </span>
            {costSummary && (
              <CostOfLivingBadge
                cost={costSummary}
                className="bg-white/20 text-white backdrop-blur-sm"
              />
            )}
          </motion.p>
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12 space-y-10">
        {/* ── Quick Facts Bar ─────────────────────────────────────────────── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          {[
            {
              icon: Globe,
              label: t('continent') ?? 'Continente',
              value: data.continente,
              accent: 'text-blue-600 dark:text-blue-400',
              bg: 'bg-blue-50/80 dark:bg-blue-950/30',
              border: 'border-blue-100 dark:border-blue-900/40',
            },
            {
              icon: Thermometer,
              label: t('climate') ?? 'Clima',
              value: data.clima,
              accent: 'text-orange-600 dark:text-orange-400',
              bg: 'bg-orange-50/80 dark:bg-orange-950/30',
              border: 'border-orange-100 dark:border-orange-900/40',
            },
            {
              icon: Languages,
              label: t('type') ?? 'Tipo',
              value: data.tipo,
              accent: 'text-violet-600 dark:text-violet-400',
              bg: 'bg-violet-50/80 dark:bg-violet-950/30',
              border: 'border-violet-100 dark:border-violet-900/40',
            },
            {
              icon: Banknote,
              label: t('budget') ?? 'Orçamento',
              value:
                (() => {
                  const o = data.custo_de_vida?.orcamentos?.mochileiro;
                  return o
                    ? `${o.moeda} ${o.total_dia}/dia`
                    : data.custo_de_vida?.moeda ?? '—';
                })(),
              accent: 'text-emerald-600 dark:text-emerald-400',
              bg: 'bg-emerald-50/80 dark:bg-emerald-950/30',
              border: 'border-emerald-100 dark:border-emerald-900/40',
            },
          ].map((fact, i) => (
            <motion.div
              key={fact.label}
              variants={scaleIn}
              className={`rounded-xl ${fact.bg} ${fact.border} border p-3 backdrop-blur-sm hover:shadow-md transition-all duration-300`}
            >
              <fact.icon className={`h-4 w-4 ${fact.accent} mb-1`} />
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {fact.label}
              </p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white capitalize line-clamp-1">
                {fact.value}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Summary ─────────────────────────────────────────────────────── */}
        {summary && (
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            <Card className="border-teal-200/50 dark:border-teal-800/50 bg-white/70 dark:bg-gray-800/60 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-xl dark:text-white">
                  {t('cardSummary')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">
                  {summary}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* ── Gallery ─────────────────────────────────────────────────────── */}
        {galleryImages.length > 0 && (
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            <DestinationGallery
              images={galleryImages}
              title={t('gallery') ?? 'Galeria'}
            />
          </motion.div>
        )}

        {/* ── Map ─────────────────────────────────────────────────────────── */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <DestinationMap data={data} markers={data.mapMarkers} />
        </motion.div>

        {/* ── Wikipedia / History ─────────────────────────────────────────── */}
        {data.wikipedia_resumo && (
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            <Card className="bg-white/70 dark:bg-gray-800/60 backdrop-blur-md border-violet-200/40 dark:border-violet-900/40 hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg dark:text-white">
                  <BookOpen className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                  {t('historyTitle')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {data.wikipedia_resumo}
                </p>
                {data.wikipedia_url && (
                  <a
                    href={data.wikipedia_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-violet-600 dark:text-violet-400 hover:underline inline-flex items-center gap-1 transition-colors"
                  >
                    Wikipedia
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* ── Weather ─────────────────────────────────────────────────────── */}
        {data.clima_tempo && data.clima_tempo.temperatura_c != null && (
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            <Card className="bg-white/70 dark:bg-gray-800/60 backdrop-blur-md border-sky-200/40 dark:border-sky-900/40 hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg dark:text-white">
                  <CloudSun className="h-5 w-5 text-sky-500" />
                  {t('weatherTitle')}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-4 text-sm">
                <div>
                  <p className="text-4xl font-bold text-sky-600 dark:text-sky-400">
                    {Math.round(data.clima_tempo.temperatura_c)}°C
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 capitalize mt-1">
                    {data.clima_tempo.descricao}
                  </p>
                </div>
                {data.clima_tempo.sensacao_c != null && (
                  <p className="text-gray-600 dark:text-gray-400 self-end">
                    {t('feelsLike')}: {Math.round(data.clima_tempo.sensacao_c)}
                    °C
                  </p>
                )}
                {data.clima_tempo.humidade_pct != null && (
                  <p className="text-gray-600 dark:text-gray-400 self-end">
                    {t('humidity')}: {data.clima_tempo.humidade_pct}%
                  </p>
                )}
                <p className="text-xs text-gray-400 dark:text-gray-500 w-full">
                  {t('weatherSnapshot')}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* ── Budget ──────────────────────────────────────────────────────── */}
        {data.custo_de_vida?.orcamentos && (
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            <Card className="bg-white/70 dark:bg-gray-800/60 backdrop-blur-md border-emerald-200/40 dark:border-emerald-900/40 hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg dark:text-white">
                  <Wallet className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  {t('budgetTitle')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  {t('budgetHint')}
                </p>
                {data.custo_de_vida.fonte && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
                    {data.custo_de_vida.fonte}
                  </p>
                )}
                <div className="grid sm:grid-cols-3 gap-3">
                  {(
                    ['mochileiro', 'conforto', 'luxo'] as const
                  ).map((perfil) => {
                    const o = data.custo_de_vida?.orcamentos?.[perfil];
                    if (!o) return null;
                    return (
                      <motion.div
                        key={perfil}
                        whileHover={{ scale: 1.02, y: -2 }}
                        className="rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 p-4 border border-emerald-100 dark:border-emerald-900/50 hover:shadow-md transition-all duration-200"
                      >
                        <p className="font-semibold text-sm dark:text-white">
                          {t(`budget_${perfil}`)}
                        </p>
                        <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mt-1">
                          {o.moeda} {o.total_dia}
                          <span className="text-xs font-normal text-gray-500 dark:text-gray-400">
                            /{t('perDay')}
                          </span>
                        </p>
                        {o.itens?.slice(0, 2).map((line) => (
                          <p
                            key={line}
                            className="text-xs text-gray-600 dark:text-gray-400 mt-2 line-clamp-1"
                          >
                            {line}
                          </p>
                        ))}
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* ── Transport ───────────────────────────────────────────────────── */}
        {data.transporte?.aeroporto && (
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            <Card className="bg-white/70 dark:bg-gray-800/60 backdrop-blur-md border-sky-200/40 dark:border-sky-900/40 hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg dark:text-white">
                  <Plane className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                  {t('transportTitle')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t('transportHint')}
                </p>
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
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {t(
                      `transportMatch_${data.transporte.aeroporto.match}`,
                    )}
                    {data.transporte.aeroporto.distancia_km != null &&
                      data.transporte.aeroporto.distancia_km > 0 &&
                      ` · ${data.transporte.aeroporto.distancia_km} km`}
                  </p>
                </div>
                {data.transporte.rede && (
                  <>
                    <div className="grid sm:grid-cols-2 gap-3 text-sm">
                      <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                        <p className="text-xs text-gray-500">
                          {t('transportDirectRoutes')}
                        </p>
                        <p className="text-xl font-semibold dark:text-white">
                          {data.transporte.rede.ligacoes_diretas}
                        </p>
                      </div>
                      {(
                        data.transporte.rede.hubs_com_ligacao?.length ?? 0
                      ) > 0 && (
                        <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                          <p className="text-xs text-gray-500 mb-2">
                            {t('transportHubs')}
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {data.transporte.rede.hubs_com_ligacao!.map(
                              (hub) => (
                                <Badge
                                  key={hub}
                                  variant="secondary"
                                  className="font-mono"
                                >
                                  {hub}
                                </Badge>
                              ),
                            )}
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
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {data.transporte.fonte}
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* ── TripGo ──────────────────────────────────────────────────────── */}
        {data && tripGoEndpointsFromDestination(data) && (
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            <Card className="bg-white/70 dark:bg-gray-800/60 backdrop-blur-md border-violet-200/40 dark:border-violet-900/40 hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg dark:text-white">
                  <Bus className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                  {t('tripgo.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  {t('tripgo.subtitle')}
                </p>
                <LocalRoutePanel
                  {...tripGoEndpointsFromDestination(data)!}
                />
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* ── Tags ────────────────────────────────────────────────────────── */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-wrap gap-2"
        >
          {data.tags.map((tag, i) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Badge className="bg-teal-100/90 text-teal-900 dark:bg-teal-900/60 dark:text-teal-100 border-0 px-3 py-1 text-sm hover:bg-teal-200 dark:hover:bg-teal-800/80 transition-colors">
                {tag}
              </Badge>
            </motion.span>
          ))}
        </motion.div>

        {/* ── See / Do / Eat ──────────────────────────────────────────────── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid md:grid-cols-2 gap-6"
        >
          <SectionBlock title={t('cardSee')} icon={Eye} items={data.veja} />
          <SectionBlock title={t('cardDo')} icon={Compass} items={data.faca} />
          <SectionBlock title={t('cardEat')} icon={UtensilsCrossed} items={data.coma} />
        </motion.div>

        {/* ── Tips ────────────────────────────────────────────────────────── */}
        {data.dicas && Object.keys(data.dicas).length > 0 && (
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            <DestinationTipsPanel
              dicas={data.dicas}
              labels={tipLabels}
              preferences={travelPreferences}
              defaultOpenCount={3}
            />
          </motion.div>
        )}

        {/* ── More Info ───────────────────────────────────────────────────── */}
        {data.descricaoCompleta && data.descricaoCompleta !== summary && (
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            <Card className="bg-white/70 dark:bg-gray-800/60 backdrop-blur-md hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="dark:text-white">
                  {t('moreInfo')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {data.descricaoCompleta}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* ── Hotels ──────────────────────────────────────────────────────── */}
        {data.hotels.length > 0 && (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 dark:text-white">
              <Hotel className="h-5 w-5 text-teal-600 dark:text-teal-400" />
              {t('hotels')}
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {data.hotels.map((h, i) => (
                <motion.div
                  key={h.id}
                  variants={fadeInUp}
                  whileHover={{ y: -2 }}
                  className="h-full"
                >
                  <Card className="bg-white/70 dark:bg-gray-800/60 backdrop-blur-sm hover:shadow-md hover:border-teal-200/50 dark:hover:border-teal-700/50 transition-all duration-200 h-full">
                    <CardContent className="pt-4">
                      <p className="font-semibold dark:text-white">
                        {h.nome}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        {h.estrelas} ★ · EUR {h.preco_por_noite}
                        /noite
                      </p>
                      {h.comodidades.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {h.comodidades.slice(0, 4).map((c) => (
                            <Badge
                              key={c}
                              variant="outline"
                              className="text-xs"
                            >
                              {c}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Attribution ─────────────────────────────────────────────────── */}
        {data.wikivoyageUrl && (
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="rounded-xl border border-dashed border-gray-300 dark:border-gray-600 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/50 dark:bg-gray-800/40 backdrop-blur-sm"
          >
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t('attribution', { license: data.license ?? 'CC BY-SA 3.0' })}
            </p>
            <Button
              asChild
              variant="outline"
              className="gap-2 min-h-11 shrink-0 touch-manipulation hover:bg-teal-50 dark:hover:bg-teal-950/30 transition-colors"
            >
              <a
                href={data.wikivoyageUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('viewFullArticle')}
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
