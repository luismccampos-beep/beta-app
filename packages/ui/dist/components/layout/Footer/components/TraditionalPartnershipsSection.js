"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { Award, Building2, ShieldCheck, Globe, CheckCircle2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '../../../../utils/index';
export function TraditionalPartnershipsSection() {
    const t = useTranslations('footer');
    const partners = [
        { name: 'IATA', icon: Building2, color: 'text-blue-500', glow: 'shadow-blue-500/20' },
        { name: 'TripAdvisor', icon: Award, color: 'text-emerald-500', glow: 'shadow-emerald-500/20' },
        { name: 'SSL Secure', icon: ShieldCheck, color: 'text-cyan-400', glow: 'shadow-cyan-400/20' },
        { name: 'GEA Group', icon: Globe, color: 'text-violet-500', glow: 'shadow-violet-500/20' },
    ];
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.12 }
        }
    };
    const itemVariants = {
        hidden: { opacity: 0, scale: 0.9, y: 10 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { type: 'spring', stiffness: 260, damping: 20 }
        }
    };
    return (_jsxs("div", { className: 'flex flex-col gap-8', children: [_jsxs("div", { className: 'group inline-flex flex-col gap-2', children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(CheckCircle2, { className: "h-4 w-4 text-blue-600 dark:text-blue-400" }), _jsx("h4", { className: 'text-zinc-900 dark:text-zinc-100 font-black text-[11px] uppercase tracking-[0.3em]', children: t('partnersTitle') })] }), _jsx("div", { className: 'relative h-[2px] w-12 overflow-hidden bg-zinc-200 dark:bg-zinc-800 rounded-full', children: _jsx(motion.div, { className: 'absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600', initial: { x: '-100%' }, whileInView: { x: '100%' }, transition: { repeat: Infinity, duration: 3, ease: "linear" } }) })] }), _jsx(motion.div, { variants: containerVariants, initial: "hidden", whileInView: "visible", viewport: { once: true }, className: "flex flex-wrap gap-3 sm:gap-4", children: partners.map((partner) => (_jsxs(motion.div, { variants: itemVariants, whileHover: {
                        y: -5,
                        boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)"
                    }, className: cn("group relative flex w-full items-center gap-4 px-5 py-3 rounded-2xl border transition-all duration-500 sm:flex-1 sm:min-w-[220px] lg:flex-none", "bg-white/50 dark:bg-zinc-900/40 backdrop-blur-md border-zinc-200/60 dark:border-zinc-800/60", "hover:border-blue-500/50 dark:hover:border-blue-400/30 hover:bg-blue-500/5 dark:hover:bg-blue-400/5"), children: [_jsx("div", { className: cn("relative flex items-center justify-center p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 shadow-inner transition-transform group-hover:rotate-[360deg] duration-700", partner.glow), children: _jsx(partner.icon, { className: cn("h-4 w-4 relative z-10", partner.color) }) }), _jsxs("div", { className: "flex flex-col", children: [_jsx("span", { className: "text-[10px] font-black tracking-widest text-zinc-800 dark:text-zinc-200 uppercase", children: partner.name }), _jsx("span", { className: "text-[8px] text-zinc-400 uppercase tracking-tighter", children: t('verifiedProvider') })] })] }, partner.name))) }), _jsxs("div", { className: "flex items-center gap-2 opacity-60", children: [_jsx("div", { className: "h-px w-4 bg-zinc-300 dark:bg-zinc-700" }), _jsx("p", { className: "text-[9px] text-zinc-500 dark:text-zinc-400 font-medium tracking-wide", children: t('partnersDisclaimer') })] })] }));
}
//# sourceMappingURL=TraditionalPartnershipsSection.js.map