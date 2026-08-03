'use client'

import { useState } from 'react'
import { useRouter, Link } from '@tanstack/react-router'
import { useI18n } from '@/lib/i18n-provider'
import { useTheme } from './ThemeProvider'
import { LanguageSwitcher } from './LanguageSwitcher'
import { Sun, Moon, ArrowLeft, Plane, LogOut, LayoutDashboard, Settings, Menu } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Locale } from '@/i18n.config'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet'

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
    <header className={`sticky top-0 z-50 transition-all duration-300 ${className}`}>
      <div className="absolute inset-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-b border-gray-200/60 dark:border-gray-700/60" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {showBack ? (
              <motion.button
                type="button"
                onClick={handleBack}
                aria-label={backLabel}
                whileHover={{ x: -2 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 rounded-lg px-3 py-2 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">{backLabel}</span>
              </motion.button>
            ) : (
              <Link to="/" aria-label="AKMLEVA - Voltar à página inicial" className="group flex items-center gap-2">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-brand-gray via-orange to-green flex items-center justify-center shadow-lg shadow-primary/20"
                >
                  <Plane className="w-5 h-5 text-white -rotate-12 group-hover:rotate-0 transition-transform duration-300" />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-brand-gray via-orange to-green blur-md opacity-40 group-hover:opacity-60 transition-opacity" />
                </motion.div>
                <span className="text-xl sm:text-2xl font-black bg-gradient-to-r from-brand-gray via-orange to-green bg-clip-text text-transparent tracking-tighter">
                  AKMLEVA
                </span>
              </Link>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  className="sm:hidden relative p-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors min-h-10 min-w-10 flex items-center justify-center"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <SheetHeader>
                  <SheetTitle className="text-lg font-black bg-gradient-to-r from-brand-gray via-orange to-green bg-clip-text text-transparent tracking-tighter">
                    AKMLEVA
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-2 px-4 pb-6">
                  {userInitials && showDashboard && (
                    <button
                      type="button"
                      onClick={() => { onDashboard?.(); setMobileMenuOpen(false) }}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors min-h-11"
                    >
                      <LayoutDashboard className="h-5 w-5 text-primary" />
                      {dashboardLabel}
                    </button>
                  )}
                  {userInitials && showPreferences && (
                    <Link
                      to="/preferences/edit"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors min-h-11"
                    >
                      <Settings className="h-5 w-5 text-primary" />
                      {preferencesLabel}
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => { toggleTheme(); setMobileMenuOpen(false) }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors min-h-11"
                    aria-label={isDark ? lightModeLabel : darkModeLabel}
                  >
                    {isDark ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-primary" />}
                    {isDark ? lightModeLabel : darkModeLabel}
                  </button>
                  <div className="px-4 py-2">
                    <LanguageSwitcher currentLocale={locale as Locale} />
                  </div>
                  {showLogout && onLogout && (
                    <button
                      type="button"
                      onClick={() => { onLogout?.(); setMobileMenuOpen(false) }}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors min-h-11 mt-2 border-t border-gray-200 dark:border-gray-700 pt-4"
                    >
                      <LogOut className="h-5 w-5" />
                      {logoutLabel}
                    </button>
                  )}
                </nav>
              </SheetContent>
            </Sheet>

            <div className="hidden sm:flex items-center gap-2 sm:gap-3">
              {userInitials && showDashboard && (
                <motion.button
                  type="button"
                  onClick={onDashboard}
                  title={dashboardLabel}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative min-w-10 min-h-10 rounded-full bg-gradient-to-r from-primary to-accent text-white font-semibold text-sm shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow flex items-center justify-center overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700" />
                  <span className="relative z-10">{userInitials}</span>
                </motion.button>
              )}

              {userInitials && showPreferences && (
                <Link
                  to="/preferences/edit"
                  className="group flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-primary-200 dark:hover:border-primary-700 transition-all"
                >
                  <Settings className="h-3.5 w-3.5 text-gray-400 group-hover:text-primary dark:group-hover:text-primary-300 transition-colors" />
                  <span className="hidden lg:inline">{preferencesLabel}</span>
                </Link>
              )}

              <motion.button
                type="button"
                onClick={toggleTheme}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors min-h-10 min-w-10 flex items-center justify-center overflow-hidden"
                title={isDark ? lightModeLabel : darkModeLabel}
                aria-label={isDark ? lightModeLabel : darkModeLabel}
              >
                <motion.div
                  key={isDark ? 'sun' : 'moon'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {isDark ? (
                    <Sun className="h-4 w-4 text-amber-400" />
                  ) : (
                    <Moon className="h-4 w-4 text-primary" />
                  )}
                </motion.div>
              </motion.button>

              <LanguageSwitcher currentLocale={locale as Locale} />

              {showLogout && onLogout && (
                <motion.button
                  type="button"
                  onClick={onLogout}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-1 sm:gap-2 text-sm font-medium text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 rounded-lg px-2.5 sm:px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shrink-0"
                >
                  <LogOut className="h-4 w-4 sm:hidden" />
                  <span className="hidden sm:inline">{logoutLabel}</span>
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}