/**
 * Importa bundle Wikivoyage + custo de vida + listagens para Postgres (Prisma).
 *
 *   npx prisma migrate deploy
 *   npm run travel:catalog:import
 *   npm run travel:catalog:import -- --fresh
 *   npm run travel:catalog:import -- --listings --listings-limit=50000
 *   npm run travel:catalog:import -- --backfill-dest-geo --verify-hotels-geo
 */
import { existsSync, readFileSync, createReadStream } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createInterface } from 'node:readline';
import { execSync } from 'node:child_process';

import { PrismaClient } from '@prisma/client';

import { loadProjectEnv } from './lib/load-env.mjs';
import { loadCostOfLivingIndexes, cityKey, leafCityName, countryToEnglish, fold } from './lib/cost-of-living-data.mjs';
import { resolveBudgetForDestination } from './lib/travel-budget.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const BUNDLE = resolve(ROOT, 'src/data/travel-mock/bundle-wikivoyage.json');
const LISTINGS_CSV = resolve(ROOT, 'data/hotels/wikivoyage-listings-en.csv');

const prisma = new PrismaClient();
const BATCH = 400;
const fresh = process.argv.includes('--fresh');
const listingsOnly = process.argv.includes('--listings-only');
const withListings = process.argv.includes('--listings') || listingsOnly;
const listingsLimitArg = process.argv.find((a) => a.startsWith('--listings-limit'));
const LISTINGS_LIMIT = listingsLimitArg
  ? parseInt(
      listingsLimitArg.split('=')[1] ?? process.argv[process.argv.indexOf('--listings-limit') + 1],
      10,
    )
  : 80_000;

loadProjectEnv(ROOT);

function buildSlug(dest) {
  return `${dest.lang ?? 'pt'}-${dest.id}`;
}

async function clearCatalog() {
  await prisma.wvListing.deleteMany();
  await prisma.wvHotel.deleteMany();
  await prisma.wvFlight.deleteMany();
  await prisma.wvDestination.deleteMany();
  await prisma.colCity.deleteMany();
  await prisma.colCountryIndex.deleteMany();
}

async function importDestinations(destinos) {
  let n = 0;
  for (let i = 0; i < destinos.length; i += BATCH) {
    const batch = destinos.slice(i, i + BATCH).map((d) => ({
      id: d.id,
      slug: buildSlug(d),
      lang: d.lang ?? 'pt',
      nome: d.nome,
      pais: d.pais,
      paisCode: d.paisCode ?? 'XX',
      continente: d.continente ?? null,
      iata: d.iata ?? null,
      tipo: d.tipo ?? null,
      clima: d.clima ?? null,
      descricao: d.descricao ?? null,
      descricaoCompleta: d.descricaoCompleta ?? null,
      resumo: d.resumo ?? null,
      veja: d.veja ?? null,
      faca: d.faca ?? null,
      coma: d.coma ?? null,
      dicas: d.dicas ?? null,
      tags: d.tags ?? null,
      wikivoyageUrl: d.wikivoyageUrl ?? null,
      wikipediaResumo: d.wikipedia_resumo ?? null,
      wikipediaUrl: d.wikipedia_url ?? null,
      climaTempo: d.clima_tempo ?? null,
      custoDeVida: d.custo_de_vida ?? null,
      transporte: d.transporte ?? null,
      latitude: d.latitude ?? null,
      longitude: d.longitude ?? null,
      imagemUrl: d.imagem_url ?? null,
      imagemQuery: d.imagem_query ?? null,
      hotelCount: 0,
    }));
    await prisma.wvDestination.createMany({ data: batch, skipDuplicates: true });
    n += batch.length;
    process.stdout.write(`\r  destinos ${n}/${destinos.length}`);
  }
  console.log('');
}

async function importHotels(hoteis) {
  let n = 0;
  const counts = new Map();
  for (let i = 0; i < hoteis.length; i += BATCH) {
    const batch = hoteis.slice(i, i + BATCH).map((h) => {
      counts.set(h.destino_id, (counts.get(h.destino_id) ?? 0) + 1);
      return {
        id: h.id,
        destinoId: h.destino_id,
        nome: h.nome,
        estrelas: h.estrelas ?? 3,
        precoPorNoite: h.preco_por_noite ?? 90,
        comodidades: h.comodidades ?? ['wifi'],
        fonte: h.fonte ?? h.source ?? null,
        latitude: h.latitude ?? null,
        longitude: h.longitude ?? null,
        description: h.description ?? null,
        imageUrl: h.image_url ?? h.imageUrl ?? null,
        googlePlaceId: h.google_place_id ?? null,
        wikidataId: h.wikidata_id ?? null,
      };
    });
    await prisma.wvHotel.createMany({ data: batch, skipDuplicates: true });
    n += batch.length;
    process.stdout.write(`\r  hotéis ${n}/${hoteis.length}`);
  }
  console.log('');
  for (const [destinoId, hotelCount] of counts) {
    await prisma.wvDestination.update({ where: { id: destinoId }, data: { hotelCount } });
  }
}

async function importFlights(voos) {
  let n = 0;
  for (let i = 0; i < voos.length; i += BATCH) {
    const batch = voos.slice(i, i + BATCH).map((f) => ({
      id: f.id,
      origem: f.origem,
      destinoId: f.destino_id,
      destinoIata: f.destino_iata ?? null,
      preco: f.preco,
      duracaoMinutos: f.duracao_minutos,
      companhia: f.companhia,
      cabinClass: f.cabin_class ?? 'economy',
      escalas: f.escalas ?? 0,
    }));
    await prisma.wvFlight.createMany({ data: batch, skipDuplicates: true });
    n += batch.length;
    process.stdout.write(`\r  voos ${n}/${voos.length}`);
  }
  console.log('');
}

async function importCostOfLiving(destinos) {
  const indexes = loadCostOfLivingIndexes();
  console.log(`  COL fontes: ${indexes.sources.join(', ')} | cidades ${indexes.cities.size}`);

  const cityRows = [];
  for (const [key, entry] of indexes.cities) {
    const cEn = entry.city ?? entry.name;
    const pEn = entry.country;
    if (!cEn || !pEn) continue;
    const budget = resolveBudgetForDestination(indexes, {
      nome: cEn,
      pais: pEn,
      continente: 'Europa',
      tipo: 'cidade',
      clima: 'continental',
    });
    cityRows.push({
      city: cEn,
      country: pEn,
      cityKey: key,
      indices: budget.indices ?? {},
      budgets: budget.orcamentos ?? null,
      rawPrices: entry.prices ?? null,
    });
  }

  for (let i = 0; i < cityRows.length; i += BATCH) {
    await prisma.colCity.createMany({
      data: cityRows.slice(i, i + BATCH),
      skipDuplicates: true,
    });
  }

  const countryRows = [];
  for (const [, idx] of indexes.countries) {
    const country = idx.country ?? '';
    if (!country) continue;
    countryRows.push({
      country,
      colIndex: idx.costIndex ?? 100,
      rentIndex: idx.rentIndex ?? null,
      payload: idx,
    });
  }
  for (let i = 0; i < countryRows.length; i += BATCH) {
    await prisma.colCountryIndex.createMany({
      data: countryRows.slice(i, i + BATCH),
      skipDuplicates: true,
    });
  }

  let patched = 0;
  for (const dest of destinos) {
    if (dest.custo_de_vida) continue;
    const budget = resolveBudgetForDestination(indexes, dest);
    await prisma.wvDestination.update({
      where: { id: dest.id },
      data: { custoDeVida: budget },
    });
    patched += 1;
  }
  console.log(`  COL: ${cityRows.length} cidades, ${countryRows.length} países; bundle patch ${patched}`);
}

/** Evita P2000 se o schema ainda não tiver sido migrado para Text. */
function clip(value, maxLen) {
  if (value == null || value === '') return null;
  const s = String(value);
  return s.length > maxLen ? `${s.slice(0, maxLen - 1)}…` : s;
}

function slimListingPayload(row) {
  const out = { ...row };
  if (out.description && out.description.length > 4000) {
    out.description = `${out.description.slice(0, 3997)}…`;
  }
  return out;
}

function parseCsvLine(line) {
  const out = [];
  let cur = '';
  let q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      q = !q;
      continue;
    }
    if (c === ',' && !q) {
      out.push(cur);
      cur = '';
      continue;
    }
    cur += c;
  }
  out.push(cur);
  return out;
}

async function importListings(destinos) {
  if (!existsSync(LISTINGS_CSV)) {
    console.log('  listagens: CSV não encontrado, skip');
    return;
  }

  const articleToId = new Map();
  for (const d of destinos) {
    const leaf = fold((d.nome ?? '').replace(/\([^)]*\)/g, ' ').split('/')[0]?.trim());
    if (leaf) articleToId.set(leaf, d.id);
  }

  const rl = createInterface({
    input: createReadStream(LISTINGS_CSV, { encoding: 'utf-8' }),
    crlfDelay: Infinity,
  });

  let headers = null;
  let rowNum = 0;
  let imported = 0;
  let batch = [];

  for await (const line of rl) {
    if (!headers) {
      headers = parseCsvLine(line.replace(/^\uFEFF/, ''));
      continue;
    }
    rowNum += 1;
    if (imported >= LISTINGS_LIMIT) break;

    const cols = parseCsvLine(line);
    if (cols.length < headers.length) continue;
    const row = {};
    headers.forEach((h, j) => {
      row[h] = cols[j]?.trim() ?? '';
    });

    const type = (row.type ?? '').toLowerCase();
    if (!['sleep', 'eat', 'see', 'do'].includes(type)) continue;

    const article = row.article ?? '';
    const destinoId = articleToId.get(fold(article)) ?? null;
    if (!destinoId) continue;

    let lat = null;
    let lon = null;
    try {
      if (row.latitude) lat = parseFloat(row.latitude);
      if (row.longitude) lon = parseFloat(row.longitude);
    } catch {
      /* skip */
    }

    batch.push({
      destinoId,
      article: clip(article, 255),
      type: clip(type, 32),
      title: clip(row.title || row.alt || 'Listing', 8000) ?? 'Listing',
      address: clip(row.address, 8000),
      price: clip(row.price, 8000),
      latitude: lat,
      longitude: lon,
      url: clip(row.url, 8000),
      payload: slimListingPayload(row),
    });

    if (batch.length >= BATCH) {
      await prisma.wvListing.createMany({ data: batch });
      imported += batch.length;
      batch = [];
      process.stdout.write(`\r  listagens ${imported}`);
    }
  }

  if (batch.length) {
    await prisma.wvListing.createMany({ data: batch });
    imported += batch.length;
  }
  console.log(`\n  listagens importadas: ${imported}`);
}

async function main() {
  if (!existsSync(BUNDLE)) {
    console.error('Missing bundle:', BUNDLE);
    process.exit(1);
  }

  console.log('🔄 Import travel catalog → Postgres\n');
  if (fresh && !listingsOnly) {
    console.log('  Limpando tabelas wv_* e col_*…');
    await clearCatalog();
  }

  const bundle = JSON.parse(readFileSync(BUNDLE, 'utf8'));
  const destinos = bundle.destinos ?? [];
  const hoteis = bundle.hoteis ?? [];
  const voos = bundle.voos ?? [];

  if (!listingsOnly) {
    console.log(`Bundle: ${destinos.length} destinos, ${hoteis.length} hotéis, ${voos.length} voos\n`);

    console.log('1/4 Destinos…');
    await importDestinations(destinos);

    console.log('2/4 Hotéis…');
    await importHotels(hoteis);

    console.log('3/4 Voos…');
    await importFlights(voos);

    console.log('4/4 Custo de vida…');
    await importCostOfLiving(destinos);
  } else {
    console.log('Modo --listings-only (mantém destinos/hotéis já importados)\n');
    if (fresh) await prisma.wvListing.deleteMany();
  }

  if (withListings) {
    console.log('5/5 Listagens Wikivoyage…');
    await importListings(destinos);
  }

  if (!listingsOnly) {
    const backfillHotelGeo =
      process.env.TRAVEL_BACKFILL_HOTEL_GEO === '1' ||
      process.env.TRAVEL_BACKFILL_HOTEL_GEO === 'true' ||
      process.argv.includes('--backfill-hotel-geo');
    if (backfillHotelGeo) {
      const hotelGeoLimit = process.env.TRAVEL_BACKFILL_HOTEL_GEO_LIMIT_DESTINOS || '';
      const hotelGeoArgs = hotelGeoLimit
        ? `--limit-destinos=${hotelGeoLimit}`
        : '';
      console.log('\n📍 Backfill hotéis (coords do hotel-index)…');
      execSync(`node scripts/backfill-wv-hotels-geo.mjs ${hotelGeoArgs}`.trim(), {
        cwd: ROOT,
        stdio: 'inherit',
      });
    }

    const backfillDestGeo =
      process.env.TRAVEL_BACKFILL_DEST_GEO === '1' ||
      process.env.TRAVEL_BACKFILL_DEST_GEO === 'true' ||
      process.argv.includes('--backfill-dest-geo');
    if (backfillDestGeo) {
      const backfillLimit = process.env.TRAVEL_BACKFILL_DEST_GEO_LIMIT || '800';
      const backfillLang = process.env.TRAVEL_BACKFILL_DEST_GEO_LANG || 'pt';
      const backfillSleep = process.env.TRAVEL_BACKFILL_DEST_GEO_SLEEP_MS || '250';
      console.log(
        `\n🔎 Backfill destinos (Photon reverse) — limit=${backfillLimit} lang=${backfillLang} sleepMs=${backfillSleep}`,
      );
      execSync(
        `node scripts/backfill-wv-destinations-geo.mjs --limit ${backfillLimit} --lang ${backfillLang} --sleep-ms ${backfillSleep}`,
        { cwd: ROOT, stdio: 'inherit' },
      );
    }

    const verifyHotelsGeo =
      process.env.TRAVEL_VERIFY_HOTELS_GEO === '1' ||
      process.env.TRAVEL_VERIFY_HOTELS_GEO === 'true' ||
      process.argv.includes('--verify-hotels-geo');
    if (verifyHotelsGeo) {
      const verifyLimit = process.env.TRAVEL_VERIFY_HOTELS_GEO_LIMIT || '2000';
      const verifyMaxKm = process.env.TRAVEL_VERIFY_HOTELS_GEO_MAX_KM || '250';
      const verifySleep = process.env.TRAVEL_VERIFY_HOTELS_GEO_SLEEP_MS || '150';
      console.log(
        `\n🛡️ Verificar hotéis (país/distância) — limit=${verifyLimit} maxKm=${verifyMaxKm} sleepMs=${verifySleep}`,
      );
      execSync(
        `node scripts/verify-wv-hotels-geo.mjs --limit ${verifyLimit} --max-km ${verifyMaxKm} --sleep-ms ${verifySleep}`,
        { cwd: ROOT, stdio: 'inherit' },
      );
    }
  }

  const stats = {
    destinos: await prisma.wvDestination.count(),
    hoteis: await prisma.wvHotel.count(),
    voos: await prisma.wvFlight.count(),
    listings: await prisma.wvListing.count(),
    colCities: await prisma.colCity.count(),
  };

  console.log('\n✅ Importação concluída:', stats);
  console.log('\nAtive na Vercel/local: TRAVEL_CATALOG_SOURCE=db');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
