import { extractIataCodesFromDestinationLabels } from './buildResultsQuery';
import type { CompactTravelPreferences } from './preference-match';

export type TransportRede = {
  ligacoes_diretas?: number;
  hubs_com_ligacao?: string[];
  ligacoes_desde_hubs?: Record<string, boolean>;
  top_destinos?: { iata: string; nome: string }[];
  preco_indicativo_desde?: Record<string, number>;
  aeronaves_frequentes?: { code: string; nome: string; rotas?: number }[];
};

const DEFAULT_ORIGINS = ['LIS', 'OPO', 'MAD', 'BCN'];

/** Aeroporto de origem: query → preferências → env → LIS. */
export function resolveOriginIata(
  originParam?: string | null,
  prefs?: CompactTravelPreferences | null,
): string {
  const fromQuery = originParam?.trim().toUpperCase();
  if (fromQuery && /^[A-Z0-9]{3}$/.test(fromQuery)) return fromQuery;

  const fromPrefs = extractIataCodesFromDestinationLabels(prefs?.preferredDestinations ?? []);
  if (fromPrefs[0]) return fromPrefs[0];

  const env = process.env.NEXT_PUBLIC_DEFAULT_ORIGIN_IATA?.trim().toUpperCase();
  if (env && /^[A-Z0-9]{3}$/.test(env)) return env;

  return 'LIS';
}

export function isDirectFromOrigin(rede: TransportRede | undefined, origin: string): boolean {
  if (!rede) return false;
  const o = origin.toUpperCase();
  if (rede.ligacoes_desde_hubs?.[o] === true) return true;
  return rede.hubs_com_ligacao?.includes(o) ?? false;
}

export function indicativePriceFromOrigin(
  rede: TransportRede | undefined,
  origin: string,
): number | undefined {
  const o = origin.toUpperCase();
  return rede?.preco_indicativo_desde?.[o];
}

/** Origem a partir da query string de resultados (`rq`). */
export function originFromResultsQuery(rq: string | null | undefined): string | null {
  if (!rq?.trim()) return null;
  try {
    const o = new URLSearchParams(rq).get('origin')?.trim().toUpperCase();
    return o && /^[A-Z0-9]{3}$/.test(o) ? o : null;
  } catch {
    return null;
  }
}

export { DEFAULT_ORIGINS };
