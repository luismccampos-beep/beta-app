/**
 * Enriquece bundle-wikivoyage.json com Wikipedia e clima (OpenWeather).
 * Tudo offline no JSON — a app lê do bundle sem APIs em tempo real.
 *
 *   npm run travel:demo:enrich-external
 *   npm run travel:demo:enrich-external -- --limit 50 --only wikipedia
 *
 * Env (.env.local):
 *   OPENWEATHER_API_KEY=
 */
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { loadProjectEnv } from './lib/load-env.mjs';
import {
  fetchOpenWeatherSnapshot,
  fetchWikipediaSummary,
  geocodeDestination,
  sleep,
  wikipediaTitleFromDestination,
} from './lib/external-enrichment.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const BUNDLE = resolve(ROOT, 'src/data/travel-mock/bundle-wikivoyage.json');
const GEO_CACHE = resolve(ROOT, 'src/data/travel-mock/geocode-cache.json');

loadProjectEnv(ROOT);

const OPENWEATHER_KEY = process.env.OPENWEATHER_API_KEY?.trim();

const limitArg = process.argv.find((a) => a.startsWith('--limit'));
const LIMIT = limitArg
  ? parseInt(limitArg.split('=')[1] ?? process.argv[process.argv.indexOf('--limit') + 1], 10)
  : parseInt(process.env.EXTERNAL_ENRICH_LIMIT ?? '200', 10);

const onlyIdx = process.argv.indexOf('--only');
const ONLY = onlyIdx >= 0 ? process.argv[onlyIdx + 1]?.split(',') ?? [] : null;

function shouldRun(name) {
  if (!ONLY?.length) return true;
  return ONLY.includes(name);
}

function loadGeoCache() {
  if (!existsSync(GEO_CACHE)) return {};
  try {
    return JSON.parse(readFileSync(GEO_CACHE, 'utf8'));
  } catch {
    return {};
  }
}

function saveGeoCache(cache) {
  mkdirSync(dirname(GEO_CACHE), { recursive: true });
  writeFileSync(GEO_CACHE, JSON.stringify(cache, null, 2));
}

async function resolveCoords(dest, cache) {
  if (dest.latitude != null && dest.longitude != null) {
    return { lat: dest.latitude, lon: dest.longitude };
  }
  const leaf = dest.nome.split('/')[0];
  const key = `${dest.pais}|${leaf}`.toLowerCase();
  if (cache[key]) return cache[key];

  const query = [leaf, dest.pais !== 'Internacional' ? dest.pais : ''].filter(Boolean).join(', ');
  const geo = await geocodeDestination(query);
  await sleep(1100);
  if (geo) {
    cache[key] = { lat: geo.lat, lon: geo.lon };
    return cache[key];
  }
  return null;
}

async function main() {
  if (!existsSync(BUNDLE)) {
    console.error('Missing bundle. Run: npm run travel:demo:build');
    process.exit(1);
  }

  const bundle = JSON.parse(readFileSync(BUNDLE, 'utf8'));
  const destinos = bundle.destinos ?? [];
  const slice = destinos.slice(0, LIMIT);
  const geoCache = loadGeoCache();

  let wikiOk = 0;
  let weatherOk = 0;

  console.log(
    `Enriquecimento externo — ${slice.length} destinos\n` +
      `  Wikipedia: ${shouldRun('wikipedia') ? 'sim' : 'não'}\n` +
      `  OpenWeather: ${shouldRun('weather') && OPENWEATHER_KEY ? 'sim' : 'não (chave ou --only)'}\n`,
  );

  for (const dest of slice) {
    const lang = dest.lang ?? 'pt';

    if (shouldRun('wikipedia')) {
      const title = wikipediaTitleFromDestination(dest.nome);
      const wiki = await fetchWikipediaSummary(title, lang);
      if (wiki) {
        dest.wikipedia_resumo = wiki.resumo;
        dest.wikipedia_url = wiki.url;
        wikiOk += 1;
      }
      await sleep(200);
    }

    if (shouldRun('weather') && OPENWEATHER_KEY) {
      const coords = await resolveCoords(dest, geoCache);
      if (coords) {
        dest.latitude = coords.lat;
        dest.longitude = coords.lon;
        const clima = await fetchOpenWeatherSnapshot(coords.lat, coords.lon, OPENWEATHER_KEY);
        if (clima) {
          dest.clima_tempo = clima;
          weatherOk += 1;
        }
        await sleep(300);
      }
    }

    process.stdout.write('.');
  }

  saveGeoCache(geoCache);
  writeFileSync(BUNDLE, JSON.stringify(bundle));

  console.log(
    `\n\nGuardado: ${BUNDLE}\n` +
      `  Wikipedia: ${wikiOk}\n` +
      `  Clima (snapshot): ${weatherOk}\n` +
      `  Geocode cache: ${GEO_CACHE}`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
