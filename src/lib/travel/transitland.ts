/**
 * Transit.land (Interline) — GTFS feed aggregator & routing API.
 * https://www.transit.land/documentation
 *
 * Auth: `apikey` query parameter or `x-api-key` header.
 * Free (Explorer): Routing 1 000 queries/month, REST 10 000 queries/month.
 */

import type { TripGoTripPlan, TripGoSegmentSummary } from './tripgo';

const TRANSITLAND_API = 'https://transit.land/api';

// ── Types ────────────────────────────────────────────────────────────────

export type TransitLandLatLng = { lat: number; lon: number };

export type TransitLandRoutingInput = {
  from: TransitLandLatLng;
  to: TransitLandLatLng;
  /** Unix seconds; default ≈ now */
  departAfter?: number;
  /** Optional comma-separated modes: bus, subway, train, ferry, etc. */
  modes?: string;
  locale?: string;
  /** Max itineraries (default 3) */
  maxItineraries?: number;
};

// ── Config ───────────────────────────────────────────────────────────────

export function getTransitLandApiKey(): string | undefined {
  return process.env.TRANSITLAND_API_KEY?.trim() || undefined;
}

export function isTransitLandConfigured(): boolean {
  return Boolean(getTransitLandApiKey());
}

function transitLandUrl(path: string, params: Record<string, string>): string {
  const key = getTransitLandApiKey()!;
  const qs = new URLSearchParams({ ...params, apikey: key });
  return `${TRANSITLAND_API}${path}?${qs.toString()}`;
}

// ── Mode labels ──────────────────────────────────────────────────────────

const MODE_LABELS: Record<string, string> = {
  bus: 'Bus',
  rail: 'Train',
  subway: 'Metro',
  tram: 'Tram',
  ferry: 'Ferry',
  cable_car: 'Cable Car',
  gondola: 'Gondola',
  funicular: 'Funicular',
  walking: 'Walk',
  bicycle: 'Bicycle',
};

function modeLabel(mode: string): string {
  return MODE_LABELS[mode.toLowerCase()] ?? mode.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

// ── Parser ───────────────────────────────────────────────────────────────

type TransitLandItinerary = Record<string, unknown>;
type TransitLandLeg = Record<string, unknown>;

function parseLeg(leg: TransitLandLeg): TripGoSegmentSummary | null {
  const mode = (leg.mode as string) ?? 'unknown';
  const durationMinutes =
    typeof leg.duration_minutes === 'number'
      ? (leg.duration_minutes as number)
      : undefined;

  const fromStop = leg.from_stop as Record<string, unknown> | undefined;
  const toStop = leg.to_stop as Record<string, unknown> | undefined;

  const routeName =
    (leg.route_name as string) ??
    (leg.route_long_name as string) ??
    (leg.route_short_name as string) ??
    undefined;

  const departStr = leg.departure_time as string | undefined;
  const arriveStr = leg.arrival_time as string | undefined;
  const startTime = departStr
    ? Math.floor(new Date(departStr).getTime() / 1000)
    : undefined;
  const endTime = arriveStr
    ? Math.floor(new Date(arriveStr).getTime() / 1000)
    : undefined;

  return {
    mode,
    modeLabel: routeName ? `${modeLabel(mode)} ${routeName}` : modeLabel(mode),
    from:
      typeof fromStop?.name === 'string'
        ? (fromStop.name as string)
        : typeof leg.from_name === 'string'
          ? (leg.from_name as string)
          : '—',
    to:
      typeof toStop?.name === 'string'
        ? (toStop.name as string)
        : typeof leg.to_name === 'string'
          ? (leg.to_name as string)
          : '—',
    startTime,
    endTime,
    durationMinutes,
    serviceName: routeName,
    notes: leg.wheelchair_accessible
      ? 'Wheelchair accessible'
      : undefined,
  };
}

/**
 * Parse Transit.land routing response.
 * Returns itineraries as TripGoTripPlan[] sorted by duration.
 */
export function parseTransitLandResponse(data: Record<string, unknown>): {
  plans: TripGoTripPlan[];
  error?: string;
} {
  // Transit.land v2 routing returns: { data: { itineraries: [...] } }
  const root = data.data as Record<string, unknown> | undefined;
  const itineraries = Array.isArray(root?.itineraries)
    ? (root.itineraries as TransitLandItinerary[])
    : Array.isArray(data.itineraries)
      ? (data.itineraries as TransitLandItinerary[])
      : [];

  if (!itineraries.length) {
    return { plans: [], error: 'No itineraries found for this route' };
  }

  const plans: TripGoTripPlan[] = [];

  for (const it of itineraries) {
    const legs = Array.isArray(it.legs)
      ? (it.legs as TransitLandLeg[])
      : [];

    if (!legs.length) continue;

    const segments: TripGoSegmentSummary[] = [];
    for (const leg of legs) {
      const seg = parseLeg(leg);
      if (seg) segments.push(seg);
    }

    if (!segments.length) continue;

    const durationMinutes =
      (typeof it.duration_minutes === 'number'
        ? (it.duration_minutes as number)
        : undefined) ??
      segments.reduce((sum, s) => sum + (s.durationMinutes ?? 0), 0);

    const startTime = segments[0]?.startTime ?? Math.floor(Date.now() / 1000);
    const endTime =
      segments[segments.length - 1]?.endTime ?? startTime + durationMinutes * 60;

    plans.push({
      depart: startTime,
      arrive: endTime,
      durationMinutes: Math.max(1, durationMinutes),
      segments,
    });
  }

  plans.sort((a, b) => a.durationMinutes - b.durationMinutes);
  return { plans };
}

// ── Fetch routing ────────────────────────────────────────────────────────

/**
 * Query Transit.land routing API for multi-modal itineraries.
 *
 * Uses the v2 routing endpoint: /api/v2/routings
 */
export async function fetchTransitLandRouting(
  apiKey: string,
  input: TransitLandRoutingInput,
  opts?: { timeoutMs?: number },
): Promise<{ plans: TripGoTripPlan[]; error?: string }> {
  const departAfter = input.departAfter ?? Math.floor(Date.now() / 1000);
  const departISO = new Date(departAfter * 1000).toISOString();

  const params: Record<string, string> = {
    from: `${input.from.lat},${input.from.lon}`,
    to: `${input.to.lat},${input.to.lon}`,
    time: departISO,
    max_itineraries: String(input.maxItineraries ?? 3),
  };

  if (input.modes) {
    params.modes = input.modes;
  }
  if (input.locale) {
    params.locale = input.locale.slice(0, 2);
  }

  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    opts?.timeoutMs ?? 30_000,
  );

  try {
    const url = transitLandUrl('/api/v2/routings', params);
    const res = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'x-api-key': apiKey,
      },
      signal: controller.signal,
      cache: 'no-store',
    });

    const text = await res.text();
    let data: Record<string, unknown> = {};
    try {
      data = JSON.parse(text) as Record<string, unknown>;
    } catch {
      return { plans: [], error: `Transit.land invalid JSON (${res.status})` };
    }

    if (!res.ok) {
      const msg =
        typeof data.error === 'string'
          ? (data.error as string)
          : typeof data.message === 'string'
            ? (data.message as string)
            : text.slice(0, 200);
      return { plans: [], error: `Transit.land ${res.status}: ${msg}` };
    }

    return parseTransitLandResponse(data);
  } catch (e: unknown) {
    if (e instanceof Error && e.name === 'AbortError') {
      return { plans: [], error: 'Transit.land request timed out' };
    }
    const msg = e instanceof Error ? e.message : 'Transit.land request failed';
    return { plans: [], error: msg };
  } finally {
    clearTimeout(timeout);
  }
}

// ── Data queries ─────────────────────────────────────────────────────────

export type TransitLandOperator = {
  name: string;
  url?: string;
  timezone?: string;
  modes: string[];
};

/**
 * Search for operators (transit agencies) near a location.
 * Returns up to `limit` operators.
 */
export async function fetchTransitLandOperators(
  apiKey: string,
  near?: TransitLandLatLng,
  limit = 20,
): Promise<TransitLandOperator[]> {
  const params: Record<string, string> = {
    per_page: String(limit),
  };

  if (near) {
    params.near = `${near.lat},${near.lon}`;
  }

  try {
    const url = transitLandUrl('/api/v1/operators', params);
    const res = await fetch(url, {
      headers: { Accept: 'application/json', 'x-api-key': apiKey },
      next: { revalidate: 3600 },
    });

    if (!res.ok) return [];
    const data = (await res.json()) as Record<string, unknown>;
    const operators = data.operators as Record<string, unknown>[] | undefined;
    if (!Array.isArray(operators)) return [];

    return operators.map((op) => ({
      name: String(op.name ?? 'Unknown'),
      url: typeof op.url === 'string' ? (op.url as string) : undefined,
      timezone:
        typeof op.timezone === 'string' ? (op.timezone as string) : undefined,
      modes: Array.isArray(op.modes)
        ? (op.modes as string[]).map(String)
        : [],
    }));
  } catch {
    return [];
  }
}

/**
 * Search for stops near a location.
 */
export async function fetchTransitLandStops(
  apiKey: string,
  near: TransitLandLatLng,
  radiusKm = 1,
  limit = 20,
): Promise<{ name: string; lat: number; lon: number; modes: string[] }[]> {
  const params: Record<string, string> = {
    per_page: String(limit),
    near: `${near.lat},${near.lon}`,
    radius: String(radiusKm),
  };

  try {
    const url = transitLandUrl('/api/v1/stops', params);
    const res = await fetch(url, {
      headers: { Accept: 'application/json', 'x-api-key': apiKey },
      next: { revalidate: 3600 },
    });

    if (!res.ok) return [];
    const data = (await res.json()) as Record<string, unknown>;
    const stops = data.stops as Record<string, unknown>[] | undefined;
    if (!Array.isArray(stops)) return [];

    return stops.map((s) => ({
      name: String(s.name ?? 'Unknown'),
      lat: Number(s.lat ?? 0),
      lon: Number(s.lon ?? 0),
      modes: Array.isArray(s.modes) ? (s.modes as string[]).map(String) : [],
    }));
  } catch {
    return [];
  }
}
