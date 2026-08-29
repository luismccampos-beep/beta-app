/**
 * Type definition for the `raw` JSON field in CityMetric.
 *
 * This field stores unstructured data from various enrichment sources.
 * The schema below documents the expected shape for each source.
 *
 * Usage in code:
 *   import type { CityMetricRaw } from '../types/city-metric.js';
 *   const raw: CityMetricRaw = { numbeo: { ... }, openstreetmap: { ... } };
 */

export interface CityMetricRaw {
  /** Numbeo cost-of-living data */
  numbeo?: {
    costOfLivingIndex?: number;
    rentIndex?: number;
    costOfLivingPlusRentIndex?: number;
    groceryIndex?: number;
    restaurantPriceIndex?: number;
    localPurchasingPowerIndex?: number;
    /** Meal at inexpensive restaurant (USD) */
    mealLowPrice?: number;
    /** Meal at mid-range restaurant, 3 courses (USD) */
    mealMidPrice?: number;
    /** Monthly rent, 1-bed apartment city centre (USD) */
    rent1BedCentre?: number;
    /** Monthly rent, 1-bed apartment outside centre (USD) */
    rent1BedOutside?: number;
    /** Basic utilities (electricity, heating, cooling, water, garbage) for 85m2 apartment (USD) */
    utilitiesBasic?: number;
    /** Internet (60 Mbps+, unlimited data, cable/ADSL) (USD) */
    internet60Mbps?: number;
    /** One-way ticket (local transport) (USD) */
    transportOneWay?: number;
    /** Monthly pass (regular price) (USD) */
    transportMonthly?: number;
    /** Fitness club monthly fee for 1 adult (USD) */
    gymMonthly?: number;
    /** Cinema, international release, 1 seat (USD) */
    cinemaTicket?: number;
    fetchedAt?: string;
  };

  /** OpenStreetMap / Overpass data */
  openstreetmap?: {
    /** Number of POIs within 5km */
    poiCount?: number;
    /** Number of restaurants */
    restaurantCount?: number;
    /** Number of hotels/accommodations */
    hotelCount?: number;
    /** Number of hospitals/clinics */
    hospitalCount?: number;
    /** Number of pharmacies */
    pharmacyCount?: number;
    /** Number of parks/green areas */
    parkCount?: number;
    /** Number of museums */
    museumCount?: number;
    /** Number of beaches (if coastal) */
    beachCount?: number;
    fetchedAt?: string;
  };

  /** OurAirports data */
  ourairports?: {
    iata?: string;
    name?: string;
    elevation?: number;
    type?: string; // "airport", "large_airport", "medium_airport"
    fetchedAt?: string;
  };

  /** Internet speed data (Speedtest/Ookla) */
  speedtest?: {
    downloadMbps?: number;
    uploadMbps?: number;
    latencyMs?: number;
    fetchedAt?: string;
  };

  /** Safety data */
  safety?: {
    globalPeaceIndex?: number; // 1-5 (1 = most peaceful)
    safetyIndex?: number; // 0-100 (higher = safer)
    crimeIndex?: number; // 0-100 (higher = more crime)
    source?: string;
    fetchedAt?: string;
  };

  /** Additional sources can be added here as enrichment phases complete */
  [key: string]: Record<string, unknown> | undefined;
}
