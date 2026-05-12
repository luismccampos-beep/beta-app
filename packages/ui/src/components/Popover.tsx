"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { X } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";

import { cn } from "../utils/cn";

const Popover = PopoverPrimitive.Root;

const PopoverAnchor = PopoverPrimitive.Anchor;

// Trigger variants with CVA
const popoverTriggerVariants = cva(
  "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        outline: "border border-input bg-background hover:bg-accent",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-base",
        lg: "h-12 px-6 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface PopoverTriggerProps
  extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger>,
    VariantProps<typeof popoverTriggerVariants> {}

const PopoverTrigger = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Trigger>,
  PopoverTriggerProps
>(({ className, variant, size, ...props }, ref) => (
  <PopoverPrimitive.Trigger
    ref={ref}
    className={cn(popoverTriggerVariants({ variant, size }), className)}
    {...props}
  />
));
PopoverTrigger.displayName = PopoverPrimitive.Trigger.displayName;

// Content variants with CVA
const popoverContentVariants = cva(
  "relative z-50 rounded-lg border bg-popover text-popover-foreground shadow-lg outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-slate-700 dark:bg-slate-800",
  {
    variants: {
      size: {
        sm: "w-48 p-3",
        md: "w-72 p-4",
        lg: "w-96 p-6",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

export interface PopoverContentProps
  extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>,
    VariantProps<typeof popoverContentVariants> {
  showArrow?: boolean;
  animated?: boolean;
}

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  PopoverContentProps
>(
  (
    {
      className,
      align = "center",
      sideOffset = 4,
      size,
      showArrow = false,
      animated = true,
      ...props
    },
    ref
  ) => (
    <PopoverPrimitive.Portal>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        data-animated={animated}
      >
        <PopoverPrimitive.Content
          ref={ref}
          align={align}
          sideOffset={sideOffset}
          className={cn(popoverContentVariants({ size }), className)}
          {...props}
        >
          {props.children}
          {showArrow && (
            <PopoverPrimitive.Arrow
              className="fill-popover dark:fill-slate-800"
              width={12}
              height={6}
            />
          )}
        </PopoverPrimitive.Content>
      </motion.div>
    </PopoverPrimitive.Portal>
  )
);
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

// Close button component
export interface PopoverCloseProps
  extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Close> {
  icon?: React.ReactNode;
}

const PopoverClose = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Close>,
  PopoverCloseProps
>(({ className, icon, ...props }, ref) => (
  <PopoverPrimitive.Close
    ref={ref}
    className={cn(
      "absolute right-4 top-4 rounded-md opacity-70 ring-offset-popover transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none",
      className
    )}
    {...props}
  >
    {icon || <X className="h-4 w-4" />}
    <span className="sr-only">Close</span>
  </PopoverPrimitive.Close>
));
PopoverClose.displayName = PopoverPrimitive.Close.displayName;

export { Popover, PopoverTrigger, PopoverContent, PopoverClose, PopoverAnchor };