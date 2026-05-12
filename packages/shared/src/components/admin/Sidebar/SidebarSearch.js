"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Search, X } from 'lucide-react';

import { cn } from '../../../utils';
import { SidebarSearchProps, NavigationItem } from './types';
export const SidebarSearch = ({ query, onQueryChange, results, isCollapsed = false, placeholder = 'Search...', onSelectResult }) => {
    const handleClear = () => {
        onQueryChange('');
    };
    const handleSelect = (item) => {
        if (onSelectResult) {
            onSelectResult(item);
        }
    };
    if (isCollapsed) {
        return null;
    }
    return (_jsxs("div", { className: "relative", children: [_jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" }), _jsx("input", { type: "text", value: query, onChange: (e) => onQueryChange(e.target.value), placeholder: placeholder, className: cn('w-full pl-10 pr-10 py-2 bg-muted/50 border border-border rounded-lg', 'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary', 'text-sm placeholder:text-muted-foreground') }), query && (_jsx("button", { onClick: handleClear, className: "absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors", children: _jsx(X, { className: "w-4 h-4" }) }))] }), query && results.length > 0 && (_jsx("div", { className: "absolute top-full left-0 right-0 mt-2 bg-popover border rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto", children: _jsx("div", { className: "p-2", children: results.map((item) => (_jsxs("div", { onClick: () => handleSelect(item), className: "flex items-center gap-3 p-2 rounded-md hover:bg-muted cursor-pointer transition-colors", children: [item.icon && _jsx(item.icon, { className: "w-4 h-4 text-muted-foreground" }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("div", { className: "text-sm font-medium truncate", children: item.label }), item.description && (_jsx("div", { className: "text-xs text-muted-foreground truncate", children: item.description }))] })] }, item.id))) }) }))] }));
};
//# sourceMappingURL=SidebarSearch.js.map