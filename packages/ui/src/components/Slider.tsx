"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "../utils/cn";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => {
  const value = props.value || props.defaultValue || [0];
  const thumbCount = Array.isArray(value) ? value.length : 1;

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "group relative flex w-full touch-none select-none items-center py-4",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-muted/50 transition-colors group-hover:bg-muted">
        <SliderPrimitive.Range className="absolute h-full bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 shadow-[0_0_10px_-2px_rgba(139,92,246,0.5)]" />
      </SliderPrimitive.Track>

      {Array.from({ length: thumbCount }).map((_, i) => {
        return (
          <SliderPrimitive.Thumb
            key={i}
            className={cn(
              "relative block h-5 w-5 rounded-full border-2 border-primary bg-background shadow-xl ring-offset-background transition-all",
              "hover:scale-110 active:scale-95",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:pointer-events-none disabled:opacity-50 cursor-grab active:cursor-grabbing"
            )}
          >
            <div className="absolute inset-[-4px] rounded-full bg-primary/10 opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary" />
          </SliderPrimitive.Thumb>
        );
      })}
    </SliderPrimitive.Root>
  );
});

Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };