"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Moon } from 'lucide-react';
import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@akmleva/ui';
export default function ThemeToggle({ onToggleTheme, className = '', size = 'md', }) {
    // Simple toggle without theme context dependency
    const handleToggle = () => {
        // Just call the callback - let the app handle the theme logic
        onToggleTheme?.();
    };
    const getIcon = () => {
        // Default to moon icon
        return Moon;
    };
    const getTooltipText = () => {
        return 'Alternar tema';
    };
    const getButtonSize = () => {
        switch (size) {
            case 'sm':
                return 'h-8 w-8';
            case 'lg':
                return 'h-12 w-12';
            default:
                return 'h-10 w-10';
        }
    };
    const Icon = getIcon();
    return (_jsx(TooltipProvider, { children: _jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { asChild: true, children: _jsx(Button, { variant: "ghost", size: "sm", className: `${getButtonSize()} ${className}`, onClick: handleToggle, children: _jsx(Icon, { className: "h-4 w-4" }) }) }), _jsx(TooltipContent, { children: _jsx("p", { children: getTooltipText() }) })] }) }));
}
//# sourceMappingURL=ThemeToggleNextJs.js.map