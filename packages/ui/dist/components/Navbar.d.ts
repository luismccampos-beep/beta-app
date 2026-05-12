import * as React from "react";
export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
    className?: string;
    fixed?: boolean;
    variant?: string;
    size?: string;
    transparent?: boolean;
    sticky?: boolean;
    links?: Array<{
        label: string;
        to: string;
    }>;
    shadow?: string;
    blurAmount?: string | number;
}
declare const Navbar: ({ children, className, fixed, transparent, variant, size, sticky, links, shadow, blurAmount, ...props }: NavbarProps) => import("react/jsx-runtime").JSX.Element;
export interface NavbarBrandProps extends React.HTMLAttributes<HTMLElement> {
    href?: string;
}
declare const NavbarBrand: ({ children, className, href, ...props }: NavbarBrandProps) => import("react/jsx-runtime").JSX.Element;
export interface NavbarContentProps extends React.HTMLAttributes<HTMLDivElement> {
    position?: 'start' | 'center' | 'end';
}
declare const NavbarContent: ({ children, className, position, ...props }: NavbarContentProps) => import("react/jsx-runtime").JSX.Element;
export interface NavbarItemProps extends React.HTMLAttributes<HTMLElement> {
    href?: string;
    to?: string;
    icon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    badge?: React.ReactNode;
    external?: boolean;
    tooltip?: string;
    shortcut?: string;
    animation?: string;
    underline?: boolean;
    pill?: boolean;
    exactMatch?: boolean;
    matchPattern?: string;
}
declare const NavbarItem: ({ children, className, href, to, icon, rightIcon, badge, ...props }: NavbarItemProps) => import("react/jsx-runtime").JSX.Element;
export interface NavbarMenuProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
}
declare const NavbarMenu: ({ children, className, ...props }: NavbarMenuProps) => import("react/jsx-runtime").JSX.Element;
export interface NavLinkItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    className?: string;
}
export interface NavLinkItemType {
    label: string;
    to?: string;
    href?: string;
    icon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    badge?: React.ReactNode;
    external?: boolean;
    tooltip?: string;
    shortcut?: string;
    animation?: string;
    underline?: boolean;
    pill?: boolean;
    exactMatch?: boolean;
    matchPattern?: string;
    className?: string;
}
declare const NavLinkItem: ({ children, className, ...props }: NavLinkItemProps) => import("react/jsx-runtime").JSX.Element;
export { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavLinkItem, };
export default Navbar;
