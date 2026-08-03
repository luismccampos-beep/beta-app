import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

/**
 * Typography components for consistent heading/body styling across the app.
 * Replaces ad-hoc `text-5xl font-black` classes with semantic, reusable components.
 *
 * Usage:
 *   <H1>Page Title</H1>
 *   <H2>Section Title</H2>
 *   <Lead>Subtitle or lead paragraph</Lead>
 *   <Muted>Secondary text</Muted>
 */

const headingVariants = cva(
  "tracking-tighter text-balance",
  {
    variants: {
      level: {
        h1: "text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1]",
        h2: "text-3xl sm:text-4xl md:text-5xl font-black leading-[1.15]",
        h3: "text-2xl sm:text-3xl font-black leading-tight",
        h4: "text-xl sm:text-2xl font-bold leading-tight",
        h5: "text-lg sm:text-xl font-bold leading-snug",
        h6: "text-base font-semibold leading-snug",
      },
      headingColor: {
        default: "text-gray-900 dark:text-white",
        muted: "text-muted-foreground",
        primary: "text-primary dark:text-primary-300",
        accent: "text-accent dark:text-accent-300",
        white: "text-white",
        inherit: "",
      },
      align: {
        left: "text-left",
        center: "text-center",
        right: "text-right",
      },
    },
    defaultVariants: {
      level: "h2",
      headingColor: "default",
      align: "left",
    },
  },
);

interface HeadingProps
  extends Omit<React.HTMLAttributes<HTMLHeadingElement>, "color">,
    VariantProps<typeof headingVariants> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

function Heading({
  as: Tag = "h2",
  level,
  headingColor,
  align,
  className,
  children,
  ...props
}: HeadingProps) {
  return (
    <Tag
      className={cn(headingVariants({ level, headingColor, align }), className)}
      {...props}
    >
      {children}
    </Tag>
  );
}

function H1({ className, ...props }: Omit<HeadingProps, "as" | "level">) {
  return <Heading as="h1" level="h1" className={className} {...props} />;
}

function H2({ className, ...props }: Omit<HeadingProps, "as" | "level">) {
  return <Heading as="h2" level="h2" className={className} {...props} />;
}

function H3({ className, ...props }: Omit<HeadingProps, "as" | "level">) {
  return <Heading as="h3" level="h3" className={className} {...props} />;
}

function H4({ className, ...props }: Omit<HeadingProps, "as" | "level">) {
  return <Heading as="h4" level="h4" className={className} {...props} />;
}

function H5({ className, ...props }: Omit<HeadingProps, "as" | "level">) {
  return <Heading as="h5" level="h5" className={className} {...props} />;
}

function H6({ className, ...props }: Omit<HeadingProps, "as" | "level">) {
  return <Heading as="h6" level="h6" className={className} {...props} />;
}

/**
 * Lead paragraph — larger, lighter text for subtitles/intros.
 */
function Lead({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "text-lg sm:text-xl text-muted-foreground leading-relaxed font-medium",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Muted text — secondary/helper text with reduced opacity.
 */
function Muted({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

export {
  Heading,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  Lead,
  Muted,
  headingVariants,
};