import { aiRequest } from '../services/aiApiClient';
import { getAIValue, setAIValue } from '../services/aiStorageService';
import { trackAIEvent } from '../services/aiAnalyticsService';
import { logger } from '../../../../logger';
const buildCacheKey = (preferences) => `ai:trip:${JSON.stringify(preferences)}`;
export async function createTripDraft(preferences, options = {}) {
    const cacheKey = buildCacheKey(preferences);
    const cached = getAIValue(cacheKey);
    if (cached) {
        return cached;
    }
    try {
        const response = await aiRequest('/ai/generate-trip', {
            method: 'POST',
            body: preferences,
            ...(options.apiEndpoint ? { baseUrl: options.apiEndpoint } : {}),
        });
        if (!response?.success || !response.data) {
            throw new Error(response?.message || 'Trip generation failed');
        }
        const trip = response.data;
        setAIValue(cacheKey, trip, options.cacheTtlMs ?? 15 * 60 * 1000);
        trackAIEvent({ name: 'ai.trip.generated', payload: { destination: trip.destination, days: trip.duration } });
        return trip;
    }
    catch (error) {
        logger.warn('Trip draft generation failed', { error: error instanceof Error ? error.message : error });
        if (cached) {
            return cached;
        }
        throw error;
    }
}
//# sourceMappingURL=tripGeneratorService.js.map