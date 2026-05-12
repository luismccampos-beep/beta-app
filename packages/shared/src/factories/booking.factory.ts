import { faker } from '@faker-js/faker';

import type { BookingPayload, BookingBreakdown, Currency, Booking } from '../types/bookings';

export const createBookingPayload = (overrides: Partial<BookingPayload> = {}): BookingPayload => {
  return {
    packageId: faker.string.uuid(),
    fullName: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    notes: faker.lorem.sentence(),
    startDate: faker.date.future().toISOString().substring(0, 10),
    endDate: faker.date.future().toISOString().substring(0, 10),
    guests: faker.number.int({ min: 1, max: 5 }),
    currency: (faker.helpers.arrayElement(['EUR', 'USD', 'BRL']) as Currency),
    ...overrides,
  };
};

export const createBookingBreakdown = (overrides: Partial<BookingBreakdown> = {}): BookingBreakdown => {
  const basePerPerson = faker.number.int({ min: 100, max: 1000 });
  const guests = faker.number.int({ min: 1, max: 5 });
  const baseTotal = basePerPerson * guests;
  const taxesRate = 23;
  const taxesAmount = (baseTotal * taxesRate) / 100;

  return {
    basePerPerson,
    guests,
    baseTotal,
    extras: [],
    extrasTotal: 0,
    subtotal: baseTotal,
    taxes: {
      rate: taxesRate,
      amount: taxesAmount,
    },
    grandTotal: baseTotal + taxesAmount,
    ...overrides,
  };
};

export const createBooking = (overrides: Partial<Booking> = {}): Booking => {
  const now = new Date();
  const startDate = faker.date.future();
  const endDate = new Date(startDate.getTime() + 86400000 * 7);

  return {
    id: faker.string.uuid(),
    bookingReference: `REF-${faker.string.alphanumeric(8).toUpperCase()}`,
    status: faker.helpers.arrayElement(['confirmed', 'pending', 'cancelled', 'completed', 'payment_pending']),
    createdAt: now.toISOString(),
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    durationDays: 7,
    userId: faker.string.uuid(),
    user: {
      name: faker.person.fullName(),
      email: faker.internet.email()
    },
    destination: {
      id: faker.string.uuid(),
      name: faker.location.city(),
      imageUrl: faker.image.url()
    },
    guests: {
      adults: faker.number.int({ min: 1, max: 2 }),
      children: faker.number.int({ min: 0, max: 2 }),
      infants: faker.number.int({ min: 0, max: 1 }),
      childrenAges: [faker.number.int({ min: 1, max: 12 })]
    },
    roomDetails: {
      type: faker.helpers.arrayElement(['Standard', 'Deluxe', 'Suite']),
      quantity: 1
    },
    activityDetails: [
      { name: faker.lorem.words(3), date: startDate.toISOString(), participants: 2 },
      { name: faker.lorem.words(3), date: endDate.toISOString(), participants: 2 }
    ],
    pricing: {
      basePrice: faker.number.int({ min: 500, max: 2000 }),
      currency: 'EUR',
      taxesAndFees: faker.number.int({ min: 50, max: 200 }),
      discountsApplied: 0,
      totalAmount: faker.number.int({ min: 600, max: 2500 }),
      breakdown: [
        { item: 'Base Price', amount: 1000 },
        { item: 'Taxes', amount: 230 }
      ]
    },
    paymentDetails: {
      methodUsed: faker.helpers.arrayElement(['Credit Card', 'PayPal', 'Bank Transfer']),
      status: 'paid',
      paymentDeadline: faker.date.future().toISOString(),
      paymentLink: faker.internet.url()
    },
    specialRequests: faker.lorem.sentence(),
    cancellationPolicy: {
      summary: 'Free cancellation up to 7 days before',
      deadline: faker.date.future().toISOString(),
      isRefundable: true,
      termsUrl: faker.internet.url()
    },
    notesForUser: faker.lorem.sentence(),
    ...overrides,
  };
};

