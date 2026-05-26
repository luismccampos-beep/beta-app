/**
 * Corrige `pais` / `paisCode` / `continente` no bundle sem rebuild completo.
 *
 *   npm run travel:demo:patch-countries
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { COUNTRY_META, inferCountryFromDestination } from './lib/city-country-lookup.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BUNDLE = resolve(__dirname, '../src/data/travel-mock/bundle-wikivoyage.json');

const limitArg = process.argv.find((a) => a.startsWith('--limit'));
const LIMIT = limitArg
  ? parseInt(limitArg.split('=')[1] ?? process.argv[process.argv.indexOf('--limit') + 1], 10)
  : 0;

function main() {
  if (!existsSync(BUNDLE)) {
    console.error('Missing bundle');
    process.exit(1);
  }

  const bundle = JSON.parse(readFileSync(BUNDLE, 'utf8'));
  const destinos = bundle.destinos ?? [];
  const slice = LIMIT ? destinos.slice(0, LIMIT) : destinos;

  let updated = 0;
  let codeSynced = 0;
  let internacionalBefore = 0;

  for (const dest of slice) {
    if (dest.pais === 'Internacional') internacionalBefore += 1;

    if (dest.pais && dest.pais !== 'Internacional' && COUNTRY_META[dest.pais]) {
      const meta = COUNTRY_META[dest.pais];
      if (meta.code !== dest.paisCode || meta.continent !== dest.continente) {
        dest.paisCode = meta.code;
        dest.continente = meta.continent;
        codeSynced += 1;
      }
    }

    const inferred = inferCountryFromDestination(
      dest.nome,
      dest.descricaoCompleta ?? dest.descricao ?? '',
      dest.lang ?? 'pt',
    );

    const shouldPatch =
      dest.pais === 'Internacional' ||
      dest.paisCode === 'XX' ||
      !dest.paisCode ||
      dest.paisCode.length < 2 ||
      (dest.pais === 'Portugal' && dest.lang === 'en' && inferred.name !== 'Portugal') ||
      (dest.pais === 'Reino Unido' && inferred.name === 'Brasil');

    if (!shouldPatch && dest.pais === inferred.name) continue;

    if (inferred.name !== dest.pais || inferred.code !== dest.paisCode) {
      dest.pais = inferred.name;
      dest.paisCode = inferred.code;
      dest.continente = inferred.continent;
      updated += 1;
    }
  }

  writeFileSync(BUNDLE, JSON.stringify(bundle));

  const intAfter = slice.filter((d) => d.pais === 'Internacional').length;
  console.log(
    `Países corrigidos: ${updated} / ${slice.length} (códigos ISO sincronizados: ${codeSynced})\n` +
      `  Internacional antes: ${internacionalBefore} → depois: ${intAfter}\n` +
      `  Guardado: ${BUNDLE}`,
  );
}

main();
