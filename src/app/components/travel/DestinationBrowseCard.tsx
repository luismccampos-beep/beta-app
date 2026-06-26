'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Hotel, MapPin, Plane, Star } from 'lucide-react';

import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription } from '../ui/card';
import { DESTINATION_PLACEHOLDER, onDestinationImageError } from './destination-image-fallback';
import { HotelTypeBadge } from './HotelTypeBadge';

export type HotelTypeBreakdown = Record<string, number>;

export type DestinationBrowseItem = {
  id: string;
  slug: string;
  nome: string;
  pais: string;
  continente: string;
  tipo: string;
  clima: string;
  descricao?: string | null;
  imageUrl: string;
  iata?: string | null;
  hotelCount?: number | null;
  avgStars?: number | null;
  hotelTypes?: HotelTypeBreakdown | null;
};

function StarRating({ value }: { value: number }) {
  const full = Math.floor(value);
  const hasHalf = value - full >= 0.3;
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3 w-3 ${
            i < full
              ? 'fill-amber-400 text-amber-400'
              : i === full && hasHalf
                ? 'fill-amber-400/50 text-amber-400'
                : 'text-gray-300 dark:text-gray-600'
          }`}
        />
      ))}
      <span className="ml-1 text-xs font-semibold text-gray-700 dark:text-gray-300">{value.toFixed(1)}</span>
    </span>
  );
}

export type DestinationBrowseCardProps = {
  item: DestinationBrowseItem;
  href: string;
  labels: {
    viewDestination: string;
    hotels: string;
    accommodationTypes?: Record<string, string>;
  };
};

export function DestinationBrowseCard({ item, href, labels }: DestinationBrowseCardProps) {
  // Get top 2 hotel types for display
  const topTypes = item.hotelTypes
    ? Object.entries(item.hotelTypes)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 2)
    : [];

  return (
    <Card className="group relative overflow-hidden border-0 bg-white dark:bg-gray-800 shadow-md hover:shadow-xl ring-1 ring-gray-200/60 dark:ring-gray-700/60 transition-all duration-300 h-full flex flex-col">
      {/* Hero image */}
      <Link href={href} className="block relative aspect-video overflow-hidden shrink-0">
        <Image
          src={item.imageUrl || DESTINATION_PLACEHOLDER}
          alt={item.nome}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          onError={onDestinationImageError}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />

        {/* Badges — top left */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {item.iata && (
            <Badge className="border-0 bg-black/50 backdrop-blur-sm text-white text-xs shadow-sm">
              <Plane className="mr-1 h-3 w-3" />
              {item.iata}
            </Badge>
          )}
          {item.hotelCount != null && item.hotelCount > 0 && (
            <Badge className="border-0 bg-teal-600/90 backdrop-blur-sm text-white text-xs shadow-sm">
              <Hotel className="mr-1 h-3 w-3" />
              {item.hotelCount} {labels.hotels}
            </Badge>
          )}
        </div>

        {/* Name overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-lg font-bold leading-tight text-white drop-shadow-md line-clamp-2">{item.nome}</h3>
          <p className="mt-1 flex items-center gap-1 text-xs text-white/85">
            <MapPin className="h-3 w-3 shrink-0" />
            {item.pais}
            {item.continente ? ` · ${item.continente}` : ''}
          </p>
        </div>
      </Link>

      {/* Content */}
      <CardContent className="flex flex-col flex-1 gap-3 p-4 pt-3">
        {/* Stars rating */}
        {item.avgStars != null && item.avgStars > 0 && (
          <div className="flex items-center gap-2">
            <StarRating value={item.avgStars} />
          </div>
        )}

        {item.descricao ? (
          <CardDescription className="line-clamp-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed flex-1">{item.descricao}</CardDescription>
        ) : (
          <div className="flex-1" />
        )}

        {/* Tags: tipo, clima, and hotel types */}
        <div className="flex flex-wrap gap-1.5">
          {item.tipo && (
            <Badge variant="secondary" className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-0 capitalize">
              {item.tipo}
            </Badge>
          )}
          {item.clima && (
            <Badge variant="secondary" className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-0">
              {item.clima}
            </Badge>
          )}
          {topTypes.map(([tipo, count]) => (
            <HotelTypeBadge
              key={tipo}
              tipo={tipo}
              count={count}
              label={labels.accommodationTypes?.[tipo] ?? tipo}
            />
          ))}
        </div>
        <Button
          asChild
          className="w-full gap-1.5 min-h-10 bg-gray-900 dark:bg-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 text-white text-sm font-medium shadow-sm transition-all hover:shadow-md"
        >
          <Link href={href}>
            {labels.viewDestination}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
