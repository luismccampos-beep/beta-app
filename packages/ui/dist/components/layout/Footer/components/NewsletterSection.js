"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Sparkles, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '../../../ui/button';
import { Input } from '../../../ui/input';
import { cn } from '../../../../utils/index';
export function NewsletterSection({ showNewsletter = true }) {
    const t = useTranslations('footer');
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle');
    if (!showNewsletter)
        return null;
    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!email)
            return;
        setStatus('loading');
        // Simulação de subscrição em 2026
        setTimeout(() => setStatus('success'), 1500);
    };
    return (_jsxs("div", { className: 'relative flex flex-col gap-6', children: [_jsx("div", { className: 'flex items-center gap-3', children: _jsxs("div", { className: 'relative', children: [_jsx(Sparkles, { className: "h-5 w-5 text-accent absolute -top-2 -right-2 animate-pulse" }), _jsx("h3", { className: 'text-foreground font-bold text-xl tracking-tight', children: t('newsletterTitle') })] }) }), _jsx("p", { className: 'text-muted-foreground text-sm leading-relaxed max-w-[280px]', children: t('newsletterDescription') }), _jsxs("div", { className: "relative group", children: [_jsx("div", { className: "absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" }), _jsxs("form", { onSubmit: handleSubscribe, className: "relative flex flex-col gap-3 p-1", children: [_jsxs("div", { className: "relative flex items-center", children: [_jsx(Input, { type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: t('newsletterPlaceholder'), className: cn("h-12 pl-4 pr-14 bg-background/80 border-border", "rounded-xl focus:ring-2 focus:ring-primary/50 transition-all duration-300", "placeholder:text-muted-foreground text-foreground"), disabled: status === 'success' }), _jsx("div", { className: "absolute right-1", children: _jsx(Button, { type: "submit", disabled: status !== 'idle', className: cn("h-10 w-10 p-0 rounded-lg transition-all duration-500 shadow-lg", status === 'success'
                                                ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                                                : "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105"), children: _jsxs(AnimatePresence, { mode: "wait", children: [status === 'idle' && (_jsx(motion.div, { initial: { opacity: 0, x: -5 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 5 }, children: _jsx(ArrowRight, { className: "h-4 w-4" }) }, "idle")), status === 'loading' && (_jsx(motion.div, { animate: { rotate: 360 }, transition: { repeat: Infinity, duration: 1, ease: "linear" }, children: _jsx(Sparkles, { className: "h-4 w-4" }) }, "loading")), status === 'success' && (_jsx(motion.div, { initial: { scale: 0 }, animate: { scale: 1 }, className: "text-white", children: _jsx(Check, { className: "h-5 w-5" }) }, "success"))] }) }) })] }), _jsx(motion.p, { initial: false, animate: { opacity: status === 'success' ? 1 : 0.7 }, className: cn("text-[11px] px-1 transition-colors", status === 'success' ? "text-emerald-500 font-bold" : "text-muted-foreground"), children: status === 'success'
                                    ? t('newsletterSuccess')
                                    : t('newsletterPrivacy') })] })] })] }));
}
//# sourceMappingURL=NewsletterSection.js.map