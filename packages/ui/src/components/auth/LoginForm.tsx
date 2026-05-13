"use client";
import {
  Alert,
  AlertDescription,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
  Label,
} from '@akmleva/ui';
import { Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import type { LoginCredentials } from '@akmleva/shared/types';
import { useAuth } from '@akmleva/shared/contexts/auth';
import { cn } from '@akmleva/shared/utils/cn';

import BaseLink from '../common/BaseLink';

// =============================================================================
// Types
// =============================================================================

type TextInputField = Exclude<keyof LoginCredentials, 'rememberMe'>;

export interface LoginFormProps {
  className?: string;
  cardClassName?: string;
  title?: string;
  subtitle?: string;
  requiredRole?: string;
  redirectPath?: string;
  onLoginSuccess?: (user: { id: string; email: string; name: string; role?: string | undefined }) => void;
  onLoginError?: (error: string) => void;
  /** @deprecated use demoButtons prop instead */
  showDemoButtons?: boolean;
  demoButtons?: React.ReactNode;
  demoButtonVariant?: 'full' | 'compact';
  onDemoLogin?: (role: 'admin' | 'user' | 'builder') => void;
  showRememberMe?: boolean;
  showForgotPassword?: boolean;
  showCreateAccount?: boolean;
  registerPath?: string;
  forgotPasswordPath?: string;
  backLink?: { text: string; path: string };
  variant?: 'default' | 'dark';
  translations?: {
    emailLabel?: string;
    emailPlaceholder?: string;
    passwordLabel?: string;
    passwordPlaceholder?: string;
    submitButton?: string;
    submittingButton?: string;
    noAccount?: string;
    registerLink?: string;
    forgotPassword?: string;
    rememberMe?: string;
    passwordHint?: string;
    showPassword?: string;
    hidePassword?: string;
    loginSuccess?: string;
    loginError?: string;
    accessDenied?: string;
    requiredFields?: string;
  };
}

interface ResolvedTranslations {
  emailLabel: string;
  emailPlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  submitButton: string;
  submittingButton: string;
  noAccount: string;
  registerLink: string;
  forgotPassword: string;
  rememberMe: string;
  passwordHint: string;
  showPassword: string;
  hidePassword: string;
}

// =============================================================================
// Helpers
// =============================================================================

function resolveTranslations(
  t: LoginFormProps['translations'] = {},
): ResolvedTranslations {
  return {
    emailLabel:          t.emailLabel          ?? 'Email',
    emailPlaceholder:    t.emailPlaceholder    ?? 'seu@email.com',
    passwordLabel:       t.passwordLabel       ?? 'Senha',
    passwordPlaceholder: t.passwordPlaceholder ?? 'Sua senha',
    submitButton:        t.submitButton        ?? 'Entrar',
    submittingButton:    t.submittingButton    ?? 'Entrando...',
    noAccount:           t.noAccount           ?? 'Não tem uma conta?',
    registerLink:        t.registerLink        ?? 'Criar conta',
    forgotPassword:      t.forgotPassword      ?? 'Esqueceu a senha?',
    rememberMe:          t.rememberMe          ?? 'Lembrar de mim',
    passwordHint:        t.passwordHint        ?? 'Clique ou mantenha pressionado para mostrar a senha (3 segundos)',
    showPassword:        t.showPassword        ?? 'Mostrar senha',
    hidePassword:        t.hidePassword        ?? 'Esconder senha',
  };
}

/** Uses a 3-second auto-hide timer for the password visibility toggle. */
function usePasswordVisibility() {
  const [showPassword, setShowPassword] = useState(false);
  const timeoutRef  = useRef<NodeJS.Timeout | null>(null);
  const isHolding   = useRef(false);

  const showTemporarily = useCallback(() => {
    setShowPassword(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (!isHolding.current) setShowPassword(false);
    }, 3000);
  }, []);

  const onMouseDown = useCallback(() => {
    isHolding.current = true;
    showTemporarily();
  }, [showTemporarily]);

  const onMouseUp = useCallback(() => {
    isHolding.current = false;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setShowPassword(false), 100);
    }
  }, []);

  const onClick = useCallback(() => {
    if (!isHolding.current) showTemporarily();
  }, [showTemporarily]);

  useEffect(() => () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  return { showPassword, onMouseDown, onMouseUp, onMouseLeave: onMouseUp, onClick };
}

// =============================================================================
// Sub-components
// =============================================================================

interface PasswordToggleProps {
  showPassword: boolean;
  disabled: boolean;
  label: { show: string; hide: string };
  onMouseDown: () => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
}

function PasswordToggle({
  showPassword, disabled, label,
  onMouseDown, onMouseUp, onMouseLeave, onClick,
}: PasswordToggleProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent transition-colors"
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      disabled={disabled}
      tabIndex={-1}
      aria-label={showPassword ? label.hide : label.show}
    >
      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </Button>
  );
}

// =============================================================================
// Main Component
// =============================================================================

export const LoginForm: React.FC<LoginFormProps> = ({
  className,
  cardClassName,
  title    = 'Entrar na sua conta',
  subtitle = 'Introduza as suas credenciais para aceder ao AKMLEVA',
  requiredRole: _requiredRole,   // reserved for future role-gate logic
  redirectPath: _redirectPath,   // reserved for future redirect logic
  onLoginSuccess,
  onLoginError,
  showDemoButtons: _showDemoButtons = false,
  demoButtons,
  demoButtonVariant: _demoButtonVariant = 'full',
  onDemoLogin: _onDemoLogin,
  showRememberMe     = true,
  showForgotPassword = true,
  showCreateAccount  = true,
  registerPath       = '/register',
  forgotPasswordPath = '/forgot-password',
  backLink,
  variant: _variant = 'default',
  translations = {},
}) => {
  const tAuth = useTranslations('auth');

  type LoginResponseLike = {
    user?: {
      id?: unknown;
      email?: unknown;
      name?: unknown;
      role?: unknown;
    };
  };

  const { login, isLoading, error, clearError } = useAuth() as {
    login: (credentials: unknown) => Promise<LoginResponseLike>;
    isLoading: boolean;
    error: unknown;
    clearError: () => void;
  };
  const passwordVisibility = usePasswordVisibility();

  const normalizeErrorMessage = (value: unknown): string => {
    if (typeof value === 'string') return value;
    if (value && typeof value === 'object' && 'message' in value) {
      const message = (value as { message?: unknown }).message;
      return typeof message === 'string' && message.length > 0
        ? message
        : 'Erro desconhecido';
    }
    return 'Erro desconhecido';
  };

  const safeAuth = (key: string): string | undefined => {
    try {
      const value = tAuth(key);
      return typeof value === 'string' && value.length > 0 ? value : undefined;
    } catch {
      return undefined;
    }
  };

  const t = resolveTranslations({
    // next-intl defaults (auth namespace)
    emailLabel: safeAuth('email_label'),
    emailPlaceholder: safeAuth('email_placeholder'),
    passwordLabel: safeAuth('password_label'),
    passwordPlaceholder: safeAuth('password_placeholder'),
    submitButton: safeAuth('login.signIn') ?? safeAuth('sign_in'),
    submittingButton: safeAuth('signing_in'),
    noAccount: safeAuth('no_account'),
    registerLink: safeAuth('sign_up.label') ?? safeAuth('create_account'),
    forgotPassword: safeAuth('forgot_password'),
    rememberMe: safeAuth('login.rememberMe') ?? safeAuth('remember_me'),
    showPassword: safeAuth('form.showPassword'),
    // user overrides always win
    ...translations,
  });

  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleInputChange = (field: keyof LoginCredentials, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange(e.target.id as TextInputField, e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      const response = await login(formData);
      // Extract the user fields that onLoginSuccess expects
      if (response?.user && onLoginSuccess) {
        const role = typeof response.user.role === 'string' ? response.user.role : undefined;
        onLoginSuccess({
          id:    String(response.user.id),
          email: String(response.user.email),
          name:  String(response.user.name ?? response.user.email),
          ...(role !== undefined && { role }),
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      onLoginError?.(message);
    }
  };

  return (
    <div
      className={cn(
        'w-full',
        className,
      )}
    >
      <Card className={cn('w-full', cardClassName)}>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">{title}</CardTitle>
          <CardDescription className="text-center">{subtitle}</CardDescription>
        </CardHeader>

        <CardContent>
          {backLink && (
            <div className="mb-4">
              <BaseLink to={backLink.path} className="text-sm text-primary hover:underline">
                ← {backLink.text}
              </BaseLink>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {Boolean(error) && (
              <Alert variant="destructive">
                <AlertDescription>
                  {normalizeErrorMessage(error)}
                </AlertDescription>
              </Alert>
            )}

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">{t.emailLabel}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder={t.emailPlaceholder}
                  value={formData.email}
                  onChange={handleTextChange}
                  className="pl-10"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">{t.passwordLabel}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={passwordVisibility.showPassword ? 'text' : 'password'}
                  placeholder={t.passwordPlaceholder}
                  value={formData.password}
                  onChange={handleTextChange}
                  className="pl-10 pr-10"
                  required
                  disabled={isLoading}
                />
                <PasswordToggle
                  showPassword={passwordVisibility.showPassword}
                  disabled={isLoading}
                  label={{ show: t.showPassword, hide: t.hidePassword }}
                  onMouseDown={passwordVisibility.onMouseDown}
                  onMouseUp={passwordVisibility.onMouseUp}
                  onMouseLeave={passwordVisibility.onMouseLeave}
                  onClick={passwordVisibility.onClick}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">{t.passwordHint}</p>
            </div>

            {/* Remember me + Forgot password */}
            <div className="flex items-center justify-between">
              {showRememberMe && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rememberMe"
                    checked={Boolean(formData.rememberMe)}
                    onCheckedChange={(checked) => handleInputChange('rememberMe', !!checked)}
                    disabled={isLoading}
                  />
                  <Label htmlFor="rememberMe" className="text-sm">{t.rememberMe}</Label>
                </div>
              )}
              {showForgotPassword && (
                <BaseLink to={forgotPasswordPath} className="text-sm text-primary hover:underline">
                  {t.forgotPassword}
                </BaseLink>
              )}
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t.submittingButton}
                </>
              ) : (
                t.submitButton
              )}
            </Button>

            {/* Create account */}
            {showCreateAccount && (
              <div className="text-center text-sm">
                <span className="text-muted-foreground">{t.noAccount} </span>
                <BaseLink to={registerPath} className="text-primary hover:underline font-medium">
                  {t.registerLink}
                </BaseLink>
              </div>
            )}

            {/* Demo Buttons */}
            {/* Note: Ensure demoButtons is destructured from props */}
            {demoButtons}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};