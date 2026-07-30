/**
 * Analytics tracker for travel preferences form funnel.
 * Logs PreferenceEvent records for step transitions, form starts, and submissions.
 */
// ── Types ──────────────────────────────────────────────────────────
export interface StepCompletedEvent {
  step: number;
  durationMs: number;
  fieldsFilled: number;
  stepLabel: string;
}

export interface FormStartedEvent {
  totalSteps: number;
}

export interface FormSubmittedEvent {
  totalDurationMs: number;
  travelStyles: string[];
  budgetRange: [number, number];
  destinationsCount: number;
}

export type PreferenceEventData =
  | { type: 'form_started'; data: FormStartedEvent }
  | { type: 'step_completed'; data: StepCompletedEvent }
  | { type: 'form_submitted'; data: FormSubmittedEvent };

// ── Session management ────────────────────────────────────────────
function getSessionId(): string {
  if (typeof window === 'undefined') return 'server';
  let id = sessionStorage.getItem('pref_session_id');
  if (!id) {
    id = crypto.randomUUID?.() ?? Math.random().toString(36).slice(2);
    sessionStorage.setItem('pref_session_id', id);
  }
  return id;
}

// ── Core tracking ─────────────────────────────────────────────────
export async function trackPreferenceEvent(
  event: PreferenceEventData,
): Promise<void> {
  try {
    const sessionId = getSessionId();
    const payload = {
      sessionId,
      preferenceType: event.type,
      action: event.type,
      newValue: 'data' in event ? event.data : event,
      context: {
        sessionId,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
        timestamp: new Date().toISOString(),
      },
    };

    await fetch('/api/user/preferences/analytics', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    // Analytics should never block the user flow
  }
}

// ── Hook helpers ──────────────────────────────────────────────────
export function createFormTracker() {
  const startTime = Date.now();
  let stepStartTime = startTime;

  return {
    trackStart(totalSteps: number) {
      return trackPreferenceEvent({
        type: 'form_started',
        data: { totalSteps },
      });
    },

    trackStepCompletion(step: number, stepLabel: string, fieldsFilled: number) {
      const now = Date.now();
      const durationMs = now - stepStartTime;
      stepStartTime = now;
      return trackPreferenceEvent({
        type: 'step_completed',
        data: { step, durationMs, fieldsFilled, stepLabel },
      });
    },

    trackSubmission(
      travelStyles: string[],
      budgetRange: [number, number],
      destinationsCount: number,
    ) {
      return trackPreferenceEvent({
        type: 'form_submitted',
        data: {
          totalDurationMs: Date.now() - startTime,
          travelStyles,
          budgetRange,
          destinationsCount,
        },
      });
    },
  };
}
