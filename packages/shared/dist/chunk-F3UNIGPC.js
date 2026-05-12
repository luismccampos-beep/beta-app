import {
  cn
} from "./chunk-CDRKFMWH.js";

// src/components/ui/button.tsx
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
var buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-bold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900",
        primary: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-600/20 dark:bg-emerald-500 dark:hover:bg-emerald-400",
        destructive: "bg-red-500 text-white hover:bg-red-600 shadow-sm",
        outline: "border-2 border-slate-200 bg-transparent hover:bg-slate-50 hover:border-slate-300 dark:border-slate-800 dark:hover:bg-slate-800/50",
        secondary: "bg-slate-100 text-slate-900 hover:bg-secondary/80 dark:bg-slate-800 dark:text-slate-100",
        ghost: "hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-900/20 dark:hover:text-emerald-400",
        link: "text-emerald-600 underline-offset-4 hover:underline"
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-9 px-4 text-xs",
        lg: "h-14 px-10 text-base",
        icon: "h-12 w-12"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
var MotionButton = motion.button;
var Button = React.forwardRef(
  ({
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
  }, ref) => {
    const content = isLoading ? /* @__PURE__ */ React.createElement(Loader2, { className: "h-5 w-5 animate-spin text-current" }) : /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-center gap-2" }, leftIcon && /* @__PURE__ */ React.createElement("span", { className: "flex-shrink-0" }, leftIcon), children, rightIcon && /* @__PURE__ */ React.createElement("span", { className: "flex-shrink-0" }, rightIcon));
    const mergedClassName = cn(buttonVariants({ variant, size, className }));
    if (asChild) {
      return /* @__PURE__ */ React.createElement(
        Slot,
        {
          className: mergedClassName,
          ref,
          style,
          ...rest
        },
        content
      );
    }
    return /* @__PURE__ */ React.createElement(
      MotionButton,
      {
        className: mergedClassName,
        ref,
        disabled: isLoading || disabled,
        whileTap: { scale: 0.97 },
        style,
        ...rest
      },
      content
    );
  }
);
Button.displayName = "Button";

export {
  buttonVariants,
  Button
};
//# sourceMappingURL=chunk-F3UNIGPC.js.map