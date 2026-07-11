/**
 * Transit.land (Interline) — GTFS feed aggregator & routing API.
 * https://www.transit.land/documentation
 *
 * REST API v2: https://transit.land/api/v2/rest/
 * Routing API (OTP): https://transit.land/api/v2/routing/otp/plan
 *
 * Auth: `apikey` query parameter or `apikey` header.
 * Free (Explorer): Routing 1 000 queries/month, REST 10 000 queries/month.
 */

import type { TripGoTripPlan } from './tripgo';
import { parseOtpResponse } from './otp-parser';

// ── API base URLs ────────────────────────────────────────────────────────
/** REST API v2 — operators, stops, feeds */
const TRANSITLAND_REST_API = 'https://transit.land/api/v2/rest';
/** Routing API — OTP-compatible trip planning */
const TRANSITLAND_ROUTING_API = 'https://transit.land/api/v2/routing/otp/plan';

// ── Types ────────────────────────────────────────────────────────────────

export type TransitLandLatLng = { lat: number; lon: number };

export type TransitLandRoutingInput = {
  from: TransitLandLatLng;
  to: TransitLandLatLng;
  /** Unix seconds; default ≈ now */
  departAfter?: number;
  /** Optional comma-separated modes: BUS, SUBWAY, TRAIN, FERRY, WALK, etc. */
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

/** Build a URL for the REST API v2 with apikey. */
function restUrl(path: string, params: Record<string, string>): string {
  const key = getTransitLandApiKey()!;
  const qs = new URLSearchParams({ ...params, apikey: key });
  return `${TRANSITLAND_REST_API}${path}?${qs.toString()}`;
}

/** Build a URL for the Routing (OTP) API with apikey. */
function routingUrl(params: Record<string, string>): string {
  const key = getTransitLandApiKey()!;
  const qs = new URLSearchParams({ ...params, apikey: key });
  return `${TRANSITLAND_ROUTING_API}?${qs.toString()}`;
}

// ── Fetch routing (OTP /plan) ────────────────────────────────────────────

/**
 * Query Transit.land routing API for multi-modal itineraries.
 *
 * Uses the OTP-compatible endpoint: /api/v2/routing/otp/plan
 */
export async function fetchTransitLandRouting(
  apiKey: string,
  input: TransitLandRoutingInput,
  opts?: { timeoutMs?: number },
): Promise<{ plans: TripGoTripPlan[]; error?: string }> {
  const departAfter = input.departAfter ?? Math.floor(Date.now() / 1000);
  const departDate = new Date(departAfter * 1000);

  // Format time as HH:MMam/pm (OTP format)
  const hours = departDate.getHours();
  const minutes = departDate.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';
  const hour12 = hours % 12 || 12;
  const timeStr = `${hour12}:${minutes.toString().padStart(2, '0')}${ampm}`;

  // Format date as YYYY-MM-DD
  const dateStr = departDate.toISOString().slice(0, 10);

  const params: Record<string, string> = {
    fromPlace: `${input.from.lat},${input.from.lon}`,
    toPlace: `${input.to.lat},${input.to.lon}`,
    time: timeStr,
    date: dateStr,
    numItineraries: String(input.maxItineraries ?? 3),
  };

  if (input.modes) {
    // Convert code modes (e.g., "bus, train, ferry") to OTP uppercase format
    params.mode = input.modes
      .split(',')
      .map((m) => m.trim().toUpperCase())
      .join(',');
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
    const url = routingUrl(params);
    const res = await fetch(url, {
      headers: {
        Accept: 'application/json',
        apikey: apiKey,
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

    return parseOtpResponse(data);
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

// ── Data queries (REST API v2) ───────────────────────────────────────────

export type TransitLandOperator = {
  name: string;
  url?: string;
  timezone?: string;
  modes: string[];
};

/**
 * Search for operators (transit agencies).
 * REST v2: GET /agencies
 * Note: v2 REST API may not support proximity search for agencies directly.
 * Use stops endpoint for location-based lookups.
 */
export async function fetchTransitLandOperators(
  apiKey: string,
  _near?: TransitLandLatLng,
  limit = 20,
): Promise<TransitLandOperator[]> {
  const params: Record<string, string> = {
    per_page: String(limit),
  };

  try {
    const url = restUrl('/agencies', params);
    const res = await fetch(url, {
      headers: { Accept: 'application/json', apikey: apiKey },
      next: { revalidate: 3600 },
    });

    if (!res.ok) return [];
    const data = (await res.json()) as Record<string, unknown>;

    // v2 REST may return { agencies: [...] } or { data: { agencies: [...] } }
    const agencies = (
      (data.agencies as Record<string, unknown>[]) ??
      ((data.data as Record<string, unknown>)?.agencies as Record<string, unknown>[]) ??
      []
    );

    if (!Array.isArray(agencies)) return [];

    return agencies.map((op) => ({
      name: String(op.name ?? (op.agency_name as string) ?? 'Unknown'),
      url: typeof op.url === 'string' ? (op.url as string) : typeof op.agency_url === 'string' ? (op.agency_url as string) : undefined,
      timezone:
        typeof op.timezone === 'string'
          ? (op.timezone as string)
          : typeof op.agency_timezone === 'string'
            ? (op.agency_timezone as string)
            : undefined,
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
 * REST v2: GET /stops?lat=...&lon=...&radius=... (radius in meters)
 */
export async function fetchTransitLandStops(
  apiKey: string,
  near: TransitLandLatLng,
  radiusKm = 1,
  limit = 20,
): Promise<{ name: string; lat: number; lon: number; modes: string[] }[]> {
  // v2 REST uses radius in meters
  const params: Record<string, string> = {
    per_page: String(limit),
    lat: String(near.lat),
    lon: String(near.lon),
    radius: String(radiusKm * 1000),
  };

  try {
    const url = restUrl('/stops', params);
    const res = await fetch(url, {
      headers: { Accept: 'application/json', apikey: apiKey },
      next: { revalidate: 3600 },
    });

    if (!res.ok) return [];
    const data = (await res.json()) as Record<string, unknown>;

    // v2 REST may return { stops: [...] } or { data: { stops: [...] } }
    const stops = (
      (data.stops as Record<string, unknown>[]) ??
      ((data.data as Record<string, unknown>)?.stops as Record<string, unknown>[]) ??
      []
    );

    if (!Array.isArray(stops)) return [];

    return stops.map((s) => {
      // Geometry may be { coordinates: [lon, lat] } (GeoJSON Point)
      const geom = s.geometry as Record<string, unknown> | undefined;
      let lat = Number(s.lat ?? 0);
      let lon = Number(s.lon ?? 0);

      if ((!lat || !lon) && geom?.type === 'Point') {
        const coords = geom.coordinates as number[] | undefined;
        if (Array.isArray(coords) && coords.length >= 2) {
          lon = coords[0] ?? 0;
          lat = coords[1] ?? 0;
        }
      }

      return {
        name: String(s.name ?? 'Unknown'),
        lat,
        lon,
        modes: Array.isArray(s.served_by)
          ? (s.served_by as string[]).map(String)
          : [],
      };
    });
  } catch {
    return [];
  }
}
