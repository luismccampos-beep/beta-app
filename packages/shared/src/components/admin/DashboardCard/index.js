"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

import { cn } from '../../../utils';
export const DashboardCard = ({ title, description, icon: Icon, href, color = 'blue', value, change, trend, stats, actions, className = '', onClick, ...props }) => {
    const colorConfigs = {
        blue: {
            bg: 'from-blue-500/10 to-blue-600/10 dark:from-blue-500/20 dark:to-blue-600/20',
            border: 'border-blue-200/50 dark:border-blue-800/50',
            text: 'text-blue-600 dark:text-blue-400',
            iconBg: 'bg-blue-100 dark:bg-blue-900/40',
            gradient: 'from-blue-500 to-blue-600'
        },
        green: {
            bg: 'from-green-500/10 to-green-600/10 dark:from-green-500/20 dark:to-green-600/20',
            border: 'border-green-200/50 dark:border-green-800/50',
            text: 'text-green-600 dark:text-green-400',
            iconBg: 'bg-green-100 dark:bg-green-900/40',
            gradient: 'from-green-500 to-green-600'
        },
        purple: {
            bg: 'from-purple-500/10 to-purple-600/10 dark:from-purple-500/20 dark:to-purple-600/20',
            border: 'border-purple-200/50 dark:border-purple-800/50',
            text: 'text-purple-600 dark:text-purple-400',
            iconBg: 'bg-purple-100 dark:bg-purple-900/40',
            gradient: 'from-purple-500 to-purple-600'
        },
        cyan: {
            bg: 'from-cyan-500/10 to-cyan-600/10 dark:from-cyan-500/20 dark:to-cyan-600/20',
            border: 'border-cyan-200/50 dark:border-cyan-800/50',
            text: 'text-cyan-600 dark:text-cyan-400',
            iconBg: 'bg-cyan-100 dark:bg-cyan-900/40',
            gradient: 'from-cyan-500 to-cyan-600'
        },
        orange: {
            bg: 'from-orange-500/10 to-orange-600/10 dark:from-orange-500/20 dark:to-orange-600/20',
            border: 'border-orange-200/50 dark:border-orange-800/50',
            text: 'text-orange-600 dark:text-orange-400',
            iconBg: 'bg-orange-100 dark:bg-orange-900/40',
            gradient: 'from-orange-500 to-orange-600'
        },
        red: {
            bg: 'from-red-500/10 to-red-600/10 dark:from-red-500/20 dark:to-red-600/20',
            border: 'border-red-200/50 dark:border-red-800/50',
            text: 'text-red-600 dark:text-red-400',
            iconBg: 'bg-red-100 dark:bg-red-900/40',
            gradient: 'from-red-500 to-red-600'
        },
        yellow: {
            bg: 'from-yellow-500/10 to-yellow-600/10 dark:from-yellow-500/20 dark:to-yellow-600/20',
            border: 'border-yellow-200/50 dark:border-yellow-800/50',
            text: 'text-yellow-600 dark:text-yellow-400',
            iconBg: 'bg-yellow-100 dark:bg-yellow-900/40',
            gradient: 'from-yellow-500 to-yellow-600'
        },
        indigo: {
            bg: 'from-indigo-500/10 to-indigo-600/10 dark:from-indigo-500/20 dark:to-indigo-600/20',
            border: 'border-indigo-200/50 dark:border-indigo-800/50',
            text: 'text-indigo-600 dark:text-indigo-400',
            iconBg: 'bg-indigo-100 dark:bg-indigo-900/40',
            gradient: 'from-indigo-500 to-indigo-600'
        },
        rose: {
            bg: 'from-rose-500/10 to-rose-600/10 dark:from-rose-500/20 dark:to-rose-600/20',
            border: 'border-rose-200/50 dark:border-rose-800/50',
            text: 'text-rose-600 dark:text-rose-400',
            iconBg: 'bg-rose-100 dark:bg-rose-900/40',
            gradient: 'from-rose-500 to-rose-600'
        },
        emerald: {
            bg: 'from-emerald-500/10 to-emerald-600/10 dark:from-emerald-500/20 dark:to-emerald-600/20',
            border: 'border-emerald-200/50 dark:border-emerald-800/50',
            text: 'text-emerald-600 dark:text-emerald-400',
            iconBg: 'bg-emerald-100 dark:bg-emerald-900/40',
            gradient: 'from-emerald-500 to-emerald-600'
        },
    };
    const safeColor = Object.prototype.hasOwnProperty.call(colorConfigs, color) ? color : 'blue';
    const config = colorConfigs[safeColor];
    const currentTrend = trend || stats?.trend;
    const currentValue = value || stats?.value;
    const currentChange = change || stats?.change;
    const getTrendIcon = (t) => {
        switch (t) {
            case 'up': return _jsx(ArrowUpRight, { className: "w-3 h-3" });
            case 'down': return _jsx(ArrowDownRight, { className: "w-3 h-3" });
            default: return _jsx(Minus, { className: "w-3 h-3" });
        }
    };
    const getTrendColor = (t) => {
        switch (t) {
            case 'up': return 'text-emerald-500 bg-emerald-500/10';
            case 'down': return 'text-rose-500 bg-rose-500/10';
            default: return 'text-muted-foreground bg-muted';
        }
    };
    const handleClick = () => {
        if (onClick) {
            onClick();
        }
        else if (href) {
            window.location.href = href;
        }
    };
    return (_jsxs(motion.div, { whileHover: { y: -5, scale: 1.02 }, transition: { type: 'spring', stiffness: 300, damping: 20 }, className: cn('relative overflow-hidden rounded-2xl border border-border p-6 bg-card text-card-foreground shadow-sm hover:shadow-xl transition-shadow cursor-pointer', className), onClick: handleClick, ...props, children: [_jsx("div", { className: `absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 bg-gradient-to-br ${config.bg} rounded-full blur-3xl opacity-50` }), _jsxs("div", { className: "relative flex flex-col h-full", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("div", { className: cn('p-3 rounded-xl', config.iconBg, config.text), children: Icon && (React.isValidElement(Icon) ? Icon : _jsx(Icon, { className: "w-6 h-6" })) }), href && !onClick && (_jsx("div", { className: "p-2 hover:bg-muted rounded-lg transition-colors", children: _jsx(ArrowUpRight, { className: "w-5 h-5 text-muted-foreground" }) }))] }), _jsxs("div", { className: "mt-auto", children: [_jsx("p", { className: "text-sm font-medium text-muted-foreground", children: title }), _jsxs("div", { className: "flex items-baseline gap-2 mt-1", children: [_jsx("h3", { className: "text-3xl font-bold text-foreground tracking-tight", children: currentValue }), currentChange && (_jsxs("div", { className: cn('flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-bold', getTrendColor(currentTrend)), children: [getTrendIcon(currentTrend), typeof currentChange === 'number' ? `${Math.abs(currentChange)}%` : currentChange] }))] }), description && (_jsx("p", { className: "mt-2 text-xs text-muted-foreground line-clamp-1", children: description }))] }), actions && actions.length > 0 && (_jsx("div", { className: "flex flex-wrap gap-2 mt-4 pt-4 border-t border-border", children: actions.map((action, index) => (_jsx("div", { onClick: (e) => {
                                e.stopPropagation();
                                window.location.href = action.href;
                            }, className: cn('flex-1 text-center px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer', action.variant === 'outline'
                                ? 'border border-border hover:bg-muted'
                                : `bg-gradient-to-r ${config.gradient} text-white shadow-sm hover:opacity-90`), children: action.label }, index))) }))] })] }));
};
/** @alias */
export default DashboardCard;
//# sourceMappingURL=index.js.map