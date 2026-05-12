"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * BookingForm - Unified Booking Form Component for Shared Package
 */
import { useState, useCallback, useMemo } from 'react';
import { Calendar, Users, Mail, Phone, MapPin, DollarSign, Send, Loader2 } from 'lucide-react';
import { Button } from '@akmleva/ui';
import { cn } from '../../../utils/cn';
// =============================================================================
// Constants
// =============================================================================
const DEFAULT_DESTINATIONS = [
    {
        id: 'lisboa',
        name: 'Lisboa',
        country: 'Portugal',
        region: 'Lisboa',
        type: 'city',
        bestSeason: ['spring', 'fall'],
        averagePrice: 150,
        popularity: 95,
        description: 'Capital de Portugal',
        lat: 38.7223,
        lon: -9.1393,
    },
    {
        id: 'porto',
        name: 'Porto',
        country: 'Portugal',
        region: 'Norte',
        type: 'city',
        bestSeason: ['spring', 'summer'],
        averagePrice: 120,
        popularity: 90,
        description: 'Cidade do vinho do Porto',
        lat: 41.1579,
        lon: -8.6291,
    },
    {
        id: 'algarve',
        name: 'Algarve',
        country: 'Portugal',
        region: 'Algarve',
        type: 'beach',
        bestSeason: ['summer'],
        averagePrice: 180,
        popularity: 85,
        description: 'Região de praias paradisíacas',
        lat: 37.0179,
        lon: -7.9318,
    },
];
const TRAVEL_TYPES = [
    { value: 'adventure', label: 'Aventura' },
    { value: 'cultural', label: 'Cultural' },
    { value: 'relax', label: 'Relaxamento' },
    { value: 'romantic', label: 'Romântico' },
    { value: 'family', label: 'Família' },
    { value: 'business', label: 'Negócios' },
];
const BUDGET_RANGES = [
    { value: 'economy', label: 'Económico (até €500)' },
    { value: 'moderate', label: 'Moderado (€500-€1500)' },
    { value: 'premium', label: 'Premium (€1500-€3000)' },
    { value: 'luxury', label: 'Luxo (acima de €3000)' },
];
const INITIAL_FORM_DATA = {
    destination: '',
    dateRange: { from: undefined, to: undefined },
    travelers: '2',
    name: '',
    email: '',
    phone: '',
    travelType: '',
    budget: '',
    message: '',
};
const FIELDS_TO_VALIDATE = [
    'destination', 'name', 'email', 'phone', 'travelers',
];
// =============================================================================
// Validation
// =============================================================================
function validateField(field, value) {
    switch (field) {
        case 'destination':
            return typeof value === 'string' && value.trim().length >= 2
                ? { isValid: true }
                : { isValid: false, message: 'Destino é obrigatório' };
        case 'name':
            return typeof value === 'string' && value.trim().length >= 2
                ? { isValid: true }
                : { isValid: false, message: 'Nome é obrigatório' };
        case 'email':
            return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                ? { isValid: true }
                : { isValid: false, message: 'Email inválido' };
        case 'phone':
            return typeof value === 'string' && value.trim().length >= 9
                ? { isValid: true }
                : { isValid: false, message: 'Telefone é obrigatório' };
        case 'travelers':
            return typeof value === 'string' && parseInt(value, 10) >= 1
                ? { isValid: true }
                : { isValid: false, message: 'Número de viajantes inválido' };
        default:
            return { isValid: true };
    }
}
function validateAll(data) {
    const errors = {};
    for (const field of FIELDS_TO_VALIDATE) {
        // eslint-disable-next-line security/detect-object-injection
        const result = validateField(field, data[field]);
        if (!result.isValid && result.message) {
            // Explicit switch — no computed key / object injection
            switch (field) {
                case 'destination':
                    errors.destination = result.message;
                    break;
                case 'name':
                    errors.name = result.message;
                    break;
                case 'email':
                    errors.email = result.message;
                    break;
                case 'phone':
                    errors.phone = result.message;
                    break;
                case 'travelers':
                    errors.travelers = result.message;
                    break;
            }
        }
    }
    return errors;
}
// =============================================================================
// Sub-components
// =============================================================================
function FormField({ id, label, value, onChange, placeholder, type = 'text', error, icon, disabled, }) {
    return (_jsxs("div", { className: "space-y-1", children: [_jsx("label", { htmlFor: id, className: "block text-sm font-medium text-gray-700", children: label }), _jsxs("div", { className: "relative", children: [icon && (_jsx("div", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400", children: icon })), _jsx("input", { id: id, type: type, value: value, onChange: (e) => onChange(e.target.value), placeholder: placeholder, disabled: disabled, className: cn('w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500', icon && 'pl-10', error ? 'border-red-500' : 'border-gray-300', disabled && 'opacity-50 cursor-not-allowed') })] }), error && _jsx("p", { className: "text-sm text-red-600", children: error })] }));
}
// ---------------------------------------------------------------------------
function DestinationField({ value, error, loading, suggestions, showSuggestions, onChange, onFocus, onBlur, onSelect, }) {
    return (_jsxs("div", { className: "space-y-1 relative", children: [_jsx("label", { htmlFor: "destination", className: "block text-sm font-medium text-gray-700", children: "Destino" }), _jsxs("div", { className: "relative", children: [_jsx(MapPin, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" }), _jsx("input", { id: "destination", type: "text", value: value, onChange: (e) => onChange(e.target.value), onFocus: onFocus, onBlur: onBlur, placeholder: "Para onde deseja ir?", disabled: loading, className: cn('w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500', error ? 'border-red-500' : 'border-gray-300') }), showSuggestions && suggestions.length > 0 && (_jsx("ul", { className: "absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-48 overflow-auto shadow-lg", children: suggestions.map((dest) => (_jsxs("li", { onClick: () => onSelect(dest), className: "px-4 py-2 hover:bg-blue-50 cursor-pointer", children: [_jsx("div", { className: "font-medium", children: dest.name }), _jsxs("div", { className: "text-sm text-gray-500", children: [dest.country, " \u2014 ", dest.type] })] }, dest.id))) }))] }), error && _jsx("p", { className: "text-sm text-red-600", children: error })] }));
}
// ---------------------------------------------------------------------------
function DateRangeFields({ dateRange, loading, onChange }) {
    const toInputValue = (d) => d ? d.toISOString().split('T')[0] : '';
    // Explicit handlers — avoids computed `[key]` object injection
    const handleFromChange = (raw) => onChange({ ...dateRange, from: raw ? new Date(raw) : undefined });
    const handleToChange = (raw) => onChange({ ...dateRange, to: raw ? new Date(raw) : undefined });
    return (_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-1", children: [_jsx("label", { htmlFor: "date-from", className: "block text-sm font-medium text-gray-700", children: "Data de Ida" }), _jsxs("div", { className: "relative", children: [_jsx(Calendar, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" }), _jsx("input", { id: "date-from", type: "date", value: toInputValue(dateRange.from), onChange: (e) => handleFromChange(e.target.value), disabled: loading, className: "w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" })] })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { htmlFor: "date-to", className: "block text-sm font-medium text-gray-700", children: "Data de Volta" }), _jsxs("div", { className: "relative", children: [_jsx(Calendar, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" }), _jsx("input", { id: "date-to", type: "date", value: toInputValue(dateRange.to), onChange: (e) => handleToChange(e.target.value), disabled: loading, className: "w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" })] })] })] }));
}
// ---------------------------------------------------------------------------
function SelectField({ id, label, value, onChange, options, placeholder, loading, icon }) {
    return (_jsxs("div", { className: "space-y-1", children: [_jsx("label", { htmlFor: id, className: "block text-sm font-medium text-gray-700", children: label }), _jsxs("div", { className: "relative", children: [icon && (_jsx("div", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none", children: icon })), _jsxs("select", { id: id, value: value, onChange: (e) => onChange(e.target.value), disabled: loading, className: cn('w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500', icon && 'pl-10'), children: [_jsx("option", { value: "", children: placeholder }), options.map((opt) => (_jsx("option", { value: opt.value, children: opt.label }, opt.value)))] })] })] }));
}
// =============================================================================
// Main Component
// =============================================================================
const BookingFormComponent = ({ onSubmit, loading = false }) => {
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const suggestions = useMemo(() => {
        if (formData.destination.length < 2)
            return [];
        const term = formData.destination.toLowerCase();
        return DEFAULT_DESTINATIONS.filter((d) => d.name.toLowerCase().includes(term) ||
            d.country.toLowerCase().includes(term));
    }, [formData.destination]);
    // Clear a single field's error — explicit switch, no computed key access
    const clearError = useCallback((field) => {
        setErrors((prev) => {
            switch (field) {
                case 'destination': return { ...prev, destination: undefined };
                case 'name': return { ...prev, name: undefined };
                case 'email': return { ...prev, email: undefined };
                case 'phone': return { ...prev, phone: undefined };
                case 'travelers': return { ...prev, travelers: undefined };
                default: return prev;
            }
        });
    }, []);
    const handleFieldChange = useCallback((field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        clearError(field);
    }, [clearError]);
    const handleDestinationChange = useCallback((v) => {
        handleFieldChange('destination', v);
        setShowSuggestions(true);
    }, [handleFieldChange]);
    const handleDestinationSelect = useCallback((dest) => {
        setFormData((prev) => ({ ...prev, destination: dest.name }));
        setShowSuggestions(false);
    }, []);
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        const newErrors = validateAll(formData);
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0)
            return;
        setIsSubmitting(true);
        try {
            await onSubmit(formData);
        }
        catch (error) {
            console.error('Form submission error:', error);
        }
        finally {
            setIsSubmitting(false);
        }
    }, [formData, onSubmit]);
    return (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-6 bg-white rounded-xl shadow-lg p-6", children: [_jsx(DestinationField, { value: formData.destination, error: errors.destination, loading: loading, suggestions: suggestions, showSuggestions: showSuggestions, onChange: handleDestinationChange, onFocus: () => setShowSuggestions(true), onBlur: () => setTimeout(() => setShowSuggestions(false), 200), onSelect: handleDestinationSelect }), _jsx(DateRangeFields, { dateRange: formData.dateRange, loading: loading, onChange: (range) => setFormData((prev) => ({ ...prev, dateRange: range })) }), _jsx(FormField, { id: "travelers", label: "N\u00FAmero de Viajantes", value: formData.travelers, onChange: (v) => handleFieldChange('travelers', v), placeholder: "2", type: "number", error: errors.travelers, icon: _jsx(Users, { className: "h-4 w-4" }), disabled: loading }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsx(FormField, { id: "name", label: "Nome Completo", value: formData.name, onChange: (v) => handleFieldChange('name', v), placeholder: "O seu nome", error: errors.name, disabled: loading }), _jsx(FormField, { id: "email", label: "Email", value: formData.email, onChange: (v) => handleFieldChange('email', v), placeholder: "email@exemplo.com", type: "email", error: errors.email, icon: _jsx(Mail, { className: "h-4 w-4" }), disabled: loading })] }), _jsx(FormField, { id: "phone", label: "Telefone", value: formData.phone, onChange: (v) => handleFieldChange('phone', v), placeholder: "+351 912 345 678", type: "tel", error: errors.phone, icon: _jsx(Phone, { className: "h-4 w-4" }), disabled: loading }), _jsx(SelectField, { id: "travelType", label: "Tipo de Viagem", value: formData.travelType, onChange: (v) => handleFieldChange('travelType', v), options: TRAVEL_TYPES, placeholder: "Selecione o tipo de viagem", loading: loading }), _jsx(SelectField, { id: "budget", label: "Or\u00E7amento", value: formData.budget, onChange: (v) => handleFieldChange('budget', v), options: BUDGET_RANGES, placeholder: "Selecione o or\u00E7amento", loading: loading, icon: _jsx(DollarSign, { className: "h-4 w-4" }) }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { htmlFor: "message", className: "block text-sm font-medium text-gray-700", children: "Mensagem (opcional)" }), _jsx("textarea", { id: "message", value: formData.message, onChange: (e) => handleFieldChange('message', e.target.value), placeholder: "Conte-nos mais sobre a sua viagem ideal...", rows: 3, disabled: loading, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" })] }), _jsx(Button, { type: "submit", className: "w-full", size: "lg", disabled: loading || isSubmitting, children: isSubmitting ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "h-4 w-4 mr-2 animate-spin" }), "A enviar..."] })) : (_jsxs(_Fragment, { children: [_jsx(Send, { className: "h-4 w-4 mr-2" }), "Submeter Reserva"] })) })] }));
};
export const BookingForm = BookingFormComponent;
//# sourceMappingURL=BookingForm.js.map