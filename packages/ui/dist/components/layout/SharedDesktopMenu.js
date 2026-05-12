import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { Badge } from '@akmleva/ui';
function isActivePath(currentPath, href) {
    if (!href || !currentPath)
        return false;
    if (currentPath === href)
        return true;
    if (href === '/')
        return currentPath === '/';
    return currentPath.startsWith(href + '/');
}
export default function SharedDesktopMenu({ items, currentPath, onNavigate, LinkComponent, }) {
    if (!items.length)
        return null;
    return (_jsx("nav", { className: "hidden md:flex items-center gap-1", children: items.map((item) => {
            const active = isActivePath(currentPath, item.href);
            const Icon = item.icon;
            return (_jsx(LinkComponent, { href: item.href, children: _jsxs("button", { type: "button", onClick: () => onNavigate(item.href), className: [
                        'relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                        'hover:text-foreground',
                        active ? 'text-foreground' : 'text-muted-foreground',
                    ].join(' '), children: [active && (_jsx(motion.div, { layoutId: "activeNavBoundingBox", className: "absolute inset-0 bg-accent/60 rounded-lg -z-10", transition: { type: "spring", bounce: 0.2, duration: 0.6 } })), Icon ? _jsx(Icon, { className: "h-4 w-4 relative z-10" }) : null, _jsx("span", { className: "relative z-10", children: item.label }), item.badge ? (_jsx(Badge, { variant: "secondary", className: "ml-2 text-[10px] px-1.5 py-0 relative z-10", children: item.badge })) : null] }) }, item.href));
        }) }));
}
//# sourceMappingURL=SharedDesktopMenu.js.map