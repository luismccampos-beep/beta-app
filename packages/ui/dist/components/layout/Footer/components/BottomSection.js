"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { ArrowUp, Globe, Heart, ShieldCheck } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import BaseLink from '../../../common/BaseLink';
import { Button } from '../../../Button';
export function BottomSection() {
    const t = useTranslations('footer');
    const tLegal = useTranslations('legal');
    const locale = useLocale();
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const currentYear = new Date().getFullYear(); // Dinâmico para 2026
    const legalLinks = [
        { href: '/privacy', labelKey: 'hero.privacy', fallback: 'Privacidade' },
        { href: '/terms', labelKey: 'hero.terms', fallback: 'Termos' },
        { href: '/cookies', labelKey: 'hero.cookies', fallback: 'Cookies' },
        { href: '/gdpr', labelKey: 'hero.gdpr', fallback: 'RGPD' },
        { href: '/security', labelKey: 'legal.security', fallback: 'Segurança' },
        { href: '/cancelation', labelKey: 'hero.cancellation', fallback: 'Cancelamento' },
    ];
    return (_jsxs("div", { className: "mt-12 w-full", children: [_jsxs("div", { className: "relative h-px w-full overflow-hidden", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-transparent via-border to-transparent" }), _jsx(motion.div, { animate: { x: ['-100%', '100%'] }, transition: { repeat: Infinity, duration: 3, ease: "linear" }, className: "absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-primary/10 to-transparent" })] }), _jsxs("div", { className: "py-8", children: [_jsxs(motion.div, { initial: { opacity: 0, y: 10 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, className: 'flex flex-col items-center justify-between gap-6 md:flex-row', children: [_jsx("nav", { className: 'flex flex-wrap justify-center gap-x-6 gap-y-2', "aria-label": "Navega\u00E7\u00E3o Legal", children: legalLinks.map((link) => (_jsxs(BaseLink, { to: link.href, className: 'group relative text-[13px] font-medium text-muted-foreground transition-colors hover:text-primary', children: [link.labelKey.startsWith('hero.')
                                            ? tLegal(link.labelKey, { fallback: link.fallback })
                                            : t(link.labelKey, { fallback: link.fallback }), _jsx("span", { className: "absolute -bottom-1 left-0 h-[2px] w-0 bg-primary/60 transition-all duration-300 group-hover:w-full" })] }, link.href))) }), _jsxs("div", { className: 'flex items-center gap-3', children: [_jsxs(motion.button, { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, className: 'flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground transition-all hover:border-primary/50 hover:text-primary hover:bg-primary/5 shadow-sm', children: [_jsx(Globe, { className: 'h-3.5 w-3.5' }), _jsxs("span", { children: [locale.toUpperCase(), " (PT)"] })] }), _jsxs(Button, { variant: 'ghost', size: 'sm', onClick: scrollToTop, className: 'group flex h-9 items-center gap-2 rounded-full px-4 text-xs font-bold uppercase tracking-widest transition-all hover:bg-primary/10 hover:text-primary', children: [_jsx(ArrowUp, { className: 'h-3.5 w-3.5 transition-transform group-hover:-translate-y-1' }), _jsx("span", { className: 'hidden sm:inline', children: t('backToTop', { fallback: 'Topo' }) })] })] })] }), _jsxs(motion.div, { initial: { opacity: 0 }, whileInView: { opacity: 1 }, transition: { delay: 0.3 }, className: 'mt-10 flex flex-col items-center justify-center gap-3 border-t border-border/50 pt-8 text-center', children: [_jsxs("div", { className: "flex items-center gap-2 text-[13px] font-medium text-muted-foreground", children: [_jsx(ShieldCheck, { className: "h-4 w-4 text-emerald-500" }), _jsxs("p", { children: ["\u00A9 ", currentYear, " ", _jsx("span", { className: "font-bold text-foreground", children: "AKMLEVA" }), ". ", t('rights', { fallback: 'Todos os direitos reservados.' })] })] }), _jsxs("div", { className: 'flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50', children: [_jsx("span", { children: t('made_with', { fallback: 'Crafted with' }) }), _jsx(motion.div, { animate: {
                                            scale: [1, 1.25, 1],
                                            opacity: [0.8, 1, 0.8]
                                        }, transition: { repeat: Infinity, duration: 2 }, children: _jsx(Heart, { className: 'h-3.5 w-3.5 fill-red-500 text-red-500 shadow-sm' }) }), _jsx("span", { children: t('by_team', { fallback: 'by AKMLEVA AI' }) })] })] })] })] }));
}
//# sourceMappingURL=BottomSection.js.map