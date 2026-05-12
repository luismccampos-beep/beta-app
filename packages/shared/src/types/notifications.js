/**
 * @fileoverview Notification-related shared types for use across frontend and backend.
 * This file defines the core data structures, WebSocket events, and API payloads
 * for the notification system, ensuring type safety and consistency.
 * @version 2.0.0
 * @author Your Name/Team
 */
// ===================================================================================
// 5. UTILITY CONSTANTS & HELPERS
// ===================================================================================
/**
 * A helper object to map priority levels to numeric values for sorting.
 * Higher numbers indicate higher priority.
 */
export const PRIORITY_WEIGHT = {
    low: 1,
    medium: 2,
    high: 3,
    urgent: 4,
};
/**
 * A helper function to sort notifications by priority (highest first) and then by creation date (newest first).
 * @param a - The first notification.
 * @param b - The second notification.
 * @returns A number for use with Array.prototype.sort.
 */
export const sortNotificationsByPriority = (a, b) => {
    const priorityDiff = PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority];
    if (priorityDiff !== 0) {
        return priorityDiff;
    }
    // If priorities are the same, sort by newest date first
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
};
//# sourceMappingURL=notifications.js.map