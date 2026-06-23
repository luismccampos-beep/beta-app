import { PrismaClient } from '@prisma/client';
import { loadProjectEnv } from './lib/load-env.mjs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
loadProjectEnv(ROOT);

const p = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL } },
});

async function main() {
  console.log('═══ REMAINING HOTELS WITHOUT COORDS BY DEST TYPE ═══');
  const rem = await p.$queryRaw`
    SELECT 
      CASE WHEN d.pais_code = 'XX' THEN 'XX destination'
           WHEN d.latitude IS NULL THEN 'Dest no coords'
           ELSE 'UNEXPECTED'
      END AS category,
      h.fonte,
      COUNT(*)::int AS cnt
    FROM wv_hotels h
    JOIN wv_destinations d ON d.id = h.destino_id
    WHERE h.latitude IS NULL
    GROUP BY category, h.fonte
    ORDER BY category, cnt DESC
  `;
  for (const r of rem) console.log(`  ${r.category.padEnd(18)} ${(r.fonte || 'NULL').padEnd(35)} ${r.cnt}`);

  console.log('\n═══ DEST-LEVEL SUMMARY ═══');
  const dests = await p.$queryRaw`
    SELECT COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE pais_code='XX')::int AS xx,
      COUNT(*) FILTER (WHERE pais_code!='XX' AND latitude IS NOT NULL)::int AS non_xx_ok,
      COUNT(*) FILTER (WHERE pais_code!='XX' AND latitude IS NULL)::int AS non_xx_no_coord,
      COUNT(*) FILTER (WHERE pais_code='XX' AND latitude IS NOT NULL)::int AS xx_with_coord
    FROM wv_destinations
  `;
  console.log(JSON.stringify(dests[0], null, 2));

  console.log('\n═══ FINAL HOTEL COUNTS ═══');
  const h = await p.$queryRaw`
    SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE latitude IS NOT NULL)::int AS with_coords
    FROM wv_hotels
  `;
  console.log(JSON.stringify(h[0], null, 2));

  await p.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
