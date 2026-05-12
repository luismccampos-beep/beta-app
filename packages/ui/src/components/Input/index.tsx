/**
 * Input Component
 * 
 * A comprehensive input component with built-in label, error handling,
 * and accessibility features.
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <Input placeholder="Enter your name" />
 * 
 * // With label and helper text
 * <Input 
 *   label="Email" 
 *   helperText="We'll never share your email"
 *   type="email"
 * />
 * 
 * // With error state
 * <Input 
 *   label="Username"
 *   error="Username is required"
 *   aria-invalid
 * />
 * 
 * // With start/end adornments
 * <Input 
 *   startAdornment={<Search className="h-4 w-4" />}
 *   endAdornment={<span>@</span>}
 * />
 * ```
 */

'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../utils/cn';
import { Label } from '../Label';
import type { BaseComponentProps, SizeVariant } from '../../types';

// ============================================================================
// Styles Configuration
// ============================================================================

/**
 * Input style variants
 */
export const inputVariants = cva(
    [
        'flex w-full',
        'rounded-md border border-input bg-background',
        'px-3 py-2 text-sm',
        'ring-offset-background',
        'file:border-0 file:bg-transparent file:text-sm file:font-medium',
        'placeholder:text-muted-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'transition-colors duration-200',
    ].join(' '),
    {
        variants: {
            size: {
                sm: 'h-8 px-2 text-xs',
                md: 'h-10 px-3 py-2',
                lg: 'h-12 px-4 text-base',
            },
            variant: {
                default: '',
                error: 'border-destructive focus-visible:ring-destructive',
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

export interface InputProps
    extends BaseComponentProps,
    Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'label'>,
    VariantProps<typeof inputVariants> {
    /**
     * Label text displayed above the input
     */
    label?: React.ReactNode;

    /**
     * Helper text displayed below the input
     */
    helperText?: React.ReactNode;

    /**
     * Error message displayed below the input
     * When provided, the input will show error styling
     */
    error?: string;

    /**
     * Size variant of the input
     * @default "md"
     */
    size?: SizeVariant;

    /**
     * Content to display at the start of the input (inside)
     */
    startAdornment?: React.ReactNode;

    /**
     * Content to display at the end of the input (inside)
     */
    endAdornment?: React.ReactNode;

    /**
     * Whether to hide the label visually (but keep accessible)
     */
    hideLabel?: boolean;

    /**
     * Ref forwarded to the input element
     */
    ref?: React.Ref<HTMLInputElement>;
}

// ============================================================================
// Helper Components
// ============================================================================

/**
 * Form helper text component
 */
const FormHelperText = React.memo(function FormHelperText({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <p className={cn('text-xs text-muted-foreground', className)}>
            {children}
        </p>
    );
});

/**
 * Form error message component
 */
const FormErrorMessage = React.memo(function FormErrorMessage({
    children,
    className,
    id,
}: {
    children: React.ReactNode;
    className?: string;
    id?: string;
}) {
    return (
        <p
            id={id}
            className={cn('text-xs font-medium text-destructive', className)}
            role="alert"
        >
            {children}
        </p>
    );
});

// ============================================================================
// Main Input Component
// ============================================================================

/**
 * Input component with comprehensive accessibility features
 * 
 * Features:
 * - Automatic label association
 * - Error state handling with ARIA
 * - Helper text support
 * - Start/end adornments
 * - Responsive sizing
 * - Full keyboard navigation
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
    (
        {
            className,
            type = 'text',
            label,
            helperText,
            error,
            size = 'md',
            startAdornment,
            endAdornment,
            hideLabel = false,
            disabled,
            required,
            id: idProp,
            'aria-describedby': ariaDescribedByProp,
            'aria-invalid': ariaInvalidProp,
            ...props
        },
        ref
    ) => {
        // Generate unique ID for accessibility
        const generatedId = React.useId();
        const id = idProp ?? generatedId;

        // Generate IDs for accessibility attributes
        const labelId = `${id}-label`;
        const helperId = `${id}-helper`;
        const errorId = `${id}-error`;

        // Determine ARIA attributes
        const hasError = Boolean(error);
        const ariaInvalid = ariaInvalidProp ?? hasError;

        // Build aria-describedby
        const ariaDescribedBy = React.useMemo(() => {
            const describedByIds: string[] = [];
            if (helperText) describedByIds.push(helperId);
            if (hasError) describedByIds.push(errorId);
            if (ariaDescribedByProp) describedByIds.push(ariaDescribedByProp);
            return describedByIds.length > 0 ? describedByIds.join(' ') : undefined;
        }, [helperText, hasError, helperId, errorId, ariaDescribedByProp]);

        // Determine input variant based on error state
        const inputVariant = hasError ? 'error' : 'default';

        // Memoize container classes
        const containerClasses = React.useMemo(
            () => cn('w-full space-y-1.5', className),
            [className]
        );

        // Memoize input classes
        const inputClasses = React.useMemo(
            () =>
                cn(
                    inputVariants({ size, variant: inputVariant }),
                    // Adjust padding if adornments are present
                    startAdornment && 'pl-9',
                    endAdornment && 'pr-9'
                ),
            [size, inputVariant, startAdornment, endAdornment]
        );

        return (
            <div className={containerClasses}>
                {/* Label */}
                {label && (
                    <Label
                        id={labelId}
                        htmlFor={id}
                        className={cn(
                            'text-sm font-medium leading-none',
                            hideLabel && 'sr-only'
                        )}
                    >
                        {label}
                        {required && (
                            <span className="ml-1 text-destructive" aria-hidden="true">
                                *
                            </span>
                        )}
                    </Label>
                )}

                {/* Input wrapper for adornments */}
                <div className="relative">
                    {/* Start adornment */}
                    {startAdornment && (
                        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            {startAdornment}
                        </div>
                    )}

                    {/* Input element */}
                    <input
                        ref={ref}
                        id={id}
                        type={type}
                        disabled={disabled}
                        required={required}
                        aria-invalid={ariaInvalid}
                        aria-describedby={ariaDescribedBy}
                        aria-required={required}
                        aria-disabled={disabled}
                        className={inputClasses}
                        {...props}
                    />

                    {/* End adornment */}
                    {endAdornment && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            {endAdornment}
                        </div>
                    )}
                </div>

                {/* Helper text or error message */}
                <div className="space-y-1">
                    {helperText && !hasError && (
                        <FormHelperText>{helperText}</FormHelperText>
                    )}
                    {hasError && (
                        <FormErrorMessage id={errorId}>{error}</FormErrorMessage>
                    )}
                </div>
            </div>
        );
    }
);

Input.displayName = 'Input';

// ============================================================================
// Exports
// ============================================================================

export { Input };
export default Input;
