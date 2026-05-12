import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from '@akmleva/ui';
import { Shield } from 'lucide-react';

import { cn } from '../../utils/cn';
export const DemoButton = ({ label, sublabel, icon, variant = 'full', isLoading = false, className, onClick, credentials, appUrl, emailSelector = 'input[type="email"], input[name="email"], input[id="email"]', passwordSelector = 'input[type="password"], input[name="password"], input[id="password"]', submitSelector = 'button[type="submit"]', ...props }) => {
    // Strip undefined values to satisfy exactOptionalPropertyTypes: true
    const cleanProps = Object.fromEntries(Object.entries(props).filter(([k, v]) => k !== 'className' && v !== undefined));
    const { id, ...cleanPropsWithoutId } = cleanProps;
    const handleClick = (e) => {
        if (appUrl && credentials) {
            const url = new URL(appUrl);
            url.searchParams.set('demo_email', credentials.email);
            url.searchParams.set('demo_password', credentials.password);
            window.open(url.toString(), '_blank');
            return;
        }
        if (credentials) {
            const emailInput = document.querySelector(emailSelector);
            const passwordInput = document.querySelector(passwordSelector);
            if (emailInput && passwordInput) {
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
                if (nativeInputValueSetter) {
                    nativeInputValueSetter.call(emailInput, credentials.email);
                    emailInput.dispatchEvent(new Event('input', { bubbles: true }));
                    emailInput.dispatchEvent(new Event('change', { bubbles: true }));
                    nativeInputValueSetter.call(passwordInput, credentials.password);
                    passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
                    passwordInput.dispatchEvent(new Event('change', { bubbles: true }));
                }
                setTimeout(() => {
                    const submitButton = document.querySelector(submitSelector);
                    submitButton?.click();
                }, 100);
                return;
            }
        }
        onClick?.(e);
    };
    if (variant === 'compact') {
        return (_jsxs(Button, { variant: "outline", size: "sm", onClick: handleClick, disabled: isLoading, ...cleanPropsWithoutId, ...(id ? { id } : {}), className: cn('flex items-center gap-2', className) ?? '', children: [icon || _jsx(Shield, { className: "h-4 w-4" }), label] }));
    }
    return (_jsxs(Button, { variant: "outline", onClick: handleClick, disabled: isLoading, ...cleanPropsWithoutId, ...(id ? { id } : {}), className: cn('flex items-center justify-center gap-2 w-full h-auto py-2', className) ?? '', children: [icon || _jsx(Shield, { className: "h-4 w-4" }), _jsxs("div", { className: "text-left flex flex-col", children: [_jsx("span", { className: "font-medium text-sm leading-none", children: label }), sublabel && _jsx("span", { className: "text-xs opacity-75 mt-1", children: sublabel })] })] }));
};
export const DemoButtons = ({ variant = 'full', onDemoLogin, roles }) => {
    if (roles && roles.length > 0) {
        return (_jsx("div", { className: cn('flex flex-col gap-2', variant === 'compact' ? 'flex-row' : 'w-full'), children: roles.map((role) => (_jsx(DemoButton, { label: role.label, ...(role.sublabel ? { sublabel: role.sublabel } : {}), variant: variant, onClick: () => onDemoLogin?.(role.id) }, role.id))) }));
    }
    return null;
};
//# sourceMappingURL=DemoButtons.js.map