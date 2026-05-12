"use client";
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
// TYPE DEFINITIONS
// =============================================================================

export interface BookingPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  image: string;
  features?: string[];
  isPopular?: boolean;
  currency?: string;
}

export interface BookingFormData {
  startDate: Date | null;
  endDate: Date | null;
  adults: number;
  children: number;
  packageId: string;
}

export interface BookingSubmitData {
  packageId: string;
  startDate: string;
  endDate: string;
  adults: number;
  children: number;
  totalPrice: number;
}

export interface BookingWidgetProps {
  className?: string;
  packages?: BookingPackage[];
  defaultPackage?: string;
  onBookingSubmit?: (data: BookingSubmitData) => Promise<void>;
  minDate?: Date;
  maxDate?: Date;
  maxGuests?: number;
  showPackageSelection?: boolean;
  showGuestSelection?: boolean;
  showDateSelection?: boolean;
  loading?: boolean;
  disabled?: boolean;
  currency?: string;
}

type FormField = keyof BookingFormData;
type GuestType = 'adults' | 'children';
type DateField = 'startDate' | 'endDate';

// =============================================================================
// DEFAULT CONFIGURATION
// =============================================================================

const defaultPackages: BookingPackage[] = [
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

const BookingWidgetComponent = ({
  className,
  packages = defaultPackages,
  defaultPackage,
  onBookingSubmit,
  minDate = new Date(),
  maxDate,
  maxGuests = 10,
  showPackageSelection = true,
  showGuestSelection = true,
  showDateSelection = true,
  loading = false,
  disabled = false,
  currency = 'EUR',
}: BookingWidgetProps) => {
  const [formData, setFormData] = useState<BookingFormData>({
    startDate: null,
    endDate: null,
    adults: 2,
    children: 0,
    packageId: defaultPackage || packages[0]?.id || '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<FormField, string>>>({});

  const selectedPackage = useMemo(
    () => packages.find(pkg => pkg.id === formData.packageId),
    [formData.packageId, packages]
  );

  const totalPrice = useMemo(() => {
    if (!selectedPackage) return 0;

    const basePrice = selectedPackage.price || 0;
    const guestCount = formData.adults + formData.children;
    return basePrice * guestCount;
  }, [selectedPackage, formData.adults, formData.children]);

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<Record<FormField, string>> = {};

    if (showDateSelection) {
      if (!formData.startDate) {
        newErrors.startDate = 'Data de início é obrigatória';
      }
      if (!formData.endDate) {
        newErrors.endDate = 'Data de fim é obrigatória';
      } else if (formData.startDate && formData.endDate <= formData.startDate) {
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

  const handleInputChange = useCallback(<K extends FormField>(
    field: K,
    value: BookingFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error for this field if it exists
    setErrors(prev => {
      // eslint-disable-next-line security/detect-object-injection
      if (!prev[field]) return prev;
      const newErrors = { ...prev };
      // eslint-disable-next-line security/detect-object-injection
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const handleDateChange = useCallback((field: DateField, date: Date | null) => {
    handleInputChange(field, date);

    // Auto-calculate end date based on package duration
    if (field === 'startDate' && date && selectedPackage) {
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + selectedPackage.duration);
      handleInputChange('endDate', endDate);
    }
  }, [handleInputChange, selectedPackage]);

  const handleGuestChange = useCallback((type: GuestType, delta: number) => {
    // eslint-disable-next-line security/detect-object-injection
    const currentValue = formData[type];
    const newValue = Math.max(0, Math.min(maxGuests, currentValue + delta));

    if (type === 'adults' && newValue === 0 && formData.children > 0) {
      return; // Don't allow 0 adults if there are children
    }

    handleInputChange(type, newValue);
  }, [formData, maxGuests, handleInputChange]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || disabled) return;

    setIsSubmitting(true);

    try {
      const submitData: BookingSubmitData = {
        packageId: formData.packageId,
        startDate: formData.startDate!.toISOString(),
        endDate: formData.endDate!.toISOString(),
        adults: formData.adults,
        children: formData.children,
        totalPrice,
      };

      if (onBookingSubmit) {
        await onBookingSubmit(submitData);
      }
    } catch (error) {
      console.error('Booking submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [validateForm, disabled, formData, totalPrice, onBookingSubmit]);

  const getFieldError = useCallback((field: FormField): string | undefined => {
    // eslint-disable-next-line security/detect-object-injection
    return errors[field];
  }, [errors]);

  const getFieldValue = useCallback(<K extends FormField>(field: K): BookingFormData[K] => {
    // eslint-disable-next-line security/detect-object-injection
    return formData[field];
  }, [formData]);

  const renderDateInput = (field: DateField, label: string) => {
    if (!showDateSelection) return null;

    const fieldValue = getFieldValue(field);
    const fieldError = getFieldError(field);

    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="date"
            value={fieldValue instanceof Date ? fieldValue.toISOString().split('T')[0] : ''}
            onChange={(e) => handleDateChange(field, e.target.value ? new Date(e.target.value) : null)}
            min={field === 'startDate' ? minDate.toISOString().split('T')[0] : formData.startDate?.toISOString().split('T')[0]}
            max={maxDate?.toISOString().split('T')[0]}
            className={cn(
              'w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
              fieldError && 'border-red-500'
            )}
            disabled={disabled}
          />
        </div>
        {fieldError && (
          <p className="text-sm text-red-600">{fieldError}</p>
        )}
      </div>
    );
  };

  const renderGuestSelection = () => {
    if (!showGuestSelection) return null;

    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Hóspedes</span>
        </div>

        {/* Adults */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Adultos</span>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleGuestChange('adults', -1)}
              disabled={formData.adults <= 1 || disabled}
            >
              -
            </Button>
            <span className="w-8 text-center">{formData.adults}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleGuestChange('adults', 1)}
              disabled={formData.adults >= maxGuests || disabled}
            >
              +
            </Button>
          </div>
        </div>

        {/* Children */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Baby className="h-4 w-4 text-gray-600" />
            <span className="text-sm text-gray-600">Crianças</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleGuestChange('children', -1)}
              disabled={formData.children <= 0 || disabled}
            >
              -
            </Button>
            <span className="w-8 text-center">{formData.children}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleGuestChange('children', 1)}
              disabled={formData.children >= maxGuests - formData.adults || disabled}
            >
              +
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderPackageSelection = () => {
    if (!showPackageSelection) return null;

    const packageError = getFieldError('packageId');

    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Pacote Turístico
        </label>
        <select
          value={formData.packageId}
          onChange={(e) => handleInputChange('packageId', e.target.value)}
          className={cn(
            'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
            packageError && 'border-red-500'
          )}
          disabled={disabled}
        >
          <option value="">Selecione um pacote</option>
          {packages.map((pkg) => (
            <option key={pkg.id} value={pkg.id}>
              {pkg.name} - {pkg.duration} dias - {currency} {pkg.price}
            </option>
          ))}
        </select>
        {packageError && (
          <p className="text-sm text-red-600">{packageError}</p>
        )}
      </div>
    );
  };

  return (
    <div className={cn('bg-white rounded-xl shadow-lg p-6', className)}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Reserve sua Viagem
          </h2>
          <p className="text-gray-600">
            Escolha as datas e prepare-se para uma experiência inesquecível
          </p>
        </div>

        {/* Package Selection */}
        {renderPackageSelection()}

        {/* Date Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderDateInput('startDate', 'Data de Início')}
          {renderDateInput('endDate', 'Data de Fim')}
        </div>

        {/* Guest Selection */}
        {renderGuestSelection()}

        {/* Selected Package Info */}
        {selectedPackage && (
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-blue-900">{selectedPackage.name}</h3>
              <span className="text-blue-900 font-bold">
                {currency} {totalPrice}
              </span>
            </div>
            <p className="text-sm text-blue-700 mb-2">{selectedPackage.description}</p>
            {selectedPackage.features && (
              <div className="flex flex-wrap gap-2">
                {selectedPackage.features.map((feature, index) => (
                  <span
                    key={index}
                    className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full"
          disabled={disabled || loading || isSubmitting}
          size="lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processando...
            </>
          ) : (
            <>
              <Search className="h-4 w-4 mr-2" />
              Reservar Agora
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export const BookingWidget = BookingWidgetComponent;

/** @alias */
export default BookingWidget;
