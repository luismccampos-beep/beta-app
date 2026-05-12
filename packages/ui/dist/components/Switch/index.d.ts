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
import * as React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';
import type { BaseComponentProps } from '../../types';
export interface SwitchProps extends BaseComponentProps, React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {
    /**
     * Size of the switch
     * @default "md"
     */
    size?: 'sm' | 'md' | 'lg';
}
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
declare const Switch: React.ForwardRefExoticComponent<SwitchProps & React.RefAttributes<HTMLButtonElement>>;
export interface SwitchWithLabelProps extends SwitchProps {
    /**
     * Label text
     */
    label: string;
    /**
     * Helper text displayed below the label
     */
    helperText?: string;
    /**
     * Position of the label relative to the switch
     * @default "right"
     */
    labelPosition?: 'left' | 'right';
}
/**
 * Switch with integrated label for convenience
 */
declare const SwitchWithLabel: React.ForwardRefExoticComponent<SwitchWithLabelProps & React.RefAttributes<HTMLButtonElement>>;
export { Switch, SwitchWithLabel };
export default Switch;
