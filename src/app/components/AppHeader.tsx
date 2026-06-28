'use client';

import { useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { Sun, Moon, LogOut, ArrowLeft, LayoutDashboard, Plane } from 'lucide-react';
import { Button } from './ui/button';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';
import { useTheme } from './ThemeProvider';

export interface AppHeaderProps {
  /** If true, show a "Back" button instead of the logo as a link */
  showBack?: boolean;
  /** Override the back action (defaults to router.back()) */
  onBack?: () => void;
  /** Show the logout button */
  showLogout?: boolean;
  /** Logout handler */
  onLogout?: () => void;
  /** Show the dashboard link */
  showDashboard?: boolean;
  /** Dashboard handler */
  onDashboard?: () => void;
  /** Show the preferences form button (when user is logged in) */
  showPreferences?: boolean;
  /** Extra CSS classes for the header element */
  className?: string;
}

export function AppHeader({
  showBack,
  onBack,
  showLogout,
  onLogout,
  showDashboard,
  onDashboard,
  showPreferences,
  className = '',
}: AppHeaderProps) {
  const router = useRouter();
  const t = useTranslations('common');
  const { isDark, toggle: toggleTheme } = useTheme();
  const { data: session } = useSession();

  const handleBack = useCallback(() => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  }, [onBack, router]);

  const initials = useMemo(() => {
    if (!session?.user) return null;
    const base = (session.user.name?.trim() || session.user.email || '').trim();
    if (!base) return null;
    const parts = base.split(/\s+/).filter(Boolean);
    const first = (parts[0]?.[0] ?? '').toUpperCase();
    const second = (parts.length > 1 ? parts[parts.length - 1]?.[0] : parts[0]?.[1]) ?? '';
    return (first + String(second).toUpperCase()).slice(0, 2);
  }, [session]);

  return (
    <header
      className={`sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 z-50 transition-colors ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-2">
          {/* Left side: Logo or Back button */}
          <div className="flex items-center gap-2">
            {showBack ? (
              <Button type="button"
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="gap-1.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">{t('back')}</span>
              </Button>
            ) : (
              <Link
                href="/"
                aria-label="AKMLEVA - Voltar à página inicial"
                className="group flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-gray via-orange to-green flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Plane className="w-5 h-5 text-white -rotate-12 group-hover:rotate-0 transition-transform" />
                </div>
                <span className="text-xl sm:text-2xl font-black bg-gradient-to-r from-brand-gray via-orange to-green bg-clip-text text-transparent tracking-tighter">
                  AKMLEVA
                </span>
              </Link>
            )}
          </div>

          {/* Right side: Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* User avatar / dashboard link */}
            {session?.user && initials && showDashboard && (
              <button type="button"
                onClick={onDashboard}
                title={t('dashboard')}
                className="min-w-11 min-h-11 rounded-full bg-gradient-to-r from-brand-gray to-orange text-white font-semibold text-sm shadow-md hover:opacity-90 transition-opacity flex items-center justify-center"
              >
                <LayoutDashboard className="h-4 w-4 sm:hidden" />
                <span className="hidden sm:inline">{initials}</span>
              </button>
            )}

            {/* Preferences button */}
            {session?.user && showPreferences && (
              <Button type="button"
                variant="outline"
                size="sm"
                onClick={() => router.push('/preferences/edit')}
                className="border-primary-300 dark:border-gray-600 dark:text-gray-200"
              >
                {t('preferences')}
              </Button>
            )}

            {/* Theme Toggle */}
            <button type="button"
              onClick={toggleTheme}
              className="p-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors min-h-11 min-w-11 flex items-center justify-center"
              title={isDark ? t('lightMode') : t('darkMode')}
              aria-label={isDark ? t('lightMode') : t('darkMode')}
            >
              {isDark ? (
                <Sun className="h-4 w-4 text-accent" />
              ) : (
                <Moon className="h-4 w-4 text-primary" />
              )}
            </button>

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Logout */}
            {showLogout && onLogout && (
              <Button type="button"
                variant="outline"
                onClick={onLogout}
                size="sm"
                className="gap-2 text-red-600 dark:text-red-400 border-red-300 dark:border-gray-600 shrink-0 min-h-10 px-2.5 sm:px-4"
              >
                <LogOut className="h-4 w-4 sm:hidden" />
                <span className="hidden sm:inline">{t('logout')}</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}