/**
 * Estado do pipeline wiki + destinos sem hotéis reais no bundle.
 *   npm run travel:wiki:status
 */
import { existsSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const BUNDLE = resolve(ROOT, 'src/data/travel-mock/bundle-wikivoyage.json');
const SEARCH = resolve(ROOT, 'data/hotels/destinos-sem-hotel-wiki-search.json');
const STATE = resolve(ROOT, 'data/hotels/destinos-sem-hotel-wiki-search.fetch-state.json');

const WEAK = new Set(['synthetic', 'liteapi']);

function main() {
  if (!existsSync(BUNDLE)) {
    console.error('Bundle em falta');
    process.exit(1);
  }
  const bundle = JSON.parse(readFileSync(BUNDLE, 'utf8'));
  const fontesByDest = new Map();
  const countByDest = new Map();
  for (const h of bundle.hoteis ?? []) {
    countByDest.set(h.destino_id, (countByDest.get(h.destino_id) ?? 0) + 1);
    const f = h.fonte ?? h.source ?? '';
    if (!fontesByDest.has(h.destino_id)) fontesByDest.set(h.destino_id, []);
    fontesByDest.get(h.destino_id).push(f);
  }

  let empty = 0;
  let weakOnly = 0;
  let withWiki = 0;
  for (const d of bundle.destinos) {
    const n = countByDest.get(d.id) ?? 0;
    if (n === 0) empty += 1;
    else {
      const fonts = fontesByDest.get(d.id) ?? [];
      if (fonts.every((f) => WEAK.has(f))) weakOnly += 1;
    }
    if (d.wikipedia_resumo || d.wikipedia_url) withWiki += 1;
  }

  console.log('Bundle');
  console.log(`  Destinos: ${bundle.destinos.length}`);
  console.log(`  Hotéis: ${bundle.hoteis?.length ?? 0}`);
  console.log(`  Sem nenhum hotel: ${empty}`);
  console.log(`  Só synthetic/liteapi: ${weakOnly}`);
  console.log(`  Com wikipedia_resumo no bundle: ${withWiki}`);

  if (existsSync(SEARCH)) {
    const s = JSON.parse(readFileSync(SEARCH, 'utf8'));
    console.log('\nPesquisa wiki');
    console.log(`  Total alvo: ${s.meta?.total ?? '?'}`);
    console.log(`  Já pesquisados (JSON): ${s.destinos?.length ?? 0}`);
    console.log(`  Fonte: ${s.meta?.source ?? '?'}`);
  }
  if (existsSync(STATE)) {
    const st = JSON.parse(readFileSync(STATE, 'utf8'));
    console.log(`  Estado (doneIds): ${st.doneIds?.length ?? 0}`);
  }

  const remaining = (() => {
    if (!existsSync(SEARCH) || !existsSync(STATE)) return null;
    const s = JSON.parse(readFileSync(SEARCH, 'utf8'));
    const st = JSON.parse(readFileSync(STATE, 'utf8'));
    return (s.meta?.total ?? 0) - (st.doneIds?.length ?? 0);
  })();
  if (remaining != null && remaining > 0) {
    console.log(`\n→ Faltam ~${remaining} destinos: npm run travel:search:destinos-sem-hotel-wiki -- --resume --limit=50 --extracts`);
  }
  if (weakOnly > 0 || empty > 0) {
    console.log(
      `\n→ Destinos fracos: npm run travel:demo:enrich-hotels-remaining` +
        (empty === 0 ? ' (ou continuar pesquisa wiki + apply-wiki-to-bundle)' : ''),
    );
  }
}

main();
