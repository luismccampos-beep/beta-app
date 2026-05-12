import type { NavLinkItem } from '../data/footerData';
interface TraditionalFooterLinksColumnProps {
    title: string;
    titleKey: string;
    links: NavLinkItem[];
    className?: string;
}
export declare function TraditionalFooterLinksColumn({ title, titleKey, links, className }: TraditionalFooterLinksColumnProps): import("react/jsx-runtime").JSX.Element;
export {};
