import * as React from 'react';
import { type VariantProps } from 'class-variance-authority';
declare const buttonVariants: (props?: {
    variant?: "primary" | "secondary" | "destructive" | "link" | "default" | "outline" | "ghost";
    size?: "sm" | "lg" | "default" | "icon";
} & import("class-variance-authority/dist/types").ClassProp) => string;
type ConflictingMotionProps = 'onDrag' | 'onDragEnd' | 'onDragStart' | 'onAnimationStart';
export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, ConflictingMotionProps>, VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}
declare const Button: React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement>>;
export { Button, buttonVariants };
