import React from 'react';
import { Button } from '@akmleva/ui';
import { Shield } from 'lucide-react';

import { cn } from '../../utils/cn';

export interface DemoButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  sublabel?: string;
  icon?: React.ReactNode;
  variant?: 'full' | 'compact';
  isLoading?: boolean;
  credentials?: {
    email: string;
    password: string;
  };
  appUrl?: string;
  emailSelector?: string;
  passwordSelector?: string;
  submitSelector?: string;
}

export interface DemoButtonsProps {
  variant?: 'full' | 'compact';
  onDemoLogin?: (role: 'admin' | 'user' | 'builder') => void | Promise<void>;
  roles?: Array<{
    id: 'admin' | 'user' | 'builder';
    label: string;
    sublabel?: string;
  }>;
}

export const DemoButton: React.FC<DemoButtonProps> = ({
  label,
  sublabel,
  icon,
  variant = 'full',
  isLoading = false,
  className,
  onClick,
  credentials,
  appUrl,
  emailSelector = 'input[type="email"], input[name="email"], input[id="email"]',
  passwordSelector = 'input[type="password"], input[name="password"], input[id="password"]',
  submitSelector = 'button[type="submit"]',
  ...props
}) => {
  // Strip undefined values to satisfy exactOptionalPropertyTypes: true
  const cleanProps = Object.fromEntries(
    Object.entries(props).filter(([k, v]) => k !== 'className' && v !== undefined)
  ) as React.ButtonHTMLAttributes<HTMLButtonElement>;

  const { id, ...cleanPropsWithoutId } = cleanProps;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (appUrl && credentials) {
      const url = new URL(appUrl);
      url.searchParams.set('demo_email', credentials.email);
      url.searchParams.set('demo_password', credentials.password);
      window.open(url.toString(), '_blank');
      return;
    }

    if (credentials) {
      const emailInput = document.querySelector<HTMLInputElement>(emailSelector);
      const passwordInput = document.querySelector<HTMLInputElement>(passwordSelector);

      if (emailInput && passwordInput) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          'value'
        )?.set;

        if (nativeInputValueSetter) {
          nativeInputValueSetter.call(emailInput, credentials.email);
          emailInput.dispatchEvent(new Event('input', { bubbles: true }));
          emailInput.dispatchEvent(new Event('change', { bubbles: true }));

          nativeInputValueSetter.call(passwordInput, credentials.password);
          passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
          passwordInput.dispatchEvent(new Event('change', { bubbles: true }));
        }

        setTimeout(() => {
          const submitButton = document.querySelector<HTMLButtonElement>(submitSelector);
          submitButton?.click();
        }, 100);

        return;
      }
    }

    onClick?.(e);
  };

  if (variant === 'compact') {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={handleClick}
        disabled={isLoading}
        {...cleanPropsWithoutId}
        {...(id ? { id } : {})}
        className={cn('flex items-center gap-2', className) ?? ''}
      >
        {icon || <Shield className="h-4 w-4" />}
        {label}
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      onClick={handleClick}
      disabled={isLoading}
      {...cleanPropsWithoutId}
      {...(id ? { id } : {})}
      className={cn('flex items-center justify-center gap-2 w-full h-auto py-2', className) ?? ''}
    >
      {icon || <Shield className="h-4 w-4" />}
      <div className="text-left flex flex-col">
        <span className="font-medium text-sm leading-none">{label}</span>
        {sublabel && <span className="text-xs opacity-75 mt-1">{sublabel}</span>}
      </div>
    </Button>
  );
};

export const DemoButtons: React.FC<DemoButtonsProps> = ({ variant = 'full', onDemoLogin, roles }) => {
  if (roles && roles.length > 0) {
    return (
      <div className={cn('flex flex-col gap-2', variant === 'compact' ? 'flex-row' : 'w-full')}>
        {roles.map((role) => (
          <DemoButton
            key={role.id}
            label={role.label}
            {...(role.sublabel ? { sublabel: role.sublabel } : {})}
            variant={variant}
            onClick={() => onDemoLogin?.(role.id)}
          />
        ))}
      </div>
    );
  }

  return null;
};