import {
  getEnv
} from "./chunk-QYGYBXGO.js";

// src/config/metrics.config.ts
var SUCCESS_METRICS = {
  codebase: {
    duplicatedCode: { target: 0, baseline: 60, unit: "%" },
    bundleSize: { target: 30, baseline: 45, unit: "KB" },
    testCoverage: { target: 85, baseline: 45, unit: "%" },
    buildTime: { target: 30, baseline: 45, unit: "seconds" }
  },
  performance: {
    ttfb: { target: 100, baseline: 180, unit: "ms" },
    tti: { target: 200, baseline: 350, unit: "ms" },
    fcp: { target: 150, baseline: 250, unit: "ms" },
    cls: { target: 0.1, baseline: 0.25, unit: "score" }
  },
  quality: {
    errorRate: { target: 0.1, baseline: 0.5, unit: "%" },
    crashFreeRate: { target: 99.9, baseline: 98.5, unit: "%" },
    apiLatency: { target: 100, baseline: 150, unit: "ms" }
  }
};

// src/config/monitoring.config.ts
import { init, browserTracingIntegration } from "@sentry/react";
var initializeMonitoring = () => {
  init({
    dsn: getEnv("SENTRY_DSN"),
    integrations: [
      browserTracingIntegration()
    ],
    tracesSampleRate: 1,
    beforeSend(event) {
      if (event.user) {
        delete event.user.email;
      }
      return event;
    }
  });
};
var ChatMetric = /* @__PURE__ */ ((ChatMetric2) => {
  ChatMetric2["MessageSent"] = "chat.message.sent";
  ChatMetric2["MessageReceived"] = "chat.message.received";
  ChatMetric2["SessionStarted"] = "chat.session.started";
  ChatMetric2["SessionEnded"] = "chat.session.ended";
  ChatMetric2["ErrorOccurred"] = "chat.error.occurred";
  return ChatMetric2;
})(ChatMetric || {});
function trackChatMetric(metric, value, tags) {
  if (typeof window !== "undefined" && window.analytics) {
    const properties = { value, ...tags };
    window.analytics.track(metric, properties);
  }
}
function trackChatEvent(metric, value, tags) {
  trackChatMetric(metric, value, tags);
}
function trackEvent(eventName, properties) {
  if (typeof window !== "undefined" && window.analytics) {
    window.analytics.track(eventName, properties ?? {});
  }
}
function trackMonitoringEvent(eventName, properties) {
  if (typeof window !== "undefined" && window.analytics) {
    window.analytics.track(eventName, properties);
  }
}
function trackError(error, properties) {
  console.error("[Monitoring Error]:", error, properties);
}

export {
  SUCCESS_METRICS,
  initializeMonitoring,
  ChatMetric,
  trackChatMetric,
  trackChatEvent,
  trackEvent,
  trackMonitoringEvent,
  trackError
};
//# sourceMappingURL=chunk-OIADZH25.js.map