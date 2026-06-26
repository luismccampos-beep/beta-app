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
      <Card className="bg-white/70 dark:bg-gray-800/60 backdrop-blur-md border-sky-200/40 dark:border-sky-900/40 hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg dark:text-white">
            <CloudSun className="h-5 w-5 text-sky-500" />
            {t('weatherTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4 text-sm">
          <div>
            <p className="text-4xl font-bold text-sky-600 dark:text-sky-400">{Math.round(clima_tempo.temperatura_c)}°C</p>
            <p className="text-gray-500 dark:text-gray-400 capitalize mt-1">{clima_tempo.descricao}</p>
          </div>
          {clima_tempo.sensacao_c != null && (
            <p className="text-gray-600 dark:text-gray-400 self-end">{t('feelsLike')}: {Math.round(clima_tempo.sensacao_c)}°C</p>
          )}
          {clima_tempo.humidade_pct != null && (
            <p className="text-gray-600 dark:text-gray-400 self-end">{t('humidity')}: {clima_tempo.humidade_pct}%</p>
          )}
          <p className="text-xs text-gray-400 dark:text-gray-500 w-full">{t('weatherSnapshot')}</p>
        </CardContent>
      </Card>
    </AnimatedSection>
  );
}
