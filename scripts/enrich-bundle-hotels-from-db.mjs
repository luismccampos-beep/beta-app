/**
 * Enriquece bundle.json com hotéis da BD (wv_hotels via Prisma).
 *
 * NOTA: O bundle.json contém dados sintéticos (mock) com paisCode e iata
 * incorretos. O matching é feito APENAS por nome normalizado.
 *
 * Uso:
 *   npm run travel:demo:enrich-hotels-from-db
 *   npm run travel:demo:enrich-hotels-from-db -- --dry-run
 *   npm run travel:demo:enrich-hotels-from-db -- --max-per-dest=12
 *   npm run travel:demo:enrich-hotels-from-db -- --max-per-dest=50 --all
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PrismaClient } from '@prisma/client';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const BUNDLE_PATH = resolve(ROOT, 'src/data/travel-mock/bundle.json');

const dryRun = process.argv.includes('--dry-run');
const enrichAll = process.argv.includes('--all'); // ignore max-per-dest, add all
const maxPerDest = parseInt(
  process.argv.find((a) => a.startsWith('--max-per-dest'))?.split('=')[1] ??
    process.env.HOTEL_DB_ENRICH_MAX_PER_DEST ??
    '12',
  10,
);

function normalize(str) {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

async function main() {
  console.log('=== Enrich bundle com hotéis da BD ===\n');

  // 1. Read bundle
  const bundle = JSON.parse(readFileSync(BUNDLE_PATH, 'utf8'));
  console.log(`Bundle: ${bundle.meta.counts.destinos} destinos, ${bundle.meta.counts.hoteis} hotéis`);
  console.log(`Modo: ${dryRun ? 'dry-run' : 'escrita'} | max por destino: ${enrichAll ? 'ILIMITADO' : maxPerDest}`);

  // 2. Connect to DB
  const prisma = new PrismaClient();
  try {
    // 3. Build a set of all normalized bundle nomes for batch lookup
    const bundleNomeToDests = new Map();
    for (const dest of bundle.destinos) {
      const key = normalize(dest.nome);
      if (!bundleNomeToDests.has(key)) {
        bundleNomeToDests.set(key, []);
      }
      bundleNomeToDests.get(key).push(dest);
    }

    const normalizedNomes = [...bundleNomeToDests.keys()];
    console.log(`\nA pesquisar ${normalizedNomes.length} nomes únicos na BD...`);

    // 4. Batch: for each normalized nome, find matching wv_destinations
    const dbDestMap = new Map(); // normalized nome -> wvDestination
    let matchedCount = 0;
    let skippedCount = 0;

    for (const nn of normalizedNomes) {
      // Search DB by nome (accent + case insensitive via contains com normalized)
      const dbDests = await prisma.wvDestination.findMany({
        where: {
          nome: { contains: nn, mode: 'insensitive' },
        },
        select: { id: true, nome: true, pais: true, paisCode: true, iata: true, hotelCount: true },
        take: 5,
      });

      // Try exact normalized match
      const match = dbDests.find((dbd) => normalize(dbd.nome) === nn);
      if (match) {
        dbDestMap.set(nn, match);
        matchedCount++;
      } else {
        skippedCount++;
      }
    }

    console.log(`Match na BD: ${matchedCount} destinos`);
    console.log(`Sem match: ${skippedCount} destinos`);

    // 5. For each matched destino, fetch hotels
    const existingHotelIds = new Set(bundle.hoteis.map((h) => h.id));
    let nextHotelId = bundle.hoteis.reduce((m, h) => Math.max(m, h.id), 0);
    let added = 0;
    const byDestino = [];

    for (const [nn, bDests] of bundleNomeToDests) {
      const dbDest = dbDestMap.get(nn);
      if (!dbDest) continue;

      for (const bDest of bDests) {
        const have = bundle.hoteis.filter((h) => h.destino_id === bDest.id).length;
        const limit = enrichAll ? 9999 : maxPerDest;
        if (have >= limit) continue;

        const dbHotels = await prisma.wvHotel.findMany({
          where: { destinoId: dbDest.id },
          select: {
            id: true,
            nome: true,
            estrelas: true,
            precoPorNoite: true,
            comodidades: true,
          },
take: Math.min(limit - have, 99999),
          orderBy: { estrelas: 'desc' },
        });

        if (!dbHotels.length) continue;

        for (const h of dbHotels) {
          nextHotelId += 1;

          // Handle Decimal -> number serialization
          const preco = h.precoPorNoite != null
            ? (typeof h.precoPorNoite === 'object' ? Number(h.precoPorNoite) : Number(h.precoPorNoite))
            : 85;

          // Handle comodidades - might be JSON string or already an array
          let comodidades = h.comodidades ?? ['wifi', 'ar condicionado', 'tv'];
          if (typeof comodidades === 'string') {
            try { comodidades = JSON.parse(comodidades); } catch { comodidades = ['wifi', 'ar condicionado', 'tv']; }
          }

          bundle.hoteis.push({
            id: nextHotelId,
            destino_id: bDest.id,
            nome: h.nome,
            estrelas: h.estrelas ?? 3,
            preco_por_noite: preco,
            comodidades,
            fonte: 'db_wv_hotels',
          });
          added += 1;
        }

        byDestino.push({
          bundleDestino: bDest.nome,
          dbDestino: dbDest.nome,
          pais: dbDest.pais,
          added: dbHotels.length,
          totalDbHotels: dbDest.hotelCount ?? dbHotels.length,
        });
      }
    }

    // 6. Summary
    console.log(`\n=== Resultados ===`);
    console.log(`  Destinos com match: ${matchedCount}`);
    console.log(`  Destinos sem match: ${skippedCount}`);
    console.log(`  Hotéis adicionados: ${added}`);
    console.log(`  Total hotéis no bundle: ${bundle.hoteis.length}`);

    if (byDestino.length > 0) {
      console.log(`\nTop destinos enrichidos:`);
      byDestino
        .sort((a, b) => b.added - a.added)
        .slice(0, 20)
        .forEach((d) => {
          console.log(`  ${d.bundleDestino} → ${d.dbDestino} (${d.pais}): +${d.added} hotéis`);
        });
    }

    if (dryRun) {
      console.log('\n(dry-run — bundle não foi escrito)');
      return;
    }

    // 7. Update bundle
    bundle.meta.counts.hoteis = bundle.hoteis.length;
    bundle.meta.hotelEnrichFromDb = {
      at: new Date().toISOString(),
      added,
      matchedDests: matchedCount,
      skippedDests: skippedCount,
      source: 'wv_hotels (Neon)',
    };

    writeFileSync(BUNDLE_PATH, JSON.stringify(bundle, null, 2), 'utf8');
    const sizeMb = (Buffer.byteLength(JSON.stringify(bundle)) / 1024 / 1024).toFixed(2);
    console.log(`\n✅ Bundle atualizado: ${BUNDLE_PATH} (${sizeMb} MB)`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error('Erro:', e);
  process.exit(1);
});
