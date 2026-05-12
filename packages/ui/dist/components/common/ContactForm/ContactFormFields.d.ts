import React from 'react';
import type { ContactFormData } from './ContactForm';
import type { ValidationErrors } from './validation/contactFormValidation';
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
export declare const ContactFormFields: React.FC<ContactFormFieldsProps>;
export {};
