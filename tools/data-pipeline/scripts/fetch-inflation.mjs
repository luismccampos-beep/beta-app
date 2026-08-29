/**
 * Fetches annual CPI inflation for all countries from free sources and caches
 * them to data/cost-of-living/inflation.json:
 *
 *   - World Bank API  (FP.CPI.TOTL.ZG, official actuals, ~265 economies)
 *     https://api.worldbank.org/v2/country/all/indicator/FP.CPI.TOTL.ZG?format=json
 *
 *   - IMF DataMapper  (PCPIPCH, WEO — includes current-year + forecast values)
 *     https://www.imf.org/external/datamapper/api/v1/PCPIPCH
 *
 * Merge policy per ISO3/year: World Bank actual wins; IMF fills gaps
 * (typically the current year, whose WB actual is not published yet).
 *
 * Usage: node scripts/fetch-inflation.mjs [--force] [--from-year=2015]
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const COL_DIR = resolve(__dirname, '../data/cost-of-living');
const OUT_PATH = resolve(COL_DIR, 'inflation.json');

const TTL_MS = 30 * 24 * 60 * 60 * 1000; // refresh monthly is plenty (annual data)
const args = new Set(process.argv.slice(2));
const argVal = (name) => {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.split('=')[1] : undefined;
};
const FROM_YEAR = Number(argVal('from-year') ?? 2015);
const TARGET_YEAR = new Date().getFullYear();
const FORCE = args.has('--force');

/** @param {string} url @param {number} [tries] */
async function fetchJson(url, tries = 3) {
  let lastErr;
  for (let i = 0; i < tries; i++) {
    const ac = new AbortController();
    const timer = setTimeout(() => ac.abort(), 30_000);
    try {
      const res = await fetch(url, { signal: ac.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      lastErr = err;
      if (i < tries - 1) await new Promise((r) => setTimeout(r, 1500 * (i + 1)));
    } finally {
      clearTimeout(timer);
    }
  }
  throw lastErr;
}

async function main() {
  if (!FORCE && existsSync(OUT_PATH)) {
    try {
      const cached = JSON.parse(readFileSync(OUT_PATH, 'utf8'));
      const age = Date.now() - Date.parse(cached.fetchedAt);
      if (Number.isFinite(age) && age < TTL_MS) {
        console.log(
          `inflation.json is fresh (${Math.round(age / 86400000)}d old) — nothing to do. Use --force to refetch.`,
        );
        return;
      }
    } catch {
      // corrupt cache → refetch
    }
  }

  console.log(`Fetching inflation ${FROM_YEAR}–${TARGET_YEAR} (World Bank + IMF)…`);

  /** @type {Record<string, { name: string; cpi: Record<string, number>; imfYears: string[] }>} */
  const byIso3 = {};
  let wbCount = 0;
  let imfFilled = 0;

  // 1) World Bank actuals — one call for every economy.
  const wbUrl =
    `https://api.worldbank.org/v2/country/all/indicator/FP.CPI.TOTL.ZG` +
    `?format=json&per_page=20000&date=${FROM_YEAR}:${TARGET_YEAR}`;
  const wbPayload = await fetchJson(wbUrl);
  const wbRows = Array.isArray(wbPayload) ? wbPayload[1] ?? [] : [];
  for (const row of wbRows) {
    const iso3 = String(row.countryiso3code ?? '');
    const year = String(row.date ?? '');
    const v = row.value;
    if (!iso3 || !year || v == null || !Number.isFinite(Number(v))) continue;
    if (!byIso3[iso3]) byIso3[iso3] = { name: String(row.country?.value ?? iso3), cpi: {}, imfYears: [] };
    byIso3[iso3].cpi[year] = Math.round(Number(v) * 1000) / 1000;
    wbCount += 1;
  }

  // 2) IMF WEO — fills missing years (notably the current year).
  try {
    const imfPayload = await fetchJson('https://www.imf.org/external/datamapper/api/v1/PCPIPCH');
    const imfSeries = imfPayload?.values?.PCPIPCH ?? {};
    for (const [iso3, years] of Object.entries(imfSeries)) {
      if (!years || typeof years !== 'object') continue;
      if (!byIso3[iso3]) byIso3[iso3] = { name: iso3, cpi: {}, imfYears: [] };
      for (const [year, v] of Object.entries(years)) {
        const y = Number(year);
        if (y < FROM_YEAR || y > TARGET_YEAR) continue; // keep cache lean; forecasts beyond target are noise here
        const n = Number(v);
        if (!Number.isFinite(n)) continue;
        if (byIso3[iso3].cpi[year] == null) {
          byIso3[iso3].cpi[year] = Math.round(n * 1000) / 1000;
          byIso3[iso3].imfYears.push(year);
          imfFilled += 1;
        }
      }
    }
  } catch (err) {
    // IMF is a nice-to-have top-up; WB-only output still works.
    console.warn(`IMF fetch failed (${err.message}) — continuing with World Bank data only.`);
  }

  const countries = Object.keys(byIso3).length;
  if (countries === 0) throw new Error('No inflation data fetched from any source.');

  const withTarget = Object.values(byIso3).filter((e) => e.cpi[String(TARGET_YEAR)] != null).length;
  const payload = {
    fetchedAt: new Date().toISOString(),
    targetYear: TARGET_YEAR,
    indicators: { worldBank: 'FP.CPI.TOTL.ZG', imf: 'PCPIPCH' },
    note: 'Annual CPI inflation %. World Bank actuals take precedence; IMF fills gaps (usually current-year estimate/forecast).',
    byIso3,
  };
  mkdirSync(COL_DIR, { recursive: true });
  writeFileSync(OUT_PATH, JSON.stringify(payload), 'utf8');

  console.log(
    `Wrote ${OUT_PATH}\n` +
      `  countries: ${countries}\n` +
      `  world-bank observations: ${wbCount}\n` +
      `  imf gap-fills: ${imfFilled}\n` +
      `  with ${TARGET_YEAR} value: ${withTarget}/${countries}`,
  );
}

main().catch((err) => {
  if (existsSync(OUT_PATH)) {
    console.error(`Fetch failed (${err.message}) — keeping existing stale ${OUT_PATH}.`);
    process.exit(0);
  }
  console.error(`Fetch failed: ${err.message}`);
  process.exit(1);
});
