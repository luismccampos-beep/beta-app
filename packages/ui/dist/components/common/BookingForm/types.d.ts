import type { DateRange } from 'react-day-picker';
export interface BookingDestination {
    id: string;
    name: string;
    country: string;
    region: string;
    type: 'city' | 'beach' | 'mountain' | 'cultural' | 'adventure';
    bestSeason: string[];
    averagePrice: number;
    popularity: number;
    description: string;
    lat?: number;
    lon?: number;
}
export interface BookingValidationResult {
    isValid: boolean;
    message?: string;
    suggestion?: string;
}
export interface BookingFormData {
    destination: string;
    dateRange: DateRange;
    travelers: string;
    name: string;
    email: string;
    phone: string;
    travelType: string;
    budget: string;
    message: string;
}
export interface BookingFormProps {
    onSubmit: (data: BookingFormData) => void;
    loading?: boolean;
}
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
export interface BookingSubmitData {
    packageId: string;
    startDate: string;
    endDate: string;
    adults: number;
    children: number;
    totalPrice: number;
}
