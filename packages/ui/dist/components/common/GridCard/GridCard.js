import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/common/GridCard/GridCard.tsx
import { Heart, Star } from 'lucide-react';
import {} from 'react';
import { Badge, Button, Card, CardContent } from '@akmleva/ui';
// Simplified ImageProvider component
const ImageProvider = ({ imageUrl, alt, className, width, height, }) => {
    const style = width || height ? { width, height } : undefined;
    if (!imageUrl) {
        return (_jsx("div", { className: ['w-full h-full', className].filter(Boolean).join(' '), style: style, children: _jsx("div", { className: "w-full h-full bg-gray-200 flex items-center justify-center text-gray-500", children: "No image" }) }));
    }
    return (_jsx("img", { src: imageUrl, alt: alt, className: ['w-full h-full object-cover', className].filter(Boolean).join(' '), style: style, loading: "lazy" }));
};
export const GridCard = ({ result, onResultClick, onBookNow, onSaveToWishlist, dynamicPricing, availability, onGenerateItinerary, }) => {
    return (_jsxs(Card, { className: 'overflow-hidden hover:shadow-lg transition cursor-pointer', onClick: () => onResultClick(result), children: [_jsxs("div", { className: 'relative aspect-video', children: [_jsx(ImageProvider, { imageUrl: result.images[0] ?? null, alt: result.name, query: result.name, className: 'w-full h-full object-cover' }), _jsx(Button, { size: 'icon', variant: 'secondary', className: 'absolute top-2 right-2 rounded-full', onClick: (e) => {
                            e.stopPropagation();
                            onSaveToWishlist(result);
                        }, children: _jsx(Heart, { className: 'h-5 w-5' }) })] }), _jsxs(CardContent, { className: 'p-4 space-y-2', children: [_jsx("h3", { className: 'font-semibold text-lg', children: result.name }), _jsx("p", { className: 'text-sm text-gray-600 line-clamp-2', children: result.description }), _jsxs("div", { className: 'flex items-center gap-2 text-sm text-gray-700', children: [_jsx(Star, { className: 'h-4 w-4 text-yellow-500' }), " ", result.rating, " (", result.reviewCount, ")"] }), availability && (_jsx("div", { className: 'pt-1', children: _jsx(Badge, { variant: availability.status === 'available' ? 'default' : availability.status === 'limited' ? 'secondary' : 'destructive', children: availability.status === 'available' ? 'Disponível' : availability.status === 'limited' ? 'Disponibilidade limitada' : 'Indisponível' }) })), _jsxs("div", { className: 'flex flex-col gap-2 pt-2 sm:flex-row sm:items-center sm:justify-between', children: [_jsxs("span", { className: 'text-primary font-bold', children: [(dynamicPricing ? dynamicPricing.currency : result.price.currency), " ", (dynamicPricing ? dynamicPricing.currentPrice.toFixed(2) : result.price.amount), " / ", result.price.per] }), _jsx(Button, { size: 'sm', onClick: (e) => {
                                    e.stopPropagation();
                                    onBookNow(result);
                                }, children: "Reservar" })] }), dynamicPricing && (_jsxs("div", { className: 'mt-2 text-xs', children: [(() => {
                                const diff = (dynamicPricing.currentPrice - dynamicPricing.basePrice) / dynamicPricing.basePrice;
                                if (Math.abs(diff) > 0.15) {
                                    const up = diff > 0;
                                    return (_jsxs(Badge, { className: up ? 'bg-red-600 text-white border-0' : 'bg-emerald-600 text-white border-0', children: [up ? '↑' : '↓', " ", Math.round(Math.abs(diff) * 100), "%"] }));
                                }
                                return null;
                            })(), _jsxs("div", { className: 'mt-1 text-muted-foreground', children: ["Base: ", dynamicPricing.currency, " ", dynamicPricing.basePrice.toFixed(2)] }), _jsx("div", { className: 'mt-1 truncate', children: dynamicPricing.breakdown.slice(0, 2).map((b, idx) => (_jsxs("span", { className: 'mr-2', children: [b.label, " (", b.amount >= 0 ? '+' : '', b.amount.toFixed(0), ")", idx < 1 ? ' • ' : ''] }, idx))) }), _jsxs("div", { className: 'mt-1 text-muted-foreground', children: ["Confian\u00E7a: ", (dynamicPricing.confidence * 100).toFixed(0), "%"] })] })), _jsx("div", { className: 'pt-2', children: _jsx(Button, { variant: 'secondary', size: 'sm', onClick: (e) => {
                                e.stopPropagation();
                                onGenerateItinerary && onGenerateItinerary(result);
                            }, children: "Gerar Itiner\u00E1rio" }) })] })] }));
};
/** @alias */
export default GridCard;
//# sourceMappingURL=GridCard.js.map