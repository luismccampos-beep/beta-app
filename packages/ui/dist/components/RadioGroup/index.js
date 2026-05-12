/**
 * RadioGroup Component
 *
 * Accessible radio button group for single-select options.
 *
 * @example
 * ```tsx
 * // Basic radio group
 * <RadioGroup defaultValue="option-1">
 *   <RadioGroupItem value="option-1" id="option-1" />
 *   <Label htmlFor="option-1">Option 1</Label>
 *
 *   <RadioGroupItem value="option-2" id="option-2" />
 *   <Label htmlFor="option-2">Option 2</Label>
 * </RadioGroup>
 *
 * // Controlled radio group
 * const [value, setValue] = React.useState('option-1');
 * <RadioGroup value={value} onValueChange={setValue}>
 *   ...
 * </RadioGroup>
 * ```
 */
'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { Circle } from 'lucide-react';
import { cn } from '../../utils/cn';
// ============================================================================
// Radio Group Component
// ============================================================================
/**
 * Radio group container with accessibility support
 */
const RadioGroup = React.forwardRef(({ className, label, error, direction = 'vertical', children, ...props }, ref) => {
    return (_jsxs("div", { className: cn('space-y-2', className), children: [label && (_jsx("label", { className: "text-sm font-medium", children: label })), _jsx(RadioGroupPrimitive.Root, { className: cn('grid gap-2', direction === 'horizontal' && 'grid-flow-col auto-cols-max'), ...props, ref: ref, children: children }), error && (_jsx("p", { className: "text-xs font-medium text-destructive", role: "alert", children: error }))] }));
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;
// ============================================================================
// Radio Group Item Component
// ============================================================================
/**
 * Individual radio button item
 *
 * Features:
 * - Keyboard navigation (arrow keys, Tab)
 * - Focus management
 * - ARIA attributes
 * - Reduced motion support
 */
const RadioGroupItem = React.forwardRef(({ className, size = 'md', ...props }, ref) => {
    // Size mappings using Map to avoid object injection security warnings
    const sizeClasses = new Map([
        ['sm', 'h-3.5 w-3.5'],
        ['md', 'h-4 w-4'],
        ['lg', 'h-5 w-5'],
    ]);
    const indicatorSizes = new Map([
        ['sm', 'h-2 w-2'],
        ['md', 'h-2.5 w-2.5'],
        ['lg', 'h-3 w-3'],
    ]);
    return (_jsx(RadioGroupPrimitive.Item, { ref: ref, className: cn('aspect-square rounded-full border border-primary text-primary ring-offset-background', 'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2', 'disabled:cursor-not-allowed disabled:opacity-50', 'transition-all duration-200', 'data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground', sizeClasses.get(size), className), ...props, children: _jsx(RadioGroupPrimitive.Indicator, { className: cn('flex items-center justify-center'), children: _jsx(Circle, { className: cn('fill-current', indicatorSizes.get(size)) }) }) }));
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;
// ============================================================================
// Exports
// ============================================================================
export { RadioGroup, RadioGroupItem };
export default RadioGroup;
//# sourceMappingURL=index.js.map