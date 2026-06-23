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
  // 1. Real places among 253 non-XX dests without coords (by hotel count)
  const r = await p.$queryRaw`
    SELECT d.id, d.nome, d.pais_code, d.pais, COUNT(h.id)::int AS hotel_cnt
    FROM wv_destinations d
    LEFT JOIN wv_hotels h ON h.destino_id = d.id
    WHERE d.pais_code != 'XX' AND d.latitude IS NULL
    GROUP BY d.id, d.nome, d.pais_code, d.pais
    ORDER BY hotel_cnt DESC
  `;
  
  // Filter out clearly non-geographic
  const nonGeoKW = ['tourism', 'cuisine', 'tour', 'architecture', 'cycling', 'hiking', 'monopoly',
    'empire', 'palaeontology', 'paleontology', 'itinerary', 'culture', 'worship', 'monarch',
    'canon', 'government', 'indigenous', 'border', 'heritage', 'history', 'world war', 'diwali',
    'k-pop', 'etruscan', 'solomon islands', 'christmas', 'driving in', 'boating in',
    'sound of music', 'spanish florida', 'swedish canon', 'sweden solar system',
    'workers', 'street-running', 'zapotec phrasebook', 'top gear'];

  const places = r.filter(d => !nonGeoKW.some(k => d.nome.toLowerCase().includes(k)));
  
  console.log(`Real places to geocode: ${places.length}`);
  for (const d of places.slice(0, 25)) {
    console.log(`  "${d.nome}" ${d.pais_code} ${d.hotel_cnt}h id=${d.id}`);
  }

  // 2. Worst rounded coords (those with 1dp that are clearly wrong)
  const badRounded = await p.$queryRaw`
    SELECT h.id, h.nome, h.latitude, h.longitude, h.fonte, d.nome AS dest_name, d.pais_code
    FROM wv_hotels h
    JOIN wv_destinations d ON d.id = h.destino_id
    WHERE h.latitude IS NOT NULL
      AND ABS(h.latitude - ROUND(h.latitude::numeric, 1)::float8) < 0.0001
      AND h.fonte IN ('geo_found')
    ORDER BY h.id
    LIMIT 20
  `;
  console.log(`\nWorst rounded coords (1dp, geo_found):`);
  for (const h of badRounded) {
    console.log(`  "${h.nome.slice(0,35).padEnd(37)}" (${h.latitude},${h.longitude}) fonte=${h.fonte} dest="${h.dest_name}"`);
  }

  await p.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
