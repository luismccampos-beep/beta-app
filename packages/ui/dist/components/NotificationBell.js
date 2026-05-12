import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { cn } from "../utils/cn";
const NotificationBell = React.forwardRef(({ className, iconClassName: _iconClassName, badgeClassName: _badgeClassName, ...props }, ref) => {
    return (_jsx("div", { ref: ref, className: cn("relative", className), ...props, children: "Bell" }));
});
NotificationBell.displayName = "NotificationBell";
export { NotificationBell };
export default NotificationBell;
//# sourceMappingURL=NotificationBell.js.map