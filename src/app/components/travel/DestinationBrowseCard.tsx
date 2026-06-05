'use client';

import Link from 'next/link';
import { ArrowRight, Hotel, MapPin, Plane } from 'lucide-react';

import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription } from '../ui/card';
import { DESTINATION_PLACEHOLDER, onDestinationImageError } from './destination-image-fallback';

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
};

export type DestinationBrowseCardProps = {
  item: DestinationBrowseItem;
  href: string;
  labels: {
    viewDestination: string;
    hotels: string;
  };
};

export function DestinationBrowseCard({ item, href, labels }: DestinationBrowseCardProps) {
  return (
    <Card className="group overflow-hidden border-0 bg-white dark:bg-gray-800 shadow-md hover:shadow-xl ring-1 ring-gray-200/80 dark:ring-gray-700 transition-all duration-300 h-full flex flex-col">
      <Link href={href} className="block relative h-44 overflow-hidden shrink-0">
        <img
          src={item.imageUrl || DESTINATION_PLACEHOLDER}
          alt={item.nome}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={onDestinationImageError}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {item.iata && (
            <Badge className="border-0 bg-white/90 text-gray-900 text-xs">
              <Plane className="mr-1 h-3 w-3" />
              {item.iata}
            </Badge>
          )}
          {item.hotelCount != null && item.hotelCount > 0 && (
            <Badge className="border-0 bg-teal-600/90 text-white text-xs">
              <Hotel className="mr-1 h-3 w-3" />
              {item.hotelCount} {labels.hotels}
            </Badge>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
          <h3 className="text-lg font-bold leading-tight drop-shadow-sm line-clamp-2">{item.nome}</h3>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-white/90">
            <MapPin className="h-3 w-3 shrink-0" />
            {item.pais}
            {item.continente ? ` · ${item.continente}` : ''}
          </p>
        </div>
      </Link>

      <CardContent className="flex flex-col flex-1 gap-3 p-4 pt-3">
        {item.descricao ? (
          <CardDescription className="line-clamp-2 text-sm flex-1">{item.descricao}</CardDescription>
        ) : (
          <div className="flex-1" />
        )}
        <div className="flex flex-wrap gap-1.5">
          {item.tipo && (
            <Badge variant="secondary" className="text-xs capitalize">
              {item.tipo}
            </Badge>
          )}
          {item.clima && (
            <Badge variant="secondary" className="text-xs">
              {item.clima}
            </Badge>
          )}
        </div>
        <Button
          asChild
          variant="outline"
          className="w-full gap-1 min-h-10 border-teal-200 dark:border-teal-800 hover:bg-teal-50 dark:hover:bg-teal-950/30"
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
