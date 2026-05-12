"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * AppHeader - Unified Header Component for Shared Package
 *
 * Features:
 * - Multiple header variants (public/user/admin)
 * - Responsive mobile/desktop navigation
 * - Customizable navigation items
 * - User authentication integration
 * - Mobile menu support
 * - Language and Theme switching
 */
import { memo, useCallback, useState } from 'react';
import { Menu, X, User, LogOut, Settings } from 'lucide-react';
import { Button } from '@akmleva/ui';
import LanguageSwitcher, { LanguageSwitcherVariant } from '@akmleva/shared/components/LanguageSwitcher';
import { cn } from '@akmleva/shared/utils/index';
import SharedThemeToggle from '../../layout/SharedThemeToggle';
// =============================================================================
// DEFAULT CONFIGURATION
// =============================================================================
const defaultNavigation = [
    { href: '/', label: 'Início' },
    { href: '/destinos', label: 'Destinos' },
    { href: '/pacotes', label: 'Pacotes' },
    { href: '/about', label: 'Sobre Nós' },
    { href: '/contact', label: 'Contato' },
];
const userNavigation = [
    { href: '/dashboard', label: 'Dashboard', icon: _jsx(User, { className: "h-4 w-4" }) },
    { href: '/bookings', label: 'Reservas' },
    { href: '/profile', label: 'Perfil' },
    { href: '/settings', label: 'Configurações', icon: _jsx(Settings, { className: "h-4 w-4" }) },
];
// =============================================================================
// COMPONENT
// =============================================================================
const AppHeaderComponent = ({ variant = 'public', user = null, navItems, navigation, logo, onLogin, onLogout, onNavigate, pathname, onMenuStateChange, translations, showSearch: _showSearch, className, showUserMenu = true, theme, onThemeToggle, }) => {
    const [mobileMenuOpen, _setMobileMenuOpen] = useState(false);
    const setMobileMenuOpen = useCallback((open) => {
        _setMobileMenuOpen(open);
        if (onMenuStateChange) {
            onMenuStateChange(open ? 'open' : 'closed');
        }
    }, [onMenuStateChange]);
    // Use navigation or fallback to legacy navItems
    const activeNavigation = navigation || navItems || defaultNavigation;
    // Legacy props for compatibility (informational)
    void pathname;
    void translations;
    void _showSearch;
    const handleNavigation = useCallback((href) => {
        if (onNavigate) {
            onNavigate(href);
        }
        else {
            // Default navigation - you can customize this
            window.location.href = href;
        }
        setMobileMenuOpen(false);
    }, [onNavigate]);
    const handleLogout = useCallback(() => {
        if (onLogout) {
            onLogout();
        }
        setMobileMenuOpen(false);
    }, [onLogout]);
    const handleLogin = useCallback(() => {
        if (onLogin) {
            onLogin();
        }
        setMobileMenuOpen(false);
    }, [onLogin]);
    const filteredNavigation = activeNavigation.filter(item => {
        if (!item.protected)
            return true;
        return user !== null;
    });
    const renderLogo = () => {
        if (logo)
            return logo;
        return (_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("div", { className: "w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center", children: _jsx("span", { className: "text-white font-bold text-sm", children: "AK" }) }), _jsx("span", { className: "font-bold text-xl text-gray-900", children: "AKMLEVA" })] }));
    };
    const renderUserMenu = () => {
        if (!showUserMenu || variant === 'public')
            return null;
        if (user) {
            return (_jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [user.avatar ? (_jsx("img", { src: user.avatar, alt: user.name || 'User', className: "w-8 h-8 rounded-full object-cover" })) : (_jsx("div", { className: "w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center", children: _jsx(User, { className: "h-4 w-4 text-gray-600" }) })), _jsx("span", { className: "text-sm font-medium text-gray-700 hidden sm:block", children: user.name || user.email || 'User' })] }), _jsxs("div", { className: "relative group", children: [_jsx(Button, { variant: "ghost", size: "sm", className: "flex items-center space-x-1", children: _jsx(User, { className: "h-4 w-4" }) }), _jsxs("div", { className: "absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200", children: [userNavigation.map((item) => (_jsxs("button", { onClick: () => handleNavigation(item.href), className: "flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100", children: [item.icon, _jsx("span", { children: item.label })] }, item.href))), _jsx("hr", { className: "my-1" }), _jsxs("button", { onClick: handleLogout, className: "flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100", children: [_jsx(LogOut, { className: "h-4 w-4" }), _jsx("span", { children: "Sair" })] })] })] })] }));
        }
        return (_jsx(Button, { onClick: handleLogin, size: "sm", children: "Entrar" }));
    };
    return (_jsx("header", { className: cn('bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50', className), children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsxs("div", { className: "flex justify-between items-center h-16", children: [_jsx("div", { className: "flex items-center", children: _jsx("button", { onClick: () => handleNavigation('/'), className: "flex items-center space-x-2 hover:opacity-80 transition-opacity", children: renderLogo() }) }), _jsx("nav", { className: "hidden md:flex items-center space-x-8", children: filteredNavigation.map((item) => (_jsxs("button", { onClick: () => handleNavigation(item.href), className: "text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors relative", children: [item.label, item.badge && (_jsx("span", { className: "absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center", children: item.badge }))] }, item.href))) }), _jsxs("div", { className: "hidden md:flex items-center space-x-4", children: [_jsxs("div", { className: "flex items-center border-r border-gray-200 pr-4 mr-2 space-x-2", children: [_jsx(LanguageSwitcher, { showLabel: false, variant: LanguageSwitcherVariant.GHOST, className: "w-9 h-9 justify-center" }), _jsx(SharedThemeToggle, { ...(theme ? { theme } : {}), ...(onThemeToggle ? { onToggleTheme: onThemeToggle } : {}) })] }), renderUserMenu()] }), _jsx("div", { className: "md:hidden flex items-center space-x-4", children: _jsx(Button, { variant: "ghost", size: "sm", onClick: () => setMobileMenuOpen(!mobileMenuOpen), children: mobileMenuOpen ? (_jsx(X, { className: "h-6 w-6" })) : (_jsx(Menu, { className: "h-6 w-6" })) }) })] }), mobileMenuOpen && (_jsx("div", { className: "md:hidden border-t border-gray-200 py-4", children: _jsxs("nav", { className: "flex flex-col space-y-3", children: [filteredNavigation.map((item) => (_jsxs("button", { onClick: () => handleNavigation(item.href), className: "text-gray-600 hover:text-gray-900 px-3 py-2 text-base font-medium text-left transition-colors", children: [item.label, item.badge && (_jsx("span", { className: "ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1", children: item.badge }))] }, item.href))), _jsxs("div", { className: "pt-4 border-t border-gray-200 flex flex-col space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between px-3", children: [_jsx("span", { className: "text-sm font-medium text-gray-500", children: "Apar\u00EAncia" }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(LanguageSwitcher, { showLabel: true, variant: LanguageSwitcherVariant.GHOST }), _jsx(SharedThemeToggle, { ...(theme ? { theme } : {}), ...(onThemeToggle ? { onToggleTheme: onThemeToggle } : {}) })] })] }), _jsx("div", { className: "px-3", children: renderUserMenu() })] })] }) }))] }) }));
};
export const AppHeader = memo(AppHeaderComponent);
AppHeader.displayName = 'AppHeader';
/** @alias */
export default AppHeader;
//# sourceMappingURL=AppHeader.js.map