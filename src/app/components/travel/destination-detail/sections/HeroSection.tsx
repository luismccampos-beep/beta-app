'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Camera, Clock, MapPin, Moon, Share2, Sun } from 'lucide-react';
import { Button } from '../../../ui/button';
import { Badge } from '../../../ui/badge';
import { LanguageSwitcher } from '../../../../../components/LanguageSwitcher';
import { CostOfLivingBadge } from '../../../travel/CostOfLivingBadge';
import { DestinationVideoHero } from '../../../travel/DestinationVideoHero';
import { DESTINATION_PLACEHOLDER } from '../../../travel/destination-image-fallback';
import type { DestinationDetailData } from '../DestinationDetailPage';

export function HeroSection({
  data,
  displayNome,
  costSummary,
  isDark,
  toggleDark,
  resultsHref,
  onBackToResults,
  t,
}: {
  data: DestinationDetailData;
  displayNome: string;
  costSummary: { level: string; label: string } | null;
  isDark: boolean;
  toggleDark: () => void;
  resultsHref: string;
  onBackToResults?: () => void;
  t: (key: string) => string;
}) {
  return (
    <div className="relative h-[50vh] min-h-[320px] max-h-[520px] w-full">
      <DestinationVideoHero
        imageUrl={data.imageUrl || DESTINATION_PLACEHOLDER}
        imageAlt={displayNome}
        video={data.videos?.[0] ?? null}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10 pointer-events-none" />
      <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-start">
        <div className="flex items-center gap-2">
          {onBackToResults ? (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <Button type="button" variant="secondary" className="gap-1 min-h-9 sm:min-h-11 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-0 shadow-lg hover:shadow-xl transition-all duration-200 text-xs sm:text-sm px-2 sm:px-4" onClick={onBackToResults}>
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">{t('backToResults')}</span>
              </Button>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <Button variant="secondary" asChild className="gap-1 min-h-9 sm:min-h-11 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-0 shadow-lg hover:shadow-xl transition-all duration-200 text-xs sm:text-sm px-2 sm:px-4">
                <Link href={resultsHref}>
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">{t('backToResults')}</span>
                </Link>
              </Button>
            </motion.div>
          )}
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            type="button" onClick={toggleDark}
            className="p-2 rounded-lg bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-0 shadow-lg hover:shadow-xl transition-all duration-200"
            title={isDark ? 'Light mode' : 'Dark mode'}
          >
            {isDark ? <Sun className="h-4 w-4 text-orange-400" /> : <Moon className="h-4 w-4 text-gray-700" />}
          </motion.button>

          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => {
              if (typeof navigator !== 'undefined' && navigator.share) {
                navigator.share({ title: displayNome, url: window.location.href }).catch(() => {});
              } else {
                navigator.clipboard.writeText(window.location.href).catch(() => {});
              }
            }}
            className="p-2 rounded-lg bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-0 shadow-lg hover:shadow-xl transition-all duration-200"
            title={t('share')}
          >
            <Share2 className="h-4 w-4 text-gray-700 dark:text-gray-300" />
          </motion.button>

          <LanguageSwitcher variant="overlay" showIcon={false} />
        </div>
      </div>

      {data.imageAttribution?.fotografo && (
        <div className="absolute bottom-4 right-4 z-10 pointer-events-none">
          {data.imageAttribution.fotografo_url ? (
            <a href={data.imageAttribution.fotografo_url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/30 backdrop-blur-sm text-white/80 text-xs hover:bg-black/50 hover:text-white transition-all duration-200 pointer-events-auto"
            >
              <Camera className="h-3 w-3" />
              <span>{t('photoBy', { name: data.imageAttribution.fotografo })}</span>
              {data.imageAttribution.fonte?.trim() && <span className="opacity-60">{t('onSource', { source: data.imageAttribution.fonte })}</span>}
            </a>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/30 backdrop-blur-sm text-white/80 text-xs pointer-events-auto">
              <Camera className="h-3 w-3" />
              <span>{t('photoBy', { name: data.imageAttribution.fotografo })}</span>
              {data.imageAttribution.fonte?.trim() && <span className="opacity-60">{t('onSource', { source: data.imageAttribution.fonte })}</span>}
            </span>
          )}
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 z-10 p-6 md:p-10 max-w-5xl pointer-events-none">
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg"
        >
          {displayNome}
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25, ease: 'easeOut' }}
          className="mt-2 flex flex-wrap items-center gap-3 text-white/90"
        >
          <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{data.pais}, {data.continente}</span>
          {data.iata && <Badge variant="secondary" className="bg-white/20 text-white border-0 backdrop-blur-sm">{data.iata}</Badge>}
          <span className="flex items-center gap-1 text-sm"><Clock className="h-4 w-4" />{data.tipo} · {data.clima}</span>
          {costSummary && <CostOfLivingBadge cost={costSummary} className="bg-white/20 text-white backdrop-blur-sm" />}
        </motion.p>
      </div>
    </div>
  );
}
