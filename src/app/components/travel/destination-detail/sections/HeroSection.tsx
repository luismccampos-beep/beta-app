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
import type { CostOfLivingSummary } from '../../../../../lib/travel/cost-tier';
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
  costSummary: CostOfLivingSummary | null;
  isDark: boolean;
  toggleDark: () => void;
  resultsHref: string;
  onBackToResults?: () => void;
  t: (key: string, values?: Record<string, string>) => string;
}) {
  return (
    <div className="relative h-[60vh] min-h-[400px] max-h-[650px] w-full overflow-hidden">
      <DestinationVideoHero
        imageUrl={data.imageUrl || DESTINATION_PLACEHOLDER}
        imageAlt={displayNome}
        video={data.videos?.[0] ?? null}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent pointer-events-none" />
      
      <div className="absolute top-6 left-6 right-6 z-10 flex justify-between items-start">
        <div className="flex items-center gap-2">
          {onBackToResults ? (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <Button type="button" variant="secondary" className="gap-2 min-h-12 bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/20 text-white shadow-2xl hover:bg-white/20 transition-all px-5 rounded-xl font-bold uppercase tracking-widest text-xs" onClick={onBackToResults}>
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">{t('backToResults')}</span>
              </Button>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <Button variant="secondary" asChild className="gap-2 min-h-12 bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/20 text-white shadow-2xl hover:bg-white/20 transition-all px-5 rounded-xl font-bold uppercase tracking-widest text-xs">
                <Link href={resultsHref}>
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">{t('backToResults')}</span>
                </Link>
              </Button>
            </motion.div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            type="button" onClick={toggleDark}
            className="p-3 rounded-xl bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/20 text-white shadow-2xl hover:bg-white/20 transition-all"
            title={isDark ? 'Light mode' : 'Dark mode'}
          >
            {isDark ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5" />}
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
            className="p-3 rounded-xl bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/20 text-white shadow-2xl hover:bg-white/20 transition-all"
            title={t('share')}
          >
            <Share2 className="h-5 w-5" />
          </motion.button>

          <LanguageSwitcher variant="overlay" className="!bg-white/10 !dark:bg-black/20 !border-white/20" showIcon={false} />
        </div>
      </div>

      {data.imageAttribution?.fotografo && (
        <div className="absolute bottom-6 right-6 z-10 pointer-events-none">
          {data.imageAttribution.fotografo_url ? (
            <a href={data.imageAttribution.fotografo_url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white/90 text-xs font-bold hover:bg-white/20 transition-all pointer-events-auto shadow-2xl"
            >
              <Camera className="h-3.5 w-3.5" />
              <span>{t('photoBy', { name: data.imageAttribution.fotografo })}</span>
            </a>
          ) : (
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white/90 text-xs font-bold pointer-events-auto shadow-2xl">
              <Camera className="h-3.5 w-3.5" />
              <span>{t('photoBy', { name: data.imageAttribution.fotografo })}</span>
            </span>
          )}
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 z-10 p-8 md:p-12 lg:p-16 max-w-6xl pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, y: 40 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange/20 text-orange-200 text-xs font-black uppercase tracking-[0.2em] mb-4 border border-orange/30 backdrop-blur-md">
            <MapPin size={12} />
            {data.pais}, {data.continente}
          </div>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white leading-[0.9] tracking-tighter uppercase italic drop-shadow-2xl mb-6">
            {displayNome}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-white font-bold uppercase tracking-widest text-sm">
            {data.iata && <Badge variant="secondary" className="bg-white/20 text-white border border-white/30 backdrop-blur-md px-3 py-1 font-black">{data.iata}</Badge>}
            <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
              <Clock className="h-4 w-4 text-green" />
              <span>{data.tipo} · {data.clima}</span>
            </div>
            {costSummary && <CostOfLivingBadge cost={costSummary} className="bg-black/30 border border-white/10 text-white backdrop-blur-md px-4 py-2 h-auto rounded-xl font-bold" />}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
