'use client';

import { useMemo, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  Home,
  Search,
  LayoutDashboard,
  Settings,
} from 'lucide-react';

interface BottomNavItem {
  key: string;
  icon: ReactNode;
  label: string;
}

export function AppBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('common');

  const items: BottomNavItem[] = useMemo(() => [
    {
      key: '/',
      icon: <Home className="h-5 w-5" />,
      label: t('home') || 'Home',
    },
    {
      key: '/destinations',
      icon: <Search className="h-5 w-5" />,
      label: t('search') || 'Search',
    },
    {
      key: '/dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: t('dashboard') || 'Dashboard',
    },
    {
      key: '/preferences/edit',
      icon: <Settings className="h-5 w-5" />,
      label: t('preferences') || 'Settings',
    },
  ], [t]);

  const activeKey = useMemo(() => {
    if (pathname === '/') return '/';
    if (pathname.startsWith('/destinations')) return '/destinations';
    if (pathname.startsWith('/dashboard')) return '/dashboard';
    if (pathname.startsWith('/preferences')) return '/preferences/edit';
    return '';
  }, [pathname]);

  // Only show on main app pages, not on auth/legal
  const hiddenPaths = ['/auth', '/legal'];
  if (hiddenPaths.some(p => pathname.startsWith(p))) {
    return null;
  }

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 px-2 py-1.5 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-gray-900/80 sm:hidden"
      aria-label="Bottom navigation"
    >
      <ul className="flex w-full items-center justify-around gap-1">
        {items.map((item) => {
          const isActive = item.key === activeKey;

          return (
            <li key={item.key} className="flex-1">
              <button
                type="button"
                className={`relative mx-auto flex w-full max-w-[90px] flex-col items-center justify-center gap-0.5 rounded-full px-2 py-1 text-[11px] font-medium transition-colors ${
                  isActive
                    ? 'text-teal-600 dark:text-orange-400 bg-teal-50 dark:bg-gray-800'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                onClick={() => router.push(item.key)}
                aria-current={isActive ? 'page' : undefined}
              >
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-[18px] ${
                    isActive ? 'bg-teal-600 dark:bg-orange-500 text-white' : ''
                  }`}
                  aria-hidden="true"
                >
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
