// src/components/contact-form/ContactFormFields.tsx
import { Loader2, Send } from 'lucide-react';
import React from 'react';
import { useTranslations } from 'next-intl';
import {
  Button,
  Checkbox,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@akmleva/ui';
import { cn } from '@akmleva/ui';

import type { ContactFormData } from './ContactForm';
import type { ValidationErrors } from './validation/contactFormValidation';

// Helper component for consistent field layout
const FormField: React.FC<{
  label: string;
  htmlFor: string;
  error?: string;
  isRequired?: boolean;
  children: React.ReactNode;
}> = ({ label, htmlFor, error, isRequired, children }) => (
  <div>
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
      {label} {isRequired && <span className="text-red-500">*</span>}
    </label>
    {children}
    {error && (
      <p id={`${htmlFor}-error`} className="mt-1.5 text-sm text-red-600 dark:text-red-400">
        {error}
      </p>
    )}
  </div>
);

interface ContactFormFieldsProps {
  formData: ContactFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onTravelTypeChange: (value: string) => void;
  onGdprConsentChange: (checked: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  submitMessage: string;
  allErrors: Partial<ValidationErrors>;
  touched: Partial<Record<keyof ContactFormData, boolean>>;
}

// Safe accessors — use Object.entries() to avoid any bracket access with variable keys,
// which satisfies security/detect-object-injection without requiring ES2022.
function isTouched(
  touched: Partial<Record<keyof ContactFormData, boolean>>,
  field: keyof ContactFormData
): boolean {
  return Object.entries(touched).some(([k, v]) => k === field && v === true);
}

function getError(
  errors: Partial<ValidationErrors>,
  field: keyof ValidationErrors
): string | undefined {
  const entry = Object.entries(errors).find(([k]) => k === field);
  return entry ? String(entry[1]) : undefined;
}

// Only fields that exist in both ContactFormData AND ValidationErrors
type SharedField = keyof ContactFormData & keyof ValidationErrors;

export const ContactFormFields: React.FC<ContactFormFieldsProps> = ({
  formData,
  onInputChange,
  onTravelTypeChange,
  onGdprConsentChange,
  onSubmit,
  isSubmitting,
  submitMessage,
  allErrors,
  touched,
}) => {
  const t = useTranslations('form.fields');

  const travelTypes = [
    { value: 'leisure',   label: t('travelType.options.leisure')   },
    { value: 'business',  label: t('travelType.options.business')  },
    { value: 'adventure', label: t('travelType.options.adventure') },
    { value: 'cultural',  label: t('travelType.options.cultural')  },
    { value: 'romantic',  label: t('travelType.options.romantic')  },
    { value: 'family',    label: t('travelType.options.family')    },
  ];

  // Uses safe accessors — no variable key indexing
  const inputStyles = (field: SharedField) => cn(
    "h-12 w-full text-base rounded-md border bg-transparent px-3 py-2 transition-all duration-200",
    "placeholder:text-gray-400 dark:placeholder:text-gray-500",
    "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background dark:focus:ring-offset-gray-900",
    isTouched(touched, field) && getError(allErrors, field)
      ? "border-red-500 text-red-900 focus:ring-red-500 dark:border-red-500 dark:text-red-400"
      : "border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:text-gray-50"
  );

  // For fields that only exist in ContactFormData (not in ValidationErrors), no error styling
  const plainInputStyles = cn(
    "h-12 w-full text-base rounded-md border bg-transparent px-3 py-2 transition-all duration-200",
    "placeholder:text-gray-400 dark:placeholder:text-gray-500",
    "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background dark:focus:ring-offset-gray-900",
    "border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:text-gray-50"
  );

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-2">
        <FormField
          label={t('name.label')}
          htmlFor="name"
          error={isTouched(touched, 'name') ? getError(allErrors, 'name') : undefined}
          isRequired
        >
          <Input
            id="name" name="name" value={formData.name}
            onChange={onInputChange} placeholder={t('name.placeholder')}
            required className={inputStyles('name')} aria-describedby="name-error"
          />
        </FormField>

        <FormField
          label={t('email.label')}
          htmlFor="email"
          error={isTouched(touched, 'email') ? getError(allErrors, 'email') : undefined}
          isRequired
        >
          <Input
            id="email" type="email" name="email" value={formData.email}
            onChange={onInputChange} placeholder={t('email.placeholder')}
            required className={inputStyles('email')} aria-describedby="email-error"
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-2">
        <FormField label={t('phone.label')} htmlFor="phone">
          <Input
            id="phone" name="phone" value={formData.phone}
            onChange={onInputChange} placeholder={t('phone.placeholder')}
            className={plainInputStyles}
          />
        </FormField>

        <FormField label={t('travelType.label')} htmlFor="travelType">
          <Select value={formData.travelType} onValueChange={onTravelTypeChange}>
            <SelectTrigger id="travelType" className={plainInputStyles}>
              <SelectValue placeholder={t('travelType.placeholder')} />
            </SelectTrigger>
            <SelectContent>
              {travelTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
      </div>

      <FormField
        label={t('subject.label')}
        htmlFor="subject"
        error={isTouched(touched, 'subject') ? getError(allErrors, 'subject') : undefined}
        isRequired
      >
        <Input
          id="subject" name="subject" value={formData.subject}
          onChange={onInputChange} placeholder={t('subject.placeholder')}
          required className={inputStyles('subject')} aria-describedby="subject-error"
        />
      </FormField>

      <FormField
        label={t('message.label')}
        htmlFor="message"
        error={isTouched(touched, 'message') ? getError(allErrors, 'message') : undefined}
        isRequired
      >
        <Textarea
          id="message" name="message" value={formData.message}
          onChange={onInputChange} placeholder={t('message.placeholder')}
          rows={5} required
          className={cn(inputStyles('message'), 'min-h-[120px] resize-none')}
          aria-describedby="message-error"
        />
      </FormField>

      <div className={cn(
        "flex items-start gap-3 rounded-lg border p-4",
        isTouched(touched, 'gdprConsent') && getError(allErrors, 'gdprConsent')
          ? "border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/30"
          : "border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-white/5"
      )}>
        <Checkbox
          id="gdprConsent"
          checked={formData.gdprConsent}
          onCheckedChange={(checked) => onGdprConsentChange(checked === true)}
          className="mt-1"
          aria-describedby="gdpr-error"
        />
        <div className="flex-1">
          <label htmlFor="gdprConsent" className="cursor-pointer text-sm leading-relaxed text-gray-700 dark:text-gray-300">
            {t('consent.label')}{' '}
            <a href="/privacidade" className="font-medium text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              {t('consent.privacyLink')}
            </a>{' '}
            {t('consent.and')}
          </label>
          {isTouched(touched, 'gdprConsent') && getError(allErrors, 'gdprConsent') && (
            <p id="gdpr-error" className="mt-1.5 text-sm text-red-600 dark:text-red-400">
              {getError(allErrors, 'gdprConsent')}
            </p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        className="flex w-full h-14 items-center justify-center text-lg font-semibold bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-teal-700 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <Loader2 className="mr-3 h-5 w-5 animate-spin" />
        ) : (
          <Send className="mr-3 h-5 w-5" />
        )}
        {isSubmitting ? t('submitting') : t('submit')}
      </Button>

      {submitMessage && (
        <div className="rounded-lg border bg-green-50 border-green-200 p-4 dark:bg-green-950 dark:border-green-800">
          <p className="text-sm font-medium text-green-800 dark:text-green-300">{submitMessage}</p>
        </div>
      )}
    </form>
  );
};