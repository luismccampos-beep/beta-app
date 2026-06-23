import { PrismaClient } from '@prisma/client';
import { loadProjectEnv } from './lib/load-env.mjs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

loadProjectEnv(resolve(dirname(fileURLToPath(import.meta.url)), '..'));

const p = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL } },
});

async function main() {
  console.log('═══ FAST HOTEL DEDUP (direct SQL) ═══\n');

  // Count groups before
  const before = await p.$queryRaw`
    WITH normalized AS (
      SELECT destino_id, LOWER(REGEXP_REPLACE(UNACCENT(nome), '[^a-z0-9]', ' ', 'g')) AS nome_norm
      FROM wv_hotels
    )
    SELECT COUNT(*)::int AS cnt FROM (
      SELECT destino_id, nome_norm FROM normalized GROUP BY 1, 2 HAVING COUNT(*) > 1
    ) sub
  `;
  console.log(`Groups before: ${before[0].cnt}`);

  const hotelBefore = await p.wvHotel.count();
  console.log(`Hotels before: ${hotelBefore}\n`);

  // Delete duplicates in one shot — keep the best per group using same scoring as original script
  const result = await p.$executeRaw`
    WITH ranked AS (
      SELECT id, ROW_NUMBER() OVER (
        PARTITION BY destino_id, LOWER(REGEXP_REPLACE(UNACCENT(nome), '[^a-z0-9]', ' ', 'g'))
        ORDER BY
          CASE WHEN latitude IS NOT NULL AND longitude IS NOT NULL THEN 10 ELSE 0 END +
          CASE WHEN description IS NOT NULL THEN 5 ELSE 0 END +
          CASE WHEN image_url IS NOT NULL THEN 3 ELSE 0 END +
          CASE WHEN wikidata_id IS NOT NULL THEN 2 ELSE 0 END +
          CASE WHEN google_place_id IS NOT NULL THEN 2 ELSE 0 END +
          CASE WHEN fonte IN ('wikivoyage-listing', 'wikivoyage-en', 'wikivoyage-pt') THEN 1 ELSE 0 END
        DESC,
        id ASC
      ) AS rn
      FROM wv_hotels
    )
    DELETE FROM wv_hotels WHERE id IN (SELECT id FROM ranked WHERE rn > 1)
  `;

  const deletedCount = result.count ?? 0;
  console.log(`Deleted duplicate rows: ${deletedCount}`);

  const hotelAfter = await p.wvHotel.count();
  console.log(`Hotels after: ${hotelAfter}`);
  console.log(`Net reduction: ${hotelBefore - hotelAfter}`);

  // Update hotel_counts on destinations
  console.log(`\nUpdating hotel_count on destinations...`);
  await p.$executeRaw`
    UPDATE wv_destinations d
    SET hotel_count = sub.c
    FROM (SELECT destino_id, COUNT(*)::int AS c FROM wv_hotels GROUP BY 1) sub
    WHERE d.id = sub.destino_id
  `;
  await p.$executeRaw`
    UPDATE wv_destinations SET hotel_count = 0
    WHERE id NOT IN (SELECT DISTINCT destino_id FROM wv_hotels)
  `;
  console.log(`hotel_count updated.\n`);

  // Verify
  const after = await p.$queryRaw`
    WITH normalized AS (
      SELECT destino_id, LOWER(REGEXP_REPLACE(UNACCENT(nome), '[^a-z0-9]', ' ', 'g')) AS nome_norm
      FROM wv_hotels
    )
    SELECT COUNT(*)::int AS cnt FROM (
      SELECT destino_id, nome_norm FROM normalized GROUP BY 1, 2 HAVING COUNT(*) > 1
    ) sub
  `;
  console.log(`Groups remaining: ${after[0].cnt}`);
  console.log(`\n═══ DONE ═══`);

  await p.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
