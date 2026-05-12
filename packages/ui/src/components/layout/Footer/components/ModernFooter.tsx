"use client";

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

import { cn } from '../../../../utils/index';
import {
    authenticatedSupportLinks,
    authenticatedUserLinks,
    getCompanyLinks,
    legalLinks,
    resourceLinks,
} from '../data/footerData';
import { BottomSection } from './BottomSection';
import { CompanyInfo } from './CompanyInfo';
import { FooterLinksColumn } from './FooterLinksColumn';
import { NewsletterSection } from './NewsletterSection';
import { PartnershipsSection } from './PartnershipsSection';

interface ModernFooterProps {
    showNewsletter?: boolean;
    showSocialLinks?: boolean;
}

export function ModernFooter({ showNewsletter = true, showSocialLinks = true }: ModernFooterProps) {
    const t = useTranslations('footer');

    // Atualizar dinamicamente os links do company baseado no domínio atual
    const companyLinks = useMemo(() => getCompanyLinks(), []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08, // Cascata mais rápida e profissional
                delayChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                damping: 20,
                stiffness: 100,
            },
        },
    };

    return (
        <motion.footer
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={containerVariants}
            className={cn(
                'relative w-full overflow-hidden border-t border-border/50',
                'bg-background/50 backdrop-blur-xl'
            )}
        >
            {/* 1. Elementos Decorativos de Fundo (Blur Blobs) */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary/10 blur-[120px] dark:bg-primary/20 dark:blur-[160px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-full bg-[url('/assets/grid.svg')] bg-center [mask-image:radial-gradient(white,transparent_85%)] opacity-20 dark:opacity-5" />
                <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-secondary/10 blur-[120px] dark:bg-accent/20 dark:blur-[160px]" />

                {/* Mesh Gradient Extra para Dark Mode */}
                <div className="absolute inset-0 opacity-0 dark:opacity-10 transition-opacity duration-1000 bg-[radial-gradient(circle_at_50%_50%,hsla(var(--primary-hsl),0.1)_0%,transparent_50%),radial-gradient(circle_at_80%_20%,hsla(var(--accent-hsl),0.1)_0%,transparent_50%)]" />
            </div>

            {/* 2. Barra Superior de Gradiente Neon */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent dark:via-primary/80" />
            <div className="absolute top-0 left-0 right-0 h-[10px] bg-primary/5 blur-sm opacity-0 dark:opacity-100 transition-opacity" />

            <div className='relative z-10 mx-auto max-w-[1920px] px-4 py-16 sm:px-6 lg:px-12'>

                {/* 3. Grelha de Conteúdo Principal */}
                <div className='grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-12 xl:gap-16'>

                    {/* Informação da Empresa (Spans 3 cols) */}
                    <motion.div variants={itemVariants} className="lg:col-span-3 bg-card/40 backdrop-blur-md rounded-3xl border border-border hover:border-border/80 transition-all duration-300 p-8 h-fit">
                        <CompanyInfo />
                    </motion.div>

                    {/* Colunas de Links (Agrupadas em 6 cols no total) */}
                    <div className="lg:col-span-6 bg-card/40 backdrop-blur-md rounded-3xl border border-border p-8 h-fit shadow-sm">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 items-start">
                            <motion.div variants={itemVariants}>
                                <FooterLinksColumn
                                    title={t('user.title') || 'Minha Conta'}
                                    titleKey="footer.user.title"
                                    links={authenticatedUserLinks}
                                    colorClass="blue"
                                />
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <FooterLinksColumn
                                    title={t('company.title') || 'Empresa'}
                                    titleKey="footer.company.title"
                                    links={companyLinks}
                                    colorClass="purple"
                                />
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <FooterLinksColumn
                                    title={t('support.title') || 'Suporte'}
                                    titleKey="footer.support.title"
                                    links={authenticatedSupportLinks}
                                    colorClass="pink"
                                />
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <FooterLinksColumn
                                    title={t('legalTitle') || 'Legal'}
                                    titleKey="footer.legalTitle"
                                    links={legalLinks}
                                    colorClass="orange"
                                />
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <FooterLinksColumn
                                    title={t('resources.title') || 'Recursos'}
                                    titleKey="footer.resources.title"
                                    links={resourceLinks}
                                    colorClass="teal"
                                />
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <PartnershipsSection />
                            </motion.div>
                        </div>
                    </div>

                    {/* Newsletter e Social (Spans 3 cols) */}
                    <motion.div variants={itemVariants} className="lg:col-span-3">
                        <div className="bg-card/40 backdrop-blur-md rounded-3xl border border-border hover:border-border/80 transition-all duration-300 p-8 h-fit shadow-sm">
                            <NewsletterSection
                                showNewsletter={showNewsletter}
                                showSocialLinks={showSocialLinks}
                            />
                        </div>
                    </motion.div>
                </div>

                {/* 4. Secção de Rodapé Final */}
                <motion.div variants={itemVariants} className="mt-16">
                    <BottomSection />
                </motion.div>
            </div>
        </motion.footer>
    );
}