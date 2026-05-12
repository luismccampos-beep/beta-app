import { z } from 'zod';
export declare const ActivityBaseSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    location: z.ZodString;
    startTime: z.ZodString;
    endTime: z.ZodString;
    cost: z.ZodUnion<[z.ZodOptional<z.ZodNumber>, z.ZodLiteral<null>]>;
    category: z.ZodOptional<z.ZodString>;
    bookingReference: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const ActivitySchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    location: z.ZodString;
    startTime: z.ZodString;
    endTime: z.ZodString;
    cost: z.ZodUnion<[z.ZodOptional<z.ZodNumber>, z.ZodLiteral<null>]>;
    category: z.ZodOptional<z.ZodString>;
    bookingReference: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const AccommodationBaseSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    type: z.ZodString;
    location: z.ZodString;
    checkIn: z.ZodString;
    checkOut: z.ZodString;
    cost: z.ZodUnion<[z.ZodOptional<z.ZodNumber>, z.ZodLiteral<null>]>;
    bookingReference: z.ZodOptional<z.ZodString>;
    amenities: z.ZodOptional<z.ZodArray<z.ZodString>>;
    notes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const AccommodationSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    type: z.ZodString;
    location: z.ZodString;
    checkIn: z.ZodString;
    checkOut: z.ZodString;
    cost: z.ZodUnion<[z.ZodOptional<z.ZodNumber>, z.ZodLiteral<null>]>;
    bookingReference: z.ZodOptional<z.ZodString>;
    amenities: z.ZodOptional<z.ZodArray<z.ZodString>>;
    notes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const TransportationBaseSchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodEnum<{
        other: "other";
        flight: "flight";
        train: "train";
        bus: "bus";
        car: "car";
    }>;
    from: z.ZodString;
    to: z.ZodString;
    departureTime: z.ZodString;
    arrivalTime: z.ZodString;
    cost: z.ZodUnion<[z.ZodOptional<z.ZodNumber>, z.ZodLiteral<null>]>;
    bookingReference: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const TransportationSchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodEnum<{
        other: "other";
        flight: "flight";
        train: "train";
        bus: "bus";
        car: "car";
    }>;
    from: z.ZodString;
    to: z.ZodString;
    departureTime: z.ZodString;
    arrivalTime: z.ZodString;
    cost: z.ZodUnion<[z.ZodOptional<z.ZodNumber>, z.ZodLiteral<null>]>;
    bookingReference: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const BudgetInfoSchema: z.ZodObject<{
    totalBudget: z.ZodNumber;
    currency: z.ZodDefault<z.ZodString>;
    categories: z.ZodObject<{
        accommodation: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        transportation: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        activities: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        food: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        shopping: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        other: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    }, z.core.$strip>;
    dailyAverage: z.ZodUnion<[z.ZodOptional<z.ZodNumber>, z.ZodLiteral<null>]>;
    expenses: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        description: z.ZodString;
        amount: z.ZodNumber;
        category: z.ZodString;
        date: z.ZodString;
        notes: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export declare const TripFeedbackBaseSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    destination: z.ZodString;
    startDate: z.ZodString;
    endDate: z.ZodString;
    activities: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        location: z.ZodString;
        startTime: z.ZodString;
        endTime: z.ZodString;
        cost: z.ZodUnion<[z.ZodOptional<z.ZodNumber>, z.ZodLiteral<null>]>;
        category: z.ZodOptional<z.ZodString>;
        bookingReference: z.ZodOptional<z.ZodString>;
        notes: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
    accommodations: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        type: z.ZodString;
        location: z.ZodString;
        checkIn: z.ZodString;
        checkOut: z.ZodString;
        cost: z.ZodUnion<[z.ZodOptional<z.ZodNumber>, z.ZodLiteral<null>]>;
        bookingReference: z.ZodOptional<z.ZodString>;
        amenities: z.ZodOptional<z.ZodArray<z.ZodString>>;
        notes: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
    transportation: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        type: z.ZodEnum<{
            other: "other";
            flight: "flight";
            train: "train";
            bus: "bus";
            car: "car";
        }>;
        from: z.ZodString;
        to: z.ZodString;
        departureTime: z.ZodString;
        arrivalTime: z.ZodString;
        cost: z.ZodUnion<[z.ZodOptional<z.ZodNumber>, z.ZodLiteral<null>]>;
        bookingReference: z.ZodOptional<z.ZodString>;
        notes: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
    budget: z.ZodOptional<z.ZodObject<{
        totalBudget: z.ZodNumber;
        currency: z.ZodDefault<z.ZodString>;
        categories: z.ZodObject<{
            accommodation: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
            transportation: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
            activities: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
            food: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
            shopping: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
            other: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        }, z.core.$strip>;
        dailyAverage: z.ZodUnion<[z.ZodOptional<z.ZodNumber>, z.ZodLiteral<null>]>;
        expenses: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            description: z.ZodString;
            amount: z.ZodNumber;
            category: z.ZodString;
            date: z.ZodString;
            notes: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>>;
    }, z.core.$strip>>;
    notes: z.ZodOptional<z.ZodString>;
    rating: z.ZodOptional<z.ZodNumber>;
    createdAt: z.ZodOptional<z.ZodString>;
    updatedAt: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const TripFeedbackSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    destination: z.ZodString;
    startDate: z.ZodString;
    endDate: z.ZodString;
    activities: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        location: z.ZodString;
        startTime: z.ZodString;
        endTime: z.ZodString;
        cost: z.ZodUnion<[z.ZodOptional<z.ZodNumber>, z.ZodLiteral<null>]>;
        category: z.ZodOptional<z.ZodString>;
        bookingReference: z.ZodOptional<z.ZodString>;
        notes: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
    accommodations: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        type: z.ZodString;
        location: z.ZodString;
        checkIn: z.ZodString;
        checkOut: z.ZodString;
        cost: z.ZodUnion<[z.ZodOptional<z.ZodNumber>, z.ZodLiteral<null>]>;
        bookingReference: z.ZodOptional<z.ZodString>;
        amenities: z.ZodOptional<z.ZodArray<z.ZodString>>;
        notes: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
    transportation: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        type: z.ZodEnum<{
            other: "other";
            flight: "flight";
            train: "train";
            bus: "bus";
            car: "car";
        }>;
        from: z.ZodString;
        to: z.ZodString;
        departureTime: z.ZodString;
        arrivalTime: z.ZodString;
        cost: z.ZodUnion<[z.ZodOptional<z.ZodNumber>, z.ZodLiteral<null>]>;
        bookingReference: z.ZodOptional<z.ZodString>;
        notes: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
    budget: z.ZodOptional<z.ZodObject<{
        totalBudget: z.ZodNumber;
        currency: z.ZodDefault<z.ZodString>;
        categories: z.ZodObject<{
            accommodation: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
            transportation: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
            activities: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
            food: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
            shopping: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
            other: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        }, z.core.$strip>;
        dailyAverage: z.ZodUnion<[z.ZodOptional<z.ZodNumber>, z.ZodLiteral<null>]>;
        expenses: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            description: z.ZodString;
            amount: z.ZodNumber;
            category: z.ZodString;
            date: z.ZodString;
            notes: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>>;
    }, z.core.$strip>>;
    notes: z.ZodOptional<z.ZodString>;
    rating: z.ZodOptional<z.ZodNumber>;
    createdAt: z.ZodOptional<z.ZodString>;
    updatedAt: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export interface DestinationDetail {
    id: string;
    name: string;
    country: string;
    continent: string;
    image: string;
    gallery: string[];
    price: string;
    originalPrice: string;
    rating: number;
    reviews: number;
    duration: string;
    maxGuests: number;
    description: string;
    highlights: string[];
    included: string[];
    notIncluded: string[];
    itinerary: Array<{
        day: number;
        title: string;
        activities: string[];
    }>;
    amenities: Array<{
        icon: string;
        name: string;
    }>;
    virtualTourLink: string;
    bookingLink: string;
}
export type Activity = z.infer<typeof ActivitySchema>;
export type Accommodation = z.infer<typeof AccommodationSchema>;
export type Transportation = z.infer<typeof TransportationSchema>;
export type BudgetInfo = z.infer<typeof BudgetInfoSchema>;
export type TripFeedback = z.infer<typeof TripFeedbackSchema>;
export declare function validateTripFeedback(data: unknown): {
    success: boolean;
    data?: TripFeedback;
    errors?: string[];
};
export declare const ActivitySchemaForFeedback: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    location: z.ZodOptional<z.ZodString>;
    startTime: z.ZodOptional<z.ZodString>;
    endTime: z.ZodOptional<z.ZodString>;
    cost: z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodNumber>, z.ZodLiteral<null>]>>;
    category: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    bookingReference: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    notes: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export declare const AccommodationSchemaForFeedback: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodString>;
    checkIn: z.ZodOptional<z.ZodString>;
    checkOut: z.ZodOptional<z.ZodString>;
    cost: z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodNumber>, z.ZodLiteral<null>]>>;
    bookingReference: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    amenities: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString>>>;
    notes: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export declare const TransportationSchemaForFeedback: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodEnum<{
        other: "other";
        flight: "flight";
        train: "train";
        bus: "bus";
        car: "car";
    }>>;
    from: z.ZodOptional<z.ZodString>;
    to: z.ZodOptional<z.ZodString>;
    departureTime: z.ZodOptional<z.ZodString>;
    arrivalTime: z.ZodOptional<z.ZodString>;
    cost: z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodNumber>, z.ZodLiteral<null>]>>;
    bookingReference: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    notes: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
