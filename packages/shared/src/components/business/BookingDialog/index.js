"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Users, CreditCard, MapPin, Clock } from 'lucide-react';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui';
import { Button } from '../../ui';
import { cn } from '../../../utils';
const INITIAL_FORM_DATA = {
    date: '',
    timeSlot: '',
    participants: 1,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequests: '',
    termsAccepted: false
};
// Step Indicator Component
const StepIndicator = ({ currentStep, showSteps }) => {
    if (!showSteps)
        return null;
    const steps = [
        { id: 'details', label: 'Detalhes' },
        { id: 'form', label: 'Informações' },
        { id: 'confirmation', label: 'Confirmação' }
    ];
    const getCurrentStepIndex = () => steps.findIndex(step => step.id === currentStep);
    return (_jsx("div", { className: "flex items-center justify-center mb-6", children: steps.map((step, index) => {
            const currentIndex = getCurrentStepIndex();
            const isActive = currentStep === step.id;
            const isCompleted = currentIndex > index;
            return (_jsxs(React.Fragment, { children: [_jsx("div", { className: cn('flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors', isActive && 'bg-primary text-primary-foreground', isCompleted && !isActive && 'bg-muted text-muted-foreground', !isActive && !isCompleted && 'bg-primary/20 text-primary'), children: index + 1 }), index < steps.length - 1 && (_jsx("div", { className: cn('w-8 h-0.5 transition-colors', currentIndex > index ? 'bg-primary' : 'bg-muted') }))] }, step.id));
        }) }));
};
// Details Step Component
const DetailsStep = ({ booking, formatPrice, currency, onContinue }) => (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-start gap-4", children: [_jsx("div", { className: "w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center", children: _jsx(Calendar, { className: "h-8 w-8 text-primary" }) }), _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "font-semibold text-lg", children: booking.title }), booking.description && (_jsx("p", { className: "text-muted-foreground mt-1", children: booking.description }))] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [booking.duration && (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Clock, { className: "h-4 w-4 text-muted-foreground" }), _jsxs("span", { className: "text-sm", children: ["Dura\u00E7\u00E3o: ", booking.duration] })] })), booking.capacity && (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Users, { className: "h-4 w-4 text-muted-foreground" }), _jsxs("span", { className: "text-sm", children: ["Capacidade: ", booking.capacity, " pessoas"] })] })), booking.location && (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(MapPin, { className: "h-4 w-4 text-muted-foreground" }), _jsxs("span", { className: "text-sm", children: ["Local: ", booking.location] })] })), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(CreditCard, { className: "h-4 w-4 text-muted-foreground" }), _jsxs("span", { className: "text-sm font-semibold", children: ["Pre\u00E7o: ", formatPrice(booking.price, currency)] })] })] }), (booking.included?.length || booking.excluded?.length) && (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [booking.included && booking.included.length > 0 && (_jsxs("div", { children: [_jsx("h4", { className: "font-medium mb-2 text-green-600", children: "Inclu\u00EDdo" }), _jsx("ul", { className: "text-sm space-y-1", children: booking.included.map((item, index) => (_jsxs("li", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-1.5 h-1.5 bg-green-600 rounded-full" }), item] }, index))) })] })), booking.excluded && booking.excluded.length > 0 && (_jsxs("div", { children: [_jsx("h4", { className: "font-medium mb-2 text-red-600", children: "N\u00E3o inclu\u00EDdo" }), _jsx("ul", { className: "text-sm space-y-1", children: booking.excluded.map((item, index) => (_jsxs("li", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-1.5 h-1.5 bg-red-600 rounded-full" }), item] }, index))) })] }))] })), _jsx(Button, { onClick: onContinue, className: "w-full", size: "lg", children: "Continuar" })] }));
// Form Step Component
const FormStep = ({ booking, formData, setFormData, loading, customFields, onSubmit, isFormValid }) => (_jsxs("form", { onSubmit: onSubmit, className: "space-y-4", children: [booking.availability && (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Data" }), _jsxs("select", { value: formData.date, onChange: (e) => setFormData(prev => ({ ...prev, date: e.target.value })), className: "w-full p-3 border rounded-md bg-background", required: true, children: [_jsx("option", { value: "", children: "Selecione uma data" }), booking.availability.dates.map(date => (_jsx("option", { value: date, children: date }, date)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Hor\u00E1rio" }), _jsxs("select", { value: formData.timeSlot, onChange: (e) => setFormData(prev => ({ ...prev, timeSlot: e.target.value })), className: "w-full p-3 border rounded-md bg-background", required: true, children: [_jsx("option", { value: "", children: "Selecione um hor\u00E1rio" }), booking.availability.timeSlots.map(slot => (_jsx("option", { value: slot, children: slot }, slot)))] })] })] })), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "N\u00FAmero de Participantes" }), _jsx("input", { type: "number", min: "1", max: booking.capacity || 10, value: formData.participants, onChange: (e) => setFormData(prev => ({ ...prev, participants: parseInt(e.target.value, 10) })), className: "w-full p-3 border rounded-md bg-background", required: true })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Nome" }), _jsx("input", { type: "text", value: formData.firstName, onChange: (e) => setFormData(prev => ({ ...prev, firstName: e.target.value })), className: "w-full p-3 border rounded-md bg-background", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Sobrenome" }), _jsx("input", { type: "text", value: formData.lastName, onChange: (e) => setFormData(prev => ({ ...prev, lastName: e.target.value })), className: "w-full p-3 border rounded-md bg-background", required: true })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "E-mail" }), _jsx("input", { type: "email", value: formData.email, onChange: (e) => setFormData(prev => ({ ...prev, email: e.target.value })), className: "w-full p-3 border rounded-md bg-background", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Telefone" }), _jsx("input", { type: "tel", value: formData.phone, onChange: (e) => setFormData(prev => ({ ...prev, phone: e.target.value })), className: "w-full p-3 border rounded-md bg-background", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Pedidos Especiais (opcional)" }), _jsx("textarea", { value: formData.specialRequests, onChange: (e) => setFormData(prev => ({ ...prev, specialRequests: e.target.value })), className: "w-full p-3 border rounded-md bg-background min-h-[100px]", placeholder: "Informe-nos sobre necessidades especiais ou prefer\u00EAncias..." })] }), customFields, _jsxs("div", { className: "flex items-start gap-2", children: [_jsx("input", { type: "checkbox", id: "terms", checked: formData.termsAccepted, onChange: (e) => setFormData(prev => ({ ...prev, termsAccepted: e.target.checked })), className: "mt-1", required: true }), _jsx("label", { htmlFor: "terms", className: "text-sm text-muted-foreground", children: "Aceito os termos e condi\u00E7\u00F5es e a pol\u00EDtica de privacidade" })] }), _jsx(Button, { type: "submit", disabled: !isFormValid() || loading, className: "w-full", size: "lg", children: loading ? 'Processando...' : 'Confirmar Reserva' })] }));
// Confirmation Step Component
const ConfirmationStep = ({ booking, formData, formatPrice, currency, onClose }) => (_jsxs("div", { className: "text-center space-y-6", children: [_jsx("div", { className: "w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto", children: _jsx("div", { className: "w-8 h-8 bg-green-600 rounded-full flex items-center justify-center", children: _jsx("svg", { className: "w-4 h-4 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }) }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-xl font-semibold mb-2", children: "Reserva Confirmada!" }), _jsx("p", { className: "text-muted-foreground", children: "Sua reserva foi confirmada com sucesso. Enviaremos um e-mail com todos os detalhes." })] }), _jsxs("div", { className: "bg-muted/50 rounded-lg p-4 text-left", children: [_jsx("h4", { className: "font-medium mb-2", children: "Resumo da Reserva" }), _jsxs("div", { className: "space-y-2 text-sm", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Servi\u00E7o:" }), _jsx("span", { className: "font-medium", children: booking.title })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Data:" }), _jsx("span", { className: "font-medium", children: formData.date })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Hor\u00E1rio:" }), _jsx("span", { className: "font-medium", children: formData.timeSlot })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Participantes:" }), _jsx("span", { className: "font-medium", children: formData.participants })] }), _jsxs("div", { className: "flex justify-between font-semibold text-base pt-2 border-t", children: [_jsx("span", { children: "Total:" }), _jsx("span", { children: formatPrice(booking.price * formData.participants, currency) })] })] })] }), _jsx(Button, { onClick: onClose, className: "w-full", children: "Fechar" })] }));
// Main Component
export const BookingDialog = ({ isOpen, onClose, booking, onSubmit, loading = false, currency = 'BRL', locale = 'pt-PT', className, showSteps = true, customFields }) => {
    const [currentStep, setCurrentStep] = React.useState('details');
    const [formData, setFormData] = React.useState(INITIAL_FORM_DATA);
    const formatPrice = React.useCallback((price, curr) => {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: curr
        }).format(price);
    }, [locale]);
    const isFormValid = React.useCallback(() => {
        return Boolean(formData.date &&
            formData.timeSlot &&
            formData.firstName &&
            formData.lastName &&
            formData.email &&
            formData.phone &&
            formData.termsAccepted);
    }, [formData]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await onSubmit(formData);
            if (showSteps) {
                setCurrentStep('confirmation');
            }
        }
        catch (error) {
            console.error('Booking error:', error);
        }
    };
    const resetForm = React.useCallback(() => {
        setFormData(INITIAL_FORM_DATA);
        setCurrentStep('details');
    }, []);
    const handleClose = React.useCallback(() => {
        resetForm();
        onClose();
    }, [resetForm, onClose]);
    return (_jsx(AnimatePresence, { children: isOpen && (_jsx(Dialog, { open: isOpen, onOpenChange: handleClose, children: _jsxs(DialogContent, { className: cn('max-w-2xl w-full max-h-[90vh] overflow-y-auto', className), children: [_jsx(DialogHeader, { children: _jsxs(DialogTitle, { className: "flex items-center justify-between", children: [_jsx("span", { children: "Fazer Reserva" }), _jsx("button", { onClick: handleClose, className: "rounded-full p-2 hover:bg-muted transition-colors", "aria-label": "Fechar", children: _jsx(X, { className: "h-4 w-4" }) })] }) }), _jsx(StepIndicator, { currentStep: currentStep, showSteps: showSteps }), _jsxs(motion.div, { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -20 }, transition: { duration: 0.3 }, children: [currentStep === 'details' && (_jsx(DetailsStep, { booking: booking, formatPrice: formatPrice, currency: currency, onContinue: () => setCurrentStep('form') })), currentStep === 'form' && (_jsx(FormStep, { booking: booking, formData: formData, setFormData: setFormData, loading: loading, customFields: customFields, onSubmit: handleSubmit, isFormValid: isFormValid })), currentStep === 'confirmation' && (_jsx(ConfirmationStep, { booking: booking, formData: formData, formatPrice: formatPrice, currency: currency, onClose: handleClose }))] }, currentStep)] }) })) }));
};
/** @alias */
export default BookingDialog;
//# sourceMappingURL=index.js.map