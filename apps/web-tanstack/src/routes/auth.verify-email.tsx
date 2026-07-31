import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { generatePageHead } from '@/lib/seo'
import { createTranslationsHook } from '@/lib/i18n-provider'
import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  ArrowRight,
  Mail,
  LogIn,
} from 'lucide-react'
import { toast } from 'sonner'

const useT = createTranslationsHook('auth')

type VerificationStatus = 'loading' | 'success' | 'expired' | 'invalid' | 'error' | 'resent'

export const Route = createFileRoute('/auth/verify-email')({
  head: () => generatePageHead({
    title: 'Verificar Email',
    description: 'Verificação de email AKMLEVA.',
    path: '/auth/verify-email',
    noindex: true,
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    token: (search.token as string) || '',
    status: (search.status as string) || '',
  }),
  component: VerifyEmailPage,
})

function VerifyEmailPage() {
  const t = useT()
  const navigate = useNavigate()
  const { token, status: statusParam } = Route.useSearch()
  const [status, setStatus] = useState<VerificationStatus>('loading')

  useEffect(() => {
    if (token) {
      window.location.href = `/api/auth/verify-email/${token}`
    } else if (statusParam) {
      switch (statusParam) {
        case 'success': setStatus('success'); break
        case 'expired': setStatus('expired'); break
        case 'invalid': setStatus('invalid'); break
        default: setStatus('error')
      }
    } else {
      setStatus('invalid')
    }
  }, [token, statusParam])

  const handleResendVerification = async () => {
    try {
      const res = await fetch('/api/auth/me/verify-email', {
        method: 'POST',
        credentials: 'include',
      })
      if (res.ok) {
        setStatus('resent')
        toast.success('Verification email sent! Check your inbox.')
      } else {
        setStatus('error')
        toast.error('Could not send verification email. Please log in first.')
      }
    } catch {
      setStatus('error')
      toast.error('Failed to send verification email.')
    }
  }

  const renderStatus = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-primary dark:text-primary-300 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('verifyingEmail') || 'Verifying your email...'}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Please wait while we verify your email address.
            </p>
          </div>
        )

      case 'success':
        return (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('emailVerified') || 'Email verified!'}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Your email has been successfully verified. You now have full access.
            </p>
            <Button
              onClick={() => void navigate({ to: '/dashboard' })}
              className="bg-gradient-to-r from-primary to-accent hover:from-primary-700 hover:to-accent-600 text-white gap-2"
            >
              {t('goToDashboard') || 'Go to Dashboard'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )

      case 'expired':
        return (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Clock className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('linkExpired') || 'Link expired'}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              This verification link has expired (valid for 24 hours). Please log in and request a new one.
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                onClick={() => void navigate({ to: '/auth' })}
                variant="outline"
                className="gap-2"
              >
                <LogIn className="w-4 h-4" />
                {t('signIn') || 'Log In'}
              </Button>
            </div>
          </div>
        )

      case 'resent':
        return (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Mail className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('emailSent') || 'Email sent!'}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              We&apos;ve sent a new verification email. Please check your inbox.
            </p>
            <Button
              onClick={() => void navigate({ to: '/auth' })}
              variant="outline"
              className="gap-2"
            >
              {t('backToSignIn') || 'Back to Login'}
            </Button>
          </div>
        )

      case 'invalid':
      case 'error':
      default:
        return (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {status === 'invalid'
                ? (t('invalidLink') || 'Invalid link')
                : (t('verificationFailed') || 'Verification failed')}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              {status === 'invalid'
                ? (t('invalidLinkDesc') || 'This verification link is invalid or missing.')
                : (t('verificationFailedDesc') || 'Something went wrong. Please try again.')}
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                onClick={() => void navigate({ to: '/auth' })}
                variant="outline"
                className="gap-2"
              >
                <LogIn className="w-4 h-4" />
                {t('signIn') || 'Log In'}
              </Button>
              <Button onClick={handleResendVerification} variant="outline" className="gap-2">
                <Mail className="w-4 h-4" />
                {t('resendEmail') || 'Resend Email'}
              </Button>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-cyan-50 to-accent-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 shadow-xl bg-white dark:bg-gray-800">
        <CardContent className="pt-8 pb-8 px-8">
          {renderStatus()}
        </CardContent>
      </Card>
    </div>
  )
}
