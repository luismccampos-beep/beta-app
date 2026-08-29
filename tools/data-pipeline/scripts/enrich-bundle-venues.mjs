/**
 * Enriches bundle-wikivoyage.json with restaurant/venue data from unified_venues.parquet.
 *
 *   npm run travel:demo:enrich-venues
 *   npm run travel:demo:enrich-venues -- --top-n 10 --radius-km 15
 *
 * Adds a `venues` array to each destination with nearby restaurants,
 * ranked by rating + review_count.
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const BUNDLE = resolve(ROOT, 'tools/data-pipeline/src/data/travel-mock/bundle-wikivoyage.json');
const VENUES_PARQUET = resolve(ROOT, 'Database/restaurants/unified_venues/unified_venues.parquet');
const OUT_BUNDLE = BUNDLE; // overwrite in place

// ── CLI flags ──
const topNArg = process.argv.find((a) => a.startsWith('--top-n'));
const TOP_N = topNArg
  ? parseInt(topNArg.split('=')[1] ?? process.argv[process.argv.indexOf('--top-n') + 1], 10)
  : 10;

const radiusArg = process.argv.find((a) => a.startsWith('--radius-km'));
const RADIUS_KM = radiusArg
  ? parseFloat(radiusArg.split('=')[1] ?? process.argv[process.argv.indexOf('--radius-km') + 1])
  : 10;

// ── Haversine ──
function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ── Load venues via Python (most reliable) ──
function loadVenues() {
  if (!existsSync(VENUES_PARQUET)) {
    console.error(`Venues parquet not found: ${VENUES_PARQUET}`);
    process.exit(1);
  }

  const pyScript = `
import duckdb, csv, sys
con = duckdb.connect()
rows = con.execute("""
    SELECT venue_id, source, name, address, city, country,
           latitude, longitude, cuisine, price_range, rating,
           review_count, award, phone, website, url
    FROM read_parquet('${VENUES_PARQUET.replace(/\\/g, '/').replace(/'/g, "''")}')
    WHERE latitude IS NOT NULL AND longitude IS NOT NULL
""").fetchall()
cols = ['venue_id','source','name','address','city','country','latitude','longitude','cuisine','price_range','rating','review_count','award','phone','website','url']
w = csv.writer(sys.stdout)
w.writerow(cols)
for r in rows:
    w.writerow([str(x) if x is not None else '' for x in r])
`;
  const pyTmp = resolve(ROOT, 'tools/data-pipeline/.tmp_venues_export.py');
  writeFileSync(pyTmp, pyScript);

  const out = execSync(`python -X utf8 "${pyTmp}"`, { encoding: 'utf-8', maxBuffer: 50 * 1024 * 1024 });
  try { require('node:fs').unlinkSync(pyTmp); } catch {}

  const lines = out.trim().split('\n');
  const header = lines[0].split(',');
  const venues = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = [];
    let field = '';
    let inQuote = false;
    for (const ch of lines[i]) {
      if (ch === '"') { inQuote = !inQuote; continue; }
      if (ch === ',' && !inQuote) { cols.push(field); field = ''; continue; }
      field += ch;
    }
    cols.push(field);

    const obj = {};
    header.forEach((h, idx) => { obj[h] = cols[idx] || ''; });
    obj.latitude = parseFloat(obj.latitude);
    obj.longitude = parseFloat(obj.longitude);
    obj.price_range = obj.price_range ? parseInt(obj.price_range) : null;
    obj.rating = parseFloat(obj.rating) || 0;
    obj.review_count = parseInt(obj.review_count) || 0;
    if (!isNaN(obj.latitude) && !isNaN(obj.longitude)) venues.push(obj);
  }

  return venues;
}

// ── Match venues to a destination ──
function matchVenues(dest, venues) {
  if (dest.latitude == null || dest.longitude == null) return [];

  const matches = [];
  for (const v of venues) {
    // Quick bounding box pre-filter
    const dlat = Math.abs(dest.latitude - v.latitude);
    const dlon = Math.abs(dest.longitude - v.longitude);
    if (dlat > RADIUS_KM / 80 + 0.1 || dlon > RADIUS_KM / 80 + 0.1) continue;

    const dist = haversineKm(dest.latitude, dest.longitude, v.latitude, v.longitude);
    if (dist > RADIUS_KM) continue;

    matches.push({ ...v, distance_km: Math.round(dist * 100) / 100 });
  }

  // Rank: review_count * rating (weighted), then take top N
  matches.sort((a, b) => {
    const scoreA = a.rating * 10 + Math.min(a.review_count, 1000) * 0.01;
    const scoreB = b.rating * 10 + Math.min(b.review_count, 1000) * 0.01;
    return scoreB - scoreA;
  });

  return matches.slice(0, TOP_N).map((v) => ({
    venue_id: v.venue_id,
    source: v.source,
    name: v.name,
    cuisine: v.cuisine || null,
    price_range: v.price_range,
    rating: v.rating,
    review_count: v.review_count,
    award: v.award || null,
    distance_km: v.distance_km,
  }));
}

// ── Main ──
function main() {
  console.log(`Loading venues from ${VENUES_PARQUET}...`);
  const venues = loadVenues();
  console.log(`  ${venues.length.toLocaleString()} venues loaded`);

  if (!existsSync(BUNDLE)) {
    console.error(`Bundle not found: ${BUNDLE}`);
    console.error('Run travel:demo:build first');
    process.exit(1);
  }

  console.log(`Reading bundle from ${BUNDLE}...`);
  const bundle = JSON.parse(readFileSync(BUNDLE, 'utf-8'));
  const destinos = bundle.destinos || [];
  console.log(`  ${destinos.length} destinations`);

  let enriched = 0;
  let totalVenues = 0;

  for (const dest of destinos) {
    const matched = matchVenues(dest, venues);
    if (matched.length > 0) {
      dest.venues = matched;
      enriched++;
      totalVenues += matched.length;
    }
  }

  // Update meta counts
  if (bundle.meta) {
    bundle.meta.counts = bundle.meta.counts || {};
    bundle.meta.counts.venues = totalVenues;
    bundle.meta.counts.venues_enriched_destinations = enriched;
  }

  console.log(`\nEnriched ${enriched} destinations with ${totalVenues} venues`);

  // Source distribution
  const bySource = {};
  for (const dest of destinos) {
    for (const v of dest.venues || []) {
      bySource[v.source] = (bySource[v.source] || 0) + 1;
    }
  }
  console.log('By source:', Object.entries(bySource).map(([s, c]) => `${s}: ${c}`).join(', '));

  writeFileSync(OUT_BUNDLE, JSON.stringify(bundle));
  const mb = (Buffer.byteLength(JSON.stringify(bundle)) / 1024 / 1024).toFixed(2);
  console.log(`\nWrote ${OUT_BUNDLE} (${mb} MB)`);
}

main();
