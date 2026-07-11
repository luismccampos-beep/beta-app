import { describe, expect, it } from 'vitest';

import {
  cabinClassToGoogleTravelClass,
  parseGoogleFlightsCheapest,
} from './scrape-do';

describe('parseGoogleFlightsCheapest', () => {
  it('picks the cheapest itinerary from best_flights', () => {
    const raw = {
      search_parameters: { currency: 'EUR' },
      best_flights: [
        {
          flights: [{ airline: 'TAP Air Portugal', travel_class: 'Economy' }],
          layovers: [],
          price: 189,
          carbon_emissions: { this_flight: 120_000 },
          booking_token: 'abc123',
        },
        {
          flights: [{ airline: 'Ryanair', travel_class: 'Economy' }],
          layovers: [{ duration: 90, id: 'MAD' }],
          price: 79,
          booking_token: 'cheap',
        },
      ],
      other_flights: [],
    };

    const offer = parseGoogleFlightsCheapest(raw, { travelClass: 1, currency: 'EUR' });
    expect(offer).not.toBeNull();
    expect(offer!.totalAmount).toBe(79);
    expect(offer!.airlineName).toBe('Ryanair');
    expect(offer!.stops).toBe(1);
    expect(offer!.currency).toBe('EUR');
    expect(offer!.emissionsKg).toBeNull();
  });

  it('uses price_insights when flight lists are empty', () => {
    const raw = {
      search_parameters: { currency: 'USD' },
      best_flights: [],
      other_flights: [],
      price_insights: { lowest_price: 250 },
    };
    expect(parseGoogleFlightsCheapest(raw)?.totalAmount).toBeUndefined();
  });
});

describe('cabinClassToGoogleTravelClass', () => {
  it('maps Duffel-style cabin names', () => {
    expect(cabinClassToGoogleTravelClass('economy')).toBe(1);
    expect(cabinClassToGoogleTravelClass('premium_economy')).toBe(2);
    expect(cabinClassToGoogleTravelClass('business')).toBe(3);
    expect(cabinClassToGoogleTravelClass('first')).toBe(4);
  });
});
