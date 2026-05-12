export type TrackingProperties = Record<string, string | number | boolean | undefined>;
interface Analytics {
    track: (eventName: string, properties: TrackingProperties) => void;
}
declare global {
    interface Window {
        analytics?: Analytics;
    }
}
export declare const initializeMonitoring: () => void;
export declare enum ChatMetric {
    MessageSent = "chat.message.sent",
    MessageReceived = "chat.message.received",
    SessionStarted = "chat.session.started",
    SessionEnded = "chat.session.ended",
    ErrorOccurred = "chat.error.occurred"
}
export declare function trackChatMetric(metric: string, value: number, tags?: Record<string, string>): void;
export declare function trackChatEvent(metric: ChatMetric, value: number, tags?: Record<string, string>): void;
export declare function trackEvent(eventName: string, properties?: TrackingProperties): void;
export declare function trackMonitoringEvent(eventName: string, properties: TrackingProperties): void;
export declare function trackError(error: Error, properties?: Record<string, unknown>): void;
export {};
