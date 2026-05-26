import { NextResponse } from 'next/server';

import {
  getHotelByIdFromDb,
  isTravelCatalogDbEnabled,
} from '../../../../../../../lib/travel/catalog-db';
import { fetchCommonsImageUrlFromWikidata } from '../../../../../../../lib/travel/osm';
import { prisma } from '../../../../../../../lib/prisma';

export const dynamic = 'force-dynamic';

type RouteCtx = { params: Promise<{ id: string }> };

/**
 * Imagem Wikimedia via wikidata_id do hotel (P18).
 * GET /api/travel/v1/hotels/123/image
 * POST body opcional: { wikidata_id: "Q5858321" } para gravar na DB
 */
export async function GET(_req: Request, ctx: RouteCtx) {
  const { id: idParam } = await ctx.params;
  const id = parseInt(idParam, 10);
  if (!Number.isFinite(id) || id <= 0) {
    return NextResponse.json({ ok: false, message: 'Invalid hotel id' }, { status: 400 });
  }

  if (!isTravelCatalogDbEnabled()) {
    return NextResponse.json(
      { ok: false, message: 'TRAVEL_CATALOG_SOURCE=db required' },
      { status: 503 },
    );
  }

  try {
    const row = await getHotelByIdFromDb(id);
    if (!row) {
      return NextResponse.json({ ok: false, message: 'Hotel not found' }, { status: 404 });
    }

    if (row.hotel.image_url) {
      return NextResponse.json({
        ok: true,
        hotelId: id,
        image_url: row.hotel.image_url,
        source: 'db',
      });
    }

    const wikidataId = row.hotel.wikidata_id;
    if (!wikidataId) {
      return NextResponse.json(
        { ok: false, message: 'No wikidata_id on hotel; set via OSM enrich or manual' },
        { status: 404 },
      );
    }

    const image_url = await fetchCommonsImageUrlFromWikidata(wikidataId);
    if (!image_url) {
      return NextResponse.json({ ok: false, message: 'No P18 image on Wikidata' }, { status: 404 });
    }

    await prisma.wvHotel.update({
      where: { id },
      data: { imageUrl: image_url },
    });

    return NextResponse.json({
      ok: true,
      hotelId: id,
      wikidata_id: wikidataId,
      image_url,
      source: 'wikidata-commons',
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Enrich failed';
    return NextResponse.json({ ok: false, message }, { status: 503 });
  }
}
