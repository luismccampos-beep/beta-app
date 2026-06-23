import { PrismaClient } from '@prisma/client';
const p = new PrismaClient({ datasources: { db: { url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL } } });

async function main() {
  // 1. Non-XX dests without coords (that had cluster coords before)
  const nonXxNoCoords = await p.$queryRaw`
    SELECT COUNT(*)::int AS cnt FROM wv_destinations WHERE pais_code != 'XX' AND latitude IS NULL
  `;
  console.log(`Non-XX dests without coords: ${nonXxNoCoords[0].cnt}`);

  const nonXxSamples = await p.$queryRaw`
    SELECT id, nome, pais_code, pais FROM wv_destinations WHERE pais_code != 'XX' AND latitude IS NULL LIMIT 20
  `;
  console.log('Samples:');
  for (const s of nonXxSamples) console.log(`  id=${s.id} "${s.nome}" ${s.pais_code} ${s.pais}`);

  // 2. Suspiciously rounded coords
  const rounded = await p.$queryRaw`
    SELECT COUNT(*)::int AS cnt FROM wv_hotels WHERE latitude IS NOT NULL AND ABS(latitude * 10000 - ROUND(latitude * 10000)) < 0.0001
  `;
  console.log(`\nHotels with suspiciously rounded coords (4 decimal): ${rounded[0].cnt}`);

  const roundedSamples = await p.$queryRaw`
    SELECT id, nome, latitude, longitude, fonte, destino_id FROM wv_hotels 
    WHERE latitude IS NOT NULL AND ABS(latitude * 10000 - ROUND(latitude * 10000)) < 0.0001 
    LIMIT 15
  `;
  for (const h of roundedSamples) console.log(`  id=${h.id} "${h.nome.slice(0,35)}" ${h.latitude},${h.longitude} fonte=${h.fonte}`);

  // Rounding distribution - check at what precision
  const prec = await p.$queryRaw`
    SELECT 
      COUNT(*) FILTER (WHERE latitude IS NOT NULL AND ABS(latitude - ROUND(latitude::numeric, 1)::float8) < 0.0001)::int AS p1,
      COUNT(*) FILTER (WHERE latitude IS NOT NULL AND ABS(latitude - ROUND(latitude::numeric, 2)::float8) < 0.0001 AND ABS(latitude - ROUND(latitude::numeric, 1)::float8) > 0.0001)::int AS p2,
      COUNT(*) FILTER (WHERE latitude IS NOT NULL AND ABS(latitude - ROUND(latitude::numeric, 3)::float8) < 0.0001 AND ABS(latitude - ROUND(latitude::numeric, 2)::float8) > 0.0001)::int AS p3,
      COUNT(*) FILTER (WHERE latitude IS NOT NULL AND ABS(latitude - ROUND(latitude::numeric, 4)::float8) < 0.0001 AND ABS(latitude - ROUND(latitude::numeric, 3)::float8) > 0.0001)::int AS p4
    FROM wv_hotels
  `;
  console.log(`\nRounding precision: 1dp=${prec[0].p1} 2dp=${prec[0].p2} 3dp=${prec[0].p3} 4dp=${prec[0].p4}`);

  // 3. Hotels >10° from dest country
  const farHotels = await p.$queryRaw`
    SELECT h.id, h.nome, h.latitude, h.longitude, h.fonte, h.destino_id, d.nome AS dest_nome, d.pais_code
    FROM wv_hotels h 
    JOIN wv_destinations d ON d.id = h.destino_id
    WHERE h.latitude IS NOT NULL 
      AND d.pais_code NOT IN ('XX')
    ORDER BY h.id
  `;

  // Simple heuristic: if hotel lat is >20° away from dest lat in the same country, flag it
  // Use country bounding box check instead
  console.log(`\nChecking ${farHotels.length} hotels for country-out-of-bounds...`);

  await p.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
