import { NextResponse } from 'next/server';

import {
  isTravelCatalogDbEnabled,
  listDistinctContinentsFromDb,
  listDistinctCountriesFromDb,
} from '../../../../../../lib/travel/catalog-db';
import { loadMockTravelBundle } from '../../../../../../lib/travel/mock-travel/load';

export const dynamic = 'force-dynamic';

/** GET /api/travel/v1/destinations/countries — also returns continents */
export async function GET() {
  if (isTravelCatalogDbEnabled()) {
    try {
      const [countries, continents] = await Promise.all([
        listDistinctCountriesFromDb(),
        listDistinctContinentsFromDb(),
      ]);
      return NextResponse.json({ ok: true, source: 'db', countries, continents });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Database query failed';
      return NextResponse.json({ ok: false, source: 'db', message }, { status: 503 });
    }
  }

  const bundle = loadMockTravelBundle();

  const countryCounts = new Map<string, number>();
  const continentCounts = new Map<string, number>();
  for (const d of bundle.destinos) {
    if (d.pais) countryCounts.set(d.pais, (countryCounts.get(d.pais) ?? 0) + 1);
    if (d.continente) continentCounts.set(d.continente, (continentCounts.get(d.continente) ?? 0) + 1);
  }
  const countries = [...countryCounts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  const continents = [...continentCounts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

  return NextResponse.json({ ok: true, source: 'bundle', countries, continents });
}
