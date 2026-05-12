"use client";

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ExternalLink } from 'lucide-react';

import { cn } from '../../../../utils';
import BaseLink from '../../../common/BaseLink';
import type { NavLinkItem } from '../data/footerData';

// Mapeamento de cores seguro para Tailwind (evita classes dinâmicas quebradas)
const colorVariants = {
    blue: "text-primary bg-primary border-primary",
    purple: "text-secondary bg-secondary border-secondary",
    pink: "text-accent bg-accent border-accent",
    orange: "text-orange-500 bg-orange-500 border-orange-500",
    teal: "text-emerald-500 bg-emerald-500 border-emerald-500",
};

interface FooterLinksColumnProps {
    title: string;
    titleKey: string;
    links: NavLinkItem[];
    colorClass: keyof typeof colorVariants;
    className?: string;
}

export function FooterLinksColumn({
    title,
    titleKey,
    links,
    colorClass,
    className
}: FooterLinksColumnProps) {
    const tFooter = useTranslations('footer');
    const tNav = useTranslations('nav');
    const tLegal = useTranslations('legal');
    const tCommon = useTranslations('common');
    const tRoot = useTranslations();

    const t = (key: string): string => {
        if (!key) return '';

        if (key.includes(':')) {
            const [ns, rawKey] = key.split(':', 2);

            const value =
                ns === 'footer'
                    ? tFooter(rawKey)
                    : ns === 'nav'
                        ? tNav(rawKey)
                        : ns === 'legal'
                            ? tLegal(rawKey)
                            : ns === 'common'
                                ? tCommon(rawKey)
                                : tRoot(key);

            return value !== rawKey && value !== key ? value : '';
        }

        const value = tRoot(key);
        return value !== key ? value : '';
    };

    // eslint-disable-next-line security/detect-object-injection
    const activeColor = colorVariants[colorClass];

    return (
        <div className={cn("flex flex-col", className)}>
            {/* Título com Tipografia Editorial e Underline Animado */}
            <h3 className="group relative inline-block text-sm font-bold uppercase tracking-[0.15em] text-foreground mb-6">
                {t(titleKey) || title}
                <span className={cn(
                    "absolute -bottom-2 left-0 h-[3px] w-6 rounded-full transition-all duration-500 group-hover:w-full",
                    activeColor.split(' ').pop() // Pega apenas a classe de BG
                )} />
            </h3>

            {/* Lista de Navegação */}
            <ul className="flex flex-col space-y-3.5" role="list">
                {links.map((link: NavLinkItem, idx) => {
                    const translatedLabel = t(link.nameKey) || link.label || '';

                    return (
                        <motion.li
                            key={link.href + idx}
                            whileHover={{ x: 4 }}
                            transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        >
                            <BaseLink
                                to={link.href}
                                className={cn(
                                    "group flex items-center text-[14px] font-medium transition-colors",
                                    "text-muted-foreground hover:text-foreground",
                                    // Aplica a cor temática no hover usando seletores arbitrários seguros
                                    `hover:!${activeColor.split(' ')[0]}`
                                )}
                            >
                                {/* Indicador Visual (Traço) */}
                                <span className={cn(
                                    "h-[1.5px] w-0 opacity-0 transition-all duration-300 group-hover:w-3 group-hover:opacity-100 mr-0 group-hover:mr-2 rounded-full",
                                    activeColor.split(' ').find(c => c.startsWith('bg-'))
                                )} />

                                <span className="relative">
                                    {translatedLabel}

                                    {/* Link Externo Indicator */}
                                    {link.external && (
                                        <ExternalLink className="ml-1 inline-block h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    )}
                                </span>

                                {/* Badge de Destaque (ex: "Beta" ou "Novo") */}
                                {link.badge && (
                                    <span className={cn(
                                        "ml-2 rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-tighter",
                                        "bg-muted text-muted-foreground"
                                    )}>
                                        {link.badge}
                                    </span>
                                )}
                            </BaseLink>
                        </motion.li>
                    );
                })}
            </ul>
        </div>
    );
}