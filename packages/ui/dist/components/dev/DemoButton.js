import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Button } from '@akmleva/ui';
import { Shield } from 'lucide-react';
import { cn } from '../../utils/cn';
export const DemoButton = ({ label, sublabel, icon, variant = 'full', isLoading = false, className, onClick, ...props }) => {
    if (variant === 'compact') {
        return (_jsxs(Button, { variant: "outline", size: "sm", onClick: onClick, disabled: isLoading, className: cn('flex items-center gap-2', className), ...props, children: [icon || _jsx(Shield, { className: "h-4 w-4" }), label] }));
    }
    return (_jsxs(Button, { variant: "outline", onClick: onClick, disabled: isLoading, className: cn('flex items-center justify-center gap-2 w-full h-auto py-2', className), ...props, children: [icon || _jsx(Shield, { className: "h-4 w-4" }), _jsxs("div", { className: "text-left flex flex-col", children: [_jsx("span", { className: "font-medium text-sm leading-none", children: label }), sublabel && _jsx("span", { className: "text-xs opacity-75 mt-1", children: sublabel })] })] }));
};
//# sourceMappingURL=DemoButton.js.map