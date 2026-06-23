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
  const r = await p.$queryRaw`
    SELECT d.id, d.nome, d.pais_code, d.pais, COUNT(h.id)::int AS hotel_cnt
    FROM wv_destinations d
    LEFT JOIN wv_hotels h ON h.destino_id = d.id
    WHERE d.pais_code != 'XX' AND d.latitude IS NULL
    GROUP BY d.id, d.nome, d.pais_code, d.pais
    ORDER BY hotel_cnt DESC
  `;
  console.log(`Total: ${r.length}`);
  // Categorize: likely non-geographic (travel guides / topics) vs real places
  const nonGeo = [], geo = [];
  for (const d of r) {
    const n = d.nome.toLowerCase();
    if (n.includes('tourism') || n.includes('cuisine') || n.includes('tour') || n.includes('architecture')
      || n.includes('national park') || n.includes('cycling') || n.includes('hiking')
      || n.includes('monopoly') || n.includes('universe') || n.includes('park')
      || n.includes('trip') || n.includes('itinerary') || n.includes('culture')
      || n.includes('music') || n.includes('art') || n.includes('museum')
      || n.includes('airport') || n.includes('heritage') || n.includes('history')
      || n.includes('border') || n.includes('monarch') || n.includes('empire')
      || n.includes('places of worship') || n.includes('paleontology')
      || n.includes('wine') || n.includes('sound of') || n.includes('canon')
      || n.includes('government') || n.includes('lake district')
      || n.includes('indigenous') || n.includes('winter in')) {
      nonGeo.push(d);
    } else {
      geo.push(d);
    }
  }
  console.log(`Non-geographic topics: ${nonGeo.length}`);
  console.log(`Potential real places: ${geo.length}`);
  console.log('\nPotential real places:');
  for (const d of geo) console.log(`  id=${d.id} "${d.nome.padEnd(42)}" ${d.pais_code} ${d.pais?.padEnd(20)} ${d.hotel_cnt} hotels`);

  await p.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
