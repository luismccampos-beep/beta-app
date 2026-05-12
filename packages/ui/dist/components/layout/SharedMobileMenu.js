import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AnimatePresence, motion } from 'framer-motion';
import { Badge, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Button, } from '@akmleva/ui';
import LanguageSwitcher, { LanguageSwitcherSize, LanguageSwitcherVariant } from '@akmleva/shared/components/LanguageSwitcher';
import SharedThemeToggle from './SharedThemeToggle';
function isActivePath(currentPath, href) {
    if (!href || !currentPath)
        return false;
    if (currentPath === href)
        return true;
    if (href === '/')
        return currentPath === '/';
    return currentPath.startsWith(href + '/');
}
const menuVariants = {
    hidden: {
        opacity: 0,
        height: 0,
        transition: {
            duration: 0.2,
            ease: 'easeInOut',
            when: 'afterChildren',
        },
    },
    visible: {
        opacity: 1,
        height: 'auto',
        transition: {
            duration: 0.3,
            ease: 'easeOut',
            when: 'beforeChildren',
            staggerChildren: 0.05,
        },
    },
    exit: {
        opacity: 0,
        height: 0,
        transition: {
            duration: 0.2,
            ease: 'easeInOut',
            when: 'afterChildren',
        },
    },
};
const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -10 },
};
export default function SharedMobileMenu({ open, items, currentPath, onNavigate, LinkComponent, user, theme, onThemeToggle, }) {
    const hasItems = items.length > 0;
    return (_jsx(AnimatePresence, { children: open && (_jsx(motion.div, { variants: menuVariants, initial: "hidden", animate: "visible", exit: "exit", className: "md:hidden border-t border-border bg-background/95 backdrop-blur-md shadow-lg overflow-hidden", children: _jsxs("div", { className: "px-4 py-4 space-y-4", children: [user ? (_jsxs(motion.div, { variants: itemVariants, className: "flex items-center gap-3 p-2 rounded-lg bg-accent/50", children: [user.avatarUrl ? (_jsx("img", { src: user.avatarUrl, alt: user.name || user.email || '', className: "h-10 w-10 rounded-full object-cover border border-border" })) : (_jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-semibold border border-border", children: (user.name || user.email || 'U').charAt(0).toUpperCase() })), _jsxs("div", { className: "flex flex-col", children: [_jsx("span", { className: "text-sm font-medium", children: user.name || user.email }), user.role ? (_jsx("span", { className: "text-xs text-muted-foreground capitalize", children: user.role })) : null] })] })) : null, _jsxs(motion.div, { variants: itemVariants, className: "flex items-center justify-between border-b border-border pb-3", children: [_jsx("span", { className: "text-sm font-medium text-muted-foreground", children: "Apar\u00EAncia" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(LanguageSwitcher, { showLabel: true, variant: LanguageSwitcherVariant.GHOST, size: LanguageSwitcherSize.SMALL, Button: Button, DropdownMenu: DropdownMenu, DropdownMenuContent: DropdownMenuContent, DropdownMenuItem: DropdownMenuItem, DropdownMenuTrigger: DropdownMenuTrigger }), _jsx(SharedThemeToggle, { ...(theme ? { theme } : {}), ...(onThemeToggle ? { onToggleTheme: onThemeToggle } : {}) })] })] }), hasItems ? (_jsx("nav", { className: "flex flex-col gap-1", children: items.map((item) => {
                            const active = isActivePath(currentPath, item.href);
                            const Icon = item.icon;
                            return (_jsx(LinkComponent, { href: item.href, children: _jsxs(motion.button, { variants: itemVariants, type: "button", onClick: () => onNavigate(item.href), className: [
                                        'w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors',
                                        active
                                            ? 'bg-primary/10 text-primary'
                                            : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                                    ].join(' '), children: [_jsxs("span", { className: "flex items-center gap-3", children: [Icon ? _jsx(Icon, { className: "h-4 w-4" }) : null, item.label] }), item.badge ? (_jsx(Badge, { variant: "secondary", className: "ml-2 px-1.5 py-0 text-[10px]", children: item.badge })) : null] }) }, item.href));
                        }) })) : null] }) })) }));
}
//# sourceMappingURL=SharedMobileMenu.js.map