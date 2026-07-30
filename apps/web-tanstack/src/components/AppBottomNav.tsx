'use client'

import { useMemo } from 'react'
import { useRouter } from '@tanstack/react-router'
import { useI18n } from '@/lib/i18n-provider'
import { Home, Search, LayoutDashboard, Settings } from 'lucide-react'

interface BottomNavItem {
  key: string
  icon: React.ReactNode
  label: string
}

export function AppBottomNav({ currentPath }: { currentPath?: string }) {
  const router = useRouter()
  const { t } = useI18n()
  const common = (t as Record<string, unknown>).common as Record<string, string> | undefined

  const items: BottomNavItem[] = useMemo(() => [
    {
      key: '/',
      icon: <Home className="h-5 w-5" />,
      label: common?.home || 'Início',
    },
    {
      key: '/destinations',
      icon: <Search className="h-5 w-5" />,
      label: common?.search || 'Pesquisar',
    },
    {
      key: '/dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: common?.dashboard || 'Painel',
    },
    {
      key: '/preferences/edit',
      icon: <Settings className="h-5 w-5" />,
      label: common?.settings || 'Definições',
    },
  ], [common])

  const activeKey = useMemo(() => {
    if (!currentPath) return ''
    if (currentPath === '/') return '/'
    if (currentPath.startsWith('/destinations')) return '/destinations'
    if (currentPath.startsWith('/dashboard')) return '/dashboard'
    if (currentPath.startsWith('/preferences')) return '/preferences/edit'
    return ''
  }, [currentPath])

  // Only show on main app pages, not on auth/legal
  const hiddenPaths = ['/auth', '/legal']
  if (!currentPath || hiddenPaths.some(p => currentPath.startsWith(p))) {
    return null
  }

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 px-2 py-1.5 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-gray-900/80 sm:hidden"
      aria-label="Bottom navigation"
    >
      <ul className="flex w-full items-center justify-around gap-1">
        {items.map((item) => {
          const isActive = item.key === activeKey

          return (
            <li key={item.key} className="flex-1">
              <button
                type="button"
                className={`relative mx-auto flex w-full max-w-[90px] min-h-11 flex-col items-center justify-center gap-0.5 rounded-full px-1 sm:px-2 py-1.5 text-[11px] sm:text-xs font-medium transition-colors ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-gray-800'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                onClick={() => router.navigate({ to: item.key })}
                aria-current={isActive ? 'page' : undefined}
              >
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-[18px] ${
                    isActive ? 'bg-blue-600 dark:bg-blue-500 text-white' : ''
                  }`}
                  aria-hidden="true"
                >
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
