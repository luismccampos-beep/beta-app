import { PrismaClient } from '@prisma/client';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync, existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const GMAPS_API = 'http://localhost:8001';

function loadEnv() {
  for (const file of ['.env.local', '.env']) {
    const fpath = resolve(ROOT, file);
    if (!existsSync(fpath)) continue;
    for (const line of readFileSync(fpath, 'utf8').split('\n')) {
      const m = line.match(/^\s*([^#=\s]+)\s*=\s*(.+)/);
      if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '');
    }
  }
}

async function gmapsGeocode(query) {
  try {
    const url = `${GMAPS_API}/scrape-get?query=${encodeURIComponent(query)}&max_places=3&headless=true&lang=en`;
    const resp = await fetch(url, { signal: AbortSignal.timeout(180000) });
    if (!resp.ok) return null;
    const results = await resp.json();
    if (!results?.length) return null;
    for (const place of results) {
      if (place.coordinates?.latitude && place.coordinates?.longitude) {
        return { lat: place.coordinates.latitude, lon: place.coordinates.longitude, name: place.name };
      }
    }
    return null;
  } catch {
    return null;
  }
}

async function main() {
  loadEnv();
  const prisma = new PrismaClient({
    datasources: { db: { url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL } },
  });

  try {
    // Get the last pending hotel
    const hotels = await prisma.$queryRawUnsafe(`
      SELECT h.id, h.nome, d.nome as dest_nome, d.pais_code
      FROM wv_hotels h
      JOIN wv_destinations d ON d.id = h.destino_id
      WHERE h.latitude IS NULL AND h.longitude IS NULL
        AND (h.fonte IS NULL OR h.fonte NOT IN ('rejected_geo','geo_not_found'))
      LIMIT 1
    `);

    if (!hotels.length) {
      console.log('No pending hotels found!');
      return;
    }

    const hotel = hotels[0];
    console.log(`Geocoding hotel: ${hotel.nome} in ${hotel.dest_nome}, ${hotel.pais_code}`);
    
    // Try different query strategies
    const queries = [
      `${hotel.nome}, ${hotel.dest_nome}, ${hotel.pais_code}`,
      `${hotel.nome}, ${hotel.dest_nome}`,
      hotel.nome,
    ];

    let result = null;
    for (const query of queries) {
      console.log(`  Trying: ${query}`);
      result = await gmapsGeocode(query);
      if (result) {
        console.log(`  ✓ Found: ${result.lat}, ${result.lon} (${result.name})`);
        break;
      }
    }

    if (result) {
      await prisma.$executeRawUnsafe(
        `UPDATE wv_hotels SET latitude = $1::real, longitude = $2::real, fonte = 'geo_found' WHERE id = $3::int`,
        result.lat, result.lon, hotel.id
      );
      console.log('✓ Hotel updated!\n');
    } else {
      console.log('✗ Not found after all attempts\n');
      await prisma.$executeRawUnsafe(
        `UPDATE wv_hotels SET fonte = 'geo_not_found' WHERE id = $1::int`,
        hotel.id
      );
      console.log('Marked as geo_not_found\n');
    }

    // Check final status
    const remaining = await prisma.$queryRawUnsafe(`
      SELECT COUNT(*)::int AS total FROM wv_hotels 
      WHERE latitude IS NULL AND longitude IS NULL 
        AND (fonte IS NULL OR fonte NOT IN ('rejected_geo','geo_not_found'))
    `);
    console.log(`Remaining pending hotels: ${remaining[0].total}`);

  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => { console.error('Fatal:', err); process.exit(1); });