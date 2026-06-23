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

  const rows = await prisma.$queryRawUnsafe(`
    SELECT h.id, h.nome, d.nome as dest_nome, d.pais_code, d.latitude as dest_lat, d.longitude as dest_lon
    FROM wv_hotels h
    JOIN wv_destinations d ON d.id = h.destino_id
    WHERE h.latitude IS NULL AND h.longitude IS NULL
      AND (h.fonte IS NULL OR h.fonte NOT IN ('rejected_geo','geo_not_found'))
    LIMIT 10
  `);

  console.log(JSON.stringify(rows, null, 2));
  await prisma.$disconnect();
}

main().catch((err) => { console.error(err); process.exit(1); });