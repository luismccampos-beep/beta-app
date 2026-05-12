"use client";

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';

import { ContactFormFields } from './ContactFormFields';
import type { ValidationErrors } from './validation/contactFormValidation';
import { ContactSidebar } from './ContactSidebar';
import { validateField } from './validation/contactFormValidation';

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  travelType: string;
  gdprConsent: boolean;
}

interface ContactFormProps {
  formData: ContactFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onTravelTypeChange: (value: string) => void;
  onGdprConsentChange: (checked: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  submitMessage: string;
  errors?: Partial<Record<keyof ContactFormData, string>>;
}

export const ContactForm: React.FC<ContactFormProps> = ({
  formData,
  onInputChange,
  onTravelTypeChange,
  onGdprConsentChange,
  onSubmit,
  isSubmitting,
  submitMessage,
  errors: externalErrors,
}) => {
  const t = useTranslations('form');
  // Hoisted to component level — hooks must not be called inside regular functions
  const tFields = useTranslations('form.fields');

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof ContactFormData, boolean>>>({});

  const allErrors = { ...errors, ...externalErrors };

  // Wrap tFields into the signature validateField expects: (key: string) => string
  const tFieldsFn = (key: string): string => tFields(key);

  const handleValidation = (name: string, value: string | boolean) => {
    const newErrors = { ...errors };
    const error = validateField(name, value, tFieldsFn);

    if (error) {
      newErrors[name as keyof ValidationErrors] = error;
    } else {
      delete newErrors[name as keyof ValidationErrors];
    }

    setErrors(newErrors);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onInputChange(e);
    setTouched((prev) => ({ ...prev, [name]: true }));
    handleValidation(name, value);
  };

  const handleGdprChange = (checked: boolean) => {
    onGdprConsentChange(checked);
    setTouched((prev) => ({ ...prev, gdprConsent: true }));
    handleValidation('gdprConsent', checked);
  };

  return (
    <div className="mx-auto w-full max-w-6xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900/50 dark:shadow-2xl dark:backdrop-blur-sm">
      <div className="flex flex-col lg:flex-row">
        <ContactSidebar />

        {/* Main form section */}
        <div className="p-6 sm:p-8 lg:w-3/5 lg:p-12">
          <div className="mb-8">
            <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-50 sm:text-3xl">
              {t('title')}
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-400 sm:text-lg">
              {t('subtitle')}
            </p>
          </div>

          <ContactFormFields
            formData={formData}
            onInputChange={handleInputChange}
            onTravelTypeChange={onTravelTypeChange}
            onGdprConsentChange={handleGdprChange}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            submitMessage={submitMessage}
            allErrors={allErrors}
            touched={touched}
          />
        </div>
      </div>
    </div>
  );
};

/** @alias */
export default ContactForm;