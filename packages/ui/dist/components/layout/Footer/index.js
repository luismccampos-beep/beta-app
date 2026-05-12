"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { getCompanyLinks, guestSupportLinks, guestUserLinks, productLinks, legalLinks, resourceLinks, } from './data/footerData';
import { CompactFooter } from './components/CompactFooter';
import { ModernFooter } from './components/ModernFooter';
import { TraditionalCompanyInfo } from './components/TraditionalCompanyInfo';
import { TraditionalFooterLinksColumn } from './components/TraditionalFooterLinksColumn';
import { NewsletterSection } from './components/NewsletterSection';
import { TraditionalPartnershipsSection } from './components/TraditionalPartnershipsSection';
import { FooterBottomSection } from './components/FooterBottomSection';
import { FooterLandscape } from './components/FooterLandscape';
function TraditionalFooter({ showNewsletter, hideNavigation }) {
    const t = useTranslations('footer');
    // Atualizar dinamicamente os links do company baseado no domínio atual
    const companyLinks = useMemo(() => getCompanyLinks(), []);
    return (_jsxs("footer", { className: 'relative w-full bg-background text-foreground border-t border-border/50 print:hidden overflow-hidden', children: [_jsx("div", { className: "absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[128px] pointer-events-none" }), _jsx("div", { className: "absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[128px] pointer-events-none" }), _jsxs("div", { className: 'relative w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-16 pb-8', children: [_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16 items-start", children: [_jsxs("div", { className: "lg:col-span-4 flex flex-col space-y-8", children: [_jsx("div", { className: "bg-card/40 backdrop-blur-md rounded-3xl p-8 border border-border hover:border-border/80 transition-all duration-300", children: _jsx(TraditionalCompanyInfo, {}) }), showNewsletter && (_jsx("div", { className: "bg-card/40 backdrop-blur-md rounded-3xl p-8 border border-border hover:border-border/80 transition-all duration-300", children: _jsx(NewsletterSection, {}) })), _jsx(TraditionalPartnershipsSection, {})] }), !hideNavigation && (_jsx("div", { className: "lg:col-span-8 bg-card/40 backdrop-blur-md rounded-3xl border border-border p-8 h-full", children: _jsxs("div", { className: 'grid grid-cols-1 sm:grid-cols-3 gap-12 items-start', children: [_jsxs("div", { className: "flex flex-col gap-10", children: [_jsx(TraditionalFooterLinksColumn, { title: t('guest.title') || 'Começar', titleKey: "footer.guest.title", links: guestUserLinks }), _jsx(TraditionalFooterLinksColumn, { title: t('support.title') || 'Suporte', titleKey: "footer.support.title", links: guestSupportLinks })] }), _jsxs("div", { className: "flex flex-col gap-10", children: [_jsx(TraditionalFooterLinksColumn, { title: t('product.title') || 'Serviços', titleKey: "footer.product.title", links: productLinks }), _jsx(TraditionalFooterLinksColumn, { title: t('resources.title') || 'Recursos', titleKey: "footer.resources.title", links: resourceLinks })] }), _jsxs("div", { className: "flex flex-col gap-10", children: [_jsx(TraditionalFooterLinksColumn, { title: t('company.title') || 'Empresa', titleKey: "footer.company.title", links: companyLinks }), _jsx(TraditionalFooterLinksColumn, { title: t('legalTitle') || 'Legal', titleKey: "footer.legalTitle", links: legalLinks })] })] }) }))] }), _jsx(FooterBottomSection, {})] })] }));
}
function Footer({ showNewsletter = true, showSocialLinks = true, compactMode = false, isAuthenticated = false, hideNavigation = false, }) {
    if (compactMode) {
        return (_jsx(CompactFooter, { showSocialLinks: showSocialLinks, minimal: compactMode }));
    }
    if (isAuthenticated) {
        return (_jsx(ModernFooter, { showNewsletter: showNewsletter, showSocialLinks: showSocialLinks }));
    }
    return _jsx(TraditionalFooter, { showNewsletter: showNewsletter, hideNavigation: hideNavigation });
}
export default Footer;
export { FooterLandscape };
//# sourceMappingURL=index.js.map