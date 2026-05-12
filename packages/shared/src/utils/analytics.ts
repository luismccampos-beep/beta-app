// =============================================================================
// Types
// =============================================================================

export interface GtagEventParams {
  event_category?: string;
  event_label?: string;
  value?: number;
  non_interaction?: boolean;
  [key: string]: string | number | boolean | undefined;
}

export type GtagConfigParams = Record<string, string | boolean | number | undefined>;
export type GtagConsentParams = Record<string, string>;

export type GtagAction =
  | { command: 'event'; action: string; params?: GtagEventParams }
  | { command: 'config'; action: string; params?: GtagConfigParams }
  | { command: 'js'; action: Date; params?: never }
  | { command: 'consent'; action: 'default' | 'update'; params: GtagConsentParams }
  | { command: 'set'; action: string; params: string | boolean | number };

/** Single-signature gtag that accepts any valid command without overloads. */
export type GtagFunction = (
  command: GtagAction['command'],
  action: string | Date,
  params?: GtagEventParams | GtagConfigParams | GtagConsentParams | string | boolean | number,
) => void;

// =============================================================================
// Global Augmentation
// =============================================================================

declare global {
  interface Window {
    gtag?: GtagFunction;
  }
}

// =============================================================================
// Tracking Helpers
// =============================================================================

export function trackGtagEvent(
  action: string,
  category: string,
  label?: string,
  value?: number,
): void {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value,
    });
  }
}