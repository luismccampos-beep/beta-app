"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";

import { cn } from '../../../../utils';
import { formatPrice } from '../utils';

export const CompactView = ({ subtotal, discounts, total, currency, locale, highlightTotal }) => (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { children: "Subtotal" }), _jsx("span", { children: formatPrice(subtotal, currency, locale) })] }), discounts > 0 && (_jsxs("div", { className: "flex justify-between text-sm text-green-600", children: [_jsx("span", { children: "Descontos" }), _jsxs("span", { children: ["-", formatPrice(discounts, currency, locale)] })] })), _jsxs("div", { className: cn('flex justify-between font-semibold pt-2 border-t', highlightTotal && 'text-primary'), children: [_jsx("span", { children: "Total" }), _jsx("span", { children: formatPrice(total, currency, locale) })] })] }));
//# sourceMappingURL=CompactView.js.map