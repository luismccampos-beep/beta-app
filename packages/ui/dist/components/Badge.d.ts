import { type VariantProps } from "class-variance-authority";
import * as React from "react";
declare const badgeVariants: (props?: ({
    variant?: "default" | "destructive" | "success" | "info" | "warning" | "outline" | "secondary" | "muted" | null | undefined;
    size?: "sm" | "md" | "lg" | null | undefined;
    animation?: "none" | "pulse" | "bounce" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
    icon?: React.ReactNode;
    dismissible?: boolean;
    onDismiss?: () => void;
    animated?: boolean;
}
declare const Badge: React.ForwardRefExoticComponent<BadgeProps & React.RefAttributes<HTMLDivElement>>;
export { Badge, badgeVariants };
