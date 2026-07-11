/**
 * Reconstrói voos mock no bundle apenas para rotas existentes em routes.csv (OpenFlights).
 *
 *   npm run travel:demo:rebuild-flights
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { estimateFlightPriceEur } from './lib/flight-price-indicative.mjs';
import { loadTransportIndexes } from './lib/transport-data.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BUNDLE = resolve(__dirname, '../src/data/travel-mock/bundle-wikivoyage.json');

const ORIGENS_VOO = ['LIS', 'OPO', 'FNC', 'PDL', 'MAD', 'BCN', 'LHR', 'CDG', 'FRA', 'AMS', 'FCO', 'DUB'];
const AIRLINES = [
  'TAP Air Portugal',
  'Ryanair',
  'easyJet',
  'Iberia',
  'Vueling',
  'Lufthansa',
  'Air France',
  'British Airways',
  'KLM',
  'ITA Airways',
];

function estimateDurationMinutes(originAp, destAp) {
  if (!originAp || !destAp) return 120;
  const lat1 = originAp.lat;
  const lon1 = originAp.lon;
  const lat2 = destAp.lat;
  const lon2 = destAp.lon;
  const km =
    Math.acos(
      Math.min(
        1,
        Math.sin((lat1 * Math.PI) / 180) * Math.sin((lat2 * Math.PI) / 180) +
          Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.cos(((lon2 - lon1) * Math.PI) / 180),
      ),
    ) * 6371;
  return Math.max(45, Math.round((km / 800) * 60 + 35));
}

function main() {
  if (!existsSync(BUNDLE)) {
    console.error('Missing bundle');
    process.exit(1);
  }

  const indexes = loadTransportIndexes();
  const { routesFrom, byIata } = indexes;
  const bundle = JSON.parse(readFileSync(BUNDLE, 'utf8'));
  const destinos = bundle.destinos ?? [];

  const destByIata = new Map();
  for (const d of destinos) {
    const iata = d.iata ?? d.transporte?.aeroporto?.iata;
    if (iata) destByIata.set(String(iata).toUpperCase(), d);
  }

  const voos = [];
  let flightId = 0;
  let routesOk = 0;
  let skipped = 0;

  for (const origem of ORIGENS_VOO) {
    const fromRoutes = routesFrom.get(origem);
    if (!fromRoutes) continue;
    const originAp = byIata.get(origem);

    for (const destIata of fromRoutes.destinations) {
      const dest = destByIata.get(destIata);
      if (!dest) {
        skipped += 1;
        continue;
      }
      const destAp = byIata.get(destIata);
      const preco = estimateFlightPriceEur(originAp ?? null, destAp ?? null, { direct: true });
      const dur = estimateDurationMinutes(originAp, destAp);
      flightId += 1;
      routesOk += 1;
      voos.push({
        id: flightId,
        origem,
        destino_id: dest.id,
        destino_iata: destIata,
        preco,
        duracao_minutos: dur,
        companhia: AIRLINES[flightId % AIRLINES.length],
        cabin_class: 'economy',
        escalas: 0,
        fonte_rota: 'OpenFlights',
      });
    }
  }

  bundle.voos = voos;
  writeFileSync(BUNDLE, JSON.stringify(bundle));

  console.log(
    `Voos mock (rotas OpenFlights)\n` +
      `  Voos criados: ${voos.length}\n` +
      `  Destinos sem match no bundle: ${skipped}\n` +
      `  Guardado: ${BUNDLE}`,
  );
}

main();
