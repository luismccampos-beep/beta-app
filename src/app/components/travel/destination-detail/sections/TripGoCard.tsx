'use client';

import { Bus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../ui/card';
import { LocalRoutePanel } from '../../../travel/LocalRoutePanel';
import { tripGoEndpointsFromDestination } from '../../../../../lib/travel/tripgo-from-destination';
import { AnimatedSection } from '../components/AnimatedSection';
import type { DestinationDetailData } from '../DestinationDetailPage';

export function TripGoCard({
  data,
  t,
}: {
  data: DestinationDetailData;
  t: (key: string) => string;
}) {
  const endpoints = tripGoEndpointsFromDestination(data);
  if (!endpoints) return null;
  return (
    <AnimatedSection>
      <Card className="bg-white/70 dark:bg-gray-800/60 backdrop-blur-md border-violet-200/40 dark:border-violet-900/40 hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg dark:text-white">
            <Bus className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            {t('tripgo.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">{t('tripgo.subtitle')}</p>
          <LocalRoutePanel {...endpoints} />
        </CardContent>
      </Card>
    </AnimatedSection>
  );
}
