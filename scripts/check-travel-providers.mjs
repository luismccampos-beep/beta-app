/**
 * Diagnose Duffel + Scrape.do env and API connectivity (does not print secrets).
 * Run: node scripts/check-travel-providers.mjs
 */
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadEnvFile(path) {
  if (!existsSync(path)) return;
  const text = readFileSync(path, 'utf8');
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = val;
  }
}

const root = resolve(__dirname, '..');
loadEnvFile(resolve(root, '.env'));
loadEnvFile(resolve(root, '.env.local'));

function mask(v) {
  if (!v) return '(empty)';
  const t = v.trim();
  if (t.length <= 8) return `set (${t.length} chars)`;
  return `set (${t.length} chars, starts with ${t.slice(0, 6)}…)`;
}

function checkVar(name) {
  const raw = process.env[name];
  const issues = [];
  if (!raw?.trim()) issues.push('missing or empty');
  else {
    const t = raw.trim();
    if (raw !== t) issues.push('has leading/trailing whitespace');
    if (raw.includes('"') || raw.includes("'")) issues.push('contains quote characters — remove quotes in .env');
    if (/\s/.test(t)) issues.push('contains spaces — key may be broken across lines');
  }
  return { name, issues, masked: mask(raw?.trim()) };
}

const vars = [
  'DUFFEL_ACCESS_TOKEN',
  'SCRAPE_DO_API_KEY',
  'SCRAPE_DO_TOKEN',
  'LITEAPI_API_KEY',
];

console.log('=== Environment variables ===\n');
for (const v of vars) {
  const r = checkVar(v);
  console.log(`${v}: ${r.masked}`);
  if (r.issues.length) console.log(`  ⚠ ${r.issues.join('; ')}`);
}

const duffelToken = process.env.DUFFEL_ACCESS_TOKEN?.trim();
const scrapeDoToken =
  process.env.SCRAPE_DO_API_KEY?.trim() || process.env.SCRAPE_DO_TOKEN?.trim();

if (duffelToken) {
  const prefix = duffelToken.startsWith('duffel_') ? 'looks like Duffel token format' : 'unusual prefix (expected duffel_test_ or duffel_live_)';
  console.log(`\nDuffel token: ${prefix}`);
}

if (scrapeDoToken) {
  console.log('\nScrape.do: token set (Google Flights fallback when Duffel is missing or has no offers)');
}

async function testDuffel() {
  if (!duffelToken) {
    console.log('\n=== Duffel API: skipped (no token) ===');
    return;
  }
  console.log('\n=== Duffel API ===');
  const url = 'https://api.duffel.com/air/airports?limit=3';
  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${duffelToken}`,
        'Duffel-Version': 'v2',
        Accept: 'application/json',
      },
    });
    const text = await res.text();
    if (res.ok) {
      const json = JSON.parse(text);
      const n = json.data?.length ?? 0;
      console.log(`✓ airports OK (${res.status}), sample count: ${n}`);
    } else {
      console.log(`✗ airports failed (${res.status})`);
      console.log(`  ${text.slice(0, 280).replace(/\s+/g, ' ')}`);
      if (res.status === 401) console.log('  → Invalid or expired token, or wrong environment (test vs live)');
    }
  } catch (e) {
    console.log(`✗ network error: ${e instanceof Error ? e.message : e}`);
  }
}

async function testScrapeDo() {
  if (!scrapeDoToken) {
    console.log('\n=== Scrape.do API: skipped (no SCRAPE_DO_API_KEY) ===');
    return;
  }
  console.log('\n=== Scrape.do API (auth check) ===');
  const url = 'https://q.scrape.do/api/v1/jobs?limit=1';
  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/json', 'X-Token': scrapeDoToken },
    });
    const text = await res.text();
    if (res.ok || res.status === 404) {
      console.log(`✓ async API reachable (${res.status})`);
    } else if (res.status === 401) {
      console.log(`✗ unauthorized (${res.status}) — check SCRAPE_DO_API_KEY`);
    } else {
      console.log(`? response ${res.status}: ${text.slice(0, 200).replace(/\s+/g, ' ')}`);
    }
  } catch (e) {
    console.log(`✗ network error: ${e instanceof Error ? e.message : e}`);
  }
}

await testDuffel();
await testScrapeDo();
console.log('\nDone.');
