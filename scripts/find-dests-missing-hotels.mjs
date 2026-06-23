import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const { loadProjectEnv } = await import('./lib/load-env.mjs');
loadProjectEnv(ROOT);

const { PrismaClient } = await import('@prisma/client');
const prisma = new PrismaClient();

try {
  const dests = await prisma.$queryRawUnsafe(`
    SELECT d.id, d.nome, d.pais, d.pais_code AS "paisCode",
      d.latitude, d.longitude,
      d.hotel_count,
      COUNT(h.id) AS actual_hoteis
    FROM wv_destinations d
    LEFT JOIN wv_hotels h ON h.destino_id = d.id
    WHERE d.pais_code NOT IN ('XX', 'ZZ')
    GROUP BY d.id, d.nome, d.pais, d.pais_code, d.latitude, d.longitude, d.hotel_count
    ORDER BY actual_hoteis, d.hotel_count
  `);

  const semHoteis = dests.filter(d => Number(d.actual_hoteis) === 0);
  const poucosHoteis = dests.filter(d => Number(d.actual_hoteis) > 0 && Number(d.actual_hoteis) <= 3);
  const algum = dests.filter(d => Number(d.actual_hoteis) > 3);

  console.log(`Destinos sem hotels: ${semHoteis.length}`);
  console.log(`Destinos com 1-3 hoteis: ${poucosHoteis.length}`);
  console.log(`Destinos com >3 hoteis: ${algum.length}`);
  console.log(`Total destinos (sem XX/ZZ): ${dests.length}`);

  const alvo = [...semHoteis, ...poucosHoteis];
  const alvoComCoords = alvo.filter(d => d.latitude && d.longitude);

  console.log(`\nAlvos para scraper (0-3 hoteis): ${alvo.length}`);
  console.log(`Com coordenadas: ${alvoComCoords.length}`);

  // Top 100 sem hoteis para amostra
  console.log('\nTop 20 sem hoteis (com coords):');
  semHoteis.filter(d => d.latitude && d.longitude).slice(0, 20).forEach(d =>
    console.log(`  [${d.id}] ${d.nome}, ${d.paisCode} (${d.pais})`));

  // Escrever JSON para scraper (top 500 com coords)
  const targets = alvoComCoords.slice(0, 500).map(d => ({
    id: Number(d.id),
    nome: d.nome,
    pais: d.pais || d.paisCode,
    paisCode: d.paisCode,
    lat: d.latitude,
    lon: d.longitude
  }));

  writeFileSync(resolve(ROOT, 'google-maps-scraper/destinos-faltam-hoteis.json'), JSON.stringify(targets, null, 2));
  console.log(`\nFicheiro escrito: google-maps-scraper/destinos-faltam-hoteis.json (${targets.length} destinos)`);
} finally {
  await prisma.$disconnect();
}
