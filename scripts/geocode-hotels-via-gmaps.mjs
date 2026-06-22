/**
 * Geocode hotels via Google Maps Scraper API (Docker local).
 *
 * Em vez de geocodificar hotel a hotel (muito lento), este script:
 * 1. Agrupa hotéis sem coordenadas por destino
 * 2. Raspa o Google Maps para cada destino (busca "hotéis em {destino}")
 * 3. Faz fuzzy match por nome para cada hotel do grupo
 * 4. Atualiza as coordenadas na BD
 *
 * Uso:
 *   node scripts/geocode-hotels-via-gmaps.mjs                 # correr normal
 *   node scripts/geocode-hotels-via-gmaps.mjs --dry-run        # só simular
 *   node scripts/geocode-hotels-via-gmaps.mjs --limit=10       # só 10 destinos
 *   node scripts/geocode-hotels-via-gmaps.mjs --country=PT     # só Portugal
 *   node scripts/geocode-hotels-via-gmaps.mjs --threshold=0.5  # match mais permissivo
 */

import { PrismaClient } from '@prisma/client';
import { loadProjectEnv } from './lib/load-env.mjs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
loadProjectEnv(ROOT);

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL } },
});

const GMAPS_API = process.env.GMAPS_SCRAPER_URL || 'http://localhost:8001';

// --- CLI args ---
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const LIMIT_DESTINOS = args.find((a) => a.startsWith('--limit='))?.split('=')[1]
  ? parseInt(args.find((a) => a.startsWith('--limit=')).split('=')[1], 10)
  : 0;
const COUNTRY = args.find((a) => a.startsWith('--country='))?.split('=')[1] || '';
const THRESHOLD = args.find((a) => a.startsWith('--threshold='))?.split('=')[1]
  ? parseFloat(args.find((a) => a.startsWith('--threshold=')).split('=')[1])
  : 0.6;

// --- Dice coefficient for fuzzy name matching ---
function bigramSimilarity(a, b) {
  if (!a || !b) return 0;
  const aL = a.toLowerCase().trim();
  const bL = b.toLowerCase().trim();
  if (aL === bL) return 1.0;
  if (aL.includes(bL) || bL.includes(aL)) return 0.9;
  const bgA = new Set();
  for (let i = 0; i < aL.length - 1; i++) bgA.add(aL.substring(i, i + 2));
  const bgB = new Set();
  for (let i = 0; i < bL.length - 1; i++) bgB.add(bL.substring(i, i + 2));
  if (bgA.size === 0 || bgB.size === 0) return 0;
  let intersection = 0;
  for (const bg of bgA) if (bgB.has(bg)) intersection++;
  return (2 * intersection) / (bgA.size + bgB.size);
}

// --- Fetch pending hotels grouped by destination ---
async function fetchPendingDestinos() {
  const whereCountry = COUNTRY ? { paisCode: COUNTRY } : {};
  const whereClause = {
    latitude: null,
    longitude: null,
    OR: [
      { fonte: null },
      { fonte: { notIn: ['rejected_geo', 'geo_not_found'] } },
    ],
    destino: whereCountry,
  };

  const hotels = await prisma.wvHotel.findMany({
    where: whereClause,
    select: {
      id: true,
      nome: true,
      destinoId: true,
      destino: { select: { id: true, nome: true, pais: true, paisCode: true } },
    },
    orderBy: { destinoId: 'asc' },
  });

  // Group by destino_id
  const groups = new Map();
  for (const h of hotels) {
    const did = h.destinoId || h.destino?.id;
    if (!groups.has(did)) {
      groups.set(did, {
        destino_id: did,
        nome: h.destino.nome,
        pais: h.destino.pais,
        paisCode: h.destino.paisCode,
        hotels: [],
      });
    }
    groups.get(did).hotels.push({ id: h.id, nome: h.nome });
  }

  let destinos = Array.from(groups.values());

  // Sort by most hotels first (maximize efficiency)
  destinos.sort((a, b) => b.hotels.length - a.hotels.length);

  if (LIMIT_DESTINOS > 0) {
    destinos = destinos.slice(0, LIMIT_DESTINOS);
  }

  return destinos;
}

// --- Call Google Maps Scraper API ---
async function scrapeDestino(destName) {
  const query = encodeURIComponent(`hoteis em ${destName}`);
  const url = `${GMAPS_API}/scrape-get?query=${query}&max_places=20&lang=pt&headless=true&concurrency=1`;

  try {
    const resp = await fetch(url, {
      headers: { 'User-Agent': 'beta-app-hotel-geocoder/1.0' },
      signal: AbortSignal.timeout(180_000), // 3 min timeout
    });
    if (!resp.ok) {
      console.error(`    [GMaps] API error: ${resp.status}`);
      return [];
    }
    const data = await resp.json();
    if (!Array.isArray(data)) return [];
    return data.filter((d) => d.coordinates?.latitude && d.coordinates?.longitude);
  } catch (err) {
    console.error(`    [GMaps] error: ${err.message}`);
    return [];
  }
}

// --- Match hotels by name similarity ---
function matchHotels(dbHotels, scrapedItems, threshold) {
  const matches = [];
  const used = new Set(); // scraped items already matched

  // Sort DB hotels by name length descending (more specific names first)
  const sorted = [...dbHotels].sort((a, b) => b.nome.length - a.nome.length);

  for (const dbHotel of sorted) {
    let best = null;
    let bestScore = 0;

    for (let i = 0; i < scrapedItems.length; i++) {
      if (used.has(i)) continue;
      const item = scrapedItems[i];
      const score = bigramSimilarity(dbHotel.nome, item.name);
      if (score > bestScore) {
        bestScore = score;
        best = i;
      }
    }

    if (best !== null && bestScore >= threshold) {
      const item = scrapedItems[best];
      matches.push({
        hotel_id: dbHotel.id,
        hotel_nome: dbHotel.nome,
        api_nome: item.name,
        latitude: item.coordinates.latitude,
        longitude: item.coordinates.longitude,
        score: bestScore,
      });
      used.add(best);
    }
  }

  return matches;
}

// --- Mark unmatched hotels ---
async function markNotFound(hotels) {
  if (hotels.length === 0) return;
  const ids = hotels.map((h) => h.id).join(',');
  // Use raw SQL to avoid Prisma schema drift (e.g., categorias column not yet migrated)
  await prisma.$executeRawUnsafe(`
    UPDATE wv_hotels SET fonte = 'gmaps_not_found' WHERE id IN (${ids})
  `);
}

// --- Update DB ---
async function saveMatches(matches) {
  let updated = 0;
  for (let i = 0; i < matches.length; i += 50) {
    const batch = matches.slice(i, i + 50);
    // Use raw SQL to avoid Prisma schema drift
    const cases = batch.map((m) =>
      `(${m.hotel_id}::int, ${m.latitude}::real, ${m.longitude}::real)`
    ).join(',\n');
    await prisma.$executeRawUnsafe(`
      UPDATE wv_hotels AS h
      SET latitude = v.lat,
          longitude = v.lon,
          fonte = 'gmaps_scraper'
      FROM (VALUES ${cases}) AS v(id, lat, lon)
      WHERE h.id = v.id
    `);
    updated += batch.length;
    if (updated % 50 === 0 || updated === matches.length) {
      console.log(`  -> saved ${updated}/${matches.length}`);
    }
  }
  return updated;
}

// --- Main ---
async function main() {
  console.log('=== Google Maps Scraper Hotel Geocoding ===');
  console.log(`  GMAPS_API : ${GMAPS_API}`);
  console.log(`  dry-run   : ${DRY_RUN}`);
  console.log(`  threshold : ${THRESHOLD}`);
  console.log(`  limit     : ${LIMIT_DESTINOS > 0 ? LIMIT_DESTINOS : 'ALL'}`);
  console.log(`  country   : ${COUNTRY || 'ALL'}`);
  console.log();

  const destinos = await fetchPendingDestinos();
  const totalDestinos = destinos.length;
  const totalHotels = destinos.reduce((s, d) => s + d.hotels.length, 0);
  console.log(`Pending destinos: ${totalDestinos} (${totalHotels} hotels)`);
  console.log();

  let totalFound = 0;
  let totalSkipped = 0;

  for (let i = 0; i < destinos.length; i++) {
    const d = destinos[i];
    console.log(`[${i + 1}/${totalDestinos}] ${d.nome}, ${d.pais} (${d.paisCode}) — ${d.hotels.length} hotéis`);

    // Call Google Maps Scraper API
    const scraped = await scrapeDestino(d.nome);
    if (scraped.length === 0) {
      console.log(`    -> No results from GMaps`);
      // Mark all hotels as not found so we skip them next time
      if (!DRY_RUN) {
        await markNotFound(d.hotels);
      }
      totalSkipped += d.hotels.length;
      continue;
    }
    console.log(`    -> ${scraped.length} hotels found on Google Maps`);

    // Match by name
    const matches = matchHotels(d.hotels, scraped, THRESHOLD);
    if (matches.length === 0) {
      console.log(`    -> No matches (threshold=${THRESHOLD})`);
      // Mark all hotels as not found so we skip them next time
      if (!DRY_RUN) {
        await markNotFound(d.hotels);
      }
      totalSkipped += d.hotels.length;
      continue;
    }

    console.log(`    -> ${matches.length} matched:`);
    for (const m of matches.slice(0, 5)) {
      console.log(`       ✓ ${m.hotel_nome} ≈ "${m.api_nome}" (${(m.score * 100).toFixed(0)}%)`);
    }
    if (matches.length > 5) {
      console.log(`       ... and ${matches.length - 5} more`);
    }

    // Save to DB
    if (!DRY_RUN) {
      const saved = await saveMatches(matches);
      totalFound += saved;
      console.log(`    -> saved ${saved} to DB`);
    } else {
      totalFound += matches.length;
      console.log(`    -> would save ${matches.length} (dry-run)`);
    }

    // Mark unmatched hotels in this destino (so they won't be reprocessed)
    const matchedIds = new Set(matches.map((m) => m.hotel_id));
    const unmatched = d.hotels.filter((h) => !matchedIds.has(h.id));
    if (unmatched.length > 0) {
      if (!DRY_RUN) {
        await markNotFound(unmatched);
      }
      console.log(`    -> marked ${unmatched.length} unmatched as gmaps_not_found`);
      totalSkipped += unmatched.length;
    }

    // Small delay between destinations
    if (i < destinos.length - 1) {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  console.log(`\n=== Done ===`);
  console.log(`  Destinos processed: ${totalDestinos}`);
  console.log(`  Hotels found      : ${totalFound}`);
  console.log(`  Hotels skipped    : ${totalSkipped}`);
  if (DRY_RUN) {
    console.log(`  (dry-run - nothing written to DB)`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
