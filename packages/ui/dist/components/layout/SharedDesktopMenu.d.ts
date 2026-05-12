import type { ComponentType, ReactNode } from 'react';
import type { SharedNavItem } from './navigation/types';
interface SharedDesktopMenuProps {
    items: SharedNavItem[];
    currentPath: string;
    onNavigate: (href: string) => void;
    LinkComponent: ComponentType<{
        href: string;
        children: ReactNode;
    }>;
}
export default function SharedDesktopMenu({ items, currentPath, onNavigate, LinkComponent, }: SharedDesktopMenuProps): import("react/jsx-runtime").JSX.Element | null;
export {};
