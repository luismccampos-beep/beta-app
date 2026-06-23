import { PrismaClient } from '@prisma/client';
import { loadProjectEnv } from './lib/load-env.mjs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
loadProjectEnv(ROOT);

const p = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL } },
});

async function main() {
  // Find ALL "Agadir" entries
  const agadir = await p.$queryRaw`SELECT id, nome, pais_code, pais, latitude, longitude FROM wv_destinations WHERE nome = 'Agadir'`;
  console.log('All Agadir entries:');
  for (const r of agadir) console.log(`  id=${r.id} pais=${r.pais_code} coords=(${r.latitude},${r.longitude})`);

  // Check if the correct Agadir (id=2933) was corrupted
  const c = await p.$queryRaw`SELECT id, nome, pais_code, latitude, longitude FROM wv_destinations WHERE id = 2933`;
  console.log('\nid=2933:', JSON.stringify(c[0]));

  // Count entries changed by the audit
  const changed = await p.$queryRaw`SELECT id, nome, pais_code, latitude, longitude FROM wv_destinations WHERE nome IN ('Abadan', 'Abomey', 'Agadir', 'Adis Abeba', 'Angola') ORDER BY id`;
  console.log('\nAfter audit:');
  for (const r of changed) console.log(`  id=${r.id} "${r.nome}" pais=${r.pais_code} coords=(${r.latitude},${r.longitude})`);

  // Count dests where pais_code != pais
  const mismatch = await p.$queryRaw`SELECT COUNT(*)::int AS cnt FROM wv_destinations WHERE pais_code != pais AND pais IS NOT NULL`;
  console.log(`\nDests where pais_code != pais: ${mismatch[0].cnt}`);

  await p.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
