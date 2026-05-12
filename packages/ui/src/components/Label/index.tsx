/**
 * Label Component
 * 
 * Accessible label component for form elements.
 * 
 * @example
 * ```tsx
 * <Label htmlFor="email">Email Address</Label>
 * <Input id="email" type="email" />
 * 
 * // With required indicator
 * <Label htmlFor="name" required>Name</Label>
 * 
 * // As a wrapper
 * <Label className="flex items-center gap-2">
 *   <Checkbox />
 *   <span>Accept terms</span>
 * </Label>
 * ```
 */

'use client';

import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../utils/cn';
import type { BaseComponentProps } from '../../types';

// ============================================================================
// Styles Configuration
// ============================================================================

/**
 * Label style variants
 */
export const labelVariants = cva(
    [
        'text-sm font-medium leading-none',
        'peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        'cursor-pointer',
        'transition-colors duration-200',
    ].join(' '),
    {
        variants: {
            size: {
                sm: 'text-xs',
                md: 'text-sm',
                lg: 'text-base',
            },
            variant: {
                default: '',
                error: 'text-destructive',
            },
        },
        defaultVariants: {
            size: 'md',
            variant: 'default',
        },
    }
);

// ============================================================================
// Types
// ============================================================================

export interface LabelProps
    extends BaseComponentProps,
    React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>,
    VariantProps<typeof labelVariants> {
    /**
     * Show required indicator
     */
    required?: boolean;

    /**
     * Hide the label visually but keep it accessible to screen readers
     */
    visuallyHidden?: boolean;
}

// ============================================================================
// Main Label Component
// ============================================================================

/**
 * Label component with accessibility features
 * 
 * Features:
 * - Automatic association with form controls via htmlFor
 * - Required indicator support
 * - Visual hidden mode for accessibility
 * - Proper cursor styling
 */
const Label = React.forwardRef<React.ElementRef<typeof LabelPrimitive.Root>, LabelProps>(
    (
        {
            className,
            size = 'md',
            variant = 'default',
            required = false,
            visuallyHidden = false,
            children,
            ...props
        },
        ref
    ) => {
        return (
            <LabelPrimitive.Root
                ref={ref}
                className={cn(
                    labelVariants({ size, variant }),
                    visuallyHidden && 'sr-only',
                    className
                )}
                {...props}
            >
                {children}
                {required && (
                    <span
                        className="ml-1 text-destructive"
                        aria-hidden="true"
                    >
                        *
                    </span>
                )}
                {required && (
                    <span className="sr-only">(required)</span>
                )}
            </LabelPrimitive.Root>
        );
    }
);

Label.displayName = LabelPrimitive.Root.displayName;

// ============================================================================
// Form Label Component
// ============================================================================

export interface FormLabelProps extends LabelProps {
    /**
     * Helper text to display below the label
     */
    helperText?: string;
}

/**
 * Form label with optional helper text
 */
const FormLabel = React.forwardRef<React.ElementRef<typeof LabelPrimitive.Root>, FormLabelProps>(
    ({ helperText, className, ...props }, ref) => {
        return (
            <div className={cn('space-y-1', className)}>
                <Label ref={ref} {...props} />
                {helperText && (
                    <p className="text-xs text-muted-foreground">{helperText}</p>
                )}
            </div>
        );
    }
);

FormLabel.displayName = 'FormLabel';

// ============================================================================
// Exports
// ============================================================================

export { Label, FormLabel };
export default Label;
