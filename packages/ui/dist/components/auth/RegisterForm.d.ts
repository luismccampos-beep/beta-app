import React from 'react';
export interface RegisterFormTranslations {
    createAccountTitle?: string;
    createAccountDescription?: string;
    submitButton?: string;
    submittingButton?: string;
    alreadyHaveAccount?: string;
    loginLink?: string;
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
    cancellationPolicy?: string;
    cookiesPolicy?: string;
    nameRequired?: string;
    emailRequired?: string;
    emailInvalid?: string;
    passwordRequired?: string;
    passwordMinLength?: string;
    passwordsMismatch?: string;
    acceptTermsRequired?: string;
}
export interface RegisterFormProps {
    className?: string;
    cardClassName?: string;
    showTitle?: boolean;
    showDescription?: boolean;
    onSuccess?: () => void;
    translations?: RegisterFormTranslations;
}
export declare const RegisterForm: React.FC<RegisterFormProps>;
