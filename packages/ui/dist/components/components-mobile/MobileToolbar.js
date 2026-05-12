import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import {} from "react";
import { cn } from "../../utils/cn";
function MobileToolbar({ title, subtitle, leading, trailing, className, }) {
    const hasText = Boolean(title || subtitle);
    return (_jsxs("header", { className: cn("sticky top-0 z-40 flex items-center gap-3 border-b border-border bg-background/95 px-3 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:hidden", className), children: [leading && (_jsx("div", { className: "flex h-9 w-9 items-center justify-center", children: leading })), hasText && (_jsxs("div", { className: "flex min-w-0 flex-1 flex-col", children: [title && (_jsx("div", { className: "truncate text-sm font-semibold leading-tight", children: title })), subtitle && (_jsx("div", { className: "truncate text-xs text-muted-foreground", children: subtitle }))] })), trailing && (_jsx("div", { className: "ml-auto flex items-center gap-1", children: trailing }))] }));
}
export { MobileToolbar };
//# sourceMappingURL=MobileToolbar.js.map