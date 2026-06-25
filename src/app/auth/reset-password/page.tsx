'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Lock, Eye, EyeOff, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const t = useTranslations('auth');
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) setError(t('invalidResetLink') || 'Invalid or missing reset token');
  }, [token, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) { setError(t('passwordTooShort') || 'Password must be at least 8 characters'); return; }
    if (password !== confirm) { setError(t('passwordMismatch') || 'Passwords do not match'); return; }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json() as { success?: boolean; error?: string };
      if (!res.ok) throw new Error(data.error || 'Failed to reset password');
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-teal-50 to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
        <Card className="w-full max-w-md border-0 shadow-xl bg-white dark:bg-gray-800">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('invalidResetLink')}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{t('resetLinkExpired')}</p>
            <Button onClick={() => router.push('/forgot-password')} className="bg-gray-900 dark:bg-white dark:text-gray-900 text-white">
              {t('requestNewReset')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-teal-50 to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
        <Card className="w-full max-w-md border-0 shadow-xl bg-white dark:bg-gray-800">
          <CardContent className="p-8 text-center">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('passwordResetSuccess')}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{t('passwordResetSuccessDesc')}</p>
            <Button onClick={() => router.push('/auth')} className="bg-gradient-to-r from-teal-600 to-orange-500 hover:from-teal-700 hover:to-orange-600 text-white">
              {t('signIn')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-teal-50 to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <Card className="w-full max-w-md border-0 shadow-xl bg-white dark:bg-gray-800">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">{t('resetPassword')}</CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{t('chooseNewPassword')}</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('newPassword')}</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('passwordMinChars')}
                  className="pl-9 pr-9 h-12"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" aria-label={showPassword ? t('hidePassword') : t('showPassword')}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="confirm" className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('confirmNewPassword')}</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  id="confirm"
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder={t('passwordReenter')}
                  className="pl-9 h-12"
                  required
                />
              </div>
            </div>
            {error && <p className="text-sm text-red-500 dark:text-red-400">{error}</p>}
            <Button
              type="submit"
              disabled={isSubmitting || !password || !confirm}
              className="w-full h-12 bg-gradient-to-r from-teal-600 to-orange-500 hover:from-teal-700 hover:to-orange-600 text-base gap-2"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
              {isSubmitting ? t('resetting') : t('resetPassword')}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <Link href="/auth" className="text-sm text-teal-600 dark:text-teal-400 hover:underline">
              {t('backToSignIn')}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
