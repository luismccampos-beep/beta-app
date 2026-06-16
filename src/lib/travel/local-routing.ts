/**
 * Local routing for demo: OTP (transit) + Valhalla (street) — TripGo cloud only as fallback.
 * Extended with Navitia.io and Transit.land as additional transit providers.
 */

import type { TripGoTripPlan } from './tripgo';
import { fetchTripGoRouting, isTripGoConfigured } from './tripgo';
import { fetchOtpPlan, isOtpConfigured } from './opentripplanner';
import {
  fetchValhallaRoute,
  isValhallaConfigured,
  type ValhallaCosting,
} from './valhalla';
import { fetchNavitiaJourney, isNavitiaConfigured, getNavitiaApiKey } from './navitia';
import {
  fetchTransitLandRouting,
  isTransitLandConfigured,
  getTransitLandApiKey,
} from './transitland';
import {
  fetchTransitousRouting,
  isTransitousConfigured,
} from './transitous';

export type LocalRoutingProvider = 'otp' | 'valhalla' | 'tripgo' | 'navitia' | 'transitland' | 'transitous';

/** UI / API routing mode */
export type LocalRoutingMode = 'transit' | ValhallaCosting;

export type LocalRoutingInput = {
  from: { lat: number; lon: number };
  to: { lat: number; lon: number };
  mode?: LocalRoutingMode;
  /** @deprecated use mode */
  costing?: ValhallaCosting;
  tripGoModes?: string;
  departAfter?: number;
  locale?: string;
  localOnly?: boolean;
};

export type LocalRoutingResult = {
  plans: TripGoTripPlan[];
  provider: LocalRoutingProvider | null;
  configured: boolean;
  error?: string;
};

function resolveMode(input: LocalRoutingInput): LocalRoutingMode {
  if (input.mode) return input.mode;
  return input.costing ?? 'auto';
}

function isLocalOnly(input: LocalRoutingInput): boolean {
  if (input.localOnly != null) return input.localOnly;
  const flag =
    process.env.TRAVEL_ROUTING_LOCAL_ONLY?.trim().toLowerCase() === 'true' ||
    process.env.TRAVEL_ROUTING_VALHALLA_ONLY?.trim().toLowerCase() === 'true';
  return flag;
}

export function isLocalRoutingConfigured(): boolean {
  return isOtpConfigured() || isValhallaConfigured() || isTripGoConfigured() || isNavitiaConfigured() || isTransitLandConfigured() || isTransitousConfigured();
}

function logProviderFallback(from: LocalRoutingProvider, to: LocalRoutingProvider, reason: string): void {
  if (process.env.NODE_ENV !== 'test') {
    console.debug(`[routing] ${from} → ${to}: ${reason}`);
  }
}

export function preferredLocalRoutingProvider(mode?: LocalRoutingMode): LocalRoutingProvider | null {
  if (mode === 'transit') {
    if (isOtpConfigured()) return 'otp';
    if (isNavitiaConfigured()) return 'navitia';
    if (isTransitLandConfigured()) return 'transitland';
    if (isTransitousConfigured()) return 'transitous';
    if (!isLocalOnly({ from: { lat: 0, lon: 0 }, to: { lat: 0, lon: 0 } }) && isTripGoConfigured()) {
      return 'tripgo';
    }
    return null;
  }
  if (isValhallaConfigured()) return 'valhalla';
  if (!isLocalOnly({ from: { lat: 0, lon: 0 }, to: { lat: 0, lon: 0 } }) && isTripGoConfigured()) {
    return 'tripgo';
  }
  if (isOtpConfigured()) return 'otp';
  if (isNavitiaConfigured()) return 'navitia';
  if (isTransitLandConfigured()) return 'transitland';
  if (isTransitousConfigured()) return 'transitous';
  return null;
}

/**
 * OTP for transit; Valhalla for car/walk/bike; TripGo only if localOnly is false.
 */
export async function fetchLocalRouting(input: LocalRoutingInput): Promise<LocalRoutingResult> {
  const mode = resolveMode(input);
  const localOnly = isLocalOnly(input);

  if (mode === 'transit') {
    // Attempt providers in priority order: OTP → Navitia → Transit.land → TripGo
    if (isOtpConfigured()) {
      const otp = await fetchOtpPlan({
        from: input.from,
        to: input.to,
        departAfter: input.departAfter,
        locale: input.locale,
      });
      if (otp.plans.length) {
        return { plans: otp.plans, provider: 'otp', configured: true };
      }
      if (localOnly) {
        return {
          plans: [],
          provider: 'otp',
          configured: true,
          error: otp.error ?? 'OTP returned no transit itineraries',
        };
      }
    }

    // Navitia.io (cloud API with free tier)
    const navitiaKey = getNavitiaApiKey();
    if (navitiaKey && !localOnly) {
      try {
        const nav = await fetchNavitiaJourney(navitiaKey, {
          from: input.from,
          to: input.to,
          datetime: input.departAfter ? new Date(input.departAfter * 1000).toISOString().slice(0, 16) : undefined,
          locale: input.locale,
        });
        if (nav.plans.length) {
          return { plans: nav.plans, provider: 'navitia', configured: true };
        }
        logProviderFallback('navitia', 'transitland', nav.error ?? 'no plans');
      } catch (e) {
        logProviderFallback('navitia', 'transitland', e instanceof Error ? e.message : 'unknown');
      }
    }

    // Transit.land (cloud API with free tier)
    const transitLandKey = getTransitLandApiKey();
    if (transitLandKey && !localOnly) {
      try {
        const tl = await fetchTransitLandRouting(transitLandKey, {
          from: input.from,
          to: input.to,
          departAfter: input.departAfter,
          locale: input.locale,
        });
        if (tl.plans.length) {
          return { plans: tl.plans, provider: 'transitland', configured: true };
        }
        logProviderFallback('transitland', 'transitous', tl.error ?? 'no plans');
      } catch (e) {
        logProviderFallback('transitland', 'transitous', e instanceof Error ? e.message : 'unknown');
      }
    }

    // Transitous (free, no API key needed — always available)
    if (!localOnly) {
      try {
        const tt = await fetchTransitousRouting('', {
          from: input.from,
          to: input.to,
          departAfter: input.departAfter,
          locale: input.locale,
        });
        if (tt.plans.length) {
          return { plans: tt.plans, provider: 'transitous', configured: true };
        }
        logProviderFallback('transitous', 'tripgo', tt.error ?? 'no plans');
      } catch (e) {
        logProviderFallback('transitous', 'tripgo', e instanceof Error ? e.message : 'unknown');
      }
    }

    // TripGo (final fallback)
    const tripGoKey = process.env.TRIPGO_API_KEY?.trim();
    if (tripGoKey) {
      try {
        const tg = await fetchTripGoRouting(tripGoKey, {
          from: input.from,
          to: input.to,
          departAfter: input.departAfter,
          modes: input.tripGoModes ?? 'pt_pub_wa_wal',
          locale: input.locale,
        });
        if (tg.plans.length) {
          return { plans: tg.plans, provider: 'tripgo', configured: true, error: tg.error };
        }
        return {
          plans: [],
          provider: 'tripgo',
          configured: true,
          error: tg.error ?? 'No TripGo itineraries',
        };
      } catch (e: unknown) {
        return {
          plans: [],
          provider: 'tripgo',
          configured: true,
          error: e instanceof Error ? e.message : 'TripGo failed',
        };
      }
    }

    return {
      plans: [],
      provider: null,
      configured: false,
      error: 'Transit: configure OTP_BASE_URL, NAVITIA_API_KEY, TRANSITLAND_API_KEY, or TRIPGO_API_KEY',
    };
  }

  if (isValhallaConfigured()) {
    const v = await fetchValhallaRoute({
      from: input.from,
      to: input.to,
      costing: mode,
      locale: input.locale,
    });
    if (v.plans.length) {
      return { plans: v.plans, provider: 'valhalla', configured: true };
    }
    if (localOnly) {
      return {
        plans: [],
        provider: 'valhalla',
        configured: true,
        error: v.error ?? 'Valhalla returned no route',
      };
    }
  }

  if (localOnly) {
    return {
      plans: [],
      provider: null,
      configured: isValhallaConfigured() || isOtpConfigured(),
      error: isValhallaConfigured()
        ? 'Valhalla returned no route'
        : 'Valhalla not configured (VALHALLA_BASE_URL + docker compose up valhalla)',
    };
  }

  const tripGoKey = process.env.TRIPGO_API_KEY?.trim();
  if (tripGoKey) {
    try {
      const tg = await fetchTripGoRouting(tripGoKey, {
        from: input.from,
        to: input.to,
        departAfter: input.departAfter,
        modes: input.tripGoModes,
        locale: input.locale,
      });
      if (tg.plans.length) {
        return { plans: tg.plans, provider: 'tripgo', configured: true, error: tg.error };
      }
      return {
        plans: [],
        provider: 'tripgo',
        configured: true,
        error: tg.error ?? 'No TripGo itineraries',
      };
    } catch (e: unknown) {
      return {
        plans: [],
        provider: 'tripgo',
        configured: true,
        error: e instanceof Error ? e.message : 'TripGo failed',
      };
    }
  }

  return {
    plans: [],
    provider: null,
    configured: false,
    error:
      'No routing engine. Local demo: Valhalla + OTP (see data/opentripplanner/README.md)',
  };
}
