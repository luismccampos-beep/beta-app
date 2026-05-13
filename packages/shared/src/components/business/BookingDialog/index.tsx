"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Users, CreditCard, MapPin, Clock } from 'lucide-react';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui';
import { Button } from '../../ui';
import { cn } from '../../../utils';

export interface BookingDetails {
  id: string;
  title: string;
  description?: string;
  price: number;
  currency?: string;
  duration?: string;
  capacity?: number;
  location?: string;
  availability?: {
    dates: string[];
    timeSlots: string[];
  };
  included?: string[];
  excluded?: string[];
  requirements?: string[];
}

export interface BookingFormData {
  date: string;
  timeSlot: string;
  participants: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialRequests?: string;
  termsAccepted: boolean;
}

export interface BookingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  booking: BookingDetails;
  onSubmit: (data: BookingFormData) => Promise<void>;
  loading?: boolean;
  currency?: string;
  locale?: string;
  className?: string;
  showSteps?: boolean;
  customFields?: React.ReactNode;
}

type BookingStep = 'details' | 'form' | 'confirmation';

const INITIAL_FORM_DATA: BookingFormData = {
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
const StepIndicator: React.FC<{ currentStep: BookingStep; showSteps: boolean }> = ({
  currentStep,
  showSteps
}) => {
  if (!showSteps) return null;

  const steps: Array<{ id: BookingStep; label: string }> = [
    { id: 'details', label: 'Detalhes' },
    { id: 'form', label: 'Informações' },
    { id: 'confirmation', label: 'Confirmação' }
  ];

  const getCurrentStepIndex = () => steps.findIndex(step => step.id === currentStep);

  return (
    <div className="flex items-center justify-center mb-6">
      {steps.map((step, index) => {
        const currentIndex = getCurrentStepIndex();
        const isActive = currentStep === step.id;
        const isCompleted = currentIndex > index;

        return (
          <React.Fragment key={step.id}>
            <div className={cn(
              'flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors',
              isActive && 'bg-primary text-primary-foreground',
              isCompleted && !isActive && 'bg-muted text-muted-foreground',
              !isActive && !isCompleted && 'bg-primary/20 text-primary'
            )}>
              {index + 1}
            </div>
            {index < steps.length - 1 && (
              <div className={cn(
                'w-8 h-0.5 transition-colors',
                currentIndex > index ? 'bg-primary' : 'bg-muted'
              )} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// Details Step Component
const DetailsStep: React.FC<{
  booking: BookingDetails;
  formatPrice: (price: number, currency: string) => string;
  currency: string;
  onContinue: () => void;
}> = ({ booking, formatPrice, currency, onContinue }) => (
  <div className="space-y-6">
    {/* Booking Info */}
    <div className="flex items-start gap-4">
      <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
        <Calendar className="h-8 w-8 text-primary" />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-lg">{booking.title}</h3>
        {booking.description && (
          <p className="text-muted-foreground mt-1">{booking.description}</p>
        )}
      </div>
    </div>

    {/* Details Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {booking.duration && (
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">Duração: {booking.duration}</span>
        </div>
      )}
      {booking.capacity && (
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">Capacidade: {booking.capacity} pessoas</span>
        </div>
      )}
      {booking.location && (
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">Local: {booking.location}</span>
        </div>
      )}
      <div className="flex items-center gap-2">
        <CreditCard className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-semibold">
          Preço: {formatPrice(booking.price, currency)}
        </span>
      </div>
    </div>

    {/* Included/Excluded */}
    {(booking.included?.length || booking.excluded?.length) && (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {booking.included && booking.included.length > 0 && (
          <div>
            <h4 className="font-medium mb-2 text-green-600">Incluído</h4>
            <ul className="text-sm space-y-1">
              {booking.included.map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
        {booking.excluded && booking.excluded.length > 0 && (
          <div>
            <h4 className="font-medium mb-2 text-red-600">Não incluído</h4>
            <ul className="text-sm space-y-1">
              {booking.excluded.map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-600 rounded-full" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )}

    <Button onClick={onContinue} className="w-full" size="lg">
      Continuar
    </Button>
  </div>
);

// Form Step Component
const FormStep: React.FC<{
  booking: BookingDetails;
  formData: BookingFormData;
  setFormData: React.Dispatch<React.SetStateAction<BookingFormData>>;
  loading: boolean;
  customFields?: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  isFormValid: () => boolean;
}> = ({ booking, formData, setFormData, loading, customFields, onSubmit, isFormValid }) => (
  <form onSubmit={onSubmit} className="space-y-4">
    {/* Date and Time Selection */}
    {booking.availability && (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Data</label>
          <select
            value={formData.date}
            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            className="w-full p-3 border rounded-md bg-background"
            required
          >
            <option value="">Selecione uma data</option>
            {booking.availability.dates.map(date => (
              <option key={date} value={date}>{date}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Horário</label>
          <select
            value={formData.timeSlot}
            onChange={(e) => setFormData(prev => ({ ...prev, timeSlot: e.target.value }))}
            className="w-full p-3 border rounded-md bg-background"
            required
          >
            <option value="">Selecione um horário</option>
            {booking.availability.timeSlots.map(slot => (
              <option key={slot} value={slot}>{slot}</option>
            ))}
          </select>
        </div>
      </div>
    )}

    {/* Participants */}
    <div>
      <label className="block text-sm font-medium mb-2">Número de Participantes</label>
      <input
        type="number"
        min="1"
        max={booking.capacity || 10}
        value={formData.participants}
        onChange={(e) => setFormData(prev => ({ ...prev, participants: parseInt(e.target.value, 10) }))}
        className="w-full p-3 border rounded-md bg-background"
        required
      />
    </div>

    {/* Personal Information */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium mb-2">Nome</label>
        <input
          type="text"
          value={formData.firstName}
          onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
          className="w-full p-3 border rounded-md bg-background"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Sobrenome</label>
        <input
          type="text"
          value={formData.lastName}
          onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
          className="w-full p-3 border rounded-md bg-background"
          required
        />
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium mb-2">E-mail</label>
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
        className="w-full p-3 border rounded-md bg-background"
        required
      />
    </div>

    <div>
      <label className="block text-sm font-medium mb-2">Telefone</label>
      <input
        type="tel"
        value={formData.phone}
        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
        className="w-full p-3 border rounded-md bg-background"
        required
      />
    </div>

    {/* Special Requests */}
    <div>
      <label className="block text-sm font-medium mb-2">Pedidos Especiais (opcional)</label>
      <textarea
        value={formData.specialRequests}
        onChange={(e) => setFormData(prev => ({ ...prev, specialRequests: e.target.value }))}
        className="w-full p-3 border rounded-md bg-background min-h-[100px]"
        placeholder="Informe-nos sobre necessidades especiais ou preferências..."
      />
    </div>

    {/* Custom Fields */}
    {customFields}

    {/* Terms */}
    <div className="flex items-start gap-2">
      <input
        type="checkbox"
        id="terms"
        checked={formData.termsAccepted}
        onChange={(e) => setFormData(prev => ({ ...prev, termsAccepted: e.target.checked }))}
        className="mt-1"
        required
      />
      <label htmlFor="terms" className="text-sm text-muted-foreground">
        Aceito os termos e condições e a política de privacidade
      </label>
    </div>

    {/* Submit Button */}
    <Button
      type="submit"
      disabled={!isFormValid() || loading}
      className="w-full"
      size="lg"
    >
      {loading ? 'Processando...' : 'Confirmar Reserva'}
    </Button>
  </form>
);

// Confirmation Step Component
const ConfirmationStep: React.FC<{
  booking: BookingDetails;
  formData: BookingFormData;
  formatPrice: (price: number, currency: string) => string;
  currency: string;
  onClose: () => void;
}> = ({ booking, formData, formatPrice, currency, onClose }) => (
  <div className="text-center space-y-6">
    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
    </div>

    <div>
      <h3 className="text-xl font-semibold mb-2">Reserva Confirmada!</h3>
      <p className="text-muted-foreground">
        Sua reserva foi confirmada com sucesso. Enviaremos um e-mail com todos os detalhes.
      </p>
    </div>

    <div className="bg-muted/50 rounded-lg p-4 text-left">
      <h4 className="font-medium mb-2">Resumo da Reserva</h4>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Serviço:</span>
          <span className="font-medium">{booking.title}</span>
        </div>
        <div className="flex justify-between">
          <span>Data:</span>
          <span className="font-medium">{formData.date}</span>
        </div>
        <div className="flex justify-between">
          <span>Horário:</span>
          <span className="font-medium">{formData.timeSlot}</span>
        </div>
        <div className="flex justify-between">
          <span>Participantes:</span>
          <span className="font-medium">{formData.participants}</span>
        </div>
        <div className="flex justify-between font-semibold text-base pt-2 border-t">
          <span>Total:</span>
          <span>{formatPrice(booking.price * formData.participants, currency)}</span>
        </div>
      </div>
    </div>

    <Button onClick={onClose} className="w-full">
      Fechar
    </Button>
  </div>
);

// Main Component
export const BookingDialog: React.FC<BookingDialogProps> = ({
  isOpen,
  onClose,
  booking,
  onSubmit,
  loading = false,
  currency = 'BRL',
  locale = 'pt-PT',
  className,
  showSteps = true,
  customFields
}) => {
  const [currentStep, setCurrentStep] = React.useState<BookingStep>('details');
  const [formData, setFormData] = React.useState<BookingFormData>(INITIAL_FORM_DATA);

  const formatPrice = React.useCallback((price: number, curr: string) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: curr
    }).format(price);
  }, [locale]);

  const isFormValid = React.useCallback(() => {
    return Boolean(
      formData.date &&
      formData.timeSlot &&
      formData.firstName &&
      formData.lastName &&
      formData.email &&
      formData.phone &&
      formData.termsAccepted
    );
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
      if (showSteps) {
        setCurrentStep('confirmation');
      }
    } catch (error) {
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

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={handleClose}>
          <DialogContent className={cn(
            'max-w-2xl w-full max-h-[90vh] overflow-y-auto',
            className
          )}>
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>Fazer Reserva</span>
                <button
                  onClick={handleClose}
                  className="rounded-full p-2 hover:bg-muted transition-colors"
                  aria-label="Fechar"
                >
                  <X className="h-4 w-4" />
                </button>
              </DialogTitle>
            </DialogHeader>

            <StepIndicator currentStep={currentStep} showSteps={showSteps} />

            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 'details' && (
                <DetailsStep
                  booking={booking}
                  formatPrice={formatPrice}
                  currency={currency}
                  onContinue={() => setCurrentStep('form')}
                />
              )}
              {currentStep === 'form' && (
                <FormStep
                  booking={booking}
                  formData={formData}
                  setFormData={setFormData}
                  loading={loading}
                  customFields={customFields}
                  onSubmit={handleSubmit}
                  isFormValid={isFormValid}
                />
              )}
              {currentStep === 'confirmation' && (
                <ConfirmationStep
                  booking={booking}
                  formData={formData}
                  formatPrice={formatPrice}
                  currency={currency}
                  onClose={handleClose}
                />
              )}
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

/** @alias */
export default BookingDialog;
