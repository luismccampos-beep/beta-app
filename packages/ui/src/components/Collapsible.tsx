"use client";

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { ChevronDown } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import * as React from "react";

import { cn } from "../utils/cn";

// Trigger variants with CVA
const collapsibleTriggerVariants = cva(
  "flex w-full items-center justify-between rounded-lg px-4 py-3 font-semibold transition-all hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-background hover:bg-accent dark:hover:bg-slate-800",
        filled: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline:
          "border border-input hover:border-ring dark:border-slate-600 dark:hover:border-slate-500",
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
  }
);

export interface CollapsibleProps
  extends React.ComponentPropsWithoutRef<
    typeof CollapsiblePrimitive.Root
  > {
  animated?: boolean;
}

const Collapsible = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.Root>,
  CollapsibleProps
>(({ className, animated = true, ...props }, ref) => (
  <CollapsiblePrimitive.Root
    ref={ref}
    className={cn("w-full", className)}
    data-animated={animated}
    {...props}
  />
));
Collapsible.displayName = "Collapsible";

export interface CollapsibleTriggerProps
  extends React.ComponentPropsWithoutRef<
    typeof CollapsiblePrimitive.CollapsibleTrigger
  >,
    VariantProps<typeof collapsibleTriggerVariants> {
  icon?: React.ReactNode;
  showChevron?: boolean;
  asChild?: boolean;
}

const CollapsibleTrigger = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.CollapsibleTrigger>,
  CollapsibleTriggerProps
>(
  (
    {
      className,
      variant,
      size,
      icon,
      showChevron = true,
      children,
      asChild,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
      <CollapsiblePrimitive.CollapsibleTrigger
        ref={ref}
        asChild={asChild}
        className={cn(!asChild && collapsibleTriggerVariants({ variant, size }), className)}
        onClick={(e) => {
          const trigger = e.currentTarget;
          setIsOpen(trigger.getAttribute("data-state") !== "open");
        }}
        {...props}
      >
        {asChild ? (
          children
        ) : (
          <>
            <div className="flex items-center gap-3 flex-1">
              {icon && <span className="flex-shrink-0">{icon}</span>}
              <span className="text-left">{children}</span>
            </div>

            {showChevron && (
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="flex-shrink-0"
              >
                <ChevronDown className="h-5 w-5 opacity-60" />
              </motion.div>
            )}
          </>
        )}
      </CollapsiblePrimitive.CollapsibleTrigger>
    );
  }
);
CollapsibleTrigger.displayName = "CollapsibleTrigger";

export interface CollapsibleContentProps
  extends React.ComponentPropsWithoutRef<
    typeof CollapsiblePrimitive.CollapsibleContent
  > {
  animated?: boolean;
}

const CollapsibleContent = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.CollapsibleContent>,
  CollapsibleContentProps
>(({ className, animated = true, children, ...props }, ref) => (
  <CollapsiblePrimitive.CollapsibleContent
    ref={ref}
    className={cn(
      "overflow-hidden transition-all duration-300 data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down",
      className
    )}
    data-animated={animated}
    style={{
      "--radix-collapsible-content-height":
        "var(--radix-collapsible-content-height)",
    } as React.CSSProperties}
    {...props}
  >
    <div className="px-4 py-3">{children}</div>
  </CollapsiblePrimitive.CollapsibleContent>
));
CollapsibleContent.displayName = "CollapsibleContent";

// Group component for multiple collapsibles
interface CollapsibleGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  spacing?: "sm" | "md" | "lg";
}

const spacingClassesMap = {
  sm: "gap-2",
  md: "gap-3",
  lg: "gap-4",
} as const;

const CollapsibleGroup = React.forwardRef<
  HTMLDivElement,
  CollapsibleGroupProps
>(({ className, spacing = "md", children, ...props }, ref) => {
  // eslint-disable-next-line security/detect-object-injection
  const spacingClass = spacingClassesMap[spacing];

  return (
    <div
      ref={ref}
      className={cn("flex flex-col", spacingClass, className)}
      {...props}
    >
      {children}
    </div>
  );
});
CollapsibleGroup.displayName = "CollapsibleGroup";

export {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  CollapsibleGroup,
  collapsibleTriggerVariants,
};