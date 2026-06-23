import { PrismaClient } from '@prisma/client';
import { loadProjectEnv } from './lib/load-env.mjs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
loadProjectEnv(ROOT);
const p = new PrismaClient({datasources:{db:{url:process.env.DATABASE_URL_UNPOOLED??process.env.DATABASE_URL}}});

const updates = [
  // name, lat, lon, pais
  ['Ravenstein', 51.7970, 5.6516, 'NL'],  // NL not FR
  ['Tiwi Islands', -11.6, 130.817, 'AU'],
  ['Suomusjärvi', 60.35, 23.65, 'FI'],
  ['Själö', 60.2422, 21.9642, 'FI'],  // was SE, is FI
  ['Karlsborg', 58.5372, 14.5047, 'SE'],
  ['Kyyjärvi', 63.05, 24.5633, 'FI'],
  ['Buchan', -37.48333, 148.16667, 'AU'],
  ['Granity', -41.62972, 171.85361, 'NZ'],
  ['Lanigan', 51.85006, -105.03443, 'CA'],
  ['Mexquitic de Carmona', 22.267, -101.117, 'MX'],
];

let updated = 0;
for (const [nome, lat, lon, pais] of updates) {
  const dest = await p.$queryRaw`SELECT id, latitude FROM wv_destinations WHERE LOWER(nome) = LOWER(${nome}) LIMIT 1`;
  if (dest.length === 0) {
    // try partial
    const d2 = await p.$queryRaw`SELECT id, latitude FROM wv_destinations WHERE LOWER(nome) LIKE LOWER(${'%' + nome + '%'}) LIMIT 1`;
    if (d2.length === 0) { console.log(`  NOT FOUND: ${nome}`); continue; }
    if (d2[0].latitude !== null) { console.log(`  SKIP (has coord): ${nome}`); continue; }
    await p.$executeRaw`UPDATE wv_destinations SET latitude=${lat}, longitude=${lon}, pais_code=${pais}, pais=${pais} WHERE id=${d2[0].id}`;
    updated++;
    console.log(`  UPDATED (partial): ${nome} → ${pais}`);
  } else {
    if (dest[0].latitude !== null) { console.log(`  SKIP (has coord): ${nome}`); continue; }
    await p.$executeRaw`UPDATE wv_destinations SET latitude=${lat}, longitude=${lon}, pais_code=${pais}, pais=${pais} WHERE id=${dest[0].id}`;
    updated++;
    console.log(`  UPDATED: ${nome} → ${pais}`);
  }
}

console.log(`\nTotal updated: ${updated}`);

// Show remaining non-XX dests without coords that are NOT topics
const remaining = await p.$queryRaw`
  SELECT d.id, d.nome, d.pais_code, COUNT(h.id)::int AS hc
  FROM wv_destinations d LEFT JOIN wv_hotels h ON h.destino_id = d.id
  WHERE d.pais_code != 'XX' AND d.latitude IS NULL
  GROUP BY d.id ORDER BY hc DESC
`;
console.log(`\nNon-XX dests without coords: ${remaining.length}`);
// Group by hotel count
const byCount = {};
for (const r of remaining) {
  const bucket = r.hc >= 10 ? '10+' : r.hc >= 5 ? '5-9' : r.hc >= 2 ? '2-4' : '1';
  if (!byCount[bucket]) byCount[bucket] = 0;
  byCount[bucket]++;
}
for (const [k,v] of Object.entries(byCount)) console.log(`  ${k} hotels: ${v} dests`);

// Show top 10
console.log(`\nTop 10 remaining:`);
for (const r of remaining.slice(0, 10)) {
  console.log(`  ${String(r.id).padEnd(6)} ${r.nome.padEnd(40)} ${(r.pais_code||'').padEnd(4)} ${r.hc}h`);
}

await p.$disconnect();
