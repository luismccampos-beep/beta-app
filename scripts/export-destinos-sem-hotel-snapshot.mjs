/**
 * Exporta lista de destinos para pesquisa wiki (sem hotel ou só synthetic/liteapi).
 *
 *   npm run travel:export:destinos-sem-hotel-snapshot
 *   npm run travel:export:destinos-sem-hotel-snapshot -- --weak-hotels
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const BUNDLE = resolve(ROOT, 'src/data/travel-mock/bundle-wikivoyage.json');
const OUT = resolve(ROOT, 'data/hotels/destinos-sem-hotel-949.txt');

const weakOnly = process.argv.includes('--weak-hotels');

function main() {
  if (!existsSync(BUNDLE)) {
    console.error('Missing bundle');
    process.exit(1);
  }
  const bundle = JSON.parse(readFileSync(BUNDLE, 'utf8'));
  const countByDest = new Map();
  const fontesByDest = new Map();
  const weakFontes = new Set(['synthetic', 'liteapi']);

  for (const h of bundle.hoteis ?? []) {
    countByDest.set(h.destino_id, (countByDest.get(h.destino_id) ?? 0) + 1);
    const f = h.fonte ?? h.source ?? '';
    if (!fontesByDest.has(h.destino_id)) fontesByDest.set(h.destino_id, []);
    fontesByDest.get(h.destino_id).push(f);
  }

  const destinos = bundle.destinos.filter((d) => {
    const n = countByDest.get(d.id) ?? 0;
    if (weakOnly) {
      if (n === 0) return false;
      const fonts = fontesByDest.get(d.id) ?? [];
      return fonts.every((f) => weakFontes.has(f));
    }
    return n === 0;
  });

  const lines = [
    `# ${destinos.length} destinos (${weakOnly ? 'só synthetic/liteapi' : 'sem hotel'})`,
    '# nome\tpais\tcontinente\tid',
    ...destinos
      .sort((a, b) => (a.pais ?? '').localeCompare(b.pais ?? '', 'pt') || (a.nome ?? '').localeCompare(b.nome ?? '', 'pt'))
      .map((d) => `${d.nome}\t${d.pais}\t${d.continente ?? ''}\t${d.id}`),
  ];
  writeFileSync(OUT, lines.join('\n'), 'utf8');
  console.log(`Wrote ${OUT} (${destinos.length} linhas)`);
}

main();
