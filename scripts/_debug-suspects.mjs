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
  // Check entries that were flagged wrong
  const suspects = ['Abadan', 'Abomey', 'Agadir', 'Adis Abeba', 'Angola', 'Ancara', 'Acaraú', 'Aceguá (Rio Grande do Sul)'];
  for (const name of suspects) {
    const d = await p.$queryRaw`
      SELECT id, nome, pais_code, pais, latitude, longitude FROM wv_destinations WHERE nome = ${name} LIMIT 5
    `;
    for (const r of d) {
      console.log(`id=${r.id} "${r.nome}" pais=${r.pais_code} coords=(${r.latitude},${r.longitude})`);
    }
  }
  await p.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
