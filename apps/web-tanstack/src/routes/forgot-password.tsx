import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { generatePageHead } from '@/lib/seo'
import { createTranslationsHook } from '@/lib/i18n-provider'
import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Mail, Lock, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'
import { H4 } from '@/components/ui/typography'
import { toast } from 'sonner'

const useT = createTranslationsHook('auth')

export const Route = createFileRoute('/forgot-password')({
  head: () => generatePageHead({
    title: 'Recuperar Password',
    description: 'Recuperar a password da sua conta AKMLEVA.',
    path: '/forgot-password',
    noindex: true,
  }),
  component: ForgotPasswordPage,
})

function ForgotPasswordPage() {
  const t = useT()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      toast.error(t('emailRequired') || 'Email is required')
      return
    }
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        credentials: 'include',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) {
        toast.error('Failed to send reset email')
        return
      }
      setSent(true)
      toast.success(t('resetEmailSent') || 'Reset email sent!')
    } catch {
      toast.error('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-cyan-50 to-accent-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-0 shadow-xl bg-white dark:bg-gray-800">
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <H4>
              {t('emailSent') || 'Email sent!'}
            </H4>
            <p className="text-gray-500 dark:text-gray-400">
              {t('resetEmailSentDesc') || 'Check your inbox for a password reset link.'}
            </p>
            <Button
              onClick={() => void navigate({ to: '/auth' })}
              className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:from-primary-700 hover:to-accent-600 text-base gap-2"
            >
              {t('backToSignIn') || 'Back to Sign In'}
              <ArrowRight className="w-5 h-5" />
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
            <H4>
              {t('forgotPassword') || 'Forgot Password?'}
            </H4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t('forgotPasswordDesc') || "Enter your email and we'll send you a reset link."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="forgot-email" className="dark:text-gray-200">{t('email')}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="forgot-email"
                  type="email"
                  placeholder={t('emailPlaceholder') || 'exemplo@email.com'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  autoComplete="email"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:from-primary-700 hover:to-accent-600 text-base gap-2"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Spinner />
                  {t('sending') || 'Sending...'}
                </span>
              ) : (
                <>
                  {t('sendResetLink') || 'Send Reset Link'}
                  <ArrowRight className="w-5 h-5" />
                </>
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
