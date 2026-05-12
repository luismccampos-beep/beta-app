/**
 * Alert Component
 * 
 * Displays callout messages for user feedback.
 * Supports multiple severity levels and icon customization.
 * 
 * @example
 * ```tsx
 * // Basic alert
 * <Alert>
 *   <AlertTitle>Heads up!</AlertTitle>
 *   <AlertDescription>You can add components to your app using the cli.</AlertDescription>
 * </Alert>
 * 
 * // Destructive alert
 * <Alert variant="destructive">
 *   <AlertCircle className="h-4 w-4" />
 *   <AlertTitle>Error</AlertTitle>
 *   <AlertDescription>Something went wrong.</AlertDescription>
 * </Alert>
 * 
 * // With action
 * <Alert>
 *   <AlertTitle>Success!</AlertTitle>
 *   <AlertDescription>Your changes have been saved.</AlertDescription>
 *   <AlertAction>
 *     <Button size="sm" variant="outline">Undo</Button>
 *   </AlertAction>
 * </Alert>
 * ```
 */

'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import type { LucideIcon } from 'lucide-react';

import { cn } from '../../utils/cn';
import type { BaseComponentProps } from '../../types';

// ============================================================================
// Styles Configuration
// ============================================================================

/**
 * Alert style variants
 */
export const alertVariants = cva(
    [
        'relative w-full rounded-lg border p-4',
        '[&>svg~*]:pl-7 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground',
        'transition-all duration-200',
    ].join(' '),
    {
        variants: {
            variant: {
                default: 'bg-background text-foreground',
                destructive: [
                    'border-destructive/50 text-destructive',
                    'dark:border-destructive',
                    '[&>svg]:text-destructive',
                ].join(' '),
                success: [
                    'border-green-200 bg-green-50 text-green-800',
                    'dark:border-green-900 dark:bg-green-900/10 dark:text-green-400',
                    '[&>svg]:text-green-600',
                ].join(' '),
                warning: [
                    'border-yellow-200 bg-yellow-50 text-yellow-800',
                    'dark:border-yellow-900 dark:bg-yellow-900/10 dark:text-yellow-400',
                    '[&>svg]:text-yellow-600',
                ].join(' '),
                info: [
                    'border-blue-200 bg-blue-50 text-blue-800',
                    'dark:border-blue-900 dark:bg-blue-900/10 dark:text-blue-400',
                    '[&>svg]:text-blue-600',
                ].join(' '),
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
);

// ============================================================================
// Types
// ============================================================================

export interface AlertProps
    extends BaseComponentProps,
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
    /**
     * Optional icon to display
     */
    icon?: LucideIcon;
}

// ============================================================================
// Main Alert Component
// ============================================================================

/**
 * Alert container component
 * 
 * Features:
 * - Multiple severity variants
 * - Automatic icon support
 * - Role="alert" for screen readers
 * - High contrast colors for accessibility
 */
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
    ({ className, variant = 'default', icon: Icon, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                role="alert"
                className={cn(alertVariants({ variant }), className)}
                {...props}
            >
                {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
                {children}
            </div>
        );
    }
);

Alert.displayName = 'Alert';

// ============================================================================
// Alert Title
// ============================================================================

export interface AlertTitleProps extends BaseComponentProps, React.HTMLAttributes<HTMLHeadingElement> {
    /**
     * Heading level for semantic HTML
     * @default "h5"
     */
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

/**
 * Alert title component
 */
const AlertTitle = React.forwardRef<HTMLHeadingElement, AlertTitleProps>(
    ({ className, as: Component = 'h5', ...props }, ref) => (
        <Component
            ref={ref}
            className={cn('mb-1 font-medium leading-none tracking-tight', className)}
            {...props}
        />
    )
);

AlertTitle.displayName = 'AlertTitle';

// ============================================================================
// Alert Description
// ============================================================================

export interface AlertDescriptionProps extends BaseComponentProps, React.HTMLAttributes<HTMLDivElement> { }

/**
 * Alert description component
 */
const AlertDescription = React.forwardRef<HTMLDivElement, AlertDescriptionProps>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn('text-sm [&_p]:leading-relaxed', className)}
            {...props}
        />
    )
);

AlertDescription.displayName = 'AlertDescription';

// ============================================================================
// Alert Action
// ============================================================================

export interface AlertActionProps extends BaseComponentProps, React.HTMLAttributes<HTMLDivElement> { }

/**
 * Alert action area for buttons
 */
const AlertAction = React.forwardRef<HTMLDivElement, AlertActionProps>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn('mt-3 flex items-center gap-2', className)}
            {...props}
        />
    )
);

AlertAction.displayName = 'AlertAction';

// ============================================================================
// Exports
// ============================================================================

export { Alert, AlertTitle, AlertDescription, AlertAction };
export default Alert;
