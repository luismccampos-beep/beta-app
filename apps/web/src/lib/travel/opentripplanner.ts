/**
 * OpenTripPlanner 2 — GTFS GraphQL API (self-hosted, no cloud key).
 * https://docs.opentripplanner.org/en/latest/apis/GTFS-GraphQL-API/
 */

import type { TripGoTripPlan, TripGoSegmentSummary } from './tripgo';

const PLAN_QUERY = `
query PlanTrip(
  $fromLat: Float!
  $fromLon: Float!
  $toLat: Float!
  $toLon: Float!
  $date: String!
  $time: String!
) {
  plan(
    from: { lat: $fromLat, lon: $fromLon }
    to: { lat: $toLat, lon: $toLon }
    date: $date
    time: $time
    transportModes: [{ mode: WALK }, { mode: TRANSIT }]
    numItineraries: 3
  ) {
    itineraries {
      startTime
      endTime
      duration
      legs {
        mode
        startTime
        endTime
        from { name lat lon }
        to { name lat lon }
        route { shortName longName }
      }
    }
  }
}
`;

export type OtpRouteInput = {
  from: { lat: number; lon: number };
  to: { lat: number; lon: number };
  /** Unix seconds; default ≈ now + 1h */
  departAfter?: number;
  locale?: string;
};

const MODE_LABELS: Record<string, string> = {
  WALK: 'Walk',
  BUS: 'Bus',
  RAIL: 'Train',
  SUBWAY: 'Metro',
  TRAM: 'Tram',
  FERRY: 'Ferry',
  CAR: 'Car',
  BICYCLE: 'Bicycle',
  CAR_PARK: 'Park & ride',
  FLEX: 'On-demand',
};

function modeLabel(mode: string): string {
  const key = mode.toUpperCase();
  return MODE_LABELS[key] ?? mode.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

export function getOtpBaseUrl(): string | undefined {
  const raw = process.env.OTP_BASE_URL?.trim();
  if (!raw) return undefined;
  return raw.replace(/\/$/, '');
}

export function getOtpGraphqlUrl(): string | undefined {
  const base = getOtpBaseUrl();
  if (!base) return undefined;
  if (base.includes('/otp/gtfs')) return base;
  return `${base}/otp/gtfs/v1`;
}

export function isOtpConfigured(): boolean {
  return Boolean(getOtpGraphqlUrl());
}

function formatOtpDateTime(epochSec: number): { date: string; time: string } {
  const d = new Date(epochSec * 1000);
  const date = d.toISOString().slice(0, 10);
  const time = d.toTimeString().slice(0, 8);
  return { date, time };
}

function asRecord(v: unknown): Record<string, unknown> | null {
  return v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : null;
}

function locationName(loc: unknown): string {
  const o = asRecord(loc);
  if (!o) return '—';
  if (typeof o.name === 'string' && o.name.trim()) return o.name.trim();
  const lat = typeof o.lat === 'number' ? o.lat : null;
  const lon = typeof o.lon === 'number' ? o.lon : null;
  if (lat != null && lon != null) return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
  return '—';
}

function parseLeg(leg: Record<string, unknown>): TripGoSegmentSummary {
  const mode = typeof leg.mode === 'string' ? leg.mode : 'TRANSIT';
  const startTime = typeof leg.startTime === 'number' ? leg.startTime : undefined;
  const endTime = typeof leg.endTime === 'number' ? leg.endTime : undefined;
  let durationMinutes: number | undefined;
  if (startTime != null && endTime != null && endTime > startTime) {
    durationMinutes = Math.max(1, Math.round((endTime - startTime) / 60_000));
  }

  const route = asRecord(leg.route);
  const line =
    (typeof route?.shortName === 'string' && route.shortName) ||
    (typeof route?.longName === 'string' && route.longName) ||
    undefined;

  return {
    mode: mode.toLowerCase(),
    modeLabel: line ? `${modeLabel(mode)} ${line}` : modeLabel(mode),
    from: locationName(leg.from),
    to: locationName(leg.to),
    startTime: startTime != null ? Math.floor(startTime / 1000) : undefined,
    endTime: endTime != null ? Math.floor(endTime / 1000) : undefined,
    durationMinutes,
    serviceName: line,
  };
}

/** Parse OTP GraphQL `plan` response into trip plans (sorted by duration). */
export function parseOtpPlanResponse(data: unknown): TripGoTripPlan[] {
  const root = asRecord(data);
  const planData = asRecord(root?.data);
  const plan = asRecord(planData?.plan);
  const itineraries = Array.isArray(plan?.itineraries)
    ? (plan.itineraries as Record<string, unknown>[])
    : [];

  const plans: TripGoTripPlan[] = [];

  for (const it of itineraries) {
    const startMs = typeof it.startTime === 'number' ? it.startTime : null;
    const endMs = typeof it.endTime === 'number' ? it.endTime : null;
    const durationSec =
      typeof it.duration === 'number'
        ? it.duration
        : startMs != null && endMs != null
          ? Math.round((endMs - startMs) / 1000)
          : 0;

    const legs = Array.isArray(it.legs) ? (it.legs as Record<string, unknown>[]) : [];
    const segments = legs.map(parseLeg);

    const durationMinutes = durationSec > 0 ? Math.max(1, Math.round(durationSec / 60)) : 1;
    const depart = startMs != null ? Math.floor(startMs / 1000) : Math.floor(Date.now() / 1000);
    const arrive =
      endMs != null ? Math.floor(endMs / 1000) : depart + durationMinutes * 60;

    plans.push({ depart, arrive, durationMinutes, segments });
  }

  plans.sort((a, b) => a.durationMinutes - b.durationMinutes);
  return plans;
}

export async function fetchOtpPlan(
  input: OtpRouteInput,
  opts?: { timeoutMs?: number },
): Promise<{ plans: TripGoTripPlan[]; error?: string }> {
  const graphqlUrl = getOtpGraphqlUrl();
  if (!graphqlUrl) {
    return { plans: [], error: 'OTP not configured (OTP_BASE_URL)' };
  }

  const departSec = input.departAfter ?? Math.floor(Date.now() / 1000) + 3600;
  const { date, time } = formatOtpDateTime(departSec);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), opts?.timeoutMs ?? 45_000);

  try {
    const res = await fetch(graphqlUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        OTPTimeout: String(opts?.timeoutMs ?? 45_000),
      },
      body: JSON.stringify({
        query: PLAN_QUERY,
        operationName: 'PlanTrip',
        variables: {
          fromLat: input.from.lat,
          fromLon: input.from.lon,
          toLat: input.to.lat,
          toLon: input.to.lon,
          date,
          time,
        },
      }),
      signal: controller.signal,
      cache: 'no-store',
    });

    const text = await res.text();
    if (!res.ok) {
      return { plans: [], error: `OTP ${res.status}: ${text.slice(0, 200)}` };
    }

    let json: unknown;
    try {
      json = JSON.parse(text);
    } catch {
      return { plans: [], error: 'OTP returned invalid JSON' };
    }

    const root = asRecord(json);
    const errors = Array.isArray(root?.errors) ? root.errors : [];
    if (errors.length) {
      const msg = errors
        .map((e) => (asRecord(e)?.message as string) ?? 'GraphQL error')
        .join('; ');
      return { plans: [], error: msg.slice(0, 240) };
    }

    const plans = parseOtpPlanResponse(json);
    if (!plans.length) {
      return { plans: [], error: 'No transit itineraries (check GTFS coverage for this area)' };
    }
    return { plans };
  } catch (e: unknown) {
    if (e instanceof Error && e.name === 'AbortError') {
      return { plans: [], error: 'OTP request timed out' };
    }
    const msg = e instanceof Error ? e.message : 'OTP request failed';
    if (msg.includes('fetch failed') || msg.includes('ECONNREFUSED')) {
      return {
        plans: [],
        error: 'OTP unreachable — run: npm run otp:build && npm run otp:up',
      };
    }
    return { plans: [], error: msg };
  } finally {
    clearTimeout(timeout);
  }
}
