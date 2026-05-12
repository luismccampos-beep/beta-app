import apiClient from '../lib/api-client';
import type {
  TravelPackage,
  ExtendedTravelPackage,
  PackageFilters,
} from '../types/package';

// ============================================================================
// Constants
// ============================================================================

const VALID_CATEGORIES = new Set([
  'adventure', 'luxury', 'family', 'romantic', 'cultural', 'eco',
  'coastal', 'corporate', 'cultural-exchange', 'gastronomic',
  'group-travel', 'photography', 'snow-sports', 'wellness',
]);

const VALID_DIFFICULTIES = new Set(['easy', 'moderate', 'challenging', 'expert']);
const VALID_SERVICE_TYPES = new Set(['package', 'service', 'both']);

// ============================================================================
// Derived Types (avoids needing extra imports)
// ============================================================================

type PackageCategory = TravelPackage['category'];
type DifficultyLevel = NonNullable<TravelPackage['difficulty']>;
type ServiceType = NonNullable<TravelPackage['serviceType']>;

type ItineraryDayTarget = NonNullable<ExtendedTravelPackage['itinerary']>[number];
type ItineraryActivityTarget = ItineraryDayTarget['activities'][number];
type AvailabilityTarget = NonNullable<ExtendedTravelPackage['availability']>[number];
type DayDetailTarget = NonNullable<ExtendedTravelPackage['dayDetails']>[number];
type MonthlyWeatherTarget = NonNullable<ExtendedTravelPackage['monthlyWeather']>[number];
type MonthlyRecommendationTarget = NonNullable<ExtendedTravelPackage['monthlyRecommendations']>[number];
type ExtraActivityTarget = NonNullable<ExtendedTravelPackage['extraActivities']>[number];

// ============================================================================
// Raw API Response Interfaces
// ============================================================================

interface RawDetailsResponse {
  overview?: {
    bestTime?: unknown;
    climate?: unknown;
    monthlyWeather?: unknown[];
    monthlyRecommendations?: unknown[];
  };
  itineraries?: {
    days?: unknown[];
    stops?: unknown[];
    dayDetails?: unknown[];
  };
  availability?: {
    slots?: unknown[];
    startDates?: unknown[];
  };
  highlights?: {
    extraActivities?: unknown[];
  };
  best_time?: { months?: unknown } | string;
  weather?: { climate?: unknown };
  extra_activities?: unknown[];
}

interface RawItineraryDay {
  day?: unknown;
  title?: unknown;
  name?: unknown;
  description?: unknown;
  plan?: unknown[];
  activities?: unknown[];
}

interface RawAvailabilitySlot {
  date?: unknown;
  startDate?: unknown;
  endDate?: unknown;
  available?: unknown;
  spotsAvailable?: unknown;
}

interface RawDayDetail {
  day?: unknown;
  morning?: unknown[];
  afternoon?: unknown[];
  evening?: unknown[];
}

// ============================================================================
// Utility
// ============================================================================

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

// ============================================================================
// Primitive Extraction Helpers
// ============================================================================

function extractCategory(s: Record<string, unknown>): PackageCategory {
  if (Array.isArray(s.tags) && s.tags.includes('luxury')) {
    return 'luxury';
  }
  if (typeof s.category === 'string' && VALID_CATEGORIES.has(s.category)) {
    return s.category as PackageCategory;
  }
  return 'adventure';
}

function extractDifficulty(value: unknown): DifficultyLevel | undefined {
  if (typeof value === 'string' && VALID_DIFFICULTIES.has(value)) {
    return value as DifficultyLevel;
  }
  return undefined;
}

function extractServiceType(value: unknown): ServiceType {
  if (typeof value === 'string' && VALID_SERVICE_TYPES.has(value)) {
    return value as ServiceType;
  }
  return 'package';
}

function extractPrice(s: Record<string, unknown>): number {
  if (isRecord(s.price)) {
    const base = (s.price as { base?: unknown }).base;
    return Number(base ?? 0);
  }
  return Number(s.price ?? 0);
}

function extractDestination(s: Record<string, unknown>): string {
  if (isRecord(s.destination)) {
    return String((s.destination as { name?: string }).name ?? '');
  }
  return String(s.destination ?? '');
}

function extractImages(s: Record<string, unknown>): string[] {
  if (Array.isArray(s.imageGallery) && s.imageGallery.length > 0) {
    return s.imageGallery.map(String);
  }
  if (s.coverImage) {
    return [String(s.coverImage)];
  }
  return [];
}

function extractStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String) : [];
}

// ============================================================================
// Structured Parsers
// ============================================================================

function parseActivity(value: unknown): ItineraryActivityTarget {
  if (isRecord(value)) {
    return value as unknown as ItineraryActivityTarget;
  }
  return { name: String(value), description: '' } as ItineraryActivityTarget;
}

function parseActivities(values: unknown[] | undefined): ItineraryActivityTarget[] {
  if (!Array.isArray(values)) return [];
  return values.map(parseActivity);
}

function parseMonthlyWeather(items: unknown[]): MonthlyWeatherTarget[] {
  return items.filter(isRecord) as unknown as MonthlyWeatherTarget[];
}

function parseMonthlyRecommendations(items: unknown[]): MonthlyRecommendationTarget[] {
  return items.filter(isRecord) as unknown as MonthlyRecommendationTarget[];
}

function parseItineraryDay(d: RawItineraryDay, idx: number): ItineraryDayTarget {
  return {
    day: Number(d.day ?? idx + 1),
    title: String(d.title ?? d.name ?? ''),
    description: String(d.description ?? ''),
    activities: parseActivities(d.plan ?? d.activities),
  } as ItineraryDayTarget;
}

function parseAvailabilitySlot(a: RawAvailabilitySlot): AvailabilityTarget {
  return {
    startDate: String(a.date ?? a.startDate ?? ''),
    endDate: String(a.endDate ?? a.date ?? ''),
    spotsAvailable: Number(a.available ?? a.spotsAvailable ?? 0),
  } as AvailabilityTarget;
}

function parseDayDetail(d: RawDayDetail): DayDetailTarget {
  return {
    day: Number(d.day ?? 0),
    morning: parseActivities(d.morning),
    afternoon: parseActivities(d.afternoon),
    evening: parseActivities(d.evening),
  } as DayDetailTarget;
}

function parseExtraActivity(e: unknown): ExtraActivityTarget {
  if (isRecord(e)) {
    return {
      name: String(e.name ?? ''),
      duration: String(e.duration ?? ''),
    } as ExtraActivityTarget;
  }
  return { name: String(e), duration: '' } as ExtraActivityTarget;
}

// ============================================================================
// Map Raw Service → TravelPackage
// ============================================================================

function mapServiceToPackage(s: Record<string, unknown>): TravelPackage {
  const difficulty = extractDifficulty(s.difficulty);

  return {
    id: String(s.id),
    name: String(s.name ?? ''),
    description: String(s.description ?? ''),
    destination: extractDestination(s),
    price: extractPrice(s),
    duration: Number(s.duration ?? 0),
    rating: Number(s.rating ?? 0),
    reviews: Number(s.reviewCount ?? 0),
    category: extractCategory(s),
    images: extractImages(s),
    features: extractStringArray(s.features),
    included: extractStringArray(s.included ?? s.inclusions),
    excluded: extractStringArray(s.excluded ?? s.exclusions),
    highlights: extractStringArray(s.highlights),
    tags: extractStringArray(s.tags),
    requirements: extractStringArray(s.requirements),
    serviceType: extractServiceType(s.serviceType),
    inclusions: extractStringArray(s.inclusions),
    ...(difficulty !== undefined && { difficulty }),
    ...(s.bestTimeToVisit !== undefined && { bestTimeToVisit: String(s.bestTimeToVisit) }),
    ...(s.climate !== undefined && { climate: String(s.climate) }),
  };
}

// ============================================================================
// Details Extractors
// ============================================================================

function extractBestTime(det: RawDetailsResponse): string | undefined {
  if (det.overview?.bestTime) {
    return String(det.overview.bestTime);
  }
  if (typeof det.best_time === 'object' && det.best_time !== null) {
    const bt = det.best_time as { months?: unknown };
    if (bt.months) return String(bt.months);
  }
  if (typeof det.best_time === 'string') {
    return det.best_time;
  }
  return undefined;
}

function extractClimate(det: RawDetailsResponse): string | undefined {
  if (det.overview?.climate) return String(det.overview.climate);
  if (det.weather?.climate) return String(det.weather.climate);
  return undefined;
}

function extractItinerary(det: RawDetailsResponse): ItineraryDayTarget[] {
  const itin = det.itineraries?.days ?? det.itineraries?.stops ?? [];
  if (!Array.isArray(itin)) return [];
  return itin.map((d, idx) => parseItineraryDay(d as RawItineraryDay, idx));
}

function extractAvailability(det: RawDetailsResponse): AvailabilityTarget[] {
  const avail = det.availability?.slots ?? det.availability?.startDates ?? [];
  if (!Array.isArray(avail)) return [];
  return avail.map((a) => parseAvailabilitySlot(a as RawAvailabilitySlot));
}

function extractDayDetails(det: RawDetailsResponse): DayDetailTarget[] | undefined {
  const dayDetails = det.itineraries?.dayDetails;
  if (!Array.isArray(dayDetails) || dayDetails.length === 0) return undefined;
  return dayDetails.map((d) => parseDayDetail(d as RawDayDetail));
}

function extractExtraActivities(det: RawDetailsResponse): ExtraActivityTarget[] | undefined {
  const extras = det.highlights?.extraActivities ?? det.extra_activities;
  if (!Array.isArray(extras) || extras.length === 0) return undefined;
  return extras.map(parseExtraActivity);
}

function enrichPackageWithDetails(
  pkg: TravelPackage,
  det: RawDetailsResponse,
): ExtendedTravelPackage {
  const bestTime = extractBestTime(det);
  const climate = extractClimate(det);
  const dayDetails = extractDayDetails(det);
  const extraActivities = extractExtraActivities(det);

  return {
    ...pkg,
    itinerary: extractItinerary(det),
    availability: extractAvailability(det),
    ...(bestTime !== undefined && { bestTimeToVisit: bestTime }),
    ...(climate !== undefined && { climate }),
    ...(det.overview?.monthlyWeather && {
      monthlyWeather: parseMonthlyWeather(det.overview.monthlyWeather),
    }),
    ...(det.overview?.monthlyRecommendations && {
      monthlyRecommendations: parseMonthlyRecommendations(det.overview.monthlyRecommendations),
    }),
    ...(dayDetails !== undefined && { dayDetails }),
    ...(extraActivities !== undefined && { extraActivities }),
  };
}

// ============================================================================
// Package Service Class
// ============================================================================

class PackageService {
  async getAllPackages(filters?: PackageFilters): Promise<TravelPackage[]> {
    const params = this.buildFilterParams(filters);
    const resp = await apiClient.get<{ services: Record<string, unknown>[] }>(
      '/packages/services',
      { params: { ...params, limit: 100 } },
    );
    const items = Array.isArray(resp?.services) ? resp.services : [];
    return items.map(mapServiceToPackage);
  }

  async getPackageById(id: string): Promise<TravelPackage | null> {
    try {
      const resp = await apiClient.get<{ service: Record<string, unknown> }>(
        `/packages/services/${id}`,
      );
      const s = resp?.service;
      return s ? mapServiceToPackage(s) : null;
    } catch {
      return this.findPackageById(id);
    }
  }

  async getPackageBySlug(slug: string): Promise<ExtendedTravelPackage | null> {
    try {
      return await this.fetchPackageWithDetails(slug);
    } catch {
      return this.findPackageBySlug(slug);
    }
  }

  async searchPackages(query: string): Promise<TravelPackage[]> {
    const resp = await apiClient.get<{ services: Record<string, unknown>[] }>(
      '/services',
      { params: { category: 'package', query: query.trim() } },
    );
    const items = Array.isArray(resp?.services) ? resp.services : [];
    return items.map(mapServiceToPackage);
  }

  async filterPackages(filters: PackageFilters): Promise<TravelPackage[]> {
    return this.getAllPackages(filters);
  }

  async getPackagesByCategory(category: string): Promise<TravelPackage[]> {
    return this.getAllPackages({ category });
  }

  async getFeaturedPackages(limit = 6): Promise<TravelPackage[]> {
    const list = await this.getAllPackages();
    return list
      .sort((a, b) => b.rating * b.reviews - a.rating * a.reviews)
      .slice(0, limit);
  }

  async getCategoryStats(): Promise<Record<string, number>> {
    const list = await this.getAllPackages();
    const stats = new Map<string, number>();
    for (const pkg of list) {
      stats.set(pkg.category, (stats.get(pkg.category) ?? 0) + 1);
    }
    return Object.fromEntries(stats);
  }

  // ===========================================================================
  // Private Helper Methods
  // ===========================================================================

  private buildFilterParams(filters?: PackageFilters): Record<string, string | number> {
    const params: Record<string, string | number> = {
      category: 'package',
      limit: 50,
      page: 1,
    };

    if (!filters) return params;

    if (filters.category) params.tags = filters.category;
    if (filters.minPrice !== undefined) params.minPrice = filters.minPrice;
    if (filters.maxPrice !== undefined) params.maxPrice = filters.maxPrice;
    if (filters.minDuration !== undefined) params.minDuration = filters.minDuration;
    if (filters.maxDuration !== undefined) params.maxDuration = filters.maxDuration;
    if (filters.minRating !== undefined) params.minRating = filters.minRating;
    if (filters.serviceType) params.serviceType = filters.serviceType;

    return params;
  }

  private async fetchPackageWithDetails(slug: string): Promise<ExtendedTravelPackage | null> {
    const resp = await apiClient.get<{
      service?: Record<string, unknown>;
      details?: RawDetailsResponse;
    }>(`/services/${slug}/details`);

    const svc = resp?.service;
    if (!svc) return null;

    const pkg = mapServiceToPackage(svc);
    const det = resp?.details;

    return det ? enrichPackageWithDetails(pkg, det) : pkg;
  }

  private async findPackageById(id: string): Promise<TravelPackage | null> {
    const list = await this.getAllPackages();
    return list.find((p) => p.id === id) ?? null;
  }

  private async findPackageBySlug(slug: string): Promise<TravelPackage | null> {
    const resp = await apiClient.get<{ services: Record<string, unknown>[] }>(
      '/services',
      { params: { category: 'package', query: slug } },
    );
    const items = resp?.services ?? [];
    const item = items.find((s) => (s as { slug?: string }).slug === slug);
    return item ? mapServiceToPackage(item) : null;
  }
}

// ============================================================================
// Label / Color Lookups (Map avoids detect-object-injection)
// ============================================================================

const CATEGORY_LABELS = new Map<string, string>([
  ['adventure', 'Aventura'],
  ['luxury', 'Luxo'],
  ['family', 'Família'],
  ['romantic', 'Romântico'],
  ['cultural', 'Cultural'],
  ['eco', 'Eco-turismo'],
  ['coastal', 'Costeiro'],
  ['corporate', 'Corporativo'],
  ['cultural-exchange', 'Intercâmbio Cultural'],
  ['gastronomic', 'Gastronómico'],
  ['group-travel', 'Viagens em Grupo'],
  ['photography', 'Fotografia'],
  ['snow-sports', 'Desportos de Neve'],
  ['wellness', 'Bem-estar'],
]);

const CATEGORY_COLORS = new Map<string, string>([
  ['adventure', 'bg-orange-500'],
  ['luxury', 'bg-purple-600'],
  ['family', 'bg-green-500'],
  ['romantic', 'bg-pink-500'],
  ['cultural', 'bg-blue-600'],
  ['eco', 'bg-green-600'],
  ['coastal', 'bg-cyan-500'],
  ['corporate', 'bg-gray-600'],
  ['cultural-exchange', 'bg-indigo-500'],
  ['gastronomic', 'bg-yellow-600'],
  ['group-travel', 'bg-blue-500'],
  ['photography', 'bg-violet-500'],
  ['snow-sports', 'bg-blue-300'],
  ['wellness', 'bg-emerald-500'],
]);

const DIFFICULTY_COLORS = new Map<string, string>([
  ['easy', 'bg-green-100 text-green-800'],
  ['moderate', 'bg-yellow-100 text-yellow-800'],
  ['challenging', 'bg-orange-100 text-orange-800'],
  ['expert', 'bg-red-100 text-red-800'],
]);

export const getCategoryLabel = (category: string): string =>
  CATEGORY_LABELS.get(category) ?? category;

export const getCategoryColor = (category: string): string =>
  CATEGORY_COLORS.get(category) ?? 'bg-gray-500';

export const getDifficultyColor = (difficulty?: string): string =>
  DIFFICULTY_COLORS.get(difficulty ?? '') ?? 'bg-gray-100 text-gray-800';

const packageService = new PackageService();
export default packageService;