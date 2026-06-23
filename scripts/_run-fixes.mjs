import { PrismaClient } from '@prisma/client';
import { loadProjectEnv } from './lib/load-env.mjs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

loadProjectEnv(resolve(dirname(fileURLToPath(import.meta.url)), '..'));

const p = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL } },
});

async function main() {
  console.log('═══ FIXING PAISCODES ═══\n');

  // 1. Fix wrong paisCode assignments
  const paisFixes = [
    { id: 3279, cc: 'US', pais: 'Estados Unidos' },     // Angola (Indiana) → US
    { id: 6436, cc: 'IN', pais: 'Índia' },               // Daman (India) → IN
    { id: 170, cc: 'NZ', pais: 'Nova Zelândia' },        // Auckland (US→NZ)
    { id: 6592, cc: 'AU', pais: 'Austrália' },            // Denmark (Western Australia) → AU
    { id: 6609, cc: 'AU', pais: 'Austrália' },            // Derby (Western Australia) → AU
    { id: 7014, cc: 'US', pais: 'Estados Unidos' },       // Edinburgh (Indiana) → US
    { id: 7864, cc: 'US', pais: 'Estados Unidos' },       // Georgetown (Floyd County, Indiana) → US
    { id: 4780, cc: 'IO', pais: 'Território Britânico do Oceano Índico' }, // British Indian Ocean Territory → IO
    { id: 4766, cc: 'US', pais: 'Estados Unidos' },       // Brighton Seminole Indian Reservation → US
    { id: 4091, cc: 'US', pais: 'Estados Unidos' },       // Bedford (Indiana) → US
    { id: 7599, cc: 'GA', pais: 'Gabão' },                // Franceville → GA
  ];

  for (const f of paisFixes) {
    await p.$executeRaw`UPDATE wv_destinations SET pais_code = ${f.cc}, pais = ${f.pais} WHERE id = ${f.id}`;
    console.log(`  id=${f.id} → ${f.cc} ${f.pais}`);
  }
  console.log();

  // 2. Fix Auckland (id=170) coordinates too
  await p.$executeRaw`UPDATE wv_destinations SET latitude = -36.852097, longitude = 174.763180 WHERE id = 170`;
  console.log('  Auckland (id=170) coords fixed to -36.852, 174.763');

  // 3. Nullify cluster coords (false positives from LocationIQ fallback)
  const clusters = [
    { lat: 37.091, lon: -8.2172, label: 'Algarve cluster (751 dests)' },
    { lat: 37.0994, lon: -8.128, label: 'Algarve cluster (444 dests)' },
    { lat: 37.1131, lon: -8.6752, label: 'Algarve cluster (403 dests)' },
    { lat: 39.866, lon: -75.179, label: 'Philadelphia cluster (38 dests)' },
  ];

  console.log('\n═══ NULLIFYING CLUSTER COORDS ═══');
  for (const c of clusters) {
    const r = await p.$executeRaw`
      UPDATE wv_destinations
      SET latitude = NULL, longitude = NULL
      WHERE ABS(latitude - ${c.lat}) < 0.001 AND ABS(longitude - ${c.lon}) < 0.001
    `;
    console.log(`  ${c.label}: ${r.count ?? '?'} dests nullified`);
  }

  // 4. Nullify ALL XX destinations whose coords fall within Portugal (LocationIQ fallback coords)
  // Portugal bounding box: lat 32-42, lon -10 to -6
  console.log('\n═══ NULLIFYING XX COORDS IN PORTUGAL ═══');
  const ptResult = await p.$executeRaw`
    UPDATE wv_destinations
    SET latitude = NULL, longitude = NULL
    WHERE pais_code = 'XX'
      AND latitude IS NOT NULL
      AND latitude BETWEEN 32 AND 42
      AND longitude BETWEEN -10 AND -6
  `;
  console.log(`  Portugal-area XX dests nullified: ${ptResult.count ?? ptResult}`);

  // 5. Nullify XX dests near Philadelphia fallback (wider box)
  const usResult = await p.$executeRaw`
    UPDATE wv_destinations
    SET latitude = NULL, longitude = NULL
    WHERE pais_code = 'XX'
      AND latitude IS NOT NULL
      AND ABS(latitude - 39.866) < 2
      AND ABS(longitude - -75.179) < 2
  `;
  console.log(`  US-area (Philadelphia) XX dests nullified: ${usResult.count ?? usResult}`);

  // 6. Fix Anchorage hotel coords — nullify TBO Australian coords and cluster coords
  console.log('\n═══ FIXING ANCHORAGE HOTEL COORDS ═══');
  // TBO hotels with Australian coords
  const tboFix = await p.$executeRaw`
    UPDATE wv_hotels
    SET latitude = NULL, longitude = NULL
    WHERE destino_id IN (SELECT id FROM wv_destinations WHERE nome = 'Anchorage' AND pais_code = 'US')
      AND fonte = 'tbo'
      AND ABS(latitude - (-38.76133)) < 0.01 AND ABS(longitude - 143.66731) < 0.01
  `;
  console.log(`  TBO Australian coords nullified: ${tboFix.count ?? tboFix}`);
  // Local hotels with cluster coords
  const localFix = await p.$executeRaw`
    UPDATE wv_hotels
    SET latitude = NULL, longitude = NULL
    WHERE destino_id IN (SELECT id FROM wv_destinations WHERE nome = 'Anchorage' AND pais_code = 'US')
      AND fonte = 'local'
      AND ABS(latitude - 37.091) < 0.01 AND ABS(longitude - (-8.2172)) < 0.01
  `;
  console.log(`  Local cluster coords nullified: ${localFix.count ?? localFix}`);

  // 7. Nullify hotel coords from Portugal cluster across all dests
  console.log('\n═══ NULLIFYING ALL HOTEL CLUSTER COORDS ═══');
  const hCluster1 = await p.$executeRaw`
    UPDATE wv_hotels
    SET latitude = NULL, longitude = NULL
    WHERE ABS(latitude - 37.091) < 0.01 AND ABS(longitude - (-8.2172)) < 0.01
      AND latitude IS NOT NULL
  `;
  console.log(`  Hotel cluster 37.091,-8.217: ${hCluster1.count ?? hCluster1}`);

  const hCluster2 = await p.$executeRaw`
    UPDATE wv_hotels
    SET latitude = NULL, longitude = NULL
    WHERE ABS(latitude - 37.0994) < 0.01 AND ABS(longitude - (-8.128)) < 0.01
      AND latitude IS NOT NULL
  `;
  console.log(`  Hotel cluster 37.0994,-8.128: ${hCluster2.count ?? hCluster2}`);

  const hCluster3 = await p.$executeRaw`
    UPDATE wv_hotels
    SET latitude = NULL, longitude = NULL
    WHERE ABS(latitude - 37.1131) < 0.01 AND ABS(longitude - (-8.6752)) < 0.01
      AND latitude IS NOT NULL
  `;
  console.log(`  Hotel cluster 37.1131,-8.6752: ${hCluster3.count ?? hCluster3}`);

  const hScore = await p.$executeRaw`
    UPDATE wv_hotels
    SET latitude = NULL, longitude = NULL
    WHERE ABS(latitude - 39.866) < 0.01 AND ABS(longitude - (-75.179)) < 0.01
      AND latitude IS NOT NULL
  `;
  console.log(`  Hotel cluster 39.866,-75.179: ${hScore.count ?? hScore}`);

  console.log('\n═══ DONE ═══');

  await p.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
