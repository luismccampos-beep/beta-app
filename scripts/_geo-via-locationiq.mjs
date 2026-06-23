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

const LOCATIONIQ_KEY = process.env.LOCATIONIQ_API_KEY;

async function geocodeViaLocationIQ(name) {
  const url = `https://us1.locationiq.com/v1/search.php?key=${LOCATIONIQ_KEY}&q=${encodeURIComponent(name)}&format=json&limit=1&accept-language=en`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.error) return null;
    if (!Array.isArray(data) || data.length === 0) return null;
    return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon), type: data[0].type };
  } catch {
    return null;
  }
}

async function main() {
  const dests = await p.$queryRaw`
    SELECT d.id, d.nome, d.pais_code, COUNT(h.id)::int AS hotel_cnt
    FROM wv_destinations d
    LEFT JOIN wv_hotels h ON h.destino_id = d.id
    WHERE d.pais_code != 'XX' AND d.latitude IS NULL
    GROUP BY d.id, d.nome, d.pais_code
    ORDER BY hotel_cnt DESC
    LIMIT 80
  `;
  console.log(`Will try LocationIQ for ${dests.length} dests`);

  let fixed = 0, failed = 0;
  for (const d of dests) {
    const result = await geocodeViaLocationIQ(d.nome + (d.pais_code ? ', ' + d.pais_code : ''));
    if (result) {
      await p.$executeRaw`
        UPDATE wv_destinations
        SET latitude = ${result.lat}, longitude = ${result.lon}
        WHERE id = ${d.id}
      `;
      console.log(`  OK  "${d.nome.slice(0,40).padEnd(42)}" ${d.pais_code} → (${result.lat}, ${result.lon}) type=${result.type || '?'}`);
      fixed++;
    } else {
      console.log(`  FAIL "${d.nome.slice(0,40).padEnd(42)}" ${d.pais_code}`);
      failed++;
    }
    // Rate limit: 2 req/sec
    await new Promise(r => setTimeout(r, 600));
  }
  console.log(`\nFixed: ${fixed}, Failed: ${failed}`);

  await p.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
