/**
 * Reassigns XX (Internacional) destinations to proper countries.
 *
 * Multi-strategy approach, ordered from cheapest (no API) to most expensive:
 *
 *   1. NAME HEURISTICS (free, local):
 *      - US states in name → US
 *      - UK regions/cities → GB
 *      - Canadian provinces → CA
 *      - Australian states → AU
 *      - Country names in parentheses → respective CC
 *
 *   2. IATA LOOKUP (free, local):
 *      - Airport IATA code → country via data/transportation/airports.csv
 *
 *   3. HOTEL COORDS MAJORITY (needs Photon API):
 *      - Reverse-geocode hotel coords, majority country wins
 *
 *   4. DEST COORDS REVERSE (needs Photon API):
 *      - Reverse-geocode destination's own coords
 *
 * Usage:
 *   node scripts/reassign-xx-to-countries.mjs --dry-run
 *   node scripts/reassign-xx-to-countries.mjs --dry-run --heuristics-only
 *   node scripts/reassign-xx-to-countries.mjs --dry-run --limit=200
 *   node scripts/reassign-xx-to-countries.mjs              # execute
 *   node scripts/reassign-xx-to-countries.mjs --with-api    # include Photon strategies
 */
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PrismaClient } from '@prisma/client';
import { loadProjectEnv } from './lib/load-env.mjs';
import { COUNTRY_NAMES } from './lib/country-names.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

loadProjectEnv(ROOT);

const p = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL } },
});

const DRY_RUN = process.argv.includes('--dry-run');
const HEURISTICS_ONLY = process.argv.includes('--heuristics-only');
const WITH_API = process.argv.includes('--with-api');
const IATA_ONLY = process.argv.includes('--iata-only');

const limitArg = process.argv.find((a) => a.startsWith('--limit'));
const LIMIT = limitArg
  ? parseInt(limitArg.split('=')[1] ?? process.argv[process.argv.indexOf('--limit') + 1], 10)
  : Infinity;

const batchArg = process.argv.find((a) => a.startsWith('--batch'));
const BATCH = batchArg
  ? parseInt(batchArg.split('=')[1] ?? process.argv[process.argv.indexOf('--batch') + 1], 10)
  : 200;

// ═══════════════════════════════════════════════
// Strategy 1: Name Heuristics
// ═══════════════════════════════════════════════

/** US states → US */
const US_STATES = new Set([
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
  'Wisconsin', 'Wyoming',
]);

const UK_PATTERNS = [
  'England', 'Scotland', 'Wales', 'Northern Ireland', 'Britain',
  ' London', 'Manchester', 'Liverpool', 'Birmingham', 'Edinburgh',
  'Glasgow', 'Cardiff', 'Belfast', 'Leeds', 'Sheffield', 'Bristol',
  'Newcastle', 'Nottingham', 'Southampton', 'Portsmouth', 'Oxford',
  'Cambridge', 'Brighton', 'Leicester', 'Coventry', 'Hull',
  'Sunderland', 'Wolverhampton', 'Derby', 'Stoke', 'Norwich', 'Plymouth',
  'Bath', 'York', 'Canterbury', 'Durham', 'Exeter',
];

const CA_PATTERNS = [
  'Ontario', 'Quebec', 'British Columbia', 'Alberta', 'Manitoba',
  'Saskatchewan', 'Nova Scotia', 'New Brunswick', 'Newfoundland',
  'Toronto', 'Vancouver', 'Montreal', 'Ottawa', 'Calgary', 'Edmonton',
  'Winnipeg', 'Hamilton', 'Quebec City', 'Halifax', 'Victoria',
  'Saskatoon', 'Regina', 'Kelowna',
];

const AU_PATTERNS = [
  'Victoria', 'New South Wales', 'Queensland', 'Western Australia',
  'South Australia', 'Tasmania', 'Sydney', 'Melbourne', 'Brisbane',
  'Perth', 'Adelaide', 'Darwin', 'Canberra', 'Gold Coast', 'Hobart',
  'Newcastle', 'Geelong', 'Wollongong', 'Cairns', 'Townsville',
];

// Country names in parentheses → ISO code
// (name in Portuguese OR English)
const COUNTRY_PAREN_MAP = [
  { regex: /\\(Brasil\\)|\\(Brazil\\)/i, cc: 'BR', name: 'Brasil' },
  { regex: /\\(México\\)|\\(Mexico\\)/i, cc: 'MX', name: 'México' },
  { regex: /\\(Japão\\)|\\(Japan\\)/i, cc: 'JP', name: 'Japão' },
  { regex: /\\(Índia\\)|\\(India\\)/i, cc: 'IN', name: 'Índia' },
  { regex: /\\(França\\)|\\(France\\)/i, cc: 'FR', name: 'França' },
  { regex: /\\(Alemanha\\)|\\(Germany\\)/i, cc: 'DE', name: 'Alemanha' },
  { regex: /\\(Itália\\)|\\(Italy\\)/i, cc: 'IT', name: 'Itália' },
  { regex: /\\(Espanha\\)|\\(Spain\\)/i, cc: 'ES', name: 'Espanha' },
  { regex: /\\(Portugal\\)/i, cc: 'PT', name: 'Portugal' },
  { regex: /\\(China\\)/i, cc: 'CN', name: 'China' },
  { regex: /\\(Argentina\\)/i, cc: 'AR', name: 'Argentina' },
  { regex: /\\(Chile\\)/i, cc: 'CL', name: 'Chile' },
  { regex: /\\(Colômbia\\)|\\(Colombia\\)/i, cc: 'CO', name: 'Colômbia' },
  { regex: /\\(Peru\\)/i, cc: 'PE', name: 'Peru' },
  { regex: /\\(Rússia\\)|\\(Russia\\)/i, cc: 'RU', name: 'Rússia' },
  { regex: /\\(Canadá\\)|\\(Canada\\)/i, cc: 'CA', name: 'Canadá' },
  { regex: /\\(Austrália\\)|\\(Australia\\)/i, cc: 'AU', name: 'Austrália' },
  { regex: /\\(Polônia\\)|\\(Poland\\)/i, cc: 'PL', name: 'Polônia' },
  { regex: /\\(Indonésia\\)|\\(Indonesia\\)/i, cc: 'ID', name: 'Indonésia' },
  { regex: /\\(Tailândia\\)|\\(Thailand\\)/i, cc: 'TH', name: 'Tailândia' },
  { regex: /\\(Vietnã\\)|\\(Vietnam\\)/i, cc: 'VN', name: 'Vietnã' },
  { regex: /\\(Filipinas\\)|\\(Philippines\\)/i, cc: 'PH', name: 'Filipinas' },
  { regex: /\\(Malásia\\)|\\(Malaysia\\)/i, cc: 'MY', name: 'Malásia' },
  { regex: /\\(Egito\\)|\\(Egypt\\)/i, cc: 'EG', name: 'Egito' },
  { regex: /\\(Turquia\\)|\\(Turkey\\)/i, cc: 'TR', name: 'Turquia' },
  { regex: /\\(Grécia\\)|\\(Greece\\)/i, cc: 'GR', name: 'Grécia' },
  { regex: /\\(Coreia do Sul\\)|\\(South Korea\\)/i, cc: 'KR', name: 'Coreia do Sul' },
  { regex: /\\(África do Sul\\)|\\(South Africa\\)/i, cc: 'ZA', name: 'África do Sul' },
  { regex: /\\(Suécia\\)|\\(Sweden\\)/i, cc: 'SE', name: 'Suécia' },
  { regex: /\\(Noruega\\)|\\(Norway\\)/i, cc: 'NO', name: 'Noruega' },
  { regex: /\\(Dinamarca\\)|\\(Denmark\\)/i, cc: 'DK', name: 'Dinamarca' },
  { regex: /\\(Finlândia\\)|\\(Finland\\)/i, cc: 'FI', name: 'Finlândia' },
  { regex: /\\(Países Baixos\\)|\\(Netherlands\\)|\\(Holanda\\)/i, cc: 'NL', name: 'Países Baixos' },
  { regex: /\\(Bélgica\\)|\\(Belgium\\)/i, cc: 'BE', name: 'Bélgica' },
  { regex: /\\(Suíça\\)|\\(Switzerland\\)/i, cc: 'CH', name: 'Suíça' },
  { regex: /\\(Áustria\\)|\\(Austria\\)/i, cc: 'AT', name: 'Áustria' },
  { regex: /\\(República Tcheca\\)|\\(Czech Republic\\)|\\(Czechia\\)/i, cc: 'CZ', name: 'Rep. Tcheca' },
  { regex: /\\(Hungria\\)|\\(Hungary\\)/i, cc: 'HU', name: 'Hungria' },
  { regex: /\\(Romênia\\)|\\(Romania\\)/i, cc: 'RO', name: 'Romênia' },
  { regex: /\\(Bulgária\\)|\\(Bulgaria\\)/i, cc: 'BG', name: 'Bulgária' },
  { regex: /\\(Croácia\\)|\\(Croatia\\)/i, cc: 'HR', name: 'Croácia' },
  { regex: /\\(Sérvia\\)|\\(Serbia\\)/i, cc: 'RS', name: 'Sérvia' },
  { regex: /\\(Ucrânia\\)|\\(Ukraine\\)/i, cc: 'UA', name: 'Ucrânia' },
  { regex: /\\(Marrocos\\)|\\(Morocco\\)/i, cc: 'MA', name: 'Marrocos' },
  { regex: /\\(Tunísia\\)|\\(Tunisia\\)/i, cc: 'TN', name: 'Tunísia' },
  { regex: /\\(Nigéria\\)|\\(Nigeria\\)/i, cc: 'NG', name: 'Nigéria' },
  { regex: /\\(Quênia\\)|\\(Kenya\\)/i, cc: 'KE', name: 'Quênia' },
  { regex: /\\(Tanzânia\\)|\\(Tanzania\\)/i, cc: 'TZ', name: 'Tanzânia' },
  { regex: /\\(Emirados Árabes\\)|\\(UAE\\)|\\(Dubai\\)/i, cc: 'AE', name: 'Emirados Árabes' },
  { regex: /\\(Arábia Saudita\\)|\\(Saudi Arabia\\)/i, cc: 'SA', name: 'Arábia Saudita' },
  { regex: /\\(Israel\\)/i, cc: 'IL', name: 'Israel' },
  { regex: /\\(Irlanda\\)|\\(Ireland\\)/i, cc: 'IE', name: 'Irlanda' },
  { regex: /\\(Nova Zelândia\\)|\\(New Zealand\\)/i, cc: 'NZ', name: 'Nova Zelândia' },
  { regex: /\\(Singapura\\)|\\(Singapore\\)/i, cc: 'SG', name: 'Singapura' },
  { regex: /\\(Hong Kong\\)/i, cc: 'HK', name: 'Hong Kong' },
  { regex: /\\(Taiwan\\)/i, cc: 'TW', name: 'Taiwan' },
  { regex: /\\(Bangladesh\\)/i, cc: 'BD', name: 'Bangladesh' },
  { regex: /\\(Paquistão\\)|\\(Pakistan\\)/i, cc: 'PK', name: 'Paquistão' },
  { regex: /\\(Sri Lanka\\)/i, cc: 'LK', name: 'Sri Lanka' },
  { regex: /\\(Nepal\\)/i, cc: 'NP', name: 'Nepal' },
  { regex: /\\(Myanmar\\)|\\(Birmânia\\)/i, cc: 'MM', name: 'Myanmar' },
  { regex: /\\(Camboja\\)|\\(Cambodia\\)/i, cc: 'KH', name: 'Camboja' },
  { regex: /\\(Laos\\)/i, cc: 'LA', name: 'Laos' },
  { regex: /\\(Venezuela\\)/i, cc: 'VE', name: 'Venezuela' },
  { regex: /\\(Equador\\)|\\(Ecuador\\)/i, cc: 'EC', name: 'Equador' },
  { regex: /\\(Bolívia\\)|\\(Bolivia\\)/i, cc: 'BO', name: 'Bolívia' },
  { regex: /\\(Paraguai\\)|\\(Paraguay\\)/i, cc: 'PY', name: 'Paraguai' },
  { regex: /\\(Uruguai\\)|\\(Uruguay\\)/i, cc: 'UY', name: 'Uruguai' },
  { regex: /\\(Costa Rica\\)/i, cc: 'CR', name: 'Costa Rica' },
  { regex: /\\(Panamá\\)|\\(Panama\\)/i, cc: 'PA', name: 'Panamá' },
  { regex: /\\(Cuba\\)/i, cc: 'CU', name: 'Cuba' },
  { regex: /\\(República Dominicana\\)|\\(Dominican Republic\\)/i, cc: 'DO', name: 'Rep. Dominicana' },
  { regex: /\\(Jamaica\\)/i, cc: 'JM', name: 'Jamaica' },
  { regex: /\\(Porto Rico\\)|\\(Puerto Rico\\)/i, cc: 'PR', name: 'Porto Rico' },
  { regex: /\\(Guatemala\\)/i, cc: 'GT', name: 'Guatemala' },
  { regex: /\\(Honduras\\)/i, cc: 'HN', name: 'Honduras' },
  { regex: /\\(El Salvador\\)/i, cc: 'SV', name: 'El Salvador' },
  { regex: /\\(Nicarágua\\)|\\(Nicaragua\\)/i, cc: 'NI', name: 'Nicarágua' },
  { regex: /\\(Islândia\\)|\\(Iceland\\)/i, cc: 'IS', name: 'Islândia' },
  { regex: /\\(Eslováquia\\)|\\(Slovakia\\)/i, cc: 'SK', name: 'Eslováquia' },
  { regex: /\\(Eslovênia\\)|\\(Slovenia\\)/i, cc: 'SI', name: 'Eslovênia' },
  { regex: /\\(Letônia\\)|\\(Latvia\\)/i, cc: 'LV', name: 'Letônia' },
  { regex: /\\(Lituânia\\)|\\(Lithuania\\)/i, cc: 'LT', name: 'Lituânia' },
  { regex: /\\(Estônia\\)|\\(Estonia\\)/i, cc: 'EE', name: 'Estônia' },
  { regex: /\\(Chipre\\)|\\(Cyprus\\)/i, cc: 'CY', name: 'Chipre' },
  { regex: /\\(Malta\\)/i, cc: 'MT', name: 'Malta' },
  { regex: /\\(Luxemburgo\\)|\\(Luxembourg\\)/i, cc: 'LU', name: 'Luxemburgo' },
];

function guessCountryByName(name) {
  // Country in parentheses — MOST SPECIFIC, check FIRST
  for (const { regex, cc, name: cname } of COUNTRY_PAREN_MAP) {
    if (regex.test(name)) return { cc, strategy: 'parens', confidence: 'high' };
  }

  // US states — check after parens to avoid "Victoria (Australia)" → US
  for (const state of US_STATES) {
    if (name.includes(state)) return { cc: 'US', strategy: 'us-state', confidence: 'high' };
  }

  // UK patterns
  for (const p of UK_PATTERNS) {
    if (name.includes(p)) return { cc: 'GB', strategy: 'uk-hint', confidence: 'high' };
  }

  // Canada patterns
  for (const p of CA_PATTERNS) {
    if (name.includes(p)) return { cc: 'CA', strategy: 'ca-hint', confidence: 'medium' };
  }

  // Australia patterns
  for (const p of AU_PATTERNS) {
    if (name.includes(p)) return { cc: 'AU', strategy: 'au-hint', confidence: 'medium' };
  }

  return null;
}

// ═══════════════════════════════════════════════
// Strategy 2: IATA lookup
// ═══════════════════════════════════════════════

/** Parse a quoted-CSV line into fields. Handles "escaped" quotes. */
function parseCsvLine(line) {
  const fields = [];
  let cur = '';
  let inQuote = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQuote && line[i + 1] === '"') {
        cur += '"';
        i++; // skip next quote
      } else {
        inQuote = !inQuote;
      }
    } else if (c === ',' && !inQuote) {
      fields.push(cur);
      cur = '';
    } else {
      cur += c;
    }
  }
  fields.push(cur);
  return fields;
}

function loadIataToCountry() {
  const map = new Map();
  try {
    const csv = readFileSync(resolve(ROOT, 'data/transportation/airports.csv'), 'utf8');
    const lines = csv.split(/\r?\n/);
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      const cols = parseCsvLine(lines[i]);
      // col[8] = iso_country, col[13] = iata_code
      const iata = (cols[13] || '').trim();
      const isoCountry = (cols[8] || '').trim();
      if (iata && isoCountry && iata.length === 3 && isoCountry.length === 2) {
        if (!map.has(iata)) map.set(iata, isoCountry);
      }
    }
  } catch (e) {
    console.error('Warning: could not load airports.csv:', e.message);
  }
  return map;
}

function guessCountryByIata(iataMap, iataCode) {
  if (!iataCode) return null;
  const cc = iataMap.get(iataCode.toUpperCase());
  return cc ? { cc, strategy: 'iata', confidence: 'high' } : null;
}

// ═══════════════════════════════════════════════
// Strategy 3: Hotel coords majority (Photon API)
// ═══════════════════════════════════════════════

const PHOTON_REVERSE = 'https://photon.komoot.io/reverse';
const UA = 'beta-app-travel/1.0 (xx-reassign)';

async function reverseGeocodePhoton(lat, lon) {
  const url = `${PHOTON_REVERSE}?lon=${lon}&lat=${lat}`;
  try {
    const resp = await fetch(url, { headers: { 'User-Agent': UA } });
    if (!resp.ok) return null;
    const data = await resp.json();
    const props = data.features?.[0]?.properties;
    return props?.countrycode?.toUpperCase() || null;
  } catch {
    return null;
  }
}

async function guessCountryByHotelCoords(destId, limit = 3) {
  const hotels = await p.wvHotel.findMany({
    where: { destinoId: destId, latitude: { not: null }, longitude: { not: null } },
    select: { latitude: true, longitude: true },
    take: 10,
  });
  if (!hotels.length) return null;

  const countryVotes = new Map();
  let sampled = 0;
  for (const h of hotels) {
    if (sampled >= limit) break;
    const cc = await reverseGeocodePhoton(h.latitude, h.longitude);
    if (cc) {
      countryVotes.set(cc, (countryVotes.get(cc) || 0) + 1);
      sampled++;
    }
    if (sampled < limit) await new Promise(r => setTimeout(r, 200));
  }

  if (!countryVotes.size) return null;

  // Find majority
  let bestCc = null;
  let bestVotes = 0;
  for (const [cc, votes] of countryVotes) {
    if (votes > bestVotes) { bestCc = cc; bestVotes = votes; }
  }

  const confidence = bestVotes >= 2 ? 'high' : 'medium';
  return bestCc ? { cc: bestCc, strategy: `hotel-coords(${bestVotes}/${sampled})`, confidence } : null;
}

// ═══════════════════════════════════════════════
// Strategy 4: Dest coords reverse geocode
// ═══════════════════════════════════════════════

async function guessCountryByDestCoords(dest) {
  if (!dest.latitude || !dest.longitude) return null;
  const cc = await reverseGeocodePhoton(dest.latitude, dest.longitude);
  return cc ? { cc, strategy: 'dest-coords', confidence: 'high' } : null;
}

// ═══════════════════════════════════════════════
// Main
// ═══════════════════════════════════════════════

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  console.log(`🌍 Reatribuição de países — destinos XX${DRY_RUN ? ' [DRY-RUN]' : ''}`);
  if (HEURISTICS_ONLY) console.log('   Modo: apenas heurísticas (sem API)');
  if (IATA_ONLY) console.log('   Modo: apenas IATA');
  if (WITH_API) console.log('   Modo: com API Photon (hotel coords + dest coords)');
  if (LIMIT < Infinity) console.log(`   Limite: ${LIMIT} destinos`);
  console.log();

  // Load IATA map
  const iataMap = loadIataToCountry();
  console.log(`IATA codes loaded: ${iataMap.size.toLocaleString()}`);

  // Get XX destinations with their hotel counts
  const xxDests = await p.$queryRawUnsafe(`
    SELECT d.id, d.nome, d.pais, d.iata, d.latitude, d.longitude,
           COUNT(h.id)::int AS hotel_count,
           COUNT(CASE WHEN h.latitude IS NOT NULL THEN 1 END)::int AS hotels_with_coords
    FROM wv_destinations d
    LEFT JOIN wv_hotels h ON h.destino_id = d.id
    WHERE d.pais_code = 'XX'
    GROUP BY d.id, d.nome, d.pais, d.iata, d.latitude, d.longitude
    ORDER BY hotel_count DESC
    LIMIT ${LIMIT < Infinity ? LIMIT : 'ALL'}
  `);

  console.log(`XX destinations to process: ${xxDests.length.toLocaleString()}\n`);

  // Track results by strategy
  const stats = {
    heuristics: { us: 0, uk: 0, ca: 0, au: 0, parens: 0, total: 0 },
    iata: 0,
    hotelCoords: 0,
    destCoords: 0,
    total: 0,
    skipped: 0,
  };

  const updates = [];
  const samples = [];

  for (const dest of xxDests) {
    let result = null;

    // Strategy 1: Name heuristics (always run, free)
    if (!IATA_ONLY) {
      result = guessCountryByName(dest.nome);
      if (result) {
        if (result.strategy === 'us-state') stats.heuristics.us++;
        else if (result.strategy === 'uk-hint') stats.heuristics.uk++;
        else if (result.strategy === 'ca-hint') stats.heuristics.ca++;
        else if (result.strategy === 'au-hint') stats.heuristics.au++;
        else if (result.strategy === 'parens') stats.heuristics.parens++;
        stats.heuristics.total++;
      }
    }

    // Strategy 2: IATA
    if (!result && !HEURISTICS_ONLY) {
      result = guessCountryByIata(iataMap, dest.iata);
      if (result) stats.iata++;
    }

    // Strategy 3: Hotel coords majority (API)
    if (!result && WITH_API && dest.hotels_with_coords > 0) {
      result = await guessCountryByHotelCoords(dest.id, 3);
      if (result) stats.hotelCoords++;
    }

    // Strategy 4: Dest coords reverse (API)
    if (!result && WITH_API && dest.latitude != null) {
      result = await guessCountryByDestCoords(dest);
      if (result) stats.destCoords++;
    }

    if (result) {
      const newPais = COUNTRY_NAMES[result.cc] || result.cc;
      updates.push({ id: dest.id, cc: result.cc, pais: newPais, strategy: result.strategy, confidence: result.confidence });
      stats.total++;

      if (samples.length < 40) {
        samples.push({ nome: dest.nome, pais: dest.pais, newCc: result.cc, newPais, strategy: result.strategy, hotelCount: dest.hotel_count });
      }

      if (DRY_RUN && stats.total % 100 === 0) {
        console.log(`  [${stats.total}] matched…`);
      }
    } else {
      stats.skipped++;
    }
  }

  // Show samples
  console.log('\n═══ Amostra de reatribuições ═══');
  for (const s of samples.slice(0, 20)) {
    console.log(`  ${s.nome.padEnd(40)} → ${s.newCc} (${s.newPais.padEnd(25)}) [${s.strategy}] ${s.hotelCount} hotéis`);
  }
  if (samples.length > 20) console.log(`  … e mais ${samples.length - 20} na amostra`);

  // Stats
  console.log('\n═══ Estatísticas ═══');
  console.log(`Total XX processados      : ${xxDests.length.toLocaleString()}`);
  console.log(`Reatribuídos              : ${stats.total.toLocaleString()} (${(stats.total / xxDests.length * 100).toFixed(1)}%)`);
  console.log(`  Por heurística (nome)   : ${stats.heuristics.total.toLocaleString()}`);
  console.log(`    US states             : ${stats.heuristics.us.toLocaleString()}`);
  console.log(`    UK hints              : ${stats.heuristics.uk.toLocaleString()}`);
  console.log(`    Canada hints          : ${stats.heuristics.ca.toLocaleString()}`);
  console.log(`    Australia hints       : ${stats.heuristics.au.toLocaleString()}`);
  console.log(`    Country parens        : ${stats.heuristics.parens.toLocaleString()}`);
  console.log(`  Por IATA                : ${stats.iata.toLocaleString()}`);
  if (WITH_API) {
    console.log(`  Por hotel coords (API)  : ${stats.hotelCoords.toLocaleString()}`);
    console.log(`  Por dest coords (API)   : ${stats.destCoords.toLocaleString()}`);
  }
  console.log(`Não atribuídos            : ${stats.skipped.toLocaleString()} (${(stats.skipped / xxDests.length * 100).toFixed(1)}%)`);

  const totalHotelsInUpdated = await p.$queryRawUnsafe(`
    SELECT COUNT(*)::int AS cnt
    FROM wv_hotels h
    JOIN wv_destinations d ON d.id = h.destino_id
    WHERE d.pais_code = 'XX'
      AND d.id IN (${updates.length > 0 ? updates.map(u => u.id).join(',') : '0'})
  `);
  console.log(`Hotéis em destinos reatribuídos: ${totalHotelsInUpdated[0]?.cnt?.toLocaleString() || 0}`);

  // Apply updates
  if (!DRY_RUN && updates.length > 0) {
    console.log(`\n🔄 A aplicar ${updates.length} reatribuições…`);

    // Use a single UPDATE with CASE WHEN for each batch (much faster)
    for (let i = 0; i < updates.length; i += BATCH) {
      const batch = updates.slice(i, i + BATCH);
      const ids = batch.map((u) => u.id).join(',');
      
      // Build CASE expressions for both columns
      const ccCases = batch.map((u) => `WHEN id = ${u.id} THEN '${u.cc}'`).join(' ');
      const paisCases = batch.map((u) => `WHEN id = ${u.id} THEN '${u.pais.replace(/'/g, "''")}'`).join(' ');
      
      await p.$executeRawUnsafe(`
        UPDATE wv_destinations
        SET
          pais_code = CASE ${ccCases} ELSE pais_code END,
          pais = CASE ${paisCases} ELSE pais END
        WHERE id IN (${ids})
      `);
      
      console.log(`  batch ${Math.floor(i / BATCH) + 1}/${Math.ceil(updates.length / BATCH)}: ${Math.min(i + BATCH, updates.length)}/${updates.length}`);
    }

    // Update hotel counts (they may change as hotels from different countries merge)
    await p.$executeRawUnsafe(`
      UPDATE wv_destinations d
      SET hotel_count = sub.c
      FROM (
        SELECT destino_id, COUNT(*)::int AS c
        FROM wv_hotels
        GROUP BY destino_id
      ) sub
      WHERE d.id = sub.destino_id
    `);

    console.log('✅ Reatribuições aplicadas.');
  } else if (DRY_RUN && updates.length > 0) {
    console.log('\n⚠️  DRY-RUN: sem alterações na BD.');
    console.log('Para executar: node scripts/reassign-xx-to-countries.mjs');
  }

  await p.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
