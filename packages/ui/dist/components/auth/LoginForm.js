"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Alert, AlertDescription, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Checkbox, Input, Label, } from '@akmleva/ui';
import { Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@akmleva/shared/contexts/auth';
import { cn } from '@akmleva/shared/utils/cn';
import BaseLink from '../common/BaseLink';
// =============================================================================
// Helpers
// =============================================================================
function resolveTranslations(t = {}) {
    return {
        emailLabel: t.emailLabel ?? 'Email',
        emailPlaceholder: t.emailPlaceholder ?? 'seu@email.com',
        passwordLabel: t.passwordLabel ?? 'Senha',
        passwordPlaceholder: t.passwordPlaceholder ?? 'Sua senha',
        submitButton: t.submitButton ?? 'Entrar',
        submittingButton: t.submittingButton ?? 'Entrando...',
        noAccount: t.noAccount ?? 'Não tem uma conta?',
        registerLink: t.registerLink ?? 'Criar conta',
        forgotPassword: t.forgotPassword ?? 'Esqueceu a senha?',
        rememberMe: t.rememberMe ?? 'Lembrar de mim',
        passwordHint: t.passwordHint ?? 'Clique ou mantenha pressionado para mostrar a senha (3 segundos)',
        showPassword: t.showPassword ?? 'Mostrar senha',
        hidePassword: t.hidePassword ?? 'Esconder senha',
    };
}
/** Uses a 3-second auto-hide timer for the password visibility toggle. */
function usePasswordVisibility() {
    const [showPassword, setShowPassword] = useState(false);
    const timeoutRef = useRef(null);
    const isHolding = useRef(false);
    const showTemporarily = useCallback(() => {
        setShowPassword(true);
        if (timeoutRef.current)
            clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            if (!isHolding.current)
                setShowPassword(false);
        }, 3000);
    }, []);
    const onMouseDown = useCallback(() => {
        isHolding.current = true;
        showTemporarily();
    }, [showTemporarily]);
    const onMouseUp = useCallback(() => {
        isHolding.current = false;
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => setShowPassword(false), 100);
        }
    }, []);
    const onClick = useCallback(() => {
        if (!isHolding.current)
            showTemporarily();
    }, [showTemporarily]);
    useEffect(() => () => {
        if (timeoutRef.current)
            clearTimeout(timeoutRef.current);
    }, []);
    return { showPassword, onMouseDown, onMouseUp, onMouseLeave: onMouseUp, onClick };
}
function PasswordToggle({ showPassword, disabled, label, onMouseDown, onMouseUp, onMouseLeave, onClick, }) {
    return (_jsx(Button, { type: "button", variant: "ghost", size: "sm", className: "absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent transition-colors", onMouseDown: onMouseDown, onMouseUp: onMouseUp, onMouseLeave: onMouseLeave, onClick: onClick, disabled: disabled, tabIndex: -1, "aria-label": showPassword ? label.hide : label.show, children: showPassword ? _jsx(EyeOff, { className: "h-4 w-4" }) : _jsx(Eye, { className: "h-4 w-4" }) }));
}
// =============================================================================
// Main Component
// =============================================================================
export const LoginForm = ({ className, cardClassName, title = 'Entrar na sua conta', subtitle = 'Digite suas credenciais para acessar o AKMLEVA', requiredRole: _requiredRole, // reserved for future role-gate logic
redirectPath: _redirectPath, // reserved for future redirect logic
onLoginSuccess, onLoginError, showDemoButtons: _showDemoButtons = false, demoButtons, demoButtonVariant: _demoButtonVariant = 'full', onDemoLogin: _onDemoLogin, showRememberMe = true, showForgotPassword = true, showCreateAccount = true, registerPath = '/register', forgotPasswordPath = '/forgot-password', backLink, variant: _variant = 'default', translations = {}, }) => {
    const tAuth = useTranslations('auth');
    const { login, isLoading, error, clearError } = useAuth();
    const passwordVisibility = usePasswordVisibility();
    const normalizeErrorMessage = (value) => {
        if (typeof value === 'string')
            return value;
        if (value && typeof value === 'object' && 'message' in value) {
            const message = value.message;
            return typeof message === 'string' && message.length > 0
                ? message
                : 'Erro desconhecido';
        }
        return 'Erro desconhecido';
    };
    const safeAuth = (key) => {
        try {
            const value = tAuth(key);
            return typeof value === 'string' && value.length > 0 ? value : undefined;
        }
        catch {
            return undefined;
        }
    };
    const t = resolveTranslations({
        // next-intl defaults (auth namespace)
        emailLabel: safeAuth('email_label'),
        emailPlaceholder: safeAuth('email_placeholder'),
        passwordLabel: safeAuth('password_label'),
        passwordPlaceholder: safeAuth('password_placeholder'),
        submitButton: safeAuth('login.signIn') ?? safeAuth('sign_in'),
        submittingButton: safeAuth('signing_in'),
        noAccount: safeAuth('no_account'),
        registerLink: safeAuth('sign_up.label') ?? safeAuth('create_account'),
        forgotPassword: safeAuth('forgot_password'),
        rememberMe: safeAuth('login.rememberMe') ?? safeAuth('remember_me'),
        showPassword: safeAuth('form.showPassword'),
        // user overrides always win
        ...translations,
    });
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false,
    });
    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };
    const handleTextChange = (e) => {
        handleInputChange(e.target.id, e.target.value);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        clearError();
        try {
            const response = await login(formData);
            // Extract the user fields that onLoginSuccess expects
            if (response?.user && onLoginSuccess) {
                const role = typeof response.user.role === 'string' ? response.user.role : undefined;
                onLoginSuccess({
                    id: String(response.user.id),
                    email: String(response.user.email),
                    name: String(response.user.name ?? response.user.email),
                    ...(role !== undefined && { role }),
                });
            }
        }
        catch (err) {
            const message = err instanceof Error ? err.message : 'Erro desconhecido';
            onLoginError?.(message);
        }
    };
    return (_jsx("div", { className: cn('w-full', className), children: _jsxs(Card, { className: cn('w-full', cardClassName), children: [_jsxs(CardHeader, { className: "space-y-1", children: [_jsx(CardTitle, { className: "text-2xl font-bold text-center", children: title }), _jsx(CardDescription, { className: "text-center", children: subtitle })] }), _jsxs(CardContent, { children: [backLink && (_jsx("div", { className: "mb-4", children: _jsxs(BaseLink, { to: backLink.path, className: "text-sm text-primary hover:underline", children: ["\u2190 ", backLink.text] }) })), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [Boolean(error) && (_jsx(Alert, { variant: "destructive", children: _jsx(AlertDescription, { children: normalizeErrorMessage(error) }) })), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "email", children: t.emailLabel }), _jsxs("div", { className: "relative", children: [_jsx(Mail, { className: "absolute left-3 top-3 h-4 w-4 text-muted-foreground" }), _jsx(Input, { id: "email", type: "email", placeholder: t.emailPlaceholder, value: formData.email, onChange: handleTextChange, className: "pl-10", required: true, disabled: isLoading })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "password", children: t.passwordLabel }), _jsxs("div", { className: "relative", children: [_jsx(Lock, { className: "absolute left-3 top-3 h-4 w-4 text-muted-foreground" }), _jsx(Input, { id: "password", type: passwordVisibility.showPassword ? 'text' : 'password', placeholder: t.passwordPlaceholder, value: formData.password, onChange: handleTextChange, className: "pl-10 pr-10", required: true, disabled: isLoading }), _jsx(PasswordToggle, { showPassword: passwordVisibility.showPassword, disabled: isLoading, label: { show: t.showPassword, hide: t.hidePassword }, onMouseDown: passwordVisibility.onMouseDown, onMouseUp: passwordVisibility.onMouseUp, onMouseLeave: passwordVisibility.onMouseLeave, onClick: passwordVisibility.onClick })] }), _jsx("p", { className: "mt-1 text-xs text-gray-500", children: t.passwordHint })] }), _jsxs("div", { className: "flex items-center justify-between", children: [showRememberMe && (_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Checkbox, { id: "rememberMe", checked: Boolean(formData.rememberMe), onCheckedChange: (checked) => handleInputChange('rememberMe', !!checked), disabled: isLoading }), _jsx(Label, { htmlFor: "rememberMe", className: "text-sm", children: t.rememberMe })] })), showForgotPassword && (_jsx(BaseLink, { to: forgotPasswordPath, className: "text-sm text-primary hover:underline", children: t.forgotPassword }))] }), _jsx(Button, { type: "submit", className: "w-full", disabled: isLoading, children: isLoading ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }), t.submittingButton] })) : (t.submitButton) }), showCreateAccount && (_jsxs("div", { className: "text-center text-sm", children: [_jsxs("span", { className: "text-muted-foreground", children: [t.noAccount, " "] }), _jsx(BaseLink, { to: registerPath, className: "text-primary hover:underline font-medium", children: t.registerLink })] })), demoButtons] })] })] }) }));
};
//# sourceMappingURL=LoginForm.js.map