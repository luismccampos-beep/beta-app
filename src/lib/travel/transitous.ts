/**
 * Transitous — community-run public transport routing (MOTIS 2 API).
 * https://transitous.org/
 *
 * Free, no API key required. Attribution required: link to https://transitous.org/sources/
 * Usage policy: non-profit, reasonable usage, must send User-Agent header.
 *
 * API docs: https://transitous.org/api/
 * OpenAPI spec: https://github.com/motis-project/motis/blob/master/openapi.yaml
 * Uses OTP-compatible endpoint: GET /api/v6/plan
 */

import type { TripGoTripPlan } from './tripgo';
import { parseOtpResponse } from './otp-parser';

// ── API base URL ────────────────────────────────────────────────────────
const TRANSITOUS_BASE = 'https://api.transitous.org';

// ── Types ────────────────────────────────────────────────────────────────

export type TransitousLatLng = { lat: number; lon: number };

export type TransitousRoutingInput = {
  from: TransitousLatLng;
  to: TransitousLatLng;
  /** Unix seconds; default ≈ now */
  departAfter?: number;
  locale?: string;
};

// ── Config ───────────────────────────────────────────────────────────────

export function getTransitousUserAgent(): string {
  return 'beta-app-travel/1.0 (https://beta-app.vercel.app)';
}

export function isTransitousConfigured(): boolean {
  return true; // Free, no config needed
}

// ── Fetch routing (OTP /api/v6/plan) ────────────────────────────────────

/**
 * Query Transitous (MOTIS 2) routing API for multi-modal itineraries.
 *
 * Uses the OTP-compatible endpoint: GET /api/v6/plan
 * No API key required, but User-Agent header is mandatory.
 */
export async function fetchTransitousRouting(
  _apiKey: string, // kept for interface compatibility; Transitous doesn't need a key
  input: TransitousRoutingInput,
  opts?: { timeoutMs?: number },
): Promise<{ plans: TripGoTripPlan[]; error?: string }> {
  const departAfter = input.departAfter ?? Math.floor(Date.now() / 1000);
  const timeISO = new Date(departAfter * 1000).toISOString();

  const params = new URLSearchParams({
    fromPlace: `${input.from.lat},${input.from.lon}`,
    toPlace: `${input.to.lat},${input.to.lon}`,
    time: timeISO,
    directModes: 'WALK',
    transitModes: 'TRANSIT',
  });

  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    opts?.timeoutMs ?? 30_000,
  );

  try {
    const url = `${TRANSITOUS_BASE}/api/v6/plan?${params.toString()}`;
    const res = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'User-Agent': getTransitousUserAgent(),
      },
      signal: controller.signal,
      cache: 'no-store',
    });

    const text = await res.text();
    let data: Record<string, unknown> = {};
    try {
      data = JSON.parse(text) as Record<string, unknown>;
    } catch {
      return { plans: [], error: `Transitous invalid JSON (${res.status})` };
    }

    if (!res.ok) {
      const msg =
        typeof data.error === 'string'
          ? (data.error as string)
          : typeof data.message === 'string'
            ? (data.message as string)
            : text.slice(0, 200);
      return { plans: [], error: `Transitous ${res.status}: ${msg}` };
    }

    return parseOtpResponse(data);
  } catch (e: unknown) {
    if (e instanceof Error && e.name === 'AbortError') {
      return { plans: [], error: 'Transitous request timed out' };
    }
    const msg = e instanceof Error ? e.message : 'Transitous request failed';
    return { plans: [], error: msg };
  } finally {
    clearTimeout(timeout);
  }
}
