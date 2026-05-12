import { init, browserTracingIntegration } from '@sentry/react';

import { getEnv } from '../utils/env';

// Shared type for tracking properties
export type TrackingProperties = Record<string, string | number | boolean | undefined>;

// Define analytics interface for type safety
interface AnalyticsEvent extends TrackingProperties {
  value: number;
}

interface Analytics {
  track: (eventName: string, properties: TrackingProperties) => void;
}

// Extend Window interface to include analytics
declare global {
  interface Window {
    analytics?: Analytics;
  }
}

export const initializeMonitoring = (): void => {
  init({
    dsn: getEnv('SENTRY_DSN'),
    integrations: [
      browserTracingIntegration(),
    ],
    tracesSampleRate: 1.0,

    beforeSend(event) {
      // Filter sensitive data
      if (event.user) {
        delete event.user.email;
      }
      return event;
    },
  });
};

// Type-safe metrics enum for consistency
export enum ChatMetric {
  MessageSent = 'chat.message.sent',
  MessageReceived = 'chat.message.received',
  SessionStarted = 'chat.session.started',
  SessionEnded = 'chat.session.ended',
  ErrorOccurred = 'chat.error.occurred',
}

// Custom metrics tracking
export function trackChatMetric(
  metric: string,
  value: number,
  tags?: Record<string, string>
): void {
  if (typeof window !== 'undefined' && window.analytics) {
    const properties: AnalyticsEvent = { value, ...tags };
    window.analytics.track(metric, properties);
  }
}

// Helper function with predefined metrics
export function trackChatEvent(
  metric: ChatMetric,
  value: number,
  tags?: Record<string, string>
): void {
  trackChatMetric(metric, value, tags);
}

// General-purpose event tracking
export function trackEvent(
  eventName: string,
  properties?: TrackingProperties
): void {
  if (typeof window !== 'undefined' && window.analytics) {
    window.analytics.track(eventName, properties ?? {});
  }
}

// Monitoring event tracking
export function trackMonitoringEvent(
  eventName: string,
  properties: TrackingProperties
): void {
  if (typeof window !== 'undefined' && window.analytics) {
    window.analytics.track(eventName, properties);
  }
}

// Error tracking (logs locally; extend to forward to Sentry if needed)
export function trackError(
  error: Error,
  properties?: Record<string, unknown>
): void {
  console.error('[Monitoring Error]:', error, properties);
}