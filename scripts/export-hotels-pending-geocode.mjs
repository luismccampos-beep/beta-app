#!/usr/bin/env node
/**
 * Exporta hotéis sem coordenadas em destinos SEM coordenadas
 * (~580 hotéis em ~164 localidades) para geocode manual.
 * Saída: data/hotels/export-hotels-pending-geocode.csv
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

const OUTPUT = resolve(ROOT, 'data/hotels/export-hotels-pending-geocode.csv');

async function main() {
  console.log('=== Hotéis sem coords em destinos SEM coords (para geocode manual) ===');

  const rows = await prisma.$queryRawUnsafe(`
    SELECT d.id AS destino_id, d.nome AS destino_nome, d.pais, d.pais_code,
           d.tipo, COUNT(*)::int AS hotel_count
    FROM wv_hotels h
    JOIN wv_destinations d ON d.id = h.destino_id
    WHERE h.latitude IS NULL
      AND d.latitude IS NULL
      AND d.pais_code != 'XX'
    GROUP BY d.id, d.nome, d.pais, d.pais_code, d.tipo
    ORDER BY d.pais, d.nome
  `);

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

  const ws = createWriteStream(OUTPUT, 'utf-8');
  ws.write(lines.join('\n'));
  ws.end();

  console.log(`  ${rows.length} destinos com ${rows.reduce((s, r) => s + Number(r.hotel_count), 0)} hotéis`);
  console.log(`  Exportado para ${OUTPUT}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
