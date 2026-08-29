/**
 * Client-side recommendation feedback loop.
 *
 * Batches impression/click/dismiss events and ships them to
 * POST /api/ai/recommendation-events. Events are fire-and-forget:
 * failures are swallowed so tracking never breaks the UI.
 *
 * Usage:
 *   const tracker = createRecommendationTracker('home_carousel', 'hybrid');
 *   tracker.impression('wv-pt-123', 1);
 *   tracker.click('wv-pt-123', 1);
 *
 * For scroll-in impressions:
 *   const el = document.querySelector('[data-rec-item-id="wv-pt-123"]');
 *   observeImpression(el, tracker, 3);
 */

export type RecommendationEventType = 'impression' | 'click' | 'dismiss' | 'dwell' | 'save'

export interface RecommendationEventInput {
  eventType: RecommendationEventType
  itemId: string
  surface: string
  position: number
  sessionId?: string
  model?: string
  score?: number
  /** Seconds spent on the item (dwell events). */
  dwellSeconds?: number
  /** Machine-readable dismiss reason: "too_expensive" | "not_my_style" | "been_there" | ... */
  reason?: string
  metadata?: Record<string, unknown>
}

interface TrackerOptions {
  /** Where the recommendation is shown, e.g. "home_carousel". */
  surface: string
  /** Ranking method served, e.g. "hybrid" | "embedding". */
  model?: string
  /** Flush interval in ms (default 2000). */
  flushIntervalMs?: number
  /** Queue size that triggers an immediate flush (default 20). */
  batchSize?: number
}

const ENDPOINT = '/api/ai/recommendation-events'
const SESSION_KEY = 'rec_tracking_session'
const DEFAULT_FLUSH_INTERVAL_MS = 2_000
const DEFAULT_BATCH_SIZE = 20

function getSessionId(): string {
  try {
    let sessionId = sessionStorage.getItem(SESSION_KEY)
    if (!sessionId) {
      sessionId =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `s-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
      sessionStorage.setItem(SESSION_KEY, sessionId)
    }
    return sessionId
  } catch {
    return 'no-session'
  }
}

export class RecommendationTracker {
  private queue: RecommendationEventInput[] = []
  private timer: ReturnType<typeof setTimeout> | null = null

  constructor(private readonly options: TrackerOptions) {}

  impression(itemId: string, position: number, metadata?: Record<string, unknown>): void {
    this.enqueue({ eventType: 'impression', itemId, position, metadata })
  }

  click(itemId: string, position: number, metadata?: Record<string, unknown>): void {
    this.enqueue({ eventType: 'click', itemId, position, metadata })
    void this.flush()
  }

  /** Fire when the user has genuinely looked at the item (e.g. after N seconds visible). */
  dwell(itemId: string, position: number, seconds: number, metadata?: Record<string, unknown>): void {
    this.enqueue({ eventType: 'dwell', itemId, position, dwellSeconds: seconds, metadata })
  }

  /** Fire when the user saves the item to a trip/itinerary (top-intent signal). */
  save(itemId: string, position: number, metadata?: Record<string, unknown>): void {
    this.enqueue({ eventType: 'save', itemId, position, metadata })
    void this.flush()
  }

  /** Negative signal with a machine-readable reason for training. */
  dismissReasoned(itemId: string, position: number, reason: string, metadata?: Record<string, unknown>): void {
    this.enqueue({ eventType: 'dismiss', itemId, position, reason, metadata })
    void this.flush()
  }

  dismiss(itemId: string, position: number, metadata?: Record<string, unknown>): void {
    this.enqueue({ eventType: 'dismiss', itemId, position, metadata })
    void this.flush()
  }

  enqueue(event: Pick<RecommendationEventInput, 'eventType' | 'itemId' | 'position'> & {
    metadata?: Record<string, unknown>
    dwellSeconds?: number
    reason?: string
  }): void {
    this.queue.push({
      ...event,
      surface: this.options.surface,
      model: this.options.model,
      sessionId: getSessionId(),
    })
    if (this.queue.length >= (this.options.batchSize ?? DEFAULT_BATCH_SIZE)) {
      void this.flush()
      return
    }
    if (!this.timer) {
      this.timer = setTimeout(() => void this.flush(), this.options.flushIntervalMs ?? DEFAULT_FLUSH_INTERVAL_MS)
    }
  }

  async flush(): Promise<void> {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
    if (this.queue.length === 0) return

    const events = this.queue.splice(0, this.queue.length)
    try {
      await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ events }),
        cache: 'no-store',
        keepalive: true,
      })
    } catch {
      // Fire-and-forget: drop failed batches silently.
    }
  }

  /** Send whatever is queued during page unload (best effort). */
  flushOnUnload(): void {
    if (this.queue.length === 0 || typeof navigator === 'undefined' || !navigator.sendBeacon) return
    const events = this.queue.splice(0, this.queue.length)
    const blob = new Blob([JSON.stringify({ events })], { type: 'application/json' })
    navigator.sendBeacon(ENDPOINT, blob)
  }

  pendingCount(): number {
    return this.queue.length
  }
}

/** Create a tracker bound to one UI surface. */
export function createRecommendationTracker(
  surface: string,
  model?: string,
  options?: Partial<Omit<TrackerOptions, 'surface' | 'model'>>,
): RecommendationTracker {
  const tracker = new RecommendationTracker({
    surface,
    model,
    ...options,
  })
  if (typeof window !== 'undefined') {
    window.addEventListener('pagehide', () => tracker.flushOnUnload(), { once: true })
  }
  return tracker
}

const impressionSeen = new WeakSet<Element>()

/**
 * Fire a single impression when the element becomes ≥50% visible.
 * Safe to call on every render — each element is only tracked once.
 */
export function observeImpression(
  element: Element | null,
  tracker: RecommendationTracker,
  position: number,
): void {
  if (!element || impressionSeen.has(element)) return

  if (typeof IntersectionObserver === 'undefined') {
    impressionSeen.add(element)
    tracker.impression(element.getAttribute('data-rec-item-id') ?? '', position)
    return
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        impressionSeen.add(entry.target)
        observer.disconnect()
        tracker.impression(entry.target.getAttribute('data-rec-item-id') ?? '', position)
      }
    },
    { threshold: 0.5 },
  )
  observer.observe(element)
}
