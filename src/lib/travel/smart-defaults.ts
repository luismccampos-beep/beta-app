/**
 * Smart defaults for travel preferences – detects country, currency,
 * and languages from browser APIs with optional GeoIP fallback.
 * 
 * IMPORTANT: This file uses browser APIs (navigator, Intl) and must
 * only be imported from client components.
 */

'use client';

const LANG_TO_PROFICIENCY: Record<string, string> = {
  pt: 'native',
  en: 'fluent',
  es: 'fluent',
  fr: 'fluent',
  de: 'fluent',
  it: 'fluent',
};

const COUNTRY_TO_CURRENCY: Record<string, string> = {
  PT: 'EUR',
  BR: 'BRL',
  US: 'USD',
  GB: 'GBP',
  JP: 'JPY',
  CN: 'CNY',
  AU: 'AUD',
  CA: 'CAD',
  CH: 'CHF',
  IN: 'INR',
  SG: 'SGD',
  MX: 'MXN',
  FR: 'EUR',
  DE: 'EUR',
  IT: 'EUR',
  ES: 'EUR',
  NL: 'EUR',
  BE: 'EUR',
  AT: 'EUR',
  IE: 'EUR',
  LU: 'EUR',
  FI: 'EUR',
  GR: 'EUR',
  DK: 'DKK',
  SE: 'SEK',
  NO: 'NOK',
  PL: 'PLN',
  CZ: 'CZK',
  HU: 'HUF',
  RO: 'RON',
  BG: 'BGN',
  HR: 'EUR',
  KR: 'KRW',
  RU: 'RUB',
  AE: 'AED',
  SA: 'SAR',
  ZA: 'ZAR',
  NZ: 'NZD',
  AR: 'ARS',
  CL: 'CLP',
  CO: 'COP',
  PE: 'PEN',
  UY: 'UYU',
};

const COUNTRY_NAME_MAP: Record<string, string> = {
  PT: 'Portugal',
  BR: 'Brazil',
  US: 'United States',
  GB: 'United Kingdom',
  JP: 'Japan',
  CN: 'China',
  AU: 'Australia',
  CA: 'Canada',
  CH: 'Switzerland',
  IN: 'India',
  SG: 'Singapore',
  MX: 'Mexico',
  FR: 'France',
  DE: 'Germany',
  IT: 'Italy',
  ES: 'Spain',
  NL: 'Netherlands',
  BE: 'Belgium',
  AT: 'Austria',
  IE: 'Ireland',
  LU: 'Luxembourg',
  FI: 'Finland',
  GR: 'Greece',
  DK: 'Denmark',
  SE: 'Sweden',
  NO: 'Norway',
  PL: 'Poland',
  CZ: 'Czech Republic',
  HU: 'Hungary',
  RO: 'Romania',
  BG: 'Bulgaria',
  HR: 'Croatia',
  KR: 'South Korea',
  RU: 'Russia',
  AE: 'United Arab Emirates',
  SA: 'Saudi Arabia',
  ZA: 'South Africa',
  NZ: 'New Zealand',
  AR: 'Argentina',
  CL: 'Chile',
  CO: 'Colombia',
  PE: 'Peru',
  UY: 'Uruguay',
};

export interface SmartDefaults {
  nationality: string;
  currency: string;
  languages: { language: string; proficiency: string }[];
  countryCode: string;
}

function getCountryFromLocale(): string | null {
  try {
    const locale = navigator.language; // e.g., "pt-PT"
    const region = new Intl.Locale(locale).region ?? null;
    return region;
  } catch {
    return null;
  }
}

function getBrowserLanguages(): { language: string; proficiency: string }[] {
  const langs: { language: string; proficiency: string }[] = [];
  try {
    const browserLangs = navigator.languages ?? [navigator.language];
    const seen = new Set<string>();
    for (const langTag of browserLangs) {
      try {
        const locale = new Intl.Locale(langTag);
        const lang = locale.language;
        if (!lang || seen.has(lang)) continue;
        seen.add(lang);
        langs.push({
          language: lang,
          proficiency: LANG_TO_PROFICIENCY[lang] ?? 'intermediate',
        });
      } catch {
        // skip malformed tags
      }
    }
  } catch {
    // fallback
  }
  return langs;
}

function mapCountryCodeToCurrency(code: string): string {
  return COUNTRY_TO_CURRENCY[code] ?? 'EUR';
}

function mapCountryCodeToName(code: string): string {
  return COUNTRY_NAME_MAP[code] ?? '';
}

/**
 * Synchronous smart defaults from browser APIs.
 * Use this first for instant UX, then optionally refine with GeoIP.
 */
export function getSmartDefaultsSync(): SmartDefaults {
  const countryCode = getCountryFromLocale() ?? 'PT';
  return {
    nationality: mapCountryCodeToName(countryCode),
    currency: mapCountryCodeToCurrency(countryCode),
    languages: getBrowserLanguages(),
    countryCode,
  };
}

/**
 * Async GeoIP fallback to refine country detection.
 * Only call if the sync detection gives an unexpected result.
 */
export async function getGeoIPCountry(): Promise<string | null> {
  try {
    const res = await fetch('https://ipapi.co/json/');
    if (!res.ok) return null;
    const data: unknown = await res.json();
    if (
      data &&
      typeof data === 'object' &&
      'country_code' in data &&
      typeof (data as { country_code: unknown }).country_code === 'string'
    ) {
      return (data as { country_code: string }).country_code;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Full async smart defaults: sync browser + GeoIP fallback.
 */
export async function getSmartDefaults(): Promise<SmartDefaults> {
  const sync = getSmartDefaultsSync();

  // Try GeoIP for more accuracy
  const geoCountry = await getGeoIPCountry();
  if (geoCountry && geoCountry !== sync.countryCode) {
    return {
      nationality: mapCountryCodeToName(geoCountry),
      currency: mapCountryCodeToCurrency(geoCountry),
      languages: sync.languages,
      countryCode: geoCountry,
    };
  }

  return sync;
}

/**
 * Infer cabin class and budget profile from travel styles.
 * Call this after the user picks their travel styles.
 */
export function inferFromTravelStyles(travelStyles: string[]): {
  cabinClass: string;
  dailyBudgetProfile: 'mochileiro' | 'conforto' | 'luxo';
} {
  const hasLuxury = travelStyles.includes('luxury');
  const hasBackpacking = travelStyles.includes('adventure');
  const hasBusiness = travelStyles.includes('business');

  if (hasLuxury) {
    return { cabinClass: 'business', dailyBudgetProfile: 'luxo' };
  }
  if (hasBusiness) {
    return { cabinClass: 'premium_economy', dailyBudgetProfile: 'conforto' };
  }
  if (hasBackpacking) {
    return { cabinClass: 'economy', dailyBudgetProfile: 'mochileiro' };
  }

  return { cabinClass: 'economy', dailyBudgetProfile: 'conforto' };
}

/**
 * Currency symbol lookup.
 */
export function getCurrencySymbol(code: string): string {
  const SYMBOLS: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    BRL: 'R$',
    JPY: '¥',
    CNY: '¥',
    AUD: '$',
    CAD: '$',
    CHF: 'Fr',
    INR: '₹',
    SGD: '$',
    MXN: '$',
  };
  return SYMBOLS[code] ?? code;
}
