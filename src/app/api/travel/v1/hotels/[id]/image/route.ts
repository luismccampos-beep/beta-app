import { NextResponse } from 'next/server';
import { z } from 'zod';
import { apiHandler } from '@/lib/api/handler';
import { getHotelByIdFromDb } from '../../../../../../../lib/travel/catalog-db';
import { fetchCommonsImageUrlFromWikidata } from '../../../../../../../lib/travel/osm';
import { prisma } from '../../../../../../../lib/prisma';

export const dynamic = 'force-dynamic';

export const GET = apiHandler(async (_req: Request, ctx) => {
  const id = z.coerce.number().int().positive().parse((await ctx.params).id);

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
});
