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

function parseCSV(text) {
  const lines = text.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const vals = [];
    let cur = '';
    let inQ = false;
    for (const ch of lines[i]) {
      if (ch === '"') { inQ = !inQ; continue; }
      if (ch === ',' && !inQ) { vals.push(cur.trim()); cur = ''; continue; }
      cur += ch;
    }
    vals.push(cur.trim());
    const obj = {};
    headers.forEach((h, idx) => obj[h] = vals[idx] || '');
    rows.push(obj);
  }
  return rows;
}

async function main() {
  const csv = readFileSync(resolve(ROOT, 'data/lugares_reais_final.csv'), 'utf-8');
  const rows = parseCSV(csv);
  console.log(`CSV: ${rows.length} entries`);

  // Separate destinations vs hotels
  const destEntries = rows.filter(r => r.categoria !== 'hotel');
  const hotelEntries = rows.filter(r => r.categoria === 'hotel');
  console.log(`  Destinations: ${destEntries.length}`);
  console.log(`  Hotels: ${hotelEntries.length}\n`);

  // --- MATCH DESTINATIONS ---
  let destFound = 0, destUpdated = 0, destAlready = 0;
  for (const entry of destEntries) {
    const nome = entry.nome;
    const pais = entry.pais;
    const lat = parseFloat(entry.latitude);
    const lon = parseFloat(entry.longitude);

    // Try exact match, then partial
    let dest = await p.$queryRaw`
      SELECT id, nome, pais_code, latitude, longitude FROM wv_destinations
      WHERE LOWER(nome) = LOWER(${nome}) LIMIT 1
    `;
    if (dest.length === 0) {
      dest = await p.$queryRaw`
        SELECT id, nome, pais_code, latitude, longitude FROM wv_destinations
        WHERE LOWER(nome) LIKE LOWER(${'%' + nome + '%'}) LIMIT 1
      `;
    }
    if (dest.length === 0) {
      // Try partial match on first significant word
      const firstWord = nome.split(/[\s,]+/)[0];
      if (firstWord && firstWord.length > 3) {
        dest = await p.$queryRaw`
          SELECT id, nome, pais_code, latitude, longitude FROM wv_destinations
          WHERE LOWER(nome) LIKE LOWER(${'%' + firstWord + '%'}) LIMIT 1
        `;
      }
    }

    if (dest.length === 0) {
      console.log(`  DEST NOT FOUND: ${nome.padEnd(40)} ${pais}`);
      continue;
    }

    destFound++;
    const d = dest[0];
    if (d.latitude !== null) {
      destAlready++;
      continue;
    }

    await p.$executeRaw`
      UPDATE wv_destinations SET latitude = ${lat}, longitude = ${lon}, pais_code = ${pais}, pais = ${pais}
      WHERE id = ${d.id}
    `;
    destUpdated++;
    console.log(`  DEST UPDATED:  ${String(d.id).padEnd(6)} ${nome.padEnd(40)} ${pais} (${lat}, ${lon})`);
  }

  // --- MATCH HOTELS ---
  let hotelFound = 0, hotelUpdated = 0, hotelAlready = 0;
  for (const entry of hotelEntries) {
    const nome = entry.nome;
    const pais = entry.pais;
    const lat = parseFloat(entry.latitude);
    const lon = parseFloat(entry.longitude);

    // Try exact match first
    let hotel = await p.$queryRaw`
      SELECT id, nome, latitude, longitude FROM wv_hotels
      WHERE LOWER(nome) = LOWER(${nome}) LIMIT 1
    `;
    if (hotel.length === 0) {
      hotel = await p.$queryRaw`
        SELECT id, nome, latitude, longitude FROM wv_hotels
        WHERE LOWER(nome) LIKE LOWER(${'%' + nome + '%'}) LIMIT 1
      `;
    }

    if (hotel.length === 0) {
      console.log(`  HOTEL NOT FOUND: ${nome.padEnd(45)} ${pais}`);
      continue;
    }

    hotelFound++;
    const h = hotel[0];
    if (h.latitude !== null) {
      hotelAlready++;
      continue;
    }

    await p.$executeRaw`
      UPDATE wv_hotels SET latitude = ${lat}, longitude = ${lon}
      WHERE id = ${h.id}
    `;
    hotelUpdated++;
    console.log(`  HOTEL UPDATED: ${String(h.id).padEnd(7)} ${nome.padEnd(45)} ${pais}`);
  }

  console.log(`\n═══ RESULTS ═══`);
  console.log(`Destinations: ${destFound} found, ${destUpdated} updated, ${destAlready} already had coords`);
  console.log(`Hotels: ${hotelFound} found, ${hotelUpdated} updated, ${hotelAlready} already had coords`);

  // Show remaining missing non-XX dests
  const remaining = await p.$queryRaw`
    SELECT d.id, d.nome, d.pais_code, COUNT(h.id)::int AS hc
    FROM wv_destinations d LEFT JOIN wv_hotels h ON h.destino_id = d.id
    WHERE d.pais_code != 'XX' AND d.latitude IS NULL
    GROUP BY d.id ORDER BY hc DESC LIMIT 20
  `;
  if (remaining.length > 0) {
    console.log(`\nTop non-XX dests still without coords:`);
    for (const r of remaining) {
      console.log(`  ${String(r.id).padEnd(6)} ${r.nome.padEnd(42)} ${r.pais_code.padEnd(4)} ${r.hc}h`);
    }
  }

  // Final state
  const [d] = await p.$queryRaw`SELECT COUNT(*)::int AS t, COUNT(*) FILTER (WHERE pais_code!='XX' AND latitude IS NOT NULL)::int AS ok, COUNT(*) FILTER (WHERE pais_code!='XX' AND latitude IS NULL)::int AS no FROM wv_destinations`;
  const [h] = await p.$queryRaw`SELECT COUNT(*)::int AS t, COUNT(*) FILTER (WHERE latitude IS NOT NULL)::int AS ok FROM wv_hotels`;
  console.log(`\nFINAL:`);
  console.log(`Dests: ${d.t} total, ${d.ok} non-XX ok, ${d.no} non-XX missing (${(d.ok/(d.ok+d.no)*100).toFixed(1)}%)`);
  console.log(`Hotels: ${h.t} total, ${h.ok} with coords (${(h.ok/h.t*100).toFixed(1)}%)`);

  await p.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
