import { NextResponse } from 'next/server';

import { isTravelCatalogDbEnabled, lookupCostOfLivingDb } from '../../../../../lib/travel/catalog-db';
import { summarizeCostOfLiving } from '../../../../../lib/travel/cost-tier';
import { loadMockTravelBundle } from '../../../../../lib/travel/mock-travel/load';

export const dynamic = 'force-dynamic';

/** GET /api/travel/v1/cost-of-living?city=Lisboa&country=Portugal */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const city = url.searchParams.get('city')?.trim();
  const country = url.searchParams.get('country')?.trim();

  if (!city || !country) {
    return NextResponse.json(
      { ok: false, message: 'Provide city and country' },
      { status: 400 },
    );
  }

  if (isTravelCatalogDbEnabled()) {
    try {
      const result = await lookupCostOfLivingDb(city, country);
      if (!result) {
        return NextResponse.json({ ok: false, message: 'Not found' }, { status: 404 });
      }
      return NextResponse.json({ ok: true, source: 'db', ...result });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Database error';
      return NextResponse.json({ ok: false, message }, { status: 503 });
    }
  }

  const bundle = loadMockTravelBundle();
  const cl = city.toLowerCase();
  const pl = country.toLowerCase();
  const dest = bundle.destinos.find(
    (d) =>
      d.nome.toLowerCase().includes(cl) &&
      d.pais.toLowerCase().includes(pl),
  );

  if (!dest?.custo_de_vida) {
    return NextResponse.json(
      {
        ok: false,
        message: 'Not found in bundle. Run TRAVEL_CATALOG_SOURCE=db after import.',
      },
      { status: 404 },
    );
  }

  return NextResponse.json({
    ok: true,
    source: 'bundle',
    custo: dest.custo_de_vida,
    summary: summarizeCostOfLiving(dest.custo_de_vida),
  });
}
