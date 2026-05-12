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

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../utils/cn';
import type { BaseComponentProps } from '../../types';

// ============================================================================
// Styles Configuration
// ============================================================================

/**
 * Card style variants
 */
export const cardVariants = cva(
    [
        'rounded-lg border bg-card text-card-foreground shadow-sm',
        'transition-all duration-200',
    ].join(' '),
    {
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
    }
);

// ============================================================================
// Types
// ============================================================================

export interface CardProps
    extends BaseComponentProps,
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
    /**
     * Render as a child element (polymorphic)
     * Useful for rendering as a link or clickable element
     */
    asChild?: boolean;

    /**
     * Add hover effect (elevation change)
     */
    hoverable?: boolean;

    /**
     * Make the card focusable
     */
    tabIndex?: number;
}

// ============================================================================
// Card Component
// ============================================================================

/**
 * Card container component
 */
const Card = React.forwardRef<HTMLDivElement, CardProps>(
    (
        {
            className,
            variant = 'default',
            padding = 'none',
            asChild = false,
            hoverable = false,
            children,
            ...props
        },
        ref
    ) => {
        const Comp = asChild ? Slot : 'div';

        return (
            <Comp
                ref={ref}
                className={cn(
                    cardVariants({ variant, padding }),
                    hoverable && 'hover:shadow-md hover:-translate-y-0.5 cursor-pointer',
                    className
                )}
                {...props}
            >
                {children}
            </Comp>
        );
    }
);

Card.displayName = 'Card';

// ============================================================================
// Card Header
// ============================================================================

export interface CardHeaderProps extends BaseComponentProps, React.HTMLAttributes<HTMLDivElement> {
    /**
     * Space between title and description
     * @default true
     */
    spaced?: boolean;
}

/**
 * Card header container for title and description
 */
const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
    ({ className, spaced = true, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                'flex flex-col',
                spaced && 'space-y-1.5',
                'p-6',
                className
            )}
            {...props}
        />
    )
);

CardHeader.displayName = 'CardHeader';

// ============================================================================
// Card Title
// ============================================================================

export interface CardTitleProps
    extends BaseComponentProps,
        Omit<React.HTMLAttributes<HTMLHeadingElement>, 'className'> {
    /**
     * Heading level for semantic HTML
     * @default "h3"
     */
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

/**
 * Card title component with semantic heading
 */

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
    ({ className, as: Component = 'h3', ...props }, ref) => (
        <Component
            ref={ref}
            className={cn(
                'text-2xl font-semibold leading-none tracking-tight',
                className
            )}
            {...props}
        />
    )
);

CardTitle.displayName = 'CardTitle';

// ============================================================================
// Card Description
// ============================================================================

export interface CardDescriptionProps extends BaseComponentProps, React.HTMLAttributes<HTMLParagraphElement> { }

/**
 * Card description for subtitle text
 */
const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
    ({ className, ...props }, ref) => (
        <p
            ref={ref}
            className={cn('text-sm text-muted-foreground', className)}
            {...props}
        />
    )
);

CardDescription.displayName = 'CardDescription';

// ============================================================================
// Card Content
// ============================================================================

export interface CardContentProps extends BaseComponentProps, React.HTMLAttributes<HTMLDivElement> { }

/**
 * Card content area
 */
const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
    )
);

CardContent.displayName = 'CardContent';

// ============================================================================
// Card Footer
// ============================================================================

export interface CardFooterProps extends BaseComponentProps, React.HTMLAttributes<HTMLDivElement> {
    /**
     * Layout direction
     * @default "horizontal"
     */
    direction?: 'horizontal' | 'vertical';
}

/**
 * Card footer for actions
 */
const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
    ({ className, direction = 'horizontal', ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                'flex p-6 pt-0',
                direction === 'horizontal'
                    ? 'items-center justify-between'
                    : 'flex-col gap-2',
                className
            )}
            {...props}
        />
    )
);

CardFooter.displayName = 'CardFooter';

// ============================================================================
// Exports
// ============================================================================

export {
    Card,
    CardHeader,
    CardFooter,
    CardTitle,
    CardDescription,
    CardContent,
};

export default Card;
