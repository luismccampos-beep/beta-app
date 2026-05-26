/**
 * Resolve aeroporto + rede de rotas para um destino Wikivoyage.
 */
import { equipmentLabel, loadAircraftNames } from './aircraft-types.mjs';
import { isoFromPais } from './city-country-lookup.mjs';
import { estimateFlightPriceEur } from './flight-price-indicative.mjs';
import {
  DEMO_ORIGIN_HUBS,
  countryHubAirport,
  haversineKm,
  lookupAirportByCity,
  lookupAirportGlobal,
  nearestAirportInCountry,
  nearestMajorAirport,
  sortIatasByAirportRank,
} from './transport-data.mjs';

/**
 * @param {object} dest
 */
function resolveIsoCountry(dest) {
  let code = isoFromPais(dest.pais, dest.paisCode);
  if (!code && dest.transporte?.aeroporto?.pais_code) {
    code = String(dest.transporte.aeroporto.pais_code).toUpperCase();
  }
  return code;
}

/**
 * @param {ReturnType<import('./transport-data.mjs').loadTransportIndexes>} indexes
 * @param {object} dest
 */
export function resolveTransportForDestination(indexes, dest) {
  const { byIata, byCountry, byCityKey, byCityOnly, majorAirports, routesFrom, routeEquipment } =
    indexes;
  if (!byIata.size) return null;

  const aircraftNames = loadAircraftNames();
  const paisCode = resolveIsoCountry(dest);
  let resolved = null;
  let distancia_km = undefined;

  if (dest.iata) {
    const airport = byIata.get(String(dest.iata).toUpperCase()) ?? null;
    if (airport) resolved = { airport, match: 'iata', score: 1 };
  }

  if (!resolved && paisCode) {
    resolved = lookupAirportByCity(byCityKey, byCountry, dest.nome ?? '', paisCode);
  }

  if (!resolved) {
    resolved = lookupAirportGlobal(byCityOnly, dest.nome ?? '');
  }

  if (!resolved && dest.latitude != null && dest.longitude != null) {
    if (paisCode) {
      resolved = nearestAirportInCountry(
        byIata,
        byCountry,
        dest.latitude,
        dest.longitude,
        paisCode,
      );
    } else {
      resolved = nearestMajorAirport(majorAirports, dest.latitude, dest.longitude);
    }
    if (resolved?.distancia_km != null) distancia_km = resolved.distancia_km;
  }

  if (!resolved && paisCode) {
    resolved = countryHubAirport(byCountry, paisCode);
  }

  if (!resolved?.airport) return null;

  const airport = resolved.airport;
  const match = resolved.match;
  if (resolved.distancia_km != null) distancia_km = resolved.distancia_km;

  if (
    distancia_km == null &&
    dest.latitude != null &&
    dest.longitude != null &&
    match !== 'iata'
  ) {
    distancia_km = Math.round(
      haversineKm(dest.latitude, dest.longitude, airport.lat, airport.lon),
    );
  }

  const routeInfo = routesFrom.get(airport.iata);
  const ligacoes_diretas = routeInfo?.destinations.size ?? 0;
  const rotas_registadas = routeInfo?.count ?? 0;

  const outgoingIatas = sortIatasByAirportRank(
    [...(routeInfo?.destinations ?? [])],
    byIata,
  ).slice(0, 20);

  const top_destinos = outgoingIatas.map((iata) => ({
    iata,
    nome: byIata.get(iata)?.name ?? iata,
  }));

  const hubs_com_ligacao = [];
  /** @type {Record<string, boolean>} */
  const ligacoes_desde_hubs = {};
  /** @type {Record<string, number>} */
  const preco_indicativo_desde = {};

  for (const hub of DEMO_ORIGIN_HUBS) {
    const fromHub = routesFrom.get(hub);
    const direct = fromHub?.destinations.has(airport.iata) ?? false;
    ligacoes_desde_hubs[hub] = direct;
    if (direct) {
      hubs_com_ligacao.push(hub);
      const originAp = byIata.get(hub);
      preco_indicativo_desde[hub] = estimateFlightPriceEur(originAp ?? null, airport, {
        direct: true,
      });
    }
  }

  /** Equipamento mais frequente nas rotas para este aeroporto (amostra). */
  const equipCount = new Map();
  for (const hub of hubs_com_ligacao.slice(0, 5)) {
    const set = routeEquipment.get(`${hub}-${airport.iata}`);
    if (!set) continue;
    for (const code of set) {
      equipCount.set(code, (equipCount.get(code) ?? 0) + 1);
    }
  }
  const aeronaves_frequentes = [...equipCount.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([code, n]) => ({
      code,
      nome: equipmentLabel(code, aircraftNames),
      rotas: n,
    }));

  if (!dest.iata && airport.iata) {
    dest.iata = airport.iata;
  }
  if ((!dest.paisCode || dest.paisCode === 'XX') && airport.iso_country) {
    dest.paisCode = airport.iso_country;
  }

  return {
    fonte: 'OurAirports + OpenFlights (offline)',
    aeroporto: {
      iata: airport.iata,
      nome: airport.name,
      tipo: airport.type,
      municipio: airport.municipality || undefined,
      pais_code: airport.iso_country,
      lat: airport.lat,
      lon: airport.lon,
      scheduled_service: airport.scheduled_service,
      distancia_km: distancia_km && distancia_km > 0 ? distancia_km : undefined,
      match,
    },
    rede: {
      ligacoes_diretas,
      rotas_registadas,
      hubs_com_ligacao: hubs_com_ligacao.slice(0, 8),
      ligacoes_desde_hubs,
      top_destinos,
      preco_indicativo_desde,
      aeronaves_frequentes,
    },
  };
}
