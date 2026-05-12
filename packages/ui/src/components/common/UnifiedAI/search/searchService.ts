import { aiRequest } from '../services/aiApiClient';
import { getAIValue, setAIValue } from '../services/aiStorageService';
import { trackAIEvent } from '../services/aiAnalyticsService';
import { logger } from '../../../../logger';

export type AISearchSuggestion = {
  id: string;
  title: string;
  description?: string;
  category?: string;
  country?: string;
  tags?: string[];
  popularity?: number;
  imageUrl?: string;
};

export type AISearchResult = {
  suggestions: AISearchSuggestion[];
  popularDestinations?: unknown[];
  total: number;
  hasMore: boolean;
};

export type AISearchOptions = {
  limit?: number;
  includePopular?: boolean;
  includeCategories?: boolean;
  includeCountries?: boolean;
  includeTags?: boolean;
  cacheTtlMs?: number;
  apiEndpoint?: string;
};

type SearchResponse = {
  success: boolean;
  data: AISearchResult;
};

const buildQuery = (query: string, options: AISearchOptions): string => {
  const params = new URLSearchParams();
  params.set('query', query);
  if (options.limit) params.set('limit', String(options.limit));
  if (options.includePopular !== undefined) params.set('includePopular', String(options.includePopular));
  if (options.includeCategories !== undefined) params.set('includeCategories', String(options.includeCategories));
  if (options.includeCountries !== undefined) params.set('includeCountries', String(options.includeCountries));
  if (options.includeTags !== undefined) params.set('includeTags', String(options.includeTags));
  return params.toString();
};

export async function runAISearch(query: string, options: AISearchOptions = {}): Promise<AISearchResult> {
  if (!query.trim()) {
    return { suggestions: [], total: 0, hasMore: false };
  }

  const cacheKey = `ai:search:${query}:${JSON.stringify(options)}`;
  const cached = getAIValue<AISearchResult>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const response = await aiRequest<SearchResponse>(`/search/suggestions?${buildQuery(query, options)}`, {
      ...(options.apiEndpoint ? { baseUrl: options.apiEndpoint } : {}),
    });

    if (!response?.success) {
      throw new Error('Search request failed');
    }

    setAIValue(cacheKey, response.data, options.cacheTtlMs ?? 2 * 60 * 1000);
    trackAIEvent({ name: 'ai.search.completed', payload: { query, count: response.data?.suggestions?.length ?? 0 } });
    return response.data;
  } catch (error) {
    logger.warn('AI search failed', { error: error instanceof Error ? error.message : error, query });
    if (cached) {
      return cached;
    }
    throw error;
  }
}
