import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PrismaClient } from '@prisma/client';
import { loadProjectEnv } from './lib/load-env.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
loadProjectEnv(ROOT);

const p = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL } },
});

const cities = JSON.parse(readFileSync(resolve(ROOT, 'data/geonames-cache/cities5000-cities.json'), 'utf8'));
console.log(`GeoNames cities: ${cities.length.toLocaleString()}`);

// Build name → city indices
const idx = { exact: new Map(), ascii: new Map(), alt: new Map(), noParen: new Map(), lower: new Map() };
function fold(s) { return String(s ?? '').normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().trim(); }

for (const c of cities) {
  const key = fold(c.name);
  if (!idx.exact.has(key)) idx.exact.set(key, []);
  idx.exact.get(key).push(c);
  if (!idx.lower.has(key)) idx.lower.set(key, []);
  idx.lower.get(key).push(c);

  const akey = fold(c.asciiName);
  if (akey !== key) {
    if (!idx.ascii.has(akey)) idx.ascii.set(akey, []);
    idx.ascii.get(akey).push(c);
  }

  for (const alt of c.alternatenames || []) {
    const ak = fold(alt);
    if (ak.length > 3 && ak !== key) {
      if (!idx.alt.has(ak)) idx.alt.set(ak, []);
      idx.alt.get(ak).push(c);
    }
  }

  // Index without parenthetical (e.g., "St. Marys (Ontario)" -> "st. marys")
  const noParenKey = key.replace(/\s*\(.*?\)\s*/g, ' ').trim();
  if (noParenKey !== key && noParenKey.length > 2) {
    if (!idx.noParen.has(noParenKey)) idx.noParen.set(noParenKey, []);
    idx.noParen.get(noParenKey).push(c);
  }
}

function findBestCity(name, paisCode) {
  const f = fold(name);
  const noParen = f.replace(/\s*\(.*?\)\s*/g, ' ').trim();

  // Try each index in order of specificity
  const tries = [idx.exact, idx.ascii, idx.alt];
  if (noParen !== f) tries.push(idx.noParen);
  tries.push(idx.lower);

  for (const index of tries) {
    const matches = index.get(f) || index.get(noParen);
    if (!matches) continue;
    // Prefer same country
    if (paisCode) {
      const same = matches.filter(m => m.countryCode === paisCode);
      if (same.length > 0) return same[0];
    }
    // Prefer populated place
    const pop = matches.filter(m => m.featureCode?.startsWith('PPL'));
    if (pop.length > 0) return pop[0];
    return matches[0];
  }
  return null;
}

async function main() {
  // ===== A: Geocode remaining 393 dests via GeoNames =====
  console.log('\n═══ A1. AGGRESSIVE GEONAMES MATCH ═══');
  const dests = await p.$queryRaw`
    SELECT id, nome, pais_code FROM wv_destinations
    WHERE pais_code != 'XX' AND latitude IS NULL
    ORDER BY id
  `;
  console.log(`Targets: ${dests.length}`);

  let found = 0, paisFixed = 0;
  const fixBatch = [];

  for (const d of dests) {
    const c = findBestCity(d.nome, d.pais_code);
    if (c) {
      fixBatch.push({ id: d.id, lat: c.lat, lon: c.lon, cc: c.countryCode });
      if (c.countryCode !== d.pais_code) paisFixed++;
      found++;
    }
    if (fixBatch.length % 200 === 0 && fixBatch.length > 0) {
      console.log(`  searched ${fixBatch.length}/${dests.length}…`);
    }
  }
  console.log(`Matched: ${found}/${dests.length} (${paisFixed} country changes)`);

  if (fixBatch.length > 0) {
    const BATCH = 200;
    for (let i = 0; i < fixBatch.length; i += BATCH) {
      const b = fixBatch.slice(i, i + BATCH);
      const ids = b.map(u => u.id).join(',');
      const updates = b.map(u => `WHEN id = ${u.id} THEN '${u.cc}'`).join(' ');
      await p.$executeRawUnsafe(`
        UPDATE wv_destinations SET
          latitude = CASE ${b.map(u => `WHEN id = ${u.id} THEN ${u.lat}`).join(' ')} ELSE latitude END,
          longitude = CASE ${b.map(u => `WHEN id = ${u.id} THEN ${u.lon}`).join(' ')} ELSE longitude END,
          pais_code = CASE ${updates} ELSE pais_code END,
          pais = CASE ${updates} ELSE pais END
        WHERE id IN (${ids})
      `);
    }
    console.log(`  Applied ${fixBatch.length} updates`);
  }

  // ===== A2: Fill remaining no-coord dests via hotel centroid =====
  console.log('\n═══ A2. HOTEL CENTROID FALLBACK ═══');
  const stillMissing = await p.$queryRaw`
    SELECT d.id, d.nome, d.pais_code
    FROM wv_destinations d
    WHERE d.pais_code != 'XX' AND d.latitude IS NULL
    ORDER BY d.id
  `;
  console.log(`Still missing: ${stillMissing.length}`);

  if (stillMissing.length > 0) {
    // Try to find hotels with coords for these dests
    let centroided = 0;
    for (const d of stillMissing) {
      const h = await p.$queryRaw`
        SELECT AVG(latitude)::numeric(10,5) AS lat, AVG(longitude)::numeric(10,5) AS lon,
               COUNT(*)::int AS cnt
        FROM wv_hotels WHERE destino_id = ${d.id} AND latitude IS NOT NULL
      `;
      if (h[0].lat && h[0].cnt >= 2) {
        await p.$executeRaw`
          UPDATE wv_destinations SET latitude = ${h[0].lat}, longitude = ${h[0].lon}
          WHERE id = ${d.id}
        `;
        centroided++;
      }
    }
    console.log(`  Hotel-centroided: ${centroided}`);
  }

  // ===== B: Fix dests with wrong coords (country bounding box check) =====
  console.log('\n═══ B. FIX DESTS WITH COORDS OUTSIDE COUNTRY ═══');
  const badCoordDests = await p.$queryRaw`
    SELECT d.id, d.nome, d.pais_code, d.latitude AS dlat, d.longitude AS dlon
    FROM wv_destinations d
    WHERE d.pais_code NOT IN ('XX', 'PT', 'US') AND d.latitude IS NOT NULL
      AND (
        (d.pais_code = 'BR' AND (d.latitude < -34 OR d.latitude > 6 OR d.longitude < -74 OR d.longitude > -34))
        OR (d.pais_code = 'AU' AND (d.latitude < -44 OR d.latitude > -10 OR d.longitude < 113 OR d.longitude > 154))
        OR (d.pais_code = 'NZ' AND (d.latitude < -48 OR d.latitude > -34 OR d.longitude < 166 OR d.longitude > 179))
        OR (d.pais_code = 'GB' AND (d.latitude < 49 OR d.latitude > 61 OR d.longitude < -8 OR d.longitude > 2))
        OR (d.pais_code = 'JP' AND (d.latitude < 24 OR d.latitude > 46 OR d.longitude < 122 OR d.longitude > 146))
        OR (d.pais_code = 'IE' AND (d.latitude < 51 OR d.latitude > 56 OR d.longitude < -11 OR d.longitude > -5))
        OR (d.pais_code = 'CN' AND (d.latitude < 18 OR d.latitude > 54 OR d.longitude < 73 OR d.longitude > 135))
        OR (d.pais_code = 'KR' AND (d.latitude < 33 OR d.latitude > 39 OR d.longitude < 124 OR d.longitude > 132))
        OR (d.pais_code = 'IN' AND (d.latitude < 6 OR d.latitude > 36 OR d.longitude < 68 OR d.longitude > 98))
        OR (d.pais_code = 'MY' AND (d.latitude < 1 OR d.latitude > 7 OR d.longitude < 100 OR d.longitude > 119))
        OR (d.pais_code = 'ID' AND (d.latitude < -11 OR d.latitude > 6 OR d.longitude < 95 OR d.longitude > 141))
        OR (d.pais_code = 'PH' AND (d.latitude < 4 OR d.latitude > 21 OR d.longitude < 116 OR d.longitude > 127))
        OR (d.pais_code = 'TH' AND (d.latitude < 5 OR d.latitude > 21 OR d.longitude < 97 OR d.longitude > 106))
        OR (d.pais_code = 'IT' AND (d.latitude < 36 OR d.latitude > 47 OR d.longitude < 6 OR d.longitude > 19))
        OR (d.pais_code = 'ES' AND (d.latitude < 35 OR d.latitude > 44 OR d.longitude < -10 OR d.longitude > 4))
        OR (d.pais_code = 'FR' AND (d.latitude < 41 OR d.latitude > 52 OR d.longitude < -5 OR d.longitude > 9))
        OR (d.pais_code = 'CA' AND (d.latitude < 41 OR d.latitude > 84 OR d.longitude < -142 OR d.longitude > -52))
      )
    ORDER BY d.id
  `;
  console.log(`Dests outside country bbox: ${badCoordDests.length}`);

  let fixed = 0;
  for (const d of badCoordDests.slice(0, 100)) {
    const c = findBestCity(d.nome, d.pais_code);
    if (c) {
      await p.$executeRaw`UPDATE wv_destinations SET latitude = ${c.lat}, longitude = ${c.lon} WHERE id = ${d.id}`;
      console.log(`  "${d.nome.slice(0,40).padEnd(42)}" ${d.pais_code} (${d.dlat},${d.dlon}) → geonames (${c.lat},${c.lon})`);
      fixed++;
    }
  }
  console.log(`Fixed: ${fixed}`);

  // ===== C: Check & fix 1dp hotel coords =====
  console.log('\n═══ C. CHECK 1DP HOTEL COORDS ═══');
  const oneDp = await p.$queryRaw`
    SELECT COUNT(*)::int as cnt, MIN(latitude) as min_lat, MAX(latitude) as max_lat, fonte
    FROM wv_hotels
    WHERE latitude IS NOT NULL AND ABS(latitude - ROUND(latitude::numeric, 1)::float8) < 0.0001
    GROUP BY fonte ORDER BY cnt DESC
  `;
  console.log('1dp hotels by source:');
  for (const r of oneDp) {
    console.log(`  ${r.fonte?.padEnd(30)} ${r.cnt}  (lat range: ${r.min_lat?.toFixed(2)} to ${r.max_lat?.toFixed(2)})`);
  }

  // ===== D: Geocode hotels without coords =====
  console.log('\n═══ D. GEOCODING HOTELS WITHOUT COORDS ═══');
  const hotelNoCoord = await p.$queryRaw`
    SELECT h.fonte, COUNT(*)::int AS cnt
    FROM wv_hotels h
    WHERE h.latitude IS NULL
    GROUP BY h.fonte ORDER BY cnt DESC
  `;
  console.log('Hotels without coords by source:');
  for (const r of hotelNoCoord) {
    console.log(`  ${r.fonte?.padEnd(30)} ${r.cnt.toLocaleString()}`);
  }

  // Simple geo_from_dest for hotels that have dest coords
  const simpleGeo = await p.$executeRaw`
    UPDATE wv_hotels SET
      latitude = d.latitude,
      longitude = d.longitude,
      fonte = CASE WHEN h.fonte = 'geo_not_found' OR h.fonte IS NULL THEN 'geo_from_dest' ELSE h.fonte || '+geo_from_dest' END
    FROM wv_destinations d
    WHERE h.destino_id = d.id
      AND h.latitude IS NULL
      AND d.latitude IS NOT NULL
      AND d.pais_code != 'XX'
      AND (h.fonte IS NULL OR h.fonte IN ('geo_not_found', 'geo_from_dest'))
  `;
  console.log(`  Simple dest→hotel fill: ${simpleGeo.count || simpleGeo} rows`);

  // Final counts
  const f = await p.$queryRaw`
    SELECT COUNT(*)::int AS dests, COUNT(*) FILTER (WHERE latitude IS NOT NULL)::int AS dest_coords,
      COUNT(*) FILTER (WHERE pais_code='XX')::int AS xx,
      COUNT(*) FILTER (WHERE pais_code!='XX' AND latitude IS NULL)::int AS non_xx_nocoord
    FROM wv_destinations
  `;
  const hc = await p.$queryRaw`
    SELECT COUNT(*)::int AS hotels, COUNT(*) FILTER (WHERE latitude IS NOT NULL)::int AS hotel_coords
    FROM wv_hotels
  `;
  console.log(`\n═══════════════════════════════════`);
  console.log(JSON.stringify({ ...f[0], ...hc[0] }));

  await p.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
