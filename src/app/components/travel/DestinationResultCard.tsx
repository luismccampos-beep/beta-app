'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Clock,
  Eye,
  Heart,
  Leaf,
  MapPin,
  Sparkles,
  Star,
  Compass,
  Shield,
  Map,
  Expand,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import { cn } from '../ui/utils';

import type { TravelResult } from '../data/mockResults';
import { CostOfLivingBadge } from './CostOfLivingBadge';
import { DestinationAirportBadge } from './DestinationAirportBadge';
import { DestinationCardMap } from './DestinationCardMap';
import { HotelTypeBadge } from './HotelTypeBadge';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { DESTINATION_PLACEHOLDER, onDestinationImageError } from './destination-image-fallback';

export type DestinationResultCardProps = {
  result: TravelResult;
  href: string;
  labels: {
    aiMatch: string;
    matchExplain: string;
    sustainable: string;
    reviews: string;
    days: string;
    cardSummary: string;
    cardSee: string;
    cardDo: string;
    highlights: string;
    perPerson: string;
    viewDestination: string;
    from: string;
    showMap: string;
    hideMap: string;
    accommodationTypes?: Record<string, string>;
  };
  tipPreviews?: { label: string; text: string }[];
};

export function DestinationResultCard({ result, href, labels, tipPreviews = [] }: DestinationResultCardProps) {
  const card = result.destinationCard;
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const hasHighlights = (card?.veja?.length ?? 0) > 0 || (card?.faca?.length ?? 0) > 0;
  const showSecondaryInfo = !!(result.airport || result.costOfLiving);

  return (
    <Card className="group relative overflow-hidden border-0 bg-white dark:bg-gray-800 shadow-md hover:shadow-xl ring-1 ring-gray-200/60 dark:ring-gray-700/60 transition-all duration-300">
      {/* ── Hero Image ── */}
      <Link href={href} className="block relative aspect-video overflow-hidden">
        <Image
          src={result.imageUrl || DESTINATION_PLACEHOLDER}
          alt={result.destination}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          onError={onDestinationImageError}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Primary badge — top right */}
        <div className="absolute top-3 right-3">
          <Badge
            className="border-0 bg-black/60 backdrop-blur-sm text-white text-xs shadow-sm hover:bg-black/70 transition-colors"
            title={labels.matchExplain}
          >
            <Sparkles className="mr-1 h-3 w-3 text-orange-400" />
            {result.aiMatchScore}% {labels.aiMatch}
          </Badge>
        </div>

        {/* Sustainable tag — top left */}
        {result.sustainable && (
          <div className="absolute top-3 left-3">
            <Badge className="border-0 bg-emerald-500/90 backdrop-blur-sm text-white text-xs shadow-sm">
              <Leaf className="mr-1 h-3 w-3" />
              {labels.sustainable}
            </Badge>
          </div>
        )}

        {/* Destination name overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-xl font-bold leading-tight text-white drop-shadow-md">{result.destination}</h3>
          <p className="mt-1 flex items-center gap-1 text-sm text-white/85">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            {result.country}, {result.continent}
          </p>
        </div>
      </Link>

      {/* ── Compact meta row: rating · duration · secondary info · hotel types ── */}
      <div className="flex items-center gap-x-4 gap-y-1 px-4 pt-3 pb-1 text-xs text-gray-500 dark:text-gray-400 flex-wrap">
        <span className="inline-flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span className="font-semibold text-gray-900 dark:text-white">{result.rating}</span>
          <span className="text-gray-400 dark:text-gray-500">({result.reviews})</span>
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {result.duration} {labels.days}
        </span>
        {showSecondaryInfo && (
          <>
            {result.airport && <DestinationAirportBadge airport={result.airport} />}
            {result.costOfLiving && <CostOfLivingBadge cost={result.costOfLiving} />}
          </>
        )}
        {result.hotelTypes && Object.keys(result.hotelTypes).length > 0 &&
          Object.entries(result.hotelTypes)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 2)
            .map(([tipo, count]) => (
              <HotelTypeBadge
                key={tipo}
                tipo={tipo}
                count={count}
                label={labels.accommodationTypes?.[tipo] ?? tipo}
              />
            ))
        }
      </div>

      {/* ── Content ── */}
      <CardContent className="space-y-3 px-4 pb-4 pt-2">
        {/* Summary */}
        {card?.resumo ? (
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">{card.resumo}</p>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">
            {result.description.pt ?? result.description.en}
          </p>
        )}

        {/* Tips */}
        {tipPreviews.length > 0 && (
          <div className="space-y-1.5">
            {tipPreviews.map((tip) => (
              <div
                key={tip.label}
                className="rounded-lg border border-amber-200/60 dark:border-amber-900/30 bg-amber-50/50 dark:bg-amber-950/15 px-2.5 py-1.5 text-xs"
              >
                <span className="font-medium text-amber-800 dark:text-amber-300 inline-flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  {tip.label}
                </span>
                <span className="ml-1.5 text-gray-600 dark:text-gray-400 line-clamp-1">{tip.text}</span>
              </div>
            ))}
          </div>
        )}

        {/* Unified highlights row — See / Do chips */}
        {hasHighlights && (
          <div className="flex flex-wrap gap-1.5">
            {card?.veja?.slice(0, 2).map((item, idx) => (
              <span
                key={`see-${idx}`}
                className="inline-flex items-center gap-1 rounded-full bg-teal-50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-300 px-2 py-0.5 text-xs border border-teal-100/80 dark:border-teal-900/40"
              >
                <Eye className="h-3 w-3" />
                <span className="truncate max-w-[160px]">{item}</span>
              </span>
            ))}
            {card?.faca?.slice(0, 2).map((item, idx) => (
              <span
                key={`do-${idx}`}
                className="inline-flex items-center gap-1 rounded-full bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-300 px-2 py-0.5 text-xs border border-orange-100/80 dark:border-orange-900/30"
              >
                <Compass className="h-3 w-3" />
                <span className="truncate max-w-[160px]">{item}</span>
              </span>
            ))}
          </div>
        )}

        {/* Best-for tags */}
        {result.bestFor.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {result.bestFor.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-0"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* ── Collapsible map toggle ── */}
        {result.mapMarkers && result.mapMarkers.length > 0 && (
          <div>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setIsMapOpen(!isMapOpen);
              }}
              className={cn(
                'flex items-center gap-1.5 text-xs font-medium transition-colors',
                isMapOpen
                  ? 'text-teal-600 dark:text-teal-400'
                  : 'text-gray-400 dark:text-gray-500 hover:text-teal-600 dark:hover:text-teal-400'
              )}
            >
              <Map className="h-3.5 w-3.5" />
              {isMapOpen ? labels.hideMap : labels.showMap}
              {isMapOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
            {isMapOpen && (
              <div className="mt-2 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700 transition-all">
                <DestinationCardMap markers={result.mapMarkers} />
              </div>
            )}
          </div>
        )}

        {/* ── Price + CTA bar ── */}
        <div className="flex items-end justify-between gap-3 pt-2 border-t border-gray-100 dark:border-gray-700/60">
          <div className="min-w-0">
            <p className="text-xs text-gray-400 dark:text-gray-500 leading-none mb-0.5">{labels.from}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white tabular-nums leading-tight">
              {result.priceCurrency ?? 'EUR'} {result.price.toLocaleString()}
              <span className="ml-1 text-xs font-normal text-gray-400 dark:text-gray-500">{labels.perPerson}</span>
            </p>
          </div>
          <Button
            asChild
            className="shrink-0 gap-1.5 min-h-10 px-5 bg-gray-900 dark:bg-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 text-white text-sm font-medium shadow-sm transition-all hover:shadow-md"
          >
            <Link href={href}>
              {labels.viewDestination}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </div>
      </CardContent>

      {/* ── Hover action toolbar ── */}
      <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto translate-y-[-4px] group-hover:translate-y-0">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setIsSaved(!isSaved);
          }}
          className={cn(
            'rounded-full p-2 backdrop-blur-sm transition-all duration-200 shadow-sm',
            isSaved
              ? 'bg-red-500 text-white'
              : 'bg-black/40 text-white/90 hover:bg-red-500 hover:text-white'
          )}
          aria-label="Save destination"
        >
          <Heart className={cn('h-4 w-4', isSaved && 'fill-current')} />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setIsExpanded(true);
          }}
          className="rounded-full p-2 backdrop-blur-sm bg-black/40 text-white/90 hover:bg-teal-500 hover:text-white transition-all duration-200 shadow-sm"
          aria-label="View details"
        >
          <Expand className="h-4 w-4" />
        </button>
      </div>
      {/* ── Expand Dialog ── */}
      <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{result.destination}</DialogTitle>
            <DialogDescription>
              {result.country}, {result.continent}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {card?.resumo && (
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{card.resumo}</p>
            )}
            {(card?.veja?.length || card?.faca?.length) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {card.veja && card.veja.length > 0 && (
                  <div className="rounded-lg bg-gray-50 dark:bg-gray-900/50 p-3">
                    <p className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5 mb-1.5">
                      <Eye className="h-4 w-4 text-teal-600" />
                      {labels.cardSee}
                    </p>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      {card.veja.map((item, idx) => <li key={idx} className="line-clamp-2">• {item}</li>)}
                    </ul>
                  </div>
                )}
                {card.faca && card.faca.length > 0 && (
                  <div className="rounded-lg bg-gray-50 dark:bg-gray-900/50 p-3">
                    <p className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5 mb-1.5">
                      <Compass className="h-4 w-4 text-orange-500" />
                      {labels.cardDo}
                    </p>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      {card.faca.map((item, idx) => <li key={idx} className="line-clamp-2">• {item}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            )}
            {tipPreviews.length > 0 && (
              <div className="space-y-2">
                {tipPreviews.map((tip) => (
                  <div key={tip.label} className="rounded-lg border border-amber-200/60 dark:border-amber-900/30 bg-amber-50/50 dark:bg-amber-950/15 px-3 py-2 text-sm">
                    <p className="font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-1.5 mb-0.5">
                      <Shield className="h-4 w-4" />
                      {tip.label}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">{tip.text}</p>
                  </div>
                ))}
              </div>
            )}
            <div className="flex flex-wrap gap-1.5">
              {result.bestFor.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-0">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
