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
import * as React from 'react';
import { type VariantProps } from 'class-variance-authority';
import type { BaseComponentProps, SizeVariant } from '../../types';
/**
 * Input style variants
 */
export declare const inputVariants: (props?: ({
    size?: "sm" | "md" | "lg" | null | undefined;
    variant?: "default" | "error" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export interface InputProps extends BaseComponentProps, Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'label'>, VariantProps<typeof inputVariants> {
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
declare const Input: React.ForwardRefExoticComponent<Omit<InputProps, "ref"> & React.RefAttributes<HTMLInputElement>>;
export { Input };
export default Input;
