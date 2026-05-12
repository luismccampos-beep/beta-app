import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Loader2 } from 'lucide-react';
import { cn } from '@akmleva/shared';
function FullPageLoading({ message = 'Loading...', className, isOverlay = false }) {
    const baseStyles = "flex flex-col items-center justify-center gap-3 text-muted-foreground";
    // If overlay, we fix it to the viewport with a high Z-index and backdrop blur
    const containerStyles = isOverlay
        ? "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
        : "min-h-screen w-full bg-background";
    return (_jsxs("div", { className: cn(baseStyles, containerStyles, className), role: "status", "aria-label": message, children: [_jsx(Loader2, { className: "h-10 w-10 animate-spin text-primary" }), message && (_jsx("span", { className: "text-sm font-medium animate-pulse", children: message })), _jsx("span", { className: "sr-only", children: "Loading content, please wait..." })] }));
}
export default FullPageLoading;
//# sourceMappingURL=FullPageLoading.js.map