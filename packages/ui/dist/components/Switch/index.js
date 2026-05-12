/**
 * Switch Component
 *
 * Accessible toggle switch for binary on/off states.
 *
 * @example
 * ```tsx
 * // Basic switch
 * <Switch id="airplane" />
 * <Label htmlFor="airplane">Airplane Mode</Label>
 *
 * // Controlled switch
 * const [enabled, setEnabled] = React.useState(false);
 * <Switch checked={enabled} onCheckedChange={setEnabled} />
 *
 * // With labels
 * <div className="flex items-center space-x-2">
 *   <Switch id="notifications" />
 *   <Label htmlFor="notifications">Enable notifications</Label>
 * </div>
 * ```
 */
'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';
import { cn } from '../../utils/cn';
// ============================================================================
// Main Switch Component
// ============================================================================
/**
 * Switch component with full accessibility support
 *
 * Features:
 * - Keyboard navigation
 * - Focus management
 * - Smooth animations
 * - ARIA attributes (role="switch")
 * - Reduced motion support
 */
const Switch = React.forwardRef(({ className, size = 'md', ...props }, ref) => {
    // Size mappings
    const sizeClasses = {
        sm: {
            root: 'h-4 w-7',
            thumb: 'h-3 w-3 data-[state=checked]:translate-x-3',
        },
        md: {
            root: 'h-6 w-11',
            thumb: 'h-5 w-5 data-[state=checked]:translate-x-5',
        },
        lg: {
            root: 'h-7 w-14',
            thumb: 'h-6 w-6 data-[state=checked]:translate-x-7',
        },
    };
    return (_jsx(SwitchPrimitives.Root, { className: cn('peer inline-flex shrink-0 cursor-pointer items-center rounded-full', 'border-2 border-transparent', 'transition-colors duration-200', 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background', 'disabled:cursor-not-allowed disabled:opacity-50', 'data-[state=checked]:bg-primary data-[state=unchecked]:bg-input', 
        // eslint-disable-next-line security/detect-object-injection
        sizeClasses[size].root, className), ...props, ref: ref, children: _jsx(SwitchPrimitives.Thumb, { className: cn('pointer-events-none block rounded-full bg-background shadow-lg ring-0', 'transition-transform duration-200', 'data-[state=unchecked]:translate-x-0', 
            // eslint-disable-next-line security/detect-object-injection
            sizeClasses[size].thumb) }) }));
});
Switch.displayName = SwitchPrimitives.Root.displayName;
/**
 * Switch with integrated label for convenience
 */
const SwitchWithLabel = React.forwardRef(({ label, helperText, labelPosition = 'right', id: idProp, className, ...props }, ref) => {
    const id = idProp ?? React.useId();
    return (_jsxs("div", { className: cn('flex items-center gap-3', labelPosition === 'left' && 'flex-row-reverse justify-end', className), children: [_jsx(Switch, { id: id, ref: ref, ...props }), _jsxs("div", { className: "space-y-0.5", children: [_jsx("label", { htmlFor: id, className: "cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", children: label }), helperText && (_jsx("p", { className: "text-xs text-muted-foreground", children: helperText }))] })] }));
});
SwitchWithLabel.displayName = 'SwitchWithLabel';
// ============================================================================
// Exports
// ============================================================================
export { Switch, SwitchWithLabel };
export default Switch;
//# sourceMappingURL=index.js.map