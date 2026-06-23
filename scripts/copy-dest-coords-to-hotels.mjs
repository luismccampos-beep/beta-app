#!/usr/bin/env node
/**
 * copy-dest-coords-to-hotels.mjs
 *
 * Copia coordenadas dos destinos para os hotéis que ainda não têm coordenadas.
 * Processo todo em bulk (uma única query).
 *
 * Uso:
 *   node scripts/copy-dest-coords-to-hotels.mjs
 *   node scripts/copy-dest-coords-to-hotels.mjs --dry-run
 *   node scripts/copy-dest-coords-to-hotels.mjs --status
 */

import { PrismaClient } from '@prisma/client';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync, existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

function loadEnv() {
  for (const file of ['.env.local', '.env']) {
    const fpath = resolve(ROOT, file);
    if (!existsSync(fpath)) continue;
    for (const line of readFileSync(fpath, 'utf8').split('\n')) {
      const m = line.match(/^\s*([^#=\s]+)\s*=\s*(.+)/);
      if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '');
    }
  }
}

async function main() {
  loadEnv();
  const dryRun = process.argv.includes('--dry-run');
  const status = process.argv.includes('--status');

  const prisma = new PrismaClient({
    datasources: {
      db: { url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL },
    },
  });

  try {
    // Count copyable
    const countResult = await prisma.$queryRawUnsafe(`
      SELECT COUNT(*)::int AS total
      FROM wv_hotels h
      JOIN wv_destinations d ON d.id = h.destino_id
      WHERE h.latitude IS NULL
        AND h.longitude IS NULL
        AND d.latitude IS NOT NULL
        AND d.longitude IS NOT NULL
        AND (h.fonte IS NULL OR h.fonte NOT IN ('rejected_geo', 'geo_not_found'))
    `);
    const count = countResult?.[0]?.total ?? 0;

    if (status) {
      console.log(`Hotéis copiáveis de destinos: ${count}`);
      return;
    }

    console.log(`Hotéis pendentes que podem receber coordenadas do destino: ${count}`);

    if (count === 0) {
      console.log('Nada a fazer.');
      return;
    }

    if (dryRun) {
      console.log('(dry-run) Query seria executada:');
      console.log(`  UPDATE wv_hotels h`);
      console.log(`  SET latitude = d.latitude, longitude = d.longitude, fonte = 'dest_coords'`);
      console.log(`  FROM wv_destinations d`);
      console.log(`  WHERE h.destino_id = d.id`);
      console.log(`    AND d.latitude IS NOT NULL AND d.longitude IS NOT NULL`);
      console.log(`    AND h.latitude IS NULL AND h.longitude IS NULL`);
      console.log(`    AND (h.fonte IS NULL OR h.fonte NOT IN ('rejected_geo', 'geo_not_found'))`);
      return;
    }

    const result = await prisma.$executeRawUnsafe(`
      UPDATE wv_hotels h
      SET latitude = d.latitude,
          longitude = d.longitude,
          fonte = 'dest_coords'
      FROM wv_destinations d
      WHERE h.destino_id = d.id
        AND d.latitude IS NOT NULL
        AND d.longitude IS NOT NULL
        AND h.latitude IS NULL
        AND h.longitude IS NULL
        AND (h.fonte IS NULL OR h.fonte NOT IN ('rejected_geo', 'geo_not_found'))
    `);

    console.log(`✅ ${result} hotéis atualizados com coordenadas dos destinos.`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});