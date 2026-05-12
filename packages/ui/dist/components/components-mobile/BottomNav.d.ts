import { type ReactNode } from "react";
type BottomNavItemKey = string;
interface BottomNavItem {
    key: BottomNavItemKey;
    icon: ReactNode;
    label: string;
    badgeCount?: number;
    disabled?: boolean;
}
interface BottomNavProps {
    items: BottomNavItem[];
    activeKey?: BottomNavItemKey;
    onChange?: (key: BottomNavItemKey) => void;
    className?: string;
}
declare function BottomNav({ items, activeKey, onChange, className, }: BottomNavProps): import("react/jsx-runtime").JSX.Element;
export { BottomNav };
export type { BottomNavItem, BottomNavProps, BottomNavItemKey };
