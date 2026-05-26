/**
 * Local routing for demo: OTP (transit) + Valhalla (street) — TripGo cloud only as fallback.
 */

import type { TripGoTripPlan } from './tripgo';
import { fetchTripGoRouting, isTripGoConfigured } from './tripgo';
import { fetchOtpPlan, isOtpConfigured } from './opentripplanner';
import {
  fetchValhallaRoute,
  isValhallaConfigured,
  type ValhallaCosting,
} from './valhalla';

export type LocalRoutingProvider = 'otp' | 'valhalla' | 'tripgo';

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
  return isOtpConfigured() || isValhallaConfigured() || isTripGoConfigured();
}

export function preferredLocalRoutingProvider(mode?: LocalRoutingMode): LocalRoutingProvider | null {
  if (mode === 'transit') {
    if (isOtpConfigured()) return 'otp';
    if (!isLocalOnly({ from: { lat: 0, lon: 0 }, to: { lat: 0, lon: 0 } }) && isTripGoConfigured()) {
      return 'tripgo';
    }
    return null;
  }
  if (isValhallaConfigured()) return 'valhalla';
  if (!isLocalOnly({ from: { lat: 0, lon: 0 }, to: { lat: 0, lon: 0 } }) && isTripGoConfigured()) {
    return 'tripgo';
  }
  return isOtpConfigured() ? 'otp' : null;
}

/**
 * OTP for transit; Valhalla for car/walk/bike; TripGo only if localOnly is false.
 */
export async function fetchLocalRouting(input: LocalRoutingInput): Promise<LocalRoutingResult> {
  const mode = resolveMode(input);
  const localOnly = isLocalOnly(input);

  if (mode === 'transit') {
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
    } else if (localOnly) {
      return {
        plans: [],
        provider: null,
        configured: isOtpConfigured(),
        error: 'OTP not configured — npm run otp:prepare && npm run otp:build && npm run otp:up',
      };
    }

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
      error: 'Transit: configure OTP_BASE_URL or TRIPGO_API_KEY',
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
