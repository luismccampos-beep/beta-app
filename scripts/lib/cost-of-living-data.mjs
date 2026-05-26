/**
 * Loads offline cost-of-living CSVs from data/cost-of-living/.
 */
import { existsSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const COL_DIR = resolve(__dirname, '../../data/cost-of-living');

/** @param {string} s */
export function fold(s) {
  return String(s ?? '')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, ' ');
}

/** @param {string} city @param {string} country */
export function cityKey(city, country) {
  return `${fold(city)}|${fold(country)}`;
}

/** Wikivoyage / app country (often PT) → English name in CSVs */
export const PAIS_EN = {
  portugal: 'Portugal',
  brasil: 'Brazil',
  brazil: 'Brazil',
  espanha: 'Spain',
  spain: 'Spain',
  franca: 'France',
  france: 'France',
  italia: 'Italy',
  italy: 'Italy',
  alemanha: 'Germany',
  germany: 'Germany',
  'estados unidos': 'United States',
  'united states': 'United States',
  usa: 'United States',
  'reino unido': 'United Kingdom',
  uk: 'United Kingdom',
  'united kingdom': 'United Kingdom',
  japao: 'Japan',
  japan: 'Japan',
  australia: 'Australia',
  tailandia: 'Thailand',
  thailand: 'Thailand',
  marrocos: 'Morocco',
  morocco: 'Morocco',
  china: 'China',
  india: 'India',
  mexico: 'Mexico',
  mexico: 'Mexico',
  argentina: 'Argentina',
  chile: 'Chile',
  colombia: 'Colombia',
  peru: 'Peru',
  canada: 'Canada',
  suica: 'Switzerland',
  switzerland: 'Switzerland',
  austria: 'Austria',
  belgica: 'Belgium',
  belgium: 'Belgium',
  holanda: 'Netherlands',
  netherlands: 'Netherlands',
  'republica checa': 'Czech Republic',
  grecia: 'Greece',
  greece: 'Greece',
  turquia: 'Turkey',
  turkey: 'Turkey',
  egito: 'Egypt',
  egypt: 'Egypt',
  'africa do sul': 'South Africa',
  'south africa': 'South Africa',
  indonesia: 'Indonesia',
  filipinas: 'Philippines',
  philippines: 'Philippines',
  vietna: 'Vietnam',
  vietnam: 'Vietnam',
  'coreia do sul': 'South Korea',
  'south korea': 'South Korea',
  irlanda: 'Ireland',
  ireland: 'Ireland',
  noruega: 'Norway',
  norway: 'Norway',
  suecia: 'Sweden',
  sweden: 'Sweden',
  dinamarca: 'Denmark',
  denmark: 'Denmark',
  finlandia: 'Finland',
  finland: 'Finland',
  polonia: 'Poland',
  poland: 'Poland',
  hungria: 'Hungary',
  hungary: 'Hungary',
  croacia: 'Croatia',
  croatia: 'Croatia',
  romenia: 'Romania',
  romania: 'Romania',
  israel: 'Israel',
  'emirados arabes unidos': 'United Arab Emirates',
  'united arab emirates': 'United Arab Emirates',
  singapura: 'Singapore',
  singapore: 'Singapore',
  'hong kong': 'Hong Kong (China)',
  internacional: '',
};

/** Destination leaf name → city name in Kaggle CSV */
export const CITY_ALIASES = {
  lisboa: 'Lisbon',
  lisbon: 'Lisbon',
  porto: 'Porto',
  'sao paulo': 'Sao Paulo',
  'são paulo': 'Sao Paulo',
  'rio de janeiro': 'Rio de Janeiro',
  'nova york': 'New York',
  'new york city': 'New York',
  londres: 'London',
  paris: 'Paris',
  madrid: 'Madrid',
  barcelona: 'Barcelona',
  roma: 'Rome',
  rome: 'Rome',
  milao: 'Milan',
  milan: 'Milan',
  munique: 'Munich',
  munich: 'Munich',
  berlim: 'Berlin',
  berlin: 'Berlin',
  amesterdao: 'Amsterdam',
  amsterdam: 'Amsterdam',
  bruxelas: 'Brussels',
  brussels: 'Brussels',
  viena: 'Vienna',
  vienna: 'Vienna',
  praga: 'Prague',
  prague: 'Prague',
  budapeste: 'Budapest',
  budapest: 'Budapest',
  varsavia: 'Warsaw',
  warsaw: 'Warsaw',
  cracovia: 'Krakow',
  krakow: 'Krakow',
  atenas: 'Athens',
  athens: 'Athens',
  istambul: 'Istanbul',
  istanbul: 'Istanbul',
  dubai: 'Dubai',
  toquio: 'Tokyo',
  tokyo: 'Tokyo',
  osaka: 'Osaka',
  kyoto: 'Kyoto',
  pequim: 'Beijing',
  beijing: 'Beijing',
  xangai: 'Shanghai',
  shanghai: 'Shanghai',
  'hong kong': 'Hong Kong',
  banguecoque: 'Bangkok',
  bangkok: 'Bangkok',
  bali: 'Denpasar',
  sydney: 'Sydney',
  melbourne: 'Melbourne',
  toronto: 'Toronto',
  vancouver: 'Vancouver',
  'los angeles': 'Los Angeles',
  'san francisco': 'San Francisco',
  chicago: 'Chicago',
  miami: 'Miami',
  'mexico city': 'Mexico City',
  'cidade do mexico': 'Mexico City',
  'buenos aires': 'Buenos Aires',
  santiago: 'Santiago',
  lima: 'Lima',
  bogota: 'Bogota',
  'cidade do cabo': 'Cape Town',
  'cape town': 'Cape Town',
  joanesburgo: 'Johannesburg',
  johannesburg: 'Johannesburg',
  cairo: 'Cairo',
  marrakech: 'Marrakesh',
  marraquexe: 'Marrakesh',
  casablanca: 'Casablanca',
  zurique: 'Zurich',
  zurich: 'Zurich',
  genebra: 'Geneva',
  geneva: 'Geneva',
};

/** @param {string} pais */
export function countryToEnglish(pais) {
  const k = fold(pais);
  if (PAIS_EN[k] !== undefined) return PAIS_EN[k];
  return pais;
}

/** @param {string} nome */
export function leafCityName(nome) {
  const leaf = String(nome ?? '').split('/')[0]?.trim() || '';
  const f = fold(leaf);
  return CITY_ALIASES[f] ?? leaf;
}

/**
 * @param {string} line
 * @returns {string[]}
 */
function parseCsvLine(line) {
  const out = [];
  let cur = '';
  let q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      q = !q;
      continue;
    }
    if (c === ',' && !q) {
      out.push(cur);
      cur = '';
      continue;
    }
    cur += c;
  }
  out.push(cur);
  return out;
}

/**
 * @param {string} file
 * @param {(row: Record<string, string>) => void} onRow
 */
function readCsv(file, onRow) {
  if (!existsSync(file)) return false;
  const text = readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
  const lines = text.trim().split(/\r?\n/);
  const headers = parseCsvLine(lines[0]);
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i]);
    if (cols.length < headers.length) continue;
    /** @type {Record<string, string>} */
    const row = {};
    headers.forEach((h, j) => {
      row[h.trim()] = cols[j]?.trim() ?? '';
    });
    onRow(row);
  }
  return true;
}

/** @param {string} v */
function num(v) {
  const n = parseFloat(String(v ?? '').replace(/[^\d.-]/g, ''));
  return Number.isFinite(n) ? n : null;
}

/**
 * @returns {{
 *   cities: Map<string, Record<string, unknown>>,
 *   countries: Map<string, Record<string, unknown>>,
 *   crisis: Map<string, Record<string, unknown>>,
 *   sources: string[],
 * }}
 */
/** NYC ref. meal price in Kaggle CSV (x1). */
const NYC_MEAL_REF = 25;

/**
 * @param {Map<string, Record<string, unknown>>} cities
 */
export function buildCountryAveragesFromCities(cities) {
  /** @type {Map<string, number[]>} */
  const meals = new Map();
  for (const row of cities.values()) {
    const country = /** @type {string} */ (row.country);
    const x1 = /** @type {Record<string, number | null>} */ (row.prices)?.x1;
    if (!country || x1 == null) continue;
    const k = fold(country);
    if (!meals.has(k)) meals.set(k, []);
    meals.get(k).push(x1);
  }
  /** @type {Map<string, Record<string, unknown>>} */
  const out = new Map();
  for (const [k, vals] of meals) {
    vals.sort((a, b) => a - b);
    const median = vals[Math.floor(vals.length / 2)];
    const costIndex = round((median / NYC_MEAL_REF) * 100);
    out.set(k, {
      country: k,
      costIndex,
      restaurantIndex: costIndex,
      groceriesIndex: costIndex * 0.95,
      source: 'média cidades (cost-of-living_v2)',
      cityCount: vals.length,
    });
  }
  return out;
}

/**
 * @param {string} a @param {string} b
 */
export function nameSimilarity(a, b) {
  if (!a || !b) return 0;
  if (a === b) return 1;
  if (a.length < 2 || b.length < 2) return a === b ? 1 : 0;
  const bigrams = (s) => {
    const set = new Set();
    for (let i = 0; i < s.length - 1; i++) set.add(s.slice(i, i + 2));
    return set;
  };
  const A = bigrams(a);
  const B = bigrams(b);
  let inter = 0;
  for (const x of A) if (B.has(x)) inter += 1;
  return (2 * inter) / (A.size + B.size);
}

/**
 * @param {Map<string, Record<string, unknown>>} cities
 * @param {Map<string, Record<string, unknown>>} crisis
 * @param {string} cityName
 * @param {string} countryEn
 * @param {number} [threshold]
 */
export function lookupCityFuzzy(cities, crisis, cityName, countryEn, threshold = 0.86) {
  const want = fold(cityName);
  const countryFold = fold(countryEn);
  let best = null;
  let bestScore = threshold;

  for (const [key, row] of cities) {
    if (!key.endsWith(`|${countryFold}`)) continue;
    const cityPart = key.split('|')[0];
    const score = Math.max(
      nameSimilarity(want, cityPart),
      nameSimilarity(fold(CITY_ALIASES[want] ?? ''), cityPart),
    );
    if (score > bestScore) {
      bestScore = score;
      best = { key, row, score };
    }
  }
  if (!best) return null;
  return {
    cityRow: best.row,
    crisisRow: crisis.get(best.key) ?? null,
    matchedCity: best.row.city,
    fuzzyScore: best.score,
  };
}

export function loadCostOfLivingIndexes() {
  /** @type {Map<string, Record<string, unknown>>} */
  const cities = new Map();
  /** @type {Map<string, Record<string, unknown>>} */
  const countries = new Map();
  /** @type {Map<string, Record<string, unknown>>} */
  const crisis = new Map();
  const sources = [];

  const v2 = resolve(COL_DIR, 'cost-of-living_v2.csv');
  if (
    readCsv(v2, (row) => {
      const city = row.city;
      const country = row.country;
      if (!city || !country) return;
      const key = cityKey(city, country);
      /** @type {Record<string, number | null>} */
      const prices = {};
      for (let i = 1; i <= 55; i++) {
        prices[`x${i}`] = num(row[`x${i}`]);
      }
      cities.set(key, {
        city,
        country,
        prices,
        data_quality: num(row.data_quality),
        source: 'cost-of-living_v2.csv',
      });
    })
  ) {
    sources.push('cost-of-living_v2.csv');
  } else if (
    readCsv(resolve(COL_DIR, 'cost-of-living.csv'), (row) => {
      const city = row.city;
      const country = row.country;
      if (!city || !country) return;
      const key = cityKey(city, country);
      const prices = {};
      for (let i = 1; i <= 55; i++) {
        prices[`x${i}`] = num(row[`x${i}`]);
      }
      cities.set(key, {
        city,
        country,
        prices,
        data_quality: num(row.data_quality),
        source: 'cost-of-living.csv',
      });
    })
  ) {
    sources.push('cost-of-living.csv');
  }

  for (const file of [
    'Cost_of_Living_Index_by_Country_2024.csv',
    'wikipedia_cost_of_living_indices3.csv',
  ]) {
    const path = resolve(COL_DIR, file);
    if (
      !readCsv(path, (row) => {
        const country = row.Country;
        if (!country) return;
        const key = fold(country);
        countries.set(key, {
          country,
          costIndex: num(row['Cost of Living Index']),
          rentIndex: num(row['Rent Index']),
          groceriesIndex: num(row['Groceries Index']),
          restaurantIndex: num(row['Restaurant Price Index']),
          purchasingPowerIndex: num(row['Local Purchasing Power Index']),
          source: file,
        });
      })
    ) {
      continue;
    }
    sources.push(file);
    break;
  }

  const crisisPath = resolve(COL_DIR, 'global_cost_of_living_crisis_2026.csv');
  if (
    readCsv(crisisPath, (row) => {
      const city = row.city;
      const country = row.country;
      if (!city || !country) return;
      crisis.set(cityKey(city, country), {
        city,
        country,
        costIndex: num(row.cost_of_living_index),
        rentIndex: num(row.rent_index),
        restaurantIndex: num(row.restaurant_price_index),
        salaryUsd: num(row.avg_monthly_net_salary_usd),
        rentCenterUsd: num(row.monthly_rent_1br_city_center_usd),
        source: 'global_cost_of_living_crisis_2026.csv',
      });
    })
  ) {
    sources.push('global_cost_of_living_crisis_2026.csv');
  }

  const cityCountryAvg = buildCountryAveragesFromCities(cities);
  for (const [k, row] of cityCountryAvg) {
    if (!countries.has(k)) countries.set(k, row);
  }

  return { cities, countries, crisis, cityCountryAvg, sources };
}

/** @param {number} n */
function round(n) {
  return Math.round(n * 100) / 100;
}

/**
 * @param {Map<string, Record<string, unknown>>} cities
 * @param {Map<string, Record<string, unknown>>} crisis
 * @param {string} cityName
 * @param {string} countryEn
 */
export function lookupCityRow(cities, crisis, cityName, countryEn) {
  if (!countryEn) return null;
  const candidates = [cityName];
  const alias = CITY_ALIASES[fold(cityName)];
  if (alias) candidates.push(alias);

  for (const c of candidates) {
    const key = cityKey(c, countryEn);
    const crisisRow = crisis.get(key);
    const cityRow = cities.get(key);
    if (cityRow || crisisRow) {
      return { cityRow: cityRow ?? null, crisisRow: crisisRow ?? null, matchedCity: c, match: 'exact' };
    }
  }

  const want = fold(candidates[0]);
  for (const [key, row] of cities) {
    if (!key.endsWith(`|${fold(countryEn)}`)) continue;
    const cityPart = key.split('|')[0];
    if (cityPart === want || cityPart.startsWith(want) || want.startsWith(cityPart)) {
      return { cityRow: row, crisisRow: crisis.get(key) ?? null, matchedCity: row.city, match: 'prefix' };
    }
  }

  const fuzzy = lookupCityFuzzy(cities, crisis, cityName, countryEn);
  if (fuzzy) return { ...fuzzy, match: 'fuzzy' };

  return null;
}

/**
 * When Wikivoyage country is "Internacional", match city name only if unique in CSV.
 * @param {Map<string, Record<string, unknown>>} cities
 * @param {Map<string, Record<string, unknown>>} crisis
 * @param {string} cityName
 */
export function lookupCityGlobal(cities, crisis, cityName) {
  const candidates = [cityName];
  const alias = CITY_ALIASES[fold(cityName)];
  if (alias) candidates.push(alias);

  for (const c of candidates) {
    const prefix = `${fold(c)}|`;
    const hits = [];
    for (const [key, row] of cities) {
      if (key.startsWith(prefix)) hits.push({ key, row });
    }
    if (hits.length === 1) {
      const key = hits[0].key;
      return {
        cityRow: hits[0].row,
        crisisRow: crisis.get(key) ?? null,
        matchedCity: hits[0].row.city,
      };
    }
    if (hits.length > 1) {
      const crisisHit = hits.find((h) => crisis.has(h.key));
      if (crisisHit) {
        return {
          cityRow: crisisHit.row,
          crisisRow: crisis.get(crisisHit.key) ?? null,
          matchedCity: crisisHit.row.city,
        };
      }
    }
  }
  return null;
}

/**
 * @param {Map<string, Record<string, unknown>>} countries
 * @param {string} countryEn
 */
export function lookupCountryRow(countries, countryEn) {
  const k = fold(countryEn);
  if (countries.has(k)) return countries.get(k);
  for (const [key, row] of countries) {
    if (key.includes(k) || k.includes(key)) return row;
  }
  return null;
}
