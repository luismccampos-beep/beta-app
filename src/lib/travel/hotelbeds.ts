import { createHash } from 'node:crypto';

export type HotelbedsAccommodationType = { code: string; label: string };
export type HotelbedsChain = { code: string; label: string };
export type HotelbedsFacility = { code: string; label: string };

function hbSignature(apiKey: string, secret: string, ts: number): string {
  return createHash('sha256').update(apiKey + secret + ts).digest('hex');
}

function hbHeaders(apiKey: string, secret: string): HeadersInit {
  const ts = Math.floor(Date.now() / 1000);
  return {
    Accept: 'application/json',
    'Accept-Encoding': 'gzip',
    'Api-key': apiKey,
    'X-Signature': hbSignature(apiKey, secret, ts),
  };
}

function pickDescription(
  row: Record<string, unknown>,
  language: string,
  fallbackKeys: string[],
): string {
  const multi = row.typeMultiDescription ?? row.descriptionObj ?? row.facilityTypDescription;
  if (Array.isArray(multi)) {
    for (const item of multi) {
      if (!item || typeof item !== 'object') continue;
      const o = item as Record<string, unknown>;
      const lang = typeof o.languageCode === 'string' ? o.languageCode : null;
      const content = typeof o.content === 'string' ? o.content : null;
      if (content && lang && lang.toUpperCase() === language.toUpperCase()) return content;
    }
    for (const item of multi) {
      if (!item || typeof item !== 'object') continue;
      const content = (item as Record<string, unknown>).content;
      if (typeof content === 'string' && content.trim()) return content;
    }
  }
  for (const k of fallbackKeys) {
    const v = row[k];
    if (typeof v === 'string' && v.trim()) return v;
  }
  return '';
}

export async function fetchHotelbedsAccommodations(
  baseUrl: string,
  apiKey: string,
  secret: string,
  language: string,
): Promise<HotelbedsAccommodationType[]> {
  const url = `${baseUrl.replace(/\/$/, '')}/hotel-content-api/1.0/types/accommodations?from=1&to=200&language=${encodeURIComponent(language)}`;
  const res = await fetch(url, { headers: hbHeaders(apiKey, secret), cache: 'no-store' });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Hotelbeds accommodations ${res.status}: ${text.slice(0, 200)}`);
  }
  const json = (await res.json()) as { accommodations?: Record<string, unknown>[] };
  const rows = json.accommodations ?? [];
  const out: HotelbedsAccommodationType[] = [];
  for (const row of rows) {
    const code = typeof row.code === 'string' ? row.code : null;
    if (!code) continue;
    const label = pickDescription(row, language, ['typeDescription', 'description']) || code;
    out.push({ code, label });
  }
  return out;
}

export async function fetchHotelbedsChains(
  baseUrl: string,
  apiKey: string,
  secret: string,
  language: string,
): Promise<HotelbedsChain[]> {
  const url = `${baseUrl.replace(/\/$/, '')}/hotel-content-api/1.0/types/chains?from=1&to=300&language=${encodeURIComponent(language)}`;
  const res = await fetch(url, { headers: hbHeaders(apiKey, secret), cache: 'no-store' });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Hotelbeds chains ${res.status}: ${text.slice(0, 200)}`);
  }
  const json = (await res.json()) as { chains?: Record<string, unknown>[] };
  const rows = json.chains ?? [];
  const out: HotelbedsChain[] = [];
  for (const row of rows) {
    const code = typeof row.code === 'string' ? String(row.code) : null;
    if (!code) continue;
    const label =
      pickDescription(row, language, ['description', 'name']) ||
      (typeof row.description === 'string' ? row.description : code);
    out.push({ code, label });
  }
  return out;
}

export async function fetchHotelbedsFacilities(
  baseUrl: string,
  apiKey: string,
  secret: string,
  language: string,
  max = 120,
): Promise<HotelbedsFacility[]> {
  const url = `${baseUrl.replace(/\/$/, '')}/hotel-content-api/1.0/types/facilities?from=1&to=${max}&language=${encodeURIComponent(language)}`;
  const res = await fetch(url, { headers: hbHeaders(apiKey, secret), cache: 'no-store' });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Hotelbeds facilities ${res.status}: ${text.slice(0, 200)}`);
  }
  const json = (await res.json()) as { facilities?: Record<string, unknown>[] };
  const rows = json.facilities ?? [];
  const out: HotelbedsFacility[] = [];
  for (const row of rows) {
    const code =
      typeof row.code === 'number' || typeof row.code === 'string' ? String(row.code) : null;
    if (!code) continue;
    const label =
      pickDescription(row, language, ['description', 'facilityTypDescription']) ||
      (typeof row.description === 'string' ? row.description : code);
    if (!label) continue;
    out.push({ code, label });
  }
  return out;
}

export function localeToHotelbedsLanguage(locale: string): string {
  switch (locale.toLowerCase()) {
    case 'pt':
      return 'POR';
    case 'es':
      return 'SPA';
    case 'fr':
      return 'FRE';
    default:
      return 'ENG';
  }
}

export type HotelbedsGeoMinRate = {
  minRate: number;
  currency: string;
  hotelName: string | null;
};

/**
 * Lowest nightly-based total from Hotelbeds availability by geolocation (Hotel API).
 */
export async function hotelbedsMinHotelRateByGeo(
  baseUrl: string,
  apiKey: string,
  secret: string,
  input: {
    checkIn: string;
    checkOut: string;
    latitude: number;
    longitude: number;
    adults: number;
    rooms?: number;
    radiusKm?: number;
  },
): Promise<HotelbedsGeoMinRate | null> {
  const ts = Math.floor(Date.now() / 1000);
  const signature = createHash('sha256').update(apiKey + secret + ts).digest('hex');
  const url = `${baseUrl.replace(/\/$/, '')}/hotel-api/1.0/hotels`;
  const payload = {
    stay: { checkIn: input.checkIn, checkOut: input.checkOut },
    occupancies: [{ rooms: input.rooms ?? 1, adults: Math.min(9, Math.max(1, input.adults)), children: 0 }],
    geolocation: {
      latitude: input.latitude,
      longitude: input.longitude,
      radius: input.radiusKm ?? 12,
      unit: 'km',
    },
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-Encoding': 'gzip',
      'Content-Type': 'application/json',
      'Api-key': apiKey,
      'X-Signature': signature,
    },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Hotelbeds hotels ${res.status}: ${text.slice(0, 240)}`);
  }

  const json = (await res.json()) as { hotels?: Record<string, unknown>[] };
  const hotels = json.hotels ?? [];
  if (hotels.length === 0) return null;

  let best = Infinity;
  let name: string | null = null;
  let cur = 'EUR';

  for (const h of hotels.slice(0, 50)) {
    const mr = h.minRate ?? h.minRatePerRoom ?? (Array.isArray(h.rooms) ? (h.rooms as Record<string, unknown>[])[0]?.rates : null);
    let rate = NaN;
    if (typeof mr === 'string' || typeof mr === 'number') rate = parseFloat(String(mr));
    if (!Number.isFinite(rate)) continue;
    if (rate < best) {
      best = rate;
      const hn = h.name;
      name = typeof hn === 'string' ? hn : null;
      const c = h.currency;
      if (typeof c === 'string') cur = c;
    }
  }

  if (!Number.isFinite(best) || best === Infinity) return null;
  return { minRate: best, currency: cur, hotelName: name };
}
