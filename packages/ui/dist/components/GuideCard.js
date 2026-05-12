import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/GuideCard.tsx
import { Star } from 'lucide-react';
import BaseLink from './common/BaseLink';
import { Button } from './Button';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import OptimizedImage from './OptimizedImage';
const SafeImage = OptimizedImage;
const GuideCard = ({ name, photo, expertise, bio, rating, location, id, }) => {
    return (_jsxs(Card, { className: 'w-full max-w-sm transform transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl', children: [_jsxs(CardHeader, { className: 'relative h-40 overflow-hidden rounded-t-lg', children: [_jsx(SafeImage, { src: photo, alt: name, className: 'h-full w-full object-cover transition-transform duration-500 hover:scale-105' }), _jsx("div", { className: 'absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/60 to-transparent' })] }), _jsxs(CardContent, { className: 'space-y-3', children: [_jsx(CardTitle, { className: 'text-lg font-bold', children: name }), _jsx("p", { className: 'text-sm font-medium text-blue-600', children: expertise }), _jsx("p", { className: 'text-sm text-gray-600 line-clamp-3', children: bio }), _jsxs("div", { className: 'flex items-center gap-2', children: [_jsx("div", { className: 'flex -space-x-1', children: Array.from({ length: 5 }).map((_, i) => (_jsx(Star, { className: `h-5 w-5 transition-colors duration-200 ${i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}` }, i))) }), _jsxs("span", { className: 'text-sm text-gray-500', children: [rating.toFixed(1), " / 5"] })] }), _jsx("p", { className: 'text-sm text-gray-500', children: location }), _jsx(BaseLink, { to: `/guides/${id}`, children: _jsx(Button, { className: 'mt-3 w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700', children: "Saiba Mais" }) })] })] }));
};
export default GuideCard;
//# sourceMappingURL=GuideCard.js.map