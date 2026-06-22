/**
 * Validate hotels from MakeMyTrip CSV against database.
 * 
 * Identifies hotels that exist in the CSV but are missing from the database.
 *
 * Usage:
 *   npm run travel:catalog:validate-makemytrip-hotels
 *   npm run travel:catalog:validate-makemytrip-hotels -- --limit 100
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

function normalizeName(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
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

const limit = parseInt(argValue('--limit', '0'), 10) || 0;
const verbose = args.has('--verbose');

async function loadMakeMyTripCsv() {
  const csvPath = join(process.cwd(), 'data', 'hotels', 'makemytrip_com-travel_sample.csv');
  console.log(`Loading MakeMyTrip CSV: ${csvPath}`);
  
  const content = readFileSync(csvPath, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim() && !line.startsWith('area,'));
  
  const hotels = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    
    const parts = parseCsvLine(line);
    if (parts.length < 30) continue;
    
    const propertyName = parts[22]?.trim();
    const city = parts[1]?.trim();
    const country = parts[2]?.trim();
    const propertyId = parts[21]?.trim();
    const starRating = parts[6]?.trim();
    const latitude = parseFloat(parts[10]?.trim());
    const longitude = parseFloat(parts[11]?.trim());
    const propertyAddress = parts[20]?.trim();
    const mmtReviewRating = parts[15]?.trim();
    const mmtReviewCount = parts[14]?.trim();
    const imageUrls = parts[7]?.trim();
    const hotelOverview = parts[5]?.trim();
    
    if (!propertyName || !city || !country) continue;
    
    hotels.push({
      propertyId,
      propertyName,
      city,
      country,
      starRating,
      latitude,
      longitude,
      propertyAddress,
      mmtReviewRating,
      mmtReviewCount,
      imageUrls,
      hotelOverview,
    });
  }
  
  console.log(`Loaded ${hotels.length} hotels from MakeMyTrip CSV\n`);
  return hotels;
}

async function main() {
  console.log('=== MakeMyTrip Hotel Validation ===\n');
  
  // Load external CSV
  const externalHotels = await loadMakeMyTripCsv();
  if (limit > 0 && limit < externalHotels.length) {
    console.log(`Limiting to first ${limit} hotels from CSV\n`);
    externalHotels.length = limit;
  }
  
  // Load all database hotels
  console.log('Loading database hotels...');
  const dbHotels = await prisma.hotel.findMany({
    select: {
      id: true,
      name: true,
      city: true,
      country: true,
      slug: true,
    },
  });
  console.log(`Loaded ${dbHotels.length} hotels from database\n`);
  
  // Create lookup by normalized name
  const dbByName = new Map();
  for (const hotel of dbHotels) {
    const key = normalizeName(hotel.name);
    if (!dbByName.has(key)) {
      dbByName.set(key, []);
    }
    dbByName.get(key).push(hotel);
  }
  
  // Match and find missing
  console.log('Comparing hotels...\n');
  const missing = [];
  const found = [];
  
  for (const extHotel of externalHotels) {
    const normalizedKey = normalizeName(extHotel.propertyName);
    const candidates = dbByName.get(normalizedKey);
    
    if (!candidates || candidates.length === 0) {
      missing.push(extHotel);
    } else {
      found.push({
        external: extHotel,
        database: candidates[0],
      });
    }
  }
  
  // Report
  console.log('=== Validation Results ===\n');
  console.log(`Total MakeMyTrip hotels: ${externalHotels.length}`);
  console.log(`Found in database: ${found.length}`);
  console.log(`Missing from database: ${missing.length}\n`);
  
  if (missing.length > 0) {
    console.log('=== Missing Hotels (first 50) ===\n');
    for (const hotel of missing.slice(0, 50)) {
      console.log(`Hotel: ${hotel.propertyName}`);
      console.log(`  Location: ${hotel.city}, ${hotel.country}`);
      console.log(`  Property ID: ${hotel.propertyId}`);
      if (hotel.starRating) console.log(`  Star Rating: ${hotel.starRating}`);
      if (hotel.latitude && hotel.longitude) console.log(`  Coordinates: ${hotel.latitude}, ${hotel.longitude}`);
      console.log();
    }
    
    if (missing.length > 50) {
      console.log(`... and ${missing.length - 50} more missing hotels\n`);
    }
  }
  
  // Write CSV report
  const outputDir = join(process.cwd(), 'data', 'reports');
  mkdirSync(outputDir, { recursive: true });
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const csvPath = join(outputDir, `makemytrip-missing-hotels-${timestamp}.csv`);
  
  const csvHeader = 'property_id;property_name;city;country;star_rating;latitude;longitude;property_address;mmt_review_rating;mmt_review_count\n';
  const csvRows = missing.map(h => 
    `"${h.propertyId}";"${h.propertyName}";"${h.city}";"${h.country}";"${h.starRating}";${h.latitude || ''};${h.longitude || ''};"${h.propertyAddress || ''}";"${h.mmtReviewRating || ''}";"${h.mmtReviewCount || ''}"`
  ).join('\n');
  
  writeFileSync(csvPath, csvHeader + csvRows, 'utf-8');
  console.log(`Report saved: ${csvPath}\n`);
  
  // Summary by country
  const byCountry = missing.reduce((acc, h) => {
    const country = h.country || 'Unknown';
    if (!acc[country]) acc[country] = [];
    acc[country].push(h);
    return acc;
  }, {});
  
  if (Object.keys(byCountry).length > 0) {
    console.log('=== Missing Hotels by Country ===\n');
    for (const [country, items] of Object.entries(byCountry).sort()) {
      console.log(`${country}: ${items.length} missing hotels`);
    }
    console.log();
  }
  
  // Summary by city
  const byCity = missing.reduce((acc, h) => {
    const city = h.city || 'Unknown';
    if (!acc[city]) acc[city] = [];
    acc[city].push(h);
    return acc;
  }, {});
  
  if (Object.keys(byCity).length > 0) {
    console.log('=== Missing Hotels by City (top 20) ===\n');
    const sortedCities = Object.entries(byCity)
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 20);
    
    for (const [city, items] of sortedCities) {
      console.log(`${city}: ${items.length} missing hotels`);
    }
    console.log();
  }
  
  await prisma.$disconnect();
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});