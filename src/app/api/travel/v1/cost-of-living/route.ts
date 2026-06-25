import { NextResponse } from 'next/server';
import { z } from 'zod';
import { apiHandler } from '@/lib/api/handler';
import { isTravelCatalogDbEnabled, lookupCostOfLivingDb } from '../../../../../lib/travel/catalog-db';
import { summarizeCostOfLiving } from '../../../../../lib/travel/cost-tier';
import { loadMockTravelBundle } from '../../../../../lib/travel/mock-travel/load';

export const dynamic = 'force-dynamic';

const CostOfLivingQuerySchema = z.object({
  city: z.string().min(1),
  country: z.string().min(1),
});

export const GET = apiHandler(async (req: Request) => {
  const url = new URL(req.url);
  const { city, country } = CostOfLivingQuerySchema.parse(Object.fromEntries(url.searchParams));

  if (isTravelCatalogDbEnabled()) {
    const result = await lookupCostOfLivingDb(city, country);
    if (!result) {
      return NextResponse.json({ ok: false, message: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ ok: true, source: 'db', ...result });
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
});
