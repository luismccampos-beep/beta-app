/**
 * Enriquece bundle-wikivoyage.json com hotéis de data/hotels (TurAD, Local, WV EN).
 *
 *   npm run travel:demo:build-hotel-index
 *   npm run travel:demo:enrich-hotels
 *   npm run travel:demo:enrich-hotels -- --dry-run
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

import { fold } from './lib/cost-of-living-data.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const BUNDLE = resolve(ROOT, 'src/data/travel-mock/bundle-wikivoyage.json');
const INDEX = resolve(ROOT, 'data/hotels/hotel-index.json');

const dryRun = process.argv.includes('--dry-run');
const minHotelsArg = process.argv.find((a) => a.startsWith('--min-hotels'));
const MIN_HOTELS = minHotelsArg
  ? parseInt(minHotelsArg.split('=')[1] ?? process.argv[process.argv.indexOf('--min-hotels') + 1], 10)
  : 1;
const MAX_ADD = parseInt(process.env.HOTEL_ENRICH_MAX_PER_DEST ?? '8', 10);

function destKeys(nome) {
  const base = nome.replace(/\([^)]*\)/g, ' ').replace(/\s+/g, ' ').trim();
  const keys = new Set([fold(base), fold(nome)]);
  const leaf = base.split(/[,|/]/)[0]?.trim();
  if (leaf) keys.add(fold(leaf));
  return [...keys].filter(Boolean);
}

function ensureIndex() {
  if (existsSync(INDEX)) return;
  console.log('Building hotel-index.json (first run)…');
  execSync('py -3 scripts/build-hotel-data-index.py', { cwd: ROOT, stdio: 'inherit' });
}

function lookupHotels(dest, index) {
  const keys = destKeys(dest.nome ?? '');
  const out = [];
  const seen = new Set();
  const push = (rows) => {
    for (const r of rows ?? []) {
      const k = `${r.source}|${r.nome}`;
      if (seen.has(k)) continue;
      seen.add(k);
      out.push(r);
      if (out.length >= MAX_ADD) return;
    }
  };

  const isPt = fold(dest.pais ?? '') === 'portugal';
  if (isPt) {
    for (const k of keys) {
      push(index.byConcelho?.[k]);
      push(index.byLocalidade?.[k]);
    }
  }

  for (const k of keys) {
    push(index.byArticle?.[k]);
  }

  return out.slice(0, MAX_ADD);
}

function main() {
  if (!existsSync(BUNDLE)) {
    console.error('Missing bundle:', BUNDLE);
    process.exit(1);
  }

  ensureIndex();
  const index = JSON.parse(readFileSync(INDEX, 'utf8'));
  const bundle = JSON.parse(readFileSync(BUNDLE, 'utf8'));

  const countByDest = new Map();
  for (const h of bundle.hoteis) {
    countByDest.set(h.destino_id, (countByDest.get(h.destino_id) ?? 0) + 1);
  }

  let nextId = bundle.hoteis.reduce((m, h) => Math.max(m, h.id), 0);
  let added = 0;
  let destsFilled = 0;
  const bySource = { turad: 0, local: 0, 'wikivoyage-en': 0 };

  for (const dest of bundle.destinos) {
    const have = countByDest.get(dest.id) ?? 0;
    if (have >= MIN_HOTELS) continue;

    const candidates = lookupHotels(dest, index);
    if (!candidates.length) continue;

    destsFilled += 1;
    for (const c of candidates) {
      nextId += 1;
      added += 1;
      bySource[c.source] = (bySource[c.source] ?? 0) + 1;
      bundle.hoteis.push({
        id: nextId,
        destino_id: dest.id,
        nome: c.nome,
        estrelas: c.estrelas,
        preco_por_noite: c.preco_por_noite,
        comodidades: c.comodidades ?? ['wifi'],
        fonte: c.source,
      });
      countByDest.set(dest.id, (countByDest.get(dest.id) ?? 0) + 1);
    }
  }

  const stillEmpty = bundle.destinos.filter((d) => (countByDest.get(d.id) ?? 0) === 0).length;

  console.log('Hotel enrich summary:');
  console.log(`  Added: ${added} hotels for ${destsFilled} destinations`);
  console.log(`  By source:`, bySource);
  console.log(`  Destinos still without hotels: ${stillEmpty}/${bundle.destinos.length}`);

  if (dryRun) {
    console.log('(dry-run — bundle not written)');
    return;
  }

  bundle.meta.counts.hoteis = bundle.hoteis.length;
  bundle.meta.hotelEnrich = {
    at: new Date().toISOString(),
    added,
    destsFilled,
    stillEmpty,
    sources: bySource,
  };

  writeFileSync(BUNDLE, JSON.stringify(bundle), 'utf8');
  console.log(`Updated ${BUNDLE} → ${bundle.meta.counts.hoteis} hotéis total`);
}

main();
