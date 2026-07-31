import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { generatePageHead } from '@/lib/seo'
import { createTranslationsHook } from '@/lib/i18n-provider'
import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Lock, Eye, EyeOff, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

const useT = createTranslationsHook('auth')

export const Route = createFileRoute('/auth/reset-password')({
  head: () => generatePageHead({
    title: 'Repor Password',
    description: 'Repor a password da sua conta AKMLEVA.',
    path: '/auth/reset-password',
    noindex: true,
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    token: (search.token as string) || '',
  }),
  component: ResetPasswordPage,
})

function ResetPasswordPage() {
  const t = useT()
  const navigate = useNavigate()
  const { token } = Route.useSearch()

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!token) setError(t('invalidResetLink') || 'Invalid or missing reset token')
  }, [token, t])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError(t('passwordTooShort') || 'Password must be at least 8 characters')
      return
    }
    if (password !== confirm) {
      setError(t('passwordMismatch') || 'Passwords do not match')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        credentials: 'include',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })
      const data = await res.json() as { success?: boolean; error?: string }
      if (!res.ok) throw new Error(data.error || 'Failed to reset password')
      setSuccess(true)
      toast.success(t('passwordResetSuccess') || 'Password reset successfully!')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-cyan-50 to-accent-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-0 shadow-xl bg-white dark:bg-gray-800">
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('invalidResetLink') || 'Invalid Reset Link'}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              {t('resetLinkExpired') || 'This reset link is invalid or has expired.'}
            </p>
            <Button
              onClick={() => void navigate({ to: '/forgot-password' })}
              className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:from-primary-700 hover:to-accent-600 text-base gap-2"
            >
              {t('requestNewReset') || 'Request New Reset Link'}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-cyan-50 to-accent-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-0 shadow-xl bg-white dark:bg-gray-800">
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('passwordResetSuccess') || 'Password Reset!'}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              {t('passwordResetSuccessDesc') || 'Your password has been reset successfully.'}
            </p>
            <Button
              onClick={() => void navigate({ to: '/auth' })}
              className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:from-primary-700 hover:to-accent-600 text-base gap-2"
            >
              {t('signIn') || 'Sign In'}
              <Loader2 className="w-5 h-5" />
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-cyan-50 to-accent-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 shadow-xl bg-white dark:bg-gray-800">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-primary dark:text-primary-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('resetPassword') || 'Reset Password'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t('chooseNewPassword') || 'Choose a new password for your account.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-password" className="dark:text-gray-200">{t('newPassword')}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="reset-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('passwordMinChars') || 'Minimum 8 characters'}
                  className="pl-10 pr-10 h-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reset-confirm" className="dark:text-gray-200">{t('confirmNewPassword')}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="reset-confirm"
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder={t('passwordReenter') || 'Re-enter your password'}
                  className="pl-10 h-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  autoComplete="new-password"
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-500 dark:text-red-400" role="alert">{error}</p>
            )}

            <Button
              type="submit"
              disabled={isSubmitting || !password || !confirm}
              className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:from-primary-700 hover:to-accent-600 text-base gap-2"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t('resetting') || 'Resetting...'}
                </span>
              ) : (
                t('resetPassword') || 'Reset Password'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => void navigate({ to: '/auth' })}
              className="text-sm text-primary dark:text-primary-300 hover:underline"
            >
              ← {t('backToSignIn') || 'Back to Sign In'}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
