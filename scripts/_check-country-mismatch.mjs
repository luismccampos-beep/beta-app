/**
 * Check how many hotels have a country mismatch between
 * their destination's paisCode and what their coordinates actually say.
 * Uses a simple bounding-box heuristic for common countries.
 */
import { PrismaClient } from '@prisma/client';
import { loadProjectEnv } from './lib/load-env.mjs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
loadProjectEnv(ROOT);

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL } },
});

// Sample: check wv_destinations where paisCode looks wrong
// Common sign: destino marked as PT but name/content sounds like Brazil
async function main() {
  // 1. How many wv_destinations are marked PT?
  const ptDests = await prisma.wvDestination.count({ where: { paisCode: 'PT' } });
  const brDests = await prisma.wvDestination.count({ where: { paisCode: 'BR' } });
  const allDests = await prisma.wvDestination.count();

  console.log(`\n=== Destination country distribution ===`);
  console.log(`  Total destinations : ${allDests.toLocaleString()}`);
  console.log(`  Marked PT (Portugal): ${ptDests.toLocaleString()}`);
  console.log(`  Marked BR (Brazil)  : ${brDests.toLocaleString()}`);

  // 2. Sample PT-marked destinations that look Brazilian
  const suspectPT = await prisma.$queryRaw`
    SELECT id, nome, pais, pais_code, latitude, longitude
    FROM wv_destinations
    WHERE pais_code = 'PT'
    AND (
      -- Brazil bounding box: lat -33 to 5, lon -73 to -35
      (latitude IS NOT NULL AND latitude BETWEEN -33 AND 5
       AND longitude IS NOT NULL AND longitude BETWEEN -73 AND -35)
      OR
      -- Names that sound Brazilian
      pais ILIKE '%brasil%' OR pais ILIKE '%brazil%'
    )
    LIMIT 20
  `;

  console.log(`\n=== Destinations marked PT but likely in Brazil (sample) ===`);
  if (suspectPT.length === 0) {
    console.log('  None found by geo/name heuristic.');
  } else {
    suspectPT.forEach(d => {
      console.log(`  [${d.id}] ${d.nome} | pais="${d.pais}" | coords=${d.latitude},${d.longitude}`);
    });
  }

  // 3. Check wv_hotels with fonte = geo_not_found (from geocoding script)
  const notFound = await prisma.wvHotel.count({ where: { fonte: 'geo_not_found' } });
  const geoFound = await prisma.wvHotel.count({ where: { fonte: 'geo_found' } });
  const withCoords = await prisma.wvHotel.count({ where: { latitude: { not: null } } });
  const rejected = await prisma.wvHotel.count({ where: { fonte: 'rejected_geo' } });
  const total = await prisma.wvHotel.count();
  const pending = total - notFound - withCoords;

  console.log(`\n=== Hotel geocoding progress ===`);
  console.log(`  Total hotels       : ${total.toLocaleString()}`);
  console.log(`  With coordinates   : ${withCoords.toLocaleString()}`);
  console.log(`  Marked geo_found   : ${geoFound.toLocaleString()}`);
  console.log(`  Marked not_found   : ${notFound.toLocaleString()}`);
  console.log(`  Rejected (bad geo) : ${rejected.toLocaleString()}`);
  console.log(`  Pending (untried)  : ${pending.toLocaleString()}`);

  // 4. Top countries with hotels
  const topCountries = await prisma.$queryRaw`
    SELECT d.pais_code, d.pais, COUNT(h.id)::int AS hotel_count
    FROM wv_hotels h
    JOIN wv_destinations d ON d.id = h.destino_id
    GROUP BY d.pais_code, d.pais
    ORDER BY hotel_count DESC
    LIMIT 15
  `;

  console.log(`\n=== Top 15 countries by hotel count ===`);
  console.table(topCountries);
}

main()
  .catch(e => { console.error(e.message); process.exit(1); })
  .finally(() => prisma.$disconnect());
