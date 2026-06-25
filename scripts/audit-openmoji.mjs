#!/usr/bin/env node
/**
 * Audit OpenMoji emojis used in the AKMLEVA codebase.
 *
 * - Scans .ts/.tsx/.json for emoji characters
 * - Extracts hardcoded emoji strings from components
 * - Tests each emoji against:
 *    1. local node_modules/@svgmoji/openmoji/svg/{HEX}.svg
 *    2. jsdelivr CDN
 *    3. unpkg CDN
 *    4. Twemoji CDN (fallback)
 * - Generates an ALIASES map for emojis that need remapping
 * - Optionally patches src/app/components/ui/openmoji.tsx
 *
 * Usage:
 *   node scripts/audit-openmoji.mjs
 *   node scripts/audit-openmoji.mjs --fix    # patch openmoji.tsx with aliases
 *   node scripts/audit-openmoji.mjs --json   # machine readable
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OPENMOJI_VERSION = '3.2.0';
const FIX = process.argv.includes('--fix');
const JSON_OUT = process.argv.includes('--json');

const STRIP_CP = new Set([0xFE0E, 0xFE0F]);

function emojiToHex(emoji) {
  return Array.from(emoji)
    .map(ch => ch.codePointAt(0))
    .filter(cp => !STRIP_CP.has(cp))
    .map(cp => cp.toString(16).toUpperCase())
    .join('-');
}

// --- 1. collect emojis ---
async function* walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.name === 'node_modules' || e.name === '.git' || e.name.startsWith('.')) continue;
    if (e.isDirectory()) { yield* walk(full); continue; }
    if (/\.(ts|tsx|json|js|mjs)$/.test(e.name)) yield full;
  }
}

const found = new Map();

for await (const file of walk(path.join(ROOT, 'src'))) {
  const text = await fs.readFile(file, 'utf8').catch(() => '');
  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const re = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F1E6}-\u{1F1FF}][\uFE0E\uFE0F\u200D\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F1E6}-\u{1F1FF}]*/gu;
    let m;
    while ((m = re.exec(line))) {
      const emoji = m[0];
      if (!found.has(emoji)) found.set(emoji, new Set());
      found.get(emoji).add(`${path.relative(ROOT, file)}:${i + 1}`);
    }
  }
}

// --- 2. test against local OpenMoji if available ---
const localSvgDir = path.join(ROOT, 'node_modules', '@svgmoji', 'openmoji', 'svg');
let localFiles = new Set();
try {
  const files = await fs.readdir(localSvgDir);
  localFiles = new Set(files.map(f => f.replace(/\.svg$/i, '').toUpperCase()));
} catch { /* no local install — skip */ }

async function checkUrl(url) {
  try {
    const res = await fetch(url, { method: 'HEAD' });
    return res.ok;
  } catch { return false; }
}

const results = [];
for (const [emoji, locations] of [...found.entries()].sort()) {
  const hex = emojiToHex(emoji);
  const hexLower = hex.toLowerCase();
  const cps = Array.from(emoji).map(c => 'U+' + c.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')).join(' ');

  const localOk = localFiles.size ? localFiles.has(hex) : null;

  const urls = {
    jsdelivr: `https://cdn.jsdelivr.net/npm/@svgmoji/openmoji@${OPENMOJI_VERSION}/svg/${hex}.svg`,
    unpkg: `https://unpkg.com/@svgmoji/openmoji@${OPENMOJI_VERSION}/svg/${hex}.svg`,
    twemoji: `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/${hexLower}.svg`,
  };

  let status = localOk === true ? 'local_ok'
    : localOk === false ? 'local_missing'
    : 'unknown';

  let workingUrl = null;
  let fallback = null;

  if (localOk !== true) {
    if (await checkUrl(urls.jsdelivr)) { workingUrl = urls.jsdelivr; status = 'jsdelivr_ok'; }
    else if (await checkUrl(urls.unpkg)) { workingUrl = urls.unpkg; status = 'unpkg_ok'; }
    else if (await checkUrl(urls.twemoji)) { workingUrl = urls.twemoji; status = 'twemoji_fallback'; fallback = 'twemoji'; }
    else { status = 'MISSING_EVERYWHERE'; }
  } else {
    workingUrl = urls.jsdelivr;
  }

  results.push({
    emoji,
    hex,
    codepoints: cps,
    status,
    workingUrl,
    fallback,
    locations: [...locations].slice(0, 3),
    count: locations.size,
  });

  if (localFiles.size === 0) await new Promise(r => setTimeout(r, 60));
}

// --- 3. output ---
if (JSON_OUT) {
  console.log(JSON.stringify(results, null, 2));
  process.exit(0);
}

const ok = results.filter(r => r.status.includes('ok') && !r.status.includes('twemoji'));
const tw = results.filter(r => r.status === 'twemoji_fallback');
const missing = results.filter(r => r.status === 'MISSING_EVERYWHERE');

console.log(`\nAKMLEVA OpenMoji audit — v${OPENMOJI_VERSION}\n`);
console.log(`Total unique emojis found: ${results.length}`);
console.log(`  OpenMoji OK:        ${ok.length} ✅`);
console.log(`  Twemoji fallback:   ${tw.length} ⚠️`);
console.log(`  Missing everywhere: ${missing.length} ❌\n`);

if (tw.length) {
  console.log('--- Twemoji fallback (OpenMoji missing, Twemoji has) ---');
  for (const r of tw) {
    console.log(`  ${r.emoji}  ${r.hex.padEnd(28)} ${r.codepoints}  — ${[...r.locations].join(', ')}`);
  }
  console.log();
}
if (missing.length) {
  console.log('--- MISSING EVERYWHERE ---');
  for (const r of missing) {
    console.log(`  ${r.emoji}  ${r.hex.padEnd(28)} ${r.codepoints}  — ${[...r.locations].join(', ')}`);
  }
  console.log();
}

const aliasSuggestions = {};
for (const r of [...tw, ...missing]) {
  const baseHex = r.hex.split('-').filter(h => h !== 'FE0E' && h !== 'FE0F').join('-');
  if (baseHex !== r.hex && localFiles.has(baseHex)) {
    aliasSuggestions[r.emoji] = baseHex;
  }
}

if (Object.keys(aliasSuggestions).length) {
  console.log('--- Suggested ALIASES for openmoji.tsx ---');
  console.log('const ALIASES: Record<string, string> = {');
  for (const [emoji, hex] of Object.entries(aliasSuggestions)) {
    console.log(`  '${emoji}': '${hex}',`);
  }
  console.log('};\n');
} else {
  console.log('No manual aliases needed — VS-stripping in emojiToHex handles all cases found. ✅\n');
}

if (FIX && Object.keys(aliasSuggestions).length > 0) {
  const openmojiPath = path.join(ROOT, 'src/app/components/ui/openmoji.tsx');
  let src = await fs.readFile(openmojiPath, 'utf8');
  const aliasBlock = `const ALIASES: Record<string, string> = {\n${Object.entries(aliasSuggestions).map(([e, h]) => `  '${e}': '${h}',`).join('\n')}\n};`;
  src = src.replace(/const ALIASES: Record<string, string> = \{[^}]*\};/s, aliasBlock);
  await fs.writeFile(openmojiPath, src);
  console.log(`Patched ${path.relative(ROOT, openmojiPath)} with ${Object.keys(aliasSuggestions).length} aliases.`);
}

console.log(`\nFull report: ${results.length} emojis scanned.`);
console.log(`Run with --fix to auto-patch openmoji.tsx, --json for machine output.\n`);
