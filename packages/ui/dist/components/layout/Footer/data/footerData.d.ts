import type { LucideIcon } from 'lucide-react';
export declare const getAdminLink: () => string;
export interface NavLinkItem {
    nameKey: string;
    href: string;
    label?: string;
    external?: boolean;
    badge?: string;
}
export interface SocialLinkItem {
    name: string;
    href: string;
    icon: LucideIcon;
    color: string;
}
export declare const authenticatedUserLinks: NavLinkItem[];
export declare const getCompanyLinks: () => NavLinkItem[];
export declare const companyLinks: NavLinkItem[];
export declare const authenticatedSupportLinks: NavLinkItem[];
export declare const guestUserLinks: NavLinkItem[];
export declare const guestSupportLinks: NavLinkItem[];
export declare const productLinks: NavLinkItem[];
export declare const socialLinks: SocialLinkItem[];
export declare const legalLinks: NavLinkItem[];
export declare const resourceLinks: NavLinkItem[];
