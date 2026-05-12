import apiClient from '../lib/api-client';
// =============================================================================
// Mapping Helpers
// =============================================================================
function resolvePhoto(s) {
    if (typeof s.photo === 'string')
        return s.photo;
    if (typeof s.coverImage === 'string')
        return s.coverImage;
    if (Array.isArray(s.images) && typeof s.images[0] === 'string')
        return s.images[0];
    return undefined;
}
function resolveExpertise(s) {
    if (typeof s.expertise === 'string')
        return s.expertise;
    if (Array.isArray(s.tags) && typeof s.tags[0] === 'string')
        return s.tags[0];
    return undefined;
}
function resolveLocation(s) {
    if (typeof s.location === 'object' && s.location !== null && 'name' in s.location) {
        return s.location;
    }
    if (typeof s.location === 'string')
        return s.location;
    if (typeof s.city === 'string')
        return s.city;
    return undefined;
}
function mapGuide(s) {
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
function applyDetails(base, raw) {
    const det = raw.details;
    if (!det)
        return base;
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
    async getAllGuides() {
        try {
            const resp = await apiClient.get('/guides', {
                params: { details: true, limit: 100 },
            });
            const items = Array.isArray(resp?.guides) ? resp.guides : [];
            return items.map((raw) => applyDetails(mapGuide(raw), raw));
        }
        catch {
            return [];
        }
    }
}
const guidesService = new GuidesService();
export default guidesService;
//# sourceMappingURL=guidesService.js.map