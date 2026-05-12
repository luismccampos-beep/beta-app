import * as React from "react"

import { cn } from "../utils/cn"

export interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "default";
}

const LoadingSpinner = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({ className, size = "default", ...props }, ref) => {
    const sizeClasses = {
      sm: "h-4 w-4",
      md: "h-8 w-8",
      lg: "h-12 w-12",
      default: "h-8 w-8",
    }

    const finalSizeClass = (size in sizeClasses) 
       
      ? sizeClasses[size as keyof typeof sizeClasses] 
      : sizeClasses.default;

    return (
      <div
        ref={ref}
        className={cn("flex items-center justify-center", className)}
        {...props}
      >
        <div
          className={cn(
            finalSizeClass,
            "animate-spin rounded-full border-b-2 border-primary"
          )}
        />
      </div>
    )
  }
)
LoadingSpinner.displayName = "LoadingSpinner"

export { LoadingSpinner }
