/**
 * Enriquesce bundle-wikivoyage.json com POIs culturais/natureza/lazer
 * via BizData + Overpass API (OpenStreetMap) — offline no bundle.
 *
 *   npm run travel:demo:enrich-cultural-pois               # BizData + Overpass
 *   npm run travel:demo:enrich-cultural-pois -- --bizdata-only   # Só BizData (rápido)
 *   npm run travel:demo:enrich-cultural-pois -- --limit 10 --radius 3000
 *   npm run travel:demo:enrich-cultural-pois -- --resume          # Continuar de onde parou
 *
 * Os POIs são armazenados no campo `pois` de cada destino.
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

const BIZDATA_ONLY = process.argv.includes('--bizdata-only');
const RESUME = process.argv.includes('--resume');

// ── BizData categories (fast, reliable) ──
const BIZDATA_CATEGORIES = ['museum', 'gallery', 'theatre', 'cinema'];

// ── All Overpass POI categories (BizData doesn't support these) ──
// Each entry: { tag, value, group }
const ALL_OVERNPASS_TYPES = [
  // Cultura
  { tag: 'tourism',  value: 'attraction',            group: 'cultural' },
  { tag: 'tourism',  value: 'artwork',               group: 'cultural' },
  { tag: 'tourism',  value: 'viewpoint',             group: 'cultural' },
  { tag: 'amenity',  value: 'arts_centre',           group: 'cultural' },
  { tag: 'amenity',  value: 'library',               group: 'cultural' },
  // Histórico
  { tag: 'historic', value: 'monument',              group: 'historic' },
  { tag: 'historic', value: 'castle',                group: 'historic' },
  { tag: 'historic', value: 'ruins',                 group: 'historic' },
  { tag: 'historic', value: 'archaeological_site',   group: 'historic' },
  { tag: 'historic', value: 'fort',                  group: 'historic' },
  { tag: 'historic', value: 'memorial',              group: 'historic' },
  { tag: 'historic', value: 'tower',                 group: 'historic' },
  // Natureza
  { tag: 'leisure',  value: 'park',                  group: 'nature' },
  { tag: 'leisure',  value: 'garden',                group: 'nature' },
  { tag: 'leisure',  value: 'nature_reserve',        group: 'nature' },
  { tag: 'natural',  value: 'peak',                  group: 'nature' },
  { tag: 'natural',  value: 'volcano',               group: 'nature' },
  { tag: 'natural',  value: 'cave_entrance',         group: 'nature' },
  { tag: 'natural',  value: 'beach',                 group: 'nature' },
  { tag: 'natural',  value: 'waterfall',             group: 'nature' },
  { tag: 'natural',  value: 'bay',                   group: 'nature' },
  // Desporto
  { tag: 'leisure',  value: 'stadium',               group: 'sports' },
  { tag: 'leisure',  value: 'sports_centre',         group: 'sports' },
  { tag: 'leisure',  value: 'pitch',                 group: 'sports' },
  { tag: 'sport',    value: 'swimming',              group: 'sports' },
  { tag: 'sport',    value: 'tennis',                group: 'sports' },
  { tag: 'sport',    value: 'golf',                  group: 'sports' },
  { tag: 'sport',    value: 'skiing',                group: 'sports' },
  { tag: 'amenity',  value: 'swimming_pool',         group: 'sports' },
  // Lazer
  { tag: 'tourism',  value: 'zoo',                   group: 'leisure' },
  { tag: 'tourism',  value: 'aquarium',              group: 'leisure' },
  { tag: 'tourism',  value: 'theme_park',            group: 'leisure' },
  { tag: 'leisure',  value: 'playground',            group: 'leisure' },
  { tag: 'leisure',  value: 'marina',                group: 'leisure' },
  { tag: 'leisure',  value: 'water_park',            group: 'leisure' },
];

// ── Helpers ──

/** Build a group lookup map from ALL_OVERNPASS_TYPES */
function buildGroupMap() {
  const map = {};
  for (const { tag, value, group } of ALL_OVERNPASS_TYPES) {
    if (!map[tag]) map[tag] = {};
    map[tag][value] = group;
  }
  // Also map BizData categories
  for (const cat of BIZDATA_CATEGORIES) {
    if (!map.amenity) map.amenity = {};
    if (!map.tourism) map.tourism = {};
    map.tourism[cat] = 'cultural';
  }
  return map;
}

const GROUP_MAP = buildGroupMap();

function detectPoiGroup(tags) {
  for (const key of ['tourism', 'historic', 'leisure', 'natural', 'amenity', 'sport']) {
    const val = tags[key];
    if (val && GROUP_MAP[key]?.[val]) return GROUP_MAP[key][val];
  }
  // Fallback: group by tag key
  if (tags.historic) return 'historic';
  if (tags.natural) return 'nature';
  if (tags.leisure) return 'leisure';
  if (tags.tourism) return 'cultural';
  return 'other';
}

// ── BizData API ──
async function fetchBizDataCategory(location, category, radiusKm) {
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
      group: 'cultural',
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
function buildOverpassQuery(lat, lon, radius) {
  const parts = [];
  for (const { tag, value } of ALL_OVERNPASS_TYPES) {
    parts.push(`node["${tag}"="${value}"](around:${radius},${lat},${lon});`);
    parts.push(`way["${tag}"="${value}"](around:${radius},${lat},${lon});`);
  }
  return `[out:json][timeout:30];(\n  ${parts.join('\n  ')}\n);out center 40;`;
}

async function fetchOverpassPois(lat, lon, radius) {
  const query = buildOverpassQuery(lat, lon, radius);
  try {
    const res = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'beta-app-travel/1.0 (cultural-pois)',
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
        const type = tags.tourism || tags.historic || tags.leisure || tags.natural || tags.amenity || tags.sport || 'unknown';
        return {
          name: tags.name?.trim() || tags['name:pt']?.trim() || tags['name:en']?.trim() || null,
          type,
          group: detectPoiGroup(tags),
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

  const mode = BIZDATA_ONLY ? 'só BizData' : 'BizData + Overpass';
  console.log(`POIs culturais — ${mode}`);
  console.log(`  ${slice.length} destinos | Raio: ${RADIUS / 1000} km | Resume: ${RESUME}\n`);

  // ── Determine which destinations to process ──
  let todo;

  if (RESUME) {
    if (BIZDATA_ONLY) {
      // Skip dests that already have all BizData categories
      todo = slice.filter((d) => {
        const e = d._enriched;
        return !e?.bizdata || e.bizdata.length < BIZDATA_CATEGORIES.length;
      });
    } else {
      // Need Overpass: dests that don't have overpass enrichment yet
      const needOverpass = slice.filter((d) => !d._enriched?.overpass);
      if (needOverpass.length === 0) {
        console.log('✅ All destinations already have Overpass enrichment');
        return;
      }
      todo = needOverpass;
    }
    console.log(`  🔄 Retomando: ${todo.length} destinos pendentes\n`);
  } else {
    todo = slice;
  }

  let ok = 0;
  let empty = 0;
  let totalPois = 0;
  let rateLimited = false;
  let overpassDelay = 10000; // ms, adaptive

  for (let i = 0; i < todo.length; i++) {
    const dest = todo[i];
    const pct = RESUME ? `${i + 1}/${todo.length}` : `${i + 1}/${slice.length}`;
    process.stdout.write(`  [${pct}] ${dest.nome}... `);

    // ── Phase 1: BizData (fast, no rate limits) ──
    let poiList = Array.isArray(dest.pois) ? dest.pois : [];
    const enriched = dest._enriched ?? {};
    let bizDataAdded = 0;

    for (const cat of BIZDATA_CATEGORIES) {
      if (enriched.bizdata?.includes(cat)) continue; // already fetched this category

      const results = await fetchBizDataCategory(`${dest.latitude},${dest.longitude}`, cat, radiusKm);
      const before = poiList.length;
      poiList = mergePois(poiList, results);
      bizDataAdded += poiList.length - before;

      // Track in enriched
      if (!enriched.bizdata) enriched.bizdata = [];
      if (!enriched.bizdata.includes(cat)) enriched.bizdata.push(cat);

      await new Promise((r) => setTimeout(r, 80));
    }

    // ── Phase 2: Overpass (rate-limited) ──
    let overpassAdded = 0;
    if (!BIZDATA_ONLY && !rateLimited && !enriched.overpass) {
      // Wait adaptive delay before Overpass query
      await new Promise((r) => setTimeout(r, overpassDelay));

      const overpassResults = await fetchOverpassPois(dest.latitude, dest.longitude, RADIUS);

      if (overpassResults === 'RATE_LIMITED') {
        console.log('⏸ rate-limited (Overpass)');
        rateLimited = true;
        enriched.overpassRateLimited = true;
        // Double delay for next run
        overpassDelay = Math.min(overpassDelay * 2, 30000);
      } else {
        const before = poiList.length;
        poiList = mergePois(poiList, overpassResults);
        overpassAdded = poiList.length - before;
        enriched.overpass = true;
        // If succeeded, gradually reduce delay (floor at 5s)
        overpassDelay = Math.max(overpassDelay - 500, 5000);
      }
    }

    // Store enriched state
    dest._enriched = enriched;

    // Store POIs
    if (poiList.length > 0) {
      dest.pois = poiList;
      ok++;
      totalPois += poiList.length;
      const parts = [];
      if (bizDataAdded) parts.push(`+${bizDataAdded} BizData`);
      if (overpassAdded) parts.push(`+${overpassAdded} Overpass`);
      console.log(`✅ ${poiList.length} POIs${parts.length ? ' (' + parts.join(', ') + ')' : ''}`);
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
  bundle.meta.culturalPoisEnrich = {
    generatedAt: new Date().toISOString(),
    radius: RADIUS,
    processed: ok + empty,
    withPois: ok,
    empty,
    totalPois,
    rateLimited,
    bizdataOnly: BIZDATA_ONLY,
  };
  writeFileSync(BUNDLE, JSON.stringify(bundle));

  console.log(
    `\n✅ Guardado: ${BUNDLE}` +
    `\n  Destinos com POIs: ${ok}` +
    `\n  Sem POIs: ${empty}` +
    `\n  Total POIs: ${totalPois}` +
    `\n  Rate-limited: ${rateLimited}` +
    (rateLimited ? `\n  ➡ Run again: npm run travel:demo:enrich-cultural-pois -- --resume` : ''),
  );
}

main().catch((e) => {
  console.error('\n❌ Fatal:', e);
  process.exit(1);
});
