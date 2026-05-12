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
export declare const BookingWidget: ({ className, packages, defaultPackage, onBookingSubmit, minDate, maxDate, maxGuests, showPackageSelection, showGuestSelection, showDateSelection, loading, disabled, currency, }: BookingWidgetProps) => import("react/jsx-runtime").JSX.Element;
/** @alias */
export default BookingWidget;
