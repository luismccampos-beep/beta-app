import * as React from "react";

import { cn } from "../utils/cn";

export interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  withIcon?: boolean;
  withText?: boolean;
  variant?: 'default' | 'white' | 'dark';
}

const SIZE_CLASSES = {
  icon: {
    xs: 'h-5 w-5',
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
    xl: 'h-12 w-12',
  },
  text: {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
    xl: 'text-2xl',
  },
} as const;

function getIconSize(size: LogoProps['size'] = 'md'): string {
  switch (size) {
    case 'xs': return SIZE_CLASSES.icon.xs;
    case 'sm': return SIZE_CLASSES.icon.sm;
    case 'lg': return SIZE_CLASSES.icon.lg;
    case 'xl': return SIZE_CLASSES.icon.xl;
    default:   return SIZE_CLASSES.icon.md;
  }
}

function getTextSize(size: LogoProps['size'] = 'md'): string {
  switch (size) {
    case 'xs': return SIZE_CLASSES.text.xs;
    case 'sm': return SIZE_CLASSES.text.sm;
    case 'lg': return SIZE_CLASSES.text.lg;
    case 'xl': return SIZE_CLASSES.text.xl;
    default:   return SIZE_CLASSES.text.md;
  }
}

function getVariantClass(variant: LogoProps['variant'] = 'default'): string {
  switch (variant) {
    case 'white': return 'text-white';
    case 'dark':  return 'text-zinc-900';
    default:      return 'text-zinc-900 dark:text-white';
  }
}

export const Logo = React.forwardRef<HTMLDivElement, LogoProps>(
  (
    {
      size = 'md',
      withIcon = true,
      withText = true,
      variant = 'default',
      className,
      ...props
    },
    ref
  ) => {
    const iconSize    = getIconSize(size);
    const textSize    = getTextSize(size);
    const variantClass = getVariantClass(variant);

    return (
      <div
        ref={ref}
        className={cn('flex items-center gap-2', variantClass, className)}
        {...props}
      >
        {withIcon && (
          <div
            className={cn(
              iconSize,
              'flex items-center justify-center rounded-lg',
              'bg-gradient-to-br from-blue-600 to-violet-600',
              'shadow-sm shadow-blue-500/30',
            )}
            aria-hidden="true"
          >
            {/* Plane icon — AKMLEVA travel brand */}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-[60%] w-[60%] text-white -rotate-45"
              aria-hidden="true"
            >
              <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21 4 19 2c-2-2-4-2-5.5-.5L10 5 1.8 6.2a1 1 0 0 0-.6 1.6l2 2 1.4 4.2 2.4 2.4 4.2 1.4 2 2a1 1 0 0 0 1.6-.6z" />
            </svg>
          </div>
        )}

        {withText && (
          <span
            className={cn(
              'font-serif font-bold tracking-tight leading-none select-none',
              textSize,
            )}
          >
            AKM
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              LEVA
            </span>
          </span>
        )}
      </div>
    );
  }
);

Logo.displayName = "Logo";

export default Logo;