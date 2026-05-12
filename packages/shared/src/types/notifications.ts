/**
 * @fileoverview Notification-related shared types for use across frontend and backend.
 * This file defines the core data structures, WebSocket events, and API payloads
 * for the notification system, ensuring type safety and consistency.
 * @version 2.0.0
 * @author Your Name/Team
 */

// ===================================================================================
// 1. CORE DATA STRUCTURES
// ===================================================================================

/**
 * Represents the priority level of a notification.
 * Higher priority notifications should be displayed more prominently.
 */
export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

/**
 * Represents the read status of a notification from the user's perspective.
 */
export type NotificationStatus = 'unread' | 'read' | 'archived';

/**
 * Represents the domain or feature area from which the notification originated.
 * Useful for routing, filtering, and displaying contextual icons.
 */
export type NotificationDomain = 'system' | 'chat' | 'booking' | 'trip' | 'payment' | 'marketing';

/**
 * Represents the visual kind or intent of the notification.
 * Maps directly to UI components (e.g., toast, alert).
 */
export type NotificationKind = 'info' | 'success' | 'warning' | 'error';

/**
 * A generic, extensible metadata record for notifications.
 * Using `unknown` is safer than `any` as it forces type-checking before use.
 */
export type NotificationMeta = Record<string, unknown>;

/**
 * The complete and canonical data structure for a single notification.
 * This is the "source of truth" used between the backend and frontend.
 */
export interface NotificationData<TMeta = NotificationMeta> {
  /** A unique identifier for the notification, typically a UUID. */
  id: string;
  /** The ID of the user the notification is for. `null` for system-wide broadcasts. */
  userId: string | null;
  /** The main title or headline of the notification. */
  title: string;
  /** The detailed message body of the notification. */
  message: string;
  /** The visual kind of the notification, dictating its appearance. */
  kind: NotificationKind;
  /** The domain the notification belongs to. */
  domain: NotificationDomain;
  /** The priority level, affecting display order and prominence. */
  priority: NotificationPriority;
  /** The current read status of the notification. Defaults to 'unread' on creation. */
  status: NotificationStatus;
  /** The ISO 8601 timestamp of when the notification was created. */
  createdAt: string; // e.g., "2023-10-27T10:00:00.000Z"
  /** An optional URL (absolute or relative) for the notification's call-to-action. */
  actionUrl?: string;
  /** An optional object for extensible metadata specific to the domain. */
  meta?: TMeta;
}

// ===================================================================================
// 2. UI & HELPER TYPES
// ===================================================================================

/**
 * A minimal, read-only shape of a notification used in UI components.
 * It's derived from `NotificationData` to ensure consistency and avoid duplication.
 */
export type UINotificationItem = Pick<
  NotificationData,
  'id' | 'title' | 'message' | 'kind' | 'priority' | 'status' | 'createdAt' | 'actionUrl'
>;

/**
 * A utility type to create a filter object for fetching or querying notifications.
 */
export type NotificationFilter = {
  status?: NotificationStatus[];
  domain?: NotificationDomain[];
  priority?: NotificationPriority[];
  limit?: number;
  offset?: number;
};

// ===================================================================================
// 3. WEBSOCKET EVENT SYSTEM (Discriminated Unions)
// ===================================================================================

/**
 * A map of all possible WebSocket event names to their specific payload shapes.
 * Using a discriminated union provides maximum type safety and autocompletion.
 */
export type WebSocketEventMap = {
  NOTIFICATION: { data: NotificationData };
  NOTIFICATION_READ: { data: { notificationId: string; status: 'read' } };
  BOOKING_UPDATE: { data: { bookingId: string; status: string } };
  TRIP_UPDATE: { data: { tripId: string; status: string; location?: { lat: number; lng: number } } };
  PAYMENT_STATUS: { data: { paymentId: string; status: 'succeeded' | 'failed' | 'pending' } };
  SYSTEM_ANNOUNCEMENT: { data: { title: string; message: string } };
};

/** Extracts the event names (keys) from the WebSocketEventMap. */
export type WebSocketEventName = keyof WebSocketEventMap;

/** Represents a single, type-safe WebSocket event message. */
export type WebSocketEvent<T extends WebSocketEventName = WebSocketEventName> = {
  event: T;
} & WebSocketEventMap[T];

// ===================================================================================
// 4. API PAYLOAD TYPES
// ===================================================================================

/** Represents the payload for a request to mark all notifications as read. */
export type MarkAllReadRequest = {
  userId: string;
};

/** Represents the response from a "mark all as read" operation. */
export type MarkAllReadResponse = {
  /** Indicates if the operation was successful. */
  success: boolean;
  /** The total number of unread notifications remaining for the user. */
  unreadCount: number;
  /** A list of notification IDs that were updated. */
  updatedIds: string[];
  /** An optional success message to display to the user. */
  message?: string;
};

/** Represents the paginated response when fetching a list of notifications. */
export type GetNotificationsResponse = {
  /** The array of notification items for the current page. */
  notifications: NotificationData[];
  /** The total number of notifications that match the filter. */
  totalCount: number;
  /** The current page number. */
  page: number;
  /** The number of notifications per page. */
  pageSize: number;
};

// ===================================================================================
// 5. UTILITY CONSTANTS & HELPERS
// ===================================================================================

/**
 * A helper object to map priority levels to numeric values for sorting.
 * Higher numbers indicate higher priority.
 */
export const PRIORITY_WEIGHT: Record<NotificationPriority, number> = {
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
export const sortNotificationsByPriority = (
  a: UINotificationItem,
  b: UINotificationItem
): number => {
  const priorityDiff = PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority];
  if (priorityDiff !== 0) {
    return priorityDiff;
  }
  // If priorities are the same, sort by newest date first
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
};
