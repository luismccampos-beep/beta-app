import { PrismaClient } from '@prisma/client';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync, existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// Load env
for (const file of ['.env.local', '.env']) {
  const path = resolve(ROOT, file);
  if (!existsSync(path)) continue;
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const m = line.match(/^\s*([^#=\s]+)\s*=\s*(.+)/);
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '');
  }
}

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL } },
});

const count = await prisma.wvHotel.count({ where: { fonte: 'geo_not_found' } });
console.log(`Hotels marked as geo_not_found: ${count}`);

const result = await prisma.wvHotel.updateMany({
  where: { fonte: 'geo_not_found' },
  data: { fonte: null },
});

console.log(`Reverted: ${result.count} hotels (fonte = null)`);
await prisma.$disconnect();
