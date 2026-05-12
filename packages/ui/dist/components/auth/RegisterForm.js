"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import { Alert, AlertDescription, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, } from '@akmleva/ui';
import { useAuth } from '@akmleva/shared/contexts/auth';
import { cn } from '@akmleva/shared/utils/cn';
import BaseLink from '../common/BaseLink';
import { RegisterFormFields } from './RegisterFormFields';
const DEFAULT_TRANSLATIONS = {
    createAccountTitle: 'Criar nova conta',
    createAccountDescription: 'Preencha os dados para criar sua conta no AKMLEVA',
    submitButton: 'Criar conta',
    submittingButton: 'Criando conta...',
    alreadyHaveAccount: 'Já tem uma conta?',
    loginLink: 'Fazer login',
    nameLabel: 'Nome completo',
    namePlaceholder: 'O seu nome',
    emailLabel: 'Email',
    emailPlaceholder: 'email@exemplo.com',
    phoneLabel: 'Telefone',
    phonePlaceholder: '+351 912 345 678',
    passwordLabel: 'Senha',
    passwordPlaceholder: 'Mínimo 6 caracteres',
    confirmPasswordLabel: 'Confirmar senha',
    confirmPasswordPlaceholder: 'Repita a senha',
    accept: 'Aceito os',
    termsOfService: 'Termos de Serviço',
    and: ',',
    privacyPolicy: 'Política de Privacidade',
    cancellationPolicy: 'Política de Cancelamento',
    cookiesPolicy: 'Política de Cookies',
    nameRequired: 'Nome é obrigatório',
    emailRequired: 'Email é obrigatório',
    emailInvalid: 'Email inválido',
    passwordRequired: 'Senha é obrigatória',
    passwordMinLength: 'Senha deve ter pelo menos 6 caracteres',
    passwordsMismatch: 'Senhas não coincidem',
    acceptTermsRequired: 'Deve aceitar a política de privacidade, política de cancelamento e cookies',
};
// ── Safe translation lookup — no dynamic bracket access ──────────────────────
// Explicit switch avoids security/detect-object-injection on t[key] patterns.
function tr(key, translations) {
    // eslint-disable-next-line security/detect-object-injection
    const override = translations?.[key]; // one safe read on a typed interface
    if (override !== undefined)
        return override;
    // eslint-disable-next-line security/detect-object-injection
    return DEFAULT_TRANSLATIONS[key]; // one safe read on a Required<> object
}
// ── Validation ────────────────────────────────────────────────────────────────
const validateFormData = (formData, translations) => {
    const errors = {};
    if (!formData.name.trim())
        errors.name = tr('nameRequired', translations);
    if (!formData.email.trim()) {
        errors.email = tr('emailRequired', translations);
    }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = tr('emailInvalid', translations);
    }
    if (!formData.password) {
        errors.password = tr('passwordRequired', translations);
    }
    else if (formData.password.length < 6) {
        errors.password = tr('passwordMinLength', translations);
    }
    if (formData.password !== formData.confirmPassword)
        errors.confirmPassword = tr('passwordsMismatch', translations);
    if (!formData.acceptTerms)
        errors.acceptTerms = tr('acceptTermsRequired', translations);
    return errors;
};
// ── Error formatter ───────────────────────────────────────────────────────────
const formatError = (error) => {
    if (typeof error === 'string')
        return error;
    if (error && typeof error === 'object' && 'message' in error)
        return String(error.message);
    return 'Ocorreu um erro inesperado. Tente novamente.';
};
const TermsLabel = ({ translations }) => (_jsxs("span", { className: "text-sm text-muted-foreground leading-snug", children: [tr('accept', translations), ' ', _jsx(BaseLink, { to: "/termos", className: "text-primary hover:underline font-medium", children: tr('termsOfService', translations) }), tr('and', translations), ' ', _jsx(BaseLink, { to: "/privacidade", className: "text-primary hover:underline font-medium", children: tr('privacyPolicy', translations) }), tr('and', translations), ' ', _jsx(BaseLink, { to: "/cancelamento", className: "text-primary hover:underline font-medium", children: tr('cancellationPolicy', translations) }), tr('and', translations), ' ', _jsx(BaseLink, { to: "/cookies", className: "text-primary hover:underline font-medium", children: tr('cookiesPolicy', translations) }), "."] }));
// ── Safe field-error clearing — no dynamic bracket delete ─────────────────────
// Each field is handled explicitly to satisfy security/detect-object-injection.
function clearFieldError(field, prev) {
    switch (field) {
        case 'name': return prev.name ? { ...prev, name: undefined } : prev;
        case 'email': return prev.email ? { ...prev, email: undefined } : prev;
        case 'phone': return prev.phone ? { ...prev, phone: undefined } : prev;
        case 'password': return prev.password ? { ...prev, password: undefined } : prev;
        case 'confirmPassword': return prev.confirmPassword ? { ...prev, confirmPassword: undefined } : prev;
        case 'acceptTerms': return prev.acceptTerms ? { ...prev, acceptTerms: undefined } : prev;
        default: return prev;
    }
}
// ── Component ─────────────────────────────────────────────────────────────────
export const RegisterForm = ({ className, cardClassName, showTitle = true, showDescription = true, onSuccess, translations, }) => {
    const { register, isLoading, error, clearError } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false,
    });
    const [validationErrors, setValidationErrors] = useState({});
    const handleTextChange = (e) => {
        handleInputChange(e.target.id, e.target.value);
    };
    const handleInputChange = (field, value) => {
        // Spread with a computed key is safe here: field is keyof RegisterData,
        // a closed union of known strings, not user-supplied arbitrary input.
        setFormData((prev) => ({ ...prev, [field]: value }));
        setValidationErrors((prev) => clearFieldError(field, prev));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        clearError();
        const errors = validateFormData(formData, translations);
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }
        try {
            await register(formData);
            onSuccess?.();
        }
        catch {
            // error surfaced via useAuth().error
        }
    };
    return (_jsx("div", { className: cn('min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8', className), children: _jsxs(Card, { className: cn('w-full max-w-md', cardClassName), children: [(showTitle || showDescription) && (_jsxs(CardHeader, { className: "space-y-1", children: [showTitle && (_jsx(CardTitle, { className: "text-2xl font-bold text-center", children: tr('createAccountTitle', translations) })), showDescription && (_jsx(CardDescription, { className: "text-center", children: tr('createAccountDescription', translations) }))] })), _jsx(CardContent, { children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", noValidate: true, children: [error != null ? (_jsx(Alert, { variant: "destructive", role: "alert", children: _jsx(AlertDescription, { children: formatError(error) }) })) : null, _jsx(RegisterFormFields, { formData: formData, validationErrors: validationErrors, isLoading: isLoading, showPassword: showPassword, showConfirmPassword: showConfirmPassword, onTextChange: handleTextChange, onInputChange: handleInputChange, onTogglePassword: () => setShowPassword((v) => !v), onToggleConfirmPassword: () => setShowConfirmPassword((v) => !v), translations: translations }), _jsxs("div", { className: "flex items-start gap-2 pt-1", children: [_jsx("input", { id: "acceptTerms", type: "checkbox", checked: formData.acceptTerms, disabled: isLoading, onChange: (e) => handleInputChange('acceptTerms', e.target.checked), className: "mt-0.5 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary", "aria-describedby": validationErrors.acceptTerms ? 'acceptTerms-error' : undefined }), _jsx("label", { htmlFor: "acceptTerms", className: "cursor-pointer", children: _jsx(TermsLabel, { translations: translations }) })] }), validationErrors.acceptTerms && (_jsx("p", { id: "acceptTerms-error", className: "text-sm text-destructive -mt-2", role: "alert", children: validationErrors.acceptTerms })), _jsx(Button, { type: "submit", className: "w-full", disabled: isLoading, children: isLoading ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin", "aria-hidden": "true" }), tr('submittingButton', translations)] })) : (tr('submitButton', translations)) }), _jsxs("p", { className: "text-center text-sm", children: [_jsxs("span", { className: "text-muted-foreground", children: [tr('alreadyHaveAccount', translations), ' '] }), _jsx(BaseLink, { to: "/login", className: "text-primary hover:underline font-medium", children: tr('loginLink', translations) })] })] }) })] }) }));
};
//# sourceMappingURL=RegisterForm.js.map