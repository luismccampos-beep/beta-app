const DUFFEL_API = 'https://api.duffel.com';

export type DuffelLoyaltyProgramme = {
  id: string;
  name: string;
  alliance: string | null;
};

export type DuffelAirportOption = {
  iataCode: string;
  name: string;
  cityName: string | null;
  iataCountryCode: string | null;
};

function duffelHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    'Duffel-Version': 'v2',
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
}

function mapLoyaltyRow(raw: Record<string, unknown>): DuffelLoyaltyProgramme | null {
  const id = typeof raw.id === 'string' ? raw.id : null;
  const name = typeof raw.name === 'string' ? raw.name : null;
  if (!id || !name) return null;
  const alliance = typeof raw.alliance === 'string' ? raw.alliance : null;
  return { id, name, alliance };
}

function mapAirportRow(raw: Record<string, unknown>): DuffelAirportOption | null {
  const iataCode = typeof raw.iata_code === 'string' ? raw.iata_code : null;
  const name = typeof raw.name === 'string' ? raw.name : null;
  if (!iataCode || !name) return null;
  let cityName: string | null = null;
  if (raw.city && typeof raw.city === 'object' && raw.city !== null) {
    const c = (raw.city as Record<string, unknown>).name;
    cityName = typeof c === 'string' ? c : null;
  }
  const iataCountryCode =
    typeof raw.iata_country_code === 'string' ? raw.iata_country_code : null;
  return { iataCode, name, cityName, iataCountryCode };
}

export async function fetchDuffelLoyaltyProgrammes(
  token: string,
  maxPages = 3,
): Promise<DuffelLoyaltyProgramme[]> {
  const out: DuffelLoyaltyProgramme[] = [];
  let after: string | undefined;

  for (let page = 0; page < maxPages; page++) {
    const url = new URL(`${DUFFEL_API}/air/loyalty_programmes`);
    url.searchParams.set('limit', '200');
    if (after) url.searchParams.set('after', after);

    const res = await fetch(url.toString(), { headers: duffelHeaders(token), cache: 'no-store' });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`Duffel loyalty_programmes ${res.status}: ${text.slice(0, 200)}`);
    }
    const json = (await res.json()) as {
      data?: Record<string, unknown>[];
      meta?: { after?: string | null };
    };
    const rows = json.data ?? [];
    for (const row of rows) {
      const m = mapLoyaltyRow(row);
      if (m) out.push(m);
    }
    const next = json.meta?.after;
    if (!next || rows.length === 0) break;
    after = next;
  }

  return out;
}

export async function fetchDuffelAirportsPage(token: string, limit = 80): Promise<DuffelAirportOption[]> {
  const url = new URL(`${DUFFEL_API}/air/airports`);
  url.searchParams.set('limit', String(Math.min(limit, 200)));

  const res = await fetch(url.toString(), { headers: duffelHeaders(token), cache: 'no-store' });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Duffel airports ${res.status}: ${text.slice(0, 200)}`);
  }
  const json = (await res.json()) as { data?: Record<string, unknown>[] };
  const rows = json.data ?? [];
  const out: DuffelAirportOption[] = [];
  for (const row of rows) {
    const m = mapAirportRow(row);
    if (m) out.push(m);
  }
  return out;
}

/** Values accepted on Duffel offer slices (`cabin_class`). */
export const DUFFEL_CABIN_CLASSES = [
  { value: 'economy', label: 'Economy' },
  { value: 'premium_economy', label: 'Premium Economy' },
  { value: 'business', label: 'Business' },
  { value: 'first', label: 'First' },
] as const;

export type DuffelAirportGeo = DuffelAirportOption & {
  latitude: number | null;
  longitude: number | null;
};

function mapAirportGeo(raw: Record<string, unknown>): DuffelAirportGeo | null {
  const base = mapAirportRow(raw);
  if (!base) return null;
  const latN = typeof raw.latitude === 'number' ? raw.latitude : parseFloat(String(raw.latitude ?? ''));
  const lonN = typeof raw.longitude === 'number' ? raw.longitude : parseFloat(String(raw.longitude ?? ''));
  const lat = Number.isFinite(latN) ? latN : null;
  const lon = Number.isFinite(lonN) ? lonN : null;
  return { ...base, latitude: lat, longitude: lon };
}

/** Resolve an airport (including coordinates for hotel geo search). */
export async function fetchDuffelAirportByIata(token: string, iata: string): Promise<DuffelAirportGeo | null> {
  const code = iata.trim().toUpperCase();
  const u = new URL(`${DUFFEL_API}/air/airports`);
  u.searchParams.set('limit', '5');
  u.searchParams.set('filter[iata_code][eq]', code);

  const res = await fetch(u.toString(), { headers: duffelHeaders(token), cache: 'no-store' });
  if (!res.ok) return null;
  const json = (await res.json()) as { data?: Record<string, unknown>[] };
  const rows = json.data ?? [];
  const hit = rows.find((r) => String(r.iata_code ?? '').toUpperCase() === code) ?? rows[0];
  if (!hit) return null;
  return mapAirportGeo(hit);
}

export type DuffelCheapestOfferSummary = {
  offerId: string;
  totalAmount: number;
  currency: string;
  airlineName: string;
  cabinLabel: string;
  stops: number;
  emissionsKg: number | null;
};

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function pickCheapestOffer(offers: Record<string, unknown>[]): DuffelCheapestOfferSummary | null {
  let best: Record<string, unknown> | null = null;
  let bestNum = Infinity;
  for (const o of offers) {
    const amt = parseFloat(typeof o.total_amount === 'string' ? o.total_amount : 'NaN');
    if (!Number.isFinite(amt)) continue;
    if (amt < bestNum) {
      bestNum = amt;
      best = o;
    }
  }
  if (!best) return null;
  const offerId = typeof best.id === 'string' ? best.id : '';
  const total_amount = typeof best.total_amount === 'string' ? best.total_amount : '0';
  const currency = typeof best.total_currency === 'string' ? best.total_currency : 'EUR';
  const slices = Array.isArray(best.slices) ? (best.slices as Record<string, unknown>[]) : [];
  let stops = 0;
  for (const slice of slices) {
    const segs = Array.isArray(slice.segments)
      ? (slice.segments as Record<string, unknown>[])
      : [];
    stops += Math.max(0, segs.length - 1);
  }
  const firstSlice = slices[0] ?? {};
  const firstSegs = Array.isArray(firstSlice.segments)
    ? (firstSlice.segments as Record<string, unknown>[])
    : [];
  const firstSeg = firstSegs[0] ?? {};
  const marketing = firstSeg.marketing_carrier;
  let airlineName = 'Airline';
  if (marketing && typeof marketing === 'object' && marketing !== null) {
    const n = (marketing as Record<string, unknown>).name;
    if (typeof n === 'string') airlineName = n;
  }
  const cabin = typeof firstSlice.cabin_class === 'string' ? firstSlice.cabin_class : 'economy';
  const cabinLabel =
    DUFFEL_CABIN_CLASSES.find((c) => c.value === cabin)?.label ??
    cabin.replace(/_/g, ' ').replace(/\b\w/g, (x) => x.toUpperCase());
  const em = best.total_emissions_kg;
  const emissionsKg = typeof em === 'string' ? parseFloat(em) : typeof em === 'number' ? em : null;

  return {
    offerId,
    totalAmount: parseFloat(total_amount),
    currency,
    airlineName,
    cabinLabel,
    stops,
    emissionsKg: emissionsKg !== null && Number.isFinite(emissionsKg) ? emissionsKg : null,
  };
}

export type DuffelSliceInput = {
  origin: string;
  destination: string;
  departure_date: string;
};

/**
 * Create an offer request for one or more slices (e.g. round-trip) and return the cheapest offer.
 */
export async function fetchDuffelCheapestOfferForSlices(
  token: string,
  input: {
    slices: DuffelSliceInput[];
    cabinClass: string;
    adults: number;
  },
  opts?: { maxWaitMs?: number },
): Promise<DuffelCheapestOfferSummary | null> {
  if (!input.slices.length) return null;
  const maxWait = opts?.maxWaitMs ?? 28000;
  const started = Date.now();
  const passengers = Array.from({ length: Math.min(9, Math.max(1, input.adults)) }, () => ({
    type: 'adult' as const,
  }));

  const slices = input.slices.map((s) => ({
    origin: s.origin.trim().toUpperCase(),
    destination: s.destination.trim().toUpperCase(),
    departure_date: s.departure_date,
  }));

  const body = {
    data: {
      slices,
      passengers,
      cabin_class: input.cabinClass,
    },
  };

  const create = await fetch(`${DUFFEL_API}/air/offer_requests`, {
    method: 'POST',
    headers: duffelHeaders(token),
    body: JSON.stringify(body),
    cache: 'no-store',
  });
  if (!create.ok) {
    const text = await create.text().catch(() => '');
    throw new Error(`Duffel offer_requests create ${create.status}: ${text.slice(0, 240)}`);
  }
  const created = (await create.json()) as { data?: { id?: string; offers?: Record<string, unknown>[] } };
  const id = created.data?.id;
  if (!id) throw new Error('Duffel offer_requests: missing id');

  if (created.data?.offers && created.data.offers.length > 0) {
    return pickCheapestOffer(created.data.offers);
  }

  while (Date.now() - started < maxWait) {
    await sleep(600);
    const poll = await fetch(`${DUFFEL_API}/air/offer_requests/${encodeURIComponent(id)}`, {
      headers: duffelHeaders(token),
      cache: 'no-store',
    });
    if (!poll.ok) continue;
    const json = (await poll.json()) as { data?: { offers?: Record<string, unknown>[] } };
    const offers = json.data?.offers ?? [];
    if (offers.length > 0) return pickCheapestOffer(offers);
  }

  return null;
}

/** One-way convenience wrapper around {@link fetchDuffelCheapestOfferForSlices}. */
export async function fetchDuffelCheapestOfferForSlice(
  token: string,
  input: {
    originIata: string;
    destinationIata: string;
    departureDate: string;
    cabinClass: string;
    adults: number;
  },
  opts?: { maxWaitMs?: number },
): Promise<DuffelCheapestOfferSummary | null> {
  return fetchDuffelCheapestOfferForSlices(
    token,
    {
      slices: [
        {
          origin: input.originIata,
          destination: input.destinationIata,
          departure_date: input.departureDate,
        },
      ],
      cabinClass: input.cabinClass,
      adults: input.adults,
    },
    opts,
  );
}

