"use client";

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

import { cn } from '../../../../utils';
import BaseLink from '../../../common/BaseLink';
import type { NavLinkItem } from '../data/footerData';

interface TraditionalFooterLinksColumnProps {
    title: string;
    titleKey: string;
    links: NavLinkItem[];
    className?: string;
}

export function TraditionalFooterLinksColumn({
    title,
    titleKey,
    links,
    className
}: TraditionalFooterLinksColumnProps) {
    const tFooter = useTranslations('footer');
    const tNav = useTranslations('nav');
    const tLegal = useTranslations('legal');
    const tCommon = useTranslations('common');
    const tNewsletter = useTranslations('newsletter');
    const tHelp = useTranslations('help');
    const tRoot = useTranslations();

    const t = (key: string): string => {
        if (!key) return '';

        if (key.includes(':')) {
            const [ns, rawKey] = key.split(':', 2);

            const value =
                ns === 'footer'
                    ? (() => { try { return tFooter(rawKey); } catch { return rawKey; } })()
                    : ns === 'nav'
                        ? (() => { try { return tNav(rawKey); } catch { return rawKey; } })()
                        : ns === 'legal'
                            ? (() => { try { return tLegal(rawKey); } catch { return rawKey; } })()
                            : ns === 'common'
                                ? (() => { try { return tCommon(rawKey); } catch { return rawKey; } })()
                                : ns === 'newsletter'
                                    ? (() => { try { return tNewsletter(rawKey); } catch { return rawKey; } })()
                                    : ns === 'help'
                                        ? (() => { try { return tHelp(rawKey); } catch { return rawKey; } })()
                                        : (() => { try { return tRoot(key.replace(':', '.')); } catch { return rawKey; } })();

            return value !== rawKey && value !== key ? value : rawKey;
        }

        try {
            const value = tRoot(key);
            return value !== key ? value : key;
        } catch {
            return key;
        }
    };

    return (
        <div className={cn("flex flex-col", className)}>
            {/* Título com Tipografia Editorial */}
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-900 dark:text-zinc-100 mb-4">
                {t(titleKey) || title}
                <span className="mt-2 block h-0.5 w-6 bg-blue-600 rounded-full" />
            </h3>

            {/* Lista de Navegação Segura */}
            <ul className="flex flex-col space-y-3.5" role="list">
                {links.map((link: NavLinkItem, idx) => {
                    const translatedLabel = t(link.nameKey) || '';

                    return (
                        <motion.li
                            key={link.href + idx}
                            whileHover={{ x: 4 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                            <BaseLink
                                to={link.href}
                                className={cn(
                                    "group relative flex items-center text-[14px] font-medium transition-all duration-300",
                                    "text-zinc-500 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400"
                                )}
                            >
                                {translatedLabel}

                                {/* Indicador de Link Externo se aplicável */}
                                {link.external && (
                                    <span className="ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity text-[10px]">
                                        ↗
                                    </span>
                                )}

                                {/* Badge para links em destaque (ex: Novidades) */}
                                {link.badge && (
                                    <span className="ml-2 rounded-full bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 text-[10px] font-bold text-blue-600 dark:text-blue-400">
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
