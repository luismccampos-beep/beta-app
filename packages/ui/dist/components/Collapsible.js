"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { ChevronDown } from "lucide-react";
import { cva } from "class-variance-authority";
import { motion } from "framer-motion";
import * as React from "react";
import { cn } from "../utils/cn";
// Trigger variants with CVA
const collapsibleTriggerVariants = cva("flex w-full items-center justify-between rounded-lg px-4 py-3 font-semibold transition-all hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", {
    variants: {
        variant: {
            default: "bg-background hover:bg-accent dark:hover:bg-slate-800",
            filled: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
            outline: "border border-input hover:border-ring dark:border-slate-600 dark:hover:border-slate-500",
        },
        size: {
            sm: "px-3 py-2 text-sm",
            md: "px-4 py-3 text-base",
            lg: "px-5 py-4 text-lg",
        },
    },
    defaultVariants: {
        variant: "default",
        size: "md",
    },
});
const Collapsible = React.forwardRef(({ className, animated = true, ...props }, ref) => (_jsx(CollapsiblePrimitive.Root, { ref: ref, className: cn("w-full", className), "data-animated": animated, ...props })));
Collapsible.displayName = "Collapsible";
const CollapsibleTrigger = React.forwardRef(({ className, variant, size, icon, showChevron = true, children, asChild, ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false);
    return (_jsx(CollapsiblePrimitive.CollapsibleTrigger, { ref: ref, asChild: asChild, className: cn(!asChild && collapsibleTriggerVariants({ variant, size }), className), onClick: (e) => {
            const trigger = e.currentTarget;
            setIsOpen(trigger.getAttribute("data-state") !== "open");
        }, ...props, children: asChild ? (children) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex items-center gap-3 flex-1", children: [icon && _jsx("span", { className: "flex-shrink-0", children: icon }), _jsx("span", { className: "text-left", children: children })] }), showChevron && (_jsx(motion.div, { animate: { rotate: isOpen ? 180 : 0 }, transition: { duration: 0.3 }, className: "flex-shrink-0", children: _jsx(ChevronDown, { className: "h-5 w-5 opacity-60" }) }))] })) }));
});
CollapsibleTrigger.displayName = "CollapsibleTrigger";
const CollapsibleContent = React.forwardRef(({ className, animated = true, children, ...props }, ref) => (_jsx(CollapsiblePrimitive.CollapsibleContent, { ref: ref, className: cn("overflow-hidden transition-all duration-300 data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down", className), "data-animated": animated, style: {
        "--radix-collapsible-content-height": "var(--radix-collapsible-content-height)",
    }, ...props, children: _jsx("div", { className: "px-4 py-3", children: children }) })));
CollapsibleContent.displayName = "CollapsibleContent";
const spacingClassesMap = {
    sm: "gap-2",
    md: "gap-3",
    lg: "gap-4",
};
const CollapsibleGroup = React.forwardRef(({ className, spacing = "md", children, ...props }, ref) => {
    // eslint-disable-next-line security/detect-object-injection
    const spacingClass = spacingClassesMap[spacing];
    return (_jsx("div", { ref: ref, className: cn("flex flex-col", spacingClass, className), ...props, children: children }));
});
CollapsibleGroup.displayName = "CollapsibleGroup";
export { Collapsible, CollapsibleTrigger, CollapsibleContent, CollapsibleGroup, collapsibleTriggerVariants, };
//# sourceMappingURL=Collapsible.js.map