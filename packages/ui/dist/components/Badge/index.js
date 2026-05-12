/**
 * Badge Component
 *
 * A compact label for displaying status, categories, or counts.
 *
 * @example
 * ```tsx
 * // Default badge
 * <Badge>New</Badge>
 *
 * // With variants
 * <Badge variant="destructive">Error</Badge>
 * <Badge variant="success">Completed</Badge>
 * <Badge variant="outline">Draft</Badge>
 *
 * // As a dot
 * <Badge variant="dot" dotColor="green">Online</Badge>
 * ```
 */
'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';
// ============================================================================
// Styles Configuration
// ============================================================================
/**
 * Badge style variants using CVA
 */
export const badgeVariants = cva([
    'inline-flex items-center justify-center',
    'rounded-full border px-2.5 py-0.5',
    'text-xs font-semibold',
    'transition-colors duration-200',
    'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
].join(' '), {
    variants: {
        variant: {
            default: [
                'border-transparent bg-primary text-primary-foreground',
                'hover:bg-primary/80',
            ].join(' '),
            secondary: [
                'border-transparent bg-secondary text-secondary-foreground',
                'hover:bg-secondary/80',
            ].join(' '),
            destructive: [
                'border-transparent bg-destructive text-destructive-foreground',
                'hover:bg-destructive/80',
            ].join(' '),
            outline: [
                'text-foreground',
                'hover:bg-muted',
            ].join(' '),
            success: [
                'border-transparent bg-green-500 text-white',
                'hover:bg-green-600',
            ].join(' '),
            warning: [
                'border-transparent bg-yellow-500 text-white',
                'hover:bg-yellow-600',
            ].join(' '),
            info: [
                'border-transparent bg-blue-500 text-white',
                'hover:bg-blue-600',
            ].join(' '),
        },
        size: {
            sm: 'px-2 py-0.5 text-[10px]',
            md: 'px-2.5 py-0.5 text-xs',
            lg: 'px-3 py-1 text-sm',
        },
    },
    defaultVariants: {
        variant: 'default',
        size: 'md',
    },
});
// ============================================================================
// Main Badge Component
// ============================================================================
/**
 * Badge component for displaying status and labels
 *
 * Features:
 * - Multiple color variants for different states
 * - Size variants
 * - Focus ring for keyboard navigation
 * - High contrast text for accessibility
 */
const Badge = React.memo(function Badge({ className, variant = 'default', size = 'md', dotColor, children, ...props }) {
    return (_jsxs("span", { className: cn(badgeVariants({ variant, size }), className), ...props, children: [dotColor && (_jsx("span", { className: "mr-1.5 inline-block h-1.5 w-1.5 rounded-full", style: { backgroundColor: dotColor }, "aria-hidden": "true" })), children] }));
});
Badge.displayName = 'Badge';
// ============================================================================
// Exports
// ============================================================================
export { Badge };
export default Badge;
//# sourceMappingURL=index.js.map