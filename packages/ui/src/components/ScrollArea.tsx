import * as React from "react"

import { cn } from "../utils/cn"

const ScrollArea = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "relative overflow-auto",
        "[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-300/50 [&::-webkit-scrollbar-thumb]:rounded-full dark:[&::-webkit-scrollbar-thumb]:bg-gray-700/50",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})
ScrollArea.displayName = "ScrollArea"

export { ScrollArea }
