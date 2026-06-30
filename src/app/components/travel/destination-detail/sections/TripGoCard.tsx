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
      <Card className="card-premium dark:bg-gray-900 group">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl font-black text-gray-950 dark:text-white uppercase tracking-tighter">
            <div className="p-2 rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400">
              <Bus className="h-5 w-5" />
            </div>
            {t('tripgo.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-6">{t('tripgo.subtitle')}</p>
          <LocalRoutePanel {...endpoints} />
        </CardContent>
      </Card>
    </AnimatedSection>
  );
}
