// src/utils/contactFormValidation.ts

export interface ValidationErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  gdprConsent?: string;
}

/**
 * Validates a single form field and returns an error message if invalid
 */
export const validateField = (
  name: string,
  value: string | boolean,
  t: (key: string, fallback?: string) => string
): string | undefined => {
  switch (name) {
    case 'name':
      if (!value || (typeof value === 'string' && value.trim().length < 2)) {
        return t(
          'form.validation.name.required',
          'Nome é obrigatório (mín. 2 caracteres)'
        );
      }
      break;
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value || (typeof value === 'string' && !emailRegex.test(value))) {
        return t('form.validation.email.invalid', 'Email inválido');
      }
      break;
    case 'subject':
      if (!value || (typeof value === 'string' && value.trim().length < 3)) {
        return t(
          'form.validation.subject.required',
          'Assunto é obrigatório (mín. 3 caracteres)'
        );
      }
      break;
    case 'message':
      if (!value || (typeof value === 'string' && value.trim().length < 10)) {
        return t(
          'form.validation.message.required',
          'Mensagem é obrigatória (mín. 10 caracteres)'
        );
      }
      break;
    case 'gdprConsent':
      if (!value) {
        return t(
          'form.validation.gdprConsent.required',
          'Deve aceitar a política de privacidade'
        );
      }
      break;
  }
  return undefined;
};

/**
 * Validates all form fields at once
 */
export const validateAllFields = (
  formData: {
    name: string;
    email: string;
    subject: string;
    message: string;
    gdprConsent: boolean;
  },
  t: (key: string, fallback?: string) => string
): ValidationErrors => {
  const errors: ValidationErrors = {};

  const nameError = validateField('name', formData.name, t);
  if (nameError) errors.name = nameError;

  const emailError = validateField('email', formData.email, t);
  if (emailError) errors.email = emailError;

  const subjectError = validateField('subject', formData.subject, t);
  if (subjectError) errors.subject = subjectError;

  const messageError = validateField('message', formData.message, t);
  if (messageError) errors.message = messageError;

  const gdprError = validateField('gdprConsent', formData.gdprConsent, t);
  if (gdprError) errors.gdprConsent = gdprError;

  return errors;
};
