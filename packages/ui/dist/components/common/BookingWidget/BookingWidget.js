"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * BookingWidget - Unified Booking Component for Shared Package
 *
 * Features:
 * - Date selection with date picker
 * - Guest count selection (adults/children)
 * - Package selection
 * - Price calculation
 * - Form validation
 * - Responsive design
 */
import { useState, useCallback, useMemo } from 'react';
import { Calendar, Users, Baby, Search, Loader2 } from 'lucide-react';
import { Button } from '@akmleva/ui';
import { cn } from '../../../utils/cn';
// =============================================================================
// DEFAULT CONFIGURATION
// =============================================================================
const defaultPackages = [
    {
        id: 'lisboa-3dias',
        name: 'Lisboa Essencial',
        description: '3 dias para explorar a capital portuguesa',
        price: 299,
        duration: 3,
        image: '/images/lisboa.jpg',
        features: ['Hospedagem', 'Café da manhã', 'City tour'],
        isPopular: true,
    },
    {
        id: 'porto-2dias',
        name: 'Porto Encantador',
        description: '2 dias na cidade do vinho do Porto',
        price: 249,
        duration: 2,
        image: '/images/porto.jpg',
        features: ['Hospedagem', 'Café da manhã', 'Visita a caves'],
    },
    {
        id: 'algarve-5dias',
        name: 'Algarve Praias',
        description: '5 dias de sol e mar no Algarve',
        price: 599,
        duration: 5,
        image: '/images/algarve.jpg',
        features: ['Hospedagem', 'Meia pensão', 'Transfer'],
    },
];
// =============================================================================
// COMPONENT
// =============================================================================
const BookingWidgetComponent = ({ className, packages = defaultPackages, defaultPackage, onBookingSubmit, minDate = new Date(), maxDate, maxGuests = 10, showPackageSelection = true, showGuestSelection = true, showDateSelection = true, loading = false, disabled = false, currency = 'EUR', }) => {
    const [formData, setFormData] = useState({
        startDate: null,
        endDate: null,
        adults: 2,
        children: 0,
        packageId: defaultPackage || packages[0]?.id || '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const selectedPackage = useMemo(() => packages.find(pkg => pkg.id === formData.packageId), [formData.packageId, packages]);
    const totalPrice = useMemo(() => {
        if (!selectedPackage)
            return 0;
        const basePrice = selectedPackage.price || 0;
        const guestCount = formData.adults + formData.children;
        return basePrice * guestCount;
    }, [selectedPackage, formData.adults, formData.children]);
    const validateForm = useCallback(() => {
        const newErrors = {};
        if (showDateSelection) {
            if (!formData.startDate) {
                newErrors.startDate = 'Data de início é obrigatória';
            }
            if (!formData.endDate) {
                newErrors.endDate = 'Data de fim é obrigatória';
            }
            else if (formData.startDate && formData.endDate <= formData.startDate) {
                newErrors.endDate = 'Data de fim deve ser posterior à data de início';
            }
        }
        if (showGuestSelection && formData.adults < 1) {
            newErrors.adults = 'Pelo menos 1 adulto é obrigatório';
        }
        if (!formData.packageId) {
            newErrors.packageId = 'Selecione um pacote';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData, showDateSelection, showGuestSelection]);
    const handleInputChange = useCallback((field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error for this field if it exists
        setErrors(prev => {
            // eslint-disable-next-line security/detect-object-injection
            if (!prev[field])
                return prev;
            const newErrors = { ...prev };
            // eslint-disable-next-line security/detect-object-injection
            delete newErrors[field];
            return newErrors;
        });
    }, []);
    const handleDateChange = useCallback((field, date) => {
        handleInputChange(field, date);
        // Auto-calculate end date based on package duration
        if (field === 'startDate' && date && selectedPackage) {
            const endDate = new Date(date);
            endDate.setDate(endDate.getDate() + selectedPackage.duration);
            handleInputChange('endDate', endDate);
        }
    }, [handleInputChange, selectedPackage]);
    const handleGuestChange = useCallback((type, delta) => {
        // eslint-disable-next-line security/detect-object-injection
        const currentValue = formData[type];
        const newValue = Math.max(0, Math.min(maxGuests, currentValue + delta));
        if (type === 'adults' && newValue === 0 && formData.children > 0) {
            return; // Don't allow 0 adults if there are children
        }
        handleInputChange(type, newValue);
    }, [formData, maxGuests, handleInputChange]);
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (!validateForm() || disabled)
            return;
        setIsSubmitting(true);
        try {
            const submitData = {
                packageId: formData.packageId,
                startDate: formData.startDate.toISOString(),
                endDate: formData.endDate.toISOString(),
                adults: formData.adults,
                children: formData.children,
                totalPrice,
            };
            if (onBookingSubmit) {
                await onBookingSubmit(submitData);
            }
        }
        catch (error) {
            console.error('Booking submission failed:', error);
        }
        finally {
            setIsSubmitting(false);
        }
    }, [validateForm, disabled, formData, totalPrice, onBookingSubmit]);
    const getFieldError = useCallback((field) => {
        // eslint-disable-next-line security/detect-object-injection
        return errors[field];
    }, [errors]);
    const getFieldValue = useCallback((field) => {
        // eslint-disable-next-line security/detect-object-injection
        return formData[field];
    }, [formData]);
    const renderDateInput = (field, label) => {
        if (!showDateSelection)
            return null;
        const fieldValue = getFieldValue(field);
        const fieldError = getFieldError(field);
        return (_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: label }), _jsxs("div", { className: "relative", children: [_jsx(Calendar, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" }), _jsx("input", { type: "date", value: fieldValue instanceof Date ? fieldValue.toISOString().split('T')[0] : '', onChange: (e) => handleDateChange(field, e.target.value ? new Date(e.target.value) : null), min: field === 'startDate' ? minDate.toISOString().split('T')[0] : formData.startDate?.toISOString().split('T')[0], max: maxDate?.toISOString().split('T')[0], className: cn('w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500', fieldError && 'border-red-500'), disabled: disabled })] }), fieldError && (_jsx("p", { className: "text-sm text-red-600", children: fieldError }))] }));
    };
    const renderGuestSelection = () => {
        if (!showGuestSelection)
            return null;
        return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Users, { className: "h-4 w-4 text-gray-600" }), _jsx("span", { className: "text-sm font-medium text-gray-700", children: "H\u00F3spedes" })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-gray-600", children: "Adultos" }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Button, { variant: "outline", size: "sm", onClick: () => handleGuestChange('adults', -1), disabled: formData.adults <= 1 || disabled, children: "-" }), _jsx("span", { className: "w-8 text-center", children: formData.adults }), _jsx(Button, { variant: "outline", size: "sm", onClick: () => handleGuestChange('adults', 1), disabled: formData.adults >= maxGuests || disabled, children: "+" })] })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Baby, { className: "h-4 w-4 text-gray-600" }), _jsx("span", { className: "text-sm text-gray-600", children: "Crian\u00E7as" })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Button, { variant: "outline", size: "sm", onClick: () => handleGuestChange('children', -1), disabled: formData.children <= 0 || disabled, children: "-" }), _jsx("span", { className: "w-8 text-center", children: formData.children }), _jsx(Button, { variant: "outline", size: "sm", onClick: () => handleGuestChange('children', 1), disabled: formData.children >= maxGuests - formData.adults || disabled, children: "+" })] })] })] }));
    };
    const renderPackageSelection = () => {
        if (!showPackageSelection)
            return null;
        const packageError = getFieldError('packageId');
        return (_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Pacote Tur\u00EDstico" }), _jsxs("select", { value: formData.packageId, onChange: (e) => handleInputChange('packageId', e.target.value), className: cn('w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500', packageError && 'border-red-500'), disabled: disabled, children: [_jsx("option", { value: "", children: "Selecione um pacote" }), packages.map((pkg) => (_jsxs("option", { value: pkg.id, children: [pkg.name, " - ", pkg.duration, " dias - ", currency, " ", pkg.price] }, pkg.id)))] }), packageError && (_jsx("p", { className: "text-sm text-red-600", children: packageError }))] }));
    };
    return (_jsx("div", { className: cn('bg-white rounded-xl shadow-lg p-6', className), children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { className: "text-center", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Reserve sua Viagem" }), _jsx("p", { className: "text-gray-600", children: "Escolha as datas e prepare-se para uma experi\u00EAncia inesquec\u00EDvel" })] }), renderPackageSelection(), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [renderDateInput('startDate', 'Data de Início'), renderDateInput('endDate', 'Data de Fim')] }), renderGuestSelection(), selectedPackage && (_jsxs("div", { className: "bg-blue-50 rounded-lg p-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("h3", { className: "font-semibold text-blue-900", children: selectedPackage.name }), _jsxs("span", { className: "text-blue-900 font-bold", children: [currency, " ", totalPrice] })] }), _jsx("p", { className: "text-sm text-blue-700 mb-2", children: selectedPackage.description }), selectedPackage.features && (_jsx("div", { className: "flex flex-wrap gap-2", children: selectedPackage.features.map((feature, index) => (_jsx("span", { className: "text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full", children: feature }, index))) }))] })), _jsx(Button, { type: "submit", className: "w-full", disabled: disabled || loading || isSubmitting, size: "lg", children: isSubmitting ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "h-4 w-4 mr-2 animate-spin" }), "Processando..."] })) : (_jsxs(_Fragment, { children: [_jsx(Search, { className: "h-4 w-4 mr-2" }), "Reservar Agora"] })) })] }) }));
};
export const BookingWidget = BookingWidgetComponent;
/** @alias */
export default BookingWidget;
//# sourceMappingURL=BookingWidget.js.map