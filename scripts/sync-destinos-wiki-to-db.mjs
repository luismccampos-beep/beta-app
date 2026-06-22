/**
 * Sincroniza wikipedia_resumo/url e hotéis wiki do bundle → Postgres (WvDestination, WvHotel).
 *
 *   npm run travel:catalog:sync-wiki
 *   npm run travel:catalog:sync-wiki -- --destinations-only
 *   npm run travel:catalog:sync-wiki -- --hotels-only
 */
import { existsSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { PrismaClient } from '@prisma/client';
import { loadProjectEnv } from './lib/load-env.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const BUNDLE = resolve(ROOT, 'src/data/travel-mock/bundle-wikivoyage.json');

// Use direct (unpooled) URL for long-running scripts — Neon pooler closes idle connections
const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL } },
});
const BATCH = 200;
const destinationsOnly = process.argv.includes('--destinations-only');
const hotelsOnly = process.argv.includes('--hotels-only');

loadProjectEnv(ROOT);

/** @param {string} s */
function fold(s) {
  return String(s ?? '')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .trim();
}

/** @param {string} v @param {number} max */
function clip(v, max) {
  if (v == null) return null;
  const s = String(v);
  return s.length > max ? `${s.slice(0, max - 1)}…` : s;
}

async function syncDestinations(destinos) {
  let n = 0;
  let updated = 0;
  for (let i = 0; i < destinos.length; i += BATCH) {
    const batch = destinos.slice(i, i + BATCH);
    await Promise.all(
      batch.map(async (d) => {
        if (!d.wikipedia_resumo && !d.wikipedia_url) return;
        const res = await prisma.wvDestination.updateMany({
          where: { id: d.id },
          data: {
            wikipediaResumo: d.wikipedia_resumo ? clip(d.wikipedia_resumo, 8000) : undefined,
            wikipediaUrl: d.wikipedia_url ? clip(d.wikipedia_url, 500) : undefined,
          },
        });
        if (res.count) updated += res.count;
      }),
    );
    n += batch.length;
    process.stdout.write(`\r  destinos ${n}/${destinos.length} (${updated} com Wikipedia)`);
  }
  console.log('');
  return updated;
}

async function syncHotels(hoteis) {
  const wikiHotels = hoteis.filter(
    (h) =>
      h.fonte?.startsWith('wikipedia') ||
      h.fonte?.startsWith('wikivoyage') ||
      h.source?.startsWith('wikipedia') ||
      h.source?.startsWith('wikivoyage') ||
      h.wiki_url,
  );
  if (!wikiHotels.length) {
    console.log('  hotéis wiki no bundle: 0 (nada a sincronizar)');
    return { inserted: 0, skipped: 0 };
  }

  const existing = await prisma.wvHotel.findMany({
    where: { fonte: { startsWith: 'wikipedia' } },
    select: { destinoId: true, nome: true },
  });
  const seen = new Set(existing.map((h) => `${h.destinoId}|${fold(h.nome)}`));

  let maxId = (
    await prisma.wvHotel.aggregate({ _max: { id: true } })
  )._max.id ?? 0;

  /** @type {object[]} */
  const toInsert = [];
  let skipped = 0;

  for (const h of wikiHotels) {
    const key = `${h.destino_id}|${fold(h.nome)}`;
    if (seen.has(key)) {
      skipped += 1;
      continue;
    }
    seen.add(key);
    maxId += 1;
    toInsert.push({
      id: maxId,
      destinoId: h.destino_id,
      nome: clip(h.nome, 300) ?? 'Hotel',
      estrelas: h.estrelas ?? 3,
      precoPorNoite: Math.round(h.preco_por_noite ?? 90),
      comodidades: h.comodidades ?? ['wifi'],
      fonte: h.fonte ?? h.source ?? 'wikipedia',
      description: h.description ? clip(h.description, 4000) : null,
      latitude: h.latitude ?? null,
      longitude: h.longitude ?? null,
    });
  }

  if (toInsert.length) {
    for (let i = 0; i < toInsert.length; i += BATCH) {
      await prisma.wvHotel.createMany({
        data: toInsert.slice(i, i + BATCH),
        skipDuplicates: true,
      });
    }
  }

  await prisma.$executeRaw`
    UPDATE wv_destinations d
    SET hotel_count = sub.c
    FROM (
      SELECT destino_id, COUNT(*)::int AS c
      FROM wv_hotels
      GROUP BY destino_id
    ) sub
    WHERE d.id = sub.destino_id
  `;

  console.log(`  hotéis wiki inseridos: ${toInsert.length} (skip duplicados ${skipped})`);
  return { inserted: toInsert.length, skipped };
}

async function assertDatabase() {
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (e) {
    console.error(
      'Não foi possível ligar ao Postgres (Neon).\n' +
        '  • Verifica DATABASE_URL em .env.local\n' +
        '  • Rede/VPN e se o projeto Neon está activo\n' +
        '  • Passos 1–2 (bundle) funcionam offline; sync-wiki precisa da BD.\n',
    );
    throw e;
  }
}

async function main() {
  if (!existsSync(BUNDLE)) {
    console.error('Missing bundle:', BUNDLE);
    process.exit(1);
  }

  await assertDatabase();

  const bundle = JSON.parse(readFileSync(BUNDLE, 'utf8'));
  const destinos = bundle.destinos ?? [];
  const hoteis = bundle.hoteis ?? [];

  console.log('Sync wiki enrichment → Postgres\n');

  if (!hotelsOnly) {
    console.log('1/2 WvDestination (wikipedia_resumo/url)…');
    await syncDestinations(destinos);
  }

  if (!destinationsOnly) {
    console.log('2/2 WvHotel (fonte wikipedia*)…');
    await syncHotels(hoteis);
  }

  const stats = {
    destinos: await prisma.wvDestination.count(),
    hoteis: await prisma.wvHotel.count(),
    comWikipedia: await prisma.wvDestination.count({
      where: { wikipediaResumo: { not: null } },
    }),
  };
  console.log('\n✅', stats);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
