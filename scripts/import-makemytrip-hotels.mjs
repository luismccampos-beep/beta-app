/**
 * Import MakeMyTrip hotels from CSV into the database
 * 
 * Usage:
 *   node scripts/import-makemytrip-hotels.mjs
 *   node scripts/import-makemytrip-hotels.mjs --limit 100
 *   node scripts/import-makemytrip-hotels.mjs --batch-size 500
 */

import { readFileSync } from 'node:fs';
import { createInterface } from 'node:readline';
import { PrismaClient } from '@prisma/client';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const CSV_PATH = resolve(ROOT, 'data/hotels/makemytrip_com-travel_sample.csv');

// Parse CLI args
const args = process.argv.slice(2);
const limit = args.includes('--limit') ? parseInt(args[args.indexOf('--limit') + 1]) : null;
const batchSize = args.includes('--batch-size') ? parseInt(args[args.indexOf('--batch-size') + 1]) : 1000;

// Load env
const { loadProjectEnv } = await import('./lib/load-env.mjs');
loadProjectEnv(ROOT);

const prisma = new PrismaClient();

/**
 * Generate a URL-friendly slug from a string
 */
function generateSlug(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 500);
}

/**
 * Parse star rating from string like "1 star", "3 star", etc.
 */
function parseStarRating(ratingStr) {
  if (!ratingStr) return null;
  const match = ratingStr.match(/(\d+)/);
  return match ? parseInt(match[1]) : null;
}

/**
 * Parse CSV line handling quoted fields
 */
function parseCSVLine(line) {
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
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

/**
 * Read CSV and yield parsed rows
 */
async function* readCSV(filePath, limitRows = null) {
  const content = readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/).filter(line => line.trim());
  
  // Skip header
  const header = parseCSVLine(lines[0]);
  console.log(`CSV Header (${header.length} columns): ${header.slice(0, 10).join(', ')}...`);
  
  const dataLines = lines.slice(1);
  const maxRows = limitRows ? Math.min(dataLines.length, limitRows) : dataLines.length;
  
  console.log(`Processing ${maxRows} of ${dataLines.length} data rows...\n`);
  
  for (let i = 0; i < maxRows; i++) {
    const columns = parseCSVLine(dataLines[i]);
    if (columns.length < 10) continue; // Skip malformed rows
    
    yield {
      index: i + 1,
      columns,
      header
    };
  }
}

/**
 * Map CSV columns to Hotel model fields
 */
function mapToHotel(row) {
  const { columns, header } = row;
  
  // Find column indices
  const nameIdx = header.findIndex(h => h.toLowerCase().includes('property_name') || h.toLowerCase().includes('name'));
  const cityIdx = header.findIndex(h => h.toLowerCase() === 'city');
  const countryIdx = header.findIndex(h => h.toLowerCase() === 'country');
  const starIdx = header.findIndex(h => h.toLowerCase().includes('star_rating') || h.toLowerCase().includes('star'));
  const latIdx = header.findIndex(h => h.toLowerCase() === 'latitude');
  const lngIdx = header.findIndex(h => h.toLowerCase() === 'longitude');
  const propertyIdIdx = header.findIndex(h => h.toLowerCase().includes('property_id'));
  
  const name = columns[nameIdx] || 'Unknown Hotel';
  const city = columns[cityIdx] || null;
  const country = columns[countryIdx] || null;
  const starRating = parseStarRating(columns[starIdx]);
  const latitude = columns[latIdx] ? parseFloat(columns[latIdx]) : null;
  const longitude = columns[lngIdx] ? parseFloat(columns[lngIdx]) : null;
  const propertyId = columns[propertyIdIdx] || null;
  
  // Generate slug from name
  const slug = generateSlug(name);
  
  // Build amenities JSON with available data
  const amenities = {
    source: 'makemytrip',
    propertyId,
    coordinates: latitude && longitude ? { lat: latitude, lng: longitude } : null,
    rawStarRating: columns[starIdx] || null
  };
  
  return {
    name,
    slug,
    description: `Hotel in ${city || 'unknown location'}, ${country || 'unknown country'}`,
    city,
    country,
    starRating,
    amenities,
    published: true,
    featured: false
  };
}

/**
 * Import hotels in batches
 */
async function importHotels() {
  console.log('=== MakeMyTrip Hotel Import ===\n');
  console.log(`CSV file: ${CSV_PATH}`);
  console.log(`Batch size: ${batchSize}`);
  if (limit) console.log(`Limit: ${limit} hotels`);
  console.log();
  
  let totalProcessed = 0;
  let totalImported = 0;
  let totalSkipped = 0;
  let errors = 0;
  const batch = [];
  
  try {
    for await (const row of readCSV(CSV_PATH, limit)) {
      totalProcessed++;
      
      try {
        const hotelData = mapToHotel(row);
        
        // Skip if no name
        if (!hotelData.name || hotelData.name === 'Unknown Hotel') {
          totalSkipped++;
          continue;
        }
        
        batch.push(hotelData);
        
        // Process batch when full
        if (batch.length >= batchSize) {
          const imported = await insertBatch(batch);
          totalImported += imported;
          batch.length = 0; // Clear batch
          
          // Progress update
          const progress = ((totalProcessed / (limit || 19588)) * 100).toFixed(1);
          console.log(`Progress: ${totalProcessed} processed | ${totalImported} imported | ${progress}%`);
        }
      } catch (error) {
        errors++;
        if (errors <= 5) {
          console.error(`Error processing row ${row.index}: ${error.message}`);
        }
      }
    }
    
    // Process remaining batch
    if (batch.length > 0) {
      const imported = await insertBatch(batch);
      totalImported += imported;
    }
    
    console.log('\n=== Import Complete ===');
    console.log(`Total processed: ${totalProcessed}`);
    console.log(`Total imported: ${totalImported}`);
    console.log(`Total skipped: ${totalSkipped}`);
    console.log(`Errors: ${errors}`);
    
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Insert a batch of hotels, handling duplicates
 */
async function insertBatch(hotels) {
  let imported = 0;
  
  for (const hotel of hotels) {
    try {
      // Try to create, ignore if slug already exists
      await prisma.hotel.create({
        data: hotel
      });
      imported++;
    } catch (error) {
      // If slug conflict, try with modified slug
      if (error.code === 'P2002') {
        try {
          const modifiedHotel = {
            ...hotel,
            slug: `${hotel.slug}-${Date.now()}-${Math.random().toString(36).substring(7)}`
          };
          await prisma.hotel.create({
            data: modifiedHotel
          });
          imported++;
        } catch (retryError) {
          // Skip if still fails
        }
      }
    }
  }
  
  return imported;
}

// Run import
importHotels().catch(error => {
  console.error('Import failed:', error);
  process.exit(1);
});