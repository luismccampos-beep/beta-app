import { NextResponse } from 'next/server';

import type { TravelResult } from '../../../components/data/mockResults';
import { addDaysIso, defaultDepartureIso } from '../../../../lib/travel/buildResultsQuery';
import { continentFromCountryCode } from '../../../../lib/travel/continent';
import {
  fetchDuffelAirportByIata,
  fetchDuffelCheapestOfferForSlice,
  fetchDuffelCheapestOfferForSlices,
} from '../../../../lib/travel/duffel';
import { hotelbedsMinHotelRateByGeo } from '../../../../lib/travel/hotelbeds';

export const dynamic = 'force-dynamic';

const GENERIC_IMAGE =
  'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1400&q=70';

type SearchMode = 'both' | 'flights' | 'hotels';
type TripType = 'oneway' | 'roundtrip';

function parseDestinations(raw: string | null): string[] {
  if (!raw?.trim()) return [];
  return [
    ...new Set(
      raw
        .split(/[,;\s]+/)
        .map((s) => s.trim().toUpperCase())
        .filter((s) => /^[A-Z]{3}$/.test(s)),
    ),
  ];
}

function parseMode(raw: string | null): SearchMode {
  const v = (raw ?? 'both').trim().toLowerCase();
  if (v === 'flights' || v === 'flight') return 'flights';
  if (v === 'hotels' || v === 'hotel') return 'hotels';
  return 'both';
}

function parseTripType(raw: string | null): TripType {
  return (raw ?? '').trim().toLowerCase() === 'roundtrip' ? 'roundtrip' : 'oneway';
}

function isIsoDate(s: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(s);
}

function isAfterIso(a: string, b: string): boolean {
  return new Date(`${a}T12:00:00Z`).getTime() > new Date(`${b}T12:00:00Z`).getTime();
}

function scoreFromPrice(total: number): number {
  if (!Number.isFinite(total) || total <= 0) return 72;
  return Math.max(55, Math.min(96, Math.round(100 - total / 120)));
}

function resolveReturnDate(
  departureDate: string,
  nights: number,
  returnParam: string | null,
): string {
  if (returnParam && isIsoDate(returnParam) && isAfterIso(returnParam, departureDate)) {
    return returnParam;
  }
  return addDaysIso(departureDate, nights);
}

async function buildHotelOnlyResult(input: {
  token: string;
  dest: string;
  departureDate: string;
  nights: number;
  adults: number;
  hbKey: string;
  hbSecret: string;
  hbBase: string;
}): Promise<{ result: TravelResult | null; error?: string }> {
  const checkOut = addDaysIso(input.departureDate, input.nights);
  const destAp = await fetchDuffelAirportByIata(input.token, input.dest);
  if (!destAp) {
    return { result: null, error: 'Unknown destination airport (Duffel)' };
  }
  const city = destAp.cityName ?? destAp.name ?? input.dest;
  const country = destAp.iataCountryCode ?? '';
  const continent = continentFromCountryCode(country);

  if (
    destAp.latitude == null ||
    destAp.longitude == null ||
    !Number.isFinite(destAp.latitude) ||
    !Number.isFinite(destAp.longitude)
  ) {
    return { result: null, error: 'Missing coordinates for hotel search' };
  }

  let hotelMin: Awaited<ReturnType<typeof hotelbedsMinHotelRateByGeo>> = null;
  try {
    hotelMin = await hotelbedsMinHotelRateByGeo(input.hbBase, input.hbKey, input.hbSecret, {
      checkIn: input.departureDate,
      checkOut,
      latitude: destAp.latitude,
      longitude: destAp.longitude,
      adults: input.adults,
      rooms: 1,
      radiusKm: 15,
    });
  } catch (e: unknown) {
    return {
      result: null,
      error: e instanceof Error ? e.message : 'Hotelbeds search failed',
    };
  }

  if (!hotelMin) {
    return { result: null, error: 'No Hotelbeds availability for this area/dates' };
  }

  const blurb = `Hotel-only stay in ${city} (${input.departureDate} → ${checkOut}) via Hotelbeds geo search.`;

  const result: TravelResult = {
    id: `hotel-only-${input.dest}-${input.departureDate}-${input.nights}`,
    destination: city,
    country: country || '—',
    continent,
    imageUrl: GENERIC_IMAGE,
    aiMatchScore: scoreFromPrice(hotelMin.minRate),
    rating: 4.4,
    reviews: 80,
    duration: input.nights,
    price: Math.round(hotelMin.minRate),
    priceCurrency: hotelMin.currency,
    sustainable: true,
    description: { en: blurb, pt: blurb, es: blurb, fr: blurb },
    highlights: ['Hotelbeds', `${input.nights} night stay`, hotelMin.hotelName ?? 'Lowest rate'],
    bestFor: ['Hotel stay', 'Hotel-only mode'],
    flight: { class: '—' },
    accommodation: { type: hotelMin.hotelName ? `From ${hotelMin.hotelName}` : 'Hotels (Hotelbeds)' },
  };

  return { result };
}

async function buildPackageOrFlightResult(input: {
  token: string;
  origin: string;
  dest: string;
  departureDate: string;
  returnDate: string;
  tripType: TripType;
  nights: number;
  adults: number;
  cabinClass: string;
  mode: SearchMode;
  hbKey?: string;
  hbSecret?: string;
  hbBase: string;
}): Promise<{ result: TravelResult | null; error?: string }> {
  const checkOut = addDaysIso(input.departureDate, input.nights);
  const includeHotels = input.mode === 'both';

  let flight: Awaited<ReturnType<typeof fetchDuffelCheapestOfferForSlice>> = null;
  try {
    if (input.tripType === 'roundtrip') {
      flight = await fetchDuffelCheapestOfferForSlices(input.token, {
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
      flight = await fetchDuffelCheapestOfferForSlice(input.token, {
        originIata: input.origin,
        destinationIata: input.dest,
        departureDate: input.departureDate,
        cabinClass: input.cabinClass,
        adults: input.adults,
      });
    }
  } catch (e: unknown) {
    return {
      result: null,
      error: e instanceof Error ? e.message : 'Duffel search failed',
    };
  }

  if (!flight) {
    return { result: null, error: 'No Duffel offers for this route/date' };
  }

  const destAp = await fetchDuffelAirportByIata(input.token, input.dest);
  const city = destAp?.cityName ?? destAp?.name ?? input.dest;
  const country = destAp?.iataCountryCode ?? '';
  const continent = continentFromCountryCode(country);

  let hotelMin: Awaited<ReturnType<typeof hotelbedsMinHotelRateByGeo>> = null;
  let hotelError: string | null = null;

  if (
    includeHotels &&
    input.hbKey &&
    input.hbSecret &&
    destAp?.latitude != null &&
    destAp?.longitude != null &&
    Number.isFinite(destAp.latitude) &&
    Number.isFinite(destAp.longitude)
  ) {
    try {
      hotelMin = await hotelbedsMinHotelRateByGeo(input.hbBase, input.hbKey, input.hbSecret, {
        checkIn: input.departureDate,
        checkOut,
        latitude: destAp.latitude,
        longitude: destAp.longitude,
        adults: input.adults,
        rooms: 1,
        radiusKm: 15,
      });
    } catch (e: unknown) {
      hotelError = e instanceof Error ? e.message : 'Hotelbeds search failed';
    }
  }

  let totalPrice = flight.totalAmount;
  let accommodationLabel =
    input.mode === 'flights'
      ? 'Flights only (no hotel search)'
      : hotelMin?.hotelName
        ? `From ${hotelMin.hotelName}`
        : 'Hotels (Hotelbeds)';

  if (input.mode !== 'flights' && hotelMin && hotelMin.currency === flight.currency) {
    totalPrice = Math.round((flight.totalAmount + hotelMin.minRate) * 100) / 100;
    accommodationLabel = hotelMin.hotelName
      ? `${hotelMin.hotelName} (${hotelMin.currency} ${hotelMin.minRate})`
      : `Hotel from ${hotelMin.minRate} ${hotelMin.currency}`;
  } else if (input.mode !== 'flights' && hotelMin && hotelMin.currency !== flight.currency) {
    accommodationLabel = `${hotelMin.hotelName ?? 'Hotel'} (${hotelMin.currency} ${hotelMin.minRate})`;
  } else if (input.mode !== 'flights' && hotelError) {
    accommodationLabel = `Hotels unavailable (${hotelError.slice(0, 60)})`;
  } else if (input.mode !== 'flights' && !input.hbKey) {
    accommodationLabel = 'Configure Hotelbeds for live hotel rates';
  }

  const sustainable =
    flight.emissionsKg != null && Number.isFinite(flight.emissionsKg) && flight.emissionsKg < 280;

  const tripLabel = input.tripType === 'roundtrip' ? 'Round-trip' : 'One-way';
  const blurb =
    input.tripType === 'roundtrip'
      ? `Duffel ${tripLabel.toLowerCase()} ${input.origin} ↔ ${input.dest}, outbound ${input.departureDate}, return ${input.returnDate}. ${includeHotels ? 'Hotelbeds stay priced when currency matches flight.' : ''}`.trim()
      : `Duffel one-way flight ${input.origin} → ${input.dest} (${input.departureDate}). ${includeHotels ? 'Hotelbeds hotel rate included when currencies match.' : ''}`.trim();

  const highlights = [
    tripLabel,
    flight.airlineName,
    flight.stops === 0 ? 'Direct' : `${flight.stops} stop(s) total`,
    `${flight.totalAmount} ${flight.currency} flight`,
  ];

  const result: TravelResult = {
    id: `live-${input.tripType}-${input.origin}-${input.dest}-${input.departureDate}`,
    destination: city,
    country: country || '—',
    continent,
    imageUrl: GENERIC_IMAGE,
    aiMatchScore: scoreFromPrice(totalPrice),
    rating: hotelMin && input.mode !== 'flights' ? 4.5 : 4.2,
    reviews: hotelMin && input.mode !== 'flights' ? 120 : 40,
    duration: input.nights,
    price: Math.round(totalPrice),
    priceCurrency: flight.currency,
    sustainable,
    description: {
      en: blurb,
      pt: blurb,
      es: blurb,
      fr: blurb,
    },
    highlights,
    bestFor: [
      flight.cabinLabel,
      input.tripType === 'roundtrip' ? 'Round-trip' : 'One-way',
      input.mode === 'flights' ? 'Flights only' : 'Duffel + Hotelbeds',
    ],
    flight: { class: flight.cabinLabel },
    accommodation: { type: accommodationLabel },
  };

  return { result };
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const mode = parseMode(url.searchParams.get('mode'));
  const tripType = parseTripType(url.searchParams.get('tripType'));

  const duffelToken = process.env.DUFFEL_ACCESS_TOKEN?.trim();
  const hbKey = process.env.HOTELBEDS_API_KEY?.trim();
  const hbSecret = process.env.HOTELBEDS_API_SECRET?.trim();
  const hbBase =
    process.env.HOTELBEDS_API_BASE_URL?.trim() || 'https://api.test.hotelbeds.com';

  const needsFlights = mode === 'both' || mode === 'flights';
  const needsHotels = mode === 'both' || mode === 'hotels';

  if (needsFlights && !duffelToken) {
    return NextResponse.json(
      {
        ok: false,
        message: 'Duffel is not configured (DUFFEL_ACCESS_TOKEN).',
        results: [] as TravelResult[],
        errors: [],
      },
      { status: 503 },
    );
  }

  if (mode === 'hotels' && (!hbKey || !hbSecret)) {
    return NextResponse.json(
      {
        ok: false,
        message: 'Hotel-only mode requires HOTELBEDS_API_KEY and HOTELBEDS_API_SECRET.',
        results: [] as TravelResult[],
        errors: [],
      },
      { status: 503 },
    );
  }

  if (mode === 'hotels' && !duffelToken) {
    return NextResponse.json(
      {
        ok: false,
        message:
          'Hotel-only mode still uses Duffel to resolve airport coordinates. Set DUFFEL_ACCESS_TOKEN.',
        results: [] as TravelResult[],
        errors: [],
      },
      { status: 503 },
    );
  }

  const origin = (
    url.searchParams.get('origin') ??
    process.env.NEXT_PUBLIC_DEFAULT_ORIGIN_IATA ??
    'LIS'
  )
    .trim()
    .toUpperCase();
  const destinations = parseDestinations(url.searchParams.get('destinations'));
  const destList =
    destinations.length > 0 ? destinations.slice(0, 6) : ['OPO', 'MAD', 'BCN', 'FAO', 'ORY', 'MXP'];

  const departureDate = url.searchParams.get('departure')?.trim() || defaultDepartureIso(21);
  const nights = Math.min(
    30,
    Math.max(1, parseInt(url.searchParams.get('nights') ?? '3', 10) || 3),
  );
  const adults = Math.min(9, Math.max(1, parseInt(url.searchParams.get('adults') ?? '1', 10) || 1));
  const cabinClass = (url.searchParams.get('cabinClass') ?? 'economy').trim().toLowerCase().replace(/-/g, '_');

  const returnDate = resolveReturnDate(
    departureDate,
    nights,
    url.searchParams.get('return')?.trim() ?? null,
  );

  const errors: { destination: string; message: string }[] = [];
  const results: TravelResult[] = [];

  for (const dest of destList) {
    if (dest === origin) continue;

    if (mode === 'hotels' && duffelToken && hbKey && hbSecret) {
      const { result, error } = await buildHotelOnlyResult({
        token: duffelToken,
        dest,
        departureDate,
        nights,
        adults,
        hbKey,
        hbSecret,
        hbBase,
      });
      if (result) results.push(result);
      else errors.push({ destination: dest, message: error ?? 'Unknown error' });
      continue;
    }

    if (needsFlights && duffelToken) {
      const { result, error } = await buildPackageOrFlightResult({
        token: duffelToken,
        origin,
        dest,
        departureDate,
        returnDate,
        tripType,
        nights,
        adults,
        cabinClass,
        mode,
        hbKey,
        hbSecret,
        hbBase,
      });
      if (result) results.push(result);
      else errors.push({ destination: dest, message: error ?? 'Unknown error' });
    }
  }

  return NextResponse.json({
    ok: true,
    results,
    errors,
    meta: {
      origin,
      destinations: destList,
      departureDate,
      returnDate: tripType === 'roundtrip' ? returnDate : null,
      nights,
      adults,
      cabinClass,
      tripType,
      mode,
      hotelbeds: Boolean(hbKey && hbSecret),
    },
  });
}
