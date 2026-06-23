/**
 * Enriches bundle-wikivoyage.json with hospitals, police & cultural POIs
 * via Overture Maps + DuckDB — a single fast batch query replacing BizData+Overpass.
 *
 *   node scripts/enrich-bundle-overture-pois.mjs                         # all POIs, 5km
 *   node scripts/enrich-bundle-overture-pois.mjs --radius 10000         # 10km radius
 *   node scripts/enrich-bundle-overture-pois.mjs --limit 500 --batch 200
 *   node scripts/enrich-bundle-overture-pois.mjs --force                # re-enrich all
 *   node scripts/enrich-bundle-overture-pois.mjs --hospitals-only       # hospitals + clinics
 *   node scripts/enrich-bundle-overture-pois.mjs --police-only          # police only
 *   node scripts/enrich-bundle-overture-pois.mjs --cultural-only        # museums, galleries, etc.
 *   node scripts/enrich-bundle-overture-pois.mjs --release 2024-06-13.0 # specific Overture release
 *
 * Output POIs are merged into each destination's `pois` array with source="overture".
 * Deduplication is based on Overture ID to avoid duplicates within the same run.
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  OVERTURE_CATEGORIES,
  queryOverturePoisBatch,
  queryPbfPoisBatch,
  resolveGeofabrikPbf,
} from './lib/duckdb-poi.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const BUNDLE = resolve(ROOT, 'src/data/travel-mock/bundle-wikivoyage.json');

// ── CLI flags ──────────────────────────────────────────────────────────────

function parseArg(name, fallback) {
  const arg = process.argv.find((a) => a.startsWith(`--${name}=`));
  if (arg) return parseInt(arg.split('=')[1], 10);
  const idx = process.argv.indexOf(`--${name}`);
  if (idx !== -1 && process.argv[idx + 1]) return parseInt(process.argv[idx + 1], 10);
  return fallback;
}

const LIMIT = parseArg('limit', Infinity);
const RADIUS = parseArg('radius', 5000);
const BATCH_SIZE = parseArg('batch', 500);
const RELEASE = (() => {
  const arg = process.argv.find((a) => a.startsWith('--release='));
  if (arg) return arg.split('=')[1];
  const idx = process.argv.indexOf('--release');
  return idx !== -1 ? process.argv[idx + 1] : undefined;
})();

const HOSPITALS_ONLY = process.argv.includes('--hospitals-only');
const POLICE_ONLY = process.argv.includes('--police-only');
const CULTURAL_ONLY = process.argv.includes('--cultural-only');
const FORCE = process.argv.includes('--force');
const DRY_RUN = process.argv.includes('--dry-run');
const RESUME = !FORCE;
const PBF_MODE = process.argv.includes('--pbf');

/** Filter by country code (e.g. --country=PT, --country=BR) */
const COUNTRY_FILTER = (() => {
  const arg = process.argv.find((a) => a.startsWith('--country='));
  if (arg) return arg.split('=')[1].toUpperCase();
  const idx = process.argv.indexOf('--country');
  return idx !== -1 && process.argv[idx + 1]
    ? process.argv[idx + 1].toUpperCase()
    : null;
})();

// ── Category mapping ──────────────────────────────────────────────────────

/** Overture category → { group, type } for the bundle POI format */
const CATEGORY_MAP = {
  hospital:            { group: 'hospital', type: 'hospital' },
  clinic:              { group: 'hospital', type: 'clinic' },
  police:              { group: 'police',   type: 'police' },
  museum:              { group: 'cultural', type: 'museum' },
  art_gallery:         { group: 'cultural', type: 'art_gallery' },
  library:             { group: 'cultural', type: 'library' },
  theater:             { group: 'cultural', type: 'theater' },
  cinema:              { group: 'cultural', type: 'cinema' },
  heritage:            { group: 'cultural', type: 'heritage' },
  monument:            { group: 'cultural', type: 'monument' },
  archaeological_site: { group: 'cultural', type: 'archaeological_site' },
};

function getTargetCategories() {
  if (HOSPITALS_ONLY) return [...OVERTURE_CATEGORIES.hospital];
  if (POLICE_ONLY) return [...OVERTURE_CATEGORIES.police];
  if (CULTURAL_ONLY) return [...OVERTURE_CATEGORIES.cultural];
  return [
    ...OVERTURE_CATEGORIES.hospital,
    ...OVERTURE_CATEGORIES.police,
    ...OVERTURE_CATEGORIES.cultural,
  ];
}

function getModeLabel() {
  if (HOSPITALS_ONLY) return 'hospitals + clinics';
  if (POLICE_ONLY) return 'police';
  if (CULTURAL_ONLY) return 'cultural';
  return 'hospitals + police + cultural';
}

/** Map an Overture POI to the bundle POI format */
function mapOvertureToPoi(overPoi) {
  const mapping = CATEGORY_MAP[overPoi.category] ?? { group: 'other', type: overPoi.category };
  return {
    name: overPoi.name || null,
    type: mapping.type,
    group: mapping.group,
    lat: overPoi.lat,
    lon: overPoi.lon,
    osm_id: null,
    osm_type: 'overture',
    address: null,
    website: null,
    phone: null,
    opening_hours: null,
    wikidata_id: null,
    image_url: null,
    source: 'overture',
    overture_id: overPoi.id,
    distanceKm: overPoi.distanceKm,
  };
}

// ── Dedup helpers ──────────────────────────────────────────────────────────

/** Build a Set of existing Overture IDs already in a destination's POIs */
function existingOvertureIds(pois) {
  const ids = new Set();
  for (const p of pois) {
    if (p.overture_id) ids.add(p.overture_id);
    // Also deduplicate by source+osm_type for legacy POIs
  }
  return ids;
}

/** Merge new POIs into existing, dedup by overture_id and by lat+lon+type */
function mergePois(existing, newPois) {
  const seen = existingOvertureIds(existing);
  // Also dedup by lat/lon/type to avoid duplicates with BizData/Overpass POIs
  const seenLoc = new Set(
    existing.map((p) => `${p.lat?.toFixed(5)},${p.lon?.toFixed(5)},${p.type}`),
  );
  let added = 0;
  for (const p of newPois) {
    if (p.overture_id && seen.has(p.overture_id)) continue;
    const locKey = `${p.lat?.toFixed(5)},${p.lon?.toFixed(5)},${p.type}`;
    if (seenLoc.has(locKey)) continue;
    existing.push(p);
    if (p.overture_id) seen.add(p.overture_id);
    seenLoc.add(locKey);
    added++;
  }
  return added;
}

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  if (!existsSync(BUNDLE)) {
    console.error(`❌ Missing bundle: ${BUNDLE}`);
    console.error('   Run: npm run travel:demo:build');
    process.exit(1);
  }

  const bundle = JSON.parse(readFileSync(BUNDLE, 'utf8'));
  const destinos = bundle.destinos ?? [];
  let withCoords = destinos.filter((d) => d.latitude != null && d.longitude != null);
  if (COUNTRY_FILTER) {
    withCoords = withCoords.filter((d) =>
      d.paisCode?.toUpperCase() === COUNTRY_FILTER ||
      d.pais?.toUpperCase()?.includes(COUNTRY_FILTER),
    );
    console.log(`   🌍 Country filter: ${COUNTRY_FILTER} (${withCoords.length} destinos)`);
  }
  const slice = withCoords.slice(0, LIMIT);
  const radiusKm = Math.max(1, Math.round(RADIUS / 1000));
  const categories = getTargetCategories();
  const modeLabel = getModeLabel();

  // ── Filter destinations that need enrichment ──
  let todo;
  if (RESUME) {
    todo = slice.filter((d) => {
      const e = d._enriched ?? {};
      return !e.overture_pois;
    });
    if (todo.length === 0) {
      console.log('✅ All destinations already have Overture POI enrichment');
      return;
    }
  } else {
    todo = slice;
  }

  // Resolve PBF files per country if --pbf mode
  const pbfCache = new Map(); // countryCode → pbfPath
  if (PBF_MODE) {
    const countryCodes = [...new Set(todo.map((d) => d.paisCode?.toUpperCase()).filter(Boolean))];
    console.log(`\n🗺️  PBF POI enrichment — ${modeLabel}`);
    console.log(`   ${todo.length} destinos${COUNTRY_FILTER ? ' (' + COUNTRY_FILTER + ')' : ''} | Raio: ${radiusKm} km | Batch: ${BATCH_SIZE}`);
    console.log(`   📂 Downloading/using cached Geofabrik PBF extracts for ${countryCodes.length} countries...\n`);
    for (const cc of countryCodes) {
      try {
        const pbfPath = await resolveGeofabrikPbf(cc);
        pbfCache.set(cc, pbfPath);
      } catch (err) {
        console.warn(`   ⚠️  No PBF for ${cc}: ${err.message}`);
      }
    }
    if (pbfCache.size === 0) {
      console.error('❌ No PBF files available. Check country codes or Geofabrik URLs.');
      process.exit(1);
    }
  } else {
    console.log(`\n🗺️  Overture Maps POI enrichment — ${modeLabel}`);
    console.log(`   ${todo.length} destinos${COUNTRY_FILTER ? ' (' + COUNTRY_FILTER + ')' : ''} | Raio: ${radiusKm} km | Batch: ${BATCH_SIZE} | Release: ${RELEASE ?? 'latest'}`);
  }
  console.log(`   Resume: ${RESUME ? 'sim (use --force para re-enriquecer)' : 'não'}`);
  if (DRY_RUN) console.log('   ⚠️  DRY RUN — no changes will be saved\n');
  if (RESUME && todo.length < slice.length) {
    console.log(`   🔄 Retomando: ${todo.length} destinos pendentes (de ${slice.length})\n`);
  }

  // ── Group by country for smaller bbox queries ──
  const byCountry = new Map();
  for (const d of todo) {
    const cc = d.paisCode?.toUpperCase() ?? 'XX';
    if (!byCountry.has(cc)) byCountry.set(cc, []);
    byCountry.get(cc).push(d);
  }
  const countryGroups = [...byCountry.entries()].sort((a, b) => b[1].length - a[1].length);
  if (countryGroups.length > 1 && !COUNTRY_FILTER) {
    console.log(`   📊 ${countryGroups.length} países: ${countryGroups.slice(0, 10).map(([cc, ds]) => `${cc}(${ds.length})`).join(', ')}${countryGroups.length > 10 ? '...' : ''}`);
  }

  // ── Process by country group ──
  let totalOk = 0;
  let totalEmpty = 0;
  let totalPoisAdded = 0;
  const startTime = Date.now();
  let globalIdx = 0;

  for (const [countryCode, countryDests] of countryGroups) {
    const countryLabel = countryGroups.length > 1 ? ` [${countryCode}]` : '';
    console.log(`\n🌍 Processando ${countryDests.length} destinos em ${countryCode}...`);

    // Process this country's destinations in batches
    for (let batchOffset = 0; batchOffset < countryDests.length; batchOffset += BATCH_SIZE) {
      const batch = countryDests.slice(batchOffset, batchOffset + BATCH_SIZE);
      const batchNum = Math.floor(batchOffset / BATCH_SIZE) + 1;
      const totalBatchesForCountry = Math.ceil(countryDests.length / BATCH_SIZE);
      const batchLabel = totalBatchesForCountry > 1 ? ` (${batchNum}/${totalBatchesForCountry})` : '';

      process.stdout.write(`  📦 Batch${countryLabel}${batchLabel} — ${batch.length} destinos...\n`);

      // Build batch input for DuckDB (id must be string to match Map keys)
      const batchInput = batch.map((d, i) => ({
        lat: d.latitude,
        lon: d.longitude,
        id: String(d.id ?? d.nome ?? `dest_${globalIdx + i}`),
      }));

      // Query POIs via DuckDB — Overture (S3) or PBF (local)
      let overtureResults;
      try {
        if (PBF_MODE) {
          const pbfPath = pbfCache.get(countryCode);
          if (!pbfPath) {
            console.error(`   ⚠️  No PBF for ${countryCode}, skipping batch`);
            globalIdx += batch.length;
            continue;
          }
          const targetGroups = HOSPITALS_ONLY ? ['hospital'] : POLICE_ONLY ? ['police'] : CULTURAL_ONLY ? ['cultural'] : ['hospital', 'police', 'cultural'];
          overtureResults = await queryPbfPoisBatch(batchInput, {
            pbfPath,
            radiusKm,
            groups: targetGroups,
            limit: 30,
          });
          // Convert PBF results to Overture-compatible format for mapOvertureToPoi
          for (const [key, pois] of overtureResults) {
            overtureResults.set(key, pois.map((p) => ({
              id: p.osm_id,
              name: p.name,
              category: p.type,
              lat: p.lat,
              lon: p.lon,
              distanceKm: p.distanceKm,
              source: p.source,
              // Preserve group from PBF (CATEGORY_MAP may not have all OSM types)
              _pbfGroup: p.group,
            })));
          }
        } else {
          overtureResults = await queryOverturePoisBatch(batchInput, {
            radiusKm,
            categories,
            limit: 30,
            release: RELEASE,
          });
        }
      } catch (err) {
        console.error(`   ❌ Batch${countryLabel}${batchLabel} failed: ${err.message}`);
        globalIdx += batch.length;
        continue;
      }

      if (DRY_RUN) {
        // Show sample results without modifying the bundle
        let totalBatchPois = 0;
        for (let i = 0; i < batch.length; i++) {
          const dest = batch[i];
          const destId = batchInput[i].id;
          const overPois = overtureResults.get(destId) ?? [];
          totalBatchPois += overPois.length;
          if (i < 3) {
            console.log(`   [${globalIdx + i + 1}] ${dest.nome}: ${overPois.length} POIs`);
            for (const p of overPois.slice(0, 3)) {
              console.log(`       · ${p.name ?? '(sem nome)'} [${p.category}] ${p.distanceKm}km`);
            }
          }
        }
        console.log(`   📊 Batch${countryLabel}${batchLabel}: ${totalBatchPois} POIs total em ${batch.length} destinos`);
        globalIdx += batch.length;
        continue;
      }

      // Merge results into destinations
      let batchOk = 0;
      let batchEmpty = 0;
      let batchPois = 0;

      for (let i = 0; i < batch.length; i++) {
        const dest = batch[i];
        const destId = batchInput[i].id;
        const overPois = overtureResults.get(destId) ?? [];

        const enriched = dest._enriched ?? {};

        if (!Array.isArray(dest.pois)) dest.pois = [];

        const added = PBF_MODE
          ? mergePois(dest.pois, overPois.map((p) => ({
              name: p.name || null,
              type: p.category,
              group: p._pbfGroup ?? CATEGORY_MAP[p.category]?.group ?? 'other',
              lat: p.lat,
              lon: p.lon,
              osm_id: p.id,
              osm_type: 'node',
              address: null,
              website: null,
              phone: null,
              opening_hours: null,
              wikidata_id: null,
              image_url: null,
              source: 'osm_pbf',
              overture_id: null,
              distanceKm: p.distanceKm,
            })))
          : mergePois(dest.pois, overPois.map(mapOvertureToPoi));

        enriched.overture_pois = true;
        enriched.overture_pois_count = dest.pois.length;
        dest._enriched = enriched;

        if (dest.pois.length > 0) {
          batchOk++;
          batchPois += added;
        } else {
          batchEmpty++;
        }

        const pct = `${globalIdx + i + 1}/${todo.length}`;
        if (i < 5 || i === batch.length - 1) {
          process.stdout.write(
            `   [${pct}] ${dest.nome}: ${overPois.length} overture → +${added} (total: ${dest.pois.length})\n`,
          );
        }
      }

      totalOk += batchOk;
      totalEmpty += batchEmpty;
      totalPoisAdded += batchPois;
      globalIdx += batch.length;

      // Checkpoint save every batch
      writeFileSync(BUNDLE, JSON.stringify(bundle));
      process.stdout.write(
        `   ✅ Batch${countryLabel}${batchLabel} guardado — +${batchPois} POIs (${batchOk} OK, ${batchEmpty} vazios)\n`,
      );
    }
  }

  if (DRY_RUN) {
    console.log(`\n🏁 DRY RUN completo em ${((Date.now() - startTime) / 1000).toFixed(1)}s — bundle não alterado`);
    return;
  }

  // ── Final summary ──
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  bundle.meta.overturePoisEnrich = {
    generatedAt: new Date().toISOString(),
    radius: RADIUS,
    batchSize: BATCH_SIZE,
    processed: totalOk + totalEmpty,
    withPois: totalOk,
    empty: totalEmpty,
    totalPoisAdded,
    mode: modeLabel,
    release: RELEASE ?? 'latest',
    elapsedSeconds: parseFloat(elapsed),
  };
  writeFileSync(BUNDLE, JSON.stringify(bundle));

  console.log(`\n✅ Overture Maps enrichment completo em ${elapsed}s`);
  console.log(`   Destinos processados: ${totalOk + totalEmpty}`);
  console.log(`   Com POIs: ${totalOk}`);
  console.log(`   Sem POIs: ${totalEmpty}`);
  console.log(`   POIs adicionados: ${totalPoisAdded}`);
  console.log(`   Bundle: ${BUNDLE}\n`);
}

main().catch((e) => {
  console.error('\n❌ Fatal:', e);
  process.exit(1);
});
