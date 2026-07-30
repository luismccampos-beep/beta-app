'use client';

import { lazy, Suspense } from 'react';
import { useDestinationTranslations } from '@/lib/i18n-namespaces';

import type { DestinationMapMarker } from '@/lib/travel/destination-map';

const DestinationMapLeaflet = lazy(
  () => import('./DestinationMapLeaflet').then((m) => ({ default: m.DestinationMapLeaflet })),
);

export type DestinationCardMapProps = {
  markers: DestinationMapMarker[];
  className?: string;
};

export function DestinationCardMap({ markers, className }: DestinationCardMapProps) {
  const t = useDestinationTranslations();

  if (!markers.length) return null;

  return (
    <div
      className={
        className ??
        'h-32 w-full overflow-hidden border-t border-primary-100/80 dark:border-primary-900/40 bg-primary-50/30 dark:bg-gray-900/40 [&_.leaflet-container]:pointer-events-none sm:[&_.leaflet-container]:pointer-events-auto'
      }
      aria-label={t('mapTitle')}
    >
      <Suspense
        fallback={
          <div className="h-full w-full animate-pulse bg-primary-100/40 dark:bg-primary-900/30" aria-hidden />
        }
      >
        <DestinationMapLeaflet
          markers={markers}
          destinationLabel={t('mapDestination')}
          airportLabel={t('mapAirport')}
          hotelLabel={t('mapHotel')}
          compact
        />
      </Suspense>
    </div>
  );
}
