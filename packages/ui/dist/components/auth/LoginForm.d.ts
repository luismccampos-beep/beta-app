import React from 'react';
export interface LoginFormProps {
    className?: string;
    cardClassName?: string;
    title?: string;
    subtitle?: string;
    requiredRole?: string;
    redirectPath?: string;
    onLoginSuccess?: (user: {
        id: string;
        email: string;
        name: string;
        role?: string | undefined;
    }) => void;
    onLoginError?: (error: string) => void;
    /** @deprecated use demoButtons prop instead */
    showDemoButtons?: boolean;
    demoButtons?: React.ReactNode;
    demoButtonVariant?: 'full' | 'compact';
    onDemoLogin?: (role: 'admin' | 'user' | 'builder') => void;
    showRememberMe?: boolean;
    showForgotPassword?: boolean;
    showCreateAccount?: boolean;
    registerPath?: string;
    forgotPasswordPath?: string;
    backLink?: {
        text: string;
        path: string;
    };
    variant?: 'default' | 'dark';
    translations?: {
        emailLabel?: string;
        emailPlaceholder?: string;
        passwordLabel?: string;
        passwordPlaceholder?: string;
        submitButton?: string;
        submittingButton?: string;
        noAccount?: string;
        registerLink?: string;
        forgotPassword?: string;
        rememberMe?: string;
        passwordHint?: string;
        showPassword?: string;
        hidePassword?: string;
        loginSuccess?: string;
        loginError?: string;
        accessDenied?: string;
        requiredFields?: string;
    };
}
export declare const LoginForm: React.FC<LoginFormProps>;
