import { type FC } from 'react';
interface BaseSearchResult {
    id: string;
    name: string;
    location: string;
    description: string;
    price: {
        amount: number;
        currency: string;
        per: 'person' | 'night' | 'package';
    };
    rating: number;
    reviewCount: number;
    images: string[];
    highlights: string[];
    availability?: {
        available: boolean;
        nextAvailable?: string;
    };
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
interface GridCardProps {
    result: SearchResult;
    onResultClick: (result: SearchResult) => void;
    onBookNow: (result: SearchResult) => void;
    onSaveToWishlist: (result: SearchResult) => void;
    dynamicPricing?: DynamicPricingResult | undefined;
    availability?: AvailabilityResult | undefined;
    onGenerateItinerary?: (result: SearchResult) => void;
}
export declare const GridCard: FC<GridCardProps>;
/** @alias */
export default GridCard;
