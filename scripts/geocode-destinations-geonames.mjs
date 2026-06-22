#!/usr/bin/env node
/**
 * geocode-destinations-geonames.mjs
 *
 * Descarrega o ficheiro cities15000.zip do GeoNames (todas as cidades com
 * população > 15.000), extrai entradas com feature class P (populated places),
 * faz matching por nome normalizado (fold) + código de país,
 * e atualiza as coordenadas dos destinos na BD — SEM chamadas a APIs externas!
 *
 * Estratégia: processamento país-a-país com índices locais para performance.
 *
 * Estratégia de matching (por ordem de confiança):
 *   1. Exact match (fold normalizado) + país
 *   2. Substring match (nome contém ou é contido) + país
 *   3. Fuzzy match (Dice coefficient >= 0.80) + país
 *   4. Fallback: match só pelo nome (sem país) se único resultado
 *
 * Uso:
 *   node scripts/geocode-destinations-geonames.mjs
 *   node scripts/geocode-destinations-geonames.mjs --dry-run --limit=500
 *   node scripts/geocode-destinations-geonames.mjs --country=PT
 *   node scripts/geocode-destinations-geonames.mjs --status
 *   node scripts/geocode-destinations-geonames.mjs --skip-download
 *   node scripts/geocode-destinations-geonames.mjs --fast (só exact match)
 *
 * Opções:
 *   --dry-run              Não escreve na BD
 *   --limit=N              Máx destinos a processar (0 = todos)
 *   --country=XX           Apenas um país (ISO alpha-2, ex: PT, FR, BR)
 *   --batch-size=N         DB commit batch size (default 200)
 *   --status               Mostra estado actual e distribuição por país
 *   --verbose              Mostra progresso detalhado por país
 *   --skip-download        Usa cache local (não volta a descarregar)
 *   --fast                 Apenas exact match (muito mais rápido, ~90% eficácia)
 *   --min-match-score=N    Score mínimo para fuzzy match (0.0-1.0, default 0.80)
 */

import { PrismaClient } from '@prisma/client';
import AdmZip from 'adm-zip';
import { existsSync, mkdirSync, writeFileSync, readFileSync, readdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// ---------------------------------------------------------------------------
// Project helpers
// ---------------------------------------------------------------------------
const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const CACHE_DIR = resolve(ROOT, 'data', 'geonames-cache');

import { loadProjectEnv } from './lib/load-env.mjs';
import { fold, nameSimilarity } from './lib/cost-of-living-data.mjs';

const BASE_URL = 'https://download.geonames.org/export/dump/';
const FONTE = 'geonames_cities';
const CITIES_FILE = 'cities5000'; // ~140k cities worldwide (pop > 5,000)

// ---------------------------------------------------------------------------
// Args
// ---------------------------------------------------------------------------
function parseArgs() {
  const a = {};
  for (let i = 2; i < process.argv.length; i++) {
    const arg = process.argv[i];
    if (arg === '--status' || arg === '--dry-run' || arg === '--verbose' || arg === '--skip-download' || arg === '--fast') {
      a[arg.slice(2)] = true;
    } else if (arg.startsWith('--')) {
      const eq = arg.indexOf('=');
      if (eq > 0) a[arg.slice(2, eq)] = arg.slice(eq + 1);
      else a[arg.slice(2)] = process.argv[++i] ?? true;
    }
  }
  return a;
}

// ---------------------------------------------------------------------------
// Download + extract city entries (feature class P) from GeoNames dump
// ---------------------------------------------------------------------------

async function downloadAndExtractCities(filename) {
  const cacheFile = join(CACHE_DIR, `${filename}-cities.json`);
  const zipFile = join(CACHE_DIR, `${filename}.zip`);

  // Try cache first
  if (existsSync(cacheFile)) {
    try {
      const data = JSON.parse(readFileSync(cacheFile, 'utf-8'));
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    } catch { /* fall through */ }
  }

  // Download ZIP
  const url = `${BASE_URL}${filename}.zip`;
  if (!existsSync(zipFile)) {
    console.log(`  📥 Descarregando ${filename}.zip (≈20 MB)...`);
    const resp = await fetch(url, { signal: AbortSignal.timeout(180_000) });
    if (!resp.ok) {
      throw new Error(`HTTP ${resp.status} for ${url}`);
    }
    mkdirSync(CACHE_DIR, { recursive: true });
    writeFileSync(zipFile, Buffer.from(await resp.arrayBuffer()));
    console.log(`  ✅ Download completo.`);
  } else {
    console.log(`  📦 Cache ZIP encontrado: ${zipFile}`);
  }

  // Extract .txt from ZIP
  console.log(`  🔍 Extraindo cidades (feature class P)...`);
  const zip = new AdmZip(zipFile);
  const entry = zip.getEntry(`${filename}.txt`);
  if (!entry) {
    const entries = zip.getEntries();
    const txtEntry = entries.find(e => e.entryName.endsWith('.txt'));
    if (!txtEntry) return [];
    console.log(`  📄 Usando entry: ${txtEntry.entryName}`);
    const text = zip.readAsText(txtEntry);
    return parseCityEntries(text, cacheFile);
  }

  const text = zip.readAsText(entry);
  return parseCityEntries(text, cacheFile);
}

function parseCityEntries(text, cacheFile) {
  const cities = [];
  const lines = text.split('\n');
  let skipped = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const cols = trimmed.split('\t');
    if (cols.length < 9) continue;
    if (cols[6]?.trim() !== 'P') continue;

    const name = (cols[1] || '').trim();
    const asciiName = (cols[2] || '').trim();
    const lat = parseFloat(cols[4]);
    const lon = parseFloat(cols[5]);
    const countryCode = (cols[8] || '').trim();

    if (!name || !Number.isFinite(lat) || !Number.isFinite(lon)) continue;
    if (Math.abs(lat) > 90 || Math.abs(lon) > 180) continue;
    if (!countryCode || countryCode.length !== 2) {
      skipped++;
      continue;
    }

    cities.push({
      name,
      asciiName,
      alternatenames: (cols[3] || '').split(',').map(s => s.trim()).filter(Boolean),
      lat,
      lon,
      countryCode,
      featureCode: (cols[7] || '').trim(),
      population: parseInt(cols[14] || '0', 10),
    });
  }

  console.log(`  📊 ${cities.length.toLocaleString()} cidades extraídas (${skipped} ignoradas sem country code)`);

  // Cache
  mkdirSync(CACHE_DIR, { recursive: true });
  writeFileSync(cacheFile, JSON.stringify(cities));
  return cities;
}

// ---------------------------------------------------------------------------
// Build country sub-index for fast matching
// ---------------------------------------------------------------------------

/**
 * Build a sub-index for a specific country, sorted by population descending.
 */
function buildSubIndex(geonamesCities, countryCode) {
  const cities = geonamesCities.filter(c => c.countryCode === countryCode);
  if (!cities.length) return new Map();

  // Sort by population descending
  cities.sort((a, b) => b.population - a.population);

  const index = new Map();
  for (const c of cities) {
    const keys = new Set();
    keys.add(fold(c.name));
    if (c.asciiName && c.asciiName !== c.name) keys.add(fold(c.asciiName));
    for (const alt of c.alternatenames.slice(0, 20)) {
      const f = fold(alt);
      if (f.length > 1) keys.add(f);
    }

    for (const key of keys) {
      if (!index.has(key)) index.set(key, []);
      index.get(key).push(c);
    }
  }

  return index;
}

/**
 * Match a destination nome against a country-specific geoIndex.
 * Returns { lat, lon, matchType } or null.
 */
function tryExact(key, geoIndex) {
  if (geoIndex.has(key)) {
    const result = pickFirst(geoIndex.get(key));
    if (result) return { ...result, matchType: 'exact' };
  }
  return null;
}

function trySubstring(key, geoIndex) {
  for (const [geoKey, entries] of geoIndex) {
    if (geoKey.length < 3 || key.length < 3) continue;
    if (geoKey.includes(key) || key.includes(geoKey)) {
      const result = pickFirst(entries);
      if (result) return { ...result, matchType: 'substring' };
    }
  }
  return null;
}

function tryFuzzy(key, geoIndex, minScore) {
  let bestScore = minScore;
  let best = null;
  if (key.length >= 4) {
    for (const [geoKey, entries] of geoIndex) {
      if (geoKey.length < 4) continue;
      const lenRatio = Math.min(key.length, geoKey.length) / Math.max(key.length, geoKey.length);
      if (lenRatio < 0.5) continue;

      const score = nameSimilarity(key, geoKey);
      if (score > bestScore) {
        bestScore = score;
        const result = pickFirst(entries);
        if (result) best = { ...result, matchType: 'fuzzy', score };
      }
    }
  }
  return best;
}

/**
 * Generate alternative keys for a destination name:
 * - Base name before '/'
 * - Base name before '(something)'
 * - Individual words for multi-word names
 * - Words split by 'and' or '&'
 */
function generateAltKeys(destNome) {
  const keys = [];
  const raw = destNome.trim();

  // Base before slash: "X/Y" -> "X"
  const slashIdx = raw.indexOf('/');
  if (slashIdx > 0) {
    keys.push(fold(raw.substring(0, slashIdx)));
  }

  // Base before parens: "X (Y)" -> "X"
  const parenIdx = raw.indexOf('(');
  if (parenIdx > 0) {
    keys.push(fold(raw.substring(0, parenIdx)));
  }

  // Try each word individually (for multi-word names)
  const words = fold(raw).split(/\s+/).filter(w => w.length >= 3);
  if (words.length > 1) {
    // Try full compound
    keys.push(words.join(''));
    // Try longest word
    const longest = [...words].sort((a, b) => b.length - a.length)[0];
    if (longest.length >= 4) keys.push(longest);
    // Also try individual words
    for (const w of words) {
      if (w.length >= 4) keys.push(w);
    }
  }

  // Handle "X and Y" -> try just "X", just "Y"
  const andIdx = raw.search(/\s+(and|&)\s+/i);
  if (andIdx > 0) {
    const left = fold(raw.substring(0, andIdx));
    const right = fold(raw.substring(andIdx).replace(/\s+(and|&)\s+/i, ''));
    if (left.length >= 3) keys.push(left);
    if (right.length >= 3) keys.push(right);
  }

  return [...new Set(keys)].filter(k => k && k.length >= 2);
}

const pickFirst = (entries) => {
  if (!entries?.length) return null;
  return { lat: entries[0].lat, lon: entries[0].lon };
};

function matchDestination(destNome, geoIndex, minScore, fastMode) {
  const key = fold(destNome);
  if (!key || key.length < 2) return null;

  // 1. Exact match on full name
  const exact = tryExact(key, geoIndex);
  if (exact) return exact;

  if (fastMode) return null;

  // 2. Try alternative keys (base before /, before parens, individual words)
  const altKeys = generateAltKeys(destNome);
  for (const altKey of altKeys) {
    if (altKey === key) continue;
    const altResult = tryExact(altKey, geoIndex);
    if (altResult) return altResult;
  }

  // 3. Substring match (full name + alts)
  const subResult = trySubstring(key, geoIndex);
  if (subResult) return subResult;

  for (const altKey of altKeys) {
    const altSub = trySubstring(altKey, geoIndex);
    if (altSub) return altSub;
  }

  // 4. Fuzzy match (full name + alts)
  const fuzzyResult = tryFuzzy(key, geoIndex, minScore);
  if (fuzzyResult) return fuzzyResult;

  for (const altKey of altKeys) {
    const altFuzzy = tryFuzzy(altKey, geoIndex, minScore);
    if (altFuzzy) return altFuzzy;
  }

  // 5. Word-by-word: try matching individual words against GeoNames
  // For multi-word names, if at least 2 words match individual cities, use the first
  if (altKeys.length > 1 || key.split(/\s+/).length > 1) {
    const words = key.split(/\s+/).filter(w => w.length >= 3);
    let wordMatch = null;
    let wordCount = 0;
    for (const w of words) {
      const wResult = tryExact(w, geoIndex) || tryFuzzy(w, geoIndex, minScore);
      if (wResult) {
        wordMatch = wResult;
        wordCount++;
      }
    }
    if (wordMatch && wordCount >= 2) {
      return { ...wordMatch, matchType: 'word_match' };
    }
  }

  return null;
}

// ---------------------------------------------------------------------------
// Status
// ---------------------------------------------------------------------------
async function printStatus(prisma) {
  console.log('\n══════════════════════════════════════════════════');
  console.log('  📊 Estado Geocoding — wv_destinations');
  console.log('══════════════════════════════════════════════════\n');

  const [total, withCoords, withoutCoords] = await Promise.all([
    prisma.wvDestination.count(),
    prisma.wvDestination.count({ where: { latitude: { not: null }, longitude: { not: null } } }),
    prisma.wvDestination.count({ where: { latitude: null, longitude: null } }),
  ]);

  const pct = total > 0 ? (withCoords / total * 100).toFixed(1) : '0.0';
  console.log(`  Total destinos       : ${total.toLocaleString()}`);
  console.log(`  Com coordenadas      : ${withCoords.toLocaleString()} (${pct}%)`);
  console.log(`  Sem coordenadas      : ${withoutCoords.toLocaleString()}\n`);

  // Distribution by country (top 20)
  const byCountry = await prisma.$queryRawUnsafe(`
    SELECT pais_code AS code, pais AS name, COUNT(*)::int AS pending
    FROM wv_destinations
    WHERE latitude IS NULL AND longitude IS NULL
    GROUP BY pais_code, pais
    ORDER BY pending DESC
    LIMIT 20
  `);

  if (byCountry?.length) {
    console.log('  Top 20 países com destinos sem coordenadas:');
    console.log('  ────────────────────────────────────────────────');
    for (const r of byCountry) {
      const code = (r.code || '??').padEnd(4);
      const name = (r.name || 'Desconhecido').padEnd(25);
      const count = String(Number(r.pending)).padStart(8);
      console.log(`   ${code} ${name} ${count}`);
    }
    console.log();
  }

  // Cache stats
  if (existsSync(CACHE_DIR)) {
    const files = readdirSync(CACHE_DIR).filter(f => f.includes('cities') && f.endsWith('.json'));
    console.log(`  Cache GeoNames cities: ${files.length} ficheiro(s) em ${CACHE_DIR}`);
  } else {
    console.log('  Cache GeoNames: vazio (corre o script para descarregar)');
  }
  console.log();
}

// ---------------------------------------------------------------------------
// Fetch pending destinations grouped by country
// ---------------------------------------------------------------------------
async function fetchPendingByCountry(prisma, country) {
  let query = `
    SELECT pais_code AS code, pais AS name, COUNT(*)::int AS total
    FROM wv_destinations
    WHERE latitude IS NULL AND longitude IS NULL
  `;
  if (country && /^[A-Z]{2}$/.test(country)) {
    query += ` AND pais_code = '${country}'`;
  }
  query += ` GROUP BY pais_code, pais ORDER BY total DESC`;

  return prisma.$queryRawUnsafe(query);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  loadProjectEnv(ROOT);
  const A = parseArgs();

  const prisma = new PrismaClient({
    datasources: {
      db: { url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL },
    },
  });

  try {
    // ── Status mode ──
    if (A.status) {
      await printStatus(prisma);
      return;
    }

    // ── Config ──
    const DRY_RUN = !!A['dry-run'];
    const COUNTRY = (A.country || '').toUpperCase();
    const LIMIT = parseInt(A.limit || '0') || 0;
    const BATCH_SIZE = Math.min(parseInt(A['batch-size'] || '200'), 1000);
    const VERBOSE = !!A.verbose;
    const SKIP_DOWNLOAD = !!A['skip-download'];
    const FAST_MODE = !!A.fast;
    const MIN_SCORE = parseFloat(A['min-match-score'] || '0.80');

    const matchLabel = FAST_MODE ? 'exact only (--fast)' : 'exact + substring + fuzzy';
    console.log('\n══════════════════════════════════════════════════');
    console.log('  🌍 Geocoding de Destinos via GeoNames Cities');
    console.log('══════════════════════════════════════════════════\n');
    console.log(`  dry-run=${DRY_RUN}  country=${COUNTRY || 'ALL'}  limit=${LIMIT || 'ALL'}`);
    console.log(`  batch-size=${BATCH_SIZE}  min-score=${MIN_SCORE}`);
    console.log(`  strategy=${matchLabel}  cache=${CACHE_DIR}\n`);

    await printStatus(prisma);

    const startTime = Date.now();

    // ── Download cities dump ──
    let geonamesCities;
    try {
      geonamesCities = await downloadAndExtractCities(CITIES_FILE);
    } catch (err) {
      console.log(`  ❌ Erro ao descarregar: ${err.message}`);
      console.log(`  Tenta: curl -o ${join(CACHE_DIR, `${CITIES_FILE}.zip`)} ${BASE_URL}${CITIES_FILE}.zip`);
      console.log(`  Depois corre com --skip-download\n`);
      process.exit(1);
    }

    if (!geonamesCities?.length) {
      console.log('  ❌ Nenhuma cidade encontrada no dump do GeoNames.');
      process.exit(1);
    }

    // ── Get pending destinations grouped by country ──
    const pendingByCountry = await fetchPendingByCountry(prisma, COUNTRY || undefined);

    if (!pendingByCountry?.length) {
      console.log('  ✅ Nenhum destino sem coordenadas encontrado!');
      return;
    }

    const totalPending = pendingByCountry.reduce((s, r) => s + Number(r.total), 0);
    console.log(`\n  🎯 ${totalPending.toLocaleString()} destinos pendentes em ${pendingByCountry.length} países.\n`);

    // ── Process country by country ──
    let totalFound = 0;
    let totalProcessed = 0;
    const matchBreakdown = { exact: 0, substring: 0, fuzzy: 0 };
    const allFound = [];
    const totalCountries = pendingByCountry.length;

    for (let ci = 0; ci < pendingByCountry.length; ci++) {
      const { code, name, total } = pendingByCountry[ci];
      const countryTotal = Number(total);
      const padName = (name || code || '').padEnd(22);

      console.log(`  [${ci + 1}/${totalCountries}] ${(code || '??').padEnd(3)} ${padName} ${countryTotal.toLocaleString().padStart(6)} destinos`);

      // Build country-specific index
      const geoIndex = buildSubIndex(geonamesCities, code);
      if (!geoIndex.size) {
        console.log(`    ⚠  Sem cidades GeoNames para ${code} — saltando.`);
        totalProcessed += countryTotal;
        continue;
      }

      if (VERBOSE) console.log(`    📥 ${geoIndex.size.toLocaleString()} nomes indexados`);

      // Fetch destinations for this country
      const destinos = await prisma.wvDestination.findMany({
        where: { latitude: null, longitude: null, paisCode: code },
        select: { id: true, nome: true, pais: true, paisCode: true, slug: true },
        orderBy: { id: 'asc' },
        ...(LIMIT > 0 ? { take: LIMIT } : {}),
      });

      if (!destinos.length) {
        console.log(`    ✅ Já processados`);
        continue;
      }

      // Match
      let countryFound = 0;
      const countryResults = [];
      for (const dest of destinos) {
        const match = matchDestination(dest.nome, geoIndex, MIN_SCORE, FAST_MODE);
        if (match) {
          countryResults.push({ id: dest.id, lat: match.lat, lon: match.lon });
          matchBreakdown[match.matchType] = (matchBreakdown[match.matchType] || 0) + 1;
          countryFound++;
        }
      }

      totalProcessed += destinos.length;
      totalFound += countryFound;
      const pct = destinos.length > 0 ? (countryFound / destinos.length * 100).toFixed(1) : '0.0';
      console.log(`    ✅ Match: ${countryFound}/${destinos.length} (${pct}%)`);

      if (VERBOSE && countryResults.length > 0) {
        // Show sample
        const sample = countryResults.slice(0, 5);
        for (const r of sample) {
          const d = destinos.find(x => x.id === r.id);
          if (d) console.log(`       ${d.nome} → ${r.lat.toFixed(5)}, ${r.lon.toFixed(5)}`);
        }
      }

      allFound.push(...countryResults);

      // Write batch for this country
      if (!DRY_RUN && countryResults.length > 0) {
        for (let i = 0; i < countryResults.length; i += BATCH_SIZE) {
          const batch = countryResults.slice(i, i + BATCH_SIZE);
          const cases = batch
            .map(r => `(${r.id}::int, ${r.lat}::real, ${r.lon}::real)`)
            .join(',\n');

          await prisma.$executeRawUnsafe(`
            UPDATE wv_destinations AS d
            SET latitude = v.lat, longitude = v.lon
            FROM (VALUES ${cases}) AS v(id, lat, lon)
            WHERE d.id = v.id
          `);
        }
      }

      // ETA
      const elapsed = Math.max(1, (Date.now() - startTime) / 1000);
      const rate = totalProcessed / elapsed;
      const remaining = pendingByCountry.slice(ci + 1).reduce((s, c) => s + Number(c.total), 0);
      const eta = rate > 0 ? Math.round(remaining / rate) : '?';
      process.stdout.write(`    ⏱  ${elapsed.toFixed(0)}s · ${rate.toFixed(1)} dest/s · ETA ${eta}s\n`);
    }

    // ── Propagate coords to hotels ──
    if (!DRY_RUN && allFound.length > 0) {
      const destIds = allFound.map(r => r.id);
      const applyResult = await prisma.$executeRawUnsafe(`
        UPDATE wv_hotels AS h
        SET latitude = d.latitude, longitude = d.longitude, fonte = 'geo_from_dest'
        FROM wv_destinations AS d
        WHERE h.destino_id = d.id
          AND h.latitude IS NULL AND h.longitude IS NULL
          AND d.id = ANY($1::int[])
      `, destIds);
      console.log(`\n  🏨 ${applyResult} hotéis atualizados com coordenadas dos destinos`);
    }

    // ── Summary ──
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
    const overallPct = totalPending > 0 ? (totalFound / totalPending * 100).toFixed(1) : '0.0';

    console.log('\n══════════════════════════════════════════════════');
    console.log('  ✅ Pipeline concluída!');
    console.log('══════════════════════════════════════════════════\n');
    console.log(`  Países processados : ${totalCountries}`);
    console.log(`  Destinos pendentes : ${totalPending.toLocaleString()}`);
    console.log(`  Com coordenadas    : ${totalFound.toLocaleString()} (${overallPct}%)`);
    console.log(`  Match breakdown    : exact=${matchBreakdown.exact} substring=${matchBreakdown.substring} fuzzy=${matchBreakdown.fuzzy}`);
    console.log(`  Tempo total        : ${elapsed}s\n`);

    if (DRY_RUN) {
      console.log('  🔍 (dry-run — nada foi alterado na BD)\n');
    }

    await printStatus(prisma);

  } finally {
    await prisma.$disconnect();
  }
}

main().catch(err => {
  console.error('❌ Fatal:', err);
  process.exit(1);
});
