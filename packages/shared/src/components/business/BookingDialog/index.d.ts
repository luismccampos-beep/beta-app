import React from 'react';
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
export declare const BookingDialog: React.FC<BookingDialogProps>;
/** @alias */
export default BookingDialog;
