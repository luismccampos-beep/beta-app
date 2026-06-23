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
  // Don't touch fonte, just fill coords from dest
  const before = await p.$queryRaw`
    SELECT COUNT(*)::int AS h, COUNT(*) FILTER (WHERE latitude IS NOT NULL)::int AS hc FROM wv_hotels
  `;
  console.log(`Hotels with coords before: ${before[0].hc}`);

  const r = await p.$executeRaw`
    UPDATE wv_hotels
    SET latitude = d.latitude, longitude = d.longitude
    FROM wv_destinations d
    WHERE wv_hotels.destino_id = d.id
      AND wv_hotels.latitude IS NULL
      AND d.latitude IS NOT NULL
      AND d.pais_code != 'XX'
  `;
  console.log(`Updated: ${r} hotels`);

  const after = await p.$queryRaw`
    SELECT COUNT(*)::int AS h, COUNT(*) FILTER (WHERE latitude IS NOT NULL)::int AS hc FROM wv_hotels
  `;
  console.log(`Hotels with coords after: ${after[0].hc}`);

  // Remaining
  const rem = await p.$queryRaw`
    SELECT h.fonte, COUNT(*)::int AS cnt
    FROM wv_hotels h WHERE h.latitude IS NULL
    GROUP BY h.fonte ORDER BY cnt DESC
  `;
  console.log('Remaining without coords:');
  for (const r of rem) console.log(`  ${(r.fonte || 'NULL').padEnd(35)} ${r.cnt}`);

  // Check that full DB is intact
  const totals = await p.$queryRaw`
    SELECT COUNT(*)::int AS dests, COUNT(*) FILTER (WHERE latitude IS NOT NULL)::int AS dest_coords
    FROM wv_destinations
  `;
  console.log(`Dests: ${totals[0].dests}, with coords: ${totals[0].dest_coords}`);

  await p.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
