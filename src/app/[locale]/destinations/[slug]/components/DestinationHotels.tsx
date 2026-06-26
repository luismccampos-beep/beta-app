'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Bed, Star, ChevronDown, ChevronUp, Wifi, Car, Coffee, Dumbbell, Waves, Snowflake, Utensils } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { DESTINATION_PLACEHOLDER, onDestinationImageError } from '@/app/components/travel/destination-image-fallback';
import type { MockHotel } from '@/lib/travel/mock-travel/types';
type Props = {
  hotels: MockHotel[];
  labels: {
    hotels: string;
    perNight: string;
    viewDetails: string;
  };
  accommodationTypes?: Record<string, string>;
};

const amenityIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  wifi: Wifi,
  parking: Car,
  cafe: Coffee,
  gym: Dumbbell,
  pool: Waves,
  spa: Waves,
  breakfast: Coffee,
  restaurant: Utensils,
  ac: Snowflake,
  heating: Snowflake,
};

function AmenityIcon({ amenity }: { amenity: string }) {
  const key = amenity.toLowerCase().trim();
  const Icon = amenityIcons[key] ?? null;
  if (!Icon) return null;
  return <Icon className="h-3.5 w-3.5" />;
}

export function DestinationHotels({ hotels, labels, accommodationTypes }: Props) {
  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? hotels : hotels.slice(0, 6);

  if (!hotels.length) return null;

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Bed className="h-6 w-6 text-teal-600" />
        {labels.hotels}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayed.map((hotel) => (
          <Card key={hotel.id} className="overflow-hidden border-0 shadow-md ring-1 ring-gray-200/60 dark:ring-gray-700/60">
            <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800">
              {hotel.image_url ? (
                <Image
                  src={hotel.image_url}
                  alt={hotel.nome}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                  loading="lazy"
                  onError={onDestinationImageError}
                />
              ) : (
                <Image
                  src={DESTINATION_PLACEHOLDER}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
              )}
              <div className="absolute top-2 right-2 flex gap-1">
                {hotel.tipo_alojamento && accommodationTypes?.[hotel.tipo_alojamento] && (
                  <Badge variant="secondary" className="bg-white/90 text-xs backdrop-blur-sm">
                    {accommodationTypes[hotel.tipo_alojamento]}
                  </Badge>
                )}
                <Badge variant="secondary" className="bg-white/90 text-xs backdrop-blur-sm">
                  {hotel.estrelas > 0 ? (
                    <span className="inline-flex items-center gap-0.5">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      {hotel.estrelas}
                    </span>
                  ) : (
                    '--'
                  )}
                </Badge>
              </div>
            </div>
            <CardContent className="p-3 space-y-2">
              <h3 className="font-semibold text-sm leading-tight line-clamp-2">{hotel.nome}</h3>
              <p className="text-lg font-bold text-teal-700 dark:text-teal-400">
                €{hotel.preco_por_noite?.toFixed(0) ?? '--'}
                <span className="text-xs font-normal text-gray-500 dark:text-gray-400">
                  /{labels.perNight}
                </span>
              </p>
              {hotel.description && (
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                  {hotel.description}
                </p>
              )}
              {hotel.comodidades?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {hotel.comodidades.slice(0, 4).map((amenity) => (
                    <span
                      key={amenity}
                      className="inline-flex items-center gap-1 rounded-full bg-gray-100 dark:bg-gray-700 px-2 py-0.5 text-xs text-gray-600 dark:text-gray-300"
                    >
                      <AmenityIcon amenity={amenity} />
                      <span className="capitalize">{amenity}</span>
                    </span>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      {hotels.length > 6 && (
        <div className="text-center mt-6">
          <Button
            variant="outline"
            onClick={() => setShowAll(!showAll)}
            className="gap-2"
          >
            {showAll ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Mostrar menos
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Mostrar mais ({hotels.length - 6} restantes)
              </>
            )}
          </Button>
        </div>
      )}
    </section>
  );
}
