import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  createRecommendationTracker,
  observeImpression,
} from './track-recommendation'

function mockFetch() {
  const calls: { body: string; init?: RequestInit }[] = []
  const fn = vi.fn(async (_url: string, init?: RequestInit) => {
    calls.push({ body: String(init?.body ?? ''), init })
    return new Response(JSON.stringify({ ok: true, logged: 1 }), { status: 200 })
  })
  vi.stubGlobal('fetch', fn)
  return { fn, calls }
}

describe('createRecommendationTracker', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    mockFetch()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('batches impressions and flushes on the debounce timer', async () => {
    const tracker = createRecommendationTracker('home_carousel', 'hybrid')
    tracker.impression('wv-pt-1', 1)
    tracker.impression('wv-pt-2', 2)
    expect(tracker.pendingCount()).toBe(2)
    expect(global.fetch).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(2100)

    expect(global.fetch).toHaveBeenCalledTimes(1)
    const body = JSON.parse(vi.mocked(global.fetch).mock.calls[0]![1]!.body as string)
    expect(body.events).toHaveLength(2)
    expect(body.events[0]).toMatchObject({
      eventType: 'impression',
      itemId: 'wv-pt-1',
      surface: 'home_carousel',
      model: 'hybrid',
      position: 1,
    })
  })

  it('flushes clicks immediately', async () => {
    const tracker = createRecommendationTracker('search')
    tracker.impression('wv-pt-9', 4)
    await tracker.click('wv-pt-9', 4)

    expect(global.fetch).toHaveBeenCalledTimes(1)
    const body = JSON.parse(vi.mocked(global.fetch).mock.calls[0]![1]!.body as string)
    expect(body.events.map((e: { eventType: string }) => e.eventType)).toEqual([
      'impression',
      'click',
    ])
  })

  it('flushes immediately when the batch size is reached', async () => {
    const tracker = createRecommendationTracker('home_carousel')
    for (let i = 0; i < 20; i++) {
      tracker.impression(`wv-pt-${i}`, i)
    }
    expect(tracker.pendingCount()).toBe(0)
    expect(global.fetch).toHaveBeenCalledTimes(1)
  })

  it('never throws when fetch fails', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => {
      throw new Error('network down')
    }))
    const tracker = createRecommendationTracker('chat')

    expect(() => tracker.click('wv-pt-3', 1)).not.toThrow()
    await Promise.resolve()
    expect(tracker.pendingCount()).toBe(0)
  })

  it('dismiss events flush immediately with metadata', async () => {
    const tracker = createRecommendationTracker('home_carousel', 'embedding')
    await tracker.dismiss('wv-pt-5', 7, { reason: 'not-interested' })

    const body = JSON.parse(vi.mocked(global.fetch).mock.calls[0]![1]!.body as string)
    expect(body.events[0]).toMatchObject({
      eventType: 'dismiss',
      itemId: 'wv-pt-5',
      position: 7,
      metadata: { reason: 'not-interested' },
    })
  })
})

describe('observeImpression', () => {
  it('falls back to immediate impression without IntersectionObserver support', () => {
    // vitest.setup.ts defines window.IntersectionObserver (writable but not
    // configurable), so plain assignment is the only way to unset it.
    const g = globalThis as unknown as { IntersectionObserver?: unknown }
    const originalIO = g.IntersectionObserver
    g.IntersectionObserver = undefined

    try {
      const tracker = createRecommendationTracker('home_carousel')
      const el = document.createElement('div')
      el.setAttribute('data-rec-item-id', 'wv-pt-42')

      observeImpression(el, tracker, 3)

      expect(tracker.pendingCount()).toBe(1)
    } finally {
      g.IntersectionObserver = originalIO
    }
  })

  it('tracks an element only once even if observed repeatedly', () => {
    const tracker = createRecommendationTracker('home_carousel')
    const el = document.createElement('div')
    el.setAttribute('data-rec-item-id', 'wv-pt-7')

    observeImpression(el, tracker, 1)
    observeImpression(el, tracker, 1)
    observeImpression(el, tracker, 1)

    expect(tracker.pendingCount()).toBeLessThanOrEqual(1)
  })

  it('is a no-op for null elements', () => {
    const tracker = createRecommendationTracker('home_carousel')
    observeImpression(null, tracker, 1)
    expect(tracker.pendingCount()).toBe(0)
  })
})
