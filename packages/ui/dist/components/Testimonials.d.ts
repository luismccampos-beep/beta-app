import React from 'react';
export interface Testimonial {
    id: string;
    name: string;
    location: string;
    rating: number;
    comment: string;
    avatar?: string;
    featured?: boolean;
    trip?: string;
    date?: string;
    verified?: boolean;
    category?: string;
}
type PageVariant = 'default' | 'compact' | 'featured' | 'carousel';
export interface TestimonialsProps {
    testimonials: Testimonial[];
    title?: string;
    subtitle?: string;
    showStats?: boolean;
    maxRating?: number;
    locale?: string;
    className?: string;
    variant?: PageVariant;
    showBackground?: boolean;
    translationNamespace?: string;
    customMessages?: {
        title?: string;
        subtitle?: string;
        listTitle?: string;
        feedbackLabel?: string;
        totalReviews?: string;
        averageRating?: string;
        featuredReviews?: string;
    };
}
declare const Testimonials: React.FC<TestimonialsProps>;
export { Testimonials };
export default Testimonials;
