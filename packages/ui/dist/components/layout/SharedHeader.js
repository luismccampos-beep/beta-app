"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from '@akmleva/ui';
import LanguageSwitcher, { LanguageSwitcherVariant } from '@akmleva/shared/components/LanguageSwitcher';
import SharedDesktopMenu from './SharedDesktopMenu';
import SharedMobileMenu from './SharedMobileMenu';
import SharedUserMenu from './SharedUserMenu';
import SharedThemeToggle from './SharedThemeToggle';
function filterItems(items, userRole, isAuthenticated) {
    return items.filter((item) => {
        if (item.protected && !isAuthenticated)
            return false;
        if (item.roleRequired && item.roleRequired !== userRole)
            return false;
        return true;
    });
}
export default function SharedHeader({ items, user, onLogin, onLogout, currentPath, onNavigate, LinkComponent, t, theme, onThemeToggle, className, }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    const visibleItems = useMemo(() => filterItems(items, user?.role, Boolean(user)), [items, user?.role, user]);
    const title = t ? t('header.brand', 'AKMLEVA') : 'AKMLEVA';
    const menuLabel = t ? t('header.menu', 'Menu') : 'Menu';
    const handleNavigate = (href) => {
        onNavigate(href);
        setMobileOpen(false);
    };
    // Conditionally create props objects to avoid passing undefined
    const userMenuProps = {
        ...(user && { user }),
        ...(onLogin && { onLogin }),
        ...(onLogout && { onLogout }),
        ...(t && { t }),
        onNavigate: handleNavigate,
    };
    const mobileMenuProps = {
        open: mobileOpen,
        items: visibleItems,
        currentPath,
        onNavigate: handleNavigate,
        LinkComponent,
        ...(user && { user }),
        ...(theme ? { theme } : {}),
        ...(onThemeToggle ? { onThemeToggle } : {}),
    };
    return (_jsxs("header", { className: `
        ${className || 'sticky top-0 z-50 w-full transition-all duration-300'}
        ${isScrolled
            ? 'bg-background/80 backdrop-blur-md shadow-sm border-b border-border'
            : 'bg-background/0 border-b border-transparent'}
      `, children: [_jsxs("div", { className: "container flex h-16 items-center justify-between", children: [_jsx("div", { className: "flex items-center gap-3", children: _jsxs("button", { type: "button", onClick: () => handleNavigate('/'), className: "flex items-center gap-2 border-0 bg-transparent cursor-pointer p-0 group", "aria-label": `${title} home`, children: [_jsx("div", { className: "h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors", children: _jsx("span", { className: "font-bold text-lg", children: "A" }) }), _jsx("span", { className: "font-bold text-lg tracking-tight", children: title })] }) }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx(SharedDesktopMenu, { items: visibleItems, currentPath: currentPath, onNavigate: handleNavigate, LinkComponent: LinkComponent }), _jsxs("div", { className: "hidden md:flex items-center gap-2 mr-2 border-l border-border/50 pl-4", children: [_jsx(LanguageSwitcher, { showLabel: false, variant: LanguageSwitcherVariant.GHOST, className: "h-9 w-9", Button: Button, DropdownMenu: DropdownMenu, DropdownMenuContent: DropdownMenuContent, DropdownMenuItem: DropdownMenuItem, DropdownMenuTrigger: DropdownMenuTrigger }), _jsx(SharedThemeToggle, { ...(theme ? { theme } : {}), ...(onThemeToggle ? { onToggleTheme: onThemeToggle } : {}) })] }), _jsx("div", { className: "hidden md:flex items-center", children: _jsx(SharedUserMenu, { ...userMenuProps }) }), _jsxs("div", { className: "flex md:hidden items-center gap-2", children: [_jsx(SharedUserMenu, { ...userMenuProps }), _jsx(Button, { type: "button", variant: "ghost", size: "icon", "aria-label": menuLabel, onClick: () => setMobileOpen((prev) => !prev), children: mobileOpen ? _jsx(X, { className: "h-5 w-5" }) : _jsx(Menu, { className: "h-5 w-5" }) })] })] })] }), _jsx(SharedMobileMenu, { ...mobileMenuProps })] }));
}
//# sourceMappingURL=SharedHeader.js.map