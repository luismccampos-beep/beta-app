import { NextResponse } from 'next/server';

import {
  isTravelCatalogDbEnabled,
  searchDestinationsDb,
} from '../../../../lib/travel/catalog-db';
import { resolveDestinationImageUrl } from '../../../../lib/travel/destination-image';
import { loadMockTravelBundle } from '../../../../lib/travel/mock-travel/load';
import { buildDestinationSlug } from '../../../../lib/travel/destination-slug';

export const dynamic = 'force-dynamic';

/**
 * GET /api/travel/destinations?q=...&continent=...&country=...&page=1&pageSize=20&locale=pt
 *
 * This route is called by DestinationsBrowsePage. It maps the page-level
 * parameters to the v1 search API format.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get('q')?.trim() || undefined;
  const continent = url.searchParams.get('continent')?.trim() || undefined;
  const country = url.searchParams.get('country')?.trim() || undefined;
  const locale = url.searchParams.get('locale')?.trim() || 'pt';
  const hotelTypeParam = url.searchParams.get('hotelType')?.trim();
  const hotelTypes = hotelTypeParam ? hotelTypeParam.split(',').map((s) => s.trim()).filter(Boolean) : undefined;
  const page = Math.max(1, parseInt(url.searchParams.get('page') ?? '1', 10));
  const pageSize = Math.min(100, Math.max(1, parseInt(url.searchParams.get('pageSize') ?? '20', 10)));
  const offset = (page - 1) * pageSize;

  if (isTravelCatalogDbEnabled()) {
    try {
      const result = await searchDestinationsDb({
        q,
        pais: country,
        continente: continent,
        lang: locale,
        limit: pageSize,
        offset,
        hotelTypes,
      });
      return NextResponse.json({
        destinations: result.items,
        total: result.total,
        page,
        pageSize,
        hasHotelStats: true,
      });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Database query failed';
      return NextResponse.json({ ok: false, error: message }, { status: 503 });
    }
  }

  // Bundle fallback
  const bundle = loadMockTravelBundle();
  let items = bundle.destinos;

  if (q) {
    const ql = q.toLowerCase();
    items = items.filter(
      (d) =>
        d.nome.toLowerCase().includes(ql) ||
        d.pais.toLowerCase().includes(ql) ||
        (d.descricao ?? '').toLowerCase().includes(ql),
    );
  }
  if (country) {
    const cl = country.toLowerCase();
    items = items.filter((d) => d.pais.toLowerCase().includes(cl));
  }
  if (continent) {
    const ctl = continent.toLowerCase();
    items = items.filter((d) => d.continente.toLowerCase() === ctl);
  }
  if (locale) {
    items = items.filter((d) => (d.lang ?? 'pt') === locale);
  }

  const total = items.length;
  const slice = items.slice(offset, offset + pageSize);

  return NextResponse.json({
    destinations: slice.map((d) => ({
      id: String(d.id),
      slug: buildDestinationSlug(d),
      nome: d.nome,
      pais: d.pais,
      continente: d.continente,
      tipo: d.tipo,
      clima: d.clima,
      descricao: d.descricao,
      imageUrl: resolveDestinationImageUrl(d),
      iata: d.iata,
      hotelCount: undefined,
    })),
    total,
    page,
    pageSize,
  });
}
