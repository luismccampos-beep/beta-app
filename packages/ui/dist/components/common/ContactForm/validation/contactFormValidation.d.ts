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
export declare const validateField: (name: string, value: string | boolean, t: (key: string, fallback?: string) => string) => string | undefined;
/**
 * Validates all form fields at once
 */
export declare const validateAllFields: (formData: {
    name: string;
    email: string;
    subject: string;
    message: string;
    gdprConsent: boolean;
}, t: (key: string, fallback?: string) => string) => ValidationErrors;
