"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { Heart, Globe, ChevronUp } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import BaseLink from '../../../common/BaseLink';
import { Logo } from '../../../common/Logo';
import { cn } from '../../../../utils/index';
// Defined at module level — static map, no dynamic key access at runtime
const LINK_FALLBACKS = new Map([
    ['privacy', 'Privacidade'],
    ['terms', 'Termos'],
    ['cookies', 'Cookies'],
]);
function getFallback(key) {
    return LINK_FALLBACKS.get(key) ?? key;
}
const NAV_LINKS = [
    { to: '/privacy', labelKey: 'privacy', namespace: 'legal' },
    { to: '/terms', labelKey: 'terms', namespace: 'legal' },
    { to: '/cookies', labelKey: 'cookies', namespace: 'legal' },
];
export function CompactFooter({ className, minimal = false }) {
    const t = useTranslations('footer');
    const tLegal = useTranslations('legal');
    const tNav = useTranslations('nav');
    const locale = useLocale();
    const currentYear = new Date().getFullYear();
    return (_jsxs("footer", { className: cn('relative w-full border-t border-zinc-100 bg-white/60 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/60', className), children: [_jsx("div", { className: "absolute top-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" }), _jsx("div", { className: 'mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8', children: _jsxs("div", { className: 'flex flex-col items-center justify-between gap-6 md:flex-row', children: [_jsxs("div", { className: 'flex flex-col items-center gap-4 md:items-start', children: [_jsxs(BaseLink, { to: '/', className: 'group flex items-center space-x-2', children: [_jsx(Logo, { size: 'sm', withIcon: true }), _jsx("span", { className: 'text-sm font-black tracking-tight text-zinc-900 transition-colors group-hover:text-blue-600 dark:text-white', children: "AKMLEVA" })] }), !minimal && (_jsxs("button", { className: "flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-zinc-500 transition-colors hover:text-blue-600 dark:text-zinc-400", children: [_jsx(Globe, { className: "h-3 w-3" }), _jsx("span", { children: locale === 'pt' ? 'Portugal (PT)' : 'Global (EN)' }), _jsx(ChevronUp, { className: "h-3 w-3 opacity-50" })] }))] }), _jsx("nav", { className: 'flex flex-wrap justify-center gap-x-8 gap-y-2 text-[13px] font-medium text-zinc-600 dark:text-zinc-400', "aria-label": "Rodap\u00E9 Legal", children: NAV_LINKS.map((link) => (_jsx(BaseLink, { to: link.to, className: 'relative py-1 transition-colors hover:text-blue-600 dark:hover:text-blue-400', children: link.namespace === 'legal'
                                    ? tLegal(link.labelKey)
                                    : tNav(link.labelKey) }, link.to))) }), _jsxs("div", { className: 'flex flex-col items-center gap-1.5 md:items-end', children: [_jsxs("p", { className: 'text-[12px] font-medium text-zinc-500 dark:text-zinc-500', children: ["\u00A9 ", currentYear, " ", _jsx("span", { className: "text-zinc-900 dark:text-zinc-200", children: "AKMLEVA" }), "."] }), _jsxs("div", { className: 'flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-400', children: [_jsx("span", { children: t('made_with') }), _jsx(motion.div, { animate: {
                                                scale: [1, 1.3, 1],
                                                filter: ["brightness(1)", "brightness(1.2)", "brightness(1)"]
                                            }, transition: { repeat: Infinity, duration: 2.5 }, children: _jsx(Heart, { className: "h-3 w-3 fill-red-500 text-red-500 shadow-sm" }) }), _jsx("span", { children: t('by_team') })] })] })] }) })] }));
}
// Keep exported for any consumers that call getFallback directly
export { getFallback };
//# sourceMappingURL=CompactFooter.js.map