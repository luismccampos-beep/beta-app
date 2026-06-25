'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Checkbox } from '../ui/checkbox';
import { useLocale, useTranslations } from 'next-intl';
import { AppHeader } from '../AppHeader';
import { AppFooter } from '../AppFooter';
type CheckedState = boolean | 'indeterminate';
import {
  Mail,
  Lock,
  User,
  Globe,
  Phone,
  Eye,
  EyeOff,
  Sparkles,
  Shield,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';

type Language = 'en' | 'pt' | 'es' | 'fr';

interface AuthPageProps {
  onLoginSuccess: () => void;
  onBackToHome: () => void;
  onNavigateToLegal?: (pageType: 'terms' | 'privacy' | 'gdpr' | 'cancellations') => void;
}

export function AuthPage({ onLoginSuccess, onBackToHome, onNavigateToLegal }: AuthPageProps) {
  const locale = useLocale();
  const t = useTranslations('auth');
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Register form state
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerBirthDate, setRegisterBirthDate] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const maxBirthDate = useMemo(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginEmail) {
      toast.error(t('emailRequired'));
      return;
    }
    if (!loginPassword) {
      toast.error(t('passwordRequired'));
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await signIn('credentials', {
        email: loginEmail,
        password: loginPassword,
        redirect: false,
      });

      if (result?.error) {
        toast.error(t('loginError') || 'Invalid credentials');
        return;
      }

      toast.success(t('loginSuccess'));
      onLoginSuccess();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!registerEmail) {
      toast.error(t('emailRequired'));
      return;
    }
    if (!registerPassword) {
      toast.error(t('passwordRequired'));
      return;
    }
    if (registerPassword !== registerConfirmPassword) {
      toast.error(t('passwordsMatch'));
      return;
    }
    if (!agreeToTerms) {
      toast.error(t('termsRequired'));
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        credentials: 'include',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          email: registerEmail,
          password: registerPassword,
          name: registerName,
          phone: registerPhone,
          ...(registerBirthDate.trim() ? { birthDate: registerBirthDate.trim() } : {}),
          agreeToTerms,
        }),
      });

      const data = (await res.json().catch(() => ({}))) as { success?: boolean; message?: string };
      if (!res.ok || data.success === false) {
        throw new Error(data.message || 'Registration failed');
      }

      toast.success(t('registerSuccess'));
      onLoginSuccess();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors flex flex-col">
      <AppHeader showBack={false} onBack={onBackToHome} />

      {/* Main Content */}
      <div className="flex-1 w-full max-w-6xl mx-auto px-4 py-6 grid md:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="hidden md:block space-y-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 border border-teal-200 dark:border-gray-600 rounded-full px-4 py-2 shadow-sm">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium text-teal-900 dark:text-teal-300">AI-Powered Travel</span>
            </div>

            <h1 className="text-5xl font-bold text-gray-900 dark:text-white leading-tight">
              {t('hero')}
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              {t('heroDesc')}
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: Shield, key: 'enterpriseSecurity' },
              { icon: Globe, key: 'countriesSupported' },
              { icon: Sparkles, key: 'aiRecommendations' }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-600 to-orange-500 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">{t(item.key)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile feature badges */}
        <div className="flex md:hidden flex-wrap items-center justify-center gap-2 mb-2">
          <div className="inline-flex items-center gap-1.5 bg-white dark:bg-gray-800 border border-teal-200 dark:border-gray-600 rounded-full px-3 py-1.5 shadow-sm">
            <Shield className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{t('enterpriseSecurity')}</span>
          </div>
          <div className="inline-flex items-center gap-1.5 bg-white dark:bg-gray-800 border border-teal-200 dark:border-gray-600 rounded-full px-3 py-1.5 shadow-sm">
            <Globe className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{t('countriesSupported')}</span>
          </div>
          <div className="inline-flex items-center gap-1.5 bg-white dark:bg-gray-800 border border-teal-200 dark:border-gray-600 rounded-full px-3 py-1.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{t('aiRecommendations')}</span>
          </div>
        </div>

        {/* Right Side - Auth Forms */}
        <Card className="border-2 border-gray-200 dark:border-gray-700 shadow-2xl dark:bg-gray-800">
          <CardHeader>
            <Tabs
              value={activeTab}
              onValueChange={(v: string) => {
                if (v === 'login' || v === 'register') setActiveTab(v);
              }}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 h-12">
                <TabsTrigger value="login" className="text-base">
                  {t('login')}
                </TabsTrigger>
                <TabsTrigger value="register" className="text-base">
                  {t('register')}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>

          <CardContent>
            {/* Login Form */}
            {activeTab === 'login' && (
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2 text-center pb-4">
                  <CardTitle className="text-2xl dark:text-white">{t('welcomeBack')}</CardTitle>
                  <CardDescription className="dark:text-gray-400">{t('loginDesc')}</CardDescription>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="dark:text-gray-200">{t('email')}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder={t('emailPlaceholder')}
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="pl-10 h-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="dark:text-gray-200">{t('password')}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="login-password"
                        type={showLoginPassword ? 'text' : 'password'}
                        placeholder={t('passwordPlaceholder')}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="pl-10 pr-10 h-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                      >
                        {showLoginPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember"
                        checked={rememberMe}
                        onCheckedChange={(checked: CheckedState) => setRememberMe(checked === true)}
                      />
                      <Label htmlFor="remember" className="text-sm cursor-pointer dark:text-gray-300">
                        {t('rememberMe')}
                      </Label>
                    </div>
                    <Link
                      href="/forgot-password"
                      className="text-sm text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium"
                    >
                      {t('forgotPassword')}
                    </Link>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 bg-gradient-to-r from-teal-600 to-orange-500 hover:from-teal-700 hover:to-orange-600 text-base gap-2"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      {t('signingIn')}
                    </span>
                  ) : (
                    <>
                      {t('signIn')}
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">{t('continueWith')}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    onClick={() => signIn('google', { redirect: false }).catch(() => toast.error('Google login failed'))}
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    onClick={() => signIn('facebook', { redirect: false }).catch(() => toast.error('Facebook login failed'))}
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Facebook
                  </Button>
                </div>

                <div className="bg-teal-50 dark:bg-gray-700 border border-teal-200 dark:border-gray-600 rounded-lg p-3 flex items-start gap-2">
                  <Shield className="w-5 h-5 text-teal-600 dark:text-teal-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-teal-900 dark:text-teal-300">{t('secureLogin')}</p>
                    <p className="text-xs text-teal-700 dark:text-teal-400">{t('encryptedConnection')}</p>
                  </div>
                </div>
              </form>
            )}

            {/* Register Form */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegister} className="space-y-6">
                <div className="space-y-2 text-center pb-4">
                  <CardTitle className="text-2xl dark:text-white">{t('createAccount')}</CardTitle>
                  <CardDescription className="dark:text-gray-400">{t('registerDesc')}</CardDescription>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name" className="dark:text-gray-200">{t('fullName')}</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="register-name"
                        type="text"
                        placeholder={t('fullNamePlaceholder')}
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                        className="pl-10 h-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        autoComplete="name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email" className="dark:text-gray-200">{t('email')}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder={t('emailPlaceholder')}
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        className="pl-10 h-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-phone" className="dark:text-gray-200">{t('phoneNumber')}</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="register-phone"
                        type="tel"
                        placeholder={t('phonePlaceholder')}
                        value={registerPhone}
                        onChange={(e) => setRegisterPhone(e.target.value)}
                        className="pl-10 h-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        autoComplete="tel"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-birth-date" className="dark:text-gray-200">
                      {t('dateOfBirth')}
                    </Label>
                    <Input
                      id="register-birth-date"
                      type="date"
                      max={maxBirthDate}
                      value={registerBirthDate}
                      onChange={(e) => setRegisterBirthDate(e.target.value)}
                      className="h-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t('dateOfBirthOptional')}</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password" className="dark:text-gray-200">{t('password')}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="register-password"
                        type={showRegisterPassword ? 'text' : 'password'}
                        placeholder={t('passwordPlaceholder')}
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        className="pl-10 pr-10 h-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        aria-label={showRegisterPassword ? 'Hide password' : 'Show password'}
                      >
                        {showRegisterPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-confirm-password" className="dark:text-gray-200">{t('confirmPassword')}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="register-confirm-password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder={t('confirmPasswordPlaceholder')}
                        value={registerConfirmPassword}
                        onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                        className="pl-10 pr-10 h-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={agreeToTerms}
                      onCheckedChange={(checked: CheckedState) => setAgreeToTerms(checked === true)}
                      className="mt-1"
                    />
                    <Label htmlFor="terms" className="text-sm cursor-pointer dark:text-gray-300 leading-relaxed">
                      <span>{t('agreeToTerms')}</span>
                      {onNavigateToLegal && (
                        <span className="ml-1 text-xs">
                          (<button
                            type="button"
                            onClick={() => onNavigateToLegal('terms')}
                            className="text-teal-600 dark:text-teal-400 hover:underline"
                          >
                            {t('legalTerms') || 'Terms'}
                          </button>
                          {' & '}
                          <button
                            type="button"
                            onClick={() => onNavigateToLegal('privacy')}
                            className="text-teal-600 dark:text-teal-400 hover:underline"
                          >
                            {t('legalPrivacy') || 'Privacy'}
                          </button>)
                        </span>
                      )}
                    </Label>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 bg-gradient-to-r from-teal-600 to-orange-500 hover:from-teal-700 hover:to-orange-600 text-base gap-2"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      {t('creatingAccount')}
                    </span>
                  ) : (
                    <>
                      {t('signUp')}
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </Button>

                <div className="bg-teal-50 dark:bg-gray-700 border border-teal-200 dark:border-gray-600 rounded-lg p-3 flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    <p className="text-xs text-gray-700 dark:text-gray-300">✓ {t('freeAccount')}</p>
                    <p className="text-xs text-gray-700 dark:text-gray-300">✓ {t('aiPoweredRecommendations')}</p>
                    <p className="text-xs text-gray-700 dark:text-gray-300">✓ {t('accessDestinations')}</p>
                  </div>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>

      <AppFooter />
    </div>
  );
}