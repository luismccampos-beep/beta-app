export type HeaderVariant = 'public' | 'user' | 'admin';
export interface AppHeaderUser {
    id: string;
    name?: string;
    email?: string;
    avatar?: string;
    role?: string;
}
export interface NavItem {
    href: string;
    label: string;
    icon?: React.ReactNode;
    protected?: boolean;
    badge?: string | number;
}
export interface AppHeaderTranslations {
    bannerAria?: string;
    destinations?: string;
    flights?: string;
    hotels?: string;
    demo?: string;
    login?: string;
    signup?: string;
}
export interface AppHeaderProps {
    variant?: HeaderVariant;
    user?: AppHeaderUser | null;
    /** @deprecated use navigation */
    navItems?: NavItem[];
    navigation?: NavItem[];
    logo?: React.ReactNode;
    onLogin?: () => void;
    onLogout?: () => void;
    onNavigate?: (href: string) => void;
    /** @deprecated use onNavigate or internal router */
    pathname?: string;
    /** @deprecated */
    onMenuStateChange?: (state: 'open' | 'closed') => void;
    /** @deprecated */
    translations?: AppHeaderTranslations;
    /** @deprecated */
    showSearch?: boolean;
    className?: string;
    showUserMenu?: boolean;
    theme?: 'light' | 'dark' | 'system';
    onThemeToggle?: () => void;
}
export declare const AppHeader: import("react").MemoExoticComponent<({ variant, user, navItems, navigation, logo, onLogin, onLogout, onNavigate, pathname, onMenuStateChange, translations, showSearch: _showSearch, className, showUserMenu, theme, onThemeToggle, }: AppHeaderProps) => import("react/jsx-runtime").JSX.Element>;
/** @alias */
export default AppHeader;
