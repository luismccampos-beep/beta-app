import {
  Bell,
  LogOut,
  User as UserIcon,
  Settings,
  CreditCard,
  LifeBuoy
} from 'lucide-react';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@akmleva/ui';

import type { SharedUser } from './navigation/types';

interface SharedUserMenuProps {
  user?: SharedUser;
  onLogin?: () => void;
  onLogout?: () => void;
  t?: (key: string, defaultValue?: string) => string;
  showNotifications?: boolean;
  notificationsCount?: number;
  onNotificationsClick?: () => void;
  onNavigate?: (path: string) => void; // Added onNavigate to props
}

export default function SharedUserMenu({
  user,
  onLogin,
  onLogout,
  t,
  showNotifications,
  notificationsCount,
  onNotificationsClick,
  onNavigate,
}: SharedUserMenuProps) {
  // Safe translation helper
  const translate = (key: string, fallback: string) => t ? t(key, fallback) : fallback;

  const labelLogin = translate('header.login', 'Entrar');
  const labelLogout = translate('header.logout', 'Terminar sessão');
  const labelUserFallback = translate('header.user', 'Utilizador');
  const labelNotifications = translate('header.notifications', 'Notificações');
  const labelProfile = translate('header.profile', 'Perfil');
  const labelSettings = translate('header.settings', 'Definições');
  const labelBilling = translate('header.billing', 'Faturação');
  const labelHelp = translate('header.help', 'Ajuda');

  if (!user) {
    if (!onLogin) return null;

    return (
      <Button size="sm" onClick={onLogin} className="font-medium px-6">
        {labelLogin}
      </Button>
    );
  }

  const hasNotifications = Boolean(showNotifications && notificationsCount && notificationsCount > 0);
  const userInitials = (user.name || user.email || 'U').charAt(0).toUpperCase();

  const handleNavigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else if (typeof window !== 'undefined') {
      window.location.href = path;
    }
  };

  return (
    <div className="flex items-center gap-2">
      {showNotifications && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 text-muted-foreground hover:text-foreground"
          aria-label={labelNotifications}
          onClick={onNotificationsClick}
        >
          <Bell className="h-4 w-4" />
          {hasNotifications && (
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border border-background" />
          )}
        </Button>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-9 w-9 rounded-full ring-offset-background transition-all hover:ring-2 hover:ring-primary/20 p-0 ml-1">
            <Avatar className="h-9 w-9 border border-border/50">
              <AvatarImage src={user.avatarUrl} alt={user.name || labelUserFallback} />
              <AvatarFallback className="bg-gradient-to-br from-primary/10 to-primary/20 text-primary font-medium">
                {userInitials}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64 p-2 rounded-xl shadow-xl border-border/60">
          <DropdownMenuLabel className="font-normal p-3 bg-muted/30 rounded-lg mb-1">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-semibold leading-none">{user.name || labelUserFallback}</p>
              <p className="text-xs leading-none text-muted-foreground truncate opacity-80">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="my-1 opacity-50" />

          <DropdownMenuItem onClick={() => handleNavigate('/profile')} className="rounded-lg cursor-pointer">
            <UserIcon className="mr-2 h-4 w-4 opacity-70" />
            <span>{labelProfile}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleNavigate('/settings')} className="rounded-lg cursor-pointer">
            <Settings className="mr-2 h-4 w-4 opacity-70" />
            <span>{labelSettings}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleNavigate('/billing')} className="rounded-lg cursor-pointer">
            <CreditCard className="mr-2 h-4 w-4 opacity-70" />
            <span>{labelBilling}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleNavigate('/help')} className="rounded-lg cursor-pointer">
            <LifeBuoy className="mr-2 h-4 w-4 opacity-70" />
            <span>{labelHelp}</span>
          </DropdownMenuItem>

          {onLogout && (
            <>
              <DropdownMenuSeparator className="my-1 opacity-50" />
              <DropdownMenuItem
                onClick={onLogout}
                className="rounded-lg text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20 cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>{labelLogout}</span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
