/**
 * Alert Component
 *
 * Displays callout messages for user feedback.
 * Supports multiple severity levels and icon customization.
 *
 * @example
 * ```tsx
 * // Basic alert
 * <Alert>
 *   <AlertTitle>Heads up!</AlertTitle>
 *   <AlertDescription>You can add components to your app using the cli.</AlertDescription>
 * </Alert>
 *
 * // Destructive alert
 * <Alert variant="destructive">
 *   <AlertCircle className="h-4 w-4" />
 *   <AlertTitle>Error</AlertTitle>
 *   <AlertDescription>Something went wrong.</AlertDescription>
 * </Alert>
 *
 * // With action
 * <Alert>
 *   <AlertTitle>Success!</AlertTitle>
 *   <AlertDescription>Your changes have been saved.</AlertDescription>
 *   <AlertAction>
 *     <Button size="sm" variant="outline">Undo</Button>
 *   </AlertAction>
 * </Alert>
 * ```
 */
import * as React from 'react';
import { type VariantProps } from 'class-variance-authority';
import type { LucideIcon } from 'lucide-react';
import type { BaseComponentProps } from '../../types';
/**
 * Alert style variants
 */
export declare const alertVariants: (props?: ({
    variant?: "default" | "destructive" | "success" | "info" | "warning" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export interface AlertProps extends BaseComponentProps, React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {
    /**
     * Optional icon to display
     */
    icon?: LucideIcon;
}
/**
 * Alert container component
 *
 * Features:
 * - Multiple severity variants
 * - Automatic icon support
 * - Role="alert" for screen readers
 * - High contrast colors for accessibility
 */
declare const Alert: React.ForwardRefExoticComponent<AlertProps & React.RefAttributes<HTMLDivElement>>;
export interface AlertTitleProps extends BaseComponentProps, React.HTMLAttributes<HTMLHeadingElement> {
    /**
     * Heading level for semantic HTML
     * @default "h5"
     */
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}
/**
 * Alert title component
 */
declare const AlertTitle: React.ForwardRefExoticComponent<AlertTitleProps & React.RefAttributes<HTMLHeadingElement>>;
export interface AlertDescriptionProps extends BaseComponentProps, React.HTMLAttributes<HTMLDivElement> {
}
/**
 * Alert description component
 */
declare const AlertDescription: React.ForwardRefExoticComponent<AlertDescriptionProps & React.RefAttributes<HTMLDivElement>>;
export interface AlertActionProps extends BaseComponentProps, React.HTMLAttributes<HTMLDivElement> {
}
/**
 * Alert action area for buttons
 */
declare const AlertAction: React.ForwardRefExoticComponent<AlertActionProps & React.RefAttributes<HTMLDivElement>>;
export { Alert, AlertTitle, AlertDescription, AlertAction };
export default Alert;
