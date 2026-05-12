"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import BaseLink from '../../../common/BaseLink';
export function FooterBottomSection() {
    const t = useTranslations('footer');
    const currentYear = new Date().getFullYear();
    const legalLinks = [
        { href: "/privacy", labelKey: 'privacy' },
        { href: "/terms", labelKey: 'terms' },
        { href: "/cookies", labelKey: 'cookies' }
    ];
    return (_jsxs("div", { className: 'relative mt-16 pt-10 border-t border-zinc-200 dark:border-zinc-800', children: [_jsx("div", { className: "absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" }), _jsxs("div", { className: "flex flex-col md:flex-row justify-between items-center gap-6", children: [_jsxs(motion.div, { initial: { opacity: 0 }, whileInView: { opacity: 1 }, className: "flex flex-col items-center md:items-start gap-1", children: [_jsxs("p", { className: "text-[13px] font-medium text-zinc-500 dark:text-zinc-400", children: ["\u00A9 ", currentYear, " ", _jsx("span", { className: "text-zinc-900 dark:text-zinc-100", children: "AKMLEVA" }), "."] }), _jsx("span", { className: "text-[11px] text-zinc-400 dark:text-zinc-500", children: t('allRightsReserved') })] }), _jsx("nav", { className: "flex items-center gap-x-8", children: legalLinks.map((link) => (_jsxs(BaseLink, { to: link.href, className: "group relative text-sm font-semibold text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100", children: [t(link.labelKey), _jsx("span", { className: "absolute -bottom-1 left-0 h-[1.5px] w-0 bg-blue-600 transition-all duration-300 group-hover:w-full" })] }, link.href))) }), _jsxs("div", { className: "hidden lg:flex items-center gap-4 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500", children: [_jsx("div", { className: "h-6 w-px bg-zinc-200 dark:bg-zinc-800 mx-2" }), _jsx("span", { className: "text-[10px] font-bold tracking-widest uppercase text-zinc-400", children: t('securePayments') })] })] })] }));
}
//# sourceMappingURL=FooterBottomSection.js.map