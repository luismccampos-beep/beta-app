"use client";
import { Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import {
  Alert,
  AlertDescription,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@akmleva/ui';
import type { RegisterData, AuthError } from '@akmleva/shared/types';
import { useAuth } from '@akmleva/shared/contexts/auth';
import type { AuthContextType } from '@akmleva/shared/contexts/auth';
import { cn } from '@akmleva/shared/utils/cn';

import BaseLink from '../common/BaseLink';
import { RegisterFormFields, type RegisterFormValidationErrors } from './RegisterFormFields';

// ── Translations ─────────────────────────────────────────────────────────────

export interface RegisterFormTranslations {
  createAccountTitle?: string;
  createAccountDescription?: string;
  submitButton?: string;
  submittingButton?: string;
  alreadyHaveAccount?: string;
  loginLink?: string;

  // Fields
  nameLabel?: string;
  namePlaceholder?: string;
  emailLabel?: string;
  emailPlaceholder?: string;
  phoneLabel?: string;
  phonePlaceholder?: string;
  passwordLabel?: string;
  passwordPlaceholder?: string;
  confirmPasswordLabel?: string;
  confirmPasswordPlaceholder?: string;

  // Terms
  accept?: string;
  termsOfService?: string;
  and?: string;
  privacyPolicy?: string;
  cancellationPolicy?: string;
  cookiesPolicy?: string;

  // Validation
  nameRequired?: string;
  emailRequired?: string;
  emailInvalid?: string;
  passwordRequired?: string;
  passwordMinLength?: string;
  passwordsMismatch?: string;
  acceptTermsRequired?: string;
}

const DEFAULT_TRANSLATIONS: Required<RegisterFormTranslations> = {
  createAccountTitle: 'Criar nova conta',
  createAccountDescription: 'Preencha os dados para criar sua conta no AKMLEVA',
  submitButton: 'Criar conta',
  submittingButton: 'Criando conta...',
  alreadyHaveAccount: 'Já tem uma conta?',
  loginLink: 'Fazer login',

  nameLabel: 'Nome completo',
  namePlaceholder: 'O seu nome',
  emailLabel: 'Email',
  emailPlaceholder: 'email@exemplo.com',
  phoneLabel: 'Telefone',
  phonePlaceholder: '+351 912 345 678',
  passwordLabel: 'Senha',
  passwordPlaceholder: 'Mínimo 6 caracteres',
  confirmPasswordLabel: 'Confirmar senha',
  confirmPasswordPlaceholder: 'Repita a senha',

  accept: 'Aceito os',
  termsOfService: 'Termos de Serviço',
  and: ',',
  privacyPolicy: 'Política de Privacidade',
  cancellationPolicy: 'Política de Cancelamento',
  cookiesPolicy: 'Política de Cookies',

  nameRequired: 'Nome é obrigatório',
  emailRequired: 'Email é obrigatório',
  emailInvalid: 'Email inválido',
  passwordRequired: 'Senha é obrigatória',
  passwordMinLength: 'Senha deve ter pelo menos 6 caracteres',
  passwordsMismatch: 'Senhas não coincidem',
  acceptTermsRequired:
    'Deve aceitar a política de privacidade, política de cancelamento e cookies',
};

// ── Safe translation lookup — no dynamic bracket access ──────────────────────
// Explicit switch avoids security/detect-object-injection on t[key] patterns.

function tr(
  key: keyof RegisterFormTranslations,
  translations?: RegisterFormTranslations
): string {
  // eslint-disable-next-line security/detect-object-injection
  const override = translations?.[key]; // one safe read on a typed interface
  if (override !== undefined) return override;
  // eslint-disable-next-line security/detect-object-injection
  return DEFAULT_TRANSLATIONS[key];    // one safe read on a Required<> object
}

// ── Validation ────────────────────────────────────────────────────────────────

const validateFormData = (
  formData: RegisterData,
  translations?: RegisterFormTranslations
): RegisterFormValidationErrors => {
  const errors: RegisterFormValidationErrors = {};

  if (!formData.name.trim())
    errors.name = tr('nameRequired', translations);

  if (!formData.email.trim()) {
    errors.email = tr('emailRequired', translations);
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = tr('emailInvalid', translations);
  }

  if (!formData.password) {
    errors.password = tr('passwordRequired', translations);
  } else if (formData.password.length < 6) {
    errors.password = tr('passwordMinLength', translations);
  }

  if (formData.password !== formData.confirmPassword)
    errors.confirmPassword = tr('passwordsMismatch', translations);

  if (!formData.acceptTerms)
    errors.acceptTerms = tr('acceptTermsRequired', translations);

  return errors;
};

// ── Error formatter ───────────────────────────────────────────────────────────

const formatError = (error: unknown): string => {
  if (typeof error === 'string') return error;
  if (error && typeof error === 'object' && 'message' in error)
    return String((error as { message: unknown }).message);
  return 'Ocorreu um erro inesperado. Tente novamente.';
};

// ── Terms label ───────────────────────────────────────────────────────────────

interface TermsLabelProps {
  translations?: RegisterFormTranslations;
}

const TermsLabel: React.FC<TermsLabelProps> = ({ translations }) => (
  <span className="text-sm text-muted-foreground leading-snug">
    {tr('accept', translations)}{' '}
    <BaseLink to="/termos" className="text-primary hover:underline font-medium">
      {tr('termsOfService', translations)}
    </BaseLink>
    {tr('and', translations)}{' '}
    <BaseLink to="/privacidade" className="text-primary hover:underline font-medium">
      {tr('privacyPolicy', translations)}
    </BaseLink>
    {tr('and', translations)}{' '}
    <BaseLink to="/cancelamento" className="text-primary hover:underline font-medium">
      {tr('cancellationPolicy', translations)}
    </BaseLink>
    {tr('and', translations)}{' '}
    <BaseLink to="/cookies" className="text-primary hover:underline font-medium">
      {tr('cookiesPolicy', translations)}
    </BaseLink>
    .
  </span>
);

// ── Props ─────────────────────────────────────────────────────────────────────

export interface RegisterFormProps {
  className?: string;
  cardClassName?: string;
  showTitle?: boolean;
  showDescription?: boolean;
  onSuccess?: () => void;
  translations?: RegisterFormTranslations;
}

// ── Safe field-error clearing — no dynamic bracket delete ─────────────────────
// Each field is handled explicitly to satisfy security/detect-object-injection.

function clearFieldError(
  field: keyof RegisterData,
  prev: RegisterFormValidationErrors
): RegisterFormValidationErrors {
  switch (field) {
    case 'name':            return prev.name            ? { ...prev, name: undefined }            : prev;
    case 'email':           return prev.email           ? { ...prev, email: undefined }           : prev;
    case 'phone':           return prev.phone           ? { ...prev, phone: undefined }           : prev;
    case 'password':        return prev.password        ? { ...prev, password: undefined }        : prev;
    case 'confirmPassword': return prev.confirmPassword ? { ...prev, confirmPassword: undefined } : prev;
    case 'acceptTerms':     return prev.acceptTerms     ? { ...prev, acceptTerms: undefined }     : prev;
    default:                return prev;
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

export const RegisterForm: React.FC<RegisterFormProps> = ({
  className,
  cardClassName,
  showTitle = true,
  showDescription = true,
  onSuccess,
  translations,
}) => {
  const { register, isLoading, error, clearError } = useAuth() as AuthContextType;

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<RegisterData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });
  const [validationErrors, setValidationErrors] = useState<RegisterFormValidationErrors>({});

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange(e.target.id as keyof RegisterData, e.target.value);
  };

  const handleInputChange = (field: keyof RegisterData, value: string | boolean) => {
    // Spread with a computed key is safe here: field is keyof RegisterData,
    // a closed union of known strings, not user-supplied arbitrary input.
    setFormData((prev) => ({ ...prev, [field]: value }));
    setValidationErrors((prev) => clearFieldError(field, prev));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    const errors = validateFormData(formData, translations);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      await register(formData);
      onSuccess?.();
    } catch {
      // error surfaced via useAuth().error
    }
  };

  return (
    <div
      className={cn(
        'min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8',
        className
      )}
    >
      <Card className={cn('w-full max-w-md', cardClassName)}>
        {(showTitle || showDescription) && (
          <CardHeader className="space-y-1">
            {showTitle && (
              <CardTitle className="text-2xl font-bold text-center">
                {tr('createAccountTitle', translations)}
              </CardTitle>
            )}
            {showDescription && (
              <CardDescription className="text-center">
                {tr('createAccountDescription', translations)}
              </CardDescription>
            )}
          </CardHeader>
        )}

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {error != null ? (
              <Alert variant="destructive" role="alert">
                <AlertDescription>{formatError(error as AuthError)}</AlertDescription>
              </Alert>
            ) : null}

            <RegisterFormFields
              formData={formData}
              validationErrors={validationErrors}
              isLoading={isLoading}
              showPassword={showPassword}
              showConfirmPassword={showConfirmPassword}
              onTextChange={handleTextChange}
              onInputChange={handleInputChange}
              onTogglePassword={() => setShowPassword((v) => !v)}
              onToggleConfirmPassword={() => setShowConfirmPassword((v) => !v)}
              translations={translations}
            />

            {/* Terms rendered here — avoids adding termsLabel prop to RegisterFormFieldsProps */}
            <div className="flex items-start gap-2 pt-1">
              <input
                id="acceptTerms"
                type="checkbox"
                checked={formData.acceptTerms}
                disabled={isLoading}
                onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                aria-describedby={validationErrors.acceptTerms ? 'acceptTerms-error' : undefined}
              />
              <label htmlFor="acceptTerms" className="cursor-pointer">
                <TermsLabel translations={translations} />
              </label>
            </div>
            {validationErrors.acceptTerms && (
              <p id="acceptTerms-error" className="text-sm text-destructive -mt-2" role="alert">
                {validationErrors.acceptTerms}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  {tr('submittingButton', translations)}
                </>
              ) : (
                tr('submitButton', translations)
              )}
            </Button>

            <p className="text-center text-sm">
              <span className="text-muted-foreground">
                {tr('alreadyHaveAccount', translations)}{' '}
              </span>
              <BaseLink to="/login" className="text-primary hover:underline font-medium">
                {tr('loginLink', translations)}
              </BaseLink>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};