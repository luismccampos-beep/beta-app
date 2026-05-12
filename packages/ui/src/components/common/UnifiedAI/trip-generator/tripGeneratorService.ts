import { aiRequest } from '../services/aiApiClient';
import { getAIValue, setAIValue } from '../services/aiStorageService';
import { trackAIEvent } from '../services/aiAnalyticsService';
import { logger } from '../../../../logger';

export type TripPreferences = {
  name?: string;
  email?: string;
  budget: number;
  duration: number;
  interests: string[];
  sustainability: number;
  travelers: number;
  destination?: string;
  additionalComments?: string;
};

export type TripDayPlan = {
  day: number;
  title: string;
  activities: string[];
  location: string;
  estimatedCost: number;
};

export type GeneratedTrip = {
  id: string;
  destination: string;
  duration: number;
  totalEstimatedCost: number;
  summary: string;
  days: TripDayPlan[];
  generatedAt: string;
  aiGenerated: boolean;
};

type TripResponse = {
  success: boolean;
  data?: GeneratedTrip;
  message?: string;
};

export type TripGeneratorOptions = {
  cacheTtlMs?: number;
  apiEndpoint?: string;
};

const buildCacheKey = (preferences: TripPreferences): string =>
  `ai:trip:${JSON.stringify(preferences)}`;

export async function createTripDraft(preferences: TripPreferences, options: TripGeneratorOptions = {}): Promise<GeneratedTrip> {
  const cacheKey = buildCacheKey(preferences);
  const cached = getAIValue<GeneratedTrip>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const response = await aiRequest<TripResponse>('/ai/generate-trip', {
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
  } catch (error) {
    logger.warn('Trip draft generation failed', { error: error instanceof Error ? error.message : error });
    if (cached) {
      return cached;
    }
    throw error;
  }
}
