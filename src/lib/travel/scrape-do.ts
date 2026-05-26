/**
 * Scrape.do Async API — plugin `google/flights`
 * https://scrape.do/documentation/async-api/plugins/
 */

import type { DuffelCheapestOfferSummary } from './duffel';

const SCRAPE_DO_ASYNC = 'https://q.scrape.do/api/v1';

export type ScrapeDoGoogleFlightsInput = {
  originIata: string;
  destinationIata: string;
  outboundDate: string;
  returnDate?: string | null;
  cabinClass?: string;
  adults?: number;
  currency?: string;
};

type GoogleFlightSegment = {
  airline?: string;
  travel_class?: string;
};

type GoogleFlightItinerary = {
  flights?: GoogleFlightSegment[];
  layovers?: unknown[];
  price?: number;
  carbon_emissions?: { this_flight?: number };
  booking_token?: string;
};

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export function getScrapeDoToken(): string | undefined {
  const raw =
    process.env.SCRAPE_DO_API_KEY?.trim() || process.env.SCRAPE_DO_TOKEN?.trim();
  return raw || undefined;
}

export function isScrapeDoConfigured(): boolean {
  return Boolean(getScrapeDoToken());
}

/** Google Flights `travel_class`: 1 economy … 4 first */
export function cabinClassToGoogleTravelClass(cabinClass: string): number {
  const c = cabinClass.trim().toLowerCase().replace(/-/g, '_');
  if (c === 'premium_economy' || c === 'premium') return 2;
  if (c === 'business') return 3;
  if (c === 'first') return 4;
  return 1;
}

function travelClassLabel(travelClass: number): string {
  switch (travelClass) {
    case 2:
      return 'Premium economy';
    case 3:
      return 'Business';
    case 4:
      return 'First';
    default:
      return 'Economy';
  }
}

function asRecord(v: unknown): Record<string, unknown> | null {
  return v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : null;
}

function parseItineraryPrice(it: GoogleFlightItinerary): number | null {
  const p = it.price;
  if (typeof p === 'number' && Number.isFinite(p) && p > 0) return p;
  if (typeof p === 'string') {
    const n = parseFloat(p);
    if (Number.isFinite(n) && n > 0) return n;
  }
  return null;
}

function countStops(it: GoogleFlightItinerary): number {
  const layovers = Array.isArray(it.layovers) ? it.layovers.length : 0;
  const flights = Array.isArray(it.flights) ? it.flights.length : 0;
  if (layovers > 0) return layovers;
  return Math.max(0, flights - 1);
}

/**
 * Pick cheapest itinerary from Scrape.do / Google Flights JSON.
 */
export function parseGoogleFlightsCheapest(
  data: unknown,
  opts?: { travelClass?: number; currency?: string },
): DuffelCheapestOfferSummary | null {
  const root = asRecord(data);
  if (!root) return null;

  const candidates: GoogleFlightItinerary[] = [];
  for (const key of ['best_flights', 'other_flights'] as const) {
    const arr = root[key];
    if (Array.isArray(arr)) candidates.push(...(arr as GoogleFlightItinerary[]));
  }

  const insights = asRecord(root.price_insights);
  const lowest =
    insights && typeof insights.lowest_price === 'number' ? insights.lowest_price : null;

  let best: GoogleFlightItinerary | null = null;
  let bestPrice = Infinity;

  for (const it of candidates) {
    const price = parseItineraryPrice(it);
    if (price == null || price >= bestPrice) continue;
    bestPrice = price;
    best = it;
  }

  if (!best && lowest != null && lowest > 0) {
    bestPrice = lowest;
    best = candidates[0] ?? null;
  }

  if (!best || !Number.isFinite(bestPrice) || bestPrice <= 0) return null;

  const flights = Array.isArray(best.flights) ? best.flights : [];
  const first = flights[0];
  const airlineName =
    typeof first?.airline === 'string' && first.airline.trim()
      ? first.airline.trim()
      : 'Airline';
  const cabinFromSeg =
    typeof first?.travel_class === 'string' ? first.travel_class : travelClassLabel(opts?.travelClass ?? 1);

  const params = asRecord(root.search_parameters);
  const currency =
    (typeof params?.currency === 'string' && params.currency) ||
    opts?.currency ||
    'EUR';

  const grams = best.carbon_emissions?.this_flight;
  const emissionsKg =
    typeof grams === 'number' && Number.isFinite(grams) ? grams / 1000 : null;

  const offerId =
    typeof best.booking_token === 'string' && best.booking_token
      ? `scrape.do:${best.booking_token.slice(0, 48)}`
      : `scrape.do:${bestPrice}`;

  return {
    offerId,
    totalAmount: bestPrice,
    currency,
    airlineName,
    cabinLabel: cabinFromSeg,
    stops: countStops(best),
    emissionsKg,
  };
}

function scrapeDoHeaders(token: string): HeadersInit {
  return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Token': token,
  };
}

function decodeTaskContent(task: Record<string, unknown>): unknown {
  const raw = task.Content;
  if (typeof raw !== 'string' || !raw.trim()) return null;

  if (task.Base64EncodedContent === true) {
    try {
      const decoded = Buffer.from(raw, 'base64').toString('utf8');
      return JSON.parse(decoded);
    } catch {
      return null;
    }
  }

  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}

async function pollScrapeDoJob(
  token: string,
  jobId: string,
  taskId: string,
  maxWaitMs: number,
): Promise<unknown> {
  const deadline = Date.now() + maxWaitMs;
  let delay = 800;

  while (Date.now() < deadline) {
    const jobRes = await fetch(`${SCRAPE_DO_ASYNC}/jobs/${encodeURIComponent(jobId)}`, {
      headers: scrapeDoHeaders(token),
      cache: 'no-store',
    });
    if (!jobRes.ok) {
      const text = await jobRes.text();
      throw new Error(`Scrape.do job ${jobRes.status}: ${text.slice(0, 200)}`);
    }
    const job = (await jobRes.json()) as Record<string, unknown>;
    const status = typeof job.Status === 'string' ? job.Status : '';

    if (status === 'error' || status === 'canceled') {
      throw new Error(`Scrape.do job ${status}`);
    }

    if (status === 'success') {
      const taskRes = await fetch(
        `${SCRAPE_DO_ASYNC}/jobs/${encodeURIComponent(jobId)}/${encodeURIComponent(taskId)}`,
        { headers: scrapeDoHeaders(token), cache: 'no-store' },
      );
      if (!taskRes.ok) {
        const text = await taskRes.text();
        throw new Error(`Scrape.do task ${taskRes.status}: ${text.slice(0, 200)}`);
      }
      const task = (await taskRes.json()) as Record<string, unknown>;
      const taskStatus = typeof task.Status === 'string' ? task.Status : '';
      if (taskStatus === 'error') {
        const msg = typeof task.ErrorMessage === 'string' ? task.ErrorMessage : 'task failed';
        throw new Error(`Scrape.do task error: ${msg}`);
      }
      return decodeTaskContent(task);
    }

    await sleep(delay);
    delay = Math.min(delay + 400, 2500);
  }

  throw new Error('Scrape.do job timed out');
}

/**
 * Cheapest Google Flights fare via Scrape.do async plugin.
 */
export async function fetchScrapeDoGoogleFlightsCheapest(
  input: ScrapeDoGoogleFlightsInput,
  opts?: { maxWaitMs?: number },
): Promise<DuffelCheapestOfferSummary | null> {
  const token = getScrapeDoToken();
  if (!token) return null;

  const travelClass = cabinClassToGoogleTravelClass(input.cabinClass ?? 'economy');
  const currency =
    input.currency?.trim() ||
    process.env.SCRAPE_DO_FLIGHTS_CURRENCY?.trim() ||
    'EUR';

  const params: Record<string, unknown> = {
    departure_id: input.originIata.trim().toUpperCase(),
    arrival_id: input.destinationIata.trim().toUpperCase(),
    outbound_date: input.outboundDate,
    travel_class: travelClass,
    currency,
    sort_by: 2,
  };

  if (input.returnDate?.trim()) {
    params.return_date = input.returnDate.trim();
    params.type = 1;
  } else {
    params.type = 2;
  }

  const adults = input.adults ?? 1;
  if (adults > 1) params.adults = adults;

  const createRes = await fetch(`${SCRAPE_DO_ASYNC}/jobs`, {
    method: 'POST',
    headers: scrapeDoHeaders(token),
    body: JSON.stringify({
      Plugin: {
        Key: 'google/flights',
        Params: [params],
      },
    }),
    cache: 'no-store',
  });

  if (!createRes.ok) {
    const text = await createRes.text();
    throw new Error(`Scrape.do create job ${createRes.status}: ${text.slice(0, 240)}`);
  }

  const created = (await createRes.json()) as Record<string, unknown>;
  const jobId = typeof created.JobID === 'string' ? created.JobID : '';
  const taskIds = Array.isArray(created.TaskIDs) ? created.TaskIDs : [];
  const taskId = typeof taskIds[0] === 'string' ? taskIds[0] : '';
  if (!jobId || !taskId) {
    throw new Error('Scrape.do: missing JobID or TaskID');
  }

  const content = await pollScrapeDoJob(token, jobId, taskId, opts?.maxWaitMs ?? 32000);
  return parseGoogleFlightsCheapest(content, { travelClass, currency });
}
