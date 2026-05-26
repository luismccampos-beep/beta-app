/**
 * LiteAPI — hotel data (Places autocomplete, rates, booking).
 * https://docs.liteapi.travel/reference/get_data-places
 *
 * Calls must run server-side (X-API-Key). Use GET /api/travel/liteapi/places from the client.
 */

const LITEAPI_DEFAULT_BASE = 'https://api.liteapi.travel/v3.0';

export type LiteApiPlace = {
  placeId: string;
  displayName: string;
  formattedAddress: string;
  types: string[];
};

export type LiteApiPlacesSearchInput = {
  textQuery: string;
  type?: string;
  language?: string;
  clientIP?: string;
  sessionId?: string;
};

export function getLiteApiKey(): string | undefined {
  const raw = process.env.LITEAPI_API_KEY?.trim();
  return raw || undefined;
}

export function getLiteApiBaseUrl(): string {
  return process.env.LITEAPI_API_BASE_URL?.trim() || LITEAPI_DEFAULT_BASE;
}

export function isLiteApiConfigured(): boolean {
  return Boolean(getLiteApiKey());
}

export function parseLiteApiPlacesResponse(json: unknown): LiteApiPlace[] {
  if (!json || typeof json !== 'object') return [];
  const data = (json as { data?: unknown }).data;
  if (!Array.isArray(data)) return [];

  const out: LiteApiPlace[] = [];
  for (const row of data) {
    if (!row || typeof row !== 'object') continue;
    const o = row as Record<string, unknown>;
    const placeId = typeof o.placeId === 'string' ? o.placeId.trim() : '';
    const displayName = typeof o.displayName === 'string' ? o.displayName.trim() : '';
    const formattedAddress =
      typeof o.formattedAddress === 'string' ? o.formattedAddress.trim() : '';
    if (!placeId || !displayName) continue;
    const types = Array.isArray(o.types)
      ? o.types.filter((t): t is string => typeof t === 'string')
      : [];
    out.push({ placeId, displayName, formattedAddress, types });
  }
  return out;
}

export async function fetchLiteApiPlaces(
  input: LiteApiPlacesSearchInput,
  opts?: { apiKey?: string; baseUrl?: string },
): Promise<LiteApiPlace[]> {
  const apiKey = opts?.apiKey ?? getLiteApiKey();
  if (!apiKey) {
    throw new Error('LITEAPI_API_KEY not configured');
  }

  const textQuery = input.textQuery.trim();
  if (!textQuery) {
    throw new Error('textQuery is required');
  }

  const base = (opts?.baseUrl ?? getLiteApiBaseUrl()).replace(/\/$/, '');
  const url = new URL(`${base}/data/places`);
  url.searchParams.set('textQuery', textQuery);
  if (input.type?.trim()) url.searchParams.set('type', input.type.trim());
  if (input.language?.trim()) url.searchParams.set('language', input.language.trim());
  if (input.clientIP?.trim()) url.searchParams.set('clientIP', input.clientIP.trim());
  if (input.sessionId?.trim()) url.searchParams.set('sessionId', input.sessionId.trim());

  const headers: HeadersInit = {
    Accept: 'application/json',
    'X-API-Key': apiKey,
  };
  if (input.sessionId?.trim()) {
    headers['X-Places-Session-Id'] = input.sessionId.trim();
  }

  const res = await fetch(url.toString(), { headers, cache: 'no-store' });
  const bodyText = await res.text().catch(() => '');

  if (!res.ok) {
    let detail = bodyText.slice(0, 300);
    try {
      const errJson = JSON.parse(bodyText) as {
        error?: { message?: string; description?: string };
      };
      const msg = errJson.error?.message ?? errJson.error?.description;
      if (msg) detail = msg;
    } catch {
      /* keep raw slice */
    }
    throw new Error(`LiteAPI places ${res.status}: ${detail}`);
  }

  let json: unknown;
  try {
    json = JSON.parse(bodyText);
  } catch {
    throw new Error('LiteAPI places: invalid JSON response');
  }

  return parseLiteApiPlacesResponse(json);
}
