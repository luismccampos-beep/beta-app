import type { TravelPreferences } from '../../app/components/pages/EnhancedTravelPreferencesForm';
import type { CompactTravelPreferences } from './preference-match';

export const TRAVEL_PREFS_STORAGE_KEY = 'akmleva:travelPrefsCompact';

export function toCompactTravelPreferences(p: TravelPreferences): CompactTravelPreferences {
  return {
    travelStyles: p.travelStyles?.length ? [...p.travelStyles] : undefined,
    preferredDestinations: p.preferredDestinations?.length ? [...p.preferredDestinations] : undefined,
    activityTypes: p.activityTypes?.length ? [...p.activityTypes] : undefined,
    travelPurpose: p.travelPurpose?.length ? [...p.travelPurpose] : undefined,
    pacePreference: p.pacePreference || undefined,
    budgetRange:
      Array.isArray(p.budgetRange) && p.budgetRange.length >= 2
        ? [p.budgetRange[0]!, p.budgetRange[1]!]
        : undefined,
    budgetPriority: p.budgetPriority || undefined,
    sustainabilityLevel: p.sustainabilityLevel || undefined,
    ecoPreferences: p.ecoPreferences?.length ? [...p.ecoPreferences] : undefined,
    accommodationType: p.accommodationType?.length ? [...p.accommodationType] : undefined,
    experienceTypes: p.experienceTypes?.length ? [...p.experienceTypes] : undefined,
    cabinClass: p.cabinClass || undefined,
  };
}

function base64UrlEncode(bytes: Uint8Array): string {
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  const b64 =
    typeof btoa !== 'undefined'
      ? btoa(bin)
      : Buffer.from(bytes).toString('base64');
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64UrlDecode(str: string): Uint8Array {
  const pad = str.length % 4 === 0 ? '' : '='.repeat(4 - (str.length % 4));
  const b64 = str.replace(/-/g, '+').replace(/_/g, '/') + pad;
  const bin =
    typeof atob !== 'undefined'
      ? atob(b64)
      : Buffer.from(b64, 'base64').toString('binary');
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export function encodeTravelPreferencesCompact(prefs: CompactTravelPreferences): string {
  const json = JSON.stringify(prefs);
  const bytes = new TextEncoder().encode(json);
  return base64UrlEncode(bytes);
}

export function decodeTravelPreferencesCompact(encoded: string | null | undefined): CompactTravelPreferences | null {
  if (!encoded?.trim()) return null;
  try {
    const bytes = base64UrlDecode(encoded.trim());
    const json = new TextDecoder().decode(bytes);
    const parsed = JSON.parse(json) as CompactTravelPreferences;
    if (!parsed || typeof parsed !== 'object') return null;
    return parsed;
  } catch {
    return null;
  }
}

export function storeTravelPreferencesCompact(prefs: CompactTravelPreferences): void {
  if (typeof sessionStorage === 'undefined') return;
  try {
    sessionStorage.setItem(TRAVEL_PREFS_STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    /* quota */
  }
}

export function readStoredTravelPreferences(): CompactTravelPreferences | null {
  if (typeof sessionStorage === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(TRAVEL_PREFS_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CompactTravelPreferences;
  } catch {
    return null;
  }
}
