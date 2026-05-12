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
import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import type { BaseComponentProps } from '../../types';
export interface CheckboxProps extends BaseComponentProps, Omit<React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>, 'checked'> {
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
declare const Checkbox: React.ForwardRefExoticComponent<CheckboxProps & React.RefAttributes<HTMLButtonElement>>;
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
declare const CheckboxGroup: React.ForwardRefExoticComponent<CheckboxGroupProps & React.RefAttributes<HTMLDivElement>>;
export { Checkbox, CheckboxGroup };
export default Checkbox;
