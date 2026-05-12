// =============================================================================
// Types
// =============================================================================
// =============================================================================
// Tracking Helpers
// =============================================================================
export function trackGtagEvent(action, category, label, value) {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('event', action, {
            event_category: category,
            event_label: label,
            value,
        });
    }
}
//# sourceMappingURL=analytics.js.map