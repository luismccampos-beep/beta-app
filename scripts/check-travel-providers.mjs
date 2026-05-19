/**
 * Diagnose Duffel + Hotelbeds env and API connectivity (does not print secrets).
 * Run: node scripts/check-travel-providers.mjs
 */
import { createHash } from 'node:crypto';
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
  'HOTELBEDS_API_KEY',
  'HOTELBEDS_API_SECRET',
  'HOTELBEDS_API_BASE_URL',
];

console.log('=== Environment variables ===\n');
for (const v of vars) {
  const r = checkVar(v);
  console.log(`${v}: ${r.masked}`);
  if (r.issues.length) console.log(`  ⚠ ${r.issues.join('; ')}`);
}

const duffelToken = process.env.DUFFEL_ACCESS_TOKEN?.trim();
const hbKey = process.env.HOTELBEDS_API_KEY?.trim();
const hbSecret = process.env.HOTELBEDS_API_SECRET?.trim();
const hbBase =
  process.env.HOTELBEDS_API_BASE_URL?.trim() || 'https://api.test.hotelbeds.com';

if (duffelToken) {
  const prefix = duffelToken.startsWith('duffel_') ? 'looks like Duffel token format' : 'unusual prefix (expected duffel_test_ or duffel_live_)';
  console.log(`\nDuffel token: ${prefix}`);
}

if (hbKey && hbSecret) {
  const prod = hbBase.includes('api.hotelbeds.com') && !hbBase.includes('test');
  console.log(`\nHotelbeds base URL: ${hbBase} (${prod ? 'PRODUCTION' : 'test/sandbox'})`);
  console.log('  Tip: test API keys only work with https://api.test.hotelbeds.com');
  console.log('  Production keys need https://api.hotelbeds.com (uncomment HOTELBEDS_API_BASE_URL)');
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

function hbSignature(apiKey, secret, ts) {
  return createHash('sha256').update(apiKey + secret + ts).digest('hex');
}

async function testHotelbeds(label, baseUrl) {
  if (!hbKey || !hbSecret) return;
  const ts = Math.floor(Date.now() / 1000);
  const url = `${baseUrl.replace(/\/$/, '')}/hotel-content-api/1.0/types/accommodations?from=1&to=5&language=ENG`;
  const res = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'Api-key': hbKey,
      'X-Signature': hbSignature(hbKey, hbSecret, ts),
    },
  });
  const text = await res.text();
  return { ok: res.ok, status: res.status, snippet: text.slice(0, 280).replace(/\s+/g, ' ') };
}

async function testHotelbedsAll() {
  if (!hbKey || !hbSecret) {
    console.log('\n=== Hotelbeds API: skipped (missing key or secret) ===');
    return;
  }
  console.log('\n=== Hotelbeds API ===');
  const testBase = 'https://api.test.hotelbeds.com';
  const prodBase = 'https://api.hotelbeds.com';

  for (const [label, base] of [
    ['configured base', hbBase],
    ['test host', testBase],
    ['production host', prodBase],
  ]) {
    if (label === 'production host' && hbBase === testBase) {
      // still test prod if user only has test URL set
    }
    try {
      const r = await testHotelbeds(label, base);
      if (r.ok) {
        console.log(`✓ ${label} (${r.status}) — accommodations endpoint OK`);
        if (label !== 'configured base' && hbBase !== base) {
          console.log(`  → Your HOTELBEDS_API_BASE_URL may be wrong; this host works.`);
        }
        return;
      }
      console.log(`✗ ${base}: ${r.status} — ${r.snippet}`);
    } catch (e) {
      console.log(`✗ ${base}: ${e instanceof Error ? e.message : e}`);
    }
  }
  console.log('  Common fixes: match base URL to key type; Api-key + secret from same Hotelbeds account');
}

await testDuffel();
await testHotelbedsAll();
console.log('\nDone.');
