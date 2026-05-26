/**
 * Enriquece bundle-wikivoyage.json com orçamentos diários (hierarquia CSV Kaggle).
 *
 *   npm run travel:demo:enrich-budget
 *   npm run travel:demo:enrich-budget -- --limit 500
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { COL_DIR, loadCostOfLivingIndexes } from './lib/cost-of-living-data.mjs';
import { resolveBudgetForDestination } from './lib/travel-budget.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const BUNDLE = resolve(ROOT, 'src/data/travel-mock/bundle-wikivoyage.json');

const limitArg = process.argv.find((a) => a.startsWith('--limit'));
const LIMIT = limitArg
  ? parseInt(limitArg.split('=')[1] ?? process.argv[process.argv.indexOf('--limit') + 1], 10)
  : parseInt(process.env.BUDGET_ENRICH_LIMIT ?? '0', 10) || null;

async function main() {
  if (!existsSync(BUNDLE)) {
    console.error('Missing bundle. Run: npm run travel:demo:build');
    process.exit(1);
  }

  const indexes = loadCostOfLivingIndexes();
  if (!indexes.sources.length) {
    console.error(`No CSV found in ${COL_DIR}`);
    process.exit(1);
  }

  const bundle = JSON.parse(readFileSync(BUNDLE, 'utf8'));
  const destinos = bundle.destinos ?? [];
  const slice = LIMIT ? destinos.slice(0, LIMIT) : destinos;

  const stats = { cidade: 0, pais: 0, continente: 0, global: 0 };

  console.log(
    `Orçamentos (offline, 100% cobertura) — ${slice.length} destinos\n` +
      `  Fontes: ${indexes.sources.join(', ')}\n` +
      `  Cidades: ${indexes.cities.size} | Países (CSV+média): ${indexes.countries.size}\n`,
  );

  for (const dest of slice) {
    const budget = resolveBudgetForDestination(indexes, dest);
    dest.custo_de_vida = budget;
    const n = budget.nivel;
    if (n === 'cidade') stats.cidade += 1;
    else if (n === 'pais') stats.pais += 1;
    else if (n === 'continente') stats.continente += 1;
    else stats.global += 1;
    process.stdout.write('.');
  }

  writeFileSync(BUNDLE, JSON.stringify(bundle));

  console.log(
    `\n\nGuardado: ${BUNDLE}\n` +
      `  Cidade (preços reais / fuzzy): ${stats.cidade}\n` +
      `  País (índice × localidade): ${stats.pais}\n` +
      `  Continente (estimativa): ${stats.continente}\n` +
      `  Global (estimativa): ${stats.global}\n` +
      `  Total com orçamento: ${slice.length}`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
