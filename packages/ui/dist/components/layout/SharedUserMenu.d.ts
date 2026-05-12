import type { SharedUser } from './navigation/types';
interface SharedUserMenuProps {
    user?: SharedUser;
    onLogin?: () => void;
    onLogout?: () => void;
    t?: (key: string, defaultValue?: string) => string;
    showNotifications?: boolean;
    notificationsCount?: number;
    onNotificationsClick?: () => void;
    onNavigate?: (path: string) => void;
}
export default function SharedUserMenu({ user, onLogin, onLogout, t, showNotifications, notificationsCount, onNotificationsClick, onNavigate, }: SharedUserMenuProps): import("react/jsx-runtime").JSX.Element | null;
export {};
