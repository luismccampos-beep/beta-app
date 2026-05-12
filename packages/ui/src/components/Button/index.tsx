/**
 * Button Component
 * 
 * A versatile button component with comprehensive accessibility features,
 * loading states, and flexible styling options.
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <Button>Click me</Button>
 * 
 * // With variants
 * <Button variant="destructive" size="lg">Delete</Button>
 * 
 * // With icons
 * <Button leftIcon={Loader2} loading>Saving...</Button>
 * 
 * // As a link
 * <Button asChild>
 *   <a href="/dashboard">Go to Dashboard</a>
 * </Button>
 * 
 * // With loading state
 * <Button loading loadingText="Submitting...">Submit</Button>
 * ```
 */

'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import type { LucideIcon } from 'lucide-react';

import { cn } from '../../utils/cn';
import type { BaseComponentProps, SizeVariant } from '../../types';

// ============================================================================
// Styles Configuration
// ============================================================================

/**
 * Button style variants using class-variance-authority
 * Provides consistent styling across all button states
 */
export const buttonVariants = cva(
    // Base styles
    [
        'inline-flex items-center justify-center whitespace-nowrap',
        'rounded-md text-sm font-medium',
        'ring-offset-background',
        'transition-all duration-200 ease-in-out',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        'active:scale-[0.98]',
    ].join(' '),
    {
        variants: {
            variant: {
                default: [
                    'bg-primary text-primary-foreground',
                    'hover:bg-primary/90',
                    'shadow-sm',
                ].join(' '),
                destructive: [
                    'bg-destructive text-destructive-foreground',
                    'hover:bg-destructive/90',
                    'shadow-sm',
                ].join(' '),
                outline: [
                    'border border-input bg-background',
                    'hover:bg-accent hover:text-accent-foreground',
                ].join(' '),
                secondary: [
                    'bg-secondary text-secondary-foreground',
                    'hover:bg-secondary/80',
                    'shadow-sm',
                ].join(' '),
                ghost: [
                    'hover:bg-accent hover:text-accent-foreground',
                ].join(' '),
                link: [
                    'text-primary underline-offset-4',
                    'hover:underline',
                ].join(' '),
            },
            size: {
                sm: 'h-9 rounded-md px-3 text-xs',
                md: 'h-10 px-4 py-2',
                lg: 'h-11 rounded-md px-8 text-base',
                icon: 'h-10 w-10',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'md',
        },
    }
);

// ============================================================================
// Types
// ============================================================================

export interface ButtonProps
    extends BaseComponentProps,
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'size'>,
    VariantProps<typeof buttonVariants> {
    /**
     * Render as a child element (polymorphic)
     * Useful for rendering as a link or custom component
     */
    asChild?: boolean;

    /**
     * Loading state
     * When true, shows a spinner and disables interactions
     */
    loading?: boolean;

    /**
     * Text to display when loading
     * @default "Loading..."
     */
    loadingText?: string;

    /**
     * Icon to display on the left side
     */
    leftIcon?: LucideIcon;

    /**
     * Icon to display on the right side
     */
    rightIcon?: LucideIcon;

    /**
     * Button size variant
     * @default "md"
     */
    size?: SizeVariant | 'icon';
}

// ============================================================================
// Loading Spinner Component
// ============================================================================

/**
 * Internal loading spinner component
 * Hidden from screen readers as it's decorative
 */
const LoadingSpinner = React.memo(function LoadingSpinner() {
    return (
        <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
        </svg>
    );
});

// ============================================================================
// Main Button Component
// ============================================================================

/**
 * Button component with full accessibility support
 * 
 * Features:
 * - Keyboard navigation support
 * - Focus management
 * - Loading states with reduced motion support
 * - ARIA attributes for screen readers
 * - Polymorphic rendering (asChild)
 * - Consistent styling with design tokens
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            children,
            className,
            variant = 'default',
            size = 'md',
            asChild = false,
            loading = false,
            loadingText = 'Loading...',
            leftIcon: LeftIcon,
            rightIcon: RightIcon,
            disabled,
            'aria-label': ariaLabel,
            type = 'button',
            onClick,
            ...props
        },
        ref
    ) => {
        // Determine the component to render
        const Comp = asChild ? Slot : 'button';

        // Memoize class names for performance
        const buttonClasses = React.useMemo(
            () =>
                cn(
                    buttonVariants({ variant, size }),
                    loading && 'cursor-wait',
                    className
                ),
            [variant, size, loading, className]
        );

        // Determine accessible content
        const accessibleLabel = React.useMemo(() => {
            if (ariaLabel) return ariaLabel;
            if (loading && typeof children === 'string') {
                return loadingText;
            }
            return undefined;
        }, [ariaLabel, loading, children, loadingText]);

        const contentChildren = React.useMemo(() => {
            if (asChild && React.isValidElement(children)) {
                return (children.props as { children?: React.ReactNode }).children;
            }
            return children;
        }, [asChild, children]);

        // Determine what to render as children
        const contentNodes = React.useMemo(() => {
            if (loading) {
                return (
                    <>
                        <LoadingSpinner />
                        <span>{loadingText}</span>
                    </>
                );
            }

            return (
                <>
                    {LeftIcon && (
                        <LeftIcon className="mr-2 h-4 w-4 shrink-0" aria-hidden />
                    )}
                    {contentChildren}
                    {RightIcon && (
                        <RightIcon className="ml-2 h-4 w-4 shrink-0" aria-hidden />
                    )}
                </>
            );
        }, [loading, loadingText, LeftIcon, RightIcon, contentChildren]);

        const renderedChildren = React.useMemo(() => {
            if (!asChild) {
                return contentNodes;
            }

            // When using Radix Slot (asChild=true), Slot expects a single valid element child.
            // Wrapping in a Fragment causes Slot to pass className to Fragment, which is invalid.
            if (asChild && children) {
                try {
                    const child = React.Children.only(children);
                    if (React.isValidElement(child)) {
                        return React.cloneElement(child as React.ReactElement, undefined, contentNodes);
                    }
                } catch (e) {
                    console.error("Button asChild error:", e);
                }
            }

            return children;
        }, [asChild, children, contentNodes]);

        return (
            <Comp
                ref={ref}
                className={buttonClasses}
                disabled={disabled || loading}
                type={asChild ? undefined : type}
                onClick={onClick}
                aria-label={accessibleLabel}
                aria-disabled={disabled || loading}
                aria-busy={loading}
                tabIndex={disabled ? -1 : 0}
                {...props}
            >
                {renderedChildren}
            </Comp>
        );
    }
);

// Display name for debugging
Button.displayName = 'Button';

// ============================================================================
// Icon Button Component
// ============================================================================

export interface IconButtonProps extends Omit<ButtonProps, 'leftIcon' | 'rightIcon' | 'children'> {
    /**
     * Icon component to render
     */
    icon: LucideIcon;

    /**
     * Accessible label for the icon button (required for accessibility)
     */
    'aria-label': string;
}

/**
 * Icon-only button component with required aria-label
 * 
 * @example
 * ```tsx
 * <IconButton icon={X} aria-label="Close dialog" onClick={handleClose} />
 * ```
 */
const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
    ({ icon: Icon, className, size = 'icon', ...props }, ref) => {
        return (
            <Button ref={ref} size={size} className={className} {...props}>
                <Icon className="h-4 w-4" aria-hidden />
            </Button>
        );
    }
);

IconButton.displayName = 'IconButton';

// ============================================================================
// Exports
// ============================================================================

export { Button, IconButton };
export default Button;
