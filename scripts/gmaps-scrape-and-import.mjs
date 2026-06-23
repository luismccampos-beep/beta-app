import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { PrismaClient } from '@prisma/client';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const { loadProjectEnv } = await import('./lib/load-env.mjs');
loadProjectEnv(ROOT);

const prisma = new PrismaClient();

const API_BASE = 'http://localhost:8001';

const args = process.argv.slice(2);
const inputArg = args.find(a => a.startsWith('--input='));
const CIDADES_PATH = inputArg ? resolve(ROOT, inputArg.split('=')[1]) : resolve(ROOT, 'google-maps-scraper/cidades.json');
const stateFile = inputArg ? 'import-state-' + inputArg.split('=')[1].replace(/[^a-z0-9]/gi, '-') + '.json' : 'import-state.json';
const STATE_PATH = resolve(ROOT, 'google-maps-scraper', stateFile);
const MAX_PLACES = parseInt(args.find(a => a.startsWith('--max='))?.split('=')[1]) || 10;
const CONCURRENCY = parseInt(args.find(a => a.startsWith('--conc='))?.split('=')[1]) || 3;
const PARALLEL = parseInt(args.find(a => a.startsWith('--parallel='))?.split('=')[1]) || 2;
const resumeOnly = args.includes('--resume-only');
const dryRun = args.includes('--dry-run');

function loadState() {
  if (existsSync(STATE_PATH)) {
    return JSON.parse(readFileSync(STATE_PATH, 'utf8'));
  }
  return { processed: [], results: {} };
}

function saveState(state) {
  writeFileSync(STATE_PATH, JSON.stringify(state, null, 2));
}

function parseEstrelas(hotel) {
  const category = hotel.categories?.[0] || '';
  const m = category.match(/(\d+)\s*estrelas?/i);
  if (m) return Math.min(parseInt(m[1]), 5) || 3;
  const r = hotel.rating;
  if (r != null && typeof r === 'number') {
    if (r >= 4.5) return 5; if (r >= 3.5) return 4;
    if (r >= 2.5) return 3; if (r >= 1.5) return 2;
    return 1;
  }
  return 3;
}

function buildComodidades(h) {
  const o = {};
  if (h.website) o.website = h.website;
  if (h.phone) o.phone = h.phone;
  if (h.rating != null) o.rating = h.rating;
  if (h.reviews_count != null) o.reviews_count = h.reviews_count;
  if (h.categories?.length) o.categories = h.categories;
  if (h.hours) o.hours = h.hours;
  if (h.link) o.gmaps_link = h.link;
  if (h.reviews_url) o.reviews_url = h.reviews_url;
  if (h.thumbnail) o.thumbnail = h.thumbnail;
  if (h.address) o.address = h.address;
  return o;
}

async function scrapeCity(cidade) {
  const query = `hoteis em ${cidade.nome}, ${cidade.pais}`;
  const params = new URLSearchParams();
  params.set('query', query);
  params.set('max_places', String(MAX_PLACES));
  params.set('lang', 'pt');
  params.set('headless', 'true');
  params.set('concurrency', String(CONCURRENCY));
  const url = `${API_BASE}/scrape-get?${params.toString()}`;

  try {
    const resp = await fetch(url, { signal: AbortSignal.timeout(300_000) });
    if (!resp.ok) {
      console.error(`  HTTP ${resp.status} for ${cidade.nome}`);
      return [];
    }
    const data = await resp.json();
    if (!Array.isArray(data)) return [];
      console.log(`  → ${data.length} hotéis em ${cidade.nome}`);
      return data;
    } catch (err) {
      console.log(`  Erro ${cidade.nome}: ${err.message?.slice(0,60)}`);
    return [];
  }
}

async function getNextId() {
  const last = await prisma.wvHotel.findFirst({ orderBy: { id: 'desc' }, select: { id: true } });
  return (last?.id ?? 0) + 1;
}

async function importHotels(cidade, hoteis, nextIdRef) {
  const destinoId = cidade.id;
  let inseridos = 0, atualizados = 0, ignorados = 0;

  for (const hotel of hoteis) {
    if (!hotel.name) continue;
    const nome = hotel.name.trim();
    const gpid = hotel.place_id || null;
    const lat = hotel.coordinates?.latitude ?? hotel.coordinates?.lat ?? null;
    const lng = hotel.coordinates?.longitude ?? hotel.coordinates?.lng ?? null;
    const desc = hotel.address || null;
    const img = hotel.thumbnail || null;
    const estrelas = parseEstrelas(hotel);
    const comodidades = buildComodidades(hotel);

    if (gpid) {
      const existing = await prisma.wvHotel.findFirst({ where: { googlePlaceId: gpid } });
      if (existing) {
        if (!dryRun) {
          await prisma.wvHotel.update({
            where: { id: existing.id },
            data: { nome, destinoId, estrelas, latitude: lat ?? existing.latitude,
              longitude: lng ?? existing.longitude, description: desc ?? existing.description,
              imageUrl: img ?? existing.imageUrl, comodidades }
          });
        }
        atualizados++; continue;
      }
    }

    const byName = await prisma.wvHotel.findFirst({ where: { nome, destinoId } });
    if (byName) {
      if (!dryRun) {
        await prisma.wvHotel.update({
          where: { id: byName.id },
          data: { estrelas, latitude: lat ?? byName.latitude,
            longitude: lng ?? byName.longitude, description: desc ?? byName.description,
            imageUrl: img ?? byName.imageUrl, comodidades,
            googlePlaceId: gpid ?? byName.googlePlaceId }
        });
      }
      atualizados++; continue;
    }

    if (dryRun) { inseridos++; continue; }

    const id = nextIdRef.value++;
    try {
      await prisma.wvHotel.create({
        data: { id, destinoId, nome, estrelas, precoPorNoite: 0,
          comodidades, fonte: 'google_maps_scraper', latitude: lat,
          longitude: lng, description: desc, imageUrl: img, googlePlaceId: gpid }
      });
      inseridos++;
    } catch (err) {
      if (err.code === 'P2002') ignorados++;
      else console.error(`  Erro "${nome}": ${err.message}`);
    }
  }

  return { inseridos, atualizados, ignorados };
}

async function main() {
  console.log(`=== GMaps Scraper → wv_hotels ===\n`);
  console.log(`API: ${API_BASE}`);
  console.log(`Max places: ${MAX_PLACES}, Concurrency: ${CONCURRENCY}, Parallel: ${PARALLEL}`);
  if (dryRun) console.log('Modo: DRY RUN');
  if (resumeOnly) console.log('Modo: RESUME (apenas cidades não processadas)');
  console.log();

  const cidades = JSON.parse(readFileSync(CIDADES_PATH, 'utf8'));
  console.log(`Total cidades: ${cidades.length}`);

  const state = loadState();
  let stats = { inseridos: 0, atualizados: 0, ignorados: 0, falhas: 0 };

  let nextId = dryRun ? 0 : await getNextId();
  const nextIdRef = { value: nextId };

  // Process in parallel batches
  for (let i = 0; i < cidades.length; i += PARALLEL) {
    const batch = cidades.slice(i, i + PARALLEL);
    const pending = batch.filter(c => !resumeOnly || !state.processed.includes(c.id));

    if (pending.length === 0) continue;

    const progress = `[${Math.min(i+PARALLEL, cidades.length)}/${cidades.length}]`;
    console.log(`\n${progress} Processando: ${pending.map(c => c.nome).join(', ')}`);

    const results = await Promise.allSettled(
      pending.map(c => scrapeCity(c))
    );

    for (let j = 0; j < pending.length; j++) {
      const cidade = pending[j];
      const result = results[j];

      if (result.status === 'fulfilled' && result.value.length > 0) {
        const s = await importHotels(cidade, result.value, nextIdRef);
        stats.inseridos += s.inseridos;
        stats.atualizados += s.atualizados;
        stats.ignorados += s.ignorados;
        console.log(`  ✔ ${cidade.nome}: ${s.inseridos} novos, ${s.atualizados} atualizados`);
      } else {
        stats.falhas++;
        console.log(`  ✘ ${cidade.nome}: sem resultados`);
      }

      state.processed.push(cidade.id);
    }

    saveState(state);
    console.log(`  Stats acumulados: ${stats.inseridos} novos, ${stats.atualizados} atualizados`);
  }

  console.log('\n=== Final ===');
  console.log(`Novos: ${stats.inseridos}`);
  console.log(`Atualizados: ${stats.atualizados}`);
  console.log(`Ignorados: ${stats.ignorados}`);
  console.log(`Falhas: ${stats.falhas}`);

  await prisma.$disconnect();
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
