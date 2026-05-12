"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { Award, Clock, CreditCard, Mail, MapPin, Phone, Shield } from 'lucide-react';
import { useTranslations } from 'next-intl';
import BaseLink from '../../../common/BaseLink';
import { Logo } from '../../../common/Logo';
import { cn } from '../../../../utils/index';
export function CompanyInfo() {
    const t = useTranslations();
    const tCommon = useTranslations('common');
    const features = [
        {
            icon: Shield,
            text: t('footer.features.security'),
            color: 'text-emerald-500'
        },
        {
            icon: Award,
            text: t('footer.features.certified'),
            color: 'text-amber-500'
        },
        {
            icon: Clock,
            text: t('footer.features.support'),
            color: 'text-sky-500'
        },
        {
            icon: CreditCard,
            text: t('footer.features.payments'),
            color: 'text-indigo-500'
        },
    ];
    // Variantes para animação em cascata
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };
    return (_jsxs(motion.div, { initial: "hidden", whileInView: "visible", viewport: { once: true }, variants: containerVariants, className: 'lg:col-span-2 flex flex-col', children: [_jsx(motion.div, { variants: itemVariants, className: 'mb-6', children: _jsx(BaseLink, { to: '/', className: 'inline-block group', children: _jsxs("div", { className: "flex items-center space-x-2 transition-transform duration-300 group-hover:scale-105", children: [_jsx(Logo, { size: 'md', withIcon: true }), _jsx("span", { className: "text-xl font-black tracking-tighter bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent", children: "AKMLEVA" })] }) }) }), _jsx(motion.p, { variants: itemVariants, className: 'text-muted-foreground mb-8 max-w-md text-sm leading-relaxed font-medium', children: t('company.slogan') }), _jsx(motion.div, { variants: itemVariants, className: 'space-y-3 mb-10', children: [
                    {
                        icon: Mail,
                        val: t('company.email'),
                        bgClass: 'bg-primary/10',
                        textClass: 'text-primary'
                    },
                    {
                        icon: Phone,
                        val: t('company.phone'),
                        bgClass: 'bg-secondary/10',
                        textClass: 'text-secondary'
                    },
                    {
                        icon: MapPin,
                        val: `${tCommon('address.city')}, ${tCommon('address.street')}`,
                        bgClass: 'bg-accent/10',
                        textClass: 'text-accent'
                    }
                ].map((contact, idx) => (_jsxs(motion.div, { whileHover: { x: 8 }, className: 'flex items-center group cursor-pointer w-fit', children: [_jsx("div", { className: cn("flex items-center justify-center p-2.5 rounded-xl transition-all duration-300", contact.bgClass, contact.textClass, "group-hover:shadow-lg group-hover:shadow-current/10"), children: _jsx(contact.icon, { className: 'h-4 w-4' }) }), _jsx("span", { className: "ml-4 text-sm font-semibold text-foreground/80 group-hover:text-primary transition-colors", children: contact.val })] }, idx))) }), _jsx(motion.div, { variants: itemVariants, className: 'grid grid-cols-2 gap-3 sm:max-w-md', children: features.map((feature, index) => (_jsxs(motion.div, { whileHover: { y: -3, backgroundColor: 'hsla(var(--primary-hsl), 0.05)' }, className: 'flex items-center space-x-3 p-3 rounded-2xl bg-accent/10 dark:bg-card/50 border border-border/50 transition-all', children: [_jsx("div", { className: cn("p-1.5 rounded-lg bg-card dark:bg-accent shadow-sm", feature.color), children: _jsx(feature.icon, { className: 'h-3.5 w-3.5' }) }), _jsx("span", { className: 'text-[11px] font-bold uppercase tracking-tight text-muted-foreground', children: feature.text })] }, index))) })] }));
}
//# sourceMappingURL=CompanyInfo.js.map