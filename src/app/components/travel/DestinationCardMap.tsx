'use client';

import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';

import type { DestinationMapMarker } from '../../../lib/travel/destination-map';

const DestinationMapLeaflet = dynamic(
  () => import('./DestinationMapLeaflet').then((m) => m.DestinationMapLeaflet),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full animate-pulse bg-teal-100/40 dark:bg-teal-950/30" aria-hidden />
    ),
  },
);

export type DestinationCardMapProps = {
  markers: DestinationMapMarker[];
  className?: string;
};

export function DestinationCardMap({ markers, className }: DestinationCardMapProps) {
  const t = useTranslations('destination');

  if (!markers.length) return null;

  return (
    <div
      className={
        className ??
        'h-32 w-full overflow-hidden border-t border-teal-100/80 dark:border-teal-900/40 bg-teal-50/30 dark:bg-gray-900/40 [&_.leaflet-container]:pointer-events-none sm:[&_.leaflet-container]:pointer-events-auto'
      }
      aria-label={t('mapTitle')}
    >
      <DestinationMapLeaflet
        markers={markers}
        destinationLabel={t('mapDestination')}
        airportLabel={t('mapAirport')}
        hotelLabel={t('mapHotel')}
        compact
      />
    </div>
  );
}
