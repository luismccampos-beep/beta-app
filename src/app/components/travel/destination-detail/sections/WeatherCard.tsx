'use client';

import { CloudSun } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../ui/card';
import { AnimatedSection } from '../components/AnimatedSection';
import type { DestinationDetailData } from '../DestinationDetailPage';

export function WeatherCard({
  clima_tempo,
  t,
}: {
  clima_tempo: NonNullable<DestinationDetailData['clima_tempo']>;
  t: (key: string) => string;
}) {
  if (clima_tempo.temperatura_c == null) return null;
  return (
    <AnimatedSection>
      <Card className="card-premium dark:bg-gray-900 group">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl font-black text-gray-950 dark:text-white uppercase tracking-tighter">
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-500">
              <CloudSun className="h-5 w-5" />
            </div>
            {t('weatherTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-6 text-sm">
          <div className="flex items-end gap-2">
            <p className="text-6xl font-black text-sky-600 dark:text-sky-400 tracking-tighter">{Math.round(clima_tempo.temperatura_c)}°C</p>
            <p className="text-lg font-bold text-gray-500 dark:text-gray-400 capitalize mb-1">{clima_tempo.descricao}</p>
          </div>
          <div className="flex flex-wrap gap-4 w-full pt-2 border-t border-gray-100 dark:border-gray-800">
            {clima_tempo.sensacao_c != null && (
              <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{t('feelsLike')}: <span className="text-sky-600 dark:text-sky-400">{Math.round(clima_tempo.sensacao_c)}°C</span></p>
            )}
            {clima_tempo.humidade_pct != null && (
              <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{t('humidity')}: <span className="text-sky-600 dark:text-sky-400">{clima_tempo.humidade_pct}%</span></p>
            )}
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-600">{t('weatherSnapshot')}</p>
        </CardContent>
      </Card>
    </AnimatedSection>
  );
}
