import {
  indicativePriceFromOrigin,
  isDirectFromOrigin,
  resolveOriginIata,
} from './flight-connectivity';
import type { MockDestination } from './mock-travel/types';

export type AirportSummary = {
  iata: string;
  distanciaKm?: number;
  /** Primeiro hub com voo direto (ex. LIS). */
  hubFrom?: string;
  /** Preço indicativo ida (EUR) desde origem do utilizador. */
  indicativePriceEur?: number;
  directFromOrigin?: boolean;
};

export function summarizeAirport(
  dest?: MockDestination | null,
  fallbackIata?: string | null,
  originIata?: string | null,
): AirportSummary | null {
  const origin = resolveOriginIata(originIata, null);
  const rede = dest?.transporte?.rede;
  const ap = dest?.transporte?.aeroporto;

  if (ap?.iata) {
    return {
      iata: ap.iata,
      distanciaKm: ap.distancia_km,
      hubFrom: rede?.hubs_com_ligacao?.[0],
      indicativePriceEur: indicativePriceFromOrigin(rede, origin),
      directFromOrigin: isDirectFromOrigin(rede, origin),
    };
  }
  const code = dest?.iata ?? fallbackIata;
  if (code) return { iata: code.toUpperCase() };
  return null;
}
