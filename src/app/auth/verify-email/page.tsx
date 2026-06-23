'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { AppHeader } from '../../components/AppHeader';
import { AppFooter } from '../../components/AppFooter';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  ArrowRight,
  Mail,
  LogIn,
} from 'lucide-react';
import { toast } from 'sonner';

type VerificationStatus =
  | 'loading'
  | 'success'
  | 'expired'
  | 'invalid'
  | 'error'
  | 'resent';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<VerificationStatus>('loading');

  useEffect(() => {
    const statusParam = searchParams.get('status');
    const tokenParam = searchParams.get('token');

    if (tokenParam) {
      // Redirect to the API endpoint — the server handles validation & redirects back with status
      window.location.href = `/api/auth/verify-email/${tokenParam}`;
    } else if (statusParam) {
      switch (statusParam) {
        case 'success':
          setStatus('success');
          break;
        case 'expired':
          setStatus('expired');
          break;
        case 'invalid':
          setStatus('invalid');
          break;
        default:
          setStatus('error');
      }
    } else {
      setStatus('invalid');
    }
  }, [searchParams]);

  const handleResendVerification = async () => {
    try {
      const res = await fetch('/api/auth/me/verify-email', {
        method: 'POST',
        credentials: 'include',
      });
      if (res.ok) {
        setStatus('resent');
        toast.success('Verification email sent! Check your inbox.');
      } else {
        // Not logged in or already verified — show appropriate message
        setStatus('error');
        toast.error('Could not send verification email. Please log in first and resend from your dashboard.');
      }
    } catch {
      setStatus('error');
      toast.error('Failed to send verification email.');
    }
  };

  const renderStatus = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-teal-600 dark:text-teal-400 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Verifying your email...
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Please wait while we verify your email address.
            </p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Email verified!
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Your email address has been successfully verified. You now have full
              access to all features.
            </p>
            <Button
              onClick={() => router.push('/dashboard')}
              className="bg-gradient-to-r from-teal-600 to-orange-500 hover:from-teal-700 hover:to-orange-600 text-white gap-2"
            >
              Go to Dashboard
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        );

      case 'expired':
        return (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Clock className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Link expired
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              This verification link has expired (valid for 24 hours). Please
              log in and request a new verification email from your dashboard.
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                onClick={() => router.push('/auth')}
                variant="outline"
                className="gap-2"
              >
                <LogIn className="w-4 h-4" />
                Log In
              </Button>
            </div>
          </div>
        );

      case 'resent':
        return (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Mail className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Email sent!
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              We&apos;ve sent a new verification email. Please check your inbox
              and click the verification link.
            </p>
            <Button
              onClick={() => router.push('/auth')}
              variant="outline"
              className="gap-2"
            >
              Back to Login
            </Button>
          </div>
        );

      case 'invalid':
        return (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Invalid link
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              This verification link is invalid or missing. Please check your
              email for the correct link.
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                onClick={() => router.push('/auth')}
                variant="outline"
                className="gap-2"
              >
                <LogIn className="w-4 h-4" />
                Log In
              </Button>
              <Button onClick={handleResendVerification} variant="outline" className="gap-2">
                <Mail className="w-4 h-4" />
                Resend Email
              </Button>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Verification failed
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Something went wrong while verifying your email. Please try
              again or contact support.
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                onClick={() => router.push('/auth')}
                variant="outline"
                className="gap-2"
              >
                <LogIn className="w-4 h-4" />
                Log In
              </Button>
              <Button onClick={handleResendVerification} variant="outline" className="gap-2">
                <Mail className="w-4 h-4" />
                Resend Email
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors flex flex-col">
      <AppHeader showBack={true} onBack={() => router.push('/')} />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md border-2 border-gray-200 dark:border-gray-700 shadow-2xl dark:bg-gray-800">
          <CardContent className="pt-8 pb-8 px-8">{renderStatus()}</CardContent>
        </Card>
      </div>

      <AppFooter />
    </div>
  );
}
