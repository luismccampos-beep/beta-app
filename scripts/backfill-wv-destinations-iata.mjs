/**
 * Backfill/repair `wv_destinations.iata` using OurAirports + OpenFlights (offline).
 *
 *   npm run travel:catalog:backfill-iata -- --dry-run --limit 100
 *   npm run travel:catalog:backfill-iata -- --all
 */
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PrismaClient } from '@prisma/client';

import { loadProjectEnv } from './lib/load-env.mjs';
import { resolveTransportForDestination } from './lib/destination-transport.mjs';
import { loadTransportIndexes } from './lib/transport-data.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
loadProjectEnv(ROOT);

const prisma = new PrismaClient();

const args = new Set(process.argv.slice(2));
const argValue = (name, fallback) => {
  const idx = process.argv.indexOf(name);
  if (idx !== -1) return process.argv[idx + 1] ?? fallback;
  for (const a of process.argv) {
    if (a.startsWith(`${name}=`)) return a.split('=')[1] ?? fallback;
  }
  return fallback;
};

const dryRun = args.has('--dry-run');
const verbose = args.has('--verbose');
const limit = parseInt(argValue('--limit', '0'), 10) || null;
const onlyBad = !args.has('--all');
const lang = String(argValue('--lang', 'pt')).trim() || 'pt';

function destNeedsIataFix(row, byIata) {
  const cc = (row.paisCode ?? '').trim().toUpperCase();
  const iata = row.iata?.trim().toUpperCase() ?? '';
  if (!iata) return true;
  const ap = byIata.get(iata);
  if (!ap) return true;
  if (cc && cc !== 'XX' && ap.iso_country && ap.iso_country !== cc) return true;
  return false;
}

function rowToDest(row) {
  return {
    id: row.id,
    lang: row.lang,
    nome: row.nome,
    pais: row.pais,
    paisCode: row.paisCode,
    continente: row.continente,
    iata: row.iata,
    tipo: row.tipo,
    latitude: row.latitude,
    longitude: row.longitude,
    transporte: row.transporte,
  };
}

function transportIataAcceptable(transport, row) {
  if (!transport?.aeroporto?.iata) return false;
  const match = transport.aeroporto.match;
  if (match === 'iata' || match === 'cidade') return true;
  if (match === 'proximo') {
    const km = transport.aeroporto.distancia_km ?? 999;
    return km <= 150;
  }
  return false;
}

async function main() {
  const indexes = loadTransportIndexes();
  if (!indexes.byIata.size) {
    console.error('No airports in data/transportation/airports.csv');
    process.exit(1);
  }

  const rows = await prisma.wvDestination.findMany({
    where: { lang },
    orderBy: { id: 'asc' },
    select: {
      id: true,
      lang: true,
      nome: true,
      pais: true,
      paisCode: true,
      continente: true,
      iata: true,
      tipo: true,
      latitude: true,
      longitude: true,
      transporte: true,
    },
  });

  let candidates = onlyBad ? rows.filter((r) => destNeedsIataFix(r, indexes.byIata)) : rows;
  if (limit) candidates = candidates.slice(0, limit);

  console.log(
    `wv_destinations IATA — candidates: ${candidates.length}/${rows.length} (dryRun=${dryRun}, onlyBad=${onlyBad}, lang=${lang})`,
  );

  let updated = 0;
  let skipped = 0;
  const skipReasons = { no_transport: 0, unchanged: 0 };

  for (const row of candidates) {
    const dest = rowToDest(row);
    const before = dest.iata?.trim().toUpperCase() ?? null;
    const transport = resolveTransportForDestination(indexes, dest);
    const after = dest.iata?.trim().toUpperCase() ?? null;

    if (!transportIataAcceptable(transport, row)) {
      skipped += 1;
      skipReasons.no_transport += 1;
      if (verbose) {
        console.log(
          `[skip] ${row.lang}-${row.id} (${row.nome}) — match fraco (${transport?.aeroporto?.match ?? 'none'})`,
        );
      }
      continue;
    }

    if (before === after && JSON.stringify(row.transporte) === JSON.stringify(transport)) {
      skipped += 1;
      skipReasons.unchanged += 1;
      continue;
    }

    if (verbose || before !== after) {
      console.log(
        `[${dryRun ? 'dry' : 'ok'}] ${row.lang}-${row.id} (${row.nome}) ${before ?? '—'} → ${after} (${transport.aeroporto.match})`,
      );
    }

    if (!dryRun) {
      await prisma.wvDestination.update({
        where: { id: row.id },
        data: {
          iata: after,
          transporte: transport,
        },
      });
    }
    updated += 1;
  }

  console.log(`Done. updated=${updated} skipped=${skipped}`, skipReasons);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
