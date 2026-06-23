import { PrismaClient } from '@prisma/client';
import { loadProjectEnv } from './lib/load-env.mjs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { COUNTRY_NAMES } from './lib/country-names.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
loadProjectEnv(resolve(__dirname));

const p = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL } },
});

const DRY_RUN = process.argv.includes('--dry-run');

// Mapping: dest id -> ISO country code
const MAP = {
  // US - Alaska
  3247: 'US',    // Anchor Point
  6027: 'US',    // Coldfoot
  18750: 'US',   // Wiseman
  21441: 'US',   // Iditarod Trail
  24339: 'US',   // Kobuk Valley National Park
  24354: 'US',   // Cape Krusenstern National Monument

  // US - other
  13329: 'US',   // Old 96 District (South Carolina)
  6712: 'GU',    // Diving in Guam (US territory)

  // Canada
  3609: 'CA',    // Auyuittuq National Park
  15238: 'CA',   // Saguenay–Lac-Saint-Jean
  23225: 'CA',   // Schreiber (Ontario)
  23525: 'CA',   // Carmacks (Yukon)
  24430: 'CA',   // Délįnę (Northwest Territories)

  // Australia
  4399: 'AU',    // Birdsville
  9705: 'AU',    // Karumba
  18623: 'AU',   // White Cliffs
  22175: 'AU',   // Flinders Island
  24929: 'AU',   // Tibooburra
  12136: 'AU',   // Montague Island
  25135: 'AU',   // Ned Kelly tourism

  // French Polynesia (overseas collectivity of France)
  7344: 'PF',    // Fakarava
  7750: 'PF',    // Gambier Islands
  11448: 'PF',   // Manihi
  14747: 'PF',   // Rangiroa
  17385: 'PF',   // Tikehau

  // Cook Islands (self-governing in free association with NZ)
  3543: 'CK',    // Atiu
  11422: 'CK',   // Mangaia

  // Falkland Islands (British Overseas Territory)
  5294: 'FK',    // Carcass Island
  15718: 'FK',   // Saunders Island
  15833: 'FK',   // Sea Lion Island

  // Mauritania
  11669: 'MR',   // Mauritania
  17367: 'MR',   // Tichit

  // Other
  5902: 'CO',    // Ciudad Perdida de Teyuna -> Colombia
  6720: 'ZA',    // Diving the Cape Peninsula... -> South Africa
  8194: 'GL',    // Greenland
  12881: 'CN',   // Ngari (prefecture) -> China (Tibet)
  13199: 'SJ',   // Ny-Ålesund -> Svalbard and Jan Mayen
  13368: 'HN',   // Omoa -> Honduras
  14017: 'KI',   // Phoenix Islands -> Kiribati
  14851: 'SB',   // Rennell and Bellona -> Solomon Islands
  16404: 'NA',   // Sossusvlei -> Namibia
  17669: 'PG',   // Trobriand Islands -> Papua New Guinea
  19494: 'BB',   // Diving in Barbados -> Barbados
  20488: 'SR',   // West Coast (Suriname) -> Suriname
  24441: 'MY',   // KL sightseeing walk -> Malaysia (Kuala Lumpur)
  26100: 'GB',   // Jane Austen tourism -> United Kingdom
  28457: 'KR',   // KPop Demon Hunters tour -> South Korea

  // Thematic articles with strong single-country association
  23437: 'US',   // Back to the Future tourism -> California, USA
  24405: 'NO',   // Voyages of Roald Amundsen -> Norway (explorer nationality)
  27675: 'FR',   // Count of Monte Cristo -> France (novel setting)

  // Additional user-requested assignments
  21813: 'HR',   // Game of Thrones tourism -> Croatia (Dubrovnik)
  19874: 'UA',   // Nuclear tourism -> Ukraine (Chernobyl)

  // Real places with wrong country (from destinos_acao.csv - IA errou)
  26127: 'AQ',   // Livingston Island (IA: GB) -> Antarctica
  28323: 'ID',   // Mount Slamet (IA: IN) -> Indonesia
  21916: 'CA',   // Outer Islands and Mainland Inlets (IA: MX) -> Canada
  27511: 'ES',   // Culturally significant landscape in Montoro (IA: CO) -> Spain
  26207: 'IN',   // Laikhurembi (IA: IR) -> India
  27694: 'FR',   // Gulf of Porto (IA: PT) -> France (Corsica)
  26798: 'IN',   // Thirubuvanai and Tiruvakkarai (IA: JP) -> India
  6668:  'TW',   // Tian Song Pi Agricultural Leisure Area (IA: IN) -> Taiwan
  27228: 'ES',   // Culturally significant landscape in Casares (IA: BR) -> Spain
  27181: 'ES',   // Culturally significant landscape in Vélez-Blanco (IA: CL) -> Spain
  27183: 'ES',   // Agricultural landscape of Carmona (IA: BR) -> Spain
  27866: 'CR',   // Aguacate Mountains Biological Corridor (IA: IT) -> Costa Rica
  24791: 'BT',   // Tashiyangtse (IA: CN) -> Bhutan
  28408: 'IN',   // Daksharamam (IA: NI) -> India
  23376: 'AR',   // Esperanza Base (IA: DO) -> Argentina
  13031: 'AZ',   // Northeastern Azerbaijan (IA: IT) -> Azerbaijan
};

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const ids = Object.keys(MAP).map(Number);

  const dests = await p.wvDestination.findMany({
    where: { id: { in: ids } },
    select: { id: true, nome: true },
  });

  console.log(`Destinos a reatribuir: ${dests.length} de ${ids.length} mapeados\n`);

  const updates = [];
  for (const d of dests) {
    const cc = MAP[d.id];
    const name = COUNTRY_NAMES[cc] || cc;
    updates.push({ id: d.id, nome: d.nome, cc, name });
    console.log(`  ${String(d.id).padEnd(8)} ${(d.nome || '').padEnd(45)} -> ${cc} (${name})`);
  }

  if (!dryRun && updates.length > 0) {
    const idsList = updates.map(u => u.id).join(',');
    const ccCases = updates.map(u => `WHEN id = ${u.id} THEN '${u.cc}'`).join(' ');
    const paisCases = updates.map(u => `WHEN id = ${u.id} THEN '${u.name.replace(/'/g, "''")}'`).join(' ');

    await p.$executeRawUnsafe(`
      UPDATE wv_destinations
      SET pais_code = CASE ${ccCases} ELSE pais_code END,
          pais = CASE ${paisCases} ELSE pais END
      WHERE id IN (${idsList})
    `);

    console.log(`\nAplicadas ${updates.length} reatribuicoes.`);
  } else if (dryRun) {
    console.log(`\nDry-run: ${updates.length} reatribuicoes prontas.`);
    console.log('Para aplicar: node scripts/_map-xx-manual.mjs');
  }

  await p.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
