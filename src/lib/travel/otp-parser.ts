/**
 * Shared OTP (OpenTripPlanner) response parser.
 *
 * Both Transit.land and Transitous use OTP-compatible routing APIs
 * that return { plan: { itineraries: [...] } } with:
 * - Timestamps in epoch milliseconds
 * - Duration in seconds
 * - Legs with mode, from/to names, routeShortName, routeLongName
 */

import type { TripGoTripPlan, TripGoSegmentSummary } from './tripgo';

// ── Types ────────────────────────────────────────────────────────────────

type OtpItinerary = Record<string, unknown>;
type OtpLeg = Record<string, unknown>;

// ── Mode labels ──────────────────────────────────────────────────────────

const MODE_LABELS: Record<string, string> = {
  walk: 'Walk',
  bicycle: 'Bicycle',
  bike: 'Bicycle',
  car: 'Car',
  train: 'Train',
  rail: 'Train',
  bus: 'Bus',
  subway: 'Metro',
  tram: 'Tram',
  watercraft: 'Ferry',
  ferry: 'Ferry',
  boat: 'Ferry',
  gondola: 'Gondola',
  cable_car: 'Cable Car',
  funicular: 'Funicular',
  suburban: 'Suburban',
  taxi: 'Taxi',
  aircraft: 'Flight',
};

function modeLabel(mode: string): string {
  return MODE_LABELS[mode.toLowerCase()] ?? mode.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

// ── Leg parser ───────────────────────────────────────────────────────────

/**
 * Parse a single OTP leg into TripGoSegmentSummary.
 */
export function parseOtpLeg(leg: Record<string, unknown>): TripGoSegmentSummary | null {
  const mode = (leg.mode as string) ?? 'walk';

  // OTP stores times as epoch milliseconds
  const startTimeMs = leg.startTime as number | undefined;
  const endTimeMs = leg.endTime as number | undefined;
  const durationSec = leg.duration as number | undefined;

  const fromObj = leg.from as Record<string, unknown> | undefined;
  const toObj = leg.to as Record<string, unknown> | undefined;

  const routeName =
    (leg.routeShortName as string) ||
    (leg.routeLongName as string) ||
    undefined;

  const startTime = typeof startTimeMs === 'number' ? Math.floor(startTimeMs / 1000) : undefined;
  const endTime = typeof endTimeMs === 'number' ? Math.floor(endTimeMs / 1000) : undefined;
  const durationMinutes = typeof durationSec === 'number' ? Math.round(durationSec / 60) : undefined;

  const wc = leg.wheelchairAccessible;
  const wheelchairNotes =
    wc === true || wc === 1 ? 'Wheelchair accessible'
    : wc === false || wc === 0 ? undefined
    : undefined;

  return {
    mode,
    modeLabel: routeName ? `${modeLabel(mode)} ${routeName}` : modeLabel(mode),
    from: typeof fromObj?.name === 'string' ? (fromObj.name as string) : '—',
    to: typeof toObj?.name === 'string' ? (toObj.name as string) : '—',
    startTime,
    endTime,
    durationMinutes,
    serviceName: routeName,
    notes: wheelchairNotes,
  };
}

// ── Response parser ──────────────────────────────────────────────────────

/**
 * Parse an OTP routing response.
 * OTP returns: { plan: { itineraries: [...] } }
 * Returns TripGoTripPlan[] sorted by duration.
 */
export function parseOtpResponse(data: Record<string, unknown>): {
  plans: TripGoTripPlan[];
  error?: string;
} {
  // OTP format: { plan: { itineraries: [...] } }
  const plan = data.plan as Record<string, unknown> | undefined;
  const itineraries = Array.isArray(plan?.itineraries)
    ? (plan.itineraries as OtpItinerary[])
    : [];

  if (!itineraries.length) {
    return { plans: [], error: 'No itineraries found for this route' };
  }

  const plans: TripGoTripPlan[] = [];

  for (const it of itineraries) {
    const legs = Array.isArray(it.legs)
      ? (it.legs as OtpLeg[])
      : [];

    if (!legs.length) continue;

    const segments: TripGoSegmentSummary[] = [];
    for (const leg of legs) {
      const seg = parseOtpLeg(leg);
      if (seg) segments.push(seg);
    }

    if (!segments.length) continue;

    // OTP itinerary duration is in seconds; convert to minutes
    const durationSec = it.duration as number | undefined;
    const durationMinutes =
      typeof durationSec === 'number'
        ? Math.max(1, Math.round(durationSec / 60))
        : segments.reduce((sum, s) => sum + (s.durationMinutes ?? 0), 0);

    // OTP itinerary startTime/endTime are epoch milliseconds
    const itStartMs = it.startTime as number | undefined;
    const itEndMs = it.endTime as number | undefined;

    const startTime =
      typeof itStartMs === 'number'
        ? Math.floor(itStartMs / 1000)
        : segments[0]?.startTime ?? Math.floor(Date.now() / 1000);

    const endTime =
      typeof itEndMs === 'number'
        ? Math.floor(itEndMs / 1000)
        : segments[segments.length - 1]?.endTime ?? startTime + durationMinutes * 60;

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
