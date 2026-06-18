/**
 * Enriquece bundle-wikivoyage.json com clima actual via OpenWeather API.
 *
 *   $env:OPENWEATHER_API_KEY="your-key"; npm run travel:demo:enrich-weather
 *   $env:OPENWEATHER_API_KEY="your-key"; npm run travel:demo:enrich-weather -- --limit 50
 *
 * A API gratuita permite 60 pedidos/min (Current Weather).
 * Usa o endpoint /data/2.5/weather?lat={lat}&lon={lon}&units=metric&lang=pt
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { loadProjectEnv } from './lib/load-env.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const BUNDLE = resolve(ROOT, 'src/data/travel-mock/bundle-wikivoyage.json');

loadProjectEnv(ROOT);

const API_KEY = process.env.OPENWEATHER_API_KEY?.trim();
const LIMIT = parseInt(
  process.env.WEATHER_ENRICH_LIMIT ??
    (process.argv.find((a) => a.startsWith('--limit'))
      ? process.argv[process.argv.indexOf('--limit') + 1]
      : '0'),
  10,
) || null;

const OW_BASE = 'https://api.openweathermap.org/data/2.5/weather';

async function fetchWeather(lat, lon) {
  const url = `${OW_BASE}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=pt`;
  const res = await fetch(url);
  if (!res.ok) {
    if (res.status === 401) {
      console.error('  OpenWeather API key inválida. Verifica OPENWEATHER_API_KEY.');
      return null;
    }
    if (res.status === 429) {
      console.error('  Rate limit OpenWeather. Espera 1 minuto e tenta de novo.');
      return null;
    }
    return null;
  }
  const data = await res.json();
  return {
    descricao: data.weather?.[0]?.description ?? null,
    temperatura_c: data.main?.temp ?? null,
    sensacao_c: data.main?.feels_like ?? null,
    humidade_pct: data.main?.humidity ?? null,
    atualizado: new Date().toISOString(),
  };
}

async function main() {
  if (!API_KEY) {
    console.error(
      'Define OPENWEATHER_API_KEY no .env.local.\n' +
        '  https://home.openweathermap.org/api_keys (gratuito: 60/min)',
    );
    process.exit(1);
  }

  if (!existsSync(BUNDLE)) {
    console.error('Missing bundle. Run: npm run travel:demo:build');
    process.exit(1);
  }

  const bundle = JSON.parse(readFileSync(BUNDLE, 'utf8'));
  const destinos = bundle.destinos ?? [];

  // Filtrar destinos com coordenadas
  const candidates = destinos.filter((d) => d.latitude != null && d.longitude != null);
  const slice = LIMIT ? candidates.slice(0, LIMIT) : candidates;

  console.log(
    `OpenWeather enrich — ${slice.length} destinos (${candidates.length} com coordenadas, ${destinos.length} total)\n` +
      `  API: OpenWeather Current Weather (gratuito)\n` +
      `  limit=${LIMIT ?? 'todos'}\n`,
  );

  let updated = 0;
  let failed = 0;

  for (const dest of slice) {
    const clima = await fetchWeather(dest.latitude, dest.longitude);
    if (clima) {
      dest.clima_tempo = clima;
      updated += 1;
      process.stdout.write(`  ✓ ${dest.nome}: ${Math.round(clima.temperatura_c ?? 0)}°C, ${clima.descricao}\n`);
    } else {
      failed += 1;
      process.stdout.write(`  – ${dest.nome} (sem dados)\n`);
    }

    // Respeitar rate limit: 1 pedido/segundo (60/min)
    await new Promise((r) => setTimeout(r, 1100));

    // Guardar progresso a cada 10
    if (updated % 10 === 0 && updated > 0) {
      writeFileSync(BUNDLE, JSON.stringify(bundle));
    }
  }

  writeFileSync(BUNDLE, JSON.stringify(bundle));

  console.log(
    `\nGuardado: ${BUNDLE}\n` +
      `  Clima actualizado: ${updated} | Sem dados: ${failed}\n` +
      `  Total no bundle: ${destinos.length}`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
