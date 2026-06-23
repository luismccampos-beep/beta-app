import { PrismaClient } from '@prisma/client';
import { loadProjectEnv } from './lib/load-env.mjs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync, writeFileSync } from 'node:fs';
const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
loadProjectEnv(ROOT);
const p = new PrismaClient({datasources:{db:{url:process.env.DATABASE_URL_UNPOOLED??process.env.DATABASE_URL}}});

function normalize(s) {
  return s.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function wordsMatch(a, b) {
  const wa = normalize(a).split(/\s+/).filter(w => w.length > 2);
  const wb = normalize(b).split(/\s+/).filter(w => w.length > 2);
  if (wa.length === 0 || wb.length === 0) return false;
  const common = wa.filter(w => wb.includes(w));
  return common.length >= Math.min(wa.length, wb.length);
}

const csv = readFileSync(resolve(ROOT, 'export_paiscode_mismatches.csv'), 'utf-8');
const lines = csv.trim().split('\n').slice(1);
console.log(`Total CSV entries: ${lines.length}`);

// Parse CSV properly (handle quoted fields)
const entries = [];
for (const line of lines) {
  const parts = line.split(',');
  entries.push({
    id: parseInt(parts[0]),
    nome: parts[1].replace(/^"|"$/g, ''),
    originalPais: parts[2].replace(/^"|"$/g, ''),
    lat: parseFloat(parts[3]),
    lon: parseFloat(parts[4]),
    nearestCity: parts[5].replace(/^"|"$/g, ''),
    nearestCc: parts[6].replace(/^"|"$/g, ''),
    distKm: parseFloat(parts[7]),
  });
}

// Classify each entry
const keep = [];    // real place, correct coord, keep the fix
const setNull = []; // topic/garbage coord, null coord, restore pais
const review = [];  // uncertain

for (const e of entries) {
  const nameMatch = wordsMatch(e.nome, e.nearestCity);
  
  // Dest name matches nearest city → real place with correct coord
  if (nameMatch) {
    keep.push(e);
    continue;
  }
  
  // Check if it's a topic-like name (country name, region, activity, etc.)
  // Heuristic: if name is a simple word that doesn't appear in nearest city
  // AND it's in a clearly wrong country, it's likely a topic
  
  // Near Portugal (nearest_cc=PT) but name is clearly not Portuguese
  // → garbage coordinate
  if (e.nearestCc === 'PT') {
    setNull.push(e);
    continue;
  }
  
  // If dist is very small (<2km) but names don't match, it could be:
  // a) Topic with coord in wrong place
  // b) Real place where GeoNames has slightly different name
  // For small dist, names should usually match → likely wrong coord
  if (e.distKm < 2) {
    setNull.push(e);
    continue;
  }
  
  // Remaining: dist >= 2km, not in Portugal, no name match
  // These could be real places with coords in the right country but wrong city
  review.push(e);
}

console.log(`\n=== RESULTS ===`);
console.log(`KEEP (correct fix):   ${keep.length}`);
console.log(`NULL (bad coord):     ${setNull.length}`);
console.log(`REVIEW (uncertain):   ${review.length}`);

// Apply NULL fixes
console.log(`\n=== APPLYING NULL FIXES ===`);
let nullApplied = 0;
for (const e of setNull) {
  await p.$executeRaw`UPDATE wv_destinations SET latitude=NULL, longitude=NULL, pais_code=${e.originalPais}, pais=${e.originalPais} WHERE id=${e.id}`;
  nullApplied++;
  if (nullApplied % 100 === 0) console.log(`  ${nullApplied}/${setNull.length}`);
}
console.log(`NULL fixes applied: ${nullApplied}`);

// Export review list
const csvLines = ['id,nome,originalPais,currentPais,lat,lon,nearestCity,nearestCc,distKm'];
for (const e of review) {
  const row = await p.wvDestination.findUnique({ where: { id: e.id }, select: { paisCode: true } });
  csvLines.push(`${e.id},"${e.nome}",${e.originalPais},${row?.paisCode||'?'},${e.lat},${e.lon},"${e.nearestCity}",${e.nearestCc},${e.distKm}`);
}
writeFileSync(resolve(ROOT, 'export_hybrid_review.csv'), csvLines.join('\n'), 'utf-8');
console.log(`\nReview list exported: export_hybrid_review.csv (${review.length} entries)`);

// Final summary
const [d] = await p.$queryRaw`SELECT COUNT(*)::int AS t, COUNT(*) FILTER (WHERE pais_code!='XX' AND latitude IS NOT NULL)::int AS ok, COUNT(*) FILTER (WHERE pais_code!='XX' AND latitude IS NULL)::int AS no FROM wv_destinations`;
const [h] = await p.$queryRaw`SELECT COUNT(*)::int AS t, COUNT(*) FILTER (WHERE latitude IS NOT NULL)::int AS ok FROM wv_hotels`;
console.log(`\n═══ FINAL ═══`);
console.log(`Dests:  ${d.t} total, ${d.ok} non-XX ok (${(d.ok/(d.t-d.no)*100).toFixed(1)}%), ${d.no} missing`);
console.log(`Hotels: ${h.t} total, ${h.ok} with coords (${(h.ok/h.t*100).toFixed(1)}%)`);

await p.$disconnect();
