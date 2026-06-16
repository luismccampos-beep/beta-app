/**
 * Navitia.io — multi-modal public transport API (trains, buses, ferries).
 * https://doc.navitia.io/
 *
 * Auth: Basic HTTP (username = API key, password = empty).
 * Free tier: up to 5 000 requests/month.
 */

import type { TripGoTripPlan, TripGoSegmentSummary } from './tripgo';

const NAVITIA_API = 'https://api.navitia.io/v1';

// ── Types ────────────────────────────────────────────────────────────────

export type NavitiaLatLng = { lat: number; lon: number };

export type NavitiaJourneyInput = {
  from: NavitiaLatLng;
  to: NavitiaLatLng;
  /** ISO datetime; default ≈ now + 2h */
  datetime?: string;
  /** 'departure' | 'arrival'; default 'departure' */
  datetimeRepresents?: 'departure' | 'arrival';
  locale?: string;
};

export type NavitiaConfigResult = {
  configured: boolean;
  error?: string;
};

// ── Config ───────────────────────────────────────────────────────────────

export function getNavitiaApiKey(): string | undefined {
  return process.env.NAVITIA_API_KEY?.trim() || undefined;
}

export function isNavitiaConfigured(): boolean {
  return Boolean(getNavitiaApiKey());
}

function navitiaHeaders(): HeadersInit {
  const key = getNavitiaApiKey()!;
  return {
    Authorization: `Basic ${Buffer.from(`${key}:`).toString('base64')}`,
    Accept: 'application/json',
  };
}

// ── Coordinate formatting ────────────────────────────────────────────────

/** Format: "lat;lon" (Navitia uses semicolon separator) */
function formatCoord({ lat, lon }: NavitiaLatLng): string {
  return `${lat};${lon}`;
}

// ── Mode labels ──────────────────────────────────────────────────────────

const MODE_LABELS: Record<string, string> = {
  walking: 'Walk',
  train: 'Train',
  metro: 'Metro',
  bus: 'Bus',
  tramway: 'Tram',
  ferry: 'Ferry',
  boat: 'Ferry',
  car: 'Car',
  bicycle: 'Bicycle',
  ridesharing: 'Rideshare',
  taxi: 'Taxi',
};

function modeLabel(mode: string): string {
  return MODE_LABELS[mode.toLowerCase()] ?? mode.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

// ── Parser ───────────────────────────────────────────────────────────────

type NavitiaSection = Record<string, unknown>;

function parseSection(section: NavitiaSection): TripGoSegmentSummary | null {
  const mode = (section as { type?: string }).type ?? 'unknown';
  // Skip "waiting" or "on_demand_transport" without details
  if (mode === 'waiting' || mode === 'on_demand_transport') return null;

  const duration = typeof section.duration === 'number' ? section.duration : 0;
  const durationMinutes = duration > 0 ? Math.max(1, Math.round(duration / 60)) : undefined;

  const from = section.from as Record<string, unknown> | undefined;
  const to = section.to as Record<string, unknown> | undefined;

  const displayInfo = section.display_informations as Record<string, unknown> | undefined;
  const serviceName =
    typeof displayInfo?.label === 'string'
      ? displayInfo.label
      : typeof displayInfo?.name === 'string'
        ? displayInfo.name
        : typeof displayInfo?.code === 'string'
          ? displayInfo.code
          : undefined;

  const departureDateTime = section.departure_date_time as string | undefined;
  const arrivalDateTime = section.arrival_date_time as string | undefined;

  const startTime = departureDateTime
    ? Math.floor(new Date(departureDateTime).getTime() / 1000)
    : undefined;
  const endTime = arrivalDateTime
    ? Math.floor(new Date(arrivalDateTime).getTime() / 1000)
    : undefined;

  // Navitia physical_mode (e.g. "physical_mode:Bus", "physical_mode:Ferry")
  const physicalMode = section.physical_mode as string | undefined;
  const effectiveMode = physicalMode
    ? physicalMode.replace('physical_mode:', '').toLowerCase()
    : mode === 'street_network'
      ? 'walking'
      : mode;

  const geojson = section.geojson as Record<string, unknown> | undefined;
  const coordinates = geojson?.coordinates as number[][] | undefined;

  return {
    mode: effectiveMode,
    modeLabel: serviceName ? `${modeLabel(effectiveMode)} ${serviceName}` : modeLabel(effectiveMode),
    from:
      typeof from?.name === 'string'
        ? from.name
        : typeof from?.label === 'string'
          ? from.label
          : '—',
    to:
      typeof to?.name === 'string'
        ? to.name
        : typeof to?.label === 'string'
          ? to.label
          : '—',
    startTime,
    endTime,
    durationMinutes,
    serviceName,
    notes: coordinates
      ? `${coordinates.length} waypoints`
      : undefined,
  };
}

/**
 * Parse Navitia journeys response into TripGoTripPlan[].
 * Each journey is a possible itinerary (sorted by duration).
 */
export function parseNavitiaResponse(data: Record<string, unknown>): {
  plans: TripGoTripPlan[];
  error?: string;
} {
  const journeys = Array.isArray(data.journeys)
    ? (data.journeys as Record<string, unknown>[])
    : [];

  if (!journeys.length) {
    return { plans: [], error: 'No journeys found for this route' };
  }

  const plans: TripGoTripPlan[] = [];

  for (const journey of journeys) {
    const sections = Array.isArray(journey.sections)
      ? (journey.sections as Record<string, unknown>[])
      : [];

    const segments: TripGoSegmentSummary[] = [];
    for (const section of sections) {
      const seg = parseSection(section);
      if (seg) segments.push(seg);
    }

    if (!segments.length) continue;

    const departureDateTime = journey.departure_date_time as string | undefined;
    const arrivalDateTime = journey.arrival_date_time as string | undefined;
    const duration = typeof journey.duration === 'number' ? journey.duration : 0;

    const depart = departureDateTime
      ? Math.floor(new Date(departureDateTime).getTime() / 1000)
      : Math.floor(Date.now() / 1000);
    const arrive = arrivalDateTime
      ? Math.floor(new Date(arrivalDateTime).getTime() / 1000)
      : depart + duration;

    const fare = journey.fare as Record<string, unknown> | undefined;
    const fareTotal = fare?.total as Record<string, unknown> | undefined;

    plans.push({
      depart,
      arrive,
      durationMinutes: duration > 0 ? Math.max(1, Math.round(duration / 60)) : 1,
      segments,
      fare: fareTotal && typeof fareTotal.value === 'number'
        ? {
            amount: fareTotal.value as number,
            currency: typeof fareTotal.currency === 'string' ? (fareTotal.currency as string) : 'EUR',
            formatted: typeof fareTotal.label === 'string' ? (fareTotal.label as string) : undefined,
          }
        : undefined,
    });
  }

  plans.sort((a, b) => a.durationMinutes - b.durationMinutes);

  return { plans };
}

// ── Coverage discovery ───────────────────────────────────────────────────

/**
 * List available coverage regions from Navitia.
 * Returns region IDs (e.g. "fr-idf", "pt", etc.)
 */
export async function fetchNavitiaCoverage(apiKey: string): Promise<string[]> {
  const url = `${NAVITIA_API}/coverage`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`,
      Accept: 'application/json',
    },
    next: { revalidate: 86400 },
  });

  if (!res.ok) return [];
  const data = (await res.json()) as Record<string, unknown>;
  const regions = data.regions as Record<string, unknown>[] | undefined;
  if (!Array.isArray(regions)) return [];

  return regions
    .map((r) => String(r.id ?? ''))
    .filter(Boolean)
    .sort();
}

// ── Journey query ────────────────────────────────────────────────────────

/**
 * Fetch multi-modal journey from Navitia.io.
 *
 * If the direct query fails (e.g. no coverage match), tries a fallback
 * with the first available coverage region.
 */
export async function fetchNavitiaJourney(
  apiKey: string,
  input: NavitiaJourneyInput,
  opts?: { timeoutMs?: number },
): Promise<{ plans: TripGoTripPlan[]; region?: string; error?: string }> {
  const datetime =
    input.datetime ??
    new Date(Date.now() + 7200_000).toISOString().slice(0, 16);
  const datetimeRep = input.datetimeRepresents ?? 'departure';

  const params = new URLSearchParams({
    from: formatCoord(input.from),
    to: formatCoord(input.to),
    datetime,
    datetime_represents: datetimeRep,
    count: '5',
  });

  if (input.locale) {
    params.set('language', input.locale.slice(0, 2));
  }

  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    opts?.timeoutMs ?? 30_000,
  );

  // Try direct journey endpoint first (uses best-matching coverage)
  async function tryFetch(coverage?: string): Promise<{
    plans: TripGoTripPlan[];
    region?: string;
    error?: string;
  }> {
    const base = coverage
      ? `${NAVITIA_API}/coverage/${coverage}`
      : NAVITIA_API;
    const url = `${base}/journeys?${params.toString()}`;

    const res = await fetch(url, {
      headers: navitiaHeaders(),
      signal: controller.signal,
      cache: 'no-store',
    });

    const text = await res.text();
    let data: Record<string, unknown> = {};
    try {
      data = JSON.parse(text) as Record<string, unknown>;
    } catch {
      return { plans: [], error: `Navitia invalid JSON (${res.status})` };
    }

    if (!res.ok) {
      const msg =
        typeof data.error === 'string'
          ? (data.error as string)
          : typeof data.message === 'string'
            ? (data.message as string)
            : text.slice(0, 200);
      return { plans: [], error: `Navitia ${res.status}: ${msg}` };
    }

    const result = parseNavitiaResponse(data);
    const region =
      typeof data.region === 'string'
        ? (data.region as string)
        : coverage ?? undefined;

    return { ...result, region };
  }

  try {
    const result = await tryFetch();

    // If no plans found and no coverage was specified, try auto-discovery
    if (!result.plans.length && !result.error?.includes('Navitia')) {
      const coverages = await fetchNavitiaCoverage(apiKey);
      for (const cov of coverages.slice(0, 5)) {
        const retry = await tryFetch(cov);
        if (retry.plans.length) return retry;
      }
    }

    return result;
  } catch (e: unknown) {
    if (e instanceof Error && e.name === 'AbortError') {
      return { plans: [], error: 'Navitia request timed out' };
    }
    const msg = e instanceof Error ? e.message : 'Navitia request failed';
    return { plans: [], error: msg };
  } finally {
    clearTimeout(timeout);
  }
}
