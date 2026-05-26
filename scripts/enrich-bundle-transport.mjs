/**
 * Enriquece bundle-wikivoyage.json com aeroportos e rotas (CSV offline).
 *
 *   npm run travel:demo:enrich-transport
 *   npm run travel:demo:enrich-transport -- --limit 500
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { resolveTransportForDestination } from './lib/destination-transport.mjs';
import { loadTransportIndexes, TRANSPORT_DIR } from './lib/transport-data.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const BUNDLE = resolve(ROOT, 'src/data/travel-mock/bundle-wikivoyage.json');

const limitArg = process.argv.find((a) => a.startsWith('--limit'));
const LIMIT = limitArg
  ? parseInt(limitArg.split('=')[1] ?? process.argv[process.argv.indexOf('--limit') + 1], 10)
  : parseInt(process.env.TRANSPORT_ENRICH_LIMIT ?? '0', 10) || null;

async function main() {
  if (!existsSync(BUNDLE)) {
    console.error('Missing bundle. Run: npm run travel:demo:build');
    process.exit(1);
  }

  const indexes = loadTransportIndexes();
  if (!indexes.byIata.size) {
    console.error(`No airports loaded from ${TRANSPORT_DIR}`);
    process.exit(1);
  }

  const bundle = JSON.parse(readFileSync(BUNDLE, 'utf8'));
  const destinos = bundle.destinos ?? [];
  const slice = LIMIT ? destinos.slice(0, LIMIT) : destinos;

  const stats = { iata: 0, cidade: 0, proximo: 0, pais: 0, sem: 0, com_rotas: 0 };

  console.log(
    `Transporte (offline) — ${slice.length} destinos\n` +
      `  Fontes: ${indexes.sources.join(', ')}\n` +
      `  Aeroportos IATA: ${indexes.byIata.size} | Rotas (origens): ${indexes.routesFrom.size}\n`,
  );

  for (const dest of slice) {
    const transport = resolveTransportForDestination(indexes, dest);
    if (transport) {
      dest.transporte = transport;
      const m = transport.aeroporto.match;
      if (m === 'iata') stats.iata += 1;
      else if (m === 'cidade') stats.cidade += 1;
      else if (m === 'proximo') stats.proximo += 1;
      else if (m === 'pais') stats.pais += 1;
      if ((transport.rede?.ligacoes_diretas ?? 0) > 0) stats.com_rotas += 1;
    } else {
      stats.sem += 1;
    }
    process.stdout.write('.');
  }

  writeFileSync(BUNDLE, JSON.stringify(bundle));

  console.log(
    `\n\nGuardado: ${BUNDLE}\n` +
      `  Match IATA direto: ${stats.iata}\n` +
      `  Match cidade: ${stats.cidade}\n` +
      `  Aeroporto mais próximo: ${stats.proximo}\n` +
      `  Hub país: ${stats.pais}\n` +
      `  Com ligações diretas (OpenFlights): ${stats.com_rotas}\n` +
      `  Sem dados: ${stats.sem}\n` +
      `  Total enriquecidos: ${slice.length - stats.sem}`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
