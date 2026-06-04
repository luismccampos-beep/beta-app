/**
 * CruiseWay API — cruzeiros (alternativa/complemento à Siloah).
 * https://api.cruiseway.gr/docs/
 */

const CRUISEWAY_DEFAULT_BASE = 'https://api.cruiseway.gr';

export type CruisewayCruise = {
  id: number;
  code: string;
  title: string;
  vesselName: string | null;
  durationNights: number;
  departureAt: string | null;
  portName: string | null;
  portCode: string | null;
  countryName: string | null;
  imageUrl: string | null;
  bookedStatus: string | null;
};

export function getCruisewayBaseUrl(): string {
  return (process.env.CRUISEWAY_API_BASE_URL?.trim() || CRUISEWAY_DEFAULT_BASE).replace(/\/$/, '');
}

export function getCruisewayToken(): string | undefined {
  return (
    process.env.CRUISEWAY_API_TOKEN?.trim() ||
    process.env.CRUISEWAY_ACCESS_TOKEN?.trim() ||
    undefined
  );
}

export function isCruisewayConfigured(): boolean {
  return Boolean(getCruisewayToken());
}

function authHeaders(): HeadersInit {
  const token = getCruisewayToken();
  if (!token) throw new Error('CRUISEWAY_API_TOKEN not configured');
  return {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

function mapCruiseRow(raw: Record<string, unknown>): CruisewayCruise | null {
  const id = typeof raw.id === 'number' ? raw.id : parseInt(String(raw.id ?? ''), 10);
  if (!Number.isFinite(id)) return null;
  const vessel = raw.vessel as Record<string, unknown> | undefined;
  const port = raw.port as Record<string, unknown> | undefined;
  const country = port?.country as Record<string, unknown> | undefined;
  const media = vessel?.media as Record<string, unknown> | undefined;
  const primary = media?.primary_image as Record<string, unknown> | undefined;

  return {
    id,
    code: String(raw.code ?? ''),
    title: String(raw.title ?? raw.code ?? `Cruise ${id}`),
    vesselName: typeof vessel?.name === 'string' ? vessel.name : null,
    durationNights: typeof raw.duration === 'number' ? raw.duration : 0,
    departureAt: typeof raw.departure_at === 'string' ? raw.departure_at : null,
    portName: typeof port?.name === 'string' ? port.name : null,
    portCode: typeof port?.code === 'string' ? port.code : null,
    countryName: typeof country?.name === 'string' ? country.name : null,
    imageUrl: typeof primary?.original === 'string' ? primary.original : null,
    bookedStatus: typeof raw.booked_status === 'string' ? raw.booked_status : null,
  };
}

export async function fetchCruisewayCruises(opts?: {
  page?: number;
  destinationIds?: number[];
  brandIds?: number[];
}): Promise<{ cruises: CruisewayCruise[]; total: number; page: number }> {
  const base = getCruisewayBaseUrl();
  const url = new URL(`${base}/cruises`);
  url.searchParams.set('page', String(opts?.page ?? 1));
  for (const id of opts?.destinationIds ?? []) {
    url.searchParams.append('destination[]', String(id));
  }
  for (const id of opts?.brandIds ?? []) {
    url.searchParams.append('brand[]', String(id));
  }

  const res = await fetch(url.toString(), { headers: authHeaders(), cache: 'no-store' });
  const text = await res.text().catch(() => '');
  if (!res.ok) {
    throw new Error(`CruiseWay cruises ${res.status}: ${text.slice(0, 200)}`);
  }

  const json = JSON.parse(text) as {
    data?: {
      data?: Record<string, unknown>[];
      total?: number;
      current_page?: number;
    };
  };

  const rows = json.data?.data ?? [];
  const cruises = rows
    .map((r) => mapCruiseRow(r))
    .filter((c): c is CruisewayCruise => c != null);

  return {
    cruises,
    total: json.data?.total ?? cruises.length,
    page: json.data?.current_page ?? opts?.page ?? 1,
  };
}
