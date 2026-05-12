import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';

import { cn } from '../../utils/index';
export const Separator = React.forwardRef(({ className, orientation = 'horizontal', ...props }, ref) => {
    return (_jsx("div", { ref: ref, className: cn("shrink-0 bg-border", orientation === 'horizontal' ? "h-[1px] w-full" : "h-full w-[1px]", className), ...props }));
});
Separator.displayName = "Separator";
//# sourceMappingURL=separator.js.map