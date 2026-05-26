/**
 * TripGo Routing API — https://developer.tripgo.com/
 * Auth: header X-TripGo-Key
 */

const TRIPGO_API = 'https://api.tripgo.com/v1';

export type TripGoLatLng = { lat: number; lon: number };

export type TripGoRoutingInput = {
  from: TripGoLatLng;
  to: TripGoLatLng;
  /** Unix seconds; default ≈ now + 2h */
  departAfter?: number;
  /** e.g. pt_pub_wa_wal (transit + walk) */
  modes?: string;
  locale?: string;
  version?: number;
};

export type TripGoSegmentSummary = {
  mode: string;
  modeLabel: string;
  from: string;
  to: string;
  startTime?: number;
  endTime?: number;
  durationMinutes?: number;
  notes?: string;
  serviceName?: string;
};

export type TripGoTripPlan = {
  depart: number;
  arrive: number;
  durationMinutes: number;
  weightedScore?: number;
  segments: TripGoSegmentSummary[];
  fare?: { amount?: number; currency?: string; formatted?: string };
  calories?: number;
  /** kg CO2 if provided */
  carbon?: number;
};

export type TripGoRoutingResult = {
  plans: TripGoTripPlan[];
  region?: string;
  error?: string;
};

function tripgoHeaders(apiKey: string): HeadersInit {
  return {
    Accept: 'application/json',
    'Accept-Encoding': 'gzip',
    'X-TripGo-Key': apiKey,
  };
}

export function formatTripGoCoord({ lat, lon }: TripGoLatLng): string {
  return `(${lat},${lon})`;
}

const MODE_LABELS: Record<string, string> = {
  pt_pub: 'Transit',
  wa_wal: 'Walk',
  ps_tax: 'Taxi',
  cy_bic: 'Bicycle',
  cy_ele: 'E-bike',
  me_car: 'Car',
  me_mot: 'Motorcycle',
  wa_psh: 'Walk',
};

export function modeLabelFromCode(mode: string): string {
  const parts = mode.split('_');
  const labels: string[] = [];
  for (let i = 0; i < parts.length; i++) {
    const key = parts.slice(i).join('_');
    if (MODE_LABELS[key]) {
      labels.push(MODE_LABELS[key]);
      break;
    }
    const two = `${parts[i]}_${parts[i + 1]}`;
    if (parts[i + 1] && MODE_LABELS[two]) {
      labels.push(MODE_LABELS[two]);
      i += 1;
    }
  }
  return labels.length ? labels.join(' + ') : mode;
}

function fillTemplateNotes(template: string, seg: Record<string, unknown>): string {
  let out = template;
  const replacements: Record<string, string | number | undefined> = {
    startTime: seg.startTime as number | undefined,
    endTime: seg.endTime as number | undefined,
    stops: seg.stops as number | undefined,
    platform: seg.platform as string | undefined,
    serviceName: seg.serviceName as string | undefined,
    serviceNumber: seg.serviceNumber as string | undefined,
    serviceDirection: seg.serviceDirection as string | undefined,
  };
  out = out.replace(/<TIME>/g, () => {
    const t = replacements.startTime;
    if (typeof t !== 'number') return '';
    return new Date(t * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  });
  out = out.replace(/<STOPS>/g, String(replacements.stops ?? ''));
  out = out.replace(/<PLATFORM>/g, String(replacements.platform ?? ''));
  out = out.replace(/<SERVICE_NAME>/g, String(replacements.serviceName ?? ''));
  out = out.replace(/<SERVICE_NUMBER>/g, String(replacements.serviceNumber ?? ''));
  out = out.replace(/<LOCATIONS>/g, () => {
    const a = seg.startLocation as { name?: string } | undefined;
    const b = seg.endLocation as { name?: string } | undefined;
    return [a?.name, b?.name].filter(Boolean).join(' → ');
  });
  return out.replace(/\s+/g, ' ').trim();
}

function locationName(loc: unknown): string {
  if (!loc || typeof loc !== 'object') return '';
  const o = loc as Record<string, unknown>;
  if (typeof o.name === 'string') return o.name;
  if (typeof o.address === 'string') return o.address;
  return '';
}

function parseSegment(
  ref: Record<string, unknown>,
  template: Record<string, unknown> | undefined,
): TripGoSegmentSummary {
  const mode = String(template?.mode ?? ref.mode ?? 'unknown');
  const startTime = typeof ref.startTime === 'number' ? ref.startTime : undefined;
  const endTime = typeof ref.endTime === 'number' ? ref.endTime : undefined;
  let durationMinutes: number | undefined;
  if (startTime != null && endTime != null && endTime > startTime) {
    durationMinutes = Math.round((endTime - startTime) / 60);
  }

  const notesRaw = typeof template?.notes === 'string' ? template.notes : '';
  const notes = notesRaw ? fillTemplateNotes(notesRaw, { ...template, ...ref }) : undefined;

  return {
    mode,
    modeLabel: modeLabelFromCode(mode),
    from: locationName(ref.startLocation) || locationName(template?.startLocation) || '—',
    to: locationName(ref.endLocation) || locationName(template?.endLocation) || '—',
    startTime,
    endTime,
    durationMinutes,
    notes,
    serviceName:
      typeof ref.serviceName === 'string'
        ? ref.serviceName
        : typeof template?.serviceName === 'string'
          ? template.serviceName
          : undefined,
  };
}

/** Parse routing.json into simplified trip plans (best trips first). */
export function parseTripGoRoutingResponse(data: Record<string, unknown>): TripGoRoutingResult {
  const templates = new Map<string, Record<string, unknown>>();
  for (const t of (data.segmentTemplates as Record<string, unknown>[]) ?? []) {
    const hash = String(t.hashCode ?? t.segmentTemplateHashCode ?? '');
    if (hash) templates.set(hash, t);
  }

  const candidates: { trip: Record<string, unknown>; score: number }[] = [];

  for (const group of (data.groups as Record<string, unknown>[]) ?? []) {
    for (const trip of (group.trips as Record<string, unknown>[]) ?? []) {
      const score =
        typeof trip.weightedScore === 'number'
          ? trip.weightedScore
          : typeof trip.score === 'number'
            ? trip.score
            : 999;
      candidates.push({ trip, score });
    }
  }

  candidates.sort((a, b) => a.score - b.score);
  const top = candidates.slice(0, 5);

  const plans: TripGoTripPlan[] = [];

  for (const { trip, score } of top) {
    const depart = typeof trip.depart === 'number' ? trip.depart : 0;
    const arrive = typeof trip.arrive === 'number' ? trip.arrive : 0;
    if (!depart || !arrive) continue;

    const segments: TripGoSegmentSummary[] = [];
    for (const ref of (trip.segments as Record<string, unknown>[]) ?? []) {
      const hash = String(ref.segmentTemplateHashCode ?? ref.hashCode ?? '');
      segments.push(parseSegment(ref, templates.get(hash)));
    }

    let fare: TripGoTripPlan['fare'];
    const money = trip.money as Record<string, unknown> | undefined;
    if (money && typeof money.amount === 'number') {
      fare = {
        amount: money.amount,
        currency: typeof money.currency === 'string' ? money.currency : undefined,
        formatted: typeof money.priceString === 'string' ? money.priceString : undefined,
      };
    }

    plans.push({
      depart,
      arrive,
      durationMinutes: Math.max(1, Math.round((arrive - depart) / 60)),
      weightedScore: score,
      segments,
      fare,
      calories: typeof trip.calories === 'number' ? trip.calories : undefined,
      carbon: typeof trip.carbon === 'number' ? trip.carbon : undefined,
    });
  }

  return {
    plans,
    region: typeof data.region === 'string' ? data.region : undefined,
    error: plans.length ? undefined : 'No trips returned for this route',
  };
}

export async function fetchTripGoRouting(
  apiKey: string,
  input: TripGoRoutingInput,
): Promise<TripGoRoutingResult> {
  const departAfter = input.departAfter ?? Math.floor(Date.now() / 1000) + 7200;
  const params = new URLSearchParams({
    from: formatTripGoCoord(input.from),
    to: formatTripGoCoord(input.to),
    departAfter: String(departAfter),
    modes: input.modes ?? 'pt_pub_wa_wal',
    v: String(input.version ?? 11),
    locale: input.locale ?? 'en',
  });

  const url = `${TRIPGO_API}/routing.json?${params.toString()}`;
  const res = await fetch(url, {
    headers: tripgoHeaders(apiKey),
    next: { revalidate: 300 },
  });

  const text = await res.text();
  let data: Record<string, unknown> = {};
  try {
    data = JSON.parse(text) as Record<string, unknown>;
  } catch {
    return { plans: [], error: `TripGo invalid JSON (${res.status})` };
  }

  if (!res.ok) {
    const msg =
      typeof data.error === 'string'
        ? data.error
        : typeof data.message === 'string'
          ? data.message
          : text.slice(0, 200);
    return { plans: [], error: `TripGo ${res.status}: ${msg}` };
  }

  return parseTripGoRoutingResponse(data);
}

export function isTripGoConfigured(): boolean {
  return Boolean(process.env.TRIPGO_API_KEY?.trim());
}
