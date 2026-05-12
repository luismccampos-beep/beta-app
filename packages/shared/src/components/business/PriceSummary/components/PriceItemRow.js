"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Info } from 'lucide-react';

import { cn } from '../../../../utils';
import { getItemIcon, getItemColor, formatPrice } from '../utils';
export const PriceItemRow = ({ item, currency, locale, onHover, showHoverIcon, isHovered }) => (_jsxs("div", { className: "flex justify-between items-center py-2 border-b last:border-b-0", onMouseEnter: () => onHover?.(item), onMouseLeave: () => onHover?.(null), children: [_jsxs("div", { className: "flex items-center gap-2", children: [getItemIcon(item.type), _jsxs("div", { children: [_jsx("span", { className: "text-sm", children: item.label }), item.description && (_jsx("p", { className: "text-xs text-muted-foreground", children: item.description })), item.recurring && item.period && (_jsxs("span", { className: "text-xs text-muted-foreground", children: ["(", item.period === 'monthly' ? 'mensal' : item.period === 'yearly' ? 'anual' : 'diário', ")"] }))] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("span", { className: cn('font-medium', getItemColor(item.type)), children: [item.type === 'discount' ? '-' : '', formatPrice(item.amount, currency, locale)] }), showHoverIcon && isHovered && (_jsx(Info, { className: "h-3 w-3 text-muted-foreground" }))] })] }));
//# sourceMappingURL=PriceItemRow.js.map