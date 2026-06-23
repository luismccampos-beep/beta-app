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
  const r = await p.$queryRaw`
    SELECT fonte, LENGTH(fonte) AS len, COUNT(*)::int AS cnt
    FROM wv_hotels WHERE LENGTH(fonte) > 35 AND fonte IS NOT NULL
    GROUP BY fonte ORDER BY len DESC LIMIT 20
  `;
  for (const x of r) console.log(`${x.len} ${x.cnt} ${x.fonte}`);

  const f = await p.$queryRaw`
    SELECT DISTINCT fonte FROM wv_hotels WHERE LENGTH(fonte) > 35 AND fonte IS NOT NULL
  `;
  console.log(`Long fontes (>35) count: ${f.length}`);

  // Check max length we'd produce
  const worst = await p.$queryRaw`
    SELECT MAX(LENGTH(fonte || '+geo_from_dest'))::int AS worst_len,
           COUNT(*) FILTER (WHERE LENGTH(fonte || '+geo_from_dest') > 40)::int AS overflow
    FROM wv_hotels WHERE latitude IS NULL AND fonte NOT LIKE '%geo_from_dest%'
  `;
  console.log(`Worst new len would be: ${worst[0].worst_len}, overflows: ${worst[0].overflow}`);

  await p.$disconnect();
}
main().catch(e => { console.error(e); p.$disconnect(); });
