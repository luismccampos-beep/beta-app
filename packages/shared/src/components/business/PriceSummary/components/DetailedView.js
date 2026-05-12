"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Info } from 'lucide-react';

import { cn } from '../../../../utils';
import { PriceItemRow } from './PriceItemRow';
import { SummaryCards } from './SummaryCards';
import { formatPrice } from '../utils';
export const DetailedView = ({ calculations, items, currency, locale, highlightTotal, showCalculation, onItemHover, hoveredItem, CalculationBreakdown }) => (_jsxs("div", { className: "space-y-4", children: [_jsx(SummaryCards, { subtotal: calculations.subtotal, discounts: calculations.discounts, taxes: calculations.taxes, fees: calculations.fees, extras: calculations.extras, currency: currency, locale: locale }), _jsxs("div", { className: "border rounded-lg p-4 space-y-3", children: [_jsxs("h4", { className: "font-medium flex items-center gap-2", children: [_jsx(Info, { className: "h-4 w-4" }), "Detalhamento"] }), items.map((item) => (_jsx(PriceItemRow, { item: item, currency: currency, locale: locale, onHover: onItemHover, showHoverIcon: true, isHovered: hoveredItem === item.id }, item.id))), _jsxs("div", { className: cn('flex justify-between items-center font-bold text-lg pt-3 border-t-2', highlightTotal && 'text-primary'), children: [_jsx("span", { children: "Total" }), _jsx("span", { children: formatPrice(calculations.total, currency, locale) })] })] }), showCalculation && (_jsx(CalculationBreakdown, { subtotal: calculations.subtotal, discounts: calculations.discounts, taxes: calculations.taxes, fees: calculations.fees, extras: calculations.extras, total: calculations.total, currency: currency, locale: locale }))] }));
//# sourceMappingURL=DetailedView.js.map