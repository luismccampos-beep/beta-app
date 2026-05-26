'use client';

import { Plane } from 'lucide-react';

import type { AirportSummary } from '../../../lib/travel/transport-summary';
import { Badge } from '../ui/badge';

type DestinationAirportBadgeProps = {
  airport: AirportSummary;
  /** Tooltip / title extra (ex. hub LIS). */
  title?: string;
  className?: string;
};

export function DestinationAirportBadge({ airport, title, className = '' }: DestinationAirportBadgeProps) {
  const parts = [airport.iata];
  if (airport.directFromOrigin === true) {
    parts.push('direct');
  }
  if (airport.indicativePriceEur != null) {
    parts.push(`~€${airport.indicativePriceEur}`);
  }
  if (airport.distanciaKm != null && airport.distanciaKm > 0) {
    parts.push(`${airport.distanciaKm} km`);
  }
  if (airport.hubFrom && !airport.directFromOrigin) {
    parts.push(`← ${airport.hubFrom}`);
  }

  return (
    <Badge
      variant="secondary"
      title={title ?? parts.join(' · ')}
      className={`font-mono text-xs bg-sky-100 text-sky-900 dark:bg-sky-950/60 dark:text-sky-200 border-sky-200/80 dark:border-sky-800 ${className}`}
    >
      <Plane className="mr-1 h-3 w-3 shrink-0" />
      {parts.join(' · ')}
    </Badge>
  );
}
