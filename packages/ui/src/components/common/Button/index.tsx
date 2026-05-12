import React from 'react';
import { Slot } from '@radix-ui/react-slot';

import { cn } from '../../../utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ComponentType<{ className?: string }>;
  rightIcon?: React.ComponentType<{ className?: string }>;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    children, 
    className, 
    variant = 'default', 
    size = 'default', 
    asChild = false,
    loading = false,
    leftIcon: LeftIcon,
    rightIcon: RightIcon,
    disabled,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : 'button';

    const baseClasses = 'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

    const getVariantClasses = (value: ButtonProps['variant'] = 'default') => {
      switch (value) {
        case 'destructive':
          return 'bg-destructive text-destructive-foreground hover:bg-destructive/90';
        case 'outline':
          return 'border border-input bg-background hover:bg-accent hover:text-accent-foreground';
        case 'secondary':
          return 'bg-secondary text-secondary-foreground hover:bg-secondary/80';
        case 'ghost':
          return 'hover:bg-accent hover:text-accent-foreground';
        case 'link':
          return 'text-primary underline-offset-4 hover:underline';
        default:
          return 'bg-primary text-primary-foreground hover:bg-primary/90';
      }
    };

    const getSizeClasses = (value: ButtonProps['size'] = 'default') => {
      switch (value) {
        case 'sm':
          return 'h-9 rounded-md px-3';
        case 'lg':
          return 'h-11 rounded-md px-8';
        case 'icon':
          return 'h-10 w-10';
        default:
          return 'h-10 px-4 py-2';
      }
    };

    return (
      <Comp
        className={cn(
          baseClasses,
          getVariantClasses(variant),
          getSizeClasses(size),
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {!loading && LeftIcon && <LeftIcon className="mr-2 h-4 w-4" />}
        {children}
        {!loading && RightIcon && <RightIcon className="ml-2 h-4 w-4" />}
      </Comp>
    );
  }
);

Button.displayName = 'Button';

export { Button };
