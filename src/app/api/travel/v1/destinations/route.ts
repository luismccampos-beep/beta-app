import { NextResponse } from 'next/server';

import {
  isTravelCatalogDbEnabled,
  searchDestinationsDb,
} from '../../../../../lib/travel/catalog-db';
import { loadMockTravelBundle } from '../../../../../lib/travel/mock-travel/load';
import { buildDestinationSlug } from '../../../../../lib/travel/destination-slug';

export const dynamic = 'force-dynamic';

/** GET /api/travel/v1/destinations?q=Lisboa&pais=Portugal&limit=24 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get('q')?.trim() || undefined;
  const pais = url.searchParams.get('pais')?.trim() || undefined;
  const lang = url.searchParams.get('lang')?.trim() || undefined;
  const limit = parseInt(url.searchParams.get('limit') ?? '24', 10);
  const offset = parseInt(url.searchParams.get('offset') ?? '0', 10);

  if (isTravelCatalogDbEnabled()) {
    try {
      const result = await searchDestinationsDb({ q, pais, lang, limit, offset });
      return NextResponse.json({ ok: true, source: 'db', ...result });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Database query failed';
      return NextResponse.json({ ok: false, source: 'db', message }, { status: 503 });
    }
  }

  const bundle = loadMockTravelBundle();
  let items = bundle.destinos;

  if (q) {
    const ql = q.toLowerCase();
    items = items.filter((d) => d.nome.toLowerCase().includes(ql));
  }
  if (pais) {
    const pl = pais.toLowerCase();
    items = items.filter((d) => d.pais.toLowerCase().includes(pl));
  }
  if (lang) {
    items = items.filter((d) => (d.lang ?? 'pt') === lang);
  }

  const total = items.length;
  const slice = items.slice(offset, offset + Math.min(limit, 100));

  return NextResponse.json({
    ok: true,
    source: 'bundle',
    total,
    items: slice.map((d) => ({
      id: d.id,
      slug: buildDestinationSlug(d),
      lang: d.lang ?? 'pt',
      nome: d.nome,
      pais: d.pais,
      paisCode: d.paisCode,
      continente: d.continente,
      iata: d.iata,
      tipo: d.tipo,
      clima: d.clima,
      descricao: d.descricao,
      imageUrl: d.imagem_url,
      latitude: d.latitude,
      longitude: d.longitude,
    })),
  });
}
