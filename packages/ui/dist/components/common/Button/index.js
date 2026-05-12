import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../../utils';
const Button = React.forwardRef(({ children, className, variant = 'default', size = 'default', asChild = false, loading = false, leftIcon: LeftIcon, rightIcon: RightIcon, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    const baseClasses = 'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
    const getVariantClasses = (value = 'default') => {
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
    const getSizeClasses = (value = 'default') => {
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
    return (_jsxs(Comp, { className: cn(baseClasses, getVariantClasses(variant), getSizeClasses(size), className), ref: ref, disabled: disabled || loading, ...props, children: [loading && (_jsx("div", { className: "mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" })), !loading && LeftIcon && _jsx(LeftIcon, { className: "mr-2 h-4 w-4" }), children, !loading && RightIcon && _jsx(RightIcon, { className: "ml-2 h-4 w-4" })] }));
});
Button.displayName = 'Button';
export { Button };
//# sourceMappingURL=index.js.map