"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { MapPin, Star, ArrowRight } from 'lucide-react';
// Utils function for className merging
const cn = (...classes) => {
    return classes.filter(Boolean).join(' ');
};
// =============================================================================
// Components
// =============================================================================
// Destination Card component
const DestinationCard = ({ destination, priority, variant, ImageComponent, LinkComponent, customMessages }) => {
    const { slug, title, country, description, heroImage, heroImageAlt, rating, reviewCount } = destination;
    const getMessage = (key, fallback) => {
        return customMessages?.[key] || fallback;
    };
    const isCompact = variant === 'compact';
    const isFeatured = variant === 'featured';
    // Default link wrapper if no custom component provided
    const LinkWrapper = LinkComponent || 'a';
    const linkProps = LinkComponent ? {
        href: `/destinos/${slug}`,
        'aria-label': `Explorar destino: ${title}`
    } : {
        href: `/destinos/${slug}`,
        target: '_blank',
        rel: 'noopener noreferrer'
    };
    return (_jsxs(LinkWrapper, { ...linkProps, className: cn('group overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl hover:ring-2 hover:ring-blue-500/50 motion-safe:animate-fade-in dark:bg-zinc-900 dark:hover:ring-blue-400', isCompact && 'shadow-md hover:shadow-lg', isFeatured && 'shadow-2xl hover:shadow-3xl'), children: [_jsxs("div", { className: cn('relative', isCompact ? 'h-48' : 'h-64'), children: [ImageComponent ? (_jsx(ImageComponent, { src: heroImage, alt: heroImageAlt || `${title} - ${description}`, fill: true, sizes: "(max-width: 768px) 100vw, 33vw", className: "object-cover group-hover:scale-105 transition-transform duration-500", priority: priority })) : (_jsx("img", { src: heroImage, alt: heroImageAlt || `${title} - ${description}`, className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500", loading: priority ? 'eager' : 'lazy' })), rating && (_jsx("div", { className: "absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1.5 backdrop-blur-sm shadow-md dark:bg-zinc-800/80", children: _jsxs("div", { className: "flex items-center space-x-1", children: [_jsx(Star, { className: "w-4 h-4 text-yellow-400 fill-yellow-400" }), _jsx("span", { className: "text-sm font-semibold text-zinc-900 dark:text-white", children: rating.toFixed(1) })] }) }))] }), _jsxs("div", { className: cn('p-6', isCompact && 'p-4'), children: [_jsxs("div", { className: "flex items-center space-x-2 mb-2 text-sm", children: [_jsx(MapPin, { className: "h-4 w-4 text-blue-500 dark:text-blue-400" }), _jsx("span", { className: "font-medium text-gray-500 dark:text-zinc-400", children: country })] }), _jsx("h3", { className: cn('mb-2 font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors', isCompact ? 'text-lg' : 'text-2xl'), children: title }), _jsx("p", { className: cn('text-gray-600 dark:text-zinc-300 line-clamp-3', isCompact ? 'text-sm mb-3 line-clamp-2' : 'mb-4'), children: description }), _jsxs("div", { className: "flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800", children: [_jsxs("div", { className: "text-sm font-medium text-gray-500 dark:text-zinc-400", children: [(reviewCount ?? 0).toLocaleString('pt-PT'), " ", getMessage('reviews', 'avaliações')] }), _jsxs("span", { className: "inline-flex items-center space-x-1 text-blue-600 font-semibold text-sm group-hover:underline dark:text-blue-400", children: [getMessage('seeDetails', 'Ver Detalhes'), _jsx(ArrowRight, { className: "w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" })] })] })] })] }));
};
// Main FeaturedDestinations component
export const FeaturedDestinations = ({ destinations, title, subtitle, showAllDestinationsButton = true, allDestinationsUrl = '/destinos', className, variant = 'default', showBackground = true, ImageComponent, LinkComponent, customMessages, }) => {
    const getMessage = (key, fallback) => {
        return customMessages?.[key] || fallback;
    };
    // Default destinations if none provided
    const defaultDestinations = [
        {
            id: 'paris',
            slug: 'paris',
            title: 'Paris',
            country: 'França',
            address: 'Paris, França',
            description: 'Cidade das luzes e do amor eterno. Descubra os cafés charmosos, a arte clássica e a arquitetura monumental.',
            heroImage: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=800&h=600&fit=crop',
            heroImageAlt: 'Vista noturna da Torre Eiffel em Paris',
            coordinates: { lat: 48.8566, lng: 2.3522 },
            category: 'Cidade',
            rating: 4.8,
            reviewCount: 1250
        },
        {
            id: 'tokyo',
            slug: 'tokyo',
            title: 'Tóquio',
            country: 'Japão',
            address: 'Tóquio, Japão',
            description: 'Tradição milenar encontra tecnologia futurista. Explore os templos serenos e os bairros vibrantes como Shinjuku e Shibuya.',
            heroImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=600&fit=crop',
            heroImageAlt: 'Vista urbana moderna de Tóquio com arranha-céus',
            coordinates: { lat: 35.6762, lng: 139.6503 },
            category: 'Cidade',
            rating: 4.9,
            reviewCount: 980
        },
        {
            id: 'rio-de-janeiro',
            slug: 'rio-de-janeiro',
            title: 'Rio de Janeiro',
            country: 'Brasil',
            address: 'Rio de Janeiro, Brasil',
            description: 'Praias paradisíacas e cultura vibrante. Relaxe em Copacabana, suba o Pão de Açúcar e sinta a energia da cidade maravilhosa.',
            heroImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop',
            heroImageAlt: 'Vista do Rio de Janeiro com Cristo Redentor',
            coordinates: { lat: -22.9068, lng: -43.1729 },
            category: 'Cidade',
            rating: 4.7,
            reviewCount: 850
        }
    ];
    const destinationsToRender = destinations || defaultDestinations;
    const isCompact = variant === 'compact';
    // const isFeatured = variant === 'featured'; // Commented for future use
    return (_jsx("section", { className: cn('py-20 bg-zinc-50 dark:bg-zinc-950', !showBackground && 'bg-transparent', isCompact && 'py-12', className), children: _jsx("div", { className: "w-full px-4 sm:px-6 lg:px-12", children: _jsxs("div", { className: "mx-auto max-w-7xl", children: [_jsxs("div", { className: cn('text-center', isCompact ? 'mb-8' : 'mb-14'), children: [_jsx("h2", { className: cn('font-extrabold text-zinc-900 dark:text-white motion-safe:animate-fade-in mb-3', isCompact ? 'text-2xl md:text-3xl' : 'text-4xl'), children: title || getMessage('title', 'Destinos em Destaque') }), _jsx("p", { className: cn('text-zinc-700 dark:text-zinc-300 motion-safe:animate-fade-in', isCompact ? 'text-base max-w-2xl' : 'text-xl max-w-3xl'), style: { margin: '0 auto' }, children: subtitle || getMessage('subtitle', 'Descubra os lugares mais incríveis do mundo com experiências únicas e inesquecíveis.') })] }), _jsx("div", { className: cn('grid gap-10', isCompact ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'sm:grid-cols-2 lg:grid-cols-3'), children: destinationsToRender.map((destination, index) => (_jsx(DestinationCard, { destination: destination, priority: index === 0, variant: variant, ImageComponent: ImageComponent, LinkComponent: LinkComponent, customMessages: customMessages }, destination.slug))) }), showAllDestinationsButton && (_jsx("div", { className: "mt-16 text-center", children: LinkComponent ? (_jsxs(LinkComponent, { href: allDestinationsUrl, className: "inline-flex items-center space-x-2 rounded-xl bg-blue-600 px-8 py-3.5 text-lg font-semibold text-white transition-colors hover:bg-blue-700 shadow-lg shadow-blue-500/50 dark:shadow-none", children: [_jsx("span", { children: getMessage('allDestinations', 'Ver Todos os Destinos') }), _jsx(ArrowRight, { className: "w-5 h-5" })] })) : (_jsxs("a", { href: allDestinationsUrl, target: "_blank", rel: "noopener noreferrer", className: "inline-flex items-center space-x-2 rounded-xl bg-blue-600 px-8 py-3.5 text-lg font-semibold text-white transition-colors hover:bg-blue-700 shadow-lg shadow-blue-500/50 dark:shadow-none", children: [_jsx("span", { children: getMessage('allDestinations', 'Ver Todos os Destinos') }), _jsx(ArrowRight, { className: "w-5 h-5" })] })) }))] }) }) }));
};
/** @alias */
export default FeaturedDestinations;
//# sourceMappingURL=FeaturedDestinations.js.map