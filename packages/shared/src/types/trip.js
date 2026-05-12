import { z } from 'zod';
// Activity Schema with time validation
export const ActivityBaseSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
    location: z.string().min(1, 'Location is required'),
    startTime: z.string().datetime({
        message: 'Invalid start time format',
    }),
    endTime: z.string().datetime({
        message: 'Invalid end time format',
    }),
    cost: z.number().optional().or(z.literal(null)),
    category: z.string().optional(),
    bookingReference: z.string().optional(),
    notes: z.string().optional(),
});
export const ActivitySchema = ActivityBaseSchema.refine((data) => {
    const start = new Date(data.startTime);
    const end = new Date(data.endTime);
    return end > start;
}, {
    message: 'End time must be after start time',
    path: ['endTime'],
});
// Accommodation Schema with date validation
export const AccommodationBaseSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1, 'Name is required'),
    type: z.string().min(1, 'Type is required'),
    location: z.string().min(1, 'Location is required'),
    checkIn: z.string().datetime({
        message: 'Invalid check-in date format',
    }),
    checkOut: z.string().datetime({
        message: 'Invalid check-out date format',
    }),
    cost: z.number().optional().or(z.literal(null)),
    bookingReference: z.string().optional(),
    amenities: z.array(z.string()).optional(),
    notes: z.string().optional(),
});
export const AccommodationSchema = AccommodationBaseSchema.refine((data) => {
    const checkIn = new Date(data.checkIn);
    const checkOut = new Date(data.checkOut);
    return checkOut > checkIn;
}, {
    message: 'Check-out date must be after check-in date',
    path: ['checkOut'],
});
// Transportation Schema with time validation
export const TransportationBaseSchema = z.object({
    id: z.string().uuid(),
    type: z.enum(['flight', 'train', 'bus', 'car', 'other'], {
        message: 'Invalid transportation type',
    }),
    from: z.string().min(1, 'Origin location is required'),
    to: z.string().min(1, 'Destination location is required'),
    departureTime: z.string().datetime({
        message: 'Invalid departure time format',
    }),
    arrivalTime: z.string().datetime({
        message: 'Invalid arrival time format',
    }),
    cost: z.number().optional().or(z.literal(null)),
    bookingReference: z.string().optional(),
    notes: z.string().optional(),
});
export const TransportationSchema = TransportationBaseSchema.refine((data) => {
    const departure = new Date(data.departureTime);
    const arrival = new Date(data.arrivalTime);
    return arrival > departure;
}, {
    message: 'Arrival time must be after departure time',
    path: ['arrivalTime'],
});
// Budget Info Schema with validation
export const BudgetInfoSchema = z.object({
    totalBudget: z.number().min(0, 'Total budget must be positive'),
    currency: z
        .string()
        .default('USD')
        .refine((val) => ['USD', 'EUR', 'GBP'].includes(val), {
        message: 'Currency must be one of: USD, EUR, GBP',
    }),
    categories: z.object({
        accommodation: z.number().optional().default(0),
        transportation: z.number().optional().default(0),
        activities: z.number().optional().default(0),
        food: z.number().optional().default(0),
        shopping: z.number().optional().default(0),
        other: z.number().optional().default(0),
    }),
    dailyAverage: z.number().optional().or(z.literal(null)),
    expenses: z
        .array(z.object({
        id: z.string().uuid(),
        description: z.string().min(1, 'Description is required'),
        amount: z.number().min(0, 'Amount must be positive'),
        category: z.string().min(1, 'Category is required'),
        date: z.string().datetime({
            message: 'Invalid date format',
        }),
        notes: z.string().optional(),
    }))
        .optional(),
});
// Trip Feedback Schema with comprehensive validation
export const TripFeedbackBaseSchema = z.object({
    id: z.string().uuid().optional(),
    destination: z.string().min(1, 'Destination is required'),
    startDate: z.string().datetime({
        message: 'Invalid start date format',
    }),
    endDate: z.string().datetime({
        message: 'Invalid end date format',
    }),
    activities: z.array(ActivitySchema).optional(),
    accommodations: z.array(AccommodationSchema).optional(),
    transportation: z.array(TransportationSchema).optional(),
    budget: BudgetInfoSchema.optional(),
    notes: z.string().optional(),
    rating: z.number().min(1).max(5).optional(),
    createdAt: z.string().datetime().optional(),
    updatedAt: z.string().datetime().optional(),
});
export const TripFeedbackSchema = TripFeedbackBaseSchema.refine((data) => {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    return end >= start;
}, {
    message: 'End date must be after or equal to start date',
    path: ['endDate'],
});
// Helper function to validate trip feedback with detailed error messages
export function validateTripFeedback(data) {
    const result = TripFeedbackSchema.safeParse(data);
    if (result.success) {
        return { success: true, data: result.data };
    }
    // Extract and format error messages
    const errors = result.error.issues.map((err) => `${err.path.join('.')}: ${err.message}`);
    return {
        success: false,
        errors,
    };
}
// Export enhanced schemas for nested validation
export const ActivitySchemaForFeedback = ActivityBaseSchema.partial();
export const AccommodationSchemaForFeedback = AccommodationBaseSchema.partial();
export const TransportationSchemaForFeedback = TransportationBaseSchema.partial();
//# sourceMappingURL=trip.js.map