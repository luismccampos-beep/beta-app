import React from 'react';
import type { RegisterData } from '@akmleva/shared/types';
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
export declare const TextField: React.FC<TextFieldProps>;
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
export declare const PasswordField: React.FC<PasswordFieldProps>;
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
export declare const TermsCheckbox: React.FC<TermsCheckboxProps>;
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
export declare const RegisterFormFields: React.FC<RegisterFormFieldsProps>;
export {};
