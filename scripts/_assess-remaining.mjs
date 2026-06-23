import { PrismaClient } from '@prisma/client';
const p = new PrismaClient({ datasources: { db: { url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL } } });

async function main() {
  // What are the remaining 393 non-XX dests without coords?
  const r = await p.$queryRaw`
    SELECT d.id, d.nome, d.pais_code, d.pais, COUNT(h.id)::int AS hotel_cnt
    FROM wv_destinations d
    LEFT JOIN wv_hotels h ON h.destino_id = d.id
    WHERE d.pais_code != 'XX' AND d.latitude IS NULL
    GROUP BY d.id, d.nome, d.pais_code, d.pais
    ORDER BY hotel_cnt DESC
  `;
  console.log(`Remaining non-XX without coords: ${r.length}`);
  for (const d of r.slice(0, 50)) {
    console.log(`  id=${d.id} "${d.nome.padEnd(45)}" ${d.pais_code} ${d.pais?.padEnd(20)} ${d.hotel_cnt} hotels`);
  }
  console.log(`\n... and ${r.length - 50} more`);

  // Also check what % of those are really non-geographic (not real places)
  const geo = r.filter(d => d.nome.match(/[A-Z][a-z]/)); // has proper nouns
  const nonGeo = r.filter(d => !d.nome.match(/[A-Z][a-z]/) || d.nome.includes('tourism') || d.nome.includes('cuisine'));
  console.log(`\nLikely non-geographic: ~${nonGeo.length}`);

  // Hotels without coords - by dest type
  const hv = await p.$queryRaw`
    SELECT 
      COUNT(*) FILTER (WHERE d.pais_code != 'XX' AND d.latitude IS NOT NULL)::int AS has_dest_coord,
      COUNT(*) FILTER (WHERE d.pais_code != 'XX' AND d.latitude IS NULL)::int AS no_dest_coord,
      COUNT(*) FILTER (WHERE d.pais_code = 'XX')::int AS xx_dest
    FROM wv_hotels h
    JOIN wv_destinations d ON d.id = h.destino_id
    WHERE h.latitude IS NULL
  `;
  console.log(`\nHotels without coords:`);
  console.log(`  Dest has coords: ${hv[0].has_dest_coord}`);
  console.log(`  Dest lacks coords: ${hv[0].no_dest_coord}`);
  console.log(`  XX destination: ${hv[0].xx_dest}`);

  // The 1dp rounded coords - check sources
  const dp = await p.$queryRaw`
    SELECT fonte, COUNT(*)::int AS cnt
    FROM wv_hotels
    WHERE latitude IS NOT NULL AND ABS(latitude - ROUND(latitude::numeric, 1)::float8) < 0.0001
    GROUP BY fonte ORDER BY cnt DESC
  `;
  console.log(`\n1dp-precision hotels by source:`);
  for (const f of dp) console.log(`  ${f.fonte?.padEnd(25)} ${f.cnt}`);

  await p.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
