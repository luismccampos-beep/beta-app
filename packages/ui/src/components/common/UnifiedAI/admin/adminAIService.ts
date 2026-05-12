import type { AIAdminAction } from '../types/admin.types';
import { aiRequest } from '../services/aiApiClient';
import { trackAIEvent } from '../services/aiAnalyticsService';
import { logger } from '../../../../logger';

type AdminActionResponse = {
  success: boolean;
  data?: Record<string, unknown>;
  message?: string;
};

export type AdminActionOptions = {
  apiEndpoint?: string;
  endpointOverride?: string;
};

const resolveEndpoint = (action: AIAdminAction, options: AdminActionOptions): string => {
  if (options.endpointOverride) return options.endpointOverride;
  if (action.type.startsWith('/')) return action.type;
  return '/admin/ai/actions';
};

export async function runAdminAction(action: AIAdminAction, options: AdminActionOptions = {}): Promise<Record<string, unknown> | null> {
  try {
    const endpoint = resolveEndpoint(action, options);
    const response = await aiRequest<AdminActionResponse>(endpoint, {
      method: 'POST',
      body: action as unknown as Record<string, unknown>,
      ...(options.apiEndpoint ? { baseUrl: options.apiEndpoint } : {}),
    });

    if (!response?.success) {
      throw new Error(response?.message || 'Admin action failed');
    }

    trackAIEvent({ name: 'ai.admin.action', payload: { type: action.type } });
    return response.data ?? null;
  } catch (error) {
    logger.warn('Admin AI action failed', { error: error instanceof Error ? error.message : error, action: action.type });
    throw error;
  }
}
