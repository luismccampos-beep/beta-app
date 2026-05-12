"use client";

import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

import {
    getCompanyLinks,
    guestSupportLinks,
    guestUserLinks,
    productLinks,
    legalLinks,
    resourceLinks,
} from './data/footerData';
import { CompactFooter } from './components/CompactFooter';
import { ModernFooter } from './components/ModernFooter';
import { TraditionalCompanyInfo } from './components/TraditionalCompanyInfo';
import { TraditionalFooterLinksColumn } from './components/TraditionalFooterLinksColumn';
import { NewsletterSection } from './components/NewsletterSection';
import { TraditionalPartnershipsSection } from './components/TraditionalPartnershipsSection';
import { FooterBottomSection } from './components/FooterBottomSection';
import { FooterLandscape } from './components/FooterLandscape';

interface UnifiedFooterProps {
    showNewsletter?: boolean;
    showSocialLinks?: boolean;
    compactMode?: boolean;
    isAuthenticated?: boolean;
    hideNavigation?: boolean;
}

function TraditionalFooter({ showNewsletter, hideNavigation }: { 
    showNewsletter: boolean; 
    hideNavigation?: boolean 
}) {
    const t = useTranslations('footer');
    
    // Atualizar dinamicamente os links do company baseado no domínio atual
    const companyLinks = useMemo(() => getCompanyLinks(), []);

    return (
        <footer className='relative w-full bg-background text-foreground border-t border-border/50 print:hidden overflow-hidden'>
            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[128px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[128px] pointer-events-none" />

            <div className='relative w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-16 pb-8'>
                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16 items-start">
                    {/* Left: Brand & Newsletter (Spans 4) */}
                    <div className="lg:col-span-4 flex flex-col space-y-8">
                        <div className="bg-card/40 backdrop-blur-md rounded-3xl p-8 border border-border hover:border-border/80 transition-all duration-300">
                            <TraditionalCompanyInfo />
                        </div>

                        {showNewsletter && (
                            <div className="bg-card/40 backdrop-blur-md rounded-3xl p-8 border border-border hover:border-border/80 transition-all duration-300">
                                <NewsletterSection />
                            </div>
                        )}

                        <TraditionalPartnershipsSection />
                    </div>

                    {/* Right: Navigation Links (Spans 8) */}
                    {!hideNavigation && (
                        <div className="lg:col-span-8 bg-card/40 backdrop-blur-md rounded-3xl border border-border p-8 h-full">
                            <div className='grid grid-cols-1 sm:grid-cols-3 gap-12 items-start'>
                                {/* Column 1: Platform & Support */}
                                <div className="flex flex-col gap-10">
                                    <TraditionalFooterLinksColumn
                                        title={t('guest.title') || 'Começar'}
                                        titleKey="footer.guest.title"
                                        links={guestUserLinks}
                                    />
                                    <TraditionalFooterLinksColumn
                                        title={t('support.title') || 'Suporte'}
                                        titleKey="footer.support.title"
                                        links={guestSupportLinks}
                                    />
                                </div>

                                {/* Column 2: Product & Resources */}
                                <div className="flex flex-col gap-10">
                                    <TraditionalFooterLinksColumn
                                        title={t('product.title') || 'Serviços'}
                                        titleKey="footer.product.title"
                                        links={productLinks}
                                    />
                                    <TraditionalFooterLinksColumn
                                        title={t('resources.title') || 'Recursos'}
                                        titleKey="footer.resources.title"
                                        links={resourceLinks}
                                    />
                                </div>

                                {/* Column 3: Company & Legal */}
                                <div className="flex flex-col gap-10">
                                    <TraditionalFooterLinksColumn
                                        title={t('company.title') || 'Empresa'}
                                        titleKey="footer.company.title"
                                        links={companyLinks}
                                    />
                                    <TraditionalFooterLinksColumn
                                        title={t('legalTitle') || 'Legal'}
                                        titleKey="footer.legalTitle"
                                        links={legalLinks}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Bottom Section: Copyright & Socials */}
                <FooterBottomSection />
            </div>
        </footer>
    );
}

function Footer({
    showNewsletter = true,
    showSocialLinks = true,
    compactMode = false,
    isAuthenticated = false,
    hideNavigation = false,
}: UnifiedFooterProps) {
    if (compactMode) {
        return (
            <CompactFooter
                showSocialLinks={showSocialLinks}
                minimal={compactMode}
            />
        );
    }

    if (isAuthenticated) {
        return (
            <ModernFooter
                showNewsletter={showNewsletter}
                showSocialLinks={showSocialLinks}
            />
        );
    }

    return <TraditionalFooter showNewsletter={showNewsletter} hideNavigation={hideNavigation} />;
}

export default Footer;
export { FooterLandscape };