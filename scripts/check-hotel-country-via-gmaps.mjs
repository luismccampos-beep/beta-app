/**
 * check-hotel-country-via-gmaps.mjs
 *
 * Valida se as coordenadas dos hotéis estão no país correto usando o
 * Google Maps Scraper API (Docker em localhost:8001).
 *
 * Estratégia: processa por destino (1 chamada API por destino, não por hotel).
 * Para cada destino com hotéis que já têm coordenadas, raspa o Google Maps
 * e extrai o país a partir do endereço dos resultados.
 *
 * Uso:
 *   node scripts/check-hotel-country-via-gmaps.mjs --dry-run --limit=5
 *   node scripts/check-hotel-country-via-gmaps.mjs --country=PT
 *   node scripts/check-hotel-country-via-gmaps.mjs --limit=10 --save
 */

import { PrismaClient } from '@prisma/client';
import { loadProjectEnv } from './lib/load-env.mjs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
loadProjectEnv(ROOT);

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL } },
});

const GMAPS_API = process.env.GMAPS_SCRAPER_URL || 'http://localhost:8001';
const FONTE_WRONG_COUNTRY = 'geo_wrong_country';

// --- CLI args ---
const args = process.argv.slice(2);
const DRY_RUN = !args.includes('--save');           // --save to actually write
const LIMIT = args.find((a) => a.startsWith('--limit='))
  ? parseInt(args.find((a) => a.startsWith('--limit=')).split('=')[1], 10)
  : 0;
const COUNTRY = args.find((a) => a.startsWith('--country='))?.split('=')[1] || '';
const VERBOSE = args.includes('--verbose');
const MIN_CONFIDENCE = args.includes('--strict') ? 3 : 2;  // min results agreeing on country

// --- Known country synonyms for address parsing ---
// Google Maps may return country names in Portuguese, English, or local language
const COUNTRY_ALIASES = {
  'portugal': 'PT', 'portuguese republic': 'PT',
  'spain': 'ES', 'españa': 'ES', 'espagne': 'ES', 'espanha': 'ES',
  'france': 'FR', 'french republic': 'FR', 'frança': 'FR',
  'italy': 'IT', 'italia': 'IT', 'itália': 'IT',
  'germany': 'DE', 'deutschland': 'DE', 'alemanha': 'DE',
  'united kingdom': 'GB', 'uk': 'GB', 'great britain': 'GB', 'england': 'GB',
  'reino unido': 'GB', 'inglaterra': 'GB',
  'united states': 'US', 'usa': 'US', 'america': 'US', 'estados unidos': 'US', 'eua': 'US',
  'brazil': 'BR', 'brasil': 'BR',
  'canada': 'CA', 'canadá': 'CA',
  'australia': 'AU',
  'japan': 'JP', 'nihon': 'JP',
  'china': 'CN', 'china mainland': 'CN',
  'india': 'IN',
  'netherlands': 'NL', 'holland': 'NL', 'nederland': 'NL', 'holanda': 'NL',
  'belgium': 'BE', 'belgique': 'BE', 'belgie': 'BE', 'bélgica': 'BE',
  'switzerland': 'CH', 'suisse': 'CH', 'schweiz': 'CH', 'suíça': 'CH',
  'austria': 'AT', 'österreich': 'AT',
  'sweden': 'SE', 'sverige': 'SE', 'suécia': 'SE',
  'norway': 'NO', 'norge': 'NO',
  'denmark': 'DK', 'danmark': 'DK',
  'finland': 'FI', 'suomi': 'FI',
  'russia': 'RU', 'россия': 'RU',
  'turkey': 'TR', 'türkiye': 'TR',
  'morocco': 'MA', 'maroc': 'MA', 'marrocos': 'MA',
  'angola': 'AO',
  'mozambique': 'MZ', 'moçambique': 'MZ',
  'cabo verde': 'CV',
  'argentina': 'AR',
  'chile': 'CL',
  'colombia': 'CO', 'colômbia': 'CO',
  'mexico': 'MX', 'méxico': 'MX',
  'peru': 'PE',
  'uruguay': 'UY',
  'venezuela': 'VE',
  'south africa': 'ZA',
  'egypt': 'EG', 'egito': 'EG',
  'thailand': 'TH',
  'vietnam': 'VN',
  'indonesia': 'ID',
  'philippines': 'PH',
  'singapore': 'SG',
  'malaysia': 'MY',
  'south korea': 'KR',
  'new zealand': 'NZ',
  'ireland': 'IE', 'eire': 'IE',
  'greece': 'GR', 'ellada': 'GR', 'grécia': 'GR',
  'poland': 'PL', 'polska': 'PL', 'polónia': 'PL', 'polônia': 'PL',
  'czech republic': 'CZ', 'czechia': 'CZ', 'česko': 'CZ', 'república checa': 'CZ',
  'hungary': 'HU', 'magyarország': 'HU', 'hungria': 'HU',
  'romania': 'RO', 'roménia': 'RO', 'romênia': 'RO',
  'bulgaria': 'BG', 'bulgária': 'BG',
  'croatia': 'HR', 'hrvatska': 'HR', 'croácia': 'HR',
  'serbia': 'RS', 'srbija': 'RS',
  'iceland': 'IS',
  'luxembourg': 'LU',
  'monaco': 'MC',
  'andorra': 'AD',
  'korea': 'KR', 'south korea': 'KR',
  'pakistan': 'PK',
  'bangladesh': 'BD',
  'nigeria': 'NG',
  'kenya': 'KE',
  'tanzania': 'TZ',
  'ethiopia': 'ET',
  'ghana': 'GH',
  'senegal': 'SN',
  'namibia': 'NA',
  'botswana': 'BW',
  'zimbabwe': 'ZW',
  'zambia': 'ZM',
  'madagascar': 'MG',
  'mauritius': 'MU',
  'seychelles': 'SC',
  'costa rica': 'CR',
  'panama': 'PA',
  'cuba': 'CU',
  'dominican republic': 'DO',
  'puerto rico': 'PR',
  'jamaica': 'JM',
  'bahamas': 'BS',
  'bolivia': 'BO',
  'paraguay': 'PY',
  'ecuador': 'EC',
  'guatemala': 'GT',
  'honduras': 'HN',
  'nicaragua': 'NI',
  'el salvador': 'SV',
  'cambodia': 'KH',
  'laos': 'LA',
  'myanmar': 'MM',
  'nepal': 'NP',
  'sri lanka': 'LK',
  'taiwan': 'TW',
  'mongolia': 'MN',
  'kazakhstan': 'KZ',
  'uzbekistan': 'UZ',
  'israel': 'IL',
  'jordan': 'JO',
  'lebanon': 'LB',
  'uae': 'AE', 'united arab emirates': 'AE',
  'qatar': 'QA',
  'saudi arabia': 'SA',
  'oman': 'OM',
  'kuwait': 'KW',
  'bahrain': 'BH',
};

function extractCountryCode(text) {
  if (!text) return null;
  const lower = text.toLowerCase().trim();
  // Direct match
  if (COUNTRY_ALIASES[lower]) return COUNTRY_ALIASES[lower];
  // Try to find a known country in the text
  for (const [alias, code] of Object.entries(COUNTRY_ALIASES)) {
    if (lower.includes(alias)) return code;
  }
  return null;
}

// --- Fetch destinations with hotels that have coords ---
async function fetchDestinos() {
  const whereCountry = COUNTRY ? { paisCode: COUNTRY } : {};
  const hotels = await prisma.wvHotel.findMany({
    where: {
      latitude: { not: null },
      longitude: { not: null },
      OR: [
        { fonte: null },
        { fonte: { notIn: [FONTE_WRONG_COUNTRY, 'rejected_geo'] } },
      ],
      destino: whereCountry,
    },
    select: {
      id: true,
      nome: true,
      latitude: true,
      longitude: true,
      destino: { select: { id: true, nome: true, pais: true, paisCode: true } },
    },
    orderBy: { destinoId: 'asc' },
  });

  // Group by destino
  const groups = new Map();
  for (const h of hotels) {
    const did = h.destino.id;
    if (!groups.has(did)) {
      groups.set(did, {
        destinoId: did,
        nome: h.destino.nome,
        pais: h.destino.pais,
        paisCode: h.destino.paisCode,
        hotels: [],
      });
    }
    groups.get(did).hotels.push({
      id: h.id,
      nome: h.nome,
      latitude: h.latitude,
      longitude: h.longitude,
    });
  }

  let destinos = Array.from(groups.values());
  // Sort by most hotels first
  destinos.sort((a, b) => b.hotels.length - a.hotels.length);

  if (LIMIT > 0) destinos = destinos.slice(0, LIMIT);
  return destinos;
}

// --- Extract coordinates from a Google Maps URL ---
// URL format: https://www.google.com/maps/place/Name/@lat,lon,zoom/...
function extractCoordsFromLink(link) {
  if (!link) return null;
  const match = link.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (match) {
    return { lat: parseFloat(match[1]), lon: parseFloat(match[2]) };
  }
  return null;
}

// --- Photon reverse geocode ---
async function photonReverse(lat, lon) {
  try {
    const url = `https://photon.komoot.io/reverse?lat=${lat}&lon=${lon}&limit=1`;
    const resp = await fetch(url, { headers: { 'User-Agent': 'beta-app-hotel-geocoder/1.0' } });
    if (!resp.ok) return null;
    const data = await resp.json();
    const props = data.features?.[0]?.properties;
    if (props?.countrycode) {
      return { code: props.countrycode.toUpperCase(), country: props.country };
    }
    return null;
  } catch (err) {
    if (args.includes('--debug')) console.error(`    [Photon error] ${err.message}`);
    return null;
  }
}

// --- Call GMaps Scraper API for a destination ---
async function scrapeDestino(destName) {
  const query = encodeURIComponent(destName);
  const url = `${GMAPS_API}/scrape-get?query=${query}&max_places=5&lang=en&headless=true&concurrency=1`;

  try {
    const resp = await fetch(url, {
      headers: { 'User-Agent': 'beta-app-hotel-geocoder/1.0' },
      signal: AbortSignal.timeout(180_000),
    });
    if (!resp.ok) {
      console.error(`    [GMaps] API error: ${resp.status}`);
      return null;
    }
    const data = await resp.json();
    if (!Array.isArray(data) || data.length === 0) return null;

    // Debug: dump first result raw
    if (args.includes('--debug') && data.length > 0) {
      console.log(`    [DEBUG] First result keys: ${Object.keys(data[0]).join(', ')}`);
      try { console.log(`    [DEBUG] Raw: ${JSON.stringify(data[0]).slice(0, 500)}`); } catch {}
    }

    return data;
  } catch (err) {
    console.error(`    [GMaps] error: ${err.message}`);
    return null;
  }
}

// --- Determine country from scraped results using Photon reverse ---
// Uses confidence filtering: only returns a country if MIN_CONFIDENCE results agree.
// If the destination name clearly indicates the expected country, we require
// higher confidence to override it (prevents Lyon→PT false positives).
async function determineCountryFromResults(results, destName, expectedCode) {
  // Strategy 1: Multi-result confidence via Photon reverse geocode
  const countryVotes = {};  // { 'PT': 3, 'FR': 1, ... }
  const effectiveThreshold = Math.min(MIN_CONFIDENCE, results.length);

  for (const r of results) {
    const coords = extractCoordsFromLink(r.link);
    if (!coords) continue;
    const result = await photonReverse(coords.lat, coords.lon);
    if (result) {
      countryVotes[result.code] = (countryVotes[result.code] || 0) + 1;
    }
  }

  // Find the most-voted country
  const entries = Object.entries(countryVotes);
  if (entries.length > 0) {
    // Sort by votes descending (stable sort preserves insertion order for ties)
    entries.sort((a, b) => b[1] - a[1]);
    const topCode = entries[0][0];
    const topVotes = entries[0][1];
    const secondVotes = entries[1]?.[1] || 0;

    // Require: topVotes >= threshold AND topVotes > secondVotes (no ties)
    if (topVotes >= effectiveThreshold && topVotes > secondVotes) {
      // Extra safety: if dest name clearly indicates the EXPECTED country,
      // but GPS results (with low samples) say otherwise, don't trust GPS.
      // This prevents "Lyon, França" → PT false positives.
      const destNameCode = extractCountryCode(destName);
      if (destNameCode === expectedCode && expectedCode !== topCode &&
          (topVotes < MIN_CONFIDENCE || topVotes < results.length)) {
        if (VERBOSE) {
          console.log(`    [Dest name override] "${destName}" says ${expectedCode}, ` +
            `but GPS (${topVotes} votes) says ${topCode} — trusting name`);
        }
        // Fall through to text strategies which will use the dest name
      } else {
        if (VERBOSE && entries.length > 1) {
          console.log(`    [Confidence] ${topCode} (${topVotes}/${results.length}): ${
            entries.slice(1).map(e => `${e[0]}(${e[1]})`).join(', ')}`);
        }
        return { code: topCode, source: 'photon_reverse', confidence: topVotes };
      }
    }

    // Not enough confidence - fall through to other strategies
    if (args.includes('--debug')) {
      console.log(`    [Low confidence] votes: ${entries.map(e => `${e[0]}=${e[1]}`).join(', ')}`);
    }
  }

  // Strategy 2: Text-based fallback - check name of results
  for (const r of results.slice(0, 5)) {
    const name = r.name || '';
    const code = extractCountryCode(name);
    if (code) return { code, source: 'name', confidence: 1 };
  }

  // Strategy 3: Check if the destination name itself contains a country
  const destCode = extractCountryCode(destName);
  if (destCode) return { code: destCode, source: 'dest_name', confidence: 1 };

  return null;
}

// --- Mark hotels in a destination as wrong country ---
async function markDestinoWrong(hotelIds, actualCountry) {
  await prisma.wvHotel.updateMany({
    where: { id: { in: hotelIds } },
    data: { fonte: FONTE_WRONG_COUNTRY },
  });
  console.log(`    -> marked ${hotelIds.length} hotels as ${FONTE_WRONG_COUNTRY} (actual: ${actualCountry})`);
}

// --- Main ---
async function main() {
  console.log('=== Country Validation via Google Maps Scraper ===');
  console.log(`  GMAPS : ${GMAPS_API}`);
  console.log(`  mode  : ${DRY_RUN ? 'dry-run' : 'LIVE (--save)'}`);
  console.log(`  limit : ${LIMIT > 0 ? LIMIT : 'ALL'}`);
  console.log(`  country : ${COUNTRY || 'ALL'}`);
  console.log();

  const destinos = await fetchDestinos();
  const totalDest = destinos.length;
  const totalHotels = destinos.reduce((s, d) => s + d.hotels.length, 0);
  console.log(`Destinos with coords: ${totalDest} (${totalHotels} hotels)`);
  console.log();

  let ok = 0;
  let wrong = 0;
  let skipped = 0;
  let apiErrors = 0;

  for (let i = 0; i < destinos.length; i++) {
    const d = destinos[i];
    const expectedCode = (d.paisCode || '').toUpperCase();
    console.log(`[${i + 1}/${totalDest}] ${d.nome}, ${d.pais} (${expectedCode || 'no code'}) — ${d.hotels.length} hotéis`);

    if (!expectedCode) {
      console.log(`    -> SKIP: no paisCode for this destination`);
      skipped += d.hotels.length;
      continue;
    }

    // Scrape Google Maps for this destination
    const results = await scrapeDestino(d.nome);
    if (!results) {
      console.log(`    -> No results from GMaps`);
      apiErrors++;
      skipped += d.hotels.length;
      continue;
    }

    // Determine actual country
    const actual = await determineCountryFromResults(results, d.nome, expectedCode);
    if (!actual) {
      console.log(`    -> Could not determine country from ${results.length} results`);
      skipped += d.hotels.length;
      continue;
    }

    if (actual.code === expectedCode) {
      console.log(`    -> OK: ${expectedCode} matches Google Maps`);
      ok += d.hotels.length;
      // Not saving geo_country_ok to avoid cluttering the DB
    } else {
      console.log(`    -> WRONG: expected=${expectedCode}, GMaps says=${actual.code} (from ${actual.source})`);
      if (VERBOSE) {
        for (const r of results.slice(0, 3)) {
          console.log(`       "${r.name}" — ${r.address || 'no address'}`);
        }
      }
      wrong += d.hotels.length;
      if (!DRY_RUN) {
        await markDestinoWrong(d.hotels.map(h => h.id), actual.code);
      }
    }

    // Delay between destinations
    if (i < destinos.length - 1) {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  console.log(`\n=== Done ===`);
  console.log(`  Destinos : ${totalDest}`);
  console.log(`  OK        : ${ok} hotels (country matches)`);
  console.log(`  WRONG     : ${wrong} hotels (marked ${FONTE_WRONG_COUNTRY})`);
  console.log(`  Skipped   : ${skipped} hotels`);
  console.log(`  API errors: ${apiErrors}`);
  console.log(`  ${DRY_RUN ? '(dry-run — use --save to write to DB)' : '(changes saved to DB)'}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
