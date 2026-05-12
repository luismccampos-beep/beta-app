"use client";

import { motion } from 'framer-motion';
import { Heart, Globe, ChevronUp } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import BaseLink from '../../../common/BaseLink';
import { Logo } from '../../../common/Logo';
import { cn } from '../../../../utils/index';

interface CompactFooterProps {
    showSocialLinks?: boolean;
    className?: string;
    /** Versão simplificada para modais ou checkouts */
    minimal?: boolean;
}

// Defined at module level — static map, no dynamic key access at runtime
const LINK_FALLBACKS = new Map<string, string>([
    ['privacy', 'Privacidade'],
    ['terms',   'Termos'     ],
    ['cookies', 'Cookies'    ],
]);

function getFallback(key: string): string {
    return LINK_FALLBACKS.get(key) ?? key;
}

const NAV_LINKS = [
    { to: '/privacy',  labelKey: 'privacy', namespace: 'legal' as const },
    { to: '/terms',    labelKey: 'terms',   namespace: 'legal' as const },
    { to: '/cookies',  labelKey: 'cookies', namespace: 'legal' as const },
] as const;

export function CompactFooter({
    className,
    minimal = false
}: CompactFooterProps) {
    const t      = useTranslations('footer');
    const tLegal = useTranslations('legal');
    const tNav   = useTranslations('nav');
    const locale = useLocale();

    const currentYear = new Date().getFullYear();

    return (
        <footer className={cn(
            'relative w-full border-t border-zinc-100 bg-white/60 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/60',
            className
        )}>
            {/* Detalhe Superior: Linha de gradiente de progresso ou marca */}
            <div className="absolute top-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />

            <div className='mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8'>
                <div className='flex flex-col items-center justify-between gap-6 md:flex-row'>

                    {/* Lado Esquerdo: Brand & Locale */}
                    <div className='flex flex-col items-center gap-4 md:items-start'>
                        <BaseLink to='/' className='group flex items-center space-x-2'>
                            <Logo size='sm' withIcon />
                            <span className='text-sm font-black tracking-tight text-zinc-900 transition-colors group-hover:text-blue-600 dark:text-white'>
                                AKMLEVA
                            </span>
                        </BaseLink>

                        {!minimal && (
                            <button className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-zinc-500 transition-colors hover:text-blue-600 dark:text-zinc-400">
                                <Globe className="h-3 w-3" />
                                <span>{locale === 'pt' ? 'Portugal (PT)' : 'Global (EN)'}</span>
                                <ChevronUp className="h-3 w-3 opacity-50" />
                            </button>
                        )}
                    </div>

                    {/* Centro: Links de Navegação Secundária */}
                    <nav
                        className='flex flex-wrap justify-center gap-x-8 gap-y-2 text-[13px] font-medium text-zinc-600 dark:text-zinc-400'
                        aria-label="Rodapé Legal"
                    >
                        {NAV_LINKS.map((link) => (
                            <BaseLink
                                key={link.to}
                                to={link.to}
                                className='relative py-1 transition-colors hover:text-blue-600 dark:hover:text-blue-400'
                            >
                                {link.namespace === 'legal'
                                    ? tLegal(link.labelKey)
                                    : tNav(link.labelKey)
                                }
                            </BaseLink>
                        ))}
                    </nav>

                    {/* Lado Direito: Credits */}
                    <div className='flex flex-col items-center gap-1.5 md:items-end'>
                        <p className='text-[12px] font-medium text-zinc-500 dark:text-zinc-500'>
                            © {currentYear} <span className="text-zinc-900 dark:text-zinc-200">AKMLEVA</span>.
                        </p>

                        <div className='flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-400'>
                            <span>{t('made_with')}</span>
                            <motion.div
                                animate={{
                                    scale: [1, 1.3, 1],
                                    filter: ["brightness(1)", "brightness(1.2)", "brightness(1)"]
                                }}
                                transition={{ repeat: Infinity, duration: 2.5 }}
                            >
                                <Heart className="h-3 w-3 fill-red-500 text-red-500 shadow-sm" />
                            </motion.div>
                            <span>{t('by_team')}</span>
                        </div>
                    </div>

                </div>
            </div>
        </footer>
    );
}

// Keep exported for any consumers that call getFallback directly
export { getFallback };