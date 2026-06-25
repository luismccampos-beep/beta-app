'use client';

import { Controller } from 'react-hook-form';
import { Check, MapPin } from 'lucide-react';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../../ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { OpenMoji } from '../../ui/openmoji';
import type { PreferencesSectionProps } from './types';
import { TRAVEL_FREQUENCY_IDS } from '../../../../lib/i18n/preferences-form-options';

const getTravelStylesData = (t: (key: string) => string) => [
  { id: 'luxury', label: t('luxury'), emoji: '👑', color: 'from-yellow-500 to-amber-600' },
  { id: 'adventure', label: t('adventure'), emoji: '🎒', color: 'from-green-500 to-emerald-600' },
  { id: 'cultural', label: t('cultural'), emoji: '🏛️', color: 'from-teal-500 to-cyan-600' },
  { id: 'relaxation', label: t('relaxation'), emoji: '🌴', color: 'from-orange-500 to-red-600' },
  { id: 'business', label: t('business'), emoji: '💼', color: 'from-teal-600 to-blue-600' },
  { id: 'family', label: t('family'), emoji: '👨‍👩‍👧', color: 'from-pink-500 to-rose-600' },
  { id: 'ecotourism', label: t('ecoTourism'), emoji: '🌿', color: 'from-lime-500 to-green-600' },
  { id: 'foodie', label: t('foodie'), emoji: '🍽️', color: 'from-orange-600 to-amber-600' },
];

const TRAVEL_PURPOSE_IDS = ['business', 'leisure', 'conference', 'family'] as const;
const PURPOSE_EMOJIS: Record<string, string> = {
  business: '💼', leisure: '🌴', conference: '🤝', family: '👨‍👩‍👧',
};

export function TravelStyleSection({
  form,
  preferences,
  errors,
  t,
  travelCatalog,
  travelCatalogLoading,
  filterCountries,
  filterContinents,
  locale,
}: PreferencesSectionProps) {
  const { control, watch, setValue } = form;
  const watchedPreferences = watch();

  const toggleArrayValue = (key: keyof typeof preferences, value: string) => {
    const currentArray = watchedPreferences[key] as string[];
    if (currentArray.includes(value)) {
      setValue(key, currentArray.filter((item: string) => item !== value));
    } else {
      setValue(key, [...currentArray, value]);
    }
  };

  const totalLocations =
    watchedPreferences.preferredCountries.length +
    watchedPreferences.preferredContinents.length;

  return (
    <div className="space-y-6">
      {/* Travel Style Cards */}
      <div className="space-y-4">
        <Label className="text-base font-semibold">{t('whatsYourTravelStyle')}</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {getTravelStylesData(t).map((style) => {
            const isSelected = watchedPreferences.travelStyles.includes(style.id);
            return (
              <button
                key={style.id}
                type="button"
                onClick={() => toggleArrayValue('travelStyles', style.id)}
                className={`relative overflow-hidden rounded-xl p-3 sm:p-4 transition-all duration-300 touch-manipulation border-2 sm:hover:scale-105 sm:hover:shadow-xl ${
                  isSelected
                    ? 'border-transparent shadow-lg'
                    : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                {isSelected && (
                  <div className={`absolute inset-0 bg-gradient-to-br ${style.color} opacity-90 pointer-events-none`} />
                )}
                <div className="relative z-10 flex flex-col items-center gap-2">
                  <OpenMoji emoji={style.emoji} size={32} />
                  <span className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                    {style.label}
                  </span>
                </div>
                {isSelected && <Check className="absolute top-2 right-2 w-5 h-5 text-white" />}
              </button>
            );
          })}
        </div>
        {errors.travelStyles && (
          <p className="text-red-500 text-xs mt-1">{errors.travelStyles.message}</p>
        )}
      </div>

      {/* Travel Frequency */}
      <div className="space-y-3">
        <Label htmlFor="travelFrequency" className="text-base font-semibold">
          {t('travelFrequency')}
        </Label>
        <Controller name="travelFrequency" control={control} render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder={t('howOftenTravel')} />
            </SelectTrigger>
            <SelectContent>
              {TRAVEL_FREQUENCY_IDS.map((id) => (
                <SelectItem key={id} value={id}>
                  {t(`options.travelFrequency.${id}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )} />
        {errors.travelFrequency && (
          <p className="text-red-500 text-xs mt-1">{errors.travelFrequency.message}</p>
        )}
      </div>

      {/* Nationality */}
      <div className="space-y-3">
        <Label htmlFor="nationality" className="text-base font-semibold">
          {t('nationality')}
        </Label>
        <Controller name="nationality" control={control} render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder={t('selectNationality')} />
            </SelectTrigger>
            <SelectContent>
              {filterCountries.map((c) => (
                <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )} />
        {errors.nationality && (
          <p className="text-red-500 text-xs mt-1">{errors.nationality.message}</p>
        )}
      </div>

      {/* Unified Countries + Continents picker */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">{t('preferredCountries')}</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button type="button" variant="outline" className="w-full h-11 justify-start font-normal">
              {totalLocations > 0
                ? `${totalLocations} ${t('selected')}`
                : t('selectCountries')}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-[--radix-popover-trigger-width]" align="start">
            <Command>
              <CommandInput placeholder={t('searchCountries')} />
              <CommandList>
                <CommandEmpty>{t('noCountriesFound')}</CommandEmpty>
                {filterContinents.length > 0 && (
                  <CommandGroup heading={t('continents')}>
                    {filterContinents.map((c) => (
                      <CommandItem key={c.name} value={c.name} onSelect={() => {
                        toggleArrayValue('preferredContinents', c.name);
                      }}>
                        <div className={`mr-2 flex h-4 w-4 items-center justify-center rounded-sm border ${watchedPreferences.preferredContinents.includes(c.name) ? 'bg-teal-600 border-teal-600' : 'border-gray-300 dark:border-gray-500'}`}>
                          {watchedPreferences.preferredContinents.includes(c.name) && <Check className="h-3 w-3 text-white" />}
                        </div>
                        <span>🌍 {c.name}</span>
                        <Badge variant="secondary" className="ml-auto text-xs">{c.count} {t('destinationsCount')}</Badge>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
                <CommandGroup heading={t('countries')}>
                  {filterCountries.map((c) => (
                    <CommandItem key={c.name} value={c.name} onSelect={() => {
                      toggleArrayValue('preferredCountries', c.name);
                    }}>
                      <div className={`mr-2 flex h-4 w-4 items-center justify-center rounded-sm border ${watchedPreferences.preferredCountries.includes(c.name) ? 'bg-teal-600 border-teal-600' : 'border-gray-300 dark:border-gray-500'}`}>
                        {watchedPreferences.preferredCountries.includes(c.name) && <Check className="h-3 w-3 text-white" />}
                      </div>
                      <span>{c.name}</span>
                      <Badge variant="secondary" className="ml-auto text-xs">{c.count} {t('destinationsCount')}</Badge>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Destinations */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">{t('preferredDestinations')}</Label>
        {travelCatalogLoading ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('catalogLoading')}</p>
        ) : (travelCatalog?.airports?.length ?? 0) === 0 ? (
          <p className="text-sm text-amber-700 dark:text-amber-400">
            {travelCatalog?.configured?.duffel === false
              ? t('catalogDuffelMissing')
              : t('catalogAirportsEmpty')}
          </p>
        ) : (
          <>
            <div className="flex flex-wrap gap-2 mb-2">
              {watchedPreferences.preferredDestinations.map((dest: string) => (
                <Badge key={dest} variant="secondary" className="gap-1 pr-1">
                  {dest}
                  <button
                    type="button"
                    onClick={() => toggleArrayValue('preferredDestinations', dest)}
                    className="ml-1 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 p-0.5"
                    aria-label={`Remove ${dest}`}
                  >
                    <span className="text-xs">✕</span>
                  </button>
                </Badge>
              ))}
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button type="button" variant="outline" className="w-full h-11 justify-start font-normal">
                  <MapPin className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" />
                  {t('searchDestinations')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0 w-[--radix-popover-trigger-width]" align="start">
                <Command>
                  <CommandInput placeholder={t('typeAnyCityOrAirport')} />
                  <CommandList>
                    <CommandEmpty>{t('noAirportsFound')}</CommandEmpty>
                    <CommandGroup>
                      {travelCatalog!.airports.map((a) => (
                        <CommandItem key={a.iataCode} value={a.label} onSelect={() => {
                          toggleArrayValue('preferredDestinations', a.label);
                        }}>
                          <div className={`mr-2 flex h-4 w-4 items-center justify-center rounded-sm border ${
                            watchedPreferences.preferredDestinations.includes(a.label)
                              ? 'bg-teal-600 border-teal-600'
                              : 'border-gray-300 dark:border-gray-500'
                          }`}>
                            {watchedPreferences.preferredDestinations.includes(a.label) && (
                              <Check className="h-3 w-3 text-white" />
                            )}
                          </div>
                          <span>{a.label}</span>
                          {a.country && (
                            <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">{a.country}</span>
                          )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </>
        )}
        {errors.preferredDestinations && (
          <p className="text-red-500 text-xs mt-1">{errors.preferredDestinations.message}</p>
        )}
      </div>

      {/* Travel Purpose - Compact chips */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">{t('travelPurpose')}</Label>
        <div className="flex flex-wrap gap-2">
          {TRAVEL_PURPOSE_IDS.map((id) => {
            const isSelected = watchedPreferences.travelPurpose.includes(id);
            return (
              <button
                key={id}
                type="button"
                onClick={() => toggleArrayValue('travelPurpose', id)}
                className={`px-3 py-1.5 rounded-full text-sm border transition-all touch-manipulation ${
                  isSelected
                    ? 'bg-teal-600 text-white border-teal-600'
                    : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-teal-400 dark:hover:border-teal-400'
                }`}
              >
                {PURPOSE_EMOJIS[id]} {t(`options.travelPurpose.${id}`)}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
