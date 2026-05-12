"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";

import { cn } from '../../../../utils';
import { formatPrice } from '../utils';
export const MinimalView = ({ total, currency, locale, highlightTotal }) => (_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-muted-foreground", children: "Total" }), _jsx("span", { className: cn('font-bold text-lg', highlightTotal && 'text-primary'), children: formatPrice(total, currency, locale) })] }));
//# sourceMappingURL=MinimalView.js.map