#!/usr/bin/env node
/**
 * Download OSM + GTFS for OpenTripPlanner (Portugal / Lisboa area).
 * Run: node scripts/otp-prepare.mjs
 */
import { createWriteStream, existsSync, mkdirSync } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Readable } from 'node:stream';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const otpDir = resolve(root, 'data/opentripplanner');

const OSM_URL =
  process.env.OTP_OSM_URL?.trim() ||
  'https://download.geofabrik.de/europe/portugal-latest.osm.pbf';

const GTFS_SOURCES = [
  {
    file: 'carrismetropolitana-gtfs.zip',
    url:
      process.env.OTP_GTFS_URL?.trim() ||
      'https://api.carrismetropolitana.pt/gtfs',
  },
];

async function download(url, dest) {
  console.log(`Downloading ${url}`);
  console.log(`  → ${dest}`);
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${url}`);
  }
  if (!res.body) throw new Error('Empty response body');
  await pipeline(Readable.fromWeb(res.body), createWriteStream(dest));
  console.log('  done');
}

mkdirSync(otpDir, { recursive: true });

const osmPath = resolve(otpDir, 'portugal.osm.pbf');
if (!existsSync(osmPath)) {
  await download(OSM_URL, osmPath);
} else {
  console.log(`Skip OSM (exists): ${osmPath}`);
}

for (const { file, url } of GTFS_SOURCES) {
  const dest = resolve(otpDir, file);
  if (!existsSync(dest)) {
    await download(url, dest);
  } else {
    console.log(`Skip GTFS (exists): ${dest}`);
  }
}

console.log('\nNext: npm run otp:build   (first time: several minutes)');
console.log('Then:  npm run otp:up');
