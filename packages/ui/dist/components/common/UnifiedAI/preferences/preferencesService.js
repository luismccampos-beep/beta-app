import { aiRequest } from '../services/aiApiClient';
import { getAIValue, removeAIValue, setAIValue } from '../services/aiStorageService';
import { trackAIEvent } from '../services/aiAnalyticsService';
import { logger } from '../../../../logger';
const CACHE_KEY = 'ai:preferences';
export async function savePreferences(preferences, options = {}) {
    const response = await aiRequest('/ai-preferences', {
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
export async function loadPreferences(options = {}) {
    const cached = getAIValue(CACHE_KEY);
    if (cached) {
        return cached;
    }
    try {
        const response = await aiRequest('/ai-preferences', {
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
    }
    catch (error) {
        logger.warn('Failed to load AI preferences', { error: error instanceof Error ? error.message : error });
        return null;
    }
}
export async function resetPreferences(options = {}) {
    try {
        const response = await aiRequest('/ai-preferences', {
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
    }
    catch (error) {
        logger.warn('Failed to reset AI preferences', { error: error instanceof Error ? error.message : error });
        return null;
    }
}
//# sourceMappingURL=preferencesService.js.map