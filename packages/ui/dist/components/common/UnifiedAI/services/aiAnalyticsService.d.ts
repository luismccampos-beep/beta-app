import { type TrackingProperties } from '../../../../config/monitoring.config';
export interface AIAnalyticsEvent {
    name: string;
    payload?: TrackingProperties;
}
export declare function trackAIEvent(event: AIAnalyticsEvent): void;
