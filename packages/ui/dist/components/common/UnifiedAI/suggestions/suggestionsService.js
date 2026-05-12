import { aiRequest } from '../services/aiApiClient';
import { getAIValue, setAIValue } from '../services/aiStorageService';
import { trackAIEvent } from '../services/aiAnalyticsService';
import { logger } from '../../../../logger';
const buildQuery = (options) => {
    const params = new URLSearchParams();
    if (options.limit)
        params.set('limit', String(options.limit));
    if (options.includePopular !== undefined)
        params.set('includePopular', String(options.includePopular));
    if (options.includePersonalized !== undefined)
        params.set('includePersonalized', String(options.includePersonalized));
    if (options.diversityFactor !== undefined)
        params.set('diversityFactor', String(options.diversityFactor));
    if (options.excludeIds?.length)
        params.set('excludeIds', options.excludeIds.join(','));
    return params.toString();
};
const mapRecommendationToSuggestion = (item) => ({
    id: String(item.id),
    label: item.name,
    payload: {
        rating: item.rating,
        score: item.score,
        relevance: item.relevance,
    },
});
export async function fetchSuggestions(options = {}) {
    const cacheKey = `ai:suggestions:${JSON.stringify(options)}`;
    const cached = getAIValue(cacheKey);
    if (cached?.length) {
        return cached;
    }
    const query = buildQuery(options);
    const path = `/recommendations${query ? `?${query}` : ''}`;
    try {
        const response = await aiRequest(path, {
            ...(options.apiEndpoint ? { baseUrl: options.apiEndpoint } : {}),
        });
        if (!response?.success) {
            throw new Error('Suggestions request failed');
        }
        const suggestions = response.data.map(mapRecommendationToSuggestion);
        setAIValue(cacheKey, suggestions, options.cacheTtlMs ?? 3 * 60 * 1000);
        trackAIEvent({ name: 'ai.suggestions.loaded', payload: { count: suggestions.length } });
        return suggestions;
    }
    catch (error) {
        logger.warn('Failed to fetch AI suggestions', { error: error instanceof Error ? error.message : error });
        if (cached) {
            return cached;
        }
        throw error;
    }
}
//# sourceMappingURL=suggestionsService.js.map