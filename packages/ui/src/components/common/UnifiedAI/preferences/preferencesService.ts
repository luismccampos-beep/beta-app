import type { AIPreferences } from '../types/preferences.types';
import { aiRequest } from '../services/aiApiClient';
import { getAIValue, removeAIValue, setAIValue } from '../services/aiStorageService';
import { trackAIEvent } from '../services/aiAnalyticsService';
import { logger } from '../../../../logger';

type PreferencesResponse = {
  success: boolean;
  data?: AIPreferences;
  message?: string;
};

export type PreferencesOptions = {
  apiEndpoint?: string;
  cacheTtlMs?: number;
};

const CACHE_KEY = 'ai:preferences';

export async function savePreferences(preferences: AIPreferences, options: PreferencesOptions = {}): Promise<AIPreferences> {
  const response = await aiRequest<PreferencesResponse>('/ai-preferences', {
    method: 'POST',
    body: preferences,
    ...(options.apiEndpoint ? { baseUrl: options.apiEndpoint } : {}),
  });

  if (!response?.success) {
    throw new Error(response?.message || 'Failed to save preferences');
  }

  const saved = response.data ?? preferences;
  setAIValue(CACHE_KEY, saved, options.cacheTtlMs ?? 10 * 60 * 1000);
  trackAIEvent({ name: 'ai.preferences.saved' });
  return saved;
}

export async function loadPreferences(options: PreferencesOptions = {}): Promise<AIPreferences | null> {
  const cached = getAIValue<AIPreferences>(CACHE_KEY);
  if (cached) {
    return cached;
  }

  try {
    const response = await aiRequest<PreferencesResponse>('/ai-preferences', {
      method: 'GET',
      ...(options.apiEndpoint ? { baseUrl: options.apiEndpoint } : {}),
    });

    if (!response?.success) {
      throw new Error(response?.message || 'Failed to load preferences');
    }

    if (response.data) {
      setAIValue(CACHE_KEY, response.data, options.cacheTtlMs ?? 10 * 60 * 1000);
    }
    return response.data ?? null;
  } catch (error) {
    logger.warn('Failed to load AI preferences', { error: error instanceof Error ? error.message : error });
    return null;
  }
}

export async function resetPreferences(options: PreferencesOptions = {}): Promise<AIPreferences | null> {
  try {
    const response = await aiRequest<PreferencesResponse>('/ai-preferences', {
      method: 'DELETE',
      ...(options.apiEndpoint ? { baseUrl: options.apiEndpoint } : {}),
    });
    removeAIValue(CACHE_KEY);
    if (response?.success && response.data) {
      setAIValue(CACHE_KEY, response.data, options.cacheTtlMs ?? 10 * 60 * 1000);
      trackAIEvent({ name: 'ai.preferences.reset' });
      return response.data;
    }
    return null;
  } catch (error) {
    logger.warn('Failed to reset AI preferences', { error: error instanceof Error ? error.message : error });
    return null;
  }
}
