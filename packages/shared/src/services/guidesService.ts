import apiClient from '../lib/api-client';

// =============================================================================
// Types
// =============================================================================

/**
 * Declared with `| undefined` on every optional field to satisfy
 * `exactOptionalPropertyTypes: true` in tsconfig.
 */
export interface GuideSummary {
  id: string;
  name: string;
  photo?: string | undefined;
  expertise?: string | undefined;
  bio?: string | undefined;
  rating?: number | undefined;
  location?: { name?: string | undefined } | string | undefined;
  // Detail fields — populated when the API returns a nested `details` object
  specialties?: string[] | undefined;
  certifications?: string[] | undefined;
  availability?: string[] | undefined;
  pricing?: unknown;
  languages?: string[] | undefined;
  images?: string[] | undefined;
}

/** Shape of the nested `details` object returned by the API. */
interface GuideDetailPayload {
  specialties?: { areas?: string[] | undefined } | undefined;
  certifications?: { items?: string[] | undefined } | undefined;
  availability?: { slots?: string[] | undefined } | undefined;
  pricing?: unknown;
  languages?: { spoken?: string[] | undefined } | undefined;
  images?: { gallery?: string[] | undefined } | undefined;
  ratings?: number | undefined;
}

/** Raw shape of a single guide record from the API. */
interface RawGuide extends Record<string, unknown> {
  id?: unknown;
  _id?: unknown;
  name?: string;
  photo?: unknown;
  coverImage?: unknown;
  images?: unknown;
  tags?: unknown;
  bio?: unknown;
  description?: unknown;
  rating?: unknown;
  reviewScore?: unknown;
  location?: unknown;
  city?: unknown;
  details?: GuideDetailPayload;
}

// =============================================================================
// Mapping Helpers
// =============================================================================

function resolvePhoto(s: RawGuide): string | undefined {
  if (typeof s.photo === 'string') return s.photo;
  if (typeof s.coverImage === 'string') return s.coverImage;
  if (Array.isArray(s.images) && typeof s.images[0] === 'string') return s.images[0];
  return undefined;
}

function resolveExpertise(s: RawGuide): string | undefined {
  if (typeof s.expertise === 'string') return s.expertise;
  if (Array.isArray(s.tags) && typeof s.tags[0] === 'string') return s.tags[0];
  return undefined;
}

function resolveLocation(s: RawGuide): GuideSummary['location'] {
  if (typeof s.location === 'object' && s.location !== null && 'name' in s.location) {
    return s.location as { name?: string };
  }
  if (typeof s.location === 'string') return s.location;
  if (typeof s.city === 'string') return s.city;
  return undefined;
}

function mapGuide(s: RawGuide): GuideSummary {
  return {
    id: String(s.id ?? s._id ?? ''),
    name: typeof s.name === 'string' ? s.name : '',
    photo: resolvePhoto(s),
    expertise: resolveExpertise(s),
    bio: String(s.bio ?? s.description ?? ''),
    rating: typeof s.rating === 'number'
      ? s.rating
      : typeof s.reviewScore === 'number'
        ? s.reviewScore
        : undefined,
    location: resolveLocation(s),
  };
}

function applyDetails(base: GuideSummary, raw: RawGuide): GuideSummary {
  const det = raw.details;
  if (!det) return base;

  const rootRating = typeof raw.rating === 'number' ? raw.rating : undefined;

  return {
    ...base,
    specialties: det.specialties?.areas ?? [],
    certifications: det.certifications?.items ?? [],
    availability: det.availability?.slots ?? [],
    pricing: det.pricing,
    languages: det.languages?.spoken ?? [],
    images: det.images?.gallery ?? [],
    // Prefer root-level rating; fall back to the details aggregate, then base
    rating: rootRating ?? det.ratings ?? base.rating,
  };
}

// =============================================================================
// Service
// =============================================================================

class GuidesService {
  async getAllGuides(): Promise<GuideSummary[]> {
    try {
      const resp = await apiClient.get<{ guides: RawGuide[] }>('/guides', {
        params: { details: true, limit: 100 },
      });

      const items = Array.isArray(resp?.guides) ? resp.guides : [];

      return items.map((raw) => applyDetails(mapGuide(raw), raw));
    } catch {
      return [];
    }
  }
}

const guidesService = new GuidesService();
export default guidesService;