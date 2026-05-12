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
import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { type VariantProps } from 'class-variance-authority';
import type { BaseComponentProps } from '../../types';
/**
 * Label style variants
 */
export declare const labelVariants: (props?: ({
    size?: "sm" | "md" | "lg" | null | undefined;
    variant?: "default" | "error" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export interface LabelProps extends BaseComponentProps, React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>, VariantProps<typeof labelVariants> {
    /**
     * Show required indicator
     */
    required?: boolean;
    /**
     * Hide the label visually but keep it accessible to screen readers
     */
    visuallyHidden?: boolean;
}
/**
 * Label component with accessibility features
 *
 * Features:
 * - Automatic association with form controls via htmlFor
 * - Required indicator support
 * - Visual hidden mode for accessibility
 * - Proper cursor styling
 */
declare const Label: React.ForwardRefExoticComponent<LabelProps & React.RefAttributes<HTMLLabelElement>>;
export interface FormLabelProps extends LabelProps {
    /**
     * Helper text to display below the label
     */
    helperText?: string;
}
/**
 * Form label with optional helper text
 */
declare const FormLabel: React.ForwardRefExoticComponent<FormLabelProps & React.RefAttributes<HTMLLabelElement>>;
export { Label, FormLabel };
export default Label;
