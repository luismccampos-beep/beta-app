import React from 'react';
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
export declare const ContactForm: React.FC<ContactFormProps>;
/** @alias */
export default ContactForm;
