import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { generatePageHead } from '@/lib/seo'
import { createTranslationsHook } from '@/lib/i18n-provider'
import { useState, useCallback } from 'react'
import { Loader2 } from 'lucide-react'

const useT = createTranslationsHook('auth')

export const Route = createFileRoute('/auth')({
  head: () => generatePageHead({
    title: 'Entrar',
    description: 'Inicie sessão na sua conta AKMLEVA.',
    path: '/auth',
    noindex: true,
  }),
  component: AuthPage,
})

function AuthPage() {
  const t = useT()
  const navigate = useNavigate()

  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const switchMode = useCallback(() => {
    setMode((m) => (m === 'login' ? 'signup' : 'login'))
    setError('')
  }, [])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setError('')
      setLoading(true)

      try {
        if (mode === 'login') {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email.trim(), password }),
          })
          const data = await res.json() as { ok?: boolean; error?: string }
          if (!res.ok || !data.ok) {
            setError(data.error || 'Credenciais inválidas')
            return
          }
        } else {
          if (!agreeTerms) {
            setError('Tem de aceitar os Termos de Serviço')
            return
          }
          const res = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: email.trim(),
              password,
              name: name.trim() || undefined,
              agreeToTerms: true,
            }),
          })
          const data = await res.json() as { ok?: boolean; error?: string }
          if (!res.ok || !data.ok) {
            setError(data.error || 'Falha ao criar conta')
            return
          }
        }

        navigate({ to: '/dashboard' })
      } catch {
        setError('Erro de rede. Tente novamente.')
      } finally {
        setLoading(false)
      }
    },
    [mode, email, password, name, agreeTerms, navigate],
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-6 sm:p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 via-purple-500 to-orange-500 flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white -rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
            {mode === 'login' ? t('login') : t('createAccount')}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
            {mode === 'login'
              ? 'Entre para aceder ao seu painel de viagens'
              : 'Crie a sua conta gratuita em segundos'}
          </p>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <form className="space-y-3 sm:space-y-4" onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <div>
                <label htmlFor="auth-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {(t('name') as string) !== 'name' ? t('name') : 'Nome'}
                </label>
                <input
                  id="auth-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="O seu nome"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                />
              </div>
            )}

            <div>
              <label htmlFor="auth-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('email')}</label>
              <input
                id="auth-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={mode === 'login' ? 'exemplo@email.com' : 'exemplo@email.com'}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
              />
            </div>

            <div>
              <label htmlFor="auth-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('password')}</label>
              <input
                id="auth-password"
                type="password"
                required
                minLength={mode === 'signup' ? 8 : 1}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === 'signup' ? 'Mínimo 8 caracteres' : 'A sua password'}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
              />
              {mode === 'signup' && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Mínimo 8 caracteres</p>
              )}
            </div>

            {mode === 'signup' && (
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Aceito os{' '}
                  <a href="/legal/terms" className="text-blue-600 hover:text-blue-700 underline">Termos de Serviço</a>
                  {' '}e a{' '}
                  <a href="/legal/privacy" className="text-blue-600 hover:text-blue-700 underline">Política de Privacidade</a>
                </span>
              </label>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {mode === 'login' ? t('login') : t('createAccount')}
            </button>
          </form>

          {mode === 'login' && (
            <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
              <a href="/forgot-password" className="hover:text-blue-600 transition-colors">{t('forgotPassword')}</a>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-600 dark:text-gray-400">
            {mode === 'login' ? (
              <>
                {t('noAccount')}{' '}
                <button type="button" onClick={switchMode} className="font-semibold text-blue-600 hover:text-blue-700 cursor-pointer">
                  {t('createAccount')}
                </button>
              </>
            ) : (
              <>
                Já tem conta?{' '}
                <button type="button" onClick={switchMode} className="font-semibold text-blue-600 hover:text-blue-700 cursor-pointer">
                  {t('login')}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
