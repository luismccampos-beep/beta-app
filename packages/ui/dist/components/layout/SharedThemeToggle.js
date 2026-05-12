"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@akmleva/ui';
export default function SharedThemeToggle({ theme, isDark, onToggleTheme, onChangeTheme, t, }) {
    const resolvedTheme = useMemo(() => {
        if (theme)
            return theme;
        if (typeof isDark === 'boolean')
            return isDark ? 'dark' : 'light';
        return 'system';
    }, [theme, isDark]);
    const label = t ? t('theme.toggle', 'Alternar tema') : 'Alternar tema';
    const handleClick = () => {
        if (onToggleTheme) {
            onToggleTheme();
            return;
        }
        if (onChangeTheme) {
            if (resolvedTheme === 'light') {
                onChangeTheme('dark');
            }
            else {
                onChangeTheme('light');
            }
        }
    };
    const Icon = resolvedTheme === 'dark' ? Moon : Sun;
    return (_jsx(TooltipProvider, { children: _jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { asChild: true, children: _jsx(Button, { variant: "ghost", size: "icon", "aria-label": label, onClick: handleClick, children: _jsx(Icon, { className: "h-4 w-4" }) }) }), _jsx(TooltipContent, { children: _jsx("p", { children: label }) })] }) }));
}
//# sourceMappingURL=SharedThemeToggle.js.map