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

const FIXES = [
  // Real places without coords (web-search verified)
  { id: 17410, lat: 2.817,      lon: 104.183,    cc: 'MY', nome: 'Tioman' },
  { id: 26011, lat: 60.867,     lon: 25.275,     cc: 'FI', nome: 'Kärkölä' },
  { id: 24375, lat: 27.05833,   lon: 27.97,      cc: 'EG', nome: 'Farafra' },
  { id: 26705, lat: 62.8779,    lon: 24.8008,    cc: 'FI', nome: 'Karstula' },
  { id: 26271, lat: 60.614,     lon: 23.942,     cc: 'FI', nome: 'Nakkila' },

  // Wrong paisCode fixes + coords
  { id: 23268, lat: 1.4866,     lon: 103.3896,   cc: 'MY', nome: 'Pontian Kechil' },    // SG→MY
  { id: 28251, lat: 9.51667,    lon: 79.68333,   cc: 'LK', nome: 'Delft Island' },       // PT→LK
  { id: 28353, lat: -6.616667,  lon: 110.883333, cc: 'ID', nome: 'Mount Muria' },        // PT→ID
  { id: 27313, lat: 41.4147,    lon: 19.7206,    cc: 'AL', nome: 'Tirana Airport' },     // HR→AL
  { id: 26805, lat: 21.905,     lon: -105.13,    cc: 'MX', nome: 'Mexcaltitán' },        // MX
  { id: 27419, lat: 20.145,     lon: -97.561,    cc: 'MX', nome: 'Zozocolco' },          // MX
  { id: 19458, lat: 20.0,       lon: 76.0,       cc: 'IN', nome: 'Buldhana' },           // IN
  { id: 17411, lat: 52.472,     lon: -8.162,     cc: 'IE', nome: 'Tipperary' },          // IE
  { id: 27409, lat: 52.841,     lon: -109.883,   cc: 'CA', nome: 'Unity' },              // CA
  { id: 26556, lat: -8.392,     lon: 127.273,    cc: 'TL', nome: 'Tutuala' },            // AU→TL (East Timor)
  { id: 22779, lat: 65.807,     lon: 15.046,     cc: 'SE', nome: 'Hemavan' },            // NO→SE
  { id: 15137, lat: 64.854,     lon: -14.017,    cc: 'IS', nome: 'Route 1 (Iceland)' },  // IS - Ring Road
  { id: 24372, lat: 53.548,     lon: -114.079,   cc: 'CA', nome: 'Entwistle-Evansburg' },// CA
  { id: 23808, lat: 52.039,     lon: -112.397,   cc: 'CA', nome: 'Big Valley (Alberta)' },// CA
];

async function main() {
  console.log(`Applying ${FIXES.length} web-search verified fixes…`);

  for (const f of FIXES) {
    // Check current state
    const cur = await p.$queryRaw`
      SELECT id, nome, pais_code, latitude, longitude FROM wv_destinations WHERE id = ${f.id}
    `;
    if (cur.length === 0) {
      console.log(`  SKIP id=${f.id} "${f.nome}" — not found`);
      continue;
    }
    const oldLat = cur[0].latitude;
    const oldCc = cur[0].pais_code;
    let changed = false;

    if (oldLat === null || oldLat === undefined) {
      // No coords — set + paisCode
      await p.$executeRaw`
        UPDATE wv_destinations
        SET latitude = ${f.lat}, longitude = ${f.lon}, pais_code = ${f.cc}, pais = ${f.cc}
        WHERE id = ${f.id}
      `;
      console.log(`  SET  "${f.nome.padEnd(35)}" ${oldCc}→${f.cc} (${f.lat}, ${f.lon})`);
      changed = true;
    } else if (oldCc !== f.cc) {
      // Wrong paisCode — fix
      await p.$executeRaw`
        UPDATE wv_destinations
        SET latitude = ${f.lat}, longitude = ${f.lon}, pais_code = ${f.cc}, pais = ${f.cc}
        WHERE id = ${f.id}
      `;
      console.log(`  FIX  "${f.nome.padEnd(35)}" ${oldCc}→${f.cc} (${oldLat}→${f.lat})`);
      changed = true;
    }

    if (changed) {
      // Now fill hotels that were missing coords due to dest lacking coords
      const r = await p.$executeRaw`
        UPDATE wv_hotels
        SET latitude = d.latitude, longitude = d.longitude
        FROM wv_destinations d
        WHERE wv_hotels.destino_id = d.id AND d.id = ${f.id}
          AND wv_hotels.latitude IS NULL
      `;
      if (r > 0) console.log(`    → ${r} hotels filled`);
    }
  }

  // Fix Parvati Valley hotel (wrong coords 20,78 → 31.99,77.48)
  const pvHotel = await p.$queryRaw`
    SELECT id, nome, latitude, longitude FROM wv_hotels
    WHERE nome ILIKE '%Parvati Valley%' AND latitude = 20
  `;
  if (pvHotel.length > 0) {
    for (const h of pvHotel) {
      await p.$executeRaw`
        UPDATE wv_hotels SET latitude = 31.9924, longitude = 77.4818
        WHERE id = ${h.id}
      `;
      console.log(`  FIX  Hotel "${h.nome}" (${h.latitude},${h.longitude}) → (31.9924, 77.4818)`);
    }
  }

  // Fix Alta Galileia hotels — they have Brazil coords but should be Israel
  const galileia = await p.$queryRaw`
    SELECT h.id, h.nome, h.latitude, h.longitude, d.id AS dest_id, d.nome AS dest_name
    FROM wv_hotels h
    JOIN wv_destinations d ON d.id = h.destino_id
    WHERE d.nome ILIKE '%Alta Galileia%' AND h.latitude IS NOT NULL
      AND h.latitude < -20
  `;
  if (galileia.length > 0) {
    // Use Safed (Tzfat) coords as a reasonable center for Upper Galilee: ~33.0, 35.5
    console.log(`  Found ${galileia.length} Alta Galileia hotels with Brazil coords`);
    for (const h of galileia) {
      await p.$executeRaw`
        UPDATE wv_hotels SET latitude = 33.0, longitude = 35.5
        WHERE id = ${h.id}
      `;
      console.log(`  FIX  Hotel "${h.nome}" (${h.latitude},${h.longitude}) → (33.0, 35.5)`);
    }
    // Also fix the dest if it has Brazil coords
    await p.$executeRaw`
      UPDATE wv_destinations SET latitude = 33.0, longitude = 35.5
      WHERE nome ILIKE '%Alta Galileia%' AND latitude < -20
    `;
  }

  // Final stats
  const dests = await p.$queryRaw`
    SELECT COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE pais_code != 'XX' AND latitude IS NOT NULL)::int AS non_xx_ok,
      COUNT(*) FILTER (WHERE pais_code != 'XX' AND latitude IS NULL)::int AS non_xx_no
    FROM wv_destinations
  `;
  const hotels = await p.$queryRaw`
    SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE latitude IS NOT NULL)::int AS ok
    FROM wv_hotels
  `;
  console.log(`\n═══ RESULT ═══`);
  console.log(`Dests: ${dests[0].total} total, ${dests[0].non_xx_ok} non-XX ok, ${dests[0].non_xx_no} non-XX no coords`);
  console.log(`Hotels: ${hotels[0].total} total, ${hotels[0].ok} with coords (${(hotels[0].ok/hotels[0].total*100).toFixed(1)}%)`);

  await p.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
