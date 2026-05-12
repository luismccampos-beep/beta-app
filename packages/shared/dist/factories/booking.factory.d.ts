import type { BookingPayload, BookingBreakdown, Booking } from '../types/bookings';
export declare const createBookingPayload: (overrides?: Partial<BookingPayload>) => BookingPayload;
export declare const createBookingBreakdown: (overrides?: Partial<BookingBreakdown>) => BookingBreakdown;
export declare const createBooking: (overrides?: Partial<Booking>) => Booking;
