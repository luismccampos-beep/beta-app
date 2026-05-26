/**
 * Preenche latitude/longitude em wv_hotels a partir de data/hotels/hotel-index.json.
 *
 *   npx prisma migrate deploy
 *   npm run travel:catalog:backfill-geo
 *   npm run travel:catalog:backfill-geo -- --dry-run --limit-destinos=100
 */
import { existsSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

import { PrismaClient } from '@prisma/client';

import { loadProjectEnv } from './lib/load-env.mjs';
import { fold } from './lib/cost-of-living-data.mjs';
import { lookupAllHotels } from './lib/hotel-lookup.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const INDEX = resolve(ROOT, 'data/hotels/hotel-index.json');

const prisma = new PrismaClient();
const dryRun = process.argv.includes('--dry-run');
const limitDestArg = process.argv.find((a) => a.startsWith('--limit-destinos'));
const LIMIT_DESTINOS = limitDestArg
  ? parseInt(
      limitDestArg.split('=')[1] ?? process.argv[process.argv.indexOf('--limit-destinos') + 1],
      10,
    )
  : 0;
const BATCH = 200;

loadProjectEnv(ROOT);

function ensureIndex() {
  if (existsSync(INDEX)) return;
  console.log('Building hotel-index.json…');
  execSync('py -3 scripts/build-hotel-data-index.py', { cwd: ROOT, stdio: 'inherit' });
}

function matchIndexRow(hotelNome, indexRows) {
  const key = fold(hotelNome);
  if (!key) return null;

  let row = indexRows.find((r) => fold(r.nome) === key);
  if (row) return row;

  row = indexRows.find((r) => {
    const rk = fold(r.nome);
    return rk.includes(key) || key.includes(rk);
  });
  return row ?? null;
}

async function main() {
  ensureIndex();
  const index = JSON.parse(readFileSync(INDEX, 'utf8'));

  const destinos = await prisma.wvDestination.findMany({
    select: {
      id: true,
      nome: true,
      pais: true,
      latitude: true,
      longitude: true,
    },
    orderBy: { id: 'asc' },
    ...(LIMIT_DESTINOS > 0 ? { take: LIMIT_DESTINOS } : {}),
  });

  let updated = 0;
  let skipped = 0;
  let noMatch = 0;

  for (let i = 0; i < destinos.length; i++) {
    const dest = destinos[i];
    const indexRows = lookupAllHotels(
      {
        nome: dest.nome,
        pais: dest.pais,
        latitude: dest.latitude,
        longitude: dest.longitude,
      },
      index,
      24,
    );

    const hotels = await prisma.wvHotel.findMany({
      where: {
        destinoId: dest.id,
        OR: [{ latitude: null }, { longitude: null }],
      },
      select: { id: true, nome: true, latitude: true, longitude: true },
    });

    if (!hotels.length) continue;

    const updates = [];
    for (const h of hotels) {
      if (h.latitude != null && h.longitude != null) {
        skipped += 1;
        continue;
      }

      const row = matchIndexRow(h.nome, indexRows);
      if (!row?.latitude || !row?.longitude) {
        noMatch += 1;
        continue;
      }

      updates.push({
        id: h.id,
        latitude: row.latitude,
        longitude: row.longitude,
        fonte: row.source ?? undefined,
      });
    }

    if (updates.length && !dryRun) {
      for (let j = 0; j < updates.length; j += BATCH) {
        const chunk = updates.slice(j, j + BATCH);
        await Promise.all(
          chunk.map((u) =>
            prisma.wvHotel.update({
              where: { id: u.id },
              data: {
                latitude: u.latitude,
                longitude: u.longitude,
                ...(u.fonte ? { fonte: u.fonte } : {}),
              },
            }),
          ),
        );
      }
    }

    updated += updates.length;
    process.stdout.write(
      `\r  destinos ${i + 1}/${destinos.length} · geo +${updates.length} (total ${updated})`,
    );
  }

  console.log('');
  console.log(
    dryRun ? '[dry-run] ' : '',
    `Done. Updated ${updated}, skipped (had coords) ${skipped}, no index match ${noMatch}`,
  );

  const withGeo = await prisma.wvHotel.count({
    where: { latitude: { not: null }, longitude: { not: null } },
  });
  const total = await prisma.wvHotel.count();
  console.log(`Hotels with coordinates: ${withGeo} / ${total}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
