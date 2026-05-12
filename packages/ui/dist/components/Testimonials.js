"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Star, Quote, MapPin, Calendar, CheckCircle } from 'lucide-react';
import React from 'react';
import { useTranslations } from 'next-intl';
import { Badge } from '@akmleva/ui';
const cn = (...classes) => classes.filter(Boolean).join(' ');
// =============================================================================
// StarRating
// =============================================================================
const STAR_SIZE_CLASSES = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
};
function getStarSizeClass(size) {
    // Explicit switch avoids variable-key object access (security/detect-object-injection)
    switch (size) {
        case 'sm': return STAR_SIZE_CLASSES.sm;
        case 'lg': return STAR_SIZE_CLASSES.lg;
        default: return STAR_SIZE_CLASSES.md;
    }
}
const StarRating = ({ rating, maxRating = 5, size = 'md', showNumber = true }) => {
    const adjustedRating = Math.min(Math.max(rating, 0), maxRating);
    const sizeClass = getStarSizeClass(size);
    return (_jsxs("div", { className: "flex items-center space-x-1", role: "img", "aria-label": `Rating: ${adjustedRating} out of ${maxRating} stars`, children: [[...Array(maxRating)].map((_, index) => {
                const star = index + 1;
                return (_jsx(Star, { className: cn(sizeClass, 'transition-colors duration-200', star <= adjustedRating
                        ? 'fill-yellow-400 text-yellow-400 drop-shadow-sm'
                        : 'fill-gray-300 text-gray-300 dark:fill-gray-600 dark:text-gray-600') }, star));
            }), showNumber && (_jsxs("span", { className: "ml-2 text-sm font-medium text-foreground/80", children: [adjustedRating.toFixed(1), "/", maxRating] }))] }));
};
// =============================================================================
// TestimonialCard
// =============================================================================
const TestimonialCard = ({ testimonial, variant = 'default' }) => {
    const getInitials = (name) => name.split(' ').map(w => w.charAt(0).toUpperCase()).join('').slice(0, 2);
    const isCompact = variant === 'compact';
    const isFeatured = variant === 'featured' || testimonial.featured;
    return (_jsxs("article", { className: cn('group relative transform rounded-2xl border transition-all duration-500 hover:scale-[1.02] backdrop-blur-sm h-full flex flex-col', isFeatured
            ? 'md:col-span-2 border-primary/30 bg-gradient-to-br from-primary/5 via-card/50 to-secondary/5 shadow-2xl shadow-primary/10 ring-1 ring-primary/20'
            : 'border-border/50 bg-card/60 dark:bg-card/80 hover:border-primary/30 shadow-lg hover:shadow-xl', isCompact ? 'p-4' : 'p-6'), "data-testid": "testimonial-card", children: [isFeatured && (_jsxs(_Fragment, { children: [_jsx("div", { className: "absolute top-4 right-4", children: _jsx(Badge, { variant: "secondary", className: "bg-primary/20 text-primary", children: "Featured" }) }), _jsx(Quote, { className: "absolute top-6 left-6 h-8 w-8 text-primary/10" })] })), _jsxs("div", { className: cn('relative z-10 flex flex-col flex-1', !isCompact && 'space-y-4'), children: [_jsxs("div", { className: cn('flex items-start space-x-3', isCompact && 'space-x-2'), children: [testimonial.avatar ? (_jsxs("div", { className: "relative flex-shrink-0", children: [_jsx("img", { src: testimonial.avatar, alt: `${testimonial.name}'s avatar`, className: cn('rounded-full object-cover ring-2 ring-primary/20 shadow-lg transition-transform duration-300 group-hover:scale-105', isCompact ? 'h-10 w-10' : 'h-12 w-12'), loading: "lazy" }), testimonial.verified && (_jsx("div", { className: "absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-500 flex items-center justify-center ring-2 ring-background", children: _jsx(CheckCircle, { className: "h-3 w-3 text-white" }) }))] })) : (_jsx("div", { className: cn('relative flex-shrink-0 rounded-full bg-gradient-to-br from-primary to-secondary p-0.5', isCompact ? 'h-10 w-10' : 'h-12 w-12'), children: _jsx("div", { className: "flex h-full w-full items-center justify-center rounded-full bg-background", children: _jsx("span", { className: cn('font-bold bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent', isCompact ? 'text-xs' : 'text-sm'), children: getInitials(testimonial.name) }) }) })), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("h3", { className: cn('font-semibold text-foreground truncate mb-1', isCompact ? 'text-base' : 'text-lg'), children: testimonial.name }), _jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [_jsx(MapPin, { className: "h-3 w-3" }), _jsx("span", { className: "truncate", children: testimonial.location })] }), testimonial.trip && (_jsx("p", { className: "text-xs text-muted-foreground mt-1 truncate", children: testimonial.trip }))] })] }), _jsx("div", { className: isCompact ? 'my-2' : 'my-3', children: _jsx(StarRating, { rating: testimonial.rating, size: isCompact ? 'sm' : 'md', showNumber: !isCompact }) }), _jsx("blockquote", { className: "flex-1", children: _jsx("p", { className: cn('text-foreground/90 leading-relaxed', isCompact ? 'text-sm line-clamp-3' : 'text-base'), children: testimonial.comment }) }), testimonial.date && (_jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-border/20", children: [_jsx(Calendar, { className: "h-3 w-3" }), _jsx("span", { children: new Date(testimonial.date).toLocaleDateString() })] }))] }), _jsx("div", { className: "absolute inset-0 rounded-2xl border-2 border-transparent transition-all duration-300 group-hover:border-primary/10 pointer-events-none" })] }));
};
// =============================================================================
// TestimonialStats
// =============================================================================
const TestimonialStats = ({ testimonials, getMessage, variant = 'default' }) => {
    const averageRating = testimonials.length > 0
        ? testimonials.reduce((sum, item) => sum + item.rating, 0) / testimonials.length
        : 0;
    const featuredCount = testimonials.filter(item => item.featured).length;
    const stats = [
        { value: `${testimonials.length}+`, label: getMessage('totalReviews', 'Total Reviews') },
        { value: averageRating.toFixed(1), label: getMessage('averageRating', 'Average Rating') },
        { value: featuredCount.toString(), label: getMessage('featuredReviews', 'Featured Reviews') },
    ];
    return (_jsx("div", { className: cn('grid gap-4 mb-8', variant === 'compact' ? 'grid-cols-3' : 'grid-cols-1 md:grid-cols-3'), children: stats.map((stat, index) => (_jsxs("div", { className: cn('text-center rounded-xl border backdrop-blur-sm bg-card/50 border-border/50', variant === 'compact' ? 'p-3' : 'p-6'), children: [_jsx("div", { className: cn('font-bold text-primary mb-1', variant === 'compact' ? 'text-2xl' : 'text-3xl'), children: stat.value }), _jsx("div", { className: cn('text-muted-foreground', variant === 'compact' ? 'text-xs' : 'text-sm'), children: stat.label })] }, index))) }));
};
// =============================================================================
// Testimonials (main)
// =============================================================================
// Map the full PageVariant down to the narrower CardVariant
function toCardVariant(v) {
    switch (v) {
        case 'compact': return 'compact';
        case 'featured': return 'featured';
        default: return 'default'; // 'carousel' and 'default' both map to 'default' card
    }
}
// Map the full PageVariant down to the narrower StatsVariant
function toStatsVariant(v) {
    return v === 'compact' ? 'compact' : 'default';
}
const Testimonials = ({ testimonials, title, subtitle, showStats = false, maxRating = 5, className, variant = 'default', showBackground = true, translationNamespace = 'testimonials', customMessages, }) => {
    const t = useTranslations(translationNamespace);
    const getMessage = (key, fallback) => {
        const custom = customMessages?.[key];
        if (custom)
            return custom;
        return t(key, { defaultValue: fallback });
    };
    const featuredTestimonials = testimonials.filter(item => item.featured);
    const regularTestimonials = testimonials.filter(item => !item.featured);
    const getGridClasses = () => {
        switch (variant) {
            case 'compact': return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
            case 'featured': return 'grid-cols-1 lg:grid-cols-2';
            default: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
        }
    };
    const cardVariant = toCardVariant(variant);
    const statsVariant = toStatsVariant(variant);
    return (_jsxs("section", { "aria-labelledby": "testimonials-title", className: cn('relative py-16 lg:py-24 overflow-hidden', showBackground ? 'bg-background' : 'bg-transparent', className), children: [showBackground && (_jsxs(_Fragment, { children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-background via-background to-muted/5" }), _jsx("div", { className: "absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-background to-transparent" }), _jsx("div", { className: "absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent" }), _jsx("div", { className: "absolute inset-0 opacity-[0.02] bg-[url('/grid.svg')] bg-center" })] })), _jsxs("div", { className: "container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl", children: [_jsxs("header", { className: cn('text-center mb-12 lg:mb-16', variant === 'compact' && 'mb-8'), children: [_jsx(Badge, { variant: "outline", className: cn('mb-4 lg:mb-6 border-primary/20 bg-primary/5 text-primary px-4 py-1.5', variant === 'compact' && 'text-sm mb-3'), children: getMessage('feedbackLabel', 'Traveler Feedback') }), _jsx("h2", { id: "testimonials-title", className: cn('font-bold tracking-tight text-foreground mb-4', variant === 'compact' ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl lg:text-5xl'), children: title ?? (_jsxs(_Fragment, { children: ["What Our ", _jsx("span", { className: "text-primary", children: "Clients Say" })] })) }), _jsx("p", { className: cn('text-muted-foreground mx-auto', variant === 'compact' ? 'text-base max-w-xl' : 'text-lg lg:text-xl max-w-2xl lg:max-w-3xl'), children: subtitle ?? getMessage('subtitle', 'Discover the memorable experiences of those who have traveled with our AI technology.') })] }), showStats && testimonials.length > 0 && (_jsx(TestimonialStats, { testimonials: testimonials, getMessage: getMessage, variant: statsVariant })), testimonials.length > 0 ? (_jsx("div", { className: cn('grid gap-6 lg:gap-8', getGridClasses()), children: [...featuredTestimonials, ...regularTestimonials].map(testimonial => (_jsx(TestimonialCard, { testimonial: testimonial, variant: cardVariant, ...(maxRating !== 5 ? {} : {}) }, testimonial.id))) })) : (_jsx("div", { className: "text-center py-16", children: _jsx("p", { className: "text-muted-foreground text-lg", children: getMessage('noTestimonials', 'No testimonials available yet.') }) }))] })] }));
};
export { Testimonials };
export default Testimonials;
//# sourceMappingURL=Testimonials.js.map