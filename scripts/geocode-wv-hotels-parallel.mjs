#!/usr/bin/env node
/**
 * Parallel geocoding worker pool for wv_hotels — Opção C.
 *
 * Usa Photon (komoot) como primary geocoder com N workers concorrentes.
 * Nominatim como fallback para hotéis não encontrados.
 *
 * Performance estimada:
 *   10 workers × 5 req/s (delay 0.2s) = ~50 req/s
 *   304k hotéis ≈ 1.5h (vs ~7 dias do script original sequencial)
 *
 * Uso:
 *   node scripts/geocode-wv-hotels-parallel.mjs --workers=10 --limit=5000
 *   node scripts/geocode-wv-hotels-parallel.mjs --dry-run --limit=100
 *   node scripts/geocode-wv-hotels-parallel.mjs --country=PT --workers=8
 *   node scripts/geocode-wv-hotels-parallel.mjs --status
 *   node scripts/geocode-wv-hotels-parallel.mjs --retry-not-found --limit=500
 *
 * Flags:
 *   --workers=N         Workers concorrentes (default 10, max 50)
 *   --limit=N           Máx hotéis a processar (0 = todos)
 *   --country=XX        Filtrar por pais_code (ex: PT, FR, BR)
 *   --batch-size=N      DB commit batch size (default 500, max 2000)
 *   --delay=N           Segundos entre pedidos Photon (default 0.2)
 *   --dry-run           Não escreve na BD
 *   --retry-not-found   Retentar hotéis marcados geo_not_found
 *   --status            Mostrar progresso e sair
 *   --gmaps             Também tentar Google Maps Scraper (muito lento!)
 */
import { PrismaClient } from '@prisma/client';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync, existsSync } from 'fs';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const FONTE_FOUND = 'geo_found';
const FONTE_NOT_FOUND = 'geo_not_found';
const USER_AGENT = 'beta-app-hotel-geocoder/1.0 (contact: admin@akmleva.com)';

// ---------------------------------------------------------------------------
// Env & Args
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

function parseArgs() {
  const a = {};
  for (let i = 2; i < process.argv.length; i++) {
    const arg = process.argv[i];
    if (arg === '--status' || arg === '--dry-run' || arg === '--retry-not-found' || arg === '--gmaps') {
      a[arg.slice(2)] = true;
    } else if (arg.startsWith('--')) {
      const eq = arg.indexOf('=');
      if (eq > 0) { a[arg.slice(2, eq)] = arg.slice(eq + 1); }
      else { a[arg.slice(2)] = process.argv[++i] ?? true; }
    }
  }
  return a;
}

// ---------------------------------------------------------------------------
// Photon geocoding  (rápido, ~100ms/req, sem rate limit agressivo)
// ---------------------------------------------------------------------------
async function photonGeocode(query, lat, lon, countryCode) {
  const params = new URLSearchParams({ q: query, limit: '5' });
  // NÃO forçar lang='pt' — deixa Photon escolher o melhor match global
  if (lat != null && lon != null) {
    params.set('lat', String(lat));
    params.set('lon', String(lon));
  }
  // Restringir por país quando disponível (melhora muito a precisão)
  if (countryCode && countryCode.length === 2) {
    params.set('country', countryCode.toUpperCase());
  }
  const url = `https://photon.komoot.io/api/?${params}`;

  try {
    const resp = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
      signal: AbortSignal.timeout(10000),
    });
    if (!resp.ok) return null;
    const data = await resp.json();
    const features = data?.features ?? [];
    if (!features.length) return null;

    // Preferir resultados com tipo "amenity" (hotel, hostel, etc.)
    let best = null;
    for (const feat of features) {
      const coords = feat?.geometry?.coordinates;
      if (coords?.length !== 2 || typeof coords[0] !== 'number') continue;
      const props = feat?.properties ?? {};
      const isAmenity = props.osm_key === 'amenity' || props.osm_value === 'hotel';
      const result = { lat: coords[1], lon: coords[0] };
      if (isAmenity) return result; // match exato, devolve já
      if (!best) best = result;
    }
    return best;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Nominatim geocoding  (lento, 1 req/s, com viewbox)
// ---------------------------------------------------------------------------
async function nominatimGeocode(query, lat, lon) {
  const params = new URLSearchParams({
    q: query,
    format: 'json',
    limit: '1',
    'accept-language': 'pt',
  });
  if (lat != null && lon != null) {
    const half = 0.5;
    params.set('viewbox', `${lon - half},${lat + half},${lon + half},${lat - half}`);
  }
  const url = `https://nominatim.openstreetmap.org/search?${params}`;

  try {
    const resp = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
      signal: AbortSignal.timeout(10000),
    });
    if (!resp.ok) {
      if (resp.status === 429) return 'RATE_LIMITED';
      return null;
    }
    const data = await resp.json();
    if (!data?.length) return null;
    return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Estratégia de geocodificação: Photon → Nominatim → GMaps
// ---------------------------------------------------------------------------
async function geocodeHotel(hotel, nominatimDisabled) {
  const queryHotel = [hotel.nome, hotel.dest_nome].filter(Boolean).join(', ');
  const queryCity = hotel.dest_nome || '';
  const countryCode = hotel.dest_pais_code || '';

  // Photon 1: "Hotel, Cidade" + bias + country filter (rápido, sem rate limit)
  const p1 = await photonGeocode(queryHotel, hotel.dest_lat, hotel.dest_lon, countryCode);
  if (p1) return { ...p1, strategy: 'photon-hotel' };

  // Photon 2: "Cidade" + bias + country filter
  if (queryCity) {
    const p2 = await photonGeocode(queryCity, hotel.dest_lat, hotel.dest_lon, countryCode);
    if (p2) return { ...p2, strategy: 'photon-city' };
  }

  // Photon 3: fallback sem bias (só query + country)
  if (queryHotel) {
    const p3 = await photonGeocode(queryHotel, null, null, countryCode);
    if (p3) return { ...p3, strategy: 'photon-hotel-nobias' };
  }

  // Nominatim apenas se não estiver desativado por rate limit
  if (!nominatimDisabled) {
    const n1 = await nominatimGeocode(queryHotel, hotel.dest_lat, hotel.dest_lon);
    if (n1 === 'RATE_LIMITED') return { rateLimited: true };
    if (n1) return { ...n1, strategy: 'nominatim-hotel' };

    if (queryCity) {
      const n2 = await nominatimGeocode(queryCity, hotel.dest_lat, hotel.dest_lon);
      if (n2 === 'RATE_LIMITED') return { rateLimited: true };
      if (n2) return { ...n2, strategy: 'nominatim-city' };
    }
  }

  return null;
}

// ---------------------------------------------------------------------------
// Worker pool
// ---------------------------------------------------------------------------
class WorkerPool {
  constructor(hotels, workerFn, { workers = 10, delay = 0.2 } = {}) {
    this.hotels = [...hotels];
    this.workerFn = workerFn;
    this.workers = workers;
    this.delay = delay;
    this.results = [];
    this.processed = 0;
    this.found = 0;
    this.notFound = 0;
    this.total = hotels.length;
    this.startTime = Date.now();
    this.lastLogTime = 0;
    this.nominatimDisabled = false;
  }

  async run(onProgress) {
    const runner = async () => {
      while (this.hotels.length > 0) {
        const hotel = this.hotels.shift();
        if (hotel == null) break;

        const result = await this.workerFn(hotel, this.nominatimDisabled);

        // Se Nominatim retornou rate limit, desativar para todos os workers
        if (result?.rateLimited) {
          this.nominatimDisabled = true;
          console.log('\n  ⚠ Nominatim rate-limited (429). Desativado para resto da run.');
          // não conta como notFound — vai ficar pending para próxima run
          this.processed++;
          continue;
        }

        this.results.push({
          id: hotel.id,
          found: !!result,
          ...(result ? { lat: result.lat, lon: result.lon, strategy: result.strategy } : {}),
        });

        this.processed++;
        if (result) this.found++;
        else this.notFound++;

        // Log progresso a cada 3s
        const now = Date.now();
        if (now - this.lastLogTime > 3000 || this.processed === this.total) {
          this.lastLogTime = now;
          const elapsed = ((now - this.startTime) / 1000).toFixed(0);
          const rate = this.processed / ((now - this.startTime) / 1000);
          const pct = ((this.processed / this.total) * 100).toFixed(1);
          const remaining = this.total - this.processed;
          const eta = rate > 0 ? (remaining / rate).toFixed(0) : '?';
          if (onProgress) onProgress({
            processed: this.processed,
            total: this.total,
            pct,
            found: this.found,
            notFound: this.notFound,
            rate: rate.toFixed(1),
            elapsed,
            eta,
            nominatimDisabled: this.nominatimDisabled,
          });
        }

        // Delay entre pedidos (respeitar rate limits)
        if (this.delay > 0) {
          await new Promise((r) => setTimeout(r, this.delay * 1000));
        }
      }
    };

    const workers = Array.from({ length: this.workers }, () => runner());
    await Promise.all(workers);
  }
}

// ---------------------------------------------------------------------------
// Batch DB update helpers
// ---------------------------------------------------------------------------
async function batchUpdateFound(prisma, batch) {
  const cases = batch.map((r) =>
    `(${r.id}::int, ${r.lat}::real, ${r.lon}::real, '${FONTE_FOUND}')`
  ).join(',\n');
  await prisma.$executeRawUnsafe(`
    UPDATE wv_hotels AS h
    SET latitude = v.lat,
        longitude = v.lon,
        fonte = v.fonte
    FROM (VALUES
      ${cases}
    ) AS v(id, lat, lon, fonte)
    WHERE h.id = v.id
  `);
}

async function batchUpdateNotFound(prisma, ids) {
  if (ids.length === 0) return;
  const idList = ids.join(',');
  await prisma.$executeRawUnsafe(
    `UPDATE wv_hotels SET fonte = $1 WHERE id IN (${idList})`,
    FONTE_NOT_FOUND
  );
}

// ---------------------------------------------------------------------------
// Status
// ---------------------------------------------------------------------------
async function printStatus(prisma) {
  const [total, withCoords, foundMarked, notFoundMarked, wrongCountry, pending] = await Promise.all([
    prisma.wvHotel.count(),
    prisma.wvHotel.count({ where: { latitude: { not: null }, longitude: { not: null } } }),
    prisma.wvHotel.count({ where: { fonte: FONTE_FOUND } }),
    prisma.wvHotel.count({ where: { fonte: FONTE_NOT_FOUND } }),
    prisma.wvHotel.count({ where: { fonte: 'geo_wrong_country' } }),
    prisma.wvHotel.count({
      where: {
        latitude: null,
        longitude: null,
        OR: [
          { fonte: null },
          { fonte: { notIn: ['rejected_geo', FONTE_NOT_FOUND] } },
        ],
      },
    }),
  ]);

  console.log(`\n=== wv_hotels geocoding status ===`);
  console.log(`  Total hotels           : ${total.toLocaleString()}`);
  console.log(`  With coordinates       : ${withCoords.toLocaleString()}  (${(withCoords / total * 100).toFixed(1)}%)`);
  console.log(`  Marked geo_found       : ${foundMarked.toLocaleString()}`);
  console.log(`  Marked not_found       : ${notFoundMarked.toLocaleString()}`);
  console.log(`  Marked wrong_country   : ${wrongCountry.toLocaleString()}`);
  console.log(`  Pending (untried)      : ${pending.toLocaleString()}`);
  console.log(`  Still to geocode       : ${(total - withCoords).toLocaleString()}`);

  // Top destinos pendentes (usando placeholder seguro)
  const topPending = await prisma.$queryRawUnsafe(`
    SELECT d.nome, d.pais, d.pais_code, COUNT(*)::int AS total
    FROM wv_hotels h
    JOIN wv_destinations d ON d.id = h.destino_id
    WHERE h.latitude IS NULL AND h.longitude IS NULL
      AND (h.fonte IS NULL OR h.fonte NOT IN ('rejected_geo', $1))
    GROUP BY d.nome, d.pais, d.pais_code
    ORDER BY total DESC
    LIMIT 10
  `, FONTE_NOT_FOUND);
  if (topPending?.length) {
    console.log(`\n  Top destinos pendentes:`);
    for (const r of topPending) {
      console.log(`    ${r.nome} (${r.pais_code}): ${r.total.toLocaleString()} hotéis`);
    }
  }
}

// ---------------------------------------------------------------------------
// Fetch hotels to geocode
// ---------------------------------------------------------------------------
async function fetchHotels(prisma, { limit, country, retryNotFound }) {
  const where = {
    latitude: null,
    longitude: null,
  };

  if (retryNotFound) {
    where.fonte = FONTE_NOT_FOUND;
  } else {
    where.OR = [
      { fonte: null },
      { fonte: { notIn: ['rejected_geo', FONTE_NOT_FOUND] } },
    ];
  }

  // Filtrar por país na própria query Prisma (evita filtro em memória)
  if (country) {
    where.destino = { paisCode: country };
  }

  return prisma.wvHotel.findMany({
    where,
    select: {
      id: true,
      nome: true,
      destino: {
        select: {
          nome: true,
          pais: true,
          paisCode: true,
          latitude: true,
          longitude: true,
        },
      },
    },
    orderBy: { id: 'asc' },
    ...(limit ? { take: limit } : {}),
  }).then((hotels) =>
    hotels.map((h) => ({
      id: h.id,
      nome: h.nome,
      dest_nome: h.destino?.nome ?? '',
      dest_pais: h.destino?.pais ?? '',
      dest_pais_code: h.destino?.paisCode ?? '',
      dest_lat: h.destino?.latitude ?? null,
      dest_lon: h.destino?.longitude ?? null,
    }))
  );
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  loadEnv();
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
    const WORKERS = Math.min(Math.max(1, parseInt(A.workers || '10')), 50);
    const LIMIT = parseInt(A.limit || '0');
    const BATCH_SIZE = Math.min(parseInt(A['batch-size'] || '500'), 2000);
    const DRY_RUN = !!A['dry-run'];
    const COUNTRY = (A.country || '').toUpperCase();
    const RETRY_NOT_FOUND = !!A['retry-not-found'];
    const DELAY = Math.max(0, parseFloat(A.delay || '0.2'));

    console.log(`\n=== Geocode wv_hotels (parallel, ${WORKERS} workers) ===`);
    console.log(`  mode=${RETRY_NOT_FOUND ? 'retry-not-found' : 'resume'}`);
    console.log(`  dry-run=${DRY_RUN}  limit=${LIMIT || 'ALL'}  country=${COUNTRY || 'ALL'}`);
    console.log(`  workers=${WORKERS}  delay=${DELAY}s  batch-size=${BATCH_SIZE}`);
    console.log(`  Strategy: Photon (fast, country-filtered) → Nominatim (slow) ${A.gmaps ? '→ GMaps (v.lento)' : ''}`);
    console.log();

    await printStatus(prisma);
    console.log();

    // ── Fetch (já com filtro de país no WHERE) ──
    const hotels = await fetchHotels(prisma, {
      limit: LIMIT || undefined,
      country: COUNTRY || undefined,
      retryNotFound: RETRY_NOT_FOUND,
    });

    const total = hotels.length;
    console.log(`Hotels to process: ${total.toLocaleString()}`);
    if (total === 0) {
      console.log('Nothing to do.');
      return;
    }

    // ── Run worker pool (await direto, sem polling redundante) ──
    const pool = new WorkerPool(hotels, geocodeHotel, {
      workers: WORKERS,
      delay: DELAY,
    });

    console.log(`Starting ${WORKERS} workers...`);
    const poolStartTime = Date.now();

    await pool.run((p) => {
      const nom = p.nominatimDisabled ? ' (Nominatim desativado por rate limit)' : '';
      const line = `  [${p.processed}/${p.total} (${p.pct}%) | found: ${p.found} | ${p.rate}/s | ETA: ${p.eta}s${nom}]`;
      process.stdout.write('\r\x1b[K' + line);
    });

    console.log(); // newline after progress

    // ── Batch DB updates ──
    const foundBatch = pool.results.filter((r) => r.found);
    const notFoundBatch = pool.results.filter((r) => !r.found);

    console.log(`\nResults: ${foundBatch.length} found, ${notFoundBatch.length} not found`);

    if (!DRY_RUN && foundBatch.length > 0) {
      console.log(`Writing ${foundBatch.length} found coords to DB...`);
      let committed = 0;
      for (let i = 0; i < foundBatch.length; i += BATCH_SIZE) {
        const batch = foundBatch.slice(i, i + BATCH_SIZE);
        await batchUpdateFound(prisma, batch);
        committed += batch.length;
        if (committed % (BATCH_SIZE * 2) === 0 || committed === foundBatch.length) {
          process.stdout.write(`\r  committed: ${committed}/${foundBatch.length} found`);
        }
      }
      console.log();
    }

    if (!DRY_RUN && notFoundBatch.length > 0) {
      console.log(`Writing ${notFoundBatch.length} not-found marks to DB...`);
      let committed = 0;
      for (let i = 0; i < notFoundBatch.length; i += BATCH_SIZE) {
        const batch = notFoundBatch.slice(i, i + BATCH_SIZE);
        await batchUpdateNotFound(prisma, batch.map((r) => r.id));
        committed += batch.length;
        if (committed % (BATCH_SIZE * 2) === 0 || committed === notFoundBatch.length) {
          process.stdout.write(`\r  committed: ${committed}/${notFoundBatch.length} not-found`);
        }
      }
      console.log();
    }

    // ── Summary ──
    const elapsed = ((Date.now() - poolStartTime) / 1000).toFixed(0);
    const rate = total / parseFloat(elapsed);
    console.log(`\n=== Run complete ===`);
    console.log(`  Processed  : ${total.toLocaleString()}`);
    console.log(`  Found      : ${foundBatch.length.toLocaleString()}  (${(foundBatch.length / total * 100).toFixed(1)}%)`);
    console.log(`  Not found  : ${notFoundBatch.length.toLocaleString()}`);
    console.log(`  Elapsed    : ${elapsed}s (${rate.toFixed(1)} hotels/s)`);
    if (pool.nominatimDisabled) {
      console.log(`  ⚠ Nominatim desativado (rate limit 429). Apenas Photon foi usado.`);
    }
    if (DRY_RUN) {
      console.log(`  (dry-run - nothing written to DB)`);
    } else {
      console.log(`  Re-run same command to resume (skips already found/not-found).`);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
