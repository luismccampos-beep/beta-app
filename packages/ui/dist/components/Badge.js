import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cva } from "class-variance-authority";
import * as React from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "../utils/cn";
const badgeVariants = cva("inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", {
    variants: {
        variant: {
            default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80 dark:bg-blue-600 dark:hover:bg-blue-700",
            secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 dark:bg-slate-600 dark:hover:bg-slate-700",
            destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80 dark:bg-red-600 dark:hover:bg-red-700",
            outline: "border text-foreground hover:bg-accent dark:border-slate-600 dark:hover:bg-slate-800",
            success: "border-transparent bg-green-500 text-white hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700",
            warning: "border-transparent bg-yellow-500 text-white hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700",
            info: "border-transparent bg-blue-500 text-white hover:bg-blue-600 dark:bg-cyan-600 dark:hover:bg-cyan-700",
            muted: "border-transparent bg-muted text-muted-foreground hover:bg-muted/80 dark:bg-slate-700 dark:text-slate-300",
        },
        size: {
            sm: "text-xs px-2 py-0.5",
            md: "text-sm px-2.5 py-1",
            lg: "text-base px-3 py-1.5",
        },
        animation: {
            none: "",
            pulse: "animate-pulse",
            bounce: "animate-bounce",
        },
    },
    compoundVariants: [
        {
            variant: "destructive",
            animation: "pulse",
            className: "animate-pulse",
        },
        {
            variant: "warning",
            animation: "pulse",
            className: "animate-pulse",
        },
    ],
    defaultVariants: {
        variant: "default",
        size: "md",
        animation: "none",
    },
});
const Badge = React.forwardRef(({ className, variant, size, animation, icon, dismissible = false, onDismiss, animated = false, children, ...props }, ref) => {
    const [isVisible, setIsVisible] = React.useState(true);
    const handleDismiss = () => {
        setIsVisible(false);
        onDismiss?.();
    };
    if (!isVisible && dismissible) {
        return null;
    }
    const content = (_jsxs("div", { ref: ref, className: cn(badgeVariants({ variant, size, animation }), className), ...props, children: [icon && _jsx("span", { className: "mr-1.5 flex items-center", children: icon }), _jsx("span", { className: "flex-1", children: children }), dismissible && (_jsx("button", { onClick: handleDismiss, className: "ml-1.5 -mr-1 inline-flex items-center justify-center rounded-full hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-white", "aria-label": "Dismiss badge", children: _jsx(X, { className: "h-3 w-3" }) }))] }));
    if (animated) {
        return (_jsx(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 }, transition: { duration: 0.2 }, children: content }));
    }
    return content;
});
Badge.displayName = "Badge";
export { Badge, badgeVariants };
//# sourceMappingURL=Badge.js.map