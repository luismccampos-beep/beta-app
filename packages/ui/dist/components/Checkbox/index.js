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
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check, Minus } from 'lucide-react';
import { cn } from '../../utils/cn';
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
const Checkbox = React.forwardRef(({ className, size = 'md', checked, defaultChecked, onCheckedChange, disabled, ...props }, ref) => {
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
    return (_jsx(CheckboxPrimitive.Root, { ref: ref, checked: checked, defaultChecked: defaultChecked, onCheckedChange: onCheckedChange, disabled: disabled, className: cn('peer shrink-0 rounded-sm border border-primary ring-offset-background', 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2', 'disabled:cursor-not-allowed disabled:opacity-50', 'data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground', 'data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground', 'transition-all duration-200', sizeClasses.get(size), className), ...props, children: _jsx(CheckboxPrimitive.Indicator, { className: cn('flex items-center justify-center text-current'), children: checked === 'indeterminate' ? (_jsx(Minus, { className: iconSizeClasses.get(size), "aria-hidden": "true" })) : (_jsx(Check, { className: iconSizeClasses.get(size), "aria-hidden": "true" })) }) }));
});
Checkbox.displayName = CheckboxPrimitive.Root.displayName;
/**
 * Checkbox group for grouping related checkboxes
 */
const CheckboxGroup = React.forwardRef(({ className, label, error, direction = 'vertical', children, ...props }, ref) => {
    return (_jsxs("div", { ref: ref, className: cn('space-y-2', className), role: "group", "aria-label": label, ...props, children: [label && (_jsx("legend", { className: "text-sm font-medium", children: label })), _jsx("div", { className: cn(direction === 'horizontal' ? 'flex flex-wrap gap-4' : 'space-y-2'), children: children }), error && (_jsx("p", { className: "text-xs font-medium text-destructive", role: "alert", children: error }))] }));
});
CheckboxGroup.displayName = 'CheckboxGroup';
// ============================================================================
// Exports
// ============================================================================
export { Checkbox, CheckboxGroup };
export default Checkbox;
//# sourceMappingURL=index.js.map