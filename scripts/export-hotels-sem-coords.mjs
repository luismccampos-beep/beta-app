#!/usr/bin/env node
/**
 * Exporta hotéis sem coordenadas da BD para CSV.
 * Opcional: --only-pending (só hotéis em destinos COM coordenadas, que podem ser resolvidos)
 *           --by-dest (agrupado por destino)
 *           --limit=N
 *           --output=path
 */
import { PrismaClient } from '@prisma/client';
import { loadProjectEnv } from './lib/load-env.mjs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createWriteStream } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
loadProjectEnv(ROOT);

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL } },
});

const onlyPending = process.argv.includes('--only-pending');
const byDest = process.argv.includes('--by-dest');
const limitArg = process.argv.find((a) => a.startsWith('--limit='));
const LIMIT = limitArg ? parseInt(limitArg.split('=')[1], 10) : 0;
const outputArg = process.argv.find((a) => a.startsWith('--output='));
const OUTPUT = outputArg ? outputArg.split('=')[1] : null;

const OUTPUT_PATH = OUTPUT || resolve(ROOT, 'data/hotels/export-hotels-sem-coords.csv');

async function main() {
  console.log('=== Exportar hotéis sem coordenadas ===');

  // Count total
  const totalRaw = await prisma.$queryRawUnsafe(`
    SELECT COUNT(*)::int AS total FROM wv_hotels WHERE latitude IS NULL
  `);
  console.log(`  Total hotéis sem coords na BD: ${totalRaw[0]?.total ?? 0}`);

  let query;
  if (byDest) {
    query = `
      SELECT d.id AS destino_id, d.nome AS destino_nome, d.pais, d.pais_code,
             COUNT(*)::int AS hotel_count
      FROM wv_hotels h
      JOIN wv_destinations d ON d.id = h.destino_id
      WHERE h.latitude IS NULL
      GROUP BY d.id, d.nome, d.pais, d.pais_code
      ORDER BY hotel_count DESC
    `;
  } else if (onlyPending) {
    query = `
      SELECT h.id, h.nome AS hotel_nome, h.fonte, h.estrelas,
             d.id AS destino_id, d.nome AS destino_nome, d.pais, d.pais_code,
             d.latitude AS dest_lat, d.longitude AS dest_lon
      FROM wv_hotels h
      JOIN wv_destinations d ON d.id = h.destino_id
      WHERE h.latitude IS NULL
        AND d.latitude IS NOT NULL AND d.longitude IS NOT NULL
      ${LIMIT > 0 ? `LIMIT ${LIMIT}` : ''}
    `;
  } else {
    query = `
      SELECT h.id, h.nome AS hotel_nome, h.fonte, h.estrelas,
             d.id AS destino_id, d.nome AS destino_nome, d.pais, d.pais_code,
             d.latitude AS dest_lat, d.longitude AS dest_lon
      FROM wv_hotels h
      JOIN wv_destinations d ON d.id = h.destino_id
      WHERE h.latitude IS NULL
      ${LIMIT > 0 ? `LIMIT ${LIMIT}` : ''}
    `;
  }

  const rows = await prisma.$queryRawUnsafe(query);

  if (!rows || rows.length === 0) {
    console.log('  Nenhum resultado.');
    return;
  }

  const keys = Object.keys(rows[0]);
  const header = keys.join(',');
  const lines = [header];
  for (const row of rows) {
    const vals = keys.map((k) => {
      const v = row[k];
      if (v === null || v === undefined) return '';
      const s = String(v);
      return s.includes(',') || s.includes('"') || s.includes('\n')
        ? `"${s.replace(/"/g, '""')}"`
        : s;
    });
    lines.push(vals.join(','));
  }

  const ws = createWriteStream(OUTPUT_PATH, 'utf-8');
  ws.write(lines.join('\n'));
  ws.end();

  console.log(`  ${rows.length} linhas exportadas para ${OUTPUT_PATH}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
