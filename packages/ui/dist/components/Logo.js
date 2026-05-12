import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { cn } from "../utils/cn";
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
};
function getIconSize(size = 'md') {
    switch (size) {
        case 'xs': return SIZE_CLASSES.icon.xs;
        case 'sm': return SIZE_CLASSES.icon.sm;
        case 'lg': return SIZE_CLASSES.icon.lg;
        case 'xl': return SIZE_CLASSES.icon.xl;
        default: return SIZE_CLASSES.icon.md;
    }
}
function getTextSize(size = 'md') {
    switch (size) {
        case 'xs': return SIZE_CLASSES.text.xs;
        case 'sm': return SIZE_CLASSES.text.sm;
        case 'lg': return SIZE_CLASSES.text.lg;
        case 'xl': return SIZE_CLASSES.text.xl;
        default: return SIZE_CLASSES.text.md;
    }
}
function getVariantClass(variant = 'default') {
    switch (variant) {
        case 'white': return 'text-white';
        case 'dark': return 'text-zinc-900';
        default: return 'text-zinc-900 dark:text-white';
    }
}
export const Logo = React.forwardRef(({ size = 'md', withIcon = true, withText = true, variant = 'default', className, ...props }, ref) => {
    const iconSize = getIconSize(size);
    const textSize = getTextSize(size);
    const variantClass = getVariantClass(variant);
    return (_jsxs("div", { ref: ref, className: cn('flex items-center gap-2', variantClass, className), ...props, children: [withIcon && (_jsx("div", { className: cn(iconSize, 'flex items-center justify-center rounded-lg', 'bg-gradient-to-br from-blue-600 to-violet-600', 'shadow-sm shadow-blue-500/30'), "aria-hidden": "true", children: _jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", className: "h-[60%] w-[60%] text-white -rotate-45", "aria-hidden": "true", children: _jsx("path", { d: "M17.8 19.2L16 11l3.5-3.5C21 6 21 4 19 2c-2-2-4-2-5.5-.5L10 5 1.8 6.2a1 1 0 0 0-.6 1.6l2 2 1.4 4.2 2.4 2.4 4.2 1.4 2 2a1 1 0 0 0 1.6-.6z" }) }) })), withText && (_jsxs("span", { className: cn('font-serif font-bold tracking-tight leading-none select-none', textSize), children: ["AKM", _jsx("span", { className: "bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent", children: "LEVA" })] }))] }));
});
Logo.displayName = "Logo";
export default Logo;
//# sourceMappingURL=Logo.js.map