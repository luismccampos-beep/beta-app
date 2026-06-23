#!/usr/bin/env node
/**
 * Classificação dos hotéis COM coordenadas por estrelas, fonte, etc.
 * Gera data/hotels/classificacao-hoteis-geocode.csv
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

const OUTPUT = resolve(ROOT, 'data/hotels/classificacao-hoteis-geocode.csv');

async function main() {
  const all = [];

  // 1. Total
  const total = await prisma.$queryRawUnsafe(`SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE latitude IS NOT NULL)::int AS com_coords, COUNT(*) FILTER (WHERE latitude IS NULL)::int AS sem_coords FROM wv_hotels`);
  all.push(['== Resumo Geral', '', '']);
  all.push(['Total', total[0].total, '']);
  all.push(['Com coordenadas', total[0].com_coords, '']);
  all.push(['Sem coordenadas', total[0].sem_coords, '']);
  all.push(['', '', '']);

  // 2. Por estrelas (só com coords)
  const byStars = await prisma.$queryRawUnsafe(`
    SELECT estrelas, COUNT(*)::int AS total,
           ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 1) AS pct
    FROM wv_hotels WHERE latitude IS NOT NULL
    GROUP BY estrelas ORDER BY estrelas
  `);
  all.push(['== Por Estrelas (com coords)', '', '']);
  all.push(['Estrelas', 'Total', '%']);
  for (const r of byStars) all.push([String(r.estrelas), String(r.total), String(r.pct)]);
  all.push(['', '', '']);

  // 3. Por fonte (só com coords)
  const byFonte = await prisma.$queryRawUnsafe(`
    SELECT COALESCE(fonte, '(null)') AS fonte, COUNT(*)::int AS total,
           ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 1) AS pct
    FROM wv_hotels WHERE latitude IS NOT NULL
    GROUP BY fonte ORDER BY total DESC
  `);
  all.push(['== Por Fonte (com coords)', '', '']);
  all.push(['Fonte', 'Total', '%']);
  for (const r of byFonte) all.push([r.fonte, String(r.total), String(r.pct)]);
  all.push(['', '', '']);

  // 4. Por estrelas + fonte cruzado
  all.push(['== Cruzado Estrelas x Fonte (com coords)', '', '']);
  const cross = await prisma.$queryRawUnsafe(`
    SELECT estrelas, COALESCE(fonte, '(null)') AS fonte, COUNT(*)::int AS total
    FROM wv_hotels WHERE latitude IS NOT NULL
    GROUP BY estrelas, fonte ORDER BY estrelas, total DESC
  `);
  all.push(['Estrelas', 'Fonte', 'Total']);
  for (const r of cross) all.push([String(r.estrelas), r.fonte, String(r.total)]);
  all.push(['', '', '']);

  // 5. Por estrelas dos SEM coordenadas
  const semStars = await prisma.$queryRawUnsafe(`
    SELECT estrelas, COUNT(*)::int AS total,
           ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 1) AS pct
    FROM wv_hotels WHERE latitude IS NULL
    GROUP BY estrelas ORDER BY estrelas
  `);
  all.push(['== Por Estrelas (SEM coords)', '', '']);
  all.push(['Estrelas', 'Total', '%']);
  for (const r of semStars) all.push([String(r.estrelas), String(r.total), String(r.pct)]);
  all.push(['', '', '']);

  // 6. Por fonte dos SEM coordenadas
  const semFonte = await prisma.$queryRawUnsafe(`
    SELECT COALESCE(fonte, '(null)') AS fonte, COUNT(*)::int AS total,
           ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 1) AS pct
    FROM wv_hotels WHERE latitude IS NULL
    GROUP BY fonte ORDER BY total DESC
  `);
  all.push(['== Por Fonte (SEM coords)', '', '']);
  all.push(['Fonte', 'Total', '%']);
  for (const r of semFonte) all.push([r.fonte, String(r.total), String(r.pct)]);

  // Write CSV
  const lines = all.map(row => row.join(','));
  const ws = createWriteStream(OUTPUT, 'utf-8');
  ws.write(lines.join('\n'));
  ws.end();

  // Print to console
  for (const row of all) {
    if (row[0].startsWith('==')) console.log(`\n${row[0]}`);
    else if (row.length === 3 && row[0] && row[1]) console.log(`  ${String(row[0]).padEnd(30)} ${String(row[1]).padStart(8)}${row[2] ? `  ${String(row[2])}%` : ''}`);
  }
  console.log(`\n✅ Exportado para ${OUTPUT}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
