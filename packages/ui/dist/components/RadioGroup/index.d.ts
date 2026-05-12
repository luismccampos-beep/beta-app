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
import * as React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import type { BaseComponentProps, SizeVariant } from '../../types';
export interface RadioGroupProps extends BaseComponentProps, React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> {
    /**
     * Label for the radio group
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
export interface RadioGroupItemProps extends BaseComponentProps, React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {
    /**
     * Size of the radio button
     * @default "md"
     */
    size?: SizeVariant;
}
/**
 * Radio group container with accessibility support
 */
declare const RadioGroup: React.ForwardRefExoticComponent<RadioGroupProps & React.RefAttributes<HTMLDivElement>>;
/**
 * Individual radio button item
 *
 * Features:
 * - Keyboard navigation (arrow keys, Tab)
 * - Focus management
 * - ARIA attributes
 * - Reduced motion support
 */
declare const RadioGroupItem: React.ForwardRefExoticComponent<RadioGroupItemProps & React.RefAttributes<HTMLButtonElement>>;
export { RadioGroup, RadioGroupItem };
export default RadioGroup;
