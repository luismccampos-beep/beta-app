/**
 * Valhalla routing — self-hosted OSM (no cloud API key).
 * https://github.com/valhalla/valhalla
 */

import type { TripGoTripPlan, TripGoSegmentSummary } from './tripgo';

export type ValhallaCosting = 'auto' | 'pedestrian' | 'bicycle' | 'bus' | 'motorcycle';

export type ValhallaRouteInput = {
  from: { lat: number; lon: number };
  to: { lat: number; lon: number };
  costing?: ValhallaCosting;
  locale?: string;
};

const COSTING_LABELS: Record<ValhallaCosting, string> = {
  auto: 'Car',
  pedestrian: 'Walk',
  bicycle: 'Bicycle',
  bus: 'Bus',
  motorcycle: 'Motorcycle',
};

export function getValhallaBaseUrl(): string | undefined {
  const raw = process.env.VALHALLA_BASE_URL?.trim();
  if (!raw) return undefined;
  return raw.replace(/\/$/, '');
}

export function isValhallaConfigured(): boolean {
  return Boolean(getValhallaBaseUrl());
}

function costingLabel(costing: ValhallaCosting): string {
  return COSTING_LABELS[costing] ?? costing;
}

/** Parse Valhalla /route JSON into trip plans (primary trip only). */
export function parseValhallaRouteResponse(
  data: unknown,
  costing: ValhallaCosting = 'auto',
): TripGoTripPlan[] {
  const root = data && typeof data === 'object' ? (data as Record<string, unknown>) : null;
  const trip = root?.trip && typeof root.trip === 'object' ? (root.trip as Record<string, unknown>) : null;
  if (!trip) return [];

  const summary =
    trip.summary && typeof trip.summary === 'object'
      ? (trip.summary as Record<string, unknown>)
      : null;
  const totalSeconds =
    typeof summary?.time === 'number' ? summary.time : 0;
  const durationMinutes = totalSeconds > 0 ? Math.max(1, Math.round(totalSeconds / 60)) : 0;

  const now = Math.floor(Date.now() / 1000);
  const segments: TripGoSegmentSummary[] = [];

  const legs = Array.isArray(trip.legs) ? trip.legs : [];
  for (const leg of legs) {
    if (!leg || typeof leg !== 'object') continue;
    const maneuvers = Array.isArray((leg as Record<string, unknown>).maneuvers)
      ? ((leg as Record<string, unknown>).maneuvers as Record<string, unknown>[])
      : [];

    for (const m of maneuvers) {
      const instruction = typeof m.instruction === 'string' ? m.instruction.trim() : '';
      if (!instruction) continue;
      const type = typeof m.type === 'number' ? m.type : 0;
      if (type === 4 || type === 5) continue;

      const segSeconds = typeof m.time === 'number' ? m.time : 0;
      segments.push({
        mode: costing,
        modeLabel: costingLabel(costing),
        from: '—',
        to: '—',
        durationMinutes: segSeconds > 0 ? Math.max(1, Math.round(segSeconds / 60)) : undefined,
        notes: instruction,
      });
      if (segments.length >= 12) break;
    }
    if (segments.length >= 12) break;
  }

  if (!segments.length && durationMinutes > 0) {
    segments.push({
      mode: costing,
      modeLabel: costingLabel(costing),
      from: 'Start',
      to: 'End',
      durationMinutes,
      notes: `${costingLabel(costing)} route (OSM / Valhalla)`,
    });
  }

  const plan: TripGoTripPlan = {
    depart: now,
    arrive: now + (totalSeconds || durationMinutes * 60),
    durationMinutes: durationMinutes || 1,
    segments,
  };

  return [plan];
}

export async function fetchValhallaRoute(
  input: ValhallaRouteInput,
  opts?: { timeoutMs?: number },
): Promise<{ plans: TripGoTripPlan[]; error?: string }> {
  const base = getValhallaBaseUrl();
  if (!base) {
    return { plans: [], error: 'Valhalla not configured (VALHALLA_BASE_URL)' };
  }

  const costing = input.costing ?? 'auto';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), opts?.timeoutMs ?? 25_000);

  try {
    const res = await fetch(`${base}/route`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        locations: [
          { lat: input.from.lat, lon: input.from.lon },
          { lat: input.to.lat, lon: input.to.lon },
        ],
        costing,
        units: 'kilometers',
        language: input.locale?.slice(0, 2) || 'en',
      }),
      signal: controller.signal,
      cache: 'no-store',
    });

    const text = await res.text();
    if (!res.ok) {
      return {
        plans: [],
        error: `Valhalla ${res.status}: ${text.slice(0, 200)}`,
      };
    }

    let json: unknown;
    try {
      json = JSON.parse(text);
    } catch {
      return { plans: [], error: 'Valhalla returned invalid JSON' };
    }

    const errMsg =
      json &&
      typeof json === 'object' &&
      typeof (json as Record<string, unknown>).error === 'string'
        ? String((json as Record<string, unknown>).error)
        : null;
    if (errMsg) return { plans: [], error: errMsg };

    const plans = parseValhallaRouteResponse(json, costing);
    if (!plans.length) {
      return { plans: [], error: 'No route found in Valhalla response' };
    }
    return { plans };
  } catch (e: unknown) {
    if (e instanceof Error && e.name === 'AbortError') {
      return { plans: [], error: 'Valhalla request timed out' };
    }
    const msg = e instanceof Error ? e.message : 'Valhalla request failed';
    if (msg.includes('fetch failed') || msg.includes('ECONNREFUSED')) {
      return {
        plans: [],
        error: 'Valhalla unreachable — run: docker compose up valhalla -d',
      };
    }
    return { plans: [], error: msg };
  } finally {
    clearTimeout(timeout);
  }
}
