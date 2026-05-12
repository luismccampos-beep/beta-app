import { init, browserTracingIntegration } from '@sentry/react';

import { getEnv } from '../utils/env';
export const initializeMonitoring = () => {
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
export var ChatMetric;
(function (ChatMetric) {
    ChatMetric["MessageSent"] = "chat.message.sent";
    ChatMetric["MessageReceived"] = "chat.message.received";
    ChatMetric["SessionStarted"] = "chat.session.started";
    ChatMetric["SessionEnded"] = "chat.session.ended";
    ChatMetric["ErrorOccurred"] = "chat.error.occurred";
})(ChatMetric || (ChatMetric = {}));
// Custom metrics tracking
export function trackChatMetric(metric, value, tags) {
    if (typeof window !== 'undefined' && window.analytics) {
        const properties = { value, ...tags };
        window.analytics.track(metric, properties);
    }
}
// Helper function with predefined metrics
export function trackChatEvent(metric, value, tags) {
    trackChatMetric(metric, value, tags);
}
// General-purpose event tracking
export function trackEvent(eventName, properties) {
    if (typeof window !== 'undefined' && window.analytics) {
        window.analytics.track(eventName, properties ?? {});
    }
}
// Monitoring event tracking
export function trackMonitoringEvent(eventName, properties) {
    if (typeof window !== 'undefined' && window.analytics) {
        window.analytics.track(eventName, properties);
    }
}
// Error tracking (logs locally; extend to forward to Sentry if needed)
export function trackError(error, properties) {
    console.error('[Monitoring Error]:', error, properties);
}
//# sourceMappingURL=monitoring.config.js.map