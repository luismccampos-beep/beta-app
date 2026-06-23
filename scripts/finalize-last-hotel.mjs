import { PrismaClient } from '@prisma/client';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync, existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

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
      console.log('✓ No pending hotels found! All geocoded!');
      return;
    }

    const hotel = hotels[0];
    console.log(`\nLast pending hotel: ${hotel.nome}`);
    console.log(`Location: ${hotel.dest_nome}, ${hotel.pais_code}\n`);
    
    // Try Photon directly
    const query = encodeURIComponent(`${hotel.nome}, ${hotel.dest_nome}`);
    const country = hotel.pais_code || '';
    const url = `https://photon.komoot.io/api/?q=${query}&limit=3${country ? '&country=' + country.toUpperCase() : ''}`;
    
    console.log('Trying Photon geocoding...');
    try {
      const resp = await fetch(url, {
        headers: { 'User-Agent': 'beta-app/1.0' },
        signal: AbortSignal.timeout(10000),
      });
      
      if (resp.ok) {
        const data = await resp.json();
        const features = data?.features || [];
        
        if (features.length > 0) {
          const coords = features[0].geometry.coordinates;
          const lat = coords[1];
          const lon = coords[0];
          
          console.log(`✓ Found via Photon: ${lat}, ${lon}`);
          
          await prisma.$executeRawUnsafe(
            `UPDATE wv_hotels SET latitude = $1::real, longitude = $2::real, fonte = 'geo_found' WHERE id = $3::int`,
            lat, lon, hotel.id
          );
          console.log('✓ Hotel updated!\n');
        } else {
          console.log('✗ Photon returned no results');
          console.log('Marking as geo_not_found...\n');
          
          await prisma.$executeRawUnsafe(
            `UPDATE wv_hotels SET fonte = 'geo_not_found' WHERE id = $1::int`,
            hotel.id
          );
          console.log('Marked as geo_not_found\n');
        }
      } else {
        console.log(`✗ Photon returned status ${resp.status}`);
        console.log('Marking as geo_not_found...\n');
        
        await prisma.$executeRawUnsafe(
          `UPDATE wv_hotels SET fonte = 'geo_not_found' WHERE id = $1::int`,
          hotel.id
        );
        console.log('Marked as geo_not_found\n');
      }
    } catch (err) {
      console.log(`✗ Photon error: ${err.message}`);
      console.log('Marking as geo_not_found...\n');
      
      await prisma.$executeRawUnsafe(
        `UPDATE wv_hotels SET fonte = 'geo_not_found' WHERE id = $1::int`,
        hotel.id
      );
      console.log('Marked as geo_not_found\n');
    }

    // Final status
    const remaining = await prisma.$queryRawUnsafe(`
      SELECT COUNT(*)::int AS total FROM wv_hotels 
      WHERE latitude IS NULL AND longitude IS NULL 
        AND (fonte IS NULL OR fonte NOT IN ('rejected_geo','geo_not_found'))
    `);
    
    const total = await prisma.wvHotel.count();
    const withCoords = await prisma.wvHotel.count({
      where: { latitude: { not: null }, longitude: { not: null } }
    });
    
    console.log('=== FINAL STATUS ===');
    console.log(`Total hotels: ${total.toLocaleString()}`);
    console.log(`With coordinates: ${withCoords.toLocaleString()} (${(withCoords/total*100).toFixed(2)}%)`);
    console.log(`Remaining pending: ${remaining[0].total}`);
    
    if (remaining[0].total === 0) {
      console.log('\n🎉 ALL HOTELS GEOCODED! 🎉');
    }

  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => { console.error('Fatal:', err); process.exit(1); });