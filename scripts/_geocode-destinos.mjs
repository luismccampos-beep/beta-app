#!/usr/bin/env node
/**
 * Fase B — Geocodifica destinos (não hotéis individuais).
 *
 * Geocoders (por ordem de preferência):
 *   1. OpenCage (se OPENCAGE_API_KEY definida, 2.500 req/dia grátis, 1 req/s)
 *   2. Nominatim (fallback, 1 req/s, ~0.3s/req)
 *
 * NOTA: Photon (komoot) está inacessível nesta rede (timeout).
 *
 * Estratégia 2-pass:
 *   Pass 1: nome apenas (sem filtro de país) — funciona para 95%+ dos destinos
 *   Pass 2: nome + país (apenas para not-found do Pass 1)
 *
 * Uso:
 *   node scripts/_geocode-destinos.mjs                           # todos os destinos sem coords
 *   node scripts/_geocode-destinos.mjs --limit=100               # max destinos
 *   node scripts/_geocode-destinos.mjs --dry-run --limit=20      # testar
 *   node scripts/_geocode-destinos.mjs --country=PT              # só Portugal
 *   node scripts/_geocode-destinos.mjs --status                  # estado actual
 */
import { PrismaClient } from '@prisma/client';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync, existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const USER_AGENT = 'beta-app-dest-geocoder/1.0 (contact: admin@akmleva.com)';

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL } },
});

// ---------------------------------------------------------------------------
// Env
// ---------------------------------------------------------------------------
function loadEnv() {
  for (const file of ['.env.local', '.env']) {
    const path = resolve(ROOT, file);
    if (!existsSync(path)) continue;
    for (const line of readFileSync(path, 'utf8').split('\n')) {
      const m = line.match(/^\s*([^#=\s]+)\s*=\s*(.+)/);
      if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '');
    }
  }
}
loadEnv();

const OPENCAGE_API_KEY = process.env.OPENCAGE_API_KEY || '';
const HAS_OPENCAGE = OPENCAGE_API_KEY.length >= 30;

const LOCATIONIQ_API_KEY = process.env.LOCATIONIQ_API_KEY || '';
const HAS_LOCATIONIQ = LOCATIONIQ_API_KEY.length >= 10;

// ---------------------------------------------------------------------------
// Args
// ---------------------------------------------------------------------------
function parseArgs() {
  const a = {};
  for (let i = 2; i < process.argv.length; i++) {
    const arg = process.argv[i];
    if (arg === '--dry-run' || arg === '--status') {
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
// Geocoding: LocationIQ (primary)
// ---------------------------------------------------------------------------
// API compatível com Nominatim (JSON array com lat/lon/type)
// https://locationiq.com/docs

async function locationiqFetch(query, countryCodes) {
  const params = new URLSearchParams({
    key: LOCATIONIQ_API_KEY,
    q: query,
    format: 'json',
    limit: '5',
    'accept-language': 'pt',
  });
  if (countryCodes) params.set('countrycodes', countryCodes);

  try {
    const resp = await fetch(`https://us1.locationiq.com/v1/search?${params}`, {
      signal: AbortSignal.timeout(15000),
    });
    if (!resp.ok) {
      if (resp.status === 429) return 'RATE_LIMITED';
      if (resp.status === 402 || resp.status === 403) return 'QUOTA_EXCEEDED';
      return null;
    }
    const data = await resp.json();
    if (!data?.length) return null;

    // Preferir resultados com type=city/town/village/administrative
    let best = null;
    for (const item of data) {
      const type = item.type || '';
      const result = { lat: parseFloat(item.lat), lon: parseFloat(item.lon) };
      if (!Number.isFinite(result.lat) || !Number.isFinite(result.lon)) continue;
      const priority = { city: 4, town: 3, village: 2, administrative: 1 };
      const p = priority[type] || 0;
      if (!best || p > (best._p || 0)) {
        best = { ...result, _p: p };
      }
    }
    return best ? { lat: best.lat, lon: best.lon } : null;
  } catch {
    return null;
  }
}

async function locationiqPass1(destName) {
  return locationiqFetch(destName, null);
}

async function locationiqPass2(destName, destCountry, countryCode) {
  const isGoodCountry = countryCode && VALID_COUNTRY.test(countryCode) && countryCode !== 'XX';

  // A: nome + país
  const fullQuery = [destName, destCountry].filter(Boolean).join(', ');
  if (fullQuery !== destName) {
    const r = await locationiqFetch(fullQuery, null);
    if (r) return r;
    await new Promise((r) => setTimeout(r, 1000));
  }

  // B: nome + countrycodes
  if (isGoodCountry) {
    const r = await locationiqFetch(destName, countryCode.toLowerCase());
    if (r) return r;
    await new Promise((r) => setTimeout(r, 1000));
  }

  // C: nome base (ex: "Barcelona" de "Barcelona/Ciutat Vella")
  const baseName = destName.split('/')[0]?.trim();
  if (baseName && baseName !== destName && baseName.length >= 3) {
    const r = await locationiqFetch(baseName, isGoodCountry ? countryCode.toLowerCase() : null);
    if (r) return r;
  }

  return null;
}

// ---------------------------------------------------------------------------
// Geocoding: OpenCage
// ---------------------------------------------------------------------------
const VALID_COUNTRY = /^[A-Z]{2}$/;

async function opencageFetch(query, countryCode) {
  const params = new URLSearchParams({
    q: query,
    key: OPENCAGE_API_KEY,
    limit: '3',
    language: 'pt',
    no_annotations: '1',
  });
  if (countryCode && VALID_COUNTRY.test(countryCode) && countryCode !== 'XX') {
    params.set('countrycode', countryCode.toLowerCase());
  }

  const url = `https://api.opencagedata.com/geocode/v1/json?${params}`;

  try {
    const resp = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
      signal: AbortSignal.timeout(15000),
    });
    if (!resp.ok) {
      if (resp.status === 429) return 'RATE_LIMITED';
      // 402 = daily quota exceeded
      if (resp.status === 402) return 'QUOTA_EXCEEDED';
      return null;
    }
    const data = await resp.json();
    if (!data?.results?.length) return null;

    // Preferir resultados com _type=city/town/village/administrative
    let best = null;
    for (const item of data.results) {
      const comp = item.components || {};
      const type = comp._type || '';
      const geo = item.geometry || {};
      if (geo.lat == null || geo.lng == null) continue;
      const result = { lat: geo.lat, lon: geo.lng };

      const priority = { city: 4, town: 3, village: 2, administrative: 1 };
      const p = priority[type] || 0;
      if (!best || p > (best._p || 0)) {
        best = { ...result, _p: p };
      }
    }
    return best ? { lat: best.lat, lon: best.lon } : null;
  } catch {
    return null;
  }
}

// Pass 1: nome apenas, sem filtro de país
async function opencagePass1(destName) {
  return opencageFetch(destName, null);
}

// Pass 2: nome + país, countrycodes, nome base
async function opencagePass2(destName, destCountry, countryCode) {
  const isGoodCountry = countryCode && VALID_COUNTRY.test(countryCode) && countryCode !== 'XX';

  // A: nome + país
  const fullQuery = [destName, destCountry].filter(Boolean).join(', ');
  if (fullQuery !== destName) {
    const r = await opencageFetch(fullQuery, isGoodCountry ? countryCode : null);
    if (r) return r;
    await new Promise((r) => setTimeout(r, 1000));
  }

  // B: nome + countrycodes
  if (isGoodCountry) {
    const r = await opencageFetch(destName, countryCode);
    if (r) return r;
    await new Promise((r) => setTimeout(r, 1000));
  }

  // C: nome base (ex: "Barcelona" de "Barcelona/Ciutat Vella")
  const baseName = destName.split('/')[0]?.trim();
  if (baseName && baseName !== destName && baseName.length >= 3) {
    const r = await opencageFetch(baseName, isGoodCountry ? countryCode : null);
    if (r) return r;
  }

  return null;
}

// ---------------------------------------------------------------------------
// Geocoding: Nominatim (fallback final, só se os outros falharem)
// ---------------------------------------------------------------------------
async function nominatimFetch(query, countryCodes) {
  const params = new URLSearchParams({
    q: query,
    format: 'json',
    limit: '5',
    'accept-language': 'pt',
  });
  if (countryCodes) params.set('countrycodes', countryCodes);

  try {
    const resp = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
      headers: { 'User-Agent': USER_AGENT, 'Referer': 'https://beta-app.local' },
      signal: AbortSignal.timeout(15000),
    });
    if (!resp.ok) {
      if (resp.status === 429) return 'RATE_LIMITED';
      return null;
    }
    const data = await resp.json();
    if (!data?.length) return null;

    let best = null;
    for (const item of data) {
      const type = item.type || '';
      const result = { lat: parseFloat(item.lat), lon: parseFloat(item.lon) };
      const priority = { city: 4, town: 3, village: 2, administrative: 1 };
      const p = priority[type] || 0;
      if (!best || p > (best._p || 0)) {
        best = { ...result, _p: p };
      }
    }
    return best ? { lat: best.lat, lon: best.lon } : null;
  } catch {
    return null;
  }
}

async function nominatimPass1(destName) {
  return nominatimFetch(destName, null);
}

async function nominatimPass2(destName, destCountry, countryCode) {
  const isGoodCountry = countryCode && VALID_COUNTRY.test(countryCode) && countryCode !== 'XX';

  const fullQuery = [destName, destCountry].filter(Boolean).join(', ');
  if (fullQuery !== destName) {
    const r = await nominatimFetch(fullQuery, null);
    if (r) return r;
    await new Promise((r) => setTimeout(r, 1000));
  }

  if (isGoodCountry) {
    const r = await nominatimFetch(destName, countryCode.toLowerCase());
    if (r) return r;
    await new Promise((r) => setTimeout(r, 1000));
  }

  const baseName = destName.split('/')[0]?.trim();
  if (baseName && baseName !== destName && baseName.length >= 3) {
    const r = await nominatimFetch(baseName, isGoodCountry ? countryCode.toLowerCase() : null);
    if (r) return r;
  }

  return null;
}

// ---------------------------------------------------------------------------
// Status
// ---------------------------------------------------------------------------
async function printStatus() {
  const [total, withCoords, pending] = await Promise.all([
    prisma.wvDestination.count(),
    prisma.wvDestination.count({ where: { latitude: { not: null }, longitude: { not: null } } }),
    prisma.wvDestination.count({ where: { latitude: null, longitude: null } }),
  ]);

  console.log(`\n=== wv_destinations geocoding status ===`);
  console.log(`  Total destinos           : ${total.toLocaleString()}`);
  console.log(`  Com coordenadas          : ${withCoords.toLocaleString()}  (${(withCoords / total * 100).toFixed(1)}%)`);
  console.log(`  Sem coordenadas          : ${pending.toLocaleString()}`);

  const hotImpact = await prisma.$queryRawUnsafe(`
    SELECT COUNT(*)::int AS total
    FROM wv_hotels h
    JOIN wv_destinations d ON d.id = h.destino_id
    WHERE h.latitude IS NULL AND h.longitude IS NULL
      AND d.latitude IS NULL AND d.longitude IS NULL
  `);
  if (hotImpact?.length) {
    const h = hotImpact[0]?.total ?? 0;
    console.log(`  Hotéis que seriam resolvidos: ${h.toLocaleString()}`);
    if (h > 0) console.log(`  Tempo estimado (1 req/s): ~${Math.ceil(h / 3600 * 1.02)}h`);
  }
}

// ---------------------------------------------------------------------------
// Fetch destinos pendentes
// ---------------------------------------------------------------------------
async function fetchDestinos({ limit, country }) {
  const where = { latitude: null, longitude: null };
  if (country && /^[A-Z]{2}$/.test(country)) where.paisCode = country;
  return prisma.wvDestination.findMany({
    where,
    select: { id: true, nome: true, pais: true, paisCode: true, slug: true },
    orderBy: { id: 'asc' },
    ...(limit ? { take: limit } : {}),
  });
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const A = parseArgs();

  try {
    if (A.status) {
      await printStatus();
      return;
    }

    const DRY_RUN = !!A['dry-run'];
    const LIMIT = parseInt(A.limit || '0');
    const COUNTRY = (A.country || '').toUpperCase();
    const BATCH_SIZE = 200;

    const providers = [];
    if (HAS_LOCATIONIQ) providers.push('LocationIQ (5.000 req/dia)');
    if (HAS_OPENCAGE) providers.push('OpenCage (2.500 req/dia)');
    providers.push('Nominatim (fallback, 1 req/s)');
    const geocoderName = providers.join(' → ');
    console.log(`\n=== Fase B: Geocoding de destinos ===`);
    console.log(`  dry-run=${DRY_RUN}  limit=${LIMIT || 'ALL'}  country=${COUNTRY || 'ALL'}`);
    if (HAS_LOCATIONIQ) {
      console.log(`  LocationIQ: 5.000 req/dia grátis (chave configurada)`);
    } else {
      console.log(`  ⚠ LOCATIONIQ_API_KEY não definida.`);
      console.log(`  Para LocationIQ: adiciona LOCATIONIQ_API_KEY ao .env.local`);
    }
    if (HAS_OPENCAGE) {
      console.log(`  OpenCage: 2.500 req/dia grátis (chave configurada)`);
    }
    console.log(`  Ordem: ${geocoderName}`);
    console.log();

    await printStatus();
    console.log();

    const destinos = await fetchDestinos({
      limit: LIMIT || undefined,
      country: COUNTRY || undefined,
    });

    const total = destinos.length;
    console.log(`Destinos a processar: ${total.toLocaleString()}`);
    if (total === 0) {
      console.log('Nada a fazer.');
      return;
    }

    // ── Runner de pass ──
    async function runPass(destinosList, passName, geocodeFn, quotaExceededRef) {
      console.log(`\n  — Pass ${passName}: ${destinosList.length} destinos —`);
      const passResults = [];
      let passFound = 0;
      let passNotFound = 0;
      let passRateLimited = false;
      const passStart = Date.now();

      for (let i = 0; i < destinosList.length; i++) {
        const dest = destinosList[i];
        if (passRateLimited) {
          passResults.push({ id: dest.id, lat: null, lon: null });
          passNotFound++;
          continue;
        }

        const result = await geocodeFn(dest.nome, dest.pais, dest.paisCode);

        if (result === 'RATE_LIMITED') {
          console.log(`\n    ⚠ Rate-limited (429). A interromper Pass ${passName}.`);
          passRateLimited = true;
          passResults.push({ id: dest.id, lat: null, lon: null });
          passNotFound++;
          continue;
        }
        if (result === 'QUOTA_EXCEEDED') {
          console.log(`\n    ⚠ Quota OpenCage excedida. A interromper Pass ${passName}.`);
          if (quotaExceededRef) quotaExceededRef.value = true;
          passResults.push({ id: dest.id, lat: null, lon: null });
          passNotFound++;
          continue;
        }

        if (result) {
          passResults.push({ id: dest.id, lat: result.lat, lon: result.lon });
          passFound++;
        } else {
          passResults.push({ id: dest.id, lat: null, lon: null });
          passNotFound++;
        }

        const pElapsed = Math.max(1, (Date.now() - passStart) / 1000);
        const pRate = (i + 1) / pElapsed;
        const pPct = (((i + 1) / destinosList.length) * 100).toFixed(1);
        process.stdout.write(`\r\x1b[K    [${i + 1}/${destinosList.length} (${pPct}%) | found: ${passFound} | ${pRate.toFixed(2)}/s]`);

        await new Promise((r) => setTimeout(r, 1000));
      }
      console.log();
      return { results: passResults, found: passFound, notFound: passNotFound, rateLimited: passRateLimited };
    }

    const startTime = Date.now();
    let found = 0;
    let notFound = 0;
    const allResults = [];
    const quotaExceeded = { value: false };

    // ── Primary geocoder chain: LocationIQ → OpenCage → Nominatim ──
    function getPrimaryGeocoder() {
      if (HAS_LOCATIONIQ && !quotaExceeded.value) {
        return { pass1: async (nome) => locationiqPass1(nome), name: 'LocationIQ' };
      }
      if (HAS_OPENCAGE && !quotaExceeded.value) {
        return { pass1: async (nome) => opencagePass1(nome), name: 'OpenCage' };
      }
      return { pass1: async (nome) => nominatimPass1(nome), name: 'Nominatim' };
    }

    function getSecondaryGeocoder() {
    // LocationIQ available and not rate-limited
    if (HAS_LOCATIONIQ && !quotaExceeded.value) {
      return { 
        pass2: async (nome, pais, paisCode) => locationiqPass2(nome, pais, paisCode),
        name: 'LocationIQ',
        fallbackPass1: HAS_OPENCAGE ? async (nome) => opencagePass1(nome) : async (nome) => nominatimPass1(nome),
        fallbackName: HAS_OPENCAGE ? 'OpenCage' : 'Nominatim',
      };
    }
    // LocationIQ quota exceeded but OpenCage still available
    if (HAS_LOCATIONIQ && quotaExceeded.value && HAS_OPENCAGE) {
      return {
        pass2: async (nome, pais, paisCode) => opencagePass2(nome, pais, paisCode),
        name: 'OpenCage',
        fallbackPass1: async (nome) => nominatimPass1(nome),
        fallbackName: 'Nominatim',
      };
    }
    // OpenCage available
    if (HAS_OPENCAGE) {
      return {
        pass2: async (nome, pais, paisCode) => opencagePass2(nome, pais, paisCode),
        name: 'OpenCage',
        fallbackPass1: async (nome) => nominatimPass1(nome),
        fallbackName: 'Nominatim',
      };
    }
    // Ultimate fallback: Nominatim
    return {
      pass2: async (nome, pais, paisCode) => nominatimPass2(nome, pais, paisCode),
      name: 'Nominatim',
    };
  }

    let primary = getPrimaryGeocoder();
    
    // ── Pass 1 — nome apenas ──
    const pass1 = await runPass(destinos, `1 (nome apenas, ${primary.name})`, primary.pass1, quotaExceeded);
    found += pass1.found;
    notFound += pass1.notFound;
    allResults.push(...pass1.results);

    // ── Se quota excedida ou rate-limited, tenta próximo geocoder ──
    const needsFallback = quotaExceeded.value || pass1.rateLimited;
    if (needsFallback && (HAS_LOCATIONIQ || HAS_OPENCAGE)) {
      const remainingDest = pass1.results
        .map((r, i) => ({ id: r.id, lat: r.lat, idx: i }))
        .filter((r) => r.lat == null)
        .map((nf) => destinos.find((d) => d.id === nf.id))
        .filter(Boolean);

      if (remainingDest.length > 0) {
        // Escolher próximo geocoder disponível (saltar o que falhou)
        let nextGeocoder = null;
        if (primary.name === 'LocationIQ' && HAS_OPENCAGE) {
          nextGeocoder = { pass1: async (nome) => opencagePass1(nome), name: 'OpenCage' };
        } else if (primary.name === 'LocationIQ' || primary.name === 'OpenCage') {
          nextGeocoder = { pass1: async (nome) => nominatimPass1(nome), name: 'Nominatim' };
        }
        
        if (nextGeocoder) {
          const reason = quotaExceeded.value ? 'Quota excedida' : 'Rate-limited (429)';
          console.log(`\n  ⚠ ${reason} no ${primary.name}. A repetir Pass 1 com ${nextGeocoder.name}...`);
          const pass1b = await runPass(remainingDest, `1b (nome apenas, ${nextGeocoder.name})`, nextGeocoder.pass1);
          found += pass1b.found;
          notFound -= pass1b.found;
          for (const r of pass1b.results) {
            if (r.lat != null) {
              const existing = allResults.find((x) => x.id === r.id);
              if (existing) { existing.lat = r.lat; existing.lon = r.lon; }
            }
          }
        }
      }
    }

    // ── Pass 2: retentar not-found com país ──
    const pass1NotFounds = allResults.filter((r) => r.lat == null);
    if (pass1NotFounds.length > 0 && !pass1.rateLimited) {
      const pass2Destinos = pass1NotFounds
        .map((nf) => destinos.find((d) => d.id === nf.id))
        .filter(Boolean);

      if (pass2Destinos.length > 0) {
        const secondary = getSecondaryGeocoder();
        const pass2 = await runPass(pass2Destinos, `2 (nome + país, ${secondary.name})`, secondary.pass2, quotaExceeded);
        found += pass2.found;
        notFound -= pass2.found;

        for (const r of pass2.results) {
          if (r.lat != null) {
            const existing = allResults.find((x) => x.id === r.id);
            if (existing) { existing.lat = r.lat; existing.lon = r.lon; }
          }
        }
      }
    }

    const foundDest = allResults.filter((r) => r.lat != null);
    const notFoundDest = allResults.filter((r) => r.lat == null);
    const elapsed = Math.max(1, (Date.now() - startTime) / 1000);
    const rate = total / elapsed;

    console.log();
    console.log(`\n  Encontrados : ${foundDest.length}  (${(foundDest.length / total * 100).toFixed(1)}%)`);
    console.log(`  Não encont. : ${notFoundDest.length}`);
    console.log(`  Tempo       : ${elapsed.toFixed(0)}s (${rate.toFixed(2)} destinos/s)`);

    if (foundDest.length > 0) {
      const hotImpact = await prisma.$queryRawUnsafe(`
        SELECT COUNT(*)::int AS total
        FROM wv_hotels h
        JOIN wv_destinations d ON d.id = h.destino_id
        WHERE h.latitude IS NULL AND h.longitude IS NULL
          AND d.id = ANY($1::int[])
      `, foundDest.map((r) => r.id));
      console.log(`  Impacto previsto: ~${(hotImpact[0]?.total ?? 0).toLocaleString()} hotéis receberão coordenadas`);
    }

    if (!DRY_RUN && foundDest.length > 0) {
      console.log(`\n  Escrevendo ${foundDest.length} coordenadas nos destinos...`);
      let committed = 0;
      for (let i = 0; i < foundDest.length; i += BATCH_SIZE) {
        const batch = foundDest.slice(i, i + BATCH_SIZE);
        const cases = batch.map((r) => `(${r.id}::int, ${r.lat}::real, ${r.lon}::real)`).join(',\n');
        await prisma.$executeRawUnsafe(`
          UPDATE wv_destinations AS d
          SET latitude = v.lat, longitude = v.lon
          FROM (VALUES ${cases}) AS v(id, lat, lon)
          WHERE d.id = v.id
        `);
        committed += batch.length;
        process.stdout.write(`\r    destinos atualizados: ${committed}/${foundDest.length}`);
      }
      console.log();

      const destIds = foundDest.map((r) => r.id);
      const applyResult = await prisma.$executeRawUnsafe(`
        UPDATE wv_hotels AS h
        SET latitude = d.latitude, longitude = d.longitude, fonte = 'geo_from_dest'
        FROM wv_destinations AS d
        WHERE h.destino_id = d.id
          AND h.latitude IS NULL AND h.longitude IS NULL
          AND d.id = ANY($1::int[])
      `, destIds);
      console.log(`  ✅ ${applyResult} hotéis atualizados com coordenadas dos destinos`);
    } else {
      console.log(`  (dry-run — nada foi escrito na BD)`);
    }

    console.log();
    await printStatus();

  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
