'use client'

import { useRouter, Link } from '@tanstack/react-router'
import { useI18n } from '@/lib/i18n-provider'
import { useTheme } from './ThemeProvider'
import { LanguageSwitcher } from './LanguageSwitcher'
import { Sun, Moon, ArrowLeft, Plane, LogOut, LayoutDashboard } from 'lucide-react'
import type { Locale } from '@/i18n.config'

export interface AppHeaderProps {
  showLogout?: boolean
  onLogout?: () => void
  showDashboard?: boolean
  onDashboard?: () => void
  showBack?: boolean
  showPreferences?: boolean
  onBack?: () => void
  className?: string
  userInitials?: string | null
  currentPath?: string
}

export function AppHeader({
  showLogout,
  onLogout,
  showDashboard,
  onDashboard,
  showBack: showBackProp,
  showPreferences,
  onBack,
  className = '',
  userInitials,
  currentPath,
}: AppHeaderProps) {
  const router = useRouter()
  const { t, locale } = useI18n()
  const { isDark, toggle: toggleTheme } = useTheme()

  const common = (t as Record<string, unknown>).common as Record<string, string> | undefined
  const backLabel = common?.back || 'Voltar'
  const dashboardLabel = common?.dashboard || 'Dashboard'
  const preferencesLabel = common?.preferences || 'Preferências'
  const lightModeLabel = common?.lightMode || 'Modo claro'
  const darkModeLabel = common?.darkMode || 'Modo escuro'
  const logoutLabel = common?.logout || 'Sair'

  const showBack = (() => {
    if (showBackProp !== undefined) return showBackProp
    if (onBack !== undefined) return true
    if (!currentPath) return false
    const staticPages = ['/about', '/contact', '/faq', '/legal', '/destinations']
    return staticPages.some(p => currentPath === p || currentPath.startsWith(p + '/'))
  })()

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      router.history.back()
    }
  }

  return (
    <header
      className={`sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 z-50 transition-colors ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-2">
          {/* Left side: Logo or Back button */}
          <div className="flex items-center gap-2">
            {showBack ? (
              <button
                type="button"
                onClick={handleBack}
                aria-label={backLabel}
                className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg px-3 py-2 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">{backLabel}</span>
              </button>
            ) : (
              <Link
                to="/"
                aria-label="AKMLEVA - Voltar à página inicial"
                className="group flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 via-purple-500 to-orange-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Plane className="w-5 h-5 text-white -rotate-12 group-hover:rotate-0 transition-transform" />
                </div>
                <span className="text-xl sm:text-2xl font-black bg-gradient-to-r from-blue-600 via-purple-500 to-orange-500 bg-clip-text text-transparent tracking-tighter">
                  AKMLEVA
                </span>
              </Link>
            )}
          </div>

          {/* Right side: Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {userInitials && showDashboard && (
              <button
                type="button"
                onClick={onDashboard}
                title={dashboardLabel}
                className="min-w-10 min-h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-sm shadow-md hover:opacity-90 transition-opacity flex items-center justify-center"
              >
                <LayoutDashboard className="h-4 w-4 sm:hidden" />
                <span className="hidden sm:inline">{userInitials}</span>
              </button>
            )}

            {userInitials && showPreferences && (
              <Link
                to="/preferences/edit"
                className="text-sm font-medium px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {preferencesLabel}
              </Link>
            )}

            <button
              type="button"
              onClick={toggleTheme}
              className="p-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors min-h-10 min-w-10 flex items-center justify-center"
              title={isDark ? lightModeLabel : darkModeLabel}
              aria-label={isDark ? lightModeLabel : darkModeLabel}
            >
              {isDark ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4 text-blue-600" />
              )}
            </button>

            <LanguageSwitcher currentLocale={locale as Locale} />

            {showLogout && onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="flex items-center gap-1 sm:gap-2 text-sm font-medium text-red-600 dark:text-red-400 border border-red-200 dark:border-gray-600 rounded-lg px-2.5 sm:px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shrink-0"
              >
                <LogOut className="h-4 w-4 sm:hidden" />
                <span className="hidden sm:inline">{logoutLabel}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
