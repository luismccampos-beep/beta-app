import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import {} from "react";
import { cn } from "../../utils/cn";
function BottomNav({ items, activeKey, onChange, className, }) {
    return (_jsx("nav", { className: cn("fixed inset-x-0 bottom-0 z-40 flex items-center justify-between border-t border-border bg-background/95 px-2 py-1.5 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:hidden", className), "aria-label": "Bottom navigation", children: _jsx("ul", { className: "flex w-full items-center justify-around gap-1", children: items.map((item) => {
                const isActive = item.key === activeKey;
                return (_jsx("li", { className: "flex-1", children: _jsxs("button", { type: "button", className: cn("relative mx-auto flex w-full max-w-[90px] flex-col items-center justify-center gap-0.5 rounded-full px-2 py-1 text-[11px] font-medium transition-colors", isActive
                            ? "text-primary bg-primary/10"
                            : "text-muted-foreground hover:bg-muted/40", item.disabled && "opacity-50 cursor-not-allowed"), onClick: () => {
                            if (item.disabled)
                                return;
                            onChange?.(item.key);
                        }, "aria-current": isActive ? "page" : undefined, "aria-disabled": item.disabled || undefined, children: [_jsx("span", { className: cn("flex h-6 w-6 items-center justify-center rounded-full text-[18px]", isActive && "bg-primary text-primary-foreground"), "aria-hidden": "true", children: item.icon }), _jsx("span", { className: "truncate", children: item.label }), typeof item.badgeCount === "number" && item.badgeCount > 0 && (_jsx("span", { className: "absolute -top-0.5 right-4 inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground", children: item.badgeCount > 99 ? "99+" : item.badgeCount }))] }) }, item.key));
            }) }) }));
}
export { BottomNav };
//# sourceMappingURL=BottomNav.js.map