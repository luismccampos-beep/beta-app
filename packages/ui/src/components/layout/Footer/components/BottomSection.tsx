"use client";

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

    return (
        <div className="mt-12 w-full">
            {/* Separador com Efeito de Brilho em 2026 */}
            <div className="relative h-px w-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-border to-transparent" />
                <motion.div
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                    className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-primary/10 to-transparent"
                />
            </div>

            <div className="py-8">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className='flex flex-col items-center justify-between gap-6 md:flex-row'
                >
                    {/* Links Legais com Underline Animado */}
                    <nav className='flex flex-wrap justify-center gap-x-6 gap-y-2' aria-label="Navegação Legal">
                        {legalLinks.map((link) => (
                            <BaseLink
                                key={link.href}
                                to={link.href}
                                className='group relative text-[13px] font-medium text-muted-foreground transition-colors hover:text-primary'
                            >
                                {link.labelKey.startsWith('hero.')
                                    ? tLegal(link.labelKey, { fallback: link.fallback })
                                    : t(link.labelKey, { fallback: link.fallback })
                                }
                                <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-primary/60 transition-all duration-300 group-hover:w-full" />
                            </BaseLink>
                        ))}
                    </nav>

                    {/* Controlos de Sistema (Idioma & Topo) */}
                    <div className='flex items-center gap-3'>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className='flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground transition-all hover:border-primary/50 hover:text-primary hover:bg-primary/5 shadow-sm'
                        >
                            <Globe className='h-3.5 w-3.5' />
                            <span>{locale.toUpperCase()} (PT)</span>
                        </motion.button>

                        <Button
                            variant='ghost'
                            size='sm'
                            onClick={scrollToTop}
                            className='group flex h-9 items-center gap-2 rounded-full px-4 text-xs font-bold uppercase tracking-widest transition-all hover:bg-primary/10 hover:text-primary'
                        >
                            <ArrowUp className='h-3.5 w-3.5 transition-transform group-hover:-translate-y-1' />
                            <span className='hidden sm:inline'>{t('backToTop', { fallback: 'Topo' })}</span>
                        </Button>
                    </div>
                </motion.div>

                {/* Copyright Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className='mt-10 flex flex-col items-center justify-center gap-3 border-t border-border/50 pt-8 text-center'
                >
                    <div className="flex items-center gap-2 text-[13px] font-medium text-muted-foreground">
                        <ShieldCheck className="h-4 w-4 text-emerald-500" />
                        <p>© {currentYear} <span className="font-bold text-foreground">AKMLEVA</span>. {t('rights', { fallback: 'Todos os direitos reservados.' })}</p>
                    </div>

                    <div className='flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50'>
                        <span>{t('made_with', { fallback: 'Crafted with' })}</span>
                        <motion.div
                            animate={{
                                scale: [1, 1.25, 1],
                                opacity: [0.8, 1, 0.8]
                            }}
                            transition={{ repeat: Infinity, duration: 2 }}
                        >
                            <Heart className='h-3.5 w-3.5 fill-red-500 text-red-500 shadow-sm' />
                        </motion.div>
                        <span>{t('by_team', { fallback: 'by AKMLEVA AI' })}</span>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}