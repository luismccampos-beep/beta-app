import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { cn } from "../utils/cn";
const LoadingSpinner = React.forwardRef(({ className, size = "default", ...props }, ref) => {
    const sizeClasses = {
        sm: "h-4 w-4",
        md: "h-8 w-8",
        lg: "h-12 w-12",
        default: "h-8 w-8",
    };
    const finalSizeClass = (size in sizeClasses)
        ? sizeClasses[size]
        : sizeClasses.default;
    return (_jsx("div", { ref: ref, className: cn("flex items-center justify-center", className), ...props, children: _jsx("div", { className: cn(finalSizeClass, "animate-spin rounded-full border-b-2 border-primary") }) }));
});
LoadingSpinner.displayName = "LoadingSpinner";
export { LoadingSpinner };
//# sourceMappingURL=LoadingSpinner.js.map