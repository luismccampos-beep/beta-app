/**
 * AKMLEVA UI Component Types
 * 
 * Centralized type definitions for all UI components.
 * Provides consistent interfaces, variant types, and shared prop patterns.
 */

import type * as React from 'react';

// ============================================================================
// Base Component Types
// ============================================================================

/**
 * Base props that all UI components can extend
 */
export interface BaseComponentProps {
    /** Additional CSS class names */
    className?: string;
    /** Unique identifier for testing and accessibility */
    id?: string;
    /** Data attribute for testing */
    'data-testid'?: string;
}

/**
 * Base props for interactive components
 */
export interface InteractiveComponentProps extends BaseComponentProps {
    /** Whether the component is disabled */
    disabled?: boolean;
    /** Loading state */
    loading?: boolean;
    /** Callback when the component receives focus */
    onFocus?: React.FocusEventHandler<HTMLElement>;
    /** Callback when the component loses focus */
    onBlur?: React.FocusEventHandler<HTMLElement>;
}

/**
 * Base props for form components
 */
export interface FormComponentProps<T = string> extends InteractiveComponentProps {
    /** Current value */
    value?: T;
    /** Default value for uncontrolled components */
    defaultValue?: T;
    /** Callback when value changes */
    onChange?: (value: T) => void;
    /** Name attribute for form submission */
    name?: string;
    /** Whether the field is required */
    required?: boolean;
    /** Error message or state */
    error?: string | boolean;
    /** Helper text */
    helperText?: string;
    /** Label text */
    label?: React.ReactNode;
    /** Hide the label visually but keep it accessible */
    hideLabel?: boolean;
}

// ============================================================================
// Size Variants
// ============================================================================

export const sizeVariants = ['sm', 'md', 'lg'] as const;
export type SizeVariant = (typeof sizeVariants)[number];

// ============================================================================
// Color Variants
// ============================================================================

export const colorVariants = [
    'default',
    'primary',
    'secondary',
    'destructive',
    'success',
    'warning',
    'info',
    'ghost',
    'link',
] as const;
export type ColorVariant = (typeof colorVariants)[number];

// ============================================================================
// Variant Types
// ============================================================================

export const buttonVariants = [
    'default',
    'destructive',
    'outline',
    'secondary',
    'ghost',
    'link',
] as const;
export type ButtonVariant = (typeof buttonVariants)[number];

export const alertVariants = [
    'default',
    'destructive',
    'success',
    'warning',
    'info',
] as const;
export type AlertVariant = (typeof alertVariants)[number];

export const badgeVariants = [
    'default',
    'secondary',
    'destructive',
    'outline',
    'success',
    'warning',
] as const;
export type BadgeVariant = (typeof badgeVariants)[number];

// ============================================================================
// Position Types
// ============================================================================

export const positionVariants = [
    'top',
    'top-start',
    'top-end',
    'right',
    'right-start',
    'right-end',
    'bottom',
    'bottom-start',
    'bottom-end',
    'left',
    'left-start',
    'left-end',
] as const;
export type PositionVariant = (typeof positionVariants)[number];

export const sideVariants = ['top', 'right', 'bottom', 'left'] as const;
export type SideVariant = (typeof sideVariants)[number];

export const alignVariants = ['start', 'center', 'end'] as const;
export type AlignVariant = (typeof alignVariants)[number];

// ============================================================================
// Animation Types
// ============================================================================

export const animationVariants = [
    'fade',
    'slide-up',
    'slide-down',
    'slide-left',
    'slide-right',
    'scale',
    'none',
] as const;
export type AnimationVariant = (typeof animationVariants)[number];

// ============================================================================
// Responsive Types
// ============================================================================

export interface ResponsiveValue<T> {
    base?: T;
    sm?: T;
    md?: T;
    lg?: T;
    xl?: T;
    '2xl'?: T;
}

// ============================================================================
// Polymorphic Component Types
// ============================================================================

/**
 * Props for components that can render as different elements
 */
export interface PolymorphicProps {
    /**
     * Render as a different element or component
     * @example
     * ```tsx
     * <Button asChild>
     *   <Link href="/">Click me</Link>
     * </Button>
     * ```
     */
    asChild?: boolean;
}

/**
 * Props for components with href (link behavior)
 */
export interface LinkProps {
    /** URL to navigate to */
    href?: string;
    /** Whether to open in new tab */
    external?: boolean;
    /** Download attribute */
    download?: boolean | string;
}

// ============================================================================
// Icon Types
// ============================================================================

export interface IconProps {
    /** Icon component */
    icon?: React.ComponentType<{ className?: string }>;
    /** Position of the icon relative to content */
    iconPosition?: 'left' | 'right';
    /** Size of the icon */
    iconSize?: SizeVariant;
}

// ============================================================================
// State Types
// ============================================================================

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T = unknown> {
    data?: T;
    error?: Error;
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
}

// ============================================================================
// Accessibility Types
// ============================================================================

/**
 * ARIA props for accessible components
 */
export interface AriaProps {
    /** Accessible label */
    'aria-label'?: string;
    /** ID of element that labels this element */
    'aria-labelledby'?: string;
    /** Accessible description */
    'aria-describedby'?: string;
    /** Whether the element is expanded */
    'aria-expanded'?: boolean;
    /** Whether the element is hidden */
    'aria-hidden'?: boolean;
    /** Live region politeness */
    'aria-live'?: 'off' | 'assertive' | 'polite';
    /** Current state of the element */
    'aria-current'?: boolean | 'page' | 'step' | 'location' | 'date' | 'time';
    /** Whether the element is pressed */
    'aria-pressed'?: boolean | 'mixed';
    /** Whether the element is checked */
    'aria-checked'?: boolean | 'mixed';
    /** Whether the element is selected */
    'aria-selected'?: boolean;
    /** Whether the element is disabled */
    'aria-disabled'?: boolean;
    /** Whether the element is read-only */
    'aria-readonly'?: boolean;
    /** Whether the element is required */
    'aria-required'?: boolean;
    /** Invalid state */
    'aria-invalid'?: boolean;
    /** Error message ID */
    'aria-errormessage'?: string;
    /** Role override */
    role?: React.AriaRole;
}

// ============================================================================
// Event Handler Types
// ============================================================================

export type KeyboardEventHandler<E extends HTMLElement = HTMLElement> =
    React.KeyboardEventHandler<E>;

export type MouseEventHandler<E extends HTMLElement = HTMLElement> =
    React.MouseEventHandler<E>;

export type TouchEventHandler<E extends HTMLElement = HTMLElement> =
    React.TouchEventHandler<E>;

export type FocusEventHandler<E extends HTMLElement = HTMLElement> =
    React.FocusEventHandler<E>;

export type ChangeEventHandler<E extends HTMLElement = HTMLElement> =
    React.ChangeEventHandler<E>;

// ============================================================================
// Ref Types
// ============================================================================

export type ForwardedRef<T> = React.ForwardedRef<T>;

// ============================================================================
// Slot Types (for asChild pattern)
// ============================================================================

export type SlotProps = {
    children?: React.ReactNode;
};

// ============================================================================
// Common Utility Types
// ============================================================================

/** Make specific properties required */
export type WithRequired<T, K extends keyof T> = T & Required<Pick<T, K>>;

/** Make specific properties optional */
export type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/** Extract variant props from CVA */
export type VariantProps<T extends (...args: unknown[]) => unknown> =
    Parameters<T>[0] extends undefined ? never : Parameters<T>[0];
