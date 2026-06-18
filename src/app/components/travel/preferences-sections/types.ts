import type { UseFormReturn } from 'react-hook-form';
import type { TravelPreferences } from '../../../components/pages/EnhancedTravelPreferencesForm';
import type { TravelCatalogResponse } from '../../../../lib/api-client';

export interface PreferencesSectionProps {
  form: UseFormReturn<TravelPreferences>;
  preferences: TravelPreferences;
  errors: Record<string, { message?: string } | undefined>;
  t: (key: string) => string;
  travelCatalog: TravelCatalogResponse | null;
  travelCatalogLoading: boolean;
  filterCountries: { name: string; count: number }[];
  filterContinents: { name: string; count: number }[];
  locale: string;
}

export type FormErrors = Record<string, { message?: string } | undefined>;

export type { TravelPreferences } from '../../../components/pages/EnhancedTravelPreferencesForm';
export type { TravelCatalogResponse } from '../../../../lib/api-client';
