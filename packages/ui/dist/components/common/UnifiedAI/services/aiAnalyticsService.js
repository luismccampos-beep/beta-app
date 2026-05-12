import { trackEvent } from '../../../../config/monitoring.config';
import { logger } from '../../../../logger';
export function trackAIEvent(event) {
    try {
        trackEvent(event.name, event.payload);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        logger.warn('AI analytics tracking failed', { error: message });
    }
}
//# sourceMappingURL=aiAnalyticsService.js.map