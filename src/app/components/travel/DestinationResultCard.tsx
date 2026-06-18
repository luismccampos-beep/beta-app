'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Clock,
  Eye,
  Heart,
  Leaf,
  MapPin,
  Sparkles,
  Star,
  Compass,
  Shield,
  Expand,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';

import type { TravelResult } from '../data/mockResults';
import { CostOfLivingBadge } from './CostOfLivingBadge';
import { DestinationAirportBadge } from './DestinationAirportBadge';
import { DestinationCardMap } from './DestinationCardMap';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader } from '../ui/card';
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
  };
  tipPreviews?: { label: string; text: string }[];
};

export function DestinationResultCard({ result, href, labels, tipPreviews = [] }: DestinationResultCardProps) {
  const card = result.destinationCard;
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="group overflow-hidden border-0 bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl ring-1 ring-gray-200/80 dark:ring-gray-700 transition-all duration-300">
      <Link href={href} className="block relative h-52 overflow-hidden">
        <img
          src={result.imageUrl || DESTINATION_PLACEHOLDER}
          alt={result.destination}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={onDestinationImageError}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
        <div className="absolute top-3 right-3 flex flex-wrap gap-2 justify-end max-w-[70%]">
          {result.airport && <DestinationAirportBadge airport={result.airport} />}
          {result.costOfLiving && <CostOfLivingBadge cost={result.costOfLiving} />}
          <Badge
            className="border-0 bg-gradient-to-r from-teal-500 to-orange-500 text-white shadow-md"
            title={labels.matchExplain}
          >
            <Sparkles className="mr-1 h-3 w-3" />
            {result.aiMatchScore}% {labels.aiMatch}
          </Badge>
        </div>
        {result.sustainable && (
          <div className="absolute top-3 left-3">
            <Badge className="border-0 bg-emerald-600 text-white">
              <Leaf className="mr-1 h-3 w-3" />
              {labels.sustainable}
            </Badge>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="text-xl font-bold leading-tight drop-shadow-sm">{result.destination}</h3>
          <p className="mt-1 flex items-center gap-1 text-sm text-white/90">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            {result.country}, {result.continent}
          </p>
        </div>
      </Link>

      {result.mapMarkers && result.mapMarkers.length > 0 && (
        <DestinationCardMap markers={result.mapMarkers} />
      )}

      <CardHeader className="pb-2 pt-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-600 dark:text-gray-400 min-w-0">
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-gray-900 dark:text-white">{result.rating}</span>
              <span className="text-xs">
                ({result.reviews} {labels.reviews})
              </span>
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {result.duration} {labels.days}
            </span>
          </div>
          <button
            type="button"
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-red-500 dark:hover:bg-gray-700"
            aria-label="Favorito"
            onClick={(e) => e.preventDefault()}
          >
            <Heart className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-teal-600 dark:hover:bg-gray-700"
            aria-label="Expandir detalhes"
            onClick={(e) => {
              e.preventDefault();
              setIsExpanded(true);
            }}
          >
            <Expand className="h-5 w-5" />
          </button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pb-5">
        {card?.resumo ? (
          <div className="rounded-xl bg-gradient-to-br from-teal-50/80 to-orange-50/50 dark:from-teal-950/40 dark:to-orange-950/20 p-3 border border-teal-100/80 dark:border-teal-900/50">
            <p className="text-xs font-semibold uppercase tracking-wide text-teal-800 dark:text-teal-300 mb-1">
              {labels.cardSummary}
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">{card.resumo}</p>
          </div>
        ) : (
          <CardDescription className="line-clamp-2 text-sm">
            {result.description.pt ?? result.description.en}
          </CardDescription>
        )}

        {tipPreviews.length > 0 && (
          <div className="space-y-2">
            {tipPreviews.map((tip) => (
              <div
                key={tip.label}
                className="rounded-lg border border-amber-100 dark:border-amber-900/40 bg-amber-50/60 dark:bg-amber-950/20 px-2.5 py-2 text-xs"
              >
                <p className="font-semibold text-amber-900 dark:text-amber-200 flex items-center gap-1 mb-0.5">
                  <Shield className="h-3 w-3" />
                  {tip.label}
                </p>
                <p className="line-clamp-2 text-gray-600 dark:text-gray-400">{tip.text}</p>
              </div>
            ))}
          </div>
        )}

        {(card?.veja?.length || card?.faca?.length) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {card.veja && card.veja.length > 0 && (
              <div className="rounded-lg bg-gray-50 dark:bg-gray-900/50 p-2">
                <p className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1 mb-1">
                  <Eye className="h-3 w-3 text-teal-600" />
                  {labels.cardSee}
                </p>
                <p className="line-clamp-2 text-gray-600 dark:text-gray-400">{card.veja[0]}</p>
              </div>
            )}
            {card.faca && card.faca.length > 0 && (
              <div className="rounded-lg bg-gray-50 dark:bg-gray-900/50 p-2">
                <p className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1 mb-1">
                  <Compass className="h-3 w-3 text-orange-500" />
                  {labels.cardDo}
                </p>
                <p className="line-clamp-2 text-gray-600 dark:text-gray-400">{card.faca[0]}</p>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-1.5">
          {result.bestFor.slice(0, 3).map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-xs bg-teal-100/80 text-teal-900 dark:bg-teal-900/50 dark:text-teal-100"
            >
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 border-t border-gray-100 dark:border-gray-700 pt-4">
          <div className="min-w-0">
            <p className="text-xs text-gray-500 dark:text-gray-400">{labels.from}</p>
            <p className="text-xl sm:text-2xl font-bold text-teal-700 dark:text-teal-400 tabular-nums">
              {result.priceCurrency ?? 'EUR'} {result.price.toLocaleString()}
              <span className="ml-1 text-xs font-normal text-gray-500">{labels.perPerson}</span>
            </p>
          </div>
          <Button
            asChild
            className="w-full sm:w-auto shrink-0 gap-1 min-h-11 bg-gradient-to-r from-teal-600 to-orange-500 hover:from-teal-700 hover:to-orange-600 touch-manipulation"
          >
            <Link href={href}>
              {labels.viewDestination}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>

      <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{result.destination}</DialogTitle>
            <DialogDescription>
              {result.country}, {result.continent}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {card?.resumo && (
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{labels.cardSummary}</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">{card.resumo}</p>
              </div>
            )}
            {(card?.veja?.length || card?.faca?.length) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                {card.veja && card.veja.length > 0 && (
                  <div className="rounded-lg bg-gray-50 dark:bg-gray-900/50 p-3">
                    <p className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1 mb-1">
                      <Eye className="h-4 w-4 text-teal-600" />
                      {labels.cardSee}
                    </p>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
                      {card.veja.map((item, idx) => <li key={idx}>{item}</li>)}
                    </ul>
                  </div>
                )}
                {card.faca && card.faca.length > 0 && (
                  <div className="rounded-lg bg-gray-50 dark:bg-gray-900/50 p-3">
                    <p className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1 mb-1">
                      <Compass className="h-4 w-4 text-orange-500" />
                      {labels.cardDo}
                    </p>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
                      {card.faca.map((item, idx) => <li key={idx}>{item}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            )}
            {tipPreviews.length > 0 && (
              <div className="space-y-2">
                {tipPreviews.map((tip) => (
                  <div key={tip.label} className="rounded-lg border border-amber-100 dark:border-amber-900/40 bg-amber-50/60 dark:bg-amber-950/20 px-3 py-2 text-sm">
                    <p className="font-semibold text-amber-900 dark:text-amber-200 flex items-center gap-1 mb-0.5">
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
                <Badge key={tag} variant="secondary" className="text-xs bg-teal-100/80 text-teal-900 dark:bg-teal-900/50 dark:text-teal-100">
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
