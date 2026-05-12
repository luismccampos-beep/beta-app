"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../utils/cn";
const Select = (props) => (_jsx(SelectPrimitive.Root, { ...props }));
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;
const SelectTrigger = React.forwardRef(({ className, children, size = "md", variant = "default", disabled = false, ...props }, ref) => {
    const baseStyles = cn("flex items-center justify-between rounded-md border px-3 py-2 text-sm", "focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", "transition-all duration-200", "data-[state=open]:ring-2 data-[state=open]:ring-offset-2", "data-[state=open]:shadow-lg data-[state=open]:z-50");
    const sizeStyles = {
        sm: "h-9 text-xs",
        md: "h-10",
        lg: "h-11 text-lg",
    };
    const variantStyles = {
        default: "bg-background border-input",
        outline: "border border-input bg-transparent",
        ghost: "border-none bg-transparent",
    };
    const disabledStyles = disabled
        ? "opacity-50 cursor-not-allowed"
        : "hover:bg-muted hover:text-muted-foreground";
    return (_jsxs(SelectPrimitive.Trigger, { ref: ref, className: cn(baseStyles, 
        // eslint-disable-next-line security/detect-object-injection
        sizeStyles[size], 
        // eslint-disable-next-line security/detect-object-injection
        variantStyles[variant], disabledStyles, className), ...props, children: [children, _jsx(SelectPrimitive.Icon, { asChild: true, children: _jsx(ChevronDown, { className: "h-4 w-4 opacity-50 transition-transform duration-200 data-[state=open]:rotate-180" }) })] }));
});
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;
const SelectScrollUpButton = React.forwardRef(({ className, ...props }, ref) => (_jsx(SelectPrimitive.ScrollUpButton, { ref: ref, className: cn("flex cursor-default items-center justify-center py-1", className), ...props, children: _jsx(ChevronUp, { className: "h-4 w-4" }) })));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;
const SelectScrollDownButton = React.forwardRef(({ className, ...props }, ref) => (_jsx(SelectPrimitive.ScrollDownButton, { ref: ref, className: cn("flex cursor-default items-center justify-center py-1", className), ...props, children: _jsx(ChevronDown, { className: "h-4 w-4" }) })));
SelectScrollDownButton.displayName =
    SelectPrimitive.ScrollDownButton.displayName;
const SelectContent = React.forwardRef(({ className, children, position = "popper", size = "md", variant = "default", ...props }, ref) => {
    const baseStyles = cn("relative z-50 overflow-hidden rounded-md shadow-lg", "data-[state=open]:animate-in data-[state=closed]:animate-out", "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95", "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2", "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", position === "popper" &&
        "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1", "data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className);
    const sizeStyles = {
        sm: "min-w-[8rem]",
        md: "min-w-[12rem]",
        lg: "min-w-[16rem]",
    };
    const variantStyles = {
        default: "border border-input bg-popover text-popover-foreground",
        outline: "border border-input bg-background",
        ghost: "bg-popover/95 backdrop-blur-sm",
    };
    return (_jsx(SelectPrimitive.Portal, { children: _jsx(AnimatePresence, { children: _jsx(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 }, transition: { duration: 0.15 }, children: _jsxs(SelectPrimitive.Content, { ref: ref, className: cn(baseStyles, 
                    // eslint-disable-next-line security/detect-object-injection
                    sizeStyles[size], 
                    // eslint-disable-next-line security/detect-object-injection
                    variantStyles[variant]), position: position, ...props, children: [_jsx(SelectScrollUpButton, {}), _jsx(SelectPrimitive.Viewport, { className: cn("p-1", position === "popper" &&
                                "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"), children: children }), _jsx(SelectScrollDownButton, {})] }) }) }) }));
});
SelectContent.displayName = SelectPrimitive.Content.displayName;
const SelectLabel = React.forwardRef(({ className, ...props }, ref) => (_jsx(SelectPrimitive.Label, { ref: ref, className: cn("py-1.5 pl-8 pr-2 text-sm font-semibold", "text-foreground", className), ...props })));
SelectLabel.displayName = SelectPrimitive.Label.displayName;
const SelectItem = React.forwardRef(({ className, children, size = "md", variant = "default", ...props }, ref) => {
    const baseStyles = cn("relative flex w-full cursor-default select-none items-center rounded-sm", "outline-none focus:bg-accent focus:text-accent-foreground", "data-[disabled]:pointer-events-none data-[disabled]:opacity-50", "transition-colors duration-200", "hover:bg-muted hover:text-muted-foreground");
    const sizeStyles = {
        sm: "py-1 text-xs",
        md: "py-1.5 text-sm",
        lg: "py-2 text-base",
    };
    const variantStyles = {
        default: "bg-transparent",
        outline: "bg-transparent",
        ghost: "bg-transparent",
    };
    return (_jsxs(SelectPrimitive.Item, { ref: ref, className: cn(baseStyles, 
        // eslint-disable-next-line security/detect-object-injection
        sizeStyles[size], 
        // eslint-disable-next-line security/detect-object-injection
        variantStyles[variant], className), ...props, children: [_jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: _jsx(SelectPrimitive.ItemIndicator, { children: _jsx(Check, { className: "h-4 w-4" }) }) }), _jsx(SelectPrimitive.ItemText, { className: "truncate", children: children })] }));
});
SelectItem.displayName = SelectPrimitive.Item.displayName;
const SelectSeparator = React.forwardRef(({ className, ...props }, ref) => (_jsx(SelectPrimitive.Separator, { ref: ref, className: cn("-mx-1 my-1 h-px bg-muted", className), ...props })));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;
export { Select, SelectGroup, SelectContent, SelectValue, SelectTrigger, SelectLabel, SelectItem, SelectSeparator, SelectScrollUpButton, SelectScrollDownButton, };
//# sourceMappingURL=Select.js.map