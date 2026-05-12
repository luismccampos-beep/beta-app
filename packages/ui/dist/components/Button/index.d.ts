/**
 * Button Component
 *
 * A versatile button component with comprehensive accessibility features,
 * loading states, and flexible styling options.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Button>Click me</Button>
 *
 * // With variants
 * <Button variant="destructive" size="lg">Delete</Button>
 *
 * // With icons
 * <Button leftIcon={Loader2} loading>Saving...</Button>
 *
 * // As a link
 * <Button asChild>
 *   <a href="/dashboard">Go to Dashboard</a>
 * </Button>
 *
 * // With loading state
 * <Button loading loadingText="Submitting...">Submit</Button>
 * ```
 */
import * as React from 'react';
import { type VariantProps } from 'class-variance-authority';
import type { LucideIcon } from 'lucide-react';
import type { BaseComponentProps, SizeVariant } from '../../types';
/**
 * Button style variants using class-variance-authority
 * Provides consistent styling across all button states
 */
export declare const buttonVariants: (props?: ({
    variant?: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined;
    size?: "sm" | "md" | "lg" | "icon" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export interface ButtonProps extends BaseComponentProps, Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'size'>, VariantProps<typeof buttonVariants> {
    /**
     * Render as a child element (polymorphic)
     * Useful for rendering as a link or custom component
     */
    asChild?: boolean;
    /**
     * Loading state
     * When true, shows a spinner and disables interactions
     */
    loading?: boolean;
    /**
     * Text to display when loading
     * @default "Loading..."
     */
    loadingText?: string;
    /**
     * Icon to display on the left side
     */
    leftIcon?: LucideIcon;
    /**
     * Icon to display on the right side
     */
    rightIcon?: LucideIcon;
    /**
     * Button size variant
     * @default "md"
     */
    size?: SizeVariant | 'icon';
}
/**
 * Button component with full accessibility support
 *
 * Features:
 * - Keyboard navigation support
 * - Focus management
 * - Loading states with reduced motion support
 * - ARIA attributes for screen readers
 * - Polymorphic rendering (asChild)
 * - Consistent styling with design tokens
 */
declare const Button: React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement>>;
export interface IconButtonProps extends Omit<ButtonProps, 'leftIcon' | 'rightIcon' | 'children'> {
    /**
     * Icon component to render
     */
    icon: LucideIcon;
    /**
     * Accessible label for the icon button (required for accessibility)
     */
    'aria-label': string;
}
/**
 * Icon-only button component with required aria-label
 *
 * @example
 * ```tsx
 * <IconButton icon={X} aria-label="Close dialog" onClick={handleClose} />
 * ```
 */
declare const IconButton: React.ForwardRefExoticComponent<IconButtonProps & React.RefAttributes<HTMLButtonElement>>;
export { Button, IconButton };
export default Button;
