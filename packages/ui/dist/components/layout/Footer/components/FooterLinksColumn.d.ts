import type { NavLinkItem } from '../data/footerData';
declare const colorVariants: {
    blue: string;
    purple: string;
    pink: string;
    orange: string;
    teal: string;
};
interface FooterLinksColumnProps {
    title: string;
    titleKey: string;
    links: NavLinkItem[];
    colorClass: keyof typeof colorVariants;
    className?: string;
}
export declare function FooterLinksColumn({ title, titleKey, links, colorClass, className }: FooterLinksColumnProps): import("react/jsx-runtime").JSX.Element;
export {};
