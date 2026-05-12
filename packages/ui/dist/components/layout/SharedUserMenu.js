import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Bell, LogOut, User as UserIcon, Settings, CreditCard, LifeBuoy } from 'lucide-react';
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, Avatar, AvatarFallback, AvatarImage } from '@akmleva/ui';
export default function SharedUserMenu({ user, onLogin, onLogout, t, showNotifications, notificationsCount, onNotificationsClick, onNavigate, }) {
    // Safe translation helper
    const translate = (key, fallback) => t ? t(key, fallback) : fallback;
    const labelLogin = translate('header.login', 'Entrar');
    const labelLogout = translate('header.logout', 'Terminar sessão');
    const labelUserFallback = translate('header.user', 'Utilizador');
    const labelNotifications = translate('header.notifications', 'Notificações');
    const labelProfile = translate('header.profile', 'Perfil');
    const labelSettings = translate('header.settings', 'Definições');
    const labelBilling = translate('header.billing', 'Faturação');
    const labelHelp = translate('header.help', 'Ajuda');
    if (!user) {
        if (!onLogin)
            return null;
        return (_jsx(Button, { size: "sm", onClick: onLogin, className: "font-medium px-6", children: labelLogin }));
    }
    const hasNotifications = Boolean(showNotifications && notificationsCount && notificationsCount > 0);
    const userInitials = (user.name || user.email || 'U').charAt(0).toUpperCase();
    const handleNavigate = (path) => {
        if (onNavigate) {
            onNavigate(path);
        }
        else if (typeof window !== 'undefined') {
            window.location.href = path;
        }
    };
    return (_jsxs("div", { className: "flex items-center gap-2", children: [showNotifications && (_jsxs(Button, { type: "button", variant: "ghost", size: "icon", className: "relative h-9 w-9 text-muted-foreground hover:text-foreground", "aria-label": labelNotifications, onClick: onNotificationsClick, children: [_jsx(Bell, { className: "h-4 w-4" }), hasNotifications && (_jsx("span", { className: "absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border border-background" }))] })), _jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsx(Button, { variant: "ghost", className: "relative h-9 w-9 rounded-full ring-offset-background transition-all hover:ring-2 hover:ring-primary/20 p-0 ml-1", children: _jsxs(Avatar, { className: "h-9 w-9 border border-border/50", children: [_jsx(AvatarImage, { src: user.avatarUrl, alt: user.name || labelUserFallback }), _jsx(AvatarFallback, { className: "bg-gradient-to-br from-primary/10 to-primary/20 text-primary font-medium", children: userInitials })] }) }) }), _jsxs(DropdownMenuContent, { align: "end", className: "w-64 p-2 rounded-xl shadow-xl border-border/60", children: [_jsx(DropdownMenuLabel, { className: "font-normal p-3 bg-muted/30 rounded-lg mb-1", children: _jsxs("div", { className: "flex flex-col space-y-1", children: [_jsx("p", { className: "text-sm font-semibold leading-none", children: user.name || labelUserFallback }), _jsx("p", { className: "text-xs leading-none text-muted-foreground truncate opacity-80", children: user.email })] }) }), _jsx(DropdownMenuSeparator, { className: "my-1 opacity-50" }), _jsxs(DropdownMenuItem, { onClick: () => handleNavigate('/profile'), className: "rounded-lg cursor-pointer", children: [_jsx(UserIcon, { className: "mr-2 h-4 w-4 opacity-70" }), _jsx("span", { children: labelProfile })] }), _jsxs(DropdownMenuItem, { onClick: () => handleNavigate('/settings'), className: "rounded-lg cursor-pointer", children: [_jsx(Settings, { className: "mr-2 h-4 w-4 opacity-70" }), _jsx("span", { children: labelSettings })] }), _jsxs(DropdownMenuItem, { onClick: () => handleNavigate('/billing'), className: "rounded-lg cursor-pointer", children: [_jsx(CreditCard, { className: "mr-2 h-4 w-4 opacity-70" }), _jsx("span", { children: labelBilling })] }), _jsxs(DropdownMenuItem, { onClick: () => handleNavigate('/help'), className: "rounded-lg cursor-pointer", children: [_jsx(LifeBuoy, { className: "mr-2 h-4 w-4 opacity-70" }), _jsx("span", { children: labelHelp })] }), onLogout && (_jsxs(_Fragment, { children: [_jsx(DropdownMenuSeparator, { className: "my-1 opacity-50" }), _jsxs(DropdownMenuItem, { onClick: onLogout, className: "rounded-lg text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20 cursor-pointer", children: [_jsx(LogOut, { className: "mr-2 h-4 w-4" }), _jsx("span", { children: labelLogout })] })] }))] })] })] }));
}
//# sourceMappingURL=SharedUserMenu.js.map