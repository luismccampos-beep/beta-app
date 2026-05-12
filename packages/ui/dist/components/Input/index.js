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
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import { Label } from '../Label';
// ============================================================================
// Styles Configuration
// ============================================================================
/**
 * Input style variants
 */
export const inputVariants = cva([
    'flex w-full',
    'rounded-md border border-input bg-background',
    'px-3 py-2 text-sm',
    'ring-offset-background',
    'file:border-0 file:bg-transparent file:text-sm file:font-medium',
    'placeholder:text-muted-foreground',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'transition-colors duration-200',
].join(' '), {
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
});
// ============================================================================
// Helper Components
// ============================================================================
/**
 * Form helper text component
 */
const FormHelperText = React.memo(function FormHelperText({ children, className, }) {
    return (_jsx("p", { className: cn('text-xs text-muted-foreground', className), children: children }));
});
/**
 * Form error message component
 */
const FormErrorMessage = React.memo(function FormErrorMessage({ children, className, id, }) {
    return (_jsx("p", { id: id, className: cn('text-xs font-medium text-destructive', className), role: "alert", children: children }));
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
const Input = React.forwardRef(({ className, type = 'text', label, helperText, error, size = 'md', startAdornment, endAdornment, hideLabel = false, disabled, required, id: idProp, 'aria-describedby': ariaDescribedByProp, 'aria-invalid': ariaInvalidProp, ...props }, ref) => {
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
        const describedByIds = [];
        if (helperText)
            describedByIds.push(helperId);
        if (hasError)
            describedByIds.push(errorId);
        if (ariaDescribedByProp)
            describedByIds.push(ariaDescribedByProp);
        return describedByIds.length > 0 ? describedByIds.join(' ') : undefined;
    }, [helperText, hasError, helperId, errorId, ariaDescribedByProp]);
    // Determine input variant based on error state
    const inputVariant = hasError ? 'error' : 'default';
    // Memoize container classes
    const containerClasses = React.useMemo(() => cn('w-full space-y-1.5', className), [className]);
    // Memoize input classes
    const inputClasses = React.useMemo(() => cn(inputVariants({ size, variant: inputVariant }), 
    // Adjust padding if adornments are present
    startAdornment && 'pl-9', endAdornment && 'pr-9'), [size, inputVariant, startAdornment, endAdornment]);
    return (_jsxs("div", { className: containerClasses, children: [label && (_jsxs(Label, { id: labelId, htmlFor: id, className: cn('text-sm font-medium leading-none', hideLabel && 'sr-only'), children: [label, required && (_jsx("span", { className: "ml-1 text-destructive", "aria-hidden": "true", children: "*" }))] })), _jsxs("div", { className: "relative", children: [startAdornment && (_jsx("div", { className: "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground", children: startAdornment })), _jsx("input", { ref: ref, id: id, type: type, disabled: disabled, required: required, "aria-invalid": ariaInvalid, "aria-describedby": ariaDescribedBy, "aria-required": required, "aria-disabled": disabled, className: inputClasses, ...props }), endAdornment && (_jsx("div", { className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground", children: endAdornment }))] }), _jsxs("div", { className: "space-y-1", children: [helperText && !hasError && (_jsx(FormHelperText, { children: helperText })), hasError && (_jsx(FormErrorMessage, { id: errorId, children: error }))] })] }));
});
Input.displayName = 'Input';
// ============================================================================
// Exports
// ============================================================================
export { Input };
export default Input;
//# sourceMappingURL=index.js.map