import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import {} from "react";
import { cn } from "../../utils/cn";
function MobileSheet({ open, onOpenChange, children, className, ariaLabel, }) {
    if (!open)
        return null;
    return (_jsxs("div", { className: "fixed inset-0 z-50 flex items-end justify-center sm:hidden", children: [_jsx("button", { type: "button", className: "absolute inset-0 bg-black/40", "aria-label": "Close", onClick: () => onOpenChange?.(false) }), _jsxs("section", { className: cn("relative z-10 w-full max-w-md rounded-t-2xl border border-border bg-background p-4 shadow-lg", "animate-in slide-in-from-bottom-4 duration-200", className), role: "dialog", "aria-modal": "true", "aria-label": ariaLabel, children: [_jsx("div", { className: "mx-auto mb-3 h-1 w-10 rounded-full bg-muted" }), children] })] }));
}
export { MobileSheet };
//# sourceMappingURL=MobileSheet.js.map