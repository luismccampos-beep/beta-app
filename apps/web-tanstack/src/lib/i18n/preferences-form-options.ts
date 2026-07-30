/** Stable option ids stored in travel preferences JSON */

export const TRAVEL_FREQUENCY_IDS = ['weekly', 'monthly', 'quarterly', 'yearly'] as const;

export const TRAVEL_PURPOSE_IDS = ['business', 'leisure', 'conference', 'family'] as const;

export const BUDGET_PRIORITY_IDS = [
  'maximum-savings',
  'value',
  'balanced',
  'premium',
  'luxury',
] as const;

export const CABIN_CLASS_IDS = ['economy', 'premium_economy', 'business', 'first'] as const;

export const SEAT_PREFERENCE_IDS = ['window', 'aisle', 'middle', 'any'] as const;

export const MEAL_PREFERENCE_IDS = [
  'regular',
  'vegetarian',
  'vegan',
  'halal',
  'kosher',
  'gluten-free',
  'low-sodium',
] as const;

export const ROOM_TYPE_IDS = ['single', 'double', 'twin', 'suite', 'executive', 'presidential'] as const;

export const PACE_PREFERENCE_IDS = ['relaxed', 'moderate', 'active', 'adventure'] as const;

export const SUSTAINABILITY_LEVEL_IDS = ['low', 'medium', 'high', 'essential'] as const;

export const PRIVACY_LEVEL_IDS = ['minimal', 'standard', 'high', 'maximum'] as const;

export const ACTIVITY_TYPE_IDS = [
  'adventure',
  'cultural',
  'beach',
  'city',
  'hiking',
  'wildlife',
  'food',
  'shopping',
  'historical',
  'photography',
  'water',
  'nightlife',
] as const;

export const EXPERIENCE_TYPE_IDS = [
  'guidedTours',
  'selfGuided',
  'groupActivities',
  'privateExperiences',
  'localImmersion',
  'luxuryExperiences',
  'budgetFriendly',
  'offTheBeatenPath',
] as const;

export const DIETARY_IDS = [
  'vegetarian',
  'vegan',
  'halal',
  'kosher',
  'glutenFree',
  'lactoseFree',
  'nutAllergy',
  'seafoodAllergy',
  'dairyFree',
  'lowCarb',
  'diabetic',
  'noRestrictions',
] as const;

export const ACCESSIBILITY_IDS = [
  'wheelchairAccess',
  'visualAssistance',
  'hearingAssistance',
  'mobilitySupport',
  'serviceAnimal',
  'specialEquipment',
] as const;

export const ECO_PREFERENCE_IDS = [
  'carbonOffsetting',
  'ecoCertifiedHotels',
  'publicTransportation',
  'localBusinesses',
  'plasticFree',
  'sustainableTours',
] as const;

export const LANGUAGE_IDS = [
  'english',
  'spanish',
  'french',
  'german',
  'italian',
  'portuguese',
  'mandarin',
  'japanese',
  'korean',
  'russian',
  'arabic',
  'hindi',
] as const;

export const NOTIFICATION_IDS = ['email', 'sms', 'push', 'whatsapp'] as const;

export const CRUISE_DESTINATION_IDS = [
  'Mediterranean',
  'Caribbean',
  'Alaska',
  'Antarctica',
  'Europe',
  'Asia',
  'Oceania',
  'NorthAmerica',
  'SouthAmerica',
  'Africa',
  'Transatlantic',
  'Baltic',
  'NorthernEurope',
] as const;

export const CRUISE_TIER_IDS = ['ultra_luxury', 'luxury', 'popular'] as const;

export const CRUISE_SHIP_TYPE_IDS = ['ocean', 'river', 'expedition'] as const;

export const CRUISE_DURATION_IDS = ['short', 'medium', 'long'] as const;

export type CruiseDurationId = (typeof CRUISE_DURATION_IDS)[number];

export const CURRENCY_CODES = [
  'USD',
  'EUR',
  'GBP',
  'BRL',
  'JPY',
  'CNY',
  'AUD',
  'CAD',
  'CHF',
  'INR',
  'SGD',
  'MXN',
] as const;

const EXPERIENCE_LEGACY: Record<string, string> = {
  'Guided Tours': 'guidedTours',
  'Self-Guided': 'selfGuided',
  'Group Activities': 'groupActivities',
  'Private Experiences': 'privateExperiences',
  'Local Immersion': 'localImmersion',
  'Luxury Experiences': 'luxuryExperiences',
  'Budget-Friendly': 'budgetFriendly',
  'Off-the-beaten-path': 'offTheBeatenPath',
};

const DIETARY_LEGACY: Record<string, string> = {
  Vegetarian: 'vegetarian',
  Vegan: 'vegan',
  Halal: 'halal',
  Kosher: 'kosher',
  'Gluten-Free': 'glutenFree',
  'Lactose-Free': 'lactoseFree',
  'Nut Allergy': 'nutAllergy',
  'Seafood Allergy': 'seafoodAllergy',
  'Dairy-Free': 'dairyFree',
  'Low Carb': 'lowCarb',
  Diabetic: 'diabetic',
  'No Restrictions': 'noRestrictions',
};

const ACCESSIBILITY_LEGACY: Record<string, string> = {
  'Wheelchair Access': 'wheelchairAccess',
  'Visual Assistance': 'visualAssistance',
  'Hearing Assistance': 'hearingAssistance',
  'Mobility Support': 'mobilitySupport',
  'Service Animal': 'serviceAnimal',
  'Special Equipment': 'specialEquipment',
};

const ECO_LEGACY: Record<string, string> = {
  'Carbon Offsetting': 'carbonOffsetting',
  'Eco-Certified Hotels': 'ecoCertifiedHotels',
  'Public Transportation': 'publicTransportation',
  'Local Businesses': 'localBusinesses',
  'Plastic-Free': 'plasticFree',
  'Sustainable Tours': 'sustainableTours',
};

const LANGUAGE_LEGACY: Record<string, string> = {
  '🇺🇸 English': 'english',
  '🇪🇸 Spanish': 'spanish',
  '🇫🇷 French': 'french',
  '🇩🇪 German': 'german',
  '🇮🇹 Italian': 'italian',
  '🇵🇹 Portuguese': 'portuguese',
  '🇨🇳 Mandarin': 'mandarin',
  '🇯🇵 Japanese': 'japanese',
  '🇰🇷 Korean': 'korean',
  '🇷🇺 Russian': 'russian',
  '🇦🇪 Arabic': 'arabic',
  '🇮🇳 Hindi': 'hindi',
};

function normalizeStringArray(
  values: string[],
  legacy: Record<string, string>,
  validIds: readonly string[],
): string[] {
  const valid = new Set(validIds);
  const out: string[] = [];
  for (const v of values) {
    const id = legacy[v] ?? v;
    if (valid.has(id) && !out.includes(id)) out.push(id);
  }
  return out;
}

function normalizeLanguages(
  langs: { language: string; proficiency: string }[],
): { language: string; proficiency: string }[] {
  return langs
    .map((l) => {
      const id = LANGUAGE_LEGACY[l.language] ?? l.language;
      return { ...l, language: id };
    })
    .filter((l) => (LANGUAGE_IDS as readonly string[]).includes(l.language));
}

/** Map legacy English labels to stable ids when loading saved preferences */
const CRUISE_DESTINATION_LEGACY: Record<string, string> = {
  Mediterranean: 'Mediterranean',
  Caribean: 'Caribbean',
  'North America': 'NorthAmerica',
  'South America': 'SouthAmerica',
  'Northern Europe': 'NorthernEurope',
};

export function normalizePreferenceOptionIds<T extends {
  experienceTypes?: string[];
  dietaryRestrictions?: string[];
  accessibility?: string[];
  ecoPreferences?: string[];
  languages?: { language: string; proficiency: string }[];
  cruiseDestinations?: string[];
  cruiseBrandNames?: string[];
  cruiseTier?: string;
  cruiseShipType?: string;
  cruiseDuration?: string;
}>(prefs: T): T {
  return {
    ...prefs,
    experienceTypes: prefs.experienceTypes
      ? normalizeStringArray(prefs.experienceTypes, EXPERIENCE_LEGACY, EXPERIENCE_TYPE_IDS)
      : prefs.experienceTypes,
    dietaryRestrictions: prefs.dietaryRestrictions
      ? normalizeStringArray(prefs.dietaryRestrictions, DIETARY_LEGACY, DIETARY_IDS)
      : prefs.dietaryRestrictions,
    accessibility: prefs.accessibility
      ? normalizeStringArray(prefs.accessibility, ACCESSIBILITY_LEGACY, ACCESSIBILITY_IDS)
      : prefs.accessibility,
    ecoPreferences: prefs.ecoPreferences
      ? normalizeStringArray(prefs.ecoPreferences, ECO_LEGACY, ECO_PREFERENCE_IDS)
      : prefs.ecoPreferences,
    languages: prefs.languages ? normalizeLanguages(prefs.languages) : prefs.languages,
    cruiseDestinations: prefs.cruiseDestinations
      ? normalizeStringArray(prefs.cruiseDestinations, CRUISE_DESTINATION_LEGACY, CRUISE_DESTINATION_IDS)
      : prefs.cruiseDestinations,
    cruiseTier:
      prefs.cruiseTier && (CRUISE_TIER_IDS as readonly string[]).includes(prefs.cruiseTier)
        ? prefs.cruiseTier
        : prefs.cruiseTier === ''
          ? ''
          : prefs.cruiseTier,
    cruiseShipType:
      prefs.cruiseShipType &&
      (CRUISE_SHIP_TYPE_IDS as readonly string[]).includes(prefs.cruiseShipType)
        ? prefs.cruiseShipType
        : prefs.cruiseShipType,
    cruiseDuration:
      prefs.cruiseDuration &&
      (CRUISE_DURATION_IDS as readonly string[]).includes(prefs.cruiseDuration)
        ? prefs.cruiseDuration
        : prefs.cruiseDuration,
  };
}
