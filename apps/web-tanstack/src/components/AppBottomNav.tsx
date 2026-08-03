'use client'

import { useMemo } from 'react'
import { useRouter } from '@tanstack/react-router'
import { useI18n } from '@/lib/i18n-provider'
import { Home, Search, LayoutDashboard, Settings } from 'lucide-react'
import { motion } from 'framer-motion'

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
      className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200/60 dark:border-gray-700/60 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl px-2 py-1.5 sm:hidden"
      aria-label="Bottom navigation"
    >
      {/* Top gradient accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <ul className="flex w-full items-center justify-around gap-1">
        {items.map((item) => {
          const isActive = item.key === activeKey

          return (
            <li key={item.key} className="flex-1">
              <button
                type="button"
                className={`relative mx-auto flex w-full max-w-[90px] min-h-11 flex-col items-center justify-center gap-0.5 rounded-2xl px-1 sm:px-2 py-1.5 text-[11px] sm:text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-primary dark:text-primary-300'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
                onClick={() => router.navigate({ to: item.key })}
                aria-current={isActive ? 'page' : undefined}
              >
                {isActive && (
                  <motion.div
                    layoutId="bottom-nav-active"
                    className="absolute inset-0 rounded-2xl bg-primary-50 dark:bg-primary-900/20"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span
                  className={`relative flex h-7 w-7 items-center justify-center rounded-xl transition-all duration-200 ${
                    isActive ? 'bg-gradient-to-br from-primary to-accent text-white shadow-md shadow-primary/25' : ''
                  }`}
                  aria-hidden="true"
                >
                  {item.icon}
                </span>
                <span className="relative truncate">{item.label}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
