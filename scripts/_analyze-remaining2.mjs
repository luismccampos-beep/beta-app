import { PrismaClient } from '@prisma/client';
const p = new PrismaClient({ datasources: { db: { url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL } } });

async function main() {
  // Better rounding analysis
  const r1 = await p.$queryRaw`
    SELECT COUNT(*)::int AS cnt FROM wv_hotels 
    WHERE latitude IS NOT NULL AND ABS(latitude - ROUND(latitude::numeric, 1)::float8) < 0.0001
  `;
  console.log(`Rounded to 1 decimal: ${r1[0].cnt}`);

  const r2 = await p.$queryRaw`
    SELECT COUNT(*)::int AS cnt FROM wv_hotels 
    WHERE latitude IS NOT NULL 
      AND ABS(latitude - ROUND(latitude::numeric, 2)::float8) < 0.0001
      AND ABS(latitude - ROUND(latitude::numeric, 1)::float8) > 0.0001
  `;
  console.log(`Rounded to 2 decimal: ${r2[0].cnt}`);

  const r3 = await p.$queryRaw`
    SELECT COUNT(*)::int AS cnt FROM wv_hotels 
    WHERE latitude IS NOT NULL 
      AND ABS(latitude - ROUND(latitude::numeric, 3)::float8) < 0.000001
      AND ABS(latitude - ROUND(latitude::numeric, 2)::float8) > 0.0001
  `;
  console.log(`Rounded to 3 decimal: ${r3[0].cnt}`);

  // Hotels 10+ degrees from dest (offset check via lat only)
  const farHotels = await p.$queryRaw`
    SELECT h.id, h.nome, h.latitude, h.longitude, h.fonte, h.destino_id, d.nome AS dest, d.pais_code, d.latitude AS dlat, d.longitude AS dlon
    FROM wv_hotels h
    JOIN wv_destinations d ON d.id = h.destino_id
    WHERE h.latitude IS NOT NULL AND d.latitude IS NOT NULL
      AND d.pais_code NOT IN ('XX')
      AND (ABS(h.latitude - d.latitude) > 10 OR ABS(h.longitude - d.longitude) > 10)
    ORDER BY (ABS(h.latitude - d.latitude) + ABS(h.longitude - d.longitude)) DESC
    LIMIT 30
  `;
  console.log(`\nHotels >10° from their destination:`);
  for (const h of farHotels) console.log(`  id=${h.id} "${h.nome.slice(0,35)}" hotel=${h.latitude},${h.longitude} dest=${h.dlat},${h.dlon} [${h.dest}] (${h.pais_code}) fonte=${h.fonte}`);

  // Hotels without coords by fonte
  const noCoordFonte = await p.$queryRaw`
    SELECT fonte, COUNT(*)::int AS cnt
    FROM wv_hotels WHERE latitude IS NULL
    GROUP BY fonte ORDER BY cnt DESC
    LIMIT 20
  `;
  console.log(`\nHotels without coords by source:`);
  for (const f of noCoordFonte) console.log(`  ${f.fonte?.padEnd(35)} ${f.cnt}`);

  // Non-XX dests without coords with their hotel count
  const nonXx = await p.$queryRaw`
    SELECT d.id, d.nome, d.pais_code, d.pais, COUNT(h.id)::int AS hotel_cnt
    FROM wv_destinations d
    LEFT JOIN wv_hotels h ON h.destino_id = d.id
    WHERE d.pais_code != 'XX' AND d.latitude IS NULL
    GROUP BY d.id, d.nome, d.pais_code, d.pais
    ORDER BY hotel_cnt DESC
  `;
  console.log(`\nNon-XX dests without coords (${nonXx.length}):`);
  for (const d of nonXx.slice(0, 30)) console.log(`  id=${d.id} "${d.nome.padEnd(35)}" ${d.pais_code} ${d.pais?.padEnd(20)} ${d.hotel_cnt} hotels`);

  await p.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
