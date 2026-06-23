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
    // Find destinations with pending hotels that have no coords
    const dests = await prisma.$queryRawUnsafe(`
      SELECT DISTINCT d.id, d.nome, d.pais_code
      FROM wv_destinations d
      JOIN wv_hotels h ON h.destino_id = d.id
      WHERE d.latitude IS NULL AND d.longitude IS NULL
        AND h.latitude IS NULL AND h.longitude IS NULL
        AND (h.fonte IS NULL OR h.fonte NOT IN ('rejected_geo','geo_not_found'))
        AND d.pais_code != 'XX'
      ORDER BY d.nome
    `);

    console.log(`Destinos com hotéis pendentes sem coords: ${dests.length}\n`);

    for (const d of dests) {
      const query = d.nome;
      console.log(`Geocoding destino: ${query} (${d.pais_code})...`);
      
      const result = await gmapsGeocode(query);
      
      if (result) {
        console.log(`  ✓ Found: ${result.lat}, ${result.lon}`);
        await prisma.$executeRawUnsafe(
          `UPDATE wv_destinations SET latitude = $1::real, longitude = $2::real WHERE id = $3::int`,
          result.lat, result.lon, d.id
        );
        
        // Also copy to hotels
        await prisma.$executeRawUnsafe(`
          UPDATE wv_hotels h
          SET latitude = $1::real, longitude = $2::real, fonte = 'dest_coords'
          WHERE h.destino_id = $3::int
            AND h.latitude IS NULL AND h.longitude IS NULL
            AND (h.fonte IS NULL OR h.fonte NOT IN ('rejected_geo', 'geo_not_found'))
        `, result.lat, result.lon, d.id);
        
        console.log(`  ✓ Updated destination and hotels\n`);
      } else {
        console.log(`  ✗ Not found\n`);
      }
    }

    console.log('Done!');
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => { console.error('Fatal:', err); process.exit(1); });