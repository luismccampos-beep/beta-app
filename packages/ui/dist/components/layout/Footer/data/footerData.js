import { Facebook, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react';
// Função utilitária para gerar o link de admin baseado no domínio atual
export const getAdminLink = () => {
    if (typeof window !== 'undefined') {
        const currentDomain = window.location.hostname;
        if (currentDomain.includes('beta.')) {
            return 'https://beta.admin.akmleva.pt';
        }
        else if (currentDomain.includes('admin.')) {
            // Se já estiver no admin, mantém o mesmo domínio
            return `https://${currentDomain}`;
        }
        else {
            return 'https://admin.akmleva.pt';
        }
    }
    // Fallback para SSR ou ambiente desconhecido
    return 'https://admin.akmleva.pt';
};
export const authenticatedUserLinks = [
    { nameKey: 'nav:user.profile', href: '/preferences' },
    { nameKey: 'nav:user.trips', href: '/minhas-reservas' },
    { nameKey: 'nav:user.wishlist', href: '/pacotes' },
    { nameKey: 'nav:user.settings', href: '/preferences' },
];
export const getCompanyLinks = () => [
    { nameKey: 'nav:about', href: '/about' },
    { nameKey: 'footer:company.careers', href: '/careers' },
    { nameKey: 'footer:company.press', href: '/press' },
    { nameKey: 'footer:company.admin', href: getAdminLink(), external: true },
];
// Manter compatibilidade com código existente
export const companyLinks = getCompanyLinks();
export const authenticatedSupportLinks = [
    { nameKey: 'footer:support.help', href: '/help-center' },
    { nameKey: 'nav:faq', href: '/help#faq' },
];
export const guestUserLinks = [
    { nameKey: 'nav:auth.login', href: '/auth/signin' },
    { nameKey: 'nav:auth.register', href: '/auth/signup' },
];
export const guestSupportLinks = [
    { nameKey: 'footer:support.help', href: '/help-center' },
];
export const productLinks = [
    { nameKey: 'nav:community', href: '/community' },
    { nameKey: 'nav:destinations', href: '/destinos' },
    { nameKey: 'nav:packages', href: '/pacotes' },
    { nameKey: 'nav:hotels', href: '/hotels' },
    { nameKey: 'nav:flights', href: '/flights' },
    { nameKey: 'nav:rent_a_car', href: '/rent-a-car' },
    { nameKey: 'nav:activities', href: '/activities' },
    { nameKey: 'nav:cruises', href: '/cruzeiros' },
    { nameKey: 'footer:services.insurance', href: '/insurance' },
    { nameKey: 'nav:transfers', href: '/transfers' },
];
export const socialLinks = [
    { name: 'Facebook', href: 'https://facebook.com', icon: Facebook, color: '#1877F2' },
    { name: 'Twitter', href: 'https://twitter.com', icon: Twitter, color: '#1DA1F2' },
    { name: 'Instagram', href: 'https://instagram.com', icon: Instagram, color: '#E4405F' },
    { name: 'LinkedIn', href: 'https://linkedin.com', icon: Linkedin, color: '#0A66C2' },
    { name: 'YouTube', href: 'https://youtube.com', icon: Youtube, color: '#FF0000' },
];
export const legalLinks = [
    { nameKey: 'legal:hero.terms', href: '/terms' },
    { nameKey: 'legal:hero.privacy', href: '/privacy' },
    { nameKey: 'legal:hero.cookies', href: '/cookies' },
    { nameKey: 'legal:hero.gdpr', href: '/gdpr' },
    { nameKey: 'legal:hero.cancellation', href: '/cancelation' },
];
export const resourceLinks = [
    { nameKey: 'footer:blogTitle', href: '/artigos' },
    { nameKey: 'newsletter:title', href: '/newsletter' },
];
//# sourceMappingURL=footerData.js.map