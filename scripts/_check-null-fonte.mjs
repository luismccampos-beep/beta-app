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
  // Check exactly what the undefined fonte values are
  const nul = await p.$queryRaw`
    SELECT fonte, COUNT(*)::int AS cnt
    FROM wv_hotels WHERE fonte IS NULL OR fonte = ''
    GROUP BY fonte
  `;
  console.log('NULL/empty fonte:', JSON.stringify(nul));

  // Also check: how many have latitude NULL AND could get dest coords?
  const cnt = await p.$queryRaw`
    SELECT COUNT(*)::int AS possible
    FROM wv_hotels h JOIN wv_destinations d ON d.id = h.destino_id
    WHERE h.latitude IS NULL AND d.latitude IS NOT NULL AND d.pais_code != 'XX'
  `;
  console.log(`Hotels without coords that could get dest coords: ${cnt[0].possible}`);

  // Check: what fontes do these have?
  const byFonte = await p.$queryRaw`
    SELECT h.fonte, COUNT(*)::int AS cnt
    FROM wv_hotels h JOIN wv_destinations d ON d.id = h.destino_id
    WHERE h.latitude IS NULL AND d.latitude IS NOT NULL AND d.pais_code != 'XX'
    GROUP BY h.fonte ORDER BY cnt DESC
  `;
  console.log('By fonte:');
  for (const r of byFonte) console.log(`  "${r.fonte?.replace(/\x00/g, 'NULL')}" → ${r.cnt}`);

  await p.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
