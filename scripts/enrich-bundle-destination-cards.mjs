/**
 * Adiciona campos de cartão (resumo, veja, faca, coma, tags) ao bundle existente
 * sem apagar imagens já enriquecidas.
 *
 *   npm run travel:demo:cards
 *   npm run travel:demo:cards -- --limit 500
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createInterface } from 'node:readline';
import { createReadStream } from 'node:fs';

import { buildDestinationCard } from './lib/wikivoyage-card.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const BUNDLE = resolve(ROOT, 'src/data/travel-mock/bundle-wikivoyage.json');
const WV_PT = resolve(ROOT, 'data/wikivoyage/out/pt-articles.jsonl');
const WV_EN = resolve(ROOT, 'data/wikivoyage/out/en-articles.jsonl');

const limitArg = process.argv.find((a) => a.startsWith('--limit'));
const LIMIT = limitArg ? parseInt(limitArg.split('=')[1] ?? process.argv[process.argv.indexOf('--limit') + 1], 10) : Infinity;

async function loadArticleIndex(path, lang) {
  /** @type {Map<string, { text: string; title: string }>} */
  const byTitle = new Map();
  if (!existsSync(path)) return byTitle;

  const rl = createInterface({
    input: createReadStream(path, { encoding: 'utf-8' }),
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    if (!line.trim()) continue;
    try {
      const art = JSON.parse(line);
      const title = art.title?.trim();
      if (!title || !art.text) continue;
      byTitle.set(`${lang}:${title}`, { text: art.text, title });
    } catch {
      /* skip */
    }
  }
  return byTitle;
}

async function main() {
  if (!existsSync(BUNDLE)) {
    console.error(`Missing ${BUNDLE}. Run: npm run travel:demo:build`);
    process.exit(1);
  }

  console.log('A carregar índice Wikivoyage…');
  const ptIndex = await loadArticleIndex(WV_PT, 'pt');
  const enIndex = await loadArticleIndex(WV_EN, 'en');
  console.log(`  PT: ${ptIndex.size} artigos | EN: ${enIndex.size} artigos`);

  const bundle = JSON.parse(readFileSync(BUNDLE, 'utf8'));
  const destinos = bundle.destinos ?? [];
  let updated = 0;
  let missing = 0;

  const slice = Number.isFinite(LIMIT) ? destinos.slice(0, LIMIT) : destinos;

  for (const dest of slice) {
    const lang = dest.lang ?? 'pt';
    const key = `${lang}:${dest.nome}`;
    const art = (lang === 'en' ? enIndex : ptIndex).get(key) ?? ptIndex.get(key) ?? enIndex.get(key);

    if (!art?.text) {
      missing += 1;
      continue;
    }

    const card = buildDestinationCard({
      text: art.text,
      title: dest.nome,
      tipo: dest.tipo,
      clima: dest.clima,
      lang,
    });

    if (card.resumo) dest.resumo = card.resumo;
    if (card.veja?.length) dest.veja = card.veja;
    if (card.faca?.length) dest.faca = card.faca;
    if (card.coma?.length) dest.coma = card.coma;
    if (card.tags?.length) dest.tags = card.tags;
    if (card.dicas) dest.dicas = card.dicas;

    if (card.resumo || card.veja || card.faca || card.coma || card.dicas) updated += 1;
  }

  writeFileSync(BUNDLE, JSON.stringify(bundle));
  console.log(
    `\nCartões atualizados: ${updated} destinos (${missing} sem artigo JSONL correspondente).`,
  );
  console.log(`Bundle: ${BUNDLE}`);
  console.log('Reinicia o Next.js para ver os cartões nos resultados.');
}

main();
