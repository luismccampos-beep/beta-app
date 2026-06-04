/**
 * Aplica destinos-sem-hotel-wiki-search.json ao bundle (Wikipedia PT + hotéis inferidos).
 *
 *   npm run travel:demo:apply-wiki-to-bundle
 *   npm run travel:demo:apply-wiki-to-bundle -- --dry-run
 *   npm run travel:demo:apply-wiki-to-bundle -- --input=data/hotels/destinos-sem-hotel-wiki-search.json
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  buildDestinationWikiFields,
  hotelCandidatesFromWikiRow,
} from './lib/wiki-search-to-catalog.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const BUNDLE = resolve(ROOT, 'src/data/travel-mock/bundle-wikivoyage.json');
const DEFAULT_INPUT = resolve(ROOT, 'data/hotels/destinos-sem-hotel-wiki-search.json');

const dryRun = process.argv.includes('--dry-run');
const inputArg = process.argv.find((a) => a.startsWith('--input'));
const INPUT = inputArg
  ? resolve(ROOT, inputArg.split('=')[1] ?? process.argv[process.argv.indexOf('--input') + 1])
  : DEFAULT_INPUT;
/** Por defeito aplica a todos os IDs do JSON de pesquisa (mesmo com hotéis sintéticos no bundle). */
const onlyEmpty = process.argv.includes('--only-empty');

async function main() {
  if (!existsSync(INPUT)) {
    console.error(`Missing ${INPUT}. Run first:\n  npm run travel:search:destinos-sem-hotel-wiki -- --extracts --limit=50`);
    process.exit(1);
  }
  if (!existsSync(BUNDLE)) {
    console.error('Missing bundle:', BUNDLE);
    process.exit(1);
  }

  const search = JSON.parse(readFileSync(INPUT, 'utf8'));
  const rows = search.destinos ?? [];
  if (!rows.length) {
    console.error('No destinos in search JSON. Run search with --extracts first.');
    process.exit(1);
  }

  const bundle = JSON.parse(readFileSync(BUNDLE, 'utf8'));
  const byId = new Map(bundle.destinos.map((d) => [d.id, d]));
  const hotelCount = new Map();
  for (const h of bundle.hoteis ?? []) {
    hotelCount.set(h.destino_id, (hotelCount.get(h.destino_id) ?? 0) + 1);
  }

  let nextId = bundle.hoteis?.reduce((m, h) => Math.max(m, h.id), 0) ?? 0;
  let destUpdated = 0;
  let hotelsAdded = 0;
  let destsWithHotels = 0;

  for (const row of rows) {
    const dest = byId.get(row.id);
    if (!dest) continue;

    const have = hotelCount.get(dest.id) ?? 0;
    if (onlyEmpty && have > 0) continue;

    const wikiFields = await buildDestinationWikiFields(row);
    if (wikiFields.wikipedia_resumo) {
      dest.wikipedia_resumo = wikiFields.wikipedia_resumo;
      dest.wikipedia_url = wikiFields.wikipedia_url ?? dest.wikipedia_url;
      dest.wiki_research = wikiFields.wiki_research;
      destUpdated += 1;
    }

    const candidates = hotelCandidatesFromWikiRow(row, 5);
    if (!candidates.length) continue;

    destsWithHotels += 1;
    for (const c of candidates) {
      nextId += 1;
      hotelsAdded += 1;
      bundle.hoteis.push({
        id: nextId,
        destino_id: dest.id,
        nome: c.nome,
        estrelas: c.estrelas,
        preco_por_noite: c.preco_por_noite,
        comodidades: c.comodidades,
        description: c.description,
        fonte: c.source,
        wiki_url: c.wiki_url,
        wiki_lang: c.wiki_lang,
      });
      hotelCount.set(dest.id, (hotelCount.get(dest.id) ?? 0) + 1);
    }
  }

  console.log('Apply wiki search → bundle');
  console.log(`  Entradas pesquisa: ${rows.length}`);
  console.log(`  Destinos Wikipedia actualizados: ${destUpdated}`);
  console.log(`  Hotéis novos: ${hotelsAdded} (${destsWithHotels} destinos)`);

  if (dryRun) {
    console.log('(dry-run — bundle não gravado)');
    return;
  }

  bundle.meta.counts.hoteis = bundle.hoteis.length;
  bundle.meta.wikiSearchApply = {
    at: new Date().toISOString(),
    input: INPUT,
    destUpdated,
    hotelsAdded,
    destsWithHotels,
  };
  writeFileSync(BUNDLE, JSON.stringify(bundle));
  console.log(`\nGuardado: ${BUNDLE} (${bundle.meta.counts.hoteis} hotéis)`);
  console.log('Seguinte: npm run travel:catalog:sync-wiki');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
