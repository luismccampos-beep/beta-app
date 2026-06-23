/**
 * Deep analysis of XX destinations to plan country reassignment.
 * Run: node scripts/_analyze-xx-reassign.mjs
 */
import { PrismaClient } from '@prisma/client';
import { loadProjectEnv } from './lib/load-env.mjs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

loadProjectEnv(resolve(dirname(fileURLToPath(import.meta.url)), '..'));

const p = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL } },
});

async function main() {
  const xxTotal = await p.wvDestination.count({ where: { paisCode: 'XX' } });
  const xxWithCoords = await p.wvDestination.count({ where: { paisCode: 'XX', latitude: { not: null } } });
  const xxWithIata = await p.wvDestination.count({ where: { paisCode: 'XX', iata: { not: null } } });

  console.log('=== XX Destinations ===');
  console.log('Total:', xxTotal.toLocaleString());
  console.log('With dest coords:', xxWithCoords.toLocaleString(), `(${(xxWithCoords / xxTotal * 100).toFixed(1)}%)`);
  console.log('With IATA:', xxWithIata.toLocaleString());

  // Hotels with coords in XX destinations
  const hotelStats = await p.$queryRawUnsafe(`
    SELECT
      COUNT(DISTINCT d.id)::int AS dests_with_hotel_coords,
      COUNT(DISTINCT h.id)::int AS hotels_with_coords
    FROM wv_destinations d
    JOIN wv_hotels h ON h.destino_id = d.id
    WHERE d.pais_code = 'XX' AND h.latitude IS NOT NULL
  `);
  console.log('Dests with ≥1 hotel coords:', hotelStats[0].dests_with_hotel_coords.toLocaleString());
  console.log('Hotels with coords in XX:', hotelStats[0].hotels_with_coords.toLocaleString());

  // Both dest coords AND hotel coords
  const both = await p.$queryRawUnsafe(`
    SELECT COUNT(DISTINCT d.id)::int AS cnt
    FROM wv_destinations d
    JOIN wv_hotels h ON h.destino_id = d.id
    WHERE d.pais_code = 'XX' AND d.latitude IS NOT NULL AND h.latitude IS NOT NULL
  `);
  console.log('Both dest+hotel coords:', both[0].cnt.toLocaleString());

  // Name hint analysis
  const usStates = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
    'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas',
    'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
    'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
    'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
    'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah',
    'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
  let usHints = 0;
  for (const state of usStates) {
    const cnt = await p.wvDestination.count({ where: { paisCode: 'XX', nome: { contains: state } } });
    usHints += cnt;
  }
  console.log('\n=== Name Hints ===');
  console.log('US state in name:', usHints.toLocaleString());

  const ukPatterns = ['England', 'Scotland', 'Wales', 'Northern Ireland', 'Britain', ' London', 'Manchester',
    'Liverpool', 'Birmingham', 'Edinburgh', 'Glasgow', 'Cardiff', 'Belfast'];
  let ukHints = 0;
  for (const p of ukPatterns) {
    const cnt = await p.wvDestination.count({ where: { paisCode: 'XX', nome: { contains: p } } });
    ukHints += cnt;
  }
  console.log('UK hints in name:', ukHints.toLocaleString());

  const caPatterns = ['Ontario', 'Quebec', 'British Columbia', 'Alberta', 'Manitoba', 'Saskatchewan',
    'Nova Scotia', 'New Brunswick', 'Newfoundland', 'Toronto', 'Vancouver', 'Montreal', 'Ottawa', 'Calgary'];
  let caHints = 0;
  for (const p of caPatterns) {
    const cnt = await p.wvDestination.count({ where: { paisCode: 'XX', nome: { contains: p } } });
    caHints += cnt;
  }
  console.log('Canada hints:', caHints.toLocaleString());

  const auPatterns = ['Victoria', 'New South Wales', 'Queensland', 'Western Australia', 'South Australia',
    'Tasmania', 'Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Darwin', 'Canberra', 'Gold Coast'];
  let auHints = 0;
  for (const p of auPatterns) {
    const cnt = await p.wvDestination.count({ where: { paisCode: 'XX', nome: { contains: p } } });
    auHints += cnt;
  }
  console.log('Australia hints:', auHints.toLocaleString());

  // Country name in parentheses
  console.log('\n=== Country name in parentheses ===');
  const countryHints = await p.$queryRawUnsafe(`
    SELECT
      CASE
        WHEN nome ~* '\\(Brasil\\)|\\(Brazil\\)' THEN 'BR'
        WHEN nome ~* '\\(México\\)|\\(Mexico\\)' THEN 'MX'
        WHEN nome ~* '\\(Japão\\)|\\(Japan\\)' THEN 'JP'
        WHEN nome ~* '\\(Índia\\)|\\(India\\)' THEN 'IN'
        WHEN nome ~* '\\(França\\)|\\(France\\)' THEN 'FR'
        WHEN nome ~* '\\(Alemanha\\)|\\(Germany\\)' THEN 'DE'
        WHEN nome ~* '\\(Itália\\)|\\(Italy\\)' THEN 'IT'
        WHEN nome ~* '\\(Espanha\\)|\\(Spain\\)' THEN 'ES'
        WHEN nome ~* '\\(Portugal\\)' THEN 'PT'
        WHEN nome ~* '\\(China\\)' THEN 'CN'
        WHEN nome ~* '\\(Argentina\\)' THEN 'AR'
        WHEN nome ~* '\\(Chile\\)' THEN 'CL'
        WHEN nome ~* '\\(Colômbia\\)|\\(Colombia\\)' THEN 'CO'
        WHEN nome ~* '\\(Peru\\)' THEN 'PE'
        WHEN nome ~* '\\(Rússia\\)|\\(Russia\\)' THEN 'RU'
        WHEN nome ~* '\\(Canadá\\)|\\(Canada\\)' THEN 'CA'
        WHEN nome ~* '\\(Austrália\\)|\\(Australia\\)' THEN 'AU'
        WHEN nome ~* '\\(Polônia\\)|\\(Poland\\)' THEN 'PL'
        WHEN nome ~* '\\(Indonésia\\)|\\(Indonesia\\)' THEN 'ID'
        WHEN nome ~* '\\(Tailândia\\)|\\(Thailand\\)' THEN 'TH'
        WHEN nome ~* '\\(Vietnã\\)|\\(Vietnam\\)' THEN 'VN'
        WHEN nome ~* '\\(Filipinas\\)|\\(Philippines\\)' THEN 'PH'
        WHEN nome ~* '\\(Malásia\\)|\\(Malaysia\\)' THEN 'MY'
        WHEN nome ~* '\\(Egito\\)|\\(Egypt\\)' THEN 'EG'
        WHEN nome ~* '\\(Turquia\\)|\\(Turkey\\)' THEN 'TR'
        WHEN nome ~* '\\(Grécia\\)|\\(Greece\\)' THEN 'GR'
        WHEN nome ~* '\\(Coreia do Sul\\)|\\(South Korea\\)' THEN 'KR'
        WHEN nome ~* '\\(África do Sul\\)|\\(South Africa\\)' THEN 'ZA'
        WHEN nome ~* '\\(Suécia\\)|\\(Sweden\\)' THEN 'SE'
        WHEN nome ~* '\\(Noruega\\)|\\(Norway\\)' THEN 'NO'
        WHEN nome ~* '\\(Dinamarca\\)|\\(Denmark\\)' THEN 'DK'
        WHEN nome ~* '\\(Finlândia\\)|\\(Finland\\)' THEN 'FI'
        WHEN nome ~* '\\(Países Baixos\\)|\\(Netherlands\\)|\\(Holanda\\)' THEN 'NL'
        WHEN nome ~* '\\(Bélgica\\)|\\(Belgium\\)' THEN 'BE'
        WHEN nome ~* '\\(Suíça\\)|\\(Switzerland\\)' THEN 'CH'
        WHEN nome ~* '\\(Áustria\\)|\\(Austria\\)' THEN 'AT'
        WHEN nome ~* '\\(República Tcheca\\)|\\(Czech Republic\\)|\\(Czechia\\)' THEN 'CZ'
        WHEN nome ~* '\\(Hungria\\)|\\(Hungary\\)' THEN 'HU'
        WHEN nome ~* '\\(Romênia\\)|\\(Romania\\)' THEN 'RO'
        WHEN nome ~* '\\(Bulgária\\)|\\(Bulgaria\\)' THEN 'BG'
        WHEN nome ~* '\\(Croácia\\)|\\(Croatia\\)' THEN 'HR'
        WHEN nome ~* '\\(Sérvia\\)|\\(Serbia\\)' THEN 'RS'
        WHEN nome ~* '\\(Ucrânia\\)|\\(Ukraine\\)' THEN 'UA'
        WHEN nome ~* '\\(Marrocos\\)|\\(Morocco\\)' THEN 'MA'
        WHEN nome ~* '\\(Tunísia\\)|\\(Tunisia\\)' THEN 'TN'
        WHEN nome ~* '\\(Nigéria\\)|\\(Nigeria\\)' THEN 'NG'
        WHEN nome ~* '\\(Quênia\\)|\\(Kenya\\)' THEN 'KE'
        WHEN nome ~* '\\(Tanzânia\\)|\\(Tanzania\\)' THEN 'TZ'
        WHEN nome ~* '\\(Emirados Árabes\\)|\\(UAE\\)|\\(Dubai\\)' THEN 'AE'
        WHEN nome ~* '\\(Arábia Saudita\\)|\\(Saudi Arabia\\)' THEN 'SA'
        WHEN nome ~* '\\(Israel\\)' THEN 'IL'
        WHEN nome ~* '\\(Irlanda\\)|\\(Ireland\\)' THEN 'IE'
        WHEN nome ~* '\\(Nova Zelândia\\)|\\(New Zealand\\)' THEN 'NZ'
        WHEN nome ~* '\\(Singapura\\)|\\(Singapore\\)' THEN 'SG'
        WHEN nome ~* '\\(Hong Kong\\)' THEN 'HK'
        WHEN nome ~* '\\(Taiwan\\)' THEN 'TW'
        WHEN nome ~* '\\(Bangladesh\\)' THEN 'BD'
        WHEN nome ~* '\\(Paquistão\\)|\\(Pakistan\\)' THEN 'PK'
        WHEN nome ~* '\\(Sri Lanka\\)' THEN 'LK'
        WHEN nome ~* '\\(Nepal\\)' THEN 'NP'
        WHEN nome ~* '\\(Myanmar\\)|\\(Birmânia\\)' THEN 'MM'
        WHEN nome ~* '\\(Camboja\\)|\\(Cambodia\\)' THEN 'KH'
        WHEN nome ~* '\\(Laos\\)' THEN 'LA'
        WHEN nome ~* '\\(Colômbia\\)|\\(Colombia\\)' THEN 'CO'
        WHEN nome ~* '\\(Venezuela\\)' THEN 'VE'
        WHEN nome ~* '\\(Equador\\)|\\(Ecuador\\)' THEN 'EC'
        WHEN nome ~* '\\(Bolívia\\)|\\(Bolivia\\)' THEN 'BO'
        WHEN nome ~* '\\(Paraguai\\)|\\(Paraguay\\)' THEN 'PY'
        WHEN nome ~* '\\(Uruguai\\)|\\(Uruguay\\)' THEN 'UY'
        WHEN nome ~* '\\(Costa Rica\\)' THEN 'CR'
        WHEN nome ~* '\\(Panamá\\)|\\(Panama\\)' THEN 'PA'
        WHEN nome ~* '\\(Cuba\\)' THEN 'CU'
        WHEN nome ~* '\\(República Dominicana\\)|\\(Dominican Republic\\)' THEN 'DO'
        WHEN nome ~* '\\(Jamaica\\)' THEN 'JM'
        WHEN nome ~* '\\(Porto Rico\\)|\\(Puerto Rico\\)' THEN 'PR'
        WHEN nome ~* '\\(Guatemala\\)' THEN 'GT'
        WHEN nome ~* '\\(Honduras\\)' THEN 'HN'
        WHEN nome ~* '\\(El Salvador\\)' THEN 'SV'
        WHEN nome ~* '\\(Nicarágua\\)|\\(Nicaragua\\)' THEN 'NI'
        WHEN nome ~* '\\(Islândia\\)|\\(Iceland\\)' THEN 'IS'
        WHEN nome ~* '\\(Eslováquia\\)|\\(Slovakia\\)' THEN 'SK'
        WHEN nome ~* '\\(Eslovênia\\)|\\(Slovenia\\)' THEN 'SI'
        WHEN nome ~* '\\(Letônia\\)|\\(Latvia\\)' THEN 'LV'
        WHEN nome ~* '\\(Lituânia\\)|\\(Lithuania\\)' THEN 'LT'
        WHEN nome ~* '\\(Estônia\\)|\\(Estonia\\)' THEN 'EE'
        WHEN nome ~* '\\(Chipre\\)|\\(Cyprus\\)' THEN 'CY'
        WHEN nome ~* '\\(Malta\\)' THEN 'MT'
        WHEN nome ~* '\\(Luxemburgo\\)|\\(Luxembourg\\)' THEN 'LU'
      END AS country_hint,
      COUNT(*)::int AS cnt,
      SUM(h.hotel_count)::int AS total_hotels
    FROM wv_destinations d
    LEFT JOIN (
      SELECT destino_id, COUNT(*)::int AS hotel_count
      FROM wv_hotels
      GROUP BY destino_id
    ) h ON h.destino_id = d.id
    WHERE d.pais_code = 'XX'
      AND d.nome ~ '\\([A-Z]'
    GROUP BY country_hint
    HAVING
      CASE
        WHEN nome ~* '\\(Brasil\\)|\\(Brazil\\)' THEN 'BR'
        WHEN nome ~* '\\(México\\)|\\(Mexico\\)' THEN 'MX'
        WHEN nome ~* '\\(Japão\\)|\\(Japan\\)' THEN 'JP'
        WHEN nome ~* '\\(Índia\\)|\\(India\\)' THEN 'IN'
        WHEN nome ~* '\\(França\\)|\\(France\\)' THEN 'FR'
        WHEN nome ~* '\\(Alemanha\\)|\\(Germany\\)' THEN 'DE'
        WHEN nome ~* '\\(Itália\\)|\\(Italy\\)' THEN 'IT'
        WHEN nome ~* '\\(Espanha\\)|\\(Spain\\)' THEN 'ES'
        WHEN nome ~* '\\(Portugal\\)' THEN 'PT'
        WHEN nome ~* '\\(China\\)' THEN 'CN'
        WHEN nome ~* '\\(Argentina\\)' THEN 'AR'
        WHEN nome ~* '\\(Chile\\)' THEN 'CL'
        WHEN nome ~* '\\(Peru\\)' THEN 'PE'
        WHEN nome ~* '\\(Rússia\\)|\\(Russia\\)' THEN 'RU'
        WHEN nome ~* '\\(Canadá\\)|\\(Canada\\)' THEN 'CA'
        WHEN nome ~* '\\(Austrália\\)|\\(Australia\\)' THEN 'AU'
        WHEN nome ~* '\\(Polônia\\)|\\(Poland\\)' THEN 'PL'
        WHEN nome ~* '\\(Indonésia\\)|\\(Indonesia\\)' THEN 'ID'
        WHEN nome ~* '\\(Tailândia\\)|\\(Thailand\\)' THEN 'TH'
        WHEN nome ~* '\\(Vietnã\\)|\\(Vietnam\\)' THEN 'VN'
        WHEN nome ~* '\\(Filipinas\\)|\\(Philippines\\)' THEN 'PH'
        WHEN nome ~* '\\(Malásia\\)|\\(Malaysia\\)' THEN 'MY'
        WHEN nome ~* '\\(Egito\\)|\\(Egypt\\)' THEN 'EG'
        WHEN nome ~* '\\(Turquia\\)|\\(Turkey\\)' THEN 'TR'
        WHEN nome ~* '\\(Grécia\\)|\\(Greece\\)' THEN 'GR'
        WHEN nome ~* '\\(Coreia do Sul\\)|\\(South Korea\\)' THEN 'KR'
        WHEN nome ~* '\\(África do Sul\\)|\\(South Africa\\)' THEN 'ZA'
        WHEN nome ~* '\\(Suécia\\)|\\(Sweden\\)' THEN 'SE'
        WHEN nome ~* '\\(Noruega\\)|\\(Norway\\)' THEN 'NO'
        WHEN nome ~* '\\(Dinamarca\\)|\\(Denmark\\)' THEN 'DK'
        WHEN nome ~* '\\(Finlândia\\)|\\(Finland\\)' THEN 'FI'
        WHEN nome ~* '\\(Países Baixos\\)|\\(Netherlands\\)|\\(Holanda\\)' THEN 'NL'
        WHEN nome ~* '\\(Bélgica\\)|\\(Belgium\\)' THEN 'BE'
        WHEN nome ~* '\\(Suíça\\)|\\(Switzerland\\)' THEN 'CH'
        WHEN nome ~* '\\(Áustria\\)|\\(Austria\\)' THEN 'AT'
        WHEN nome ~* '\\(República Tcheca\\)|\\(Czech Republic\\)|\\(Czechia\\)' THEN 'CZ'
        WHEN nome ~* '\\(Hungria\\)|\\(Hungary\\)' THEN 'HU'
        WHEN nome ~* '\\(Romênia\\)|\\(Romania\\)' THEN 'RO'
        WHEN nome ~* '\\(Bulgária\\)|\\(Bulgaria\\)' THEN 'BG'
        WHEN nome ~* '\\(Croácia\\)|\\(Croatia\\)' THEN 'HR'
        WHEN nome ~* '\\(Sérvia\\)|\\(Serbia\\)' THEN 'RS'
        WHEN nome ~* '\\(Ucrânia\\)|\\(Ukraine\\)' THEN 'UA'
        WHEN nome ~* '\\(Marrocos\\)|\\(Morocco\\)' THEN 'MA'
        WHEN nome ~* '\\(Tunísia\\)|\\(Tunisia\\)' THEN 'TN'
        WHEN nome ~* '\\(Nigéria\\)|\\(Nigeria\\)' THEN 'NG'
        WHEN nome ~* '\\(Quênia\\)|\\(Kenya\\)' THEN 'KE'
        WHEN nome ~* '\\(Tanzânia\\)|\\(Tanzania\\)' THEN 'TZ'
        WHEN nome ~* '\\(Emirados Árabes\\)|\\(UAE\\)|\\(Dubai\\)' THEN 'AE'
        WHEN nome ~* '\\(Arábia Saudita\\)|\\(Saudi Arabia\\)' THEN 'SA'
        WHEN nome ~* '\\(Israel\\)' THEN 'IL'
        WHEN nome ~* '\\(Irlanda\\)|\\(Ireland\\)' THEN 'IE'
        WHEN nome ~* '\\(Nova Zelândia\\)|\\(New Zealand\\)' THEN 'NZ'
        WHEN nome ~* '\\(Singapura\\)|\\(Singapore\\)' THEN 'SG'
        WHEN nome ~* '\\(Hong Kong\\)' THEN 'HK'
        WHEN nome ~* '\\(Taiwan\\)' THEN 'TW'
        WHEN nome ~* '\\(Bangladesh\\)' THEN 'BD'
        WHEN nome ~* '\\(Paquistão\\)|\\(Pakistan\\)' THEN 'PK'
        WHEN nome ~* '\\(Sri Lanka\\)' THEN 'LK'
        WHEN nome ~* '\\(Nepal\\)' THEN 'NP'
        WHEN nome ~* '\\(Myanmar\\)|\\(Birmânia\\)' THEN 'MM'
        WHEN nome ~* '\\(Camboja\\)|\\(Cambodia\\)' THEN 'KH'
        WHEN nome ~* '\\(Laos\\)' THEN 'LA'
        WHEN nome ~* '\\(Venezuela\\)' THEN 'VE'
        WHEN nome ~* '\\(Equador\\)|\\(Ecuador\\)' THEN 'EC'
        WHEN nome ~* '\\(Bolívia\\)|\\(Bolivia\\)' THEN 'BO'
        WHEN nome ~* '\\(Paraguai\\)|\\(Paraguay\\)' THEN 'PY'
        WHEN nome ~* '\\(Uruguai\\)|\\(Uruguay\\)' THEN 'UY'
        WHEN nome ~* '\\(Costa Rica\\)' THEN 'CR'
        WHEN nome ~* '\\(Panamá\\)|\\(Panama\\)' THEN 'PA'
        WHEN nome ~* '\\(Cuba\\)' THEN 'CU'
        WHEN nome ~* '\\(República Dominicana\\)|\\(Dominican Republic\\)' THEN 'DO'
        WHEN nome ~* '\\(Jamaica\\)' THEN 'JM'
        WHEN nome ~* '\\(Porto Rico\\)|\\(Puerto Rico\\)' THEN 'PR'
        WHEN nome ~* '\\(Guatemala\\)' THEN 'GT'
        WHEN nome ~* '\\(Honduras\\)' THEN 'HN'
        WHEN nome ~* '\\(El Salvador\\)' THEN 'SV'
        WHEN nome ~* '\\(Nicarágua\\)|\\(Nicaragua\\)' THEN 'NI'
        WHEN nome ~* '\\(Islândia\\)|\\(Iceland\\)' THEN 'IS'
        WHEN nome ~* '\\(Eslováquia\\)|\\(Slovakia\\)' THEN 'SK'
        WHEN nome ~* '\\(Eslovênia\\)|\\(Slovenia\\)' THEN 'SI'
        WHEN nome ~* '\\(Letônia\\)|\\(Latvia\\)' THEN 'LV'
        WHEN nome ~* '\\(Lituânia\\)|\\(Lithuania\\)' THEN 'LT'
        WHEN nome ~* '\\(Estônia\\)|\\(Estonia\\)' THEN 'EE'
        WHEN nome ~* '\\(Chipre\\)|\\(Cyprus\\)' THEN 'CY'
        WHEN nome ~* '\\(Malta\\)' THEN 'MT'
        WHEN nome ~* '\\(Luxemburgo\\)|\\(Luxembourg\\)' THEN 'LU'
      END IS NOT NULL
    ORDER BY cnt DESC
  `);

  console.table(countryHints.slice(0, 20));
  let totalFromParens = 0;
  for (const r of countryHints) totalFromParens += r.cnt;
  console.log(`Total from parens: ${totalFromParens} destinos, ${countryHints.reduce((s, r) => s + r.total_hotels, 0)} hotéis`);

  // Non-Internacional pais values in XX
  console.log('\n=== XX with pais != Internacional ===');
  const nonIntl = await p.$queryRawUnsafe(`
    SELECT pais, COUNT(*)::int AS cnt
    FROM wv_destinations
    WHERE pais_code = 'XX' AND pais IS DISTINCT FROM 'Internacional'
    GROUP BY pais
    ORDER BY cnt DESC
    LIMIT 20
  `);
  console.table(nonIntl);

  await p.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
