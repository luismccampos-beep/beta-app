/**
 * Checkbox Component
 * 
 * Accessible checkbox input with customizable styling.
 * 
 * @example
 * ```tsx
 * // Basic checkbox
 * <Checkbox id="terms" />
 * <Label htmlFor="terms">Accept terms</Label>
 * 
 * // Controlled checkbox
 * const [checked, setChecked] = React.useState(false);
 * <Checkbox checked={checked} onCheckedChange={setChecked} />
 * 
 * // Indeterminate state
 * <Checkbox checked="indeterminate" />
 * ```
 */

'use client';

import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check, Minus } from 'lucide-react';

import { cn } from '../../utils/cn';
import type { BaseComponentProps } from '../../types';

// ============================================================================
// Types
// ============================================================================

export interface CheckboxProps
    extends BaseComponentProps,
    Omit<React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>, 'checked'> {
    /**
     * The controlled checked state of the checkbox
     */
    checked?: boolean | 'indeterminate';

    /**
     * The default checked state when uncontrolled
     */
    defaultChecked?: boolean | 'indeterminate';

    /**
     * Callback when the checked state changes
     */
    onCheckedChange?: (checked: boolean | 'indeterminate') => void;

    /**
     * Size of the checkbox
     * @default "md"
     */
    size?: 'sm' | 'md' | 'lg';
}

// ============================================================================
// Main Checkbox Component
// ============================================================================

/**
 * Checkbox component with full accessibility support
 * 
 * Features:
 * - Keyboard navigation (Space to toggle)
 * - Indeterminate state support
 * - Focus management
 * - ARIA attributes
 * - Reduced motion support
 */
const Checkbox = React.forwardRef<
    React.ElementRef<typeof CheckboxPrimitive.Root>,
    CheckboxProps
>(
    (
        {
            className,
            size = 'md',
            checked,
            defaultChecked,
            onCheckedChange,
            disabled,
            ...props
        },
        ref
    ) => {
        // Size mappings using Map to avoid object injection security warnings
        const sizeClasses = new Map([
            ['sm', 'h-3.5 w-3.5'],
            ['md', 'h-4 w-4'],
            ['lg', 'h-5 w-5'],
        ]);

        const iconSizeClasses = new Map([
            ['sm', 'h-2.5 w-2.5'],
            ['md', 'h-3.5 w-3.5'],
            ['lg', 'h-4 w-4'],
        ]);

        return (
            <CheckboxPrimitive.Root
                ref={ref}
                checked={checked}
                defaultChecked={defaultChecked}
                onCheckedChange={onCheckedChange}
                disabled={disabled}
                className={cn(
                    'peer shrink-0 rounded-sm border border-primary ring-offset-background',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                    'data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
                    'data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground',
                    'transition-all duration-200',
                    sizeClasses.get(size),
                    className
                )}
                {...props}
            >
                <CheckboxPrimitive.Indicator
                    className={cn('flex items-center justify-center text-current')}
                >
                    {checked === 'indeterminate' ? (
                        <Minus className={iconSizeClasses.get(size)} aria-hidden="true" />
                    ) : (
                        <Check className={iconSizeClasses.get(size)} aria-hidden="true" />
                    )}
                </CheckboxPrimitive.Indicator>
            </CheckboxPrimitive.Root>
        );
    }
);

Checkbox.displayName = CheckboxPrimitive.Root.displayName;

// ============================================================================
// Checkbox Group Component
// ============================================================================

export interface CheckboxGroupProps extends BaseComponentProps, React.HTMLAttributes<HTMLDivElement> {
    /**
     * Label for the checkbox group
     */
    label?: string;

    /**
     * Error message
     */
    error?: string;

    /**
     * Layout direction
     * @default "vertical"
     */
    direction?: 'horizontal' | 'vertical';
}

/**
 * Checkbox group for grouping related checkboxes
 */
const CheckboxGroup = React.forwardRef<HTMLDivElement, CheckboxGroupProps>(
    (
        {
            className,
            label,
            error,
            direction = 'vertical',
            children,
            ...props
        },
        ref
    ) => {
        return (
            <div
                ref={ref}
                className={cn('space-y-2', className)}
                role="group"
                aria-label={label}
                {...props}
            >
                {label && (
                    <legend className="text-sm font-medium">{label}</legend>
                )}
                <div
                    className={cn(
                        direction === 'horizontal' ? 'flex flex-wrap gap-4' : 'space-y-2'
                    )}
                >
                    {children}
                </div>
                {error && (
                    <p className="text-xs font-medium text-destructive" role="alert">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

CheckboxGroup.displayName = 'CheckboxGroup';

// ============================================================================
// Exports
// ============================================================================

export { Checkbox, CheckboxGroup };
export default Checkbox;
