#!/usr/bin/env node
/**
 * Patch existing hotel-index.json with French commune coordinates.
 *
 * O índice foi construído sem coordenadas para hotéis franceses (france-classified).
 * Este script lê o índice existente, carrega france-communes-geocoded.json,
 * e injeta lat/lon nas entradas "france-classified" que tenham commune (cidade)
 * correspondente no ficheiro de geocodificação.
 *
 * Uso:
 *   node scripts/patch-french-hotels-geo.mjs
 *   node scripts/patch-french-hotels-geo.mjs --dry-run
 *
 * NOTA: Após correr este script, é necessário re-correr o backfill:
 *   npm run travel:catalog:backfill-geo
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const INDEX = resolve(ROOT, 'data/hotels/hotel-index.json');
const COMMUNES = resolve(ROOT, 'data/hotels/france-communes-geocoded.json');

const dryRun = process.argv.includes('--dry-run');

/** @param {string} s */
function fold(s) {
  return String(s ?? '')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, ' ');
}

function main() {
  if (!existsSync(INDEX)) {
    console.error(`ERROR: hotel-index.json not found at ${INDEX}`);
    console.error('Build it first with: py -3 scripts/build-hotel-data-index.py');
    process.exit(1);
  }
  if (!existsSync(COMMUNES)) {
    console.error(`ERROR: france-communes-geocoded.json not found at ${COMMUNES}`);
    process.exit(1);
  }

  // Load commune coordinates
  const communesRaw = JSON.parse(readFileSync(COMMUNES, 'utf-8'));
  /** @type {Map<string, {lat: number, lon: number}>} */
  const communeCoords = new Map();
  let loaded = 0;
  for (const [name, coord] of Object.entries(communesRaw)) {
    if (coord && coord.lat != null && coord.lon != null) {
      communeCoords.set(fold(name), { lat: coord.lat, lon: coord.lon });
      loaded++;
    }
  }
  console.log(`Loaded ${loaded} commune coordinates from ${COMMUNES}`);

  // Load the index
  const index = JSON.parse(readFileSync(INDEX, 'utf-8'));
  console.log(`Index loaded: ${Object.keys(index.byNome).length} nomeKeys`);

  // Track stats
  const stats = { patched: 0, skippedNoCommune: 0, skippedNoCoords: 0, addedToGeo: 0 };
  // Keep a separate list of patched items (references) to add to geoGrid later
  const patchedItems = [];

  /**
   * Try to add commune coords to a hotel row.
   * @param {object} item - hotel row from the index
   * @returns {boolean} whether coords were added
   */
  function patchItem(item) {
    if (item.source !== 'france-classified') return false;
    if (item.latitude != null && item.longitude != null) return false; // already has coords

    const commune = item.cidade;
    if (!commune) {
      stats.skippedNoCommune++;
      return false;
    }

    const cf = fold(commune);
    const coords = communeCoords.get(cf);
    if (!coords) {
      stats.skippedNoCoords++;
      return false;
    }

    item.latitude = coords.lat;
    item.longitude = coords.lon;
    stats.patched++;
    patchedItems.push(item);
    return true;
  }

  // Patch entries in all bucket types
  // French hotels are indexed under byNome + byCity (by the build script).
  // geoGrid is handled separately below since French hotels were never added to it.
  for (const bucket of ['byCity', 'byConcelho', 'byLocalidade', 'byArticle', 'byNome']) {
    const map = index[bucket];
    if (!map) continue;

    for (const items of Object.values(map)) {
      for (const item of items) {
        patchItem(item);
      }
    }
  }

  // Add patched French hotels to geoGrid (they were never added by the original build)
  for (const item of patchedItems) {
    const lat = item.latitude;
    const lon = item.longitude;
    if (lat == null || lon == null) continue;

    const cell = `${Math.trunc(lat * 4)}_${Math.trunc(lon * 4)}`;
    const cellList = index.geoGrid[cell] ?? (index.geoGrid[cell] = []);

    if (cellList.length >= 30) continue; // respect MAX_GEO_CELL limit
    if (cellList.some((x) => x.nome === item.nome && x.source === item.source)) continue;

    cellList.push(item);
    stats.addedToGeo++;
  }

  console.log(`\nResults:`);
  console.log(`  Patched with commune coords: ${stats.patched}`);
  console.log(`  Added to geoGrid:           ${stats.addedToGeo}`);
  console.log(`  Skipped (no commune field):  ${stats.skippedNoCommune}`);
  console.log(`  Skipped (no coords cache):   ${stats.skippedNoCoords}`);

  if (dryRun) {
    console.log('\nDry-run — no changes written.');
    return;
  }

  if (stats.patched === 0) {
    console.log('\nNothing to patch. Index is already up to date.');
    return;
  }

  // Write updated index
  // Use compact JSON to avoid RangeError on large index
  const json = JSON.stringify(index);
  writeFileSync(INDEX, json, 'utf-8');
  const sizeMb = (Buffer.byteLength(json) / 1024 / 1024).toFixed(1);
  console.log(`\nUpdated index written to ${INDEX} (${sizeMb} MB)`);
  console.log(`\nNext step: npm run travel:catalog:backfill-geo`);
}

try {
  main();
} catch (e) {
  console.error(e);
  process.exit(1);
}
