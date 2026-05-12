/**
 * Card Component
 *
 * A versatile container component for grouping related content.
 * Provides consistent styling, accessibility, and composability.
 *
 * @example
 * ```tsx
 * // Basic card
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Card Title</CardTitle>
 *     <CardDescription>Card description</CardDescription>
 *   </CardHeader>
 *   <CardContent>
 *     <p>Card content goes here</p>
 *   </CardContent>
 *   <CardFooter>
 *     <Button>Action</Button>
 *   </CardFooter>
 * </Card>
 *
 * // As a link
 * <Card asChild>
 *   <a href="/details">
 *     <CardContent>Clickable card</CardContent>
 *   </a>
 * </Card>
 *
 * // With hover effect
 * <Card hoverable>
 *   <CardContent>Hover over me</CardContent>
 * </Card>
 * ```
 */
'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';
// ============================================================================
// Styles Configuration
// ============================================================================
/**
 * Card style variants
 */
export const cardVariants = cva([
    'rounded-lg border bg-card text-card-foreground shadow-sm',
    'transition-all duration-200',
].join(' '), {
    variants: {
        variant: {
            default: '',
            outline: 'border-2',
            ghost: 'border-none shadow-none bg-transparent',
        },
        padding: {
            none: '',
            sm: 'p-4',
            md: 'p-6',
            lg: 'p-8',
        },
    },
    defaultVariants: {
        variant: 'default',
        padding: 'none',
    },
});
// ============================================================================
// Card Component
// ============================================================================
/**
 * Card container component
 */
const Card = React.forwardRef(({ className, variant = 'default', padding = 'none', asChild = false, hoverable = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'div';
    return (_jsx(Comp, { ref: ref, className: cn(cardVariants({ variant, padding }), hoverable && 'hover:shadow-md hover:-translate-y-0.5 cursor-pointer', className), ...props, children: children }));
});
Card.displayName = 'Card';
/**
 * Card header container for title and description
 */
const CardHeader = React.forwardRef(({ className, spaced = true, ...props }, ref) => (_jsx("div", { ref: ref, className: cn('flex flex-col', spaced && 'space-y-1.5', 'p-6', className), ...props })));
CardHeader.displayName = 'CardHeader';
/**
 * Card title component with semantic heading
 */
const CardTitle = React.forwardRef(({ className, as: Component = 'h3', ...props }, ref) => (_jsx(Component, { ref: ref, className: cn('text-2xl font-semibold leading-none tracking-tight', className), ...props })));
CardTitle.displayName = 'CardTitle';
/**
 * Card description for subtitle text
 */
const CardDescription = React.forwardRef(({ className, ...props }, ref) => (_jsx("p", { ref: ref, className: cn('text-sm text-muted-foreground', className), ...props })));
CardDescription.displayName = 'CardDescription';
/**
 * Card content area
 */
const CardContent = React.forwardRef(({ className, ...props }, ref) => (_jsx("div", { ref: ref, className: cn('p-6 pt-0', className), ...props })));
CardContent.displayName = 'CardContent';
/**
 * Card footer for actions
 */
const CardFooter = React.forwardRef(({ className, direction = 'horizontal', ...props }, ref) => (_jsx("div", { ref: ref, className: cn('flex p-6 pt-0', direction === 'horizontal'
        ? 'items-center justify-between'
        : 'flex-col gap-2', className), ...props })));
CardFooter.displayName = 'CardFooter';
// ============================================================================
// Exports
// ============================================================================
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, };
export default Card;
//# sourceMappingURL=index.js.map