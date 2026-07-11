import type { DuffelCheapestOfferSummary } from './duffel';
import {
  fetchDuffelCheapestOfferForSlice,
  fetchDuffelCheapestOfferForSlices,
} from './duffel';
import {
  fetchScrapeDoGoogleFlightsCheapest,
  isScrapeDoConfigured,
} from './scrape-do';

export type LiveFlightSearchInput = {
  origin: string;
  dest: string;
  departureDate: string;
  returnDate: string;
  tripType: 'oneway' | 'roundtrip';
  cabinClass: string;
  adults: number;
  duffelToken?: string;
};

export type LiveFlightSearchResult = {
  flight: DuffelCheapestOfferSummary | null;
  provider: 'duffel' | 'scrape.do' | null;
  error?: string;
};

/**
 * Live flight price: Duffel first, then Scrape.do Google Flights when configured.
 */
export async function fetchLiveCheapestFlight(
  input: LiveFlightSearchInput,
): Promise<LiveFlightSearchResult> {
  const duffelToken = input.duffelToken?.trim();

  if (duffelToken) {
    try {
      let flight: DuffelCheapestOfferSummary | null = null;
      if (input.tripType === 'roundtrip') {
        flight = await fetchDuffelCheapestOfferForSlices(duffelToken, {
          slices: [
            {
              origin: input.origin,
              destination: input.dest,
              departure_date: input.departureDate,
            },
            {
              origin: input.dest,
              destination: input.origin,
              departure_date: input.returnDate,
            },
          ],
          cabinClass: input.cabinClass,
          adults: input.adults,
        });
      } else {
        flight = await fetchDuffelCheapestOfferForSlice(duffelToken, {
          originIata: input.origin,
          destinationIata: input.dest,
          departureDate: input.departureDate,
          cabinClass: input.cabinClass,
          adults: input.adults,
        });
      }
      if (flight) return { flight, provider: 'duffel' };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Duffel search failed';
      if (!isScrapeDoConfigured()) {
        return { flight: null, provider: null, error: msg };
      }
    }
  }

  if (!isScrapeDoConfigured()) {
    return {
      flight: null,
      provider: null,
      error: duffelToken ? 'No Duffel offers for this route/date' : 'No flight provider configured',
    };
  }

  try {
    const flight = await fetchScrapeDoGoogleFlightsCheapest({
      originIata: input.origin,
      destinationIata: input.dest,
      outboundDate: input.departureDate,
      returnDate: input.tripType === 'roundtrip' ? input.returnDate : null,
      cabinClass: input.cabinClass,
      adults: input.adults,
    });
    if (flight) return { flight, provider: 'scrape.do' };
    return { flight: null, provider: 'scrape.do', error: 'No Google Flights offers for this route/date' };
  } catch (e: unknown) {
    return {
      flight: null,
      provider: 'scrape.do',
      error: e instanceof Error ? e.message : 'Scrape.do search failed',
    };
  }
}
