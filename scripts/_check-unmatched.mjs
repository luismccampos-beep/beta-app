import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PrismaClient } from '@prisma/client';
import { loadProjectEnv } from './lib/load-env.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
loadProjectEnv(ROOT);

const p = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL } },
});

async function main() {
  // Read CSV hotels that weren't matched
  const csv = readFileSync(resolve(ROOT, 'lugares_reais_final.csv'), 'utf-8');
  const lines = csv.trim().split('\n').slice(1);
  const hotels = [];
  for (const line of lines) {
    const parts = line.split(',');
    if (parts[5] === 'hotel') {
      // name might be quoted
      let name = parts[0];
      if (name.startsWith('"')) {
        // find closing quote
        let full = '';
        for (let i = 0; i < parts.length; i++) {
          full += (i > 0 ? ',' : '') + parts[i];
          if (parts[i].endsWith('"')) break;
        }
        name = full.replace(/^"(.*)"$/, '$1');
      }
      const pais = parts[1];
      const lat = parseFloat(parts[2]);
      const lon = parseFloat(parts[3]);
      hotels.push({ nome: name, pais, lat, lon });
    }
  }
  console.log(`CSV hotels: ${hotels.length}`);

  let matchedToHotel = 0;
  let matchedToDest = 0;
  let notFound = 0;

  for (const h of hotels) {
    // Try exact match in hotels
    let found = await p.$queryRaw`
      SELECT id, nome, latitude, 'hotel' AS src FROM wv_hotels
      WHERE LOWER(nome) = LOWER(${h.nome}) LIMIT 1
    `;
    if (found.length > 0) {
      matchedToHotel++;
      continue;
    }
    // Try like match
    found = await p.$queryRaw`
      SELECT id, nome, latitude, 'hotel' AS src FROM wv_hotels
      WHERE LOWER(nome) LIKE LOWER(${'%' + h.nome + '%'}) LIMIT 1
    `;
    if (found.length > 0) {
      matchedToHotel++;
      continue;
    }
    // Try exact match in destinations
    found = await p.$queryRaw`
      SELECT id, nome, latitude, 'dest' AS src FROM wv_destinations
      WHERE LOWER(nome) = LOWER(${h.nome}) LIMIT 1
    `;
    if (found.length > 0) {
      matchedToDest++;
      console.log(`  ${h.nome.padEnd(45)} → DEST ${found[0].id} (lat=${found[0].latitude})`);
      continue;
    }
    // Try partial match in destinations
    found = await p.$queryRaw`
      SELECT id, nome, latitude, 'dest' AS src FROM wv_destinations
      WHERE LOWER(nome) LIKE LOWER(${'%' + h.nome + '%'}) LIMIT 1
    `;
    if (found.length > 0) {
      matchedToDest++;
      console.log(`  ${h.nome.padEnd(45)} → DEST ${found[0].id} "${found[0].nome}" (lat=${found[0].latitude})`);
      continue;
    }
    notFound++;
    console.log(`  ${h.nome.padEnd(45)} → NOT FOUND`);
  }

  console.log(`\nResults: ${matchedToHotel} in hotels, ${matchedToDest} in dests, ${notFound} not found`);

  // Show remaining non-XX dests without coords
  const rem = await p.$queryRaw`
    SELECT d.id, d.nome, d.pais_code, COUNT(h.id)::int AS hc
    FROM wv_destinations d LEFT JOIN wv_hotels h ON h.destino_id = d.id
    WHERE d.pais_code != 'XX' AND d.latitude IS NULL
    GROUP BY d.id ORDER BY hc DESC
  `;
  console.log(`\nNon-XX dests without coords: ${rem.length}`);
  for (const r of rem.slice(0, 20)) {
    console.log(`  ${String(r.id).padEnd(6)} ${r.nome.padEnd(42)} ${r.pais_code.padEnd(4)} ${r.hc}h`);
  }

  const [{ c }] = await p.$queryRaw`SELECT COUNT(*)::int AS c FROM wv_hotels WHERE latitude IS NULL`;
  console.log(`\nHotels without coords: ${c}`);

  await p.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
