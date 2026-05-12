import { Button, Checkbox, Input, Label } from '@akmleva/ui';
import { Eye, EyeOff, Lock, Mail, Phone, User } from 'lucide-react';
import React from 'react';
import type { RegisterData } from '@akmleva/shared/types';

import BaseLink from '../common/BaseLink';

export type RegisterFormValidationErrors = Omit<Partial<RegisterData>, 'acceptTerms'> & {
  acceptTerms?: string;
};

interface TextFieldProps {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: React.ReactNode;
  error?: string | undefined;
  required?: boolean;
  disabled?: boolean;
}

export const TextField: React.FC<TextFieldProps> = ({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
  icon,
  error,
  required = false,
  disabled = false,
}) => (
  <div className='space-y-2'>
    <Label htmlFor={id}>{label}</Label>
    <div className='relative'>
      <div className='absolute left-3 top-3 h-4 w-4 text-muted-foreground'>{icon}</div>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className='pl-10'
        required={required}
        disabled={disabled}
      />
    </div>
    {error && <p className='text-sm text-destructive'>{error}</p>}
  </div>
);

interface PasswordFieldProps {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPassword: boolean;
  onTogglePassword: () => void;
  error?: string | undefined;
  disabled?: boolean;
}

export const PasswordField: React.FC<PasswordFieldProps> = ({
  id,
  label,
  placeholder,
  value,
  onChange,
  showPassword,
  onTogglePassword,
  error,
  disabled = false,
}) => (
  <div className='space-y-2'>
    <Label htmlFor={id}>{label}</Label>
    <div className='relative'>
      <Lock className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
      <Input
        id={id}
        type={showPassword ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className='pl-10 pr-10'
        required
        disabled={disabled}
      />
      <Button
        type='button'
        variant='ghost'
        size='sm'
        className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
        onClick={onTogglePassword}
        disabled={disabled}
        tabIndex={-1}
        aria-label={showPassword ? 'Esconder senha' : 'Mostrar senha'}
      >
        {showPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
      </Button>
    </div>
    {error && <p className='text-sm text-destructive'>{error}</p>}
  </div>
);

interface TermsCheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  error?: string | undefined;
  disabled?: boolean;
  translations?: {
    accept?: string;
    termsOfService?: string;
    and?: string;
    privacyPolicy?: string;
  } | undefined;
}

export const TermsCheckbox: React.FC<TermsCheckboxProps> = ({
  checked,
  onCheckedChange,
  error,
  disabled = false,
  translations,
}) => (
  <div className='space-y-2'>
    <div className='flex items-center space-x-2'>
      <Checkbox
        id='acceptTerms'
        checked={checked}
        onCheckedChange={(checked) => onCheckedChange(!!checked)}
        disabled={disabled}
      />
      <Label htmlFor='acceptTerms' className='text-sm'>
        {translations?.accept || 'Aceito os'}{' '}
        <BaseLink to='/terms' className='text-primary hover:underline'>
          {translations?.termsOfService || 'termos de uso'}
        </BaseLink>{' '}
        {translations?.and || 'e'}{' '}
        <BaseLink to='/privacy' className='text-primary hover:underline'>
          {translations?.privacyPolicy || 'política de privacidade'}
        </BaseLink>
      </Label>
    </div>
    {error && <p className='text-sm text-destructive'>{error}</p>}
  </div>
);

interface RegisterFormFieldsProps {
  formData: RegisterData;
  validationErrors: RegisterFormValidationErrors;
  isLoading: boolean;
  showPassword: boolean;
  showConfirmPassword: boolean;
  onTextChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onInputChange: (field: keyof RegisterData, value: string | boolean) => void;
  onTogglePassword: () => void;
  onToggleConfirmPassword: () => void;
  translations?: {
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
    accept?: string;
    termsOfService?: string;
    and?: string;
    privacyPolicy?: string;
  } | undefined;
}

export const RegisterFormFields: React.FC<RegisterFormFieldsProps> = ({
  formData,
  validationErrors,
  isLoading,
  showPassword,
  showConfirmPassword,
  onTextChange,
  onInputChange,
  onTogglePassword,
  onToggleConfirmPassword,
  translations,
}) => (
  <>
    <TextField
      id='name'
      label={translations?.nameLabel || 'Nome completo'}
      type='text'
      placeholder={translations?.namePlaceholder || 'Seu nome completo'}
      value={formData.name}
      onChange={onTextChange}
      icon={<User className='h-4 w-4' />}
      error={validationErrors.name}
      required
      disabled={isLoading}
    />

    <TextField
      id='email'
      label={translations?.emailLabel || 'Email'}
      type='email'
      placeholder={translations?.emailPlaceholder || 'seu@email.com'}
      value={formData.email}
      onChange={onTextChange}
      icon={<Mail className='h-4 w-4' />}
      error={validationErrors.email}
      required
      disabled={isLoading}
    />

    <TextField
      id='phone'
      label={translations?.phoneLabel || 'Telefone (opcional)'}
      type='tel'
      placeholder={translations?.phonePlaceholder || '(11) 99999-9999'}
      value={formData.phone || ''}
      onChange={onTextChange}
      icon={<Phone className='h-4 w-4' />}
      disabled={isLoading}
    />

    <PasswordField
      id='password'
      label={translations?.passwordLabel || 'Senha'}
      placeholder={translations?.passwordPlaceholder || 'Mínimo 6 caracteres'}
      value={formData.password}
      onChange={onTextChange}
      showPassword={showPassword}
      onTogglePassword={onTogglePassword}
      error={validationErrors.password}
      disabled={isLoading}
    />

    <PasswordField
      id='confirmPassword'
      label={translations?.confirmPasswordLabel || 'Confirmar senha'}
      placeholder={translations?.confirmPasswordPlaceholder || 'Digite a senha novamente'}
      value={formData.confirmPassword}
      onChange={onTextChange}
      showPassword={showConfirmPassword}
      onTogglePassword={onToggleConfirmPassword}
      error={validationErrors.confirmPassword}
      disabled={isLoading}
    />

    <TermsCheckbox
      checked={formData.acceptTerms}
      onCheckedChange={(checked) => onInputChange('acceptTerms', checked)}
      error={validationErrors.acceptTerms}
      disabled={isLoading}
      translations={translations}
    />
  </>
);
