import type { ComponentType, ReactNode } from 'react';
export interface SharedNavItem {
    href: string;
    label: string;
    icon?: ComponentType<{
        className?: string;
    }>;
    badge?: string;
    external?: boolean;
    protected?: boolean;
    roleRequired?: 'admin' | 'user';
}
export interface SharedUser {
    id: string;
    name?: string;
    email?: string;
    avatarUrl?: string;
    role?: string;
}
export interface SharedHeaderProps {
    items: SharedNavItem[];
    user?: SharedUser;
    onLogin?: () => void;
    onLogout?: () => void;
    currentPath: string;
    onNavigate: (path: string) => void;
    LinkComponent: ComponentType<{
        href: string;
        children: ReactNode;
    }>;
    t?: (key: string, defaultValue?: string) => string;
    theme?: 'light' | 'dark' | 'system';
    onThemeToggle?: () => void;
    className?: string;
}
