import type { AISuggestion } from '../types/ai.types';
import { aiRequest } from '../services/aiApiClient';
import { getAIValue, setAIValue } from '../services/aiStorageService';
import { trackAIEvent } from '../services/aiAnalyticsService';
import { logger } from '../../../../logger';

type RecommendationsResponse = {
  success: boolean;
  data: Array<{
    id: number;
    name: string;
    rating?: number;
    score?: number;
    relevance?: number;
  }>;
  meta?: {
    count: number;
    limit: number;
    userId?: number;
    generatedAt?: string;
  };
};

export type SuggestionsOptions = {
  limit?: number;
  includePopular?: boolean;
  includePersonalized?: boolean;
  diversityFactor?: number;
  userId?: string;
  excludeIds?: string[];
  cacheTtlMs?: number;
  apiEndpoint?: string;
};

const buildQuery = (options: SuggestionsOptions): string => {
  const params = new URLSearchParams();
  if (options.limit) params.set('limit', String(options.limit));
  if (options.includePopular !== undefined) params.set('includePopular', String(options.includePopular));
  if (options.includePersonalized !== undefined) params.set('includePersonalized', String(options.includePersonalized));
  if (options.diversityFactor !== undefined) params.set('diversityFactor', String(options.diversityFactor));
  if (options.excludeIds?.length) params.set('excludeIds', options.excludeIds.join(','));
  return params.toString();
};

const mapRecommendationToSuggestion = (item: RecommendationsResponse['data'][number]): AISuggestion => ({
  id: String(item.id),
  label: item.name,
  payload: {
    rating: item.rating,
    score: item.score,
    relevance: item.relevance,
  },
});

export async function fetchSuggestions(options: SuggestionsOptions = {}): Promise<AISuggestion[]> {
  const cacheKey = `ai:suggestions:${JSON.stringify(options)}`;
  const cached = getAIValue<AISuggestion[]>(cacheKey);
  if (cached?.length) {
    return cached;
  }

  const query = buildQuery(options);
  const path = `/recommendations${query ? `?${query}` : ''}`;

  try {
    const response = await aiRequest<RecommendationsResponse>(path, {
      ...(options.apiEndpoint ? { baseUrl: options.apiEndpoint } : {}),
    });

    if (!response?.success) {
      throw new Error('Suggestions request failed');
    }

    const suggestions = response.data.map(mapRecommendationToSuggestion);
    setAIValue(cacheKey, suggestions, options.cacheTtlMs ?? 3 * 60 * 1000);
    trackAIEvent({ name: 'ai.suggestions.loaded', payload: { count: suggestions.length } });
    return suggestions;
  } catch (error) {
    logger.warn('Failed to fetch AI suggestions', { error: error instanceof Error ? error.message : error });
    if (cached) {
      return cached;
    }
    throw error;
  }
}
