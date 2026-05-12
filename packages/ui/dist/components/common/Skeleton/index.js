import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { cn } from '../../../utils';
const Skeleton = React.forwardRef(({ className, variant = 'default', animation = 'pulse', width, height, circle, ...props }, ref) => {
    const finalVariant = circle ? 'circular' : variant;
    const baseClasses = 'bg-muted';
    const getVariantClasses = (value = 'default') => {
        switch (value) {
            case 'text':
                return 'rounded-sm h-4';
            case 'circular':
                return 'rounded-full';
            case 'rectangular':
                return 'rounded-md';
            default:
                return 'rounded';
        }
    };
    const getAnimationClasses = (value = 'pulse') => {
        switch (value) {
            case 'wave':
                return 'animate-shimmer bg-gradient-to-r from-transparent via-muted to-transparent bg-[length:200%_100%]';
            case 'none':
                return '';
            default:
                return 'animate-pulse';
        }
    };
    const style = {
        width: width || (finalVariant === 'text' ? '100%' : undefined),
        height: height || (finalVariant === 'text' ? '1rem' : undefined),
        ...props.style,
    };
    return (_jsx("div", { ref: ref, className: cn(baseClasses, getVariantClasses(finalVariant), getAnimationClasses(animation), className), style: style, ...props }));
});
Skeleton.displayName = 'Skeleton';
export const CardSkeleton = ({ showAvatar = true, showTitle = true, showDescription = true, lines = 3, className }) => (_jsxs("div", { className: cn('rounded-lg border p-4 space-y-3', className), children: [showAvatar && (_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx(Skeleton, { variant: "circular", width: 40, height: 40 }), _jsx("div", { className: "space-y-2 flex-1", children: showTitle && _jsx(Skeleton, { width: "60%", height: 16 }) })] })), showDescription && (_jsx("div", { className: "space-y-2", children: Array.from({ length: lines }).map((_, i) => (_jsx(Skeleton, { width: i === lines - 1 ? '80%' : '100%', height: 14 }, i))) }))] }));
export const ListSkeleton = ({ items = 5, showAvatar = true, className }) => (_jsx("div", { className: cn('space-y-4', className), children: Array.from({ length: items }).map((_, i) => (_jsxs("div", { className: "flex items-center space-x-3", children: [showAvatar && _jsx(Skeleton, { variant: "circular", width: 32, height: 32 }), _jsxs("div", { className: "space-y-2 flex-1", children: [_jsx(Skeleton, { width: "40%", height: 14 }), _jsx(Skeleton, { width: "60%", height: 12 })] })] }, i))) }));
export const TableSkeleton = ({ rows = 5, columns = 4, showHeader = true, className }) => (_jsxs("div", { className: cn('space-y-2', className), children: [showHeader && (_jsx("div", { className: "flex space-x-4 p-2 border-b", children: Array.from({ length: columns }).map((_, i) => (_jsx(Skeleton, { width: 100, height: 20 }, `header-${i}`))) })), Array.from({ length: rows }).map((_, rowIndex) => (_jsx("div", { className: "flex space-x-4 p-2", children: Array.from({ length: columns }).map((_, colIndex) => (_jsx(Skeleton, { width: colIndex === 0 ? 120 : 80, height: 16 }, `cell-${rowIndex}-${colIndex}`))) }, `row-${rowIndex}`)))] }));
export { Skeleton };
//# sourceMappingURL=index.js.map