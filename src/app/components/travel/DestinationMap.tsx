'use client';

import dynamic from 'next/dynamic';
import { ExternalLink, MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';

import {
  osmViewUrl,
  resolveDestinationMapMarkers,
  type DestinationMapInput,
  type DestinationMapMarker,
} from '../../../lib/travel/destination-map';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const DestinationMapLeaflet = dynamic(
  () => import('./DestinationMapLeaflet').then((m) => m.DestinationMapLeaflet),
  {
    ssr: false,
    loading: () => (
      <div
        className="h-[min(360px,50vh)] w-full animate-pulse rounded-xl bg-primary-100/50 dark:bg-primary-900/30"
        aria-hidden
      />
    ),
  },
);

export type DestinationMapProps = {
  data: DestinationMapInput;
  /** Quando vindo da API (destino + aeroporto + hotéis). */
  markers?: DestinationMapMarker[];
  className?: string;
};

export function DestinationMap({ data, markers: markersFromApi, className }: DestinationMapProps) {
  const t = useTranslations('destination');
  const markers =
    markersFromApi && markersFromApi.length > 0
      ? markersFromApi
      : resolveDestinationMapMarkers(data);

  if (!markers.length) return null;

  const primary = markers.find((m) => m.kind === 'destination') ?? markers[0]!;
  const osmHref = osmViewUrl(primary.lat, primary.lon, markers.length > 1 ? 10 : 12);

  return (
    <Card
      className={
        className ??
        'overflow-hidden dark:bg-gray-800/80 border-primary-200/50 dark:border-primary-900/40'
      }
    >
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-lg dark:text-white">
          <MapPin className="h-5 w-5 text-primary" />
          {t('mapTitle')}
        </CardTitle>
        <a
          href={osmHref}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-primary dark:text-primary-300 hover:underline inline-flex items-center gap-1 shrink-0"
        >
          {t('mapOpenOsm')}
          <ExternalLink className="h-3 w-3" />
        </a>
      </CardHeader>
      <CardContent className="space-y-2 p-3 pt-0">
        <div className="h-[min(360px,50vh)] w-full overflow-hidden rounded-xl border border-primary-100 dark:border-primary-900/50">
          <DestinationMapLeaflet
            markers={markers}
            destinationLabel={t('mapDestination')}
            airportLabel={t('mapAirport')}
            hotelLabel={t('mapHotel')}
          />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">{t('mapAttribution')}</p>
      </CardContent>
    </Card>
  );
}
