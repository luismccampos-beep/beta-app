import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { cn } from '../../../utils';
export const TrustBadge = ({ icon: Icon, title, description, className }) => (_jsxs("div", { className: cn('flex items-start gap-3', className), children: [_jsx("div", { className: 'rounded-lg bg-primary/10 p-2 shrink-0', children: _jsx(Icon, { className: 'h-5 w-5 text-primary' }) }), _jsxs("div", { children: [_jsx("h4", { className: 'font-semibold text-sm mb-1', children: title }), _jsx("p", { className: 'text-xs text-muted-foreground', children: description })] })] }));
/** @alias */
export default TrustBadge;
//# sourceMappingURL=index.js.map