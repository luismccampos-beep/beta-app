'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Bed,
  MapPin,
  Plane,
  Sparkles,
  UtensilsCrossed,
  Bus,
  AlertCircle,
  Search,
} from 'lucide-react';

import type { RecommendedDestinationDto } from '../../../lib/travel/recommend-api-types';
import { destinationDetailPath } from '../../../lib/travel/destination-path';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { DESTINATION_PLACEHOLDER, onDestinationImageError } from './destination-image-fallback';

export type RecommendedDestinationCardLabels = {
  match: string;
  estimatedTrip: string;
  accommodation: string;
  food: string;
  transport: string;
  flight: string;
  total: string;
  withinBudget: string;
  overBudget: string;
  estimateNote: string;
  viewDestination: string;
  searchLive: string;
  perNight: string;
  travelers: string;
  nights: string;
};

export type RecommendedDestinationCardProps = {
  item: RecommendedDestinationDto;
  locale: string;
  labels: RecommendedDestinationCardLabels;
  detailQuery: string;
  onSearchLive?: () => void;
};

export function RecommendedDestinationCard({
  item,
  locale,
  labels,
  detailQuery,
  onSearchLive,
}: RecommendedDestinationCardProps) {
  const { cost } = item;
  const currency = cost.currency;
  const detailHref = `${destinationDetailPath(item.slug, locale)}?${detailQuery}`;

  return (
    <Card className="overflow-hidden border-0 shadow-lg ring-1 ring-primary-200/70 dark:ring-primary-900/50 dark:bg-gray-800">
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={item.imageUrl || DESTINATION_PLACEHOLDER}
          alt={item.nome}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
          onError={onDestinationImageError}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
        <div className="absolute top-2 right-2 flex flex-wrap gap-1 justify-end">
          <Badge className="border-0 bg-gradient-to-r from-primary to-accent text-white">
            <Sparkles className="mr-1 h-3 w-3" />
            {item.matchPercent}% {labels.match}
          </Badge>
          <Badge
            variant="secondary"
            className={
              cost.withinBudget
                ? 'bg-emerald-600/90 text-white border-0'
                : 'bg-amber-600/90 text-white border-0'
            }
          >
            {cost.withinBudget ? labels.withinBudget : labels.overBudget}
          </Badge>
        </div>
        <div className="absolute bottom-2 left-3 right-3 text-white pr-1">
          <h3 className="text-base sm:text-lg font-bold leading-tight line-clamp-2">{item.nome}</h3>
          <p className="flex items-center gap-1 text-xs sm:text-sm text-white/90 truncate">
            <MapPin className="h-3.5 w-3.5" />
            {item.pais}
            {item.iata ? ` · ${item.iata}` : ''}
          </p>
        </div>
      </div>

      <CardContent className="space-y-3 p-3 sm:p-4">
        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-start gap-1">
          <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
          {labels.estimateNote}
        </p>

        <div className="rounded-lg bg-gray-50 dark:bg-gray-900/50 p-3 text-sm space-y-1.5">
          <p className="font-semibold text-gray-800 dark:text-gray-200">{labels.estimatedTrip}</p>
          <div className="flex justify-between gap-2 text-gray-600 dark:text-gray-400">
            <span className="flex items-center gap-1 min-w-0 shrink">
              <Bed className="h-3.5 w-3.5 shrink-0" /> {labels.accommodation}
            </span>
            <span className="shrink-0 text-right tabular-nums">
              {currency} {cost.accommodationTotal.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between gap-2 text-gray-600 dark:text-gray-400">
            <span className="flex items-center gap-1 min-w-0 shrink">
              <UtensilsCrossed className="h-3.5 w-3.5 shrink-0" /> {labels.food}
            </span>
            <span className="shrink-0 text-right tabular-nums">
              {currency} {cost.foodTotal.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between gap-2 text-gray-600 dark:text-gray-400">
            <span className="flex items-center gap-1 min-w-0 shrink">
              <Bus className="h-3.5 w-3.5 shrink-0" /> {labels.transport}
            </span>
            <span className="shrink-0 text-right tabular-nums">
              {currency} {cost.localTransportTotal.toLocaleString()}
            </span>
          </div>
          {cost.flightTotal != null && (
            <div className="flex justify-between gap-2 text-gray-600 dark:text-gray-400">
              <span className="flex items-center gap-1 min-w-0 shrink">
                <Plane className="h-3.5 w-3.5 shrink-0" /> {labels.flight}
              </span>
              <span className="shrink-0 text-right tabular-nums">
                {currency} {cost.flightTotal.toLocaleString()}
                {cost.flightIsEstimate ? ' *' : ''}
              </span>
            </div>
          )}
          <div className="flex justify-between gap-2 border-t border-gray-200 dark:border-gray-700 pt-2 font-semibold text-primary-700 dark:text-primary-200">
            <span>{labels.total}</span>
            <span className="shrink-0 text-right tabular-nums">
              {currency} {cost.tripTotal.toLocaleString()}
            </span>
          </div>
          <p className="text-xs text-gray-500 line-clamp-3 sm:line-clamp-none">
            {cost.nights} {labels.nights} · {cost.travelers} {labels.travelers}
            {item.hotel
              ? ` · ${item.hotel.nome} (${item.hotel.estrelas}★ · ${currency} ${item.hotel.preco_por_noite}/${labels.perNight})`
              : ''}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Button asChild variant="outline" className="w-full min-h-11 gap-1 touch-manipulation">
            <Link href={detailHref}>
              {labels.viewDestination}
              <ArrowRight className="h-4 w-4 shrink-0" />
            </Link>
          </Button>
          {item.iata && onSearchLive && (
            <Button
              type="button"
              className="w-full min-h-11 gap-1 bg-gradient-to-r from-primary to-accent touch-manipulation"
              onClick={onSearchLive}
            >
              <Search className="h-4 w-4" />
              {labels.searchLive}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
