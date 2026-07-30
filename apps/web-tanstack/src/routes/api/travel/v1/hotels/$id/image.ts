import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { getHotelByIdFromDb } from '@/lib/travel/catalog-db'
import { fetchCommonsImageUrlFromWikidata } from '@/lib/travel/osm'
import { prisma } from '@akmleva/db'

export const Route = createFileRoute('/api/travel/v1/hotels/$id/image')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const id = z.coerce.number().int().positive().parse(params.id)

        const row = await getHotelByIdFromDb(id)
        if (!row) {
          return Response.json({ ok: false, message: 'Hotel not found' }, { status: 404 })
        }

        if (row.hotel.image_url) {
          return Response.json({
            ok: true,
            hotelId: id,
            image_url: row.hotel.image_url,
            source: 'db',
          })
        }

        const wikidataId = row.hotel.wikidata_id
        if (!wikidataId) {
          return Response.json(
            { ok: false, message: 'No wikidata_id on hotel; set via OSM enrich or manual' },
            { status: 404 },
          )
        }

        const image_url = await fetchCommonsImageUrlFromWikidata(wikidataId)
        if (!image_url) {
          return Response.json({ ok: false, message: 'No P18 image on Wikidata' }, { status: 404 })
        }

        await prisma.wvHotel.update({
          where: { id },
          data: { imageUrl: image_url },
        })

        return Response.json({
          ok: true,
          hotelId: id,
          wikidata_id: wikidataId,
          image_url,
          source: 'wikidata-commons',
        })
      },
    },
  },
})
