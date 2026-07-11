/**
 * Enriquesce bundle-wikivoyage.json com hospitais e polícia via BizData + Overpass (OpenStreetMap).
 *
 *   npm run travel:demo:enrich-hospitals-police                    # 5km, ambos
 *   npm run travel:demo:enrich-hospitals-police -- --radius 10000  # 10km
 *   npm run travel:demo:enrich-hospitals-police -- --resume        # Continuar
 *   npm run travel:demo:enrich-hospitals-police -- --hospitals-only # Só hospitais
 *   npm run travel:demo:enrich-hospitals-police -- --police-only    # Só polícia
 *   npm run travel:demo:enrich-hospitals-police -- --bizdata-only   # Só BizData
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const BUNDLE = resolve(ROOT, 'src/data/travel-mock/bundle-wikivoyage.json');

// ── CLI flags ──
const limitArg = process.argv.find((a) => a.startsWith('--limit'));
const LIMIT = limitArg
  ? parseInt(limitArg.split('=')[1] ?? process.argv[process.argv.indexOf('--limit') + 1], 10)
  : Infinity;

const radiusArg = process.argv.find((a) => a.startsWith('--radius'));
const RADIUS = radiusArg
  ? parseInt(radiusArg.split('=')[1] ?? process.argv[process.argv.indexOf('--radius') + 1], 10)
  : 5000;

const HOSPITALS_ONLY = process.argv.includes('--hospitals-only');
const POLICE_ONLY = process.argv.includes('--police-only');
const BIZDATA_ONLY = process.argv.includes('--bizdata-only');
const RESUME = !process.argv.includes('--force');

// ── BizData categories (primary, no rate limits) ──
const BIZDATA_HOSPITAL_CATEGORIES = ['hospital', 'clinic', 'doctors'];
const BIZDATA_POLICE_CATEGORIES = ['police'];

function getBizDataCategories() {
  if (HOSPITALS_ONLY) return BIZDATA_HOSPITAL_CATEGORIES;
  if (POLICE_ONLY) return BIZDATA_POLICE_CATEGORIES;
  return [...BIZDATA_HOSPITAL_CATEGORIES, ...BIZDATA_POLICE_CATEGORIES];
}

// ── Overpass POI categories (fallback) ──
const HOSPITAL_TYPES = [
  { tag: 'amenity', value: 'hospital',  group: 'hospital' },
  { tag: 'amenity', value: 'clinic',    group: 'hospital' },
  { tag: 'amenity', value: 'doctors',   group: 'hospital' },
  { tag: 'healthcare', value: 'hospital', group: 'hospital' },
  { tag: 'healthcare', value: 'clinic',   group: 'hospital' },
  { tag: 'emergency', value: 'emergency_ward', group: 'hospital' },
];

const POLICE_TYPES = [
  { tag: 'amenity', value: 'police', group: 'police' },
];

function getOverpassTypes() {
  if (HOSPITALS_ONLY) return HOSPITAL_TYPES;
  if (POLICE_ONLY) return POLICE_TYPES;
  return [...HOSPITAL_TYPES, ...POLICE_TYPES];
}

// ── Helpers ──
function getEnrichmentKey() {
  if (HOSPITALS_ONLY) return 'hospitals';
  if (POLICE_ONLY) return 'police';
  return 'hospitalsPolice';
}

function getGroupForBizData(category) {
  if (BIZDATA_HOSPITAL_CATEGORIES.includes(category)) return 'hospital';
  if (BIZDATA_POLICE_CATEGORIES.includes(category)) return 'police';
  return 'other';
}

function getGroupForOverpass(tags, types) {
  for (const t of types) {
    if (tags[t.tag] === t.value) return t.group;
  }
  return 'other';
}

// ── BizData API ──
async function fetchBizDataService(location, category, radiusKm) {
  const params = new URLSearchParams({ location, category, limit: '30' });
  params.set('radius_km', String(radiusKm));
  try {
    const res = await fetch(`https://bizdata-web.vercel.app/api/businesses?${params}`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return (json.businesses ?? []).map((b) => ({
      name: b.name?.trim() || null,
      type: category,
      group: getGroupForBizData(category),
      lat: b.lat,
      lon: b.lon,
      osm_id: b.osm_id,
      osm_type: 'node',
      address: b.address?.trim() || null,
      website: b.website?.trim() || null,
      phone: b.phone?.trim() || null,
      opening_hours: b.opening_hours?.trim() || null,
      wikidata_id: null,
      image_url: null,
      source: 'bizdata',
    }));
  } catch {
    return [];
  }
}

// ── Overpass query ──
function buildOverpassQuery(lat, lon, radius, types) {
  const parts = [];
  for (const { tag, value } of types) {
    parts.push(`node["${tag}"="${value}"](around:${radius},${lat},${lon});`);
    parts.push(`way["${tag}"="${value}"](around:${radius},${lat},${lon});`);
  }
  return `[out:json][timeout:30];(\n  ${parts.join('\n  ')}\n);out center 40;`;
}

async function fetchOverpassPois(lat, lon, radius, types) {
  const query = buildOverpassQuery(lat, lon, radius, types);
  try {
    const res = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'beta-app-travel/1.0 (hospitals-police)',
      },
      body: new URLSearchParams({ data: query }),
    });
    if (!res.ok) {
      const text = await res.text();
      if (text.includes('rate_limited') || text.includes('too busy') || text.includes('timeout')) {
        return 'RATE_LIMITED';
      }
      return [];
    }
    const json = await res.json();
    return (json.elements ?? [])
      .map((el) => {
        const tags = el.tags ?? {};
        const lat = el.lat ?? el.center?.lat;
        const lon = el.lon ?? el.center?.lon;
        if (lat == null || lon == null) return null;

        return {
          name: tags.name?.trim() || tags['name:pt']?.trim() || tags['name:en']?.trim() || null,
          type: tags.amenity || tags.healthcare || tags.emergency || 'unknown',
          group: getGroupForOverpass(tags, types),
          lat, lon,
          osm_id: el.id,
          osm_type: el.type,
          address: [tags['addr:street'], tags['addr:housenumber']].filter(Boolean).join(' ') || null,
          website: tags.website || null,
          phone: tags.phone || null,
          opening_hours: tags.opening_hours || null,
          wikidata_id: tags.wikidata || null,
          image_url: null,
          source: 'overpass',
        };
      })
      .filter((p) => p != null);
  } catch {
    return [];
  }
}

// ── Merge + deduplicate ──
function mergePois(existing, newPois) {
  const seen = new Set(existing.map((p) => `${p.osm_type}:${p.osm_id}`));
  for (const p of newPois) {
    const key = `${p.osm_type}:${p.osm_id}`;
    if (!seen.has(key)) {
      existing.push(p);
      seen.add(key);
    }
  }
  return existing;
}

// ── Main ──
async function main() {
  if (!existsSync(BUNDLE)) {
    console.error(`Missing ${BUNDLE}. Run: npm run travel:demo:build`);
    process.exit(1);
  }

  const bundle = JSON.parse(readFileSync(BUNDLE, 'utf8'));
  const destinos = bundle.destinos ?? [];
  const withCoords = destinos.filter((d) => d.latitude != null && d.longitude != null);
  const slice = withCoords.slice(0, LIMIT);
  const radiusKm = Math.max(1, Math.round(RADIUS / 1000));
  const bizDataCategories = getBizDataCategories();
  const overpassTypes = getOverpassTypes();
  const enrichmentKey = getEnrichmentKey();

  const modeLabel = BIZDATA_ONLY ? 'só BizData' : HOSPITALS_ONLY ? 'só hospitais (BizData + Overpass)' : POLICE_ONLY ? 'só polícia (BizData + Overpass)' : 'hospitais + polícia (BizData + Overpass)';

  console.log(`POIs serviços — ${modeLabel}`);
  console.log(`  ${slice.length} destinos | Raio: ${radiusKm} km | Resume: ${RESUME}\n`);

  // ── Determine which destinations to process ──
  let todo;

  if (RESUME) {
    todo = slice.filter((d) => {
      const e = d._enriched ?? {};
      const services = e.services ?? {};
      if (BIZDATA_ONLY) {
        // Check if all BizData categories are done
        const done = bizDataCategories.every((cat) => services.bizdata?.[cat]);
        return !done;
      }
      // For Overpass fallback, check if main enrichment is done
      return !services[enrichmentKey];
    });

    if (todo.length === 0) {
      console.log('✅ All destinations already have service enrichment');
      return;
    }
    console.log(`  🔄 Retomando: ${todo.length} destinos pendentes\n`);
  } else {
    todo = slice;
  }

  let ok = 0;
  let empty = 0;
  let totalPois = 0;
  let rateLimited = false;
  let overpassDelay = 10000;

  for (let i = 0; i < todo.length; i++) {
    const dest = todo[i];
    const pct = RESUME ? `${i + 1}/${todo.length}` : `${i + 1}/${slice.length}`;
    process.stdout.write(`  [${pct}] ${dest.nome}... `);

    let poiList = Array.isArray(dest.pois) ? dest.pois : [];
    const enriched = dest._enriched ?? {};
    if (!enriched.services) enriched.services = {};
    if (!enriched.services.bizdata) enriched.services.bizdata = {};

    let bizDataAdded = 0;
    let overpassAdded = 0;

    // ── Phase 1: BizData (fast, no rate limits) ──
    if (!BIZDATA_ONLY) {
      for (const cat of bizDataCategories) {
        if (enriched.services.bizdata[cat]) continue; // already fetched

        const results = await fetchBizDataService(`${dest.latitude},${dest.longitude}`, cat, radiusKm);
        const before = poiList.length;
        poiList = mergePois(poiList, results);
        bizDataAdded += poiList.length - before;

        enriched.services.bizdata[cat] = true;
        await new Promise((r) => setTimeout(r, 80));
      }
    } else {
      // BizData only mode
      for (const cat of bizDataCategories) {
        if (enriched.services.bizdata[cat]) continue;

        const results = await fetchBizDataService(`${dest.latitude},${dest.longitude}`, cat, radiusKm);
        const before = poiList.length;
        poiList = mergePois(poiList, results);
        bizDataAdded += poiList.length - before;

        enriched.services.bizdata[cat] = true;
        await new Promise((r) => setTimeout(r, 80));
      }
    }

    // ── Phase 2: Overpass (fallback, rate-limited) ──
    if (!BIZDATA_ONLY && !rateLimited && !enriched.services[enrichmentKey]) {
      await new Promise((r) => setTimeout(r, overpassDelay));

      const overpassResults = await fetchOverpassPois(dest.latitude, dest.longitude, RADIUS, overpassTypes);

      if (overpassResults === 'RATE_LIMITED') {
        console.log('⏸ rate-limited (Overpass)');
        rateLimited = true;
        enriched.servicesRateLimited = true;
        overpassDelay = Math.min(overpassDelay * 2, 30000);
      } else {
        const before = poiList.length;
        poiList = mergePois(poiList, overpassResults);
        overpassAdded = poiList.length - before;
        enriched.services[enrichmentKey] = true;
        if (overpassAdded > 0) {
          overpassDelay = Math.max(overpassDelay - 500, 5000);
        }
      }
    }

    dest._enriched = enriched;

    const hasResults = poiList.length > 0 && (bizDataAdded > 0 || overpassAdded > 0 || BIZDATA_ONLY);

    if (hasResults) {
      dest.pois = poiList;
      ok++;
      totalPois += poiList.length;
      const parts = [];
      if (bizDataAdded) parts.push(`+${bizDataAdded} BizData`);
      if (overpassAdded) parts.push(`+${overpassAdded} Overpass`);
      console.log(`✅ ${poiList.length} POIs${parts.length ? ' (' + parts.join(', ') + ')' : ''}`);
    } else if (rateLimited) {
      // Don't count as empty, just rate limited
    } else {
      empty++;
      console.log('⚠ 0 POIs');
    }

    // Save progress every 15 destinations or on rate limit
    if ((i + 1) % 15 === 0 || rateLimited || i === todo.length - 1) {
      bundle.meta.counts.pois = totalPois;
      writeFileSync(BUNDLE, JSON.stringify(bundle));
      process.stdout.write(`  [checkpoint] saved — ${ok} OK, ${empty} vazios, ${totalPois} POIs\n`);
    }

    if (rateLimited) break;
  }

  // Final save
  bundle.meta.counts.pois = totalPois;
  bundle.meta.servicesEnrich = bundle.meta.servicesEnrich ?? {};
  bundle.meta.servicesEnrich[getEnrichmentKey()] = {
    generatedAt: new Date().toISOString(),
    radius: RADIUS,
    processed: ok + empty,
    withPois: ok,
    empty,
    totalPois,
    rateLimited,
    mode: modeLabel,
    bizdataOnly: BIZDATA_ONLY,
  };
  writeFileSync(BUNDLE, JSON.stringify(bundle));

  console.log(
    `\n✅ Guardado: ${BUNDLE}` +
    `\n  Destinos com POIs: ${ok}` +
    `\n  Sem POIs: ${empty}` +
    `\n  Total POIs: ${totalPois}` +
    `\n  Rate-limited: ${rateLimited}` +
    (rateLimited ? `\n  ➡ Run again: npm run travel:demo:enrich-hospitals-police -- --resume` : ''),
  );
}

main().catch((e) => {
  console.error('\n❌ Fatal:', e);
  process.exit(1);
});
