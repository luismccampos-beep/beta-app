"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

import { cn } from '../../../utils';
export const AdminBreadcrumbs = ({ items, separator = _jsx(ChevronRight, { className: "w-4 h-4 text-muted-foreground" }), showHome = true, homeHref = '/admin', className, maxItems = 5 }) => {
    const handleNavigation = (href) => {
        window.location.href = href;
    };
    // Limit items to prevent overflow
    const displayItems = items.length > maxItems
        ? [
            ...items.slice(0, Math.floor(maxItems / 2) - 1),
            { label: '...', isActive: false },
            ...items.slice(-(Math.floor(maxItems / 2)))
        ]
        : items;
    return (_jsxs("nav", { className: cn('flex items-center space-x-1 text-sm', className), children: [showHome && (_jsxs(_Fragment, { children: [_jsxs("button", { onClick: () => handleNavigation(homeHref), className: "flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors", children: [_jsx(Home, { className: "w-4 h-4" }), _jsx("span", { className: "hidden sm:inline", children: "Home" })] }), displayItems.length > 0 && separator] })), displayItems.map((item, index) => {
                const isLast = index === displayItems.length - 1;
                const isEllipsis = item.label === '...';
                return (_jsxs(React.Fragment, { children: [isEllipsis ? (_jsx("span", { className: "text-muted-foreground", children: "..." })) : (_jsxs("button", { onClick: () => item.href && !isLast && handleNavigation(item.href), disabled: !item.href || isLast, className: cn('flex items-center space-x-1 transition-colors', item.isActive || isLast
                                ? 'text-foreground font-medium'
                                : 'text-muted-foreground hover:text-foreground', (!item.href || isLast) && 'cursor-default'), children: [item.icon && _jsx("span", { children: item.icon }), _jsx("span", { children: item.label })] })), !isLast && !isEllipsis && separator] }, index));
            })] }));
};
/** @alias */
export default AdminBreadcrumbs;
//# sourceMappingURL=index.js.map