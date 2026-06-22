#!/usr/bin/env node
/**
 * Fase A.5 — Copia coordenadas do destino para hotéis sem coordenadas.
 * Gratuito, instantâneo, zero chamadas API.
 *
 * Uso:
 *   node scripts/_copy-dest-coords-to-hotels.mjs                 # executa (aceita UPDATE)
 *   node scripts/_copy-dest-coords-to-hotels.mjs --dry-run       # só mostra quantos
 *   node scripts/_copy-dest-coords-to-hotels.mjs --limit=1000    # max hotéis a atualizar
 */
import { PrismaClient } from '@prisma/client';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL } },
});

const FONTE = 'geo_from_dest';
const dryRun = process.argv.includes('--dry-run');
const limitArg = process.argv.find((a) => a.startsWith('--limit='));
const LIMIT = limitArg ? parseInt(limitArg.split('=')[1], 10) : 0;

async function main() {
  console.log('=== Fase A.5: Copiar coordenadas do destino para hotéis ===');
  console.log(`  Modo: ${dryRun ? 'dry-run' : 'UPDATE'}${LIMIT > 0 ? ` | limit=${LIMIT}` : ''}`);
  console.log();

  // Contar hotéis que podem ser resolvidos (destino tem coords, hotel não tem)
  const pendingRaw = await prisma.$queryRawUnsafe(`
    SELECT COUNT(*)::int AS total
    FROM wv_hotels h
    JOIN wv_destinations d ON d.id = h.destino_id
    WHERE h.latitude IS NULL AND h.longitude IS NULL
      AND d.latitude IS NOT NULL AND d.longitude IS NOT NULL
  `);
  const totalAplicavel = pendingRaw[0]?.total ?? 0;
  console.log(`  Hotéis sem coords em destinos COM coords: ${totalAplicavel}`);

  if (totalAplicavel === 0) {
    console.log('  Nada a fazer.');
    return;
  }

  // Mostrar top destinos
  const topDest = await prisma.$queryRawUnsafe(`
    SELECT d.nome, d.pais_code, d.latitude, d.longitude, COUNT(*)::int AS total
    FROM wv_hotels h
    JOIN wv_destinations d ON d.id = h.destino_id
    WHERE h.latitude IS NULL AND h.longitude IS NULL
      AND d.latitude IS NOT NULL AND d.longitude IS NOT NULL
    GROUP BY d.nome, d.pais_code, d.latitude, d.longitude
    ORDER BY total DESC
    LIMIT 5
  `);
  if (topDest?.length) {
    console.log('  Top destinos que serão aplicados:');
    for (const r of topDest) {
      console.log(`    ${r.nome} (${r.pais_code}) → ${r.total} hotéis`);
    }
  }
  console.log();

  if (dryRun) {
    console.log(`  [dry-run] Seriam atualizados ${totalAplicavel} hotéis.`);
    return;
  }

  // UPDATE em batch — copia lat/lon do destino para o hotel
  const limitClause = LIMIT > 0 ? `LIMIT ${LIMIT}` : '';
  const result = await prisma.$executeRawUnsafe(`
    UPDATE wv_hotels AS h
    SET latitude = d.latitude,
        longitude = d.longitude,
        fonte = '${FONTE}'
    FROM wv_destinations AS d
    WHERE h.destino_id = d.id
      AND h.latitude IS NULL AND h.longitude IS NULL
      AND d.latitude IS NOT NULL AND d.longitude IS NOT NULL
    ${limitClause}
  `);

  console.log(`  ✅ ${result} hotéis atualizados com coordenadas do destino.`);
  console.log(`  Fonte marcada como: '${FONTE}'`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
