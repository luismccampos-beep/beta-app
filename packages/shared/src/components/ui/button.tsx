"use client";

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { motion, type MotionStyle } from 'framer-motion';

import { cn } from '../../utils/index';

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-bold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
    {
        variants: {
            variant: {
                default:     "bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900",
                primary:     "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-600/20 dark:bg-emerald-500 dark:hover:bg-emerald-400",
                destructive: "bg-red-500 text-white hover:bg-red-600 shadow-sm",
                outline:     "border-2 border-slate-200 bg-transparent hover:bg-slate-50 hover:border-slate-300 dark:border-slate-800 dark:hover:bg-slate-800/50",
                secondary:   "bg-slate-100 text-slate-900 hover:bg-secondary/80 dark:bg-slate-800 dark:text-slate-100",
                ghost:       "hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-900/20 dark:hover:text-emerald-400",
                link:        "text-emerald-600 underline-offset-4 hover:underline",
            },
            size: {
                default: "h-12 px-6 py-3",
                sm:      "h-9 px-4 text-xs",
                lg:      "h-14 px-10 text-base",
                icon:    "h-12 w-12",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

// These event handler names exist on both React.ButtonHTMLAttributes and
// HTMLMotionProps but with incompatible signatures under exactOptionalPropertyTypes.
type ConflictingMotionProps = 'onDrag' | 'onDragEnd' | 'onDragStart' | 'onAnimationStart';

export interface ButtonProps
    extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, ConflictingMotionProps>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const MotionButton = motion.button;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant,
            size,
            asChild = false,
            isLoading = false,
            leftIcon,
            rightIcon,
            children,
            disabled,
            style,
            ...rest
        },
        ref
    ) => {
        const content = isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-current" />
        ) : (
            <div className="flex items-center justify-center gap-2">
                {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
                {children}
                {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
            </div>
        );

        const mergedClassName = cn(buttonVariants({ variant, size, className }));

        if (asChild) {
            return (
                <Slot
                    className={mergedClassName}
                    ref={ref}
                    style={style}
                    {...(rest as React.HTMLAttributes<HTMLElement>)}
                >
                    {content}
                </Slot>
            );
        }

        return (
            <MotionButton
                className={mergedClassName}
                ref={ref}
                disabled={isLoading || disabled}
                whileTap={{ scale: 0.97 }}
                style={style as MotionStyle}
                {...rest}
            >
                {content}
            </MotionButton>
        );
    }
);

Button.displayName = "Button";

export { Button, buttonVariants };