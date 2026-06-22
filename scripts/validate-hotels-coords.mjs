/**
 * Validate hotel coordinates by comparing external CSV list against database.
 * 
 * Compares coordinates from "hoteis - Folha1.csv" with wv_hotels in database
 * to detect discrepancies (hotels with same name but different coordinates).
 *
 * Usage:
 *   npm run travel:catalog:validate-hotels-coords
 *   npm run travel:catalog:validate-hotels-coords -- --max-distance-km 1
 *   npm run travel:catalog:validate-hotels-coords -- --limit 1000
 */

import { PrismaClient } from '@prisma/client';
import { loadProjectEnv } from './lib/load-env.mjs';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

// Simple CSV parser that handles quoted fields
function parseCsvLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

loadProjectEnv();

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL } },
});

const args = new Set(process.argv.slice(2));
const argValue = (name, fallback) => {
  const idx = process.argv.indexOf(name);
  if (idx !== -1) return process.argv[idx + 1] ?? fallback;
  for (const a of process.argv) {
    if (a.startsWith(`${name}=`)) return a.split('=')[1] ?? fallback;
  }
  return fallback;
};

const maxDistanceKm = parseFloat(argValue('--max-distance-km', '1')) || 1;
const limit = parseInt(argValue('--limit', '0'), 10) || 0;
const verbose = args.has('--verbose');

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(a)));
}

function normalizeName(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function loadExternalCsv() {
  const csvPath = join(process.cwd(), 'data', 'hotels', 'hoteis - Folha1.csv');
  console.log(`📂 Loading external CSV: ${csvPath}`);
  
  const content = readFileSync(csvPath, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim() && !line.startsWith('#'));
  
  const hotels = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    
    // CSV format: #,Nome do Hotel,Morada,Cidade,País,Latitude,Longitude,,
    const parts = parseCsvLine(line);
    if (parts.length < 7) continue;
    
    const id = parts[0]?.trim();
    const nome = parts[1]?.trim();
    const morada = parts[2]?.trim();
    const cidade = parts[3]?.trim();
    const pais = parts[4]?.trim();
    const latitude = parseFloat(parts[5]?.trim());
    const longitude = parseFloat(parts[6]?.trim());
    
    if (!nome || isNaN(latitude) || isNaN(longitude)) continue;
    
    hotels.push({
      id: parseInt(id) || i,
      nome,
      morada,
      cidade,
      pais,
      latitude,
      longitude,
    });
  }
  
  console.log(`✅ Loaded ${hotels.length} hotels from CSV\n`);
  return hotels;
}

async function main() {
  console.log('=== Hotel Coordinate Validation ===\n');
  
  // Load external CSV
  const externalHotels = await loadExternalCsv();
  if (limit > 0 && limit < externalHotels.length) {
    console.log(`⚠️  Limiting to first ${limit} hotels from CSV\n`);
    externalHotels.length = limit;
  }
  
  // Load all database hotels with destination info
  console.log('📂 Loading database hotels...');
  const dbHotels = await prisma.wvHotel.findMany({
    include: {
      destino: {
        select: {
          nome: true,
          pais: true,
          paisCode: true,
        },
      },
    },
    where: {
      latitude: { not: null },
      longitude: { not: null },
    },
  });
  console.log(`✅ Loaded ${dbHotels.length} hotels from database\n`);
  
  // Create lookup by normalized name
  const dbByName = new Map();
  for (const hotel of dbHotels) {
    const key = normalizeName(hotel.nome);
    if (!dbByName.has(key)) {
      dbByName.set(key, []);
    }
    dbByName.get(key).push(hotel);
  }
  
  // Match and compare
  console.log('🔍 Comparing coordinates...\n');
  const discrepancies = [];
  const matches = [];
  const notFound = [];
  
  for (const extHotel of externalHotels) {
    const normalizedKey = normalizeName(extHotel.nome);
    const candidates = dbByName.get(normalizedKey);
    
    if (!candidates || candidates.length === 0) {
      notFound.push(extHotel);
      continue;
    }
    
    // Find closest match by coordinates
    let bestMatch = null;
    let bestDistance = Infinity;
    
    for (const dbHotel of candidates) {
      if (dbHotel.latitude == null || dbHotel.longitude == null) continue;
      
      const distance = haversineKm(
        extHotel.latitude,
        extHotel.longitude,
        dbHotel.latitude,
        dbHotel.longitude
      );
      
      if (distance < bestDistance) {
        bestDistance = distance;
        bestMatch = dbHotel;
      }
    }
    
    if (bestMatch && bestDistance <= maxDistanceKm) {
      matches.push({
        external: extHotel,
        database: bestMatch,
        distance: bestDistance,
      });
    } else if (bestMatch) {
      discrepancies.push({
        external: extHotel,
        database: bestMatch,
        distance: bestDistance,
        reason: `Distance ${bestDistance.toFixed(2)}km > threshold ${maxDistanceKm}km`,
      });
    }
  }
  
  // Report
  console.log('=== Validation Results ===\n');
  console.log(`Total external hotels: ${externalHotels.length}`);
  console.log(`✅ Matches (≤${maxDistanceKm}km): ${matches.length}`);
  console.log(`⚠️  Discrepancies (>${maxDistanceKm}km): ${discrepancies.length}`);
  console.log(`❌ Not found in DB: ${notFound.length}\n`);
  
  if (discrepancies.length > 0) {
    console.log('=== Discrepancies Detail ===\n');
    for (const disc of discrepancies.slice(0, 20)) {
      console.log(`Hotel: ${disc.external.nome}`);
      console.log(`  External: ${disc.external.cidade}, ${disc.external.pais}`);
      console.log(`    Coords: ${disc.external.latitude}, ${disc.external.longitude}`);
      console.log(`  Database: ${disc.database.destino?.nome}, ${disc.database.destino?.pais}`);
      console.log(`    Coords: ${disc.database.latitude}, ${disc.database.longitude}`);
      console.log(`  Distance: ${disc.distance.toFixed(2)}km`);
      console.log(`  Reason: ${disc.reason}`);
      console.log();
    }
    
    if (discrepancies.length > 20) {
      console.log(`... and ${discrepancies.length - 20} more discrepancies\n`);
    }
  }
  
  // Write CSV report
  const outputDir = join(process.cwd(), 'data', 'reports');
  mkdirSync(outputDir, { recursive: true });
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const csvPath = join(outputDir, `hotel-coords-validation-${timestamp}.csv`);
  
  const csvHeader = 'hotel_name;external_city;external_country;external_lat;external_lon;db_city;db_country;db_lat;db_lon;distance_km;status\n';
  const csvRows = [
    ...discrepancies.map(d => 
      `"${d.external.nome}";"${d.external.cidade}";"${d.external.pais}";${d.external.latitude};${d.external.longitude};"${d.database.destino?.nome}";"${d.database.destino?.pais}";${d.database.latitude};${d.database.longitude};${d.distance.toFixed(2)};DISCREPANCY`
    ),
    ...matches.map(m =>
      `"${m.external.nome}";"${m.external.cidade}";"${m.external.pais}";${m.external.latitude};${m.external.longitude};"${m.database.destino?.nome}";"${m.database.destino?.pais}";${m.database.latitude};${m.database.longitude};${m.distance.toFixed(2)};MATCH`
    ),
    ...notFound.map(n =>
      `"${n.nome}";"${n.cidade}";"${n.pais}";${n.latitude};${n.longitude};;;;;NOT_FOUND`
    ),
  ].join('\n');
  
  writeFileSync(csvPath, csvHeader + csvRows, 'utf-8');
  console.log(`📄 Report saved: ${csvPath}\n`);
  
  // Summary by country
  const byCountry = discrepancies.reduce((acc, d) => {
    const country = d.external.pais || 'Unknown';
    if (!acc[country]) acc[country] = [];
    acc[country].push(d);
    return acc;
  }, {});
  
  if (Object.keys(byCountry).length > 0) {
    console.log('=== Discrepancies by Country ===\n');
    for (const [country, items] of Object.entries(byCountry).sort()) {
      console.log(`${country}: ${items.length} discrepancies`);
    }
    console.log();
  }
  
  await prisma.$disconnect();
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});