"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ExternalLink } from 'lucide-react';

import { cn } from '../../../utils';
import { NavItemProps } from './types';
export const NavItem = ({ item, isActive = false, isCollapsed = false, onClick, className }) => {
    const handleClick = () => {
        if (onClick) {
            onClick(item);
        }
        else if (item.href) {
            if (item.external) {
                window.open(item.href, '_blank');
            }
            else {
                window.location.href = item.href;
            }
        }
    };
    return (_jsxs(motion.div, { whileHover: { x: 2 }, whileTap: { scale: 0.98 }, className: cn('group relative flex items-center gap-3 px-3 py-2 rounded-lg transition-all cursor-pointer', 'hover:bg-muted/50', isActive && 'bg-primary/10 text-primary font-medium', isCollapsed && 'justify-center px-2', item.isDisabled && 'opacity-50 cursor-not-allowed', className), onClick: handleClick, children: [item.icon && (_jsx("div", { className: cn('flex-shrink-0 transition-colors', isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'), children: _jsx(item.icon, { className: "w-5 h-5" }) })), !isCollapsed && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: cn('text-sm font-medium truncate', isActive ? 'text-primary' : 'text-foreground'), children: item.label }), item.badge && (_jsx("span", { className: "ml-2 px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full", children: item.badge }))] }), item.description && (_jsx("p", { className: "text-xs text-muted-foreground truncate mt-0.5", children: item.description }))] }), item.external && (_jsx(ExternalLink, { className: "w-3 h-3 text-muted-foreground" })), item.children && item.children.length > 0 && (_jsx(ChevronRight, { className: "w-4 h-4 text-muted-foreground group-hover:text-foreground transition-transform" }))] })), isCollapsed && (_jsxs("div", { className: "absolute left-full ml-2 px-2 py-1 bg-popover border rounded-md text-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50", children: [item.label, item.description && (_jsx("div", { className: "text-xs text-muted-foreground mt-0.5", children: item.description }))] }))] }));
};
//# sourceMappingURL=NavItem.js.map