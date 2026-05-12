import apiClient from '../lib/api-client';

// =============================================================================
// Types
// =============================================================================

export interface SustainableDestination {
  id: string;
  name: string;
  country: string;
  image: string;
  description: string;
  ecoRating: number;
  co2Reduction: string;
  highlights: string[];
}

export interface FootprintSegmentInput {
  mode: string;
  origin: {
    lat?: number;
    lon?: number;
    code?: string;
  };
  destination: {
    lat?: number;
    lon?: number;
    code?: string;
  };
  passengers?: number;
  class?: string;
  subcategory?: string;
  country?: string;
  distanceKm?: number;
}

export interface FootprintSegmentResult {
  mode: string;
  distanceKm: number;
  passengers: number;
  class: string;
  co2Kg: number;
}

export interface FootprintResponse {
  totalCo2Kg: number;
  segments: FootprintSegmentResult[];
}

// =============================================================================
// Constants & Helpers
// =============================================================================

/**
 * Supported transport modes for CO2 calculation
 */
type TransportMode = 'flight' | 'train' | 'ferry' | 'bus';

/**
 * CO2 emission factors per passenger per km (kg CO2/passenger-km)
 * Based on typical transportation emission averages
 */
const CO2_FACTORS: Record<TransportMode, number> = {
  flight: 0.115,
  train: 0.041,
  ferry: 0.120,
  bus: 0.100,
};

/**
 * Default CO2 factor for unknown transport modes
 */
const DEFAULT_CO2_FACTOR = 0.100;

/**
 * Check if a mode is a valid TransportMode
 */
function isValidTransportMode(mode: string): mode is TransportMode {
  return mode === 'flight' || mode === 'train' || mode === 'ferry' || mode === 'bus';
}

/**
 * Safe lookup for CO2 emission factor
 * Uses the CO2_FACTORS object with type guard for security
 */
function getCO2Factor(mode: string): number {
  const normalizedMode = mode.toLowerCase().trim();
  
  // Type guard ensures we only access valid keys
  if (isValidTransportMode(normalizedMode)) {
    // eslint-disable-next-line security/detect-object-injection
    return CO2_FACTORS[normalizedMode];
  }
  
  return DEFAULT_CO2_FACTOR;
}

/**
 * Radiative forcing multiplier for flights (accounts for high-altitude emissions)
 * Flights have ~1.9x impact due to NOx, contrails, etc.
 */
function radiativeForcingFactor(mode: string): number {
  return mode === 'flight' ? 1.9 : 1;
}

/**
 * Cabin class multiplier for flights
 * Business/First class takes more space = higher emissions per passenger
 */
function cabinMultiplier(mode: string, cabinClass?: string): number {
  if (mode !== 'flight') return 1;
  const normalized = (cabinClass ?? '').toLowerCase().trim();
  
  switch (normalized) {
    case 'business':
    case 'first':
      return 1.5;
    case 'economy':
    case 'premium economy':
    default:
      return 1;
  }
}

/**
 * Calculate distance between two lat/lon coordinates using Haversine formula
 */
function haversineKm(aLat: number, aLon: number, bLat: number, bLon: number): number {
  const R = 6371; // Earth radius in km
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(bLat - aLat);
  const dLon = toRad(bLon - aLon);
  const lat1 = toRad(aLat);
  const lat2 = toRad(bLat);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Resolve distance for a segment - either from distanceKm field or calculated from coordinates
 */
function resolveDistance(seg: FootprintSegmentInput): number {
  if (typeof seg.distanceKm === 'number' && seg.distanceKm >= 0) {
    return seg.distanceKm;
  }

  const { origin: o, destination: d } = seg;
  if (
    typeof o.lat === 'number' &&
    typeof o.lon === 'number' &&
    typeof d.lat === 'number' &&
    typeof d.lon === 'number'
  ) {
    return haversineKm(o.lat, o.lon, d.lat, d.lon);
  }

  return 0;
}

/**
 * Sanitize and validate segment input
 * Prevents invalid or malicious data from being processed
 */
function sanitizeSegment(seg: FootprintSegmentInput): FootprintSegmentInput {
  return {
    ...seg,
    mode: String(seg.mode || 'flight').toLowerCase().trim(),
    passengers: Math.max(1, Math.min(1000, Number(seg.passengers) || 1)),
    class: String(seg.class || 'economy').toLowerCase().trim(),
  };
}

/**
 * Calculate carbon footprint locally (client-side fallback)
 * Uses all helper functions and CO2_FACTORS with security-hardened lookups
 */
function calculateFootprintLocally(segments: FootprintSegmentInput[]): FootprintResponse {
  const results: FootprintSegmentResult[] = [];
  let totalCo2Kg = 0;

  for (const rawSeg of segments) {
    const seg = sanitizeSegment(rawSeg);
    
    const distanceKm = resolveDistance(seg);
    const passengers = seg.passengers ?? 1;
    const cabinClass = seg.class ?? 'economy';
    const mode = seg.mode;

    // Get base CO2 factor using safe lookup from CO2_FACTORS
    const baseFactor = getCO2Factor(mode);

    // Apply multipliers
    const rfFactor = radiativeForcingFactor(mode);
    const cabinFactor = cabinMultiplier(mode, cabinClass);

    // Calculate CO2 for this segment
    const co2Kg = distanceKm * passengers * baseFactor * rfFactor * cabinFactor;

    results.push({
      mode,
      distanceKm: Math.round(distanceKm * 100) / 100,
      passengers,
      class: cabinClass,
      co2Kg: Math.round(co2Kg * 100) / 100, // Round to 2 decimals
    });

    totalCo2Kg += co2Kg;
  }

  return {
    totalCo2Kg: Math.round(totalCo2Kg * 100) / 100,
    segments: results,
  };
}

// =============================================================================
// Service
// =============================================================================

export const sustainableService = {
  /**
   * Fetch all sustainable destinations
   */
  async getDestinations(): Promise<SustainableDestination[]> {
    try {
      const resp = await apiClient.get<SustainableDestination[]>('/sustainable/destinations');
      return Array.isArray(resp) ? resp : [];
    } catch (error) {
      console.error('Failed to fetch sustainable destinations:', error);
      return [];
    }
  },

  /**
   * Fetch a single destination by ID
   */
  async getDestinationById(id: string): Promise<SustainableDestination | undefined> {
    try {
      // Sanitize ID to prevent injection
      const sanitizedId = String(id).trim();
      if (!sanitizedId || sanitizedId.length > 100) {
        return undefined;
      }
      
      const resp = await apiClient.get<SustainableDestination>(
        `/sustainable/destinations/${encodeURIComponent(sanitizedId)}`
      );
      return resp ?? undefined;
    } catch (error) {
      console.error('Failed to fetch destination:', error);
      return undefined;
    }
  },

  /**
   * Compute carbon footprint via API with local fallback
   * If API fails, uses client-side calculation
   */
  async computeFootprint(segments: FootprintSegmentInput[]): Promise<FootprintResponse> {
    try {
      const resp = await apiClient.post<FootprintResponse>('/sustainable/calculate', { segments });
      return resp;
    } catch (error) {
      console.warn('API footprint calculation failed, using local calculation:', error);
      // Fallback to local calculation if API fails
      return calculateFootprintLocally(segments);
    }
  },

  /**
   * Compute carbon footprint locally (instant, no API call)
   * Useful for real-time estimates or offline mode
   */
  computeFootprintLocally(segments: FootprintSegmentInput[]): FootprintResponse {
    return calculateFootprintLocally(segments);
  },

  /**
   * Get all available transport modes and their CO2 factors
   * Useful for displaying emission comparisons in UI
   */
  getTransportModes(): Array<{ mode: TransportMode; co2PerKm: number }> {
    return Object.entries(CO2_FACTORS).map(([mode, co2PerKm]) => ({
      mode: mode as TransportMode,
      co2PerKm,
    }));
  },
};