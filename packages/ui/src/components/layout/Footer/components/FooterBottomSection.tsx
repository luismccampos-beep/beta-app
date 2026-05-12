"use client";

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

    return (
        <div className='relative mt-16 pt-10 border-t border-zinc-200 dark:border-zinc-800'>
            {/* Linha Decorativa com Efeito de Brilho */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />

            <div className="flex flex-col md:flex-row justify-between items-center gap-6">

                {/* Copyright com Tipografia Refinada */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="flex flex-col items-center md:items-start gap-1"
                >
                    <p className="text-[13px] font-medium text-zinc-500 dark:text-zinc-400">
                        © {currentYear} <span className="text-zinc-900 dark:text-zinc-100">AKMLEVA</span>.
                    </p>
                    <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
                        {t('allRightsReserved')}
                    </span>
                </motion.div>

                {/* Navegação Legal com Underline Animado */}
                <nav className="flex items-center gap-x-8">
                    {legalLinks.map((link) => (
                        <BaseLink
                            key={link.href}
                            to={link.href}
                            className="group relative text-sm font-semibold text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                        >
                            {t(link.labelKey)}
                            {/* Underline Moderno */}
                            <span className="absolute -bottom-1 left-0 h-[1.5px] w-0 bg-blue-600 transition-all duration-300 group-hover:w-full" />
                        </BaseLink>
                    ))}
                </nav>

                {/* Badges de Confiança ou Certificações (Opcional para 2026) */}
                <div className="hidden lg:flex items-center gap-4 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                    <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 mx-2" />
                    <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-400">
                        {t('securePayments')}
                    </span>
                </div>
            </div>
        </div>
    );
}