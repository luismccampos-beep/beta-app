import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import type { MockDestination } from './mock-travel/types';

export type HotelMapRow = {
  nome: string;
  latitude?: number;
  longitude?: number;
};

type HotelIndex = {
  byConcelho?: Record<string, HotelMapRow[]>;
  byLocalidade?: Record<string, HotelMapRow[]>;
  byArticle?: Record<string, HotelMapRow[]>;
  geoGrid?: Record<string, HotelMapRow[]>;
  articleKeys?: string[];
};

let cached: HotelIndex | null | undefined;

const INDEX_PATH = resolve(process.cwd(), 'data/hotels/hotel-index.json');

const GEO_NEIGHBORS: [number, number][] = [
  [0, 0],
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
  [-1, -1],
  [-1, 1],
  [1, -1],
  [1, 1],
];

function foldKey(s: string): string {
  return s
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function leafCityName(nome: string): string {
  const base = nome.replace(/\([^)]*\)/g, ' ').replace(/\s+/g, ' ').trim();
  return base.split(/[,|/]/)[0]?.trim() ?? base;
}

function destKeys(nome: string): string[] {
  const base = nome.replace(/\([^)]*\)/g, ' ').replace(/\s+/g, ' ').trim();
  const keys = new Set([foldKey(base), foldKey(nome)]);
  const leaf = base.split(/[,|/]/)[0]?.trim();
  if (leaf) keys.add(foldKey(leaf));
  return [...keys].filter((k) => k.length > 1);
}

function loadHotelIndex(): HotelIndex | null {
  if (cached !== undefined) return cached;
  cached = null;
  if (!existsSync(INDEX_PATH)) return null;
  try {
    cached = JSON.parse(readFileSync(INDEX_PATH, 'utf8')) as HotelIndex;
  } catch {
    cached = null;
  }
  return cached;
}

function pushRows(
  rows: HotelMapRow[] | undefined,
  seen: Set<string>,
  out: HotelMapRow[],
  max: number,
): boolean {
  for (const r of rows ?? []) {
    const k = r.nome;
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(r);
    if (out.length >= max) return true;
  }
  return false;
}

function lookupByName(dest: MockDestination, index: HotelIndex, max: number): HotelMapRow[] {
  const keys = destKeys(dest.nome ?? '');
  const out: HotelMapRow[] = [];
  const seen = new Set<string>();
  const isPt = foldKey(dest.pais ?? '') === 'portugal';

  if (isPt) {
    for (const k of keys) {
      if (pushRows(index.byConcelho?.[k], seen, out, max)) return out;
      if (pushRows(index.byLocalidade?.[k], seen, out, max)) return out;
    }
  }

  for (const k of keys) {
    if (pushRows(index.byArticle?.[k], seen, out, max)) return out;
  }

  return out;
}

function lookupGeo(lat: number, lon: number, index: HotelIndex, max: number): HotelMapRow[] {
  const out: HotelMapRow[] = [];
  const seen = new Set<string>();
  const clat = Math.trunc(lat * 4);
  const clon = Math.trunc(lon * 4);

  for (const [da, db] of GEO_NEIGHBORS) {
    const key = `${clat + da}_${clon + db}`;
    if (pushRows(index.geoGrid?.[key], seen, out, max)) return out;
  }

  return out;
}

/** Hotéis com coordenadas do índice offline (TurAD / local / Wikivoyage). */
export function lookupHotelsForMap(dest: MockDestination, max = 6): HotelMapRow[] {
  const index = loadHotelIndex();
  if (!index) return [];

  const merged: HotelMapRow[] = [];
  const seen = new Set<string>();

  const add = (rows: HotelMapRow[]) => {
    for (const r of rows) {
      if (seen.has(r.nome)) continue;
      seen.add(r.nome);
      merged.push(r);
      if (merged.length >= max) return;
    }
  };

  add(lookupByName(dest, index, max));

  const lat = dest.latitude;
  const lon = dest.longitude;
  if (lat != null && lon != null && Number.isFinite(lat) && Number.isFinite(lon)) {
    add(lookupGeo(lat, lon, index, max));
  }

  const ap = dest.transporte?.aeroporto;
  if (merged.length < max && ap?.lat != null && ap?.lon != null) {
    add(lookupGeo(ap.lat, ap.lon, index, max));
  }

  return merged.filter(
    (r) =>
      r.latitude != null &&
      r.longitude != null &&
      Number.isFinite(r.latitude) &&
      Number.isFinite(r.longitude),
  );
}
