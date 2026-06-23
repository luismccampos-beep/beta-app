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

// Load GeoNames cities
const cities = JSON.parse(readFileSync(resolve(ROOT, 'data/geonames-cache/cities5000-cities.json'), 'utf8'));
console.log(`GeoNames cities: ${cities.length.toLocaleString()}`);

// Build name indexes (asciiName -> city, and name -> city lowercase)
const nameIndex = new Map();
const asciiIndex = new Map();
const altIndex = new Map();

function fold(s) {
  return String(s ?? '').normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().trim().replace(/[^a-z0-9\-' ]+/g, ' ');
}

for (const c of cities) {
  const key = fold(c.name);
  if (!nameIndex.has(key)) nameIndex.set(key, []);
  nameIndex.get(key).push(c);

  const akey = fold(c.asciiName);
  if (akey !== key) {
    if (!asciiIndex.has(akey)) asciiIndex.set(akey, []);
    asciiIndex.get(akey).push(c);
  }

  for (const alt of c.alternatenames || []) {
    const altKey = fold(alt);
    if (altKey !== key && altKey !== akey && altKey.length > 3) {
      if (!altIndex.has(altKey)) altIndex.set(altKey, []);
      altIndex.get(altKey).push(c);
    }
  }
}

console.log(`Name index: ${nameIndex.size}, ASCII index: ${asciiIndex.size}, Alt index: ${altIndex.size}`);

function findCity(name, paisCode) {
  const f = fold(name);
  // Try exact name match
  let matches = nameIndex.get(f) || asciiIndex.get(f) || altIndex.get(f);
  if (!matches) {
    // Try removing parenthetical
    const withoutParen = f.replace(/\s*\(.*?\)\s*/g, ' ').trim();
    if (withoutParen !== f) matches = nameIndex.get(withoutParen) || asciiIndex.get(withoutParen);
  }
  if (!matches) return null;

  // Prefer match in same country first
  if (paisCode) {
    const sameCountry = matches.filter(m => m.countryCode === paisCode);
    if (sameCountry.length > 0) return sameCountry[0];
  }
  // Prefer populated places
  const populated = matches.filter(m => m.featureCode?.startsWith('PPL'));
  if (populated.length > 0) return populated[0];

  return matches[0];
}

async function main() {
  // ===== A. Fix non-XX dests without coords (473) =====
  console.log('\n═══ A. GEOCODING NON-XX DESTS WITHOUT COORDS ═══');
  const noCoord = await p.$queryRaw`
    SELECT d.id, d.nome, d.pais_code, d.pais FROM wv_destinations d
    WHERE d.pais_code != 'XX' AND d.latitude IS NULL
    ORDER BY d.id
  `;
  console.log(`Total: ${noCoord.length}`);

  let found = 0;
  let paisFixed = 0;
  const destUpdates = [];

  for (const d of noCoord) {
    const c = findCity(d.nome, d.pais_code);
    if (c) {
      destUpdates.push({
        id: d.id,
        lat: c.lat,
        lon: c.lon,
        cc: c.countryCode,
        pais: c.countryCode,
        oldCc: d.pais_code,
      });
      found++;
      if (c.countryCode !== d.pais_code) paisFixed++;
    }
    if (destUpdates.length % 100 === 0 && destUpdates.length > 0) {
      console.log(`  [${destUpdates.length}] matched…`);
    }
  }
  console.log(`Matched in GeoNames: ${found}/${noCoord.length} (${paisFixed} with different country)`);

  // Apply updates
  if (destUpdates.length > 0) {
    const BATCH = 200;
    for (let i = 0; i < destUpdates.length; i += BATCH) {
      const batch = destUpdates.slice(i, i + BATCH);
      const ids = batch.map(u => u.id).join(',');
      const ccCases = batch.map(u => `WHEN id = ${u.id} THEN '${u.cc}'`).join(' ');
      const latCases = batch.map(u => `WHEN id = ${u.id} THEN ${u.lat}`).join(' ');
      const lonCases = batch.map(u => `WHEN id = ${u.id} THEN ${u.lon}`).join(' ');

      await p.$executeRawUnsafe(`
        UPDATE wv_destinations
        SET
          latitude = CASE ${latCases} ELSE latitude END,
          longitude = CASE ${lonCases} ELSE longitude END,
          pais_code = CASE ${ccCases} ELSE pais_code END,
          pais = CASE ${ccCases} ELSE pais END
        WHERE id IN (${ids})
      `);
    }
    console.log(`  Updated ${destUpdates.length} destinations`);
  }

  // ===== B. Fix dests with wrong coords (>10° from hotel centroids) =====
  console.log('\n═══ B. FIXING DESTS WITH WRONG COORDS ═══');
  const wrongCoords = await p.$queryRaw`
    SELECT d.id, d.nome, d.pais_code, d.latitude AS dlat, d.longitude AS dlon,
      AVG(h.latitude)::numeric(10,5) AS hlat,
      AVG(h.longitude)::numeric(10,5) AS hlon,
      COUNT(*)::int AS hotel_cnt
    FROM wv_destinations d
    JOIN wv_hotels h ON h.destino_id = d.id
    WHERE d.latitude IS NOT NULL AND h.latitude IS NOT NULL
      AND d.pais_code NOT IN ('XX')
      AND (ABS(h.latitude - d.latitude) > 5 OR ABS(h.longitude - d.longitude) > 5)
    GROUP BY d.id, d.nome, d.pais_code, d.latitude, d.longitude
    HAVING COUNT(*) >= 3
    ORDER BY (ABS(AVG(h.latitude) - d.latitude) + ABS(AVG(h.longitude) - d.longitude)) DESC
  `;
  console.log(`Dests with hotel centroid >5° away: ${wrongCoords.length}`);
  let destCoordFixes = 0;

  for (const w of wrongCoords.slice(0, 50)) {
    const c = findCity(w.nome, w.pais_code);
    if (c) {
      console.log(`  "${w.nome}" (${w.pais_code}) dest=${w.dlat},${w.dlon} hotels_avg=${w.hlat},${w.hlon} → geonames=${c.lat},${c.lon}`);
      await p.$executeRaw`UPDATE wv_destinations SET latitude = ${c.lat}, longitude = ${c.lon} WHERE id = ${w.id}`;
      destCoordFixes++;
    } else {
      // Try hotel centroid if geonames doesn't have it
      console.log(`  "${w.nome}" (${w.pais_code}) dest=${w.dlat},${w.dlon} hotels_avg=${w.hlat},${w.hlon} → using hotel centroid`);
      await p.$executeRaw`UPDATE wv_destinations SET latitude = ${w.hlat}, longitude = ${w.hlon} WHERE id = ${w.id}`;
      destCoordFixes++;
    }
  }
  console.log(`Fixed ${destCoordFixes} dest coords`);

  // ===== C. Fix suspiciously rounded hotel coords =====
  console.log('\n═══ C. FIXING SUSPICIOUSLY ROUNDED HOTEL COORDS ═══');
  const roundedHotels = await p.$queryRaw`
    SELECT h.id, h.nome, h.latitude, h.longitude, h.fonte, h.destino_id
    FROM wv_hotels h
    WHERE h.latitude IS NOT NULL
      AND ABS(h.latitude - ROUND(h.latitude::numeric, 1)::float8) < 0.0001
      AND h.fonte IN ('geo_found')
    ORDER BY h.id
    LIMIT 50
  `;
  console.log(`1dp-precision hotels (fonte=geo_found): ${roundedHotels.length} checked`);

  let hotelFixes = 0;
  for (const h of roundedHotels) {
    // Look up dest to get approximate location
    const dest = await p.wvDestination.findUnique({ where: { id: h.destino_id }, select: { nome: true, latitude: true, longitude: true } });
    if (dest && dest.latitude) {
      // If hotel coord doesn't match dest at all, try fixing via GeoNames name match
      if (Math.abs(h.latitude - dest.latitude) > 5) {
        const c = findCity(h.nome, null);
        if (c && Math.abs(c.lat - dest.latitude) < 5) {
          await p.$executeRaw`UPDATE wv_hotels SET latitude = ${c.lat}, longitude = ${c.lon} WHERE id = ${h.id}`;
          console.log(`  id=${h.id} "${h.nome.slice(0,30)}" ${h.latitude},${h.longitude} → ${c.lat},${c.lon}`);
          hotelFixes++;
        }
      }
    }
  }
  console.log(`Fixed ${hotelFixes} hotel coords`);

  // ===== Final =====
  const final = await p.$queryRaw`
    SELECT COUNT(*)::int AS dests, COUNT(*) FILTER (WHERE latitude IS NOT NULL)::int AS coords,
      COUNT(*) FILTER (WHERE pais_code='XX')::int AS xx,
      COUNT(*) FILTER (WHERE pais_code!='XX' AND latitude IS NULL)::int AS non_xx_nocoord
    FROM wv_destinations
  `;
  const hCount = await p.$queryRaw`SELECT COUNT(*)::int AS h, COUNT(*) FILTER (WHERE latitude IS NOT NULL)::int AS hc FROM wv_hotels`;
  console.log(`\n═══ FINAL ═══`);
  console.log(JSON.stringify({ ...final[0], ...hCount[0] }));

  await p.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
