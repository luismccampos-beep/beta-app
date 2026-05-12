"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import {} from "react";
import { ArrowLeft, Menu, Search, Settings } from "lucide-react";
import { Button } from "../Button";
import { MobileToolbar } from "../components-mobile/MobileToolbar";
import SharedThemeToggle from "./SharedThemeToggle";
import SharedUserMenu from "./SharedUserMenu";
import { cn } from "../../utils/cn";
export default function SharedMobileHeader({ title, subtitle, showBackButton = false, onBackClick, showSearch = false, onSearchClick, showSettings = false, onSettingsClick, showTheme = false, theme, isDark, onThemeToggle, user, showUser = false, onLogin, onLogout, onUserClick: _onUserClick, onNavigate, showMenu = false, onMenuClick, className, t, leading: customLeading, trailing: customTrailing, }) {
    const buttonClasses = "h-8 w-8 p-0";
    const leading = customLeading || (showBackButton ? (_jsx(Button, { variant: "ghost", size: "sm", onClick: onBackClick, className: buttonClasses, "aria-label": t ? t('common.back', 'Voltar') : 'Voltar', children: _jsx(ArrowLeft, { className: "h-4 w-4", "aria-hidden": "true" }) })) : null);
    const trailing = (_jsxs("div", { className: "flex items-center gap-1", children: [showSearch && (_jsx(Button, { variant: "ghost", size: "sm", onClick: onSearchClick, className: buttonClasses, "aria-label": t ? t('common.search', 'Pesquisar') : 'Pesquisar', children: _jsx(Search, { className: "h-4 w-4", "aria-hidden": "true" }) })), showSettings && (_jsx(Button, { variant: "ghost", size: "sm", onClick: onSettingsClick, className: buttonClasses, "aria-label": t ? t('common.settings', 'Definições') : 'Definições', children: _jsx(Settings, { className: "h-4 w-4", "aria-hidden": "true" }) })), showTheme && (_jsx(SharedThemeToggle, { theme: theme, isDark: isDark, onToggleTheme: onThemeToggle, t: t })), showUser && (_jsx(SharedUserMenu, { user: user, onLogin: onLogin, onLogout: onLogout, onNavigate: onNavigate, t: t })), showMenu && onMenuClick && (_jsx(Button, { variant: "ghost", size: "sm", onClick: onMenuClick, className: buttonClasses, "aria-label": t ? t('common.menu', 'Menu') : 'Menu', children: _jsx(Menu, { className: "h-4 w-4", "aria-hidden": "true" }) })), customTrailing] }));
    return (_jsx(MobileToolbar, { title: title, subtitle: subtitle, leading: leading, trailing: trailing, className: cn("sm:hidden", className) }));
}
//# sourceMappingURL=SharedMobileHeader.js.map