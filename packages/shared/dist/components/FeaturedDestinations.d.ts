import React from 'react';
export interface Destination {
    id: string;
    slug: string;
    title: string;
    name?: string;
    description: string;
    metaDescription?: string;
    address: string;
    city?: string;
    region?: string;
    country: string;
    category: string;
    tags?: string[];
    coordinates: {
        lat: number;
        lng: number;
    };
    heroImage: string;
    heroImageAlt?: string;
    heroImageWidth?: number;
    heroImageHeight?: number;
    galleryImages?: Array<{
        url: string;
        alt?: string;
    }>;
    rating?: number;
    reviewCount?: number;
    visitCount?: number;
    featured?: boolean;
    bestTimeToVisit?: string;
    averageTemperature?: string;
    language?: string;
    currency?: string;
    timezone?: string;
    highlights?: Array<{
        name: string;
    }>;
    attractions?: Array<{
        name: string;
    }>;
    updatedAt?: string;
    imageUrl?: string;
}
export interface FeaturedDestinationsProps {
    destinations?: Destination[];
    title?: string;
    subtitle?: string;
    showAllDestinationsButton?: boolean;
    allDestinationsUrl?: string;
    className?: string;
    variant?: 'default' | 'compact' | 'featured';
    showBackground?: boolean;
    ImageComponent?: React.ComponentType<Record<string, unknown>>;
    LinkComponent?: React.ComponentType<Record<string, unknown>>;
    customMessages?: {
        title?: string;
        subtitle?: string;
        allDestinations?: string;
        seeDetails?: string;
        reviews?: string;
    };
}
export declare const FeaturedDestinations: React.FC<FeaturedDestinationsProps>;
/** @alias */
export default FeaturedDestinations;
