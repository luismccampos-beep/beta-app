#!/usr/bin/env node
/**
 * Quick status check.
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
  const prisma = new PrismaClient({
    datasources: { db: { url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL } },
  });

  const hotels = await prisma.$queryRawUnsafe("SELECT COUNT(*)::int AS total FROM wv_hotels WHERE latitude IS NULL AND longitude IS NULL AND (fonte IS NULL OR fonte NOT IN ('rejected_geo','geo_not_found'))");
  const dests = await prisma.$queryRawUnsafe("SELECT COUNT(*)::int AS total FROM wv_destinations WHERE latitude IS NULL AND longitude IS NULL AND pais_code != 'XX'");
  const destsWithCoords = await prisma.$queryRawUnsafe("SELECT COUNT(*)::int AS total FROM wv_destinations WHERE latitude IS NOT NULL AND longitude IS NOT NULL");
  const totalDests = await prisma.$queryRawUnsafe("SELECT COUNT(*)::int AS total FROM wv_destinations");
  const destsXX = await prisma.$queryRawUnsafe("SELECT COUNT(*)::int AS total FROM wv_destinations WHERE pais_code = 'XX'");

  console.log('\n=== Status Final ===');
  console.log(`Destinos totais: ${totalDests?.[0]?.total ?? 0}`);
  console.log(`Destinos com coords: ${destsWithCoords?.[0]?.total ?? 0}`);
  console.log(`Destinos XX (sem país): ${destsXX?.[0]?.total ?? 0}`);
  console.log(`Destinos pendentes (non-XX): ${dests?.[0]?.total ?? 0}`);
  console.log(`Hotéis pendentes: ${hotels?.[0]?.total ?? 0}`);

  // Top 10 destinos pendentes com mais hoteis
  const top = await prisma.$queryRawUnsafe(`
    SELECT d.id, d.nome, d.pais_code, COUNT(h.id)::int AS hotel_count
    FROM wv_destinations d
    LEFT JOIN wv_hotels h ON h.destino_id = d.id AND h.latitude IS NULL AND h.longitude IS NULL AND (h.fonte IS NULL OR h.fonte NOT IN ('rejected_geo','geo_not_found'))
    WHERE d.latitude IS NULL AND d.longitude IS NULL AND d.pais_code != 'XX'
    GROUP BY d.id, d.nome, d.pais_code
    ORDER BY hotel_count DESC
    LIMIT 15
  `);
  if (top?.length) {
    console.log('\nTop destinos pendentes (mais hotéis sem coords):');
    for (const r of top) {
      console.log(`  ${r.nome} (${r.pais_code}): ${r.hotel_count} hotéis`);
    }
  }

  await prisma.$disconnect();
}

main().catch((err) => { console.error(err); process.exit(1); });