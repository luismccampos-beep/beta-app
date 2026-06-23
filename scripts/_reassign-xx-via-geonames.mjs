import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PrismaClient } from '@prisma/client';
import { loadProjectEnv } from './lib/load-env.mjs';
import { COUNTRY_NAMES } from './lib/country-names.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
loadProjectEnv(resolve(__dirname, '..'));

const p = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL } },
});

// Load GeoNames cities
const cities = JSON.parse(readFileSync(resolve(__dirname, '..', 'data/geonames-cache/cities5000-cities.json'), 'utf8'));
console.log(`GeoNames cities loaded: ${cities.length.toLocaleString()}`);

// Build grid index (1° cells)
const GRID = 1;
const grid = new Map();
for (const c of cities) {
  const cx = Math.floor(c.lon / GRID);
  const cy = Math.floor(c.lat / GRID);
  const key = `${cx},${cy}`;
  if (!grid.has(key)) grid.set(key, []);
  grid.get(key).push(c);
}
console.log(`Grid cells: ${grid.size}`);

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function findNearestCountry(lat, lon, maxKm = 200) {
  const cx = Math.floor(lon / GRID);
  const cy = Math.floor(lat / GRID);
  let best = { dist: Infinity, cc: null };

  // Check 3x3 grid cells around the point
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      const key = `${cx+dx},${cy+dy}`;
      const cell = grid.get(key);
      if (!cell) continue;
      for (const city of cell) {
        const d = haversineKm(lat, lon, city.lat, city.lon);
        if (d < best.dist) {
          best = { dist: d, cc: city.countryCode, name: city.name };
        }
      }
    }
  }

  if (best.dist < maxKm) return best;
  return null;
}

async function main() {
  // Get XX destinations with coords
  const xxDests = await p.$queryRaw`
    SELECT d.id, d.nome, d.latitude, d.longitude,
      COUNT(h.id)::int AS hotel_count
    FROM wv_destinations d
    LEFT JOIN wv_hotels h ON h.destino_id = d.id
    WHERE d.pais_code = 'XX' AND d.latitude IS NOT NULL
    GROUP BY d.id, d.nome, d.latitude, d.longitude
    ORDER BY hotel_count DESC
  `;

  console.log(`XX destinations with coords: ${xxDests.length.toLocaleString()}\n`);

  let assigned = 0;
  let skipped = 0;
  const updates = [];

  for (const dest of xxDests) {
    const nearest = findNearestCountry(dest.latitude, dest.longitude);
    if (nearest && nearest.cc !== 'XX') {
      const pais = COUNTRY_NAMES[nearest.cc] || nearest.cc;
      updates.push({ id: dest.id, cc: nearest.cc, pais, dist: nearest.dist, near: nearest.name });
      assigned++;
    } else {
      skipped++;
    }

    if (assigned % 500 === 0 && assigned > 0) {
      console.log(`  [${assigned}] assigned…`);
    }
  }

  console.log(`\n═══ Results ═══`);
  console.log(`Total processed: ${xxDests.length}`);
  console.log(`Assigned: ${assigned}`);
  console.log(`Skipped (no nearby city): ${skipped}`);

  // Show samples
  const samples = updates.slice(0, 20);
  console.log(`\nSample assignments:`);
  for (const s of samples) {
    console.log(`  id=${s.id} → ${s.cc} (${s.pais}) dist=${s.dist.toFixed(0)}km near="${s.near}"`);
  }

  // Apply updates
  console.log(`\nApplying ${updates.length} updates…`);
  const BATCH = 200;
  for (let i = 0; i < updates.length; i += BATCH) {
    const batch = updates.slice(i, i + BATCH);
    const ids = batch.map(u => u.id).join(',');
    const ccCases = batch.map(u => `WHEN id = ${u.id} THEN '${u.cc}'`).join(' ');
    const paisCases = batch.map(u => `WHEN id = ${u.id} THEN '${u.pais.replace(/'/g, "''")}'`).join(' ');

    await p.$executeRawUnsafe(`
      UPDATE wv_destinations
      SET pais_code = CASE ${ccCases} ELSE pais_code END,
          pais = CASE ${paisCases} ELSE pais END
      WHERE id IN (${ids})
    `);
    console.log(`  batch ${Math.floor(i / BATCH) + 1}/${Math.ceil(updates.length / BATCH)}`);
  }

  // Update hotel_counts
  await p.$executeRawUnsafe(`
    UPDATE wv_destinations d
    SET hotel_count = sub.c
    FROM (SELECT destino_id, COUNT(*)::int AS c FROM wv_hotels GROUP BY 1) sub
    WHERE d.id = sub.destino_id
  `);

  console.log(`\n✅ Done. ${assigned} XX destinations assigned to countries.`);
  await p.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
