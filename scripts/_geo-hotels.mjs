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
  // Count before
  const before = await p.$queryRaw`
    SELECT COUNT(*)::int AS h, COUNT(*) FILTER (WHERE latitude IS NOT NULL)::int AS hc FROM wv_hotels
  `;
  console.log(`Before: ${before[0].h} hotels, ${before[0].hc} with coords`);

  // D1: Fill geo_not_found and NULL fonte hotels with dest coords
  const r1 = await p.$executeRaw`
    UPDATE wv_hotels
    SET latitude = d.latitude,
        longitude = d.longitude,
        fonte = CASE
          WHEN wv_hotels.fonte IS NULL OR wv_hotels.fonte = '' THEN 'geo_from_dest'
          WHEN wv_hotels.fonte = 'geo_not_found' THEN 'geo_from_dest'
          ELSE wv_hotels.fonte || '+geo_from_dest'
        END
    FROM wv_destinations d
    WHERE wv_hotels.destino_id = d.id
      AND wv_hotels.latitude IS NULL
      AND d.latitude IS NOT NULL
      AND d.pais_code != 'XX'
      AND (wv_hotels.fonte IS NULL OR wv_hotels.fonte IN ('', 'geo_not_found', 'geo_from_dest'))
  `;
  console.log(`D1: ${r1.count} hotels filled from dest coords`);

  // D2: Try to geocode hotel_centroid + wikivoyage-listing via GeoNames name lookup
  const toGeo = await p.$queryRaw`
    SELECT h.id, h.nome, h.fonte, h.destino_id, d.latitude AS dlat, d.longitude AS dlon
    FROM wv_hotels h
    JOIN wv_destinations d ON d.id = h.destino_id
    WHERE h.latitude IS NULL
      AND d.latitude IS NOT NULL
      AND h.fonte IN ('hotel_centroid', 'wikivoyage-listing')
      AND d.pais_code != 'XX'
    LIMIT 200
  `;
  console.log(`D2: ${toGeo.length} candidate hotels for GeoNames lookup`);

  // Load GeoNames cities
  const cities = JSON.parse(
    (await import('node:fs')).readFileSync(
      resolve(ROOT, 'data/geonames-cache/cities5000-cities.json'), 'utf8'
    )
  );

  // Quick name index
  const idx = new Map();
  for (const c of cities) {
    const key = (c.name || '').toLowerCase().normalize('NFD').replace(/\p{M}/gu, '');
    if (!idx.has(key)) idx.set(key, []);
    idx.get(key).push(c);
  }

  let found = 0;
  for (const h of toGeo) {
    const key = h.nome.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '');
    const matches = idx.get(key);
    if (matches) {
      // Find match close to destination
      const close = matches.filter(m =>
        Math.abs(m.lat - h.dlat) < 5 && Math.abs(m.lon - h.dlon) < 5
      );
      const best = close[0] || matches[0];
      await p.$executeRaw`UPDATE wv_hotels SET latitude = ${best.lat}, longitude = ${best.lon}, fonte = ${h.fonte + '+geonames_htl'} WHERE id = ${h.id}`;
      found++;
    }
  }
  console.log(`D2: ${found} hotels geocoded via GeoNames name match`);

  // After
  const after = await p.$queryRaw`
    SELECT COUNT(*)::int AS h, COUNT(*) FILTER (WHERE latitude IS NOT NULL)::int AS hc FROM wv_hotels
  `;
  console.log(`After: ${after[0].h} hotels, ${after[0].hc} with coords`);

  // Summary of remaining
  const rem = await p.$queryRaw`
    SELECT h.fonte, COUNT(*)::int AS cnt
    FROM wv_hotels h
    WHERE h.latitude IS NULL
    GROUP BY h.fonte ORDER BY cnt DESC
    LIMIT 5
  `;
  console.log(`Remaining without coords (top 5):`);
  for (const r of rem) console.log(`  ${r.fonte?.padEnd(35)} ${r.cnt.toLocaleString()}`);

  await p.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
