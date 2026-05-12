"use client";
/**
 * AppHeader - Unified Header Component for Shared Package
 * 
 * Features:
 * - Multiple header variants (public/user/admin)
 * - Responsive mobile/desktop navigation
 * - Customizable navigation items
 * - User authentication integration
 * - Mobile menu support
 * - Language and Theme switching
 */



import { memo, useCallback, useState } from 'react';
import { Menu, X, User, LogOut, Settings } from 'lucide-react';
import { Button } from '@akmleva/ui';
import LanguageSwitcher, { LanguageSwitcherVariant } from '@akmleva/shared/components/LanguageSwitcher';
import { cn } from '@akmleva/shared/utils/index';

import SharedThemeToggle from '../../layout/SharedThemeToggle';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

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

// =============================================================================
// DEFAULT CONFIGURATION
// =============================================================================

const defaultNavigation: NavItem[] = [
  { href: '/', label: 'Início' },
  { href: '/destinos', label: 'Destinos' },
  { href: '/pacotes', label: 'Pacotes' },
  { href: '/about', label: 'Sobre Nós' },
  { href: '/contact', label: 'Contato' },
];

const userNavigation: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: <User className="h-4 w-4" /> },
  { href: '/bookings', label: 'Reservas' },
  { href: '/profile', label: 'Perfil' },
  { href: '/settings', label: 'Configurações', icon: <Settings className="h-4 w-4" /> },
];

// =============================================================================
// COMPONENT
// =============================================================================

const AppHeaderComponent = ({
  variant = 'public',
  user = null,
  navItems,
  navigation,
  logo,
  onLogin,
  onLogout,
  onNavigate,
  pathname,
  onMenuStateChange,
  translations,
  showSearch: _showSearch,
  className,
  showUserMenu = true,
  theme,
  onThemeToggle,
}: AppHeaderProps) => {
  const [mobileMenuOpen, _setMobileMenuOpen] = useState(false);

  const setMobileMenuOpen = useCallback((open: boolean) => {
    _setMobileMenuOpen(open);
    if (onMenuStateChange) {
      onMenuStateChange(open ? 'open' : 'closed');
    }
  }, [onMenuStateChange]);

  // Use navigation or fallback to legacy navItems
  const activeNavigation = navigation || navItems || defaultNavigation;

  // Legacy props for compatibility (informational)
  void pathname;
  void translations;
  void _showSearch;

  const handleNavigation = useCallback((href: string) => {
    if (onNavigate) {
      onNavigate(href);
    } else {
      // Default navigation - you can customize this
      window.location.href = href;
    }
    setMobileMenuOpen(false);
  }, [onNavigate]);

  const handleLogout = useCallback(() => {
    if (onLogout) {
      onLogout();
    }
    setMobileMenuOpen(false);
  }, [onLogout]);

  const handleLogin = useCallback(() => {
    if (onLogin) {
      onLogin();
    }
    setMobileMenuOpen(false);
  }, [onLogin]);

  const filteredNavigation = activeNavigation.filter(item => {
    if (!item.protected) return true;
    return user !== null;
  });

  const renderLogo = () => {
    if (logo) return logo;

    return (
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">AK</span>
        </div>
        <span className="font-bold text-xl text-gray-900">AKMLEVA</span>
      </div>
    );
  };

  const renderUserMenu = () => {
    if (!showUserMenu || variant === 'public') return null;

    if (user) {
      return (
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name || 'User'}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-gray-600" />
              </div>
            )}
            <span className="text-sm font-medium text-gray-700 hidden sm:block">
              {user.name || user.email || 'User'}
            </span>
          </div>

          <div className="relative group">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-1"
            >
              <User className="h-4 w-4" />
            </Button>

            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              {userNavigation.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleNavigation(item.href)}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
              <hr className="my-1" />
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <LogOut className="h-4 w-4" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <Button onClick={handleLogin} size="sm">
        Entrar
      </Button>
    );
  };

  return (
    <header className={cn(
      'bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50',
      className
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => handleNavigation('/')}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              {renderLogo()}
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {filteredNavigation.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavigation(item.href)}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors relative"
              >
                {item.label}
                {item.badge && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Actions & User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language & Theme Switchers */}
            <div className="flex items-center border-r border-gray-200 pr-4 mr-2 space-x-2">
              <LanguageSwitcher
                showLabel={false}
                variant={LanguageSwitcherVariant.GHOST}
                className="w-9 h-9 justify-center"
              />

              <SharedThemeToggle
                {...(theme ? { theme } : {})}
                {...(onThemeToggle ? { onToggleTheme: onThemeToggle } : {})}
              />
            </div>

            {/* User Menu */}
            {renderUserMenu()}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-3">
              {filteredNavigation.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleNavigation(item.href)}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 text-base font-medium text-left transition-colors"
                >
                  {item.label}
                  {item.badge && (
                    <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}

              <div className="pt-4 border-t border-gray-200 flex flex-col space-y-4">
                <div className="flex items-center justify-between px-3">
                  <span className="text-sm font-medium text-gray-500">Aparência</span>
                  <div className="flex items-center space-x-2">
                    <LanguageSwitcher
                      showLabel={true}
                      variant={LanguageSwitcherVariant.GHOST}
                    />
                    <SharedThemeToggle
                      {...(theme ? { theme } : {})}
                      {...(onThemeToggle ? { onToggleTheme: onThemeToggle } : {})}
                    />
                  </div>
                </div>

                <div className="px-3">
                  {renderUserMenu()}
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export const AppHeader = memo(AppHeaderComponent);
AppHeader.displayName = 'AppHeader';

/** @alias */
export default AppHeader;
