// src/components/common/GridCard/GridCard.tsx
import { Heart, Star } from 'lucide-react';
import { type FC } from 'react';
import { Badge, Button, Card, CardContent } from '@akmleva/ui';

// Types para o GridCard
interface BaseSearchResult {
  id: string;
  name: string;
  location: string;
  description: string;
  price: { amount: number; currency: string; per: 'person' | 'night' | 'package' };
  rating: number;
  reviewCount: number;
  images: string[];
  highlights: string[];
  availability?: { available: boolean; nextAvailable?: string };
  featured?: boolean;
}

interface SearchResult extends BaseSearchResult {
  type: 'destination' | 'package' | 'activity' | 'flight';
}

interface AvailabilityResult {
  status: 'available' | 'limited' | 'unavailable';
  message?: string;
}

interface DynamicPricingResult {
  currency: string;
  basePrice: number;
  currentPrice: number;
  confidence: number;
  breakdown: Array<{
    label: string;
    amount: number;
  }>;
}

interface ImageProviderProps {
  imageUrl: string | null;
  alt: string;
  query: string;
  className?: string;
  width?: number;
  height?: number;
}

// Simplified ImageProvider component
const ImageProvider: FC<ImageProviderProps> = ({
  imageUrl,
  alt,
  className,
  width,
  height,
}) => {
  const style = width || height ? { width, height } : undefined;

  if (!imageUrl) {
    return (
      <div
        className={['w-full h-full', className].filter(Boolean).join(' ')}
        style={style}
      >
        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
          No image
        </div>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={alt}
      className={['w-full h-full object-cover', className].filter(Boolean).join(' ')}
      style={style}
      loading="lazy"
    />
  );
};

interface GridCardProps {
  result: SearchResult;
  onResultClick: (result: SearchResult) => void;
  onBookNow: (result: SearchResult) => void;
  onSaveToWishlist: (result: SearchResult) => void;
  dynamicPricing?: DynamicPricingResult | undefined;
  availability?: AvailabilityResult | undefined;
  onGenerateItinerary?: (result: SearchResult) => void;
}

export const GridCard: FC<GridCardProps> = ({
  result,
  onResultClick,
  onBookNow,
  onSaveToWishlist,
  dynamicPricing,
  availability,
  onGenerateItinerary,
}) => {
  return (
    <Card
      className='overflow-hidden hover:shadow-lg transition cursor-pointer'
      onClick={() => onResultClick(result)}
    >
      <div className='relative aspect-video'>
        <ImageProvider
          imageUrl={result.images[0] ?? null}
          alt={result.name}
          query={result.name}
          className='w-full h-full object-cover'
        />
        <Button
          size='icon'
          variant='secondary'
          className='absolute top-2 right-2 rounded-full'
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            onSaveToWishlist(result);
          }}
        >
          <Heart className='h-5 w-5' />
        </Button>
      </div>
      <CardContent className='p-4 space-y-2'>
        <h3 className='font-semibold text-lg'>{result.name}</h3>
        <p className='text-sm text-gray-600 line-clamp-2'>{result.description}</p>
        <div className='flex items-center gap-2 text-sm text-gray-700'>
          <Star className='h-4 w-4 text-yellow-500' /> {result.rating} ({result.reviewCount})
        </div>
        {availability && (
          <div className='pt-1'>
            <Badge variant={availability.status === 'available' ? 'default' : availability.status === 'limited' ? 'secondary' : 'destructive'}>
              {availability.status === 'available' ? 'Disponível' : availability.status === 'limited' ? 'Disponibilidade limitada' : 'Indisponível'}
            </Badge>
          </div>
        )}
        <div className='flex flex-col gap-2 pt-2 sm:flex-row sm:items-center sm:justify-between'>
          <span className='text-primary font-bold'>
            {(dynamicPricing ? dynamicPricing.currency : result.price.currency)} {(dynamicPricing ? dynamicPricing.currentPrice.toFixed(2) : result.price.amount)} / {result.price.per}
          </span>
          <Button
            size='sm'
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              onBookNow(result);
            }}
          >
            Reservar
          </Button>
        </div>
        {dynamicPricing && (
          <div className='mt-2 text-xs'>
            {/* Flag visual para desvio >15% */}
            {(() => {
              const diff = (dynamicPricing.currentPrice - dynamicPricing.basePrice) / dynamicPricing.basePrice;
              if (Math.abs(diff) > 0.15) {
                const up = diff > 0;
                return (
                  <Badge className={up ? 'bg-red-600 text-white border-0' : 'bg-emerald-600 text-white border-0'}>
                    {up ? '↑' : '↓'} {Math.round(Math.abs(diff) * 100)}%
                  </Badge>
                );
              }
              return null;
            })()}
            {/* Preço base compacto */}
            <div className='mt-1 text-muted-foreground'>Base: {dynamicPricing.currency} {dynamicPricing.basePrice.toFixed(2)}</div>
            {/* Breakdown compacto em linha */}
            <div className='mt-1 truncate'>
              {dynamicPricing.breakdown.slice(0, 2).map((b, idx) => (
                <span key={idx} className='mr-2'>
                  {b.label} ({b.amount >= 0 ? '+' : ''}{b.amount.toFixed(0)})
                  {idx < 1 ? ' • ' : ''}
                </span>
              ))}
            </div>
            <div className='mt-1 text-muted-foreground'>Confiança: {(dynamicPricing.confidence * 100).toFixed(0)}%</div>
          </div>
        )}
        <div className='pt-2'>
          <Button
            variant='secondary'
            size='sm'
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              onGenerateItinerary && onGenerateItinerary(result);
            }}
          >
            Gerar Itinerário
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

/** @alias */
export default GridCard;
