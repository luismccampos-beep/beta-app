"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ContactFormFields } from './ContactFormFields';
import { ContactSidebar } from './ContactSidebar';
import { validateField } from './validation/contactFormValidation';
export const ContactForm = ({ formData, onInputChange, onTravelTypeChange, onGdprConsentChange, onSubmit, isSubmitting, submitMessage, errors: externalErrors, }) => {
    const t = useTranslations('form');
    // Hoisted to component level — hooks must not be called inside regular functions
    const tFields = useTranslations('form.fields');
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const allErrors = { ...errors, ...externalErrors };
    // Wrap tFields into the signature validateField expects: (key: string) => string
    const tFieldsFn = (key) => tFields(key);
    const handleValidation = (name, value) => {
        const newErrors = { ...errors };
        const error = validateField(name, value, tFieldsFn);
        if (error) {
            newErrors[name] = error;
        }
        else {
            delete newErrors[name];
        }
        setErrors(newErrors);
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        onInputChange(e);
        setTouched((prev) => ({ ...prev, [name]: true }));
        handleValidation(name, value);
    };
    const handleGdprChange = (checked) => {
        onGdprConsentChange(checked);
        setTouched((prev) => ({ ...prev, gdprConsent: true }));
        handleValidation('gdprConsent', checked);
    };
    return (_jsx("div", { className: "mx-auto w-full max-w-6xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900/50 dark:shadow-2xl dark:backdrop-blur-sm", children: _jsxs("div", { className: "flex flex-col lg:flex-row", children: [_jsx(ContactSidebar, {}), _jsxs("div", { className: "p-6 sm:p-8 lg:w-3/5 lg:p-12", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h2", { className: "mb-2 text-2xl font-bold text-gray-900 dark:text-gray-50 sm:text-3xl", children: t('title') }), _jsx("p", { className: "text-base text-gray-600 dark:text-gray-400 sm:text-lg", children: t('subtitle') })] }), _jsx(ContactFormFields, { formData: formData, onInputChange: handleInputChange, onTravelTypeChange: onTravelTypeChange, onGdprConsentChange: handleGdprChange, onSubmit: onSubmit, isSubmitting: isSubmitting, submitMessage: submitMessage, allErrors: allErrors, touched: touched })] })] }) }));
};
/** @alias */
export default ContactForm;
//# sourceMappingURL=ContactForm.js.map