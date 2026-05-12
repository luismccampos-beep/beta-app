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
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';
// ============================================================================
// Styles Configuration
// ============================================================================
/**
 * Label style variants
 */
export const labelVariants = cva([
    'text-sm font-medium leading-none',
    'peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
    'cursor-pointer',
    'transition-colors duration-200',
].join(' '), {
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
});
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
const Label = React.forwardRef(({ className, size = 'md', variant = 'default', required = false, visuallyHidden = false, children, ...props }, ref) => {
    return (_jsxs(LabelPrimitive.Root, { ref: ref, className: cn(labelVariants({ size, variant }), visuallyHidden && 'sr-only', className), ...props, children: [children, required && (_jsx("span", { className: "ml-1 text-destructive", "aria-hidden": "true", children: "*" })), required && (_jsx("span", { className: "sr-only", children: "(required)" }))] }));
});
Label.displayName = LabelPrimitive.Root.displayName;
/**
 * Form label with optional helper text
 */
const FormLabel = React.forwardRef(({ helperText, className, ...props }, ref) => {
    return (_jsxs("div", { className: cn('space-y-1', className), children: [_jsx(Label, { ref: ref, ...props }), helperText && (_jsx("p", { className: "text-xs text-muted-foreground", children: helperText }))] }));
});
FormLabel.displayName = 'FormLabel';
// ============================================================================
// Exports
// ============================================================================
export { Label, FormLabel };
export default Label;
//# sourceMappingURL=index.js.map