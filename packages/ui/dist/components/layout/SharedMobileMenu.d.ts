import type { ComponentType, ReactNode } from 'react';
import type { SharedNavItem, SharedUser } from './navigation/types';
interface SharedMobileMenuProps {
    open: boolean;
    items: SharedNavItem[];
    currentPath: string;
    onNavigate: (href: string) => void;
    LinkComponent: ComponentType<{
        href: string;
        children: ReactNode;
    }>;
    user?: SharedUser;
    theme?: 'light' | 'dark' | 'system';
    onThemeToggle?: () => void;
}
export default function SharedMobileMenu({ open, items, currentPath, onNavigate, LinkComponent, user, theme, onThemeToggle, }: SharedMobileMenuProps): import("react/jsx-runtime").JSX.Element;
export {};
