import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { cn } from "../utils/cn";
function Skeleton({ className, ...props }) {
    return (_jsx("div", { className: cn("animate-pulse rounded-md bg-muted", className), ...props }));
}
export { Skeleton };
//# sourceMappingURL=Skeleton.js.map