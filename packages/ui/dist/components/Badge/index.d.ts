/**
 * Badge Component
 *
 * A compact label for displaying status, categories, or counts.
 *
 * @example
 * ```tsx
 * // Default badge
 * <Badge>New</Badge>
 *
 * // With variants
 * <Badge variant="destructive">Error</Badge>
 * <Badge variant="success">Completed</Badge>
 * <Badge variant="outline">Draft</Badge>
 *
 * // As a dot
 * <Badge variant="dot" dotColor="green">Online</Badge>
 * ```
 */
import * as React from 'react';
import { type VariantProps } from 'class-variance-authority';
import type { BaseComponentProps } from '../../types';
/**
 * Badge style variants using CVA
 */
export declare const badgeVariants: (props?: ({
    variant?: "default" | "destructive" | "success" | "info" | "warning" | "outline" | "secondary" | null | undefined;
    size?: "sm" | "md" | "lg" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export interface BadgeProps extends BaseComponentProps, React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
    /**
     * Dot indicator color (for dot variant)
     */
    dotColor?: string;
}
/**
 * Badge component for displaying status and labels
 *
 * Features:
 * - Multiple color variants for different states
 * - Size variants
 * - Focus ring for keyboard navigation
 * - High contrast text for accessibility
 */
declare const Badge: React.NamedExoticComponent<BadgeProps>;
export { Badge };
export default Badge;
