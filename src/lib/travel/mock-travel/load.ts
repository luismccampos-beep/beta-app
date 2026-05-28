import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

import type { MockDestination, MockHotel, MockFlight, MockTravelBundle } from './types';
import { parseDestinationSlug } from '../destination-slug';
import { resolveDestinationImageUrl } from '../destination-image';

export { resolveDestinationImageUrl, TRAVEL_PLACEHOLDER_IMAGE } from '../destination-image';

let cached: MockTravelBundle | null = null;
let cachedPath: string | null = null;

const BUNDLE_WIKIVOYAGE = resolve(process.cwd(), 'src/data/travel-mock/bundle-wikivoyage.json');
const BUNDLE_FAKER = resolve(process.cwd(), 'src/data/travel-mock/bundle.json');

export function isTravelMockEnabled(): boolean {
  const v = process.env.TRAVEL_USE_MOCK_DATA?.trim().toLowerCase();
  return v === '1' || v === 'true' || v === 'yes';
}

/** Prefer Wikivoyage demo bundle when configured or when only that file exists. */
export function resolveTravelBundlePath(): string {
  const pref = process.env.TRAVEL_DEMO_DATA?.trim().toLowerCase();
  if (pref === 'faker' && existsSync(BUNDLE_FAKER)) return BUNDLE_FAKER;
  if (pref === 'wikivoyage' && existsSync(BUNDLE_WIKIVOYAGE)) return BUNDLE_WIKIVOYAGE;
  if (existsSync(BUNDLE_WIKIVOYAGE)) return BUNDLE_WIKIVOYAGE;
  return BUNDLE_FAKER;
}

export function getTravelDemoStats(): {
  source: string;
  destinos: number;
  hoteis: number;
  voos: number;
  license?: string;
} | null {
  try {
    const b = loadMockTravelBundle();
    return {
      source: b.meta.source ?? 'mock',
      destinos: b.meta.counts.destinos,
      hoteis: b.meta.counts.hoteis,
      voos: b.meta.counts.voos,
      license: b.meta.license,
    };
  } catch {
    return null;
  }
}

/** Use mock hotels when Hotelbeds is not configured (unless explicitly disabled). */
export function shouldUseMockHotels(hbKey?: string, hbSecret?: string): boolean {
  if (isTravelMockEnabled()) return true;
  const forceOff = process.env.TRAVEL_MOCK_HOTELS?.trim().toLowerCase() === 'false';
  if (forceOff) return false;
  return !hbKey?.trim() || !hbSecret?.trim();
}

/** Use mock flights when no live flight provider is configured. */
export function shouldUseMockFlights(duffelToken?: string, scrapeDoToken?: string): boolean {
  if (isTravelMockEnabled()) return true;
  const forceOff = process.env.TRAVEL_MOCK_FLIGHTS?.trim().toLowerCase() === 'false';
  if (forceOff) return false;
  return !duffelToken?.trim() && !scrapeDoToken?.trim();
}

export function loadMockTravelBundle(): MockTravelBundle {
  const path = resolveTravelBundlePath();
  if (cached && cachedPath === path) return cached;
  if (!existsSync(path)) {
    throw new Error(
      `Mock travel data missing at ${path}. Run: npm run travel:demo:build`,
    );
  }
  cached = JSON.parse(readFileSync(path, 'utf8')) as MockTravelBundle;
  cachedPath = path;
  return cached;
}

export function getMockDestinationByIata(iata: string): MockDestination | undefined {
  const code = iata.trim().toUpperCase();
  return loadMockTravelBundle().destinos.find((d) => d.iata?.toUpperCase() === code);
}

export function getMockDestinationById(id: number): MockDestination | undefined {
  return loadMockTravelBundle().destinos.find((d) => d.id === id);
}

export function getMockDestinationBySlug(slug: string): MockDestination | undefined {
  const parsed = parseDestinationSlug(slug);
  if (!parsed) return undefined;
  return loadMockTravelBundle().destinos.find(
    (d) => d.id === parsed.id && (d.lang ?? 'pt') === parsed.lang,
  );
}

export function getMockDestinationByName(name: string): MockDestination | undefined {
  const n = name.trim().toLowerCase();
  return loadMockTravelBundle().destinos.find((d) => d.nome.trim().toLowerCase() === n);
}

export function getMockHotelsForDestination(destinoId: number): MockHotel[] {
  return loadMockTravelBundle().hoteis.filter((h) => h.destino_id === destinoId);
}

export function getMockHotelById(id: number): { hotel: MockHotel; dest: MockDestination } | null {
  const hotel = loadMockTravelBundle().hoteis.find((h) => h.id === id);
  if (!hotel) return null;
  const dest = getMockDestinationById(hotel.destino_id);
  if (!dest) return null;
  return { hotel, dest };
}

export function getMockFlights(origin: string, destIata: string): MockFlight[] {
  const o = origin.toUpperCase();
  const d = destIata.toUpperCase();
  return loadMockTravelBundle().voos.filter(
    (v) => v.origem === o && v.destino_iata?.toUpperCase() === d,
  );
}

export function listMockDestinationsWithIata(): MockDestination[] {
  return loadMockTravelBundle().destinos.filter((d) => d.iata);
}

export function searchMockDestinations(query: string, limit = 20): MockDestination[] {
  const q = query.trim().toLowerCase();
  if (!q) return listMockDestinationsWithIata().slice(0, limit);
  return loadMockTravelBundle()
    .destinos.filter(
      (d) =>
        d.nome.toLowerCase().includes(q) ||
        d.pais.toLowerCase().includes(q) ||
        d.iata?.toLowerCase().includes(q),
    )
    .slice(0, limit);
}
