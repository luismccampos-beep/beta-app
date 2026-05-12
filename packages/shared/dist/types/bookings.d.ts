export type Currency = 'EUR' | 'USD' | 'BRL';
export interface ExtraOption {
    key: string;
    label: string;
    price: number;
    perPerson?: boolean;
    description?: string;
    icon?: string;
}
export interface ExtrasLine extends ExtraOption {
    units: number;
    lineTotal: number;
}
export interface BookingBreakdown {
    basePerPerson: number;
    guests: number;
    baseTotal: number;
    extras: Array<{
        key: string;
        label: string;
        unitPrice: number;
        perPerson?: boolean;
        units: number;
        total: number;
    }>;
    extrasTotal: number;
    subtotal: number;
    taxes: {
        rate: number;
        amount: number;
    };
    grandTotal: number;
}
export interface BookingPayload {
    packageId: string;
    fullName: string;
    email: string;
    phone?: string;
    notes?: string;
    startDate: string;
    endDate: string;
    guests: number;
    extras?: Array<{
        key: string;
        price: number;
        perPerson?: boolean;
        units?: number;
        lineTotal?: number;
    }>;
    total?: number;
    currency?: Currency;
}
export interface Booking {
    id: string;
    bookingReference: string;
    status: 'confirmed' | 'pending' | 'cancelled' | 'completed' | 'payment_pending';
    createdAt: string;
    startDate: string;
    endDate: string;
    durationDays: number;
    userId: string;
    user: {
        name: string;
        email: string;
    };
    destination: {
        id: string;
        name: string;
        imageUrl: string;
    };
    guests: {
        adults: number;
        children: number;
        infants: number;
        childrenAges: number[];
    };
    roomDetails: {
        type: string;
        quantity: number;
    };
    activityDetails: Array<{
        name: string;
        date: string;
        participants: number;
    }>;
    pricing: {
        basePrice: number;
        currency: string;
        taxesAndFees: number;
        discountsApplied: number;
        totalAmount: number;
        breakdown: Array<{
            item: string;
            amount: number;
        }>;
    };
    paymentDetails: {
        methodUsed: string;
        status: string;
        paymentDeadline: string;
        paymentLink: string;
    };
    specialRequests?: string;
    cancellationPolicy: {
        summary: string;
        deadline: string;
        isRefundable: boolean;
        termsUrl: string;
    };
    notesForUser?: string;
}
