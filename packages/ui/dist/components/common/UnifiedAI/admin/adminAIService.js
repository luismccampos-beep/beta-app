import { aiRequest } from '../services/aiApiClient';
import { trackAIEvent } from '../services/aiAnalyticsService';
import { logger } from '../../../../logger';
const resolveEndpoint = (action, options) => {
    if (options.endpointOverride)
        return options.endpointOverride;
    if (action.type.startsWith('/'))
        return action.type;
    return '/admin/ai/actions';
};
export async function runAdminAction(action, options = {}) {
    try {
        const endpoint = resolveEndpoint(action, options);
        const response = await aiRequest(endpoint, {
            method: 'POST',
            body: action,
            ...(options.apiEndpoint ? { baseUrl: options.apiEndpoint } : {}),
        });
        if (!response?.success) {
            throw new Error(response?.message || 'Admin action failed');
        }
        trackAIEvent({ name: 'ai.admin.action', payload: { type: action.type } });
        return response.data ?? null;
    }
    catch (error) {
        logger.warn('Admin AI action failed', { error: error instanceof Error ? error.message : error, action: action.type });
        throw error;
    }
}
//# sourceMappingURL=adminAIService.js.map