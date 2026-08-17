import { describe, expect, it } from 'vitest'
import {
  decodeTravelPreferencesCompact,
  encodeTravelPreferencesCompact,
} from './travel-preferences-query'
import type { CompactTravelPreferences } from './preference-match'

describe('travel-preferences-query', () => {
  it('round-trips a compact preferences object', () => {
    const prefs: CompactTravelPreferences = {
      travelStyles: ['cultural'],
      preferredDestinations: ['lisboa', 'porto'],
      activityTypes: ['city', 'food'],
      pacePreference: 'relaxed',
      budgetRange: [100, 250],
      dailyBudgetProfile: 'conforto',
      cabinClass: 'economy',
    }

    const encoded = encodeTravelPreferencesCompact(prefs)
    const decoded = decodeTravelPreferencesCompact(encoded)

    expect(encoded).not.toContain('=')
    expect(encoded).not.toContain('+')
    expect(decoded).toEqual(prefs)
  })

  it('returns null for empty or garbage input', () => {
    expect(decodeTravelPreferencesCompact(null)).toBeNull()
    expect(decodeTravelPreferencesCompact('')).toBeNull()
    expect(decodeTravelPreferencesCompact('not-base64-url')).toBeNull()
  })
})