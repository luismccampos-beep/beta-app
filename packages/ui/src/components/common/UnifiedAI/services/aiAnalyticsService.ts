import { trackEvent, type TrackingProperties } from '../../../../config/monitoring.config';
import { logger } from '../../../../logger';

export interface AIAnalyticsEvent {
  name: string;
  payload?: TrackingProperties;
}

export function trackAIEvent(event: AIAnalyticsEvent): void {
  try {
    trackEvent(event.name, event.payload);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.warn('AI analytics tracking failed', { error: message });
  }
}