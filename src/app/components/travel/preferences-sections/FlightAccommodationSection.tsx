'use client';

import { useMemo } from 'react';
import { Controller } from 'react-hook-form';
import { Check, Heart, Plane, Hotel, Ship } from 'lucide-react';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Checkbox } from '../../ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Badge } from '../../ui/badge';
import type { PreferencesSectionProps } from './types';
import {
  SEAT_PREFERENCE_IDS,
  MEAL_PREFERENCE_IDS,
  ROOM_TYPE_IDS,
  CRUISE_DESTINATION_IDS,
  CRUISE_DURATION_IDS,
  CRUISE_SHIP_TYPE_IDS,
  CRUISE_TIER_IDS,
} from '../../../../lib/i18n/preferences-form-options';

export function FlightAccommodationSection({
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
  const { control, setValue, watch } = form;
  const watchedPreferences = watch();

  const toggleArrayValue = (key: keyof typeof preferences, value: string) => {
    const currentArray = watchedPreferences[key] as string[];
    if (currentArray.includes(value)) {
      setValue(key, currentArray.filter((item: string) => item !== value));
    } else {
      setValue(key, [...currentArray, value]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h3 className="text-xl sm:text-2xl font-bold mb-2 flex flex-wrap items-center gap-2">
          <Heart className="w-6 h-6 text-pink-600" /> {t('flightAccommodationPreferences')}
        </h3>
        <p className="text-sm text-gray-600">
          {t('fineTunePreferences')}
        </p>
      </div>

      <Tabs defaultValue="flight" className="w-full">
        <TabsList className="flex flex-col h-auto w-full gap-1 p-1 sm:grid sm:grid-cols-3 sm:h-12">
          <TabsTrigger value="flight" className="gap-2 justify-start sm:justify-center min-h-11 text-xs sm:text-sm px-2">
            <Plane className="w-4 h-4 shrink-0" />
            <span className="truncate">✈️ {t('flightPreferences')}</span>
          </TabsTrigger>
          <TabsTrigger value="accommodation" className="gap-2 justify-start sm:justify-center min-h-11 text-xs sm:text-sm px-2">
            <Hotel className="w-4 h-4 shrink-0" />
            <span className="truncate">🏨 {t('accommodation')}</span>
          </TabsTrigger>
          <TabsTrigger value="cruise" className="gap-2 justify-start sm:justify-center min-h-11 text-xs sm:text-sm px-2">
            <Ship className="w-4 h-4 shrink-0" />
            <span className="truncate">🚢 {t('cruisePreferences')}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="flight" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-3">
              <Label htmlFor="seatPreference" className="text-base font-semibold">{t('seatPreference')}</Label>
              <Select value={watchedPreferences.seatPreference} onValueChange={(value: string) => setValue('seatPreference', value)}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder={t('selectSeatPreference')} />
                </SelectTrigger>
                <SelectContent>
                  {SEAT_PREFERENCE_IDS.map((id) => (
                    <SelectItem key={id} value={id}>
                      {t(`options.seatPreference.${id}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="mealPreference" className="text-base font-semibold">{t('mealPreference')}</Label>
              <Controller name="mealPreference" control={control} render={({ field }) => (
                <>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder={t('selectMealPreference')} />
                  </SelectTrigger>
                  <SelectContent>
                    {MEAL_PREFERENCE_IDS.map((id) => (
                      <SelectItem key={id} value={id}>
                        {t(`options.mealPreference.${id}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </>
              )} />
              {errors.mealPreference && <p className="text-red-500 text-xs mt-1">{errors.mealPreference.message}</p>}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-semibold">{t('loyaltyPrograms')}</Label>
            {travelCatalogLoading ? (
              <p className="text-sm text-gray-500">{t('catalogLoading')}</p>
            ) : (travelCatalog?.loyaltyProgrammes?.length ?? 0) === 0 ? (
              <p className="text-sm text-amber-700">
                {travelCatalog?.configured?.duffel === false
                  ? t('catalogDuffelMissing')
                  : t('catalogLoyaltyEmpty')}
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1">
                {travelCatalog!.loyaltyProgrammes.map((program) => (
                  <div
                    key={program.id}
                    className="flex items-center space-x-2 bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors"
                  >
                    <Controller name="loyaltyPrograms" control={control} render={({ field }) => (
                      <Checkbox
                        id={`loyalty-${program.id}`}
                        checked={field.value.includes(program.id)}
                        onCheckedChange={(checked) => toggleArrayValue('loyaltyPrograms', program.id)}
                      />
                    )} />
                    <Label htmlFor={`loyalty-${program.id}`} className="cursor-pointer text-sm font-medium flex-1">
                      {program.label}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="accommodation" className="space-y-6 mt-6">
          <div className="space-y-3">
            <Label className="text-base font-semibold">{t('accommodationType')}</Label>
            {travelCatalogLoading ? (
              <p className="text-sm text-gray-500">{t('catalogLoading')}</p>
            ) : (travelCatalog?.accommodations?.length ?? 0) === 0 ? (
              <p className="text-sm text-amber-700">
                {travelCatalog?.configured?.hotelbeds === false
                  ? t('catalogHotelbedsMissing')
                  : t('catalogHotelbedsEmpty')}
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto overscroll-y-contain pr-1">
                {travelCatalog!.accommodations.map((type) => (
                  <div
                    key={type.code}
                    className="flex items-center space-x-2 bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors"
                  >
                    <Controller name="accommodationType" control={control} render={({ field }) => (
                      <Checkbox
                        id={`accom-${type.code}`}
                        checked={field.value.includes(type.code)}
                        onCheckedChange={(checked) => toggleArrayValue('accommodationType', type.code)}
                      />
                    )} />
                    <Label htmlFor={`accom-${type.code}`} className="cursor-pointer text-sm font-medium">
                      {type.label}
                    </Label>
                  </div>
                ))}
              </div>
            )}
            {errors.accommodationType && <p className="text-red-500 text-xs mt-1">{errors.accommodationType.message}</p>}
          </div>

          <div className="space-y-3">
            <Label htmlFor="roomType" className="text-base font-semibold">{t('roomType')}</Label>
            <Controller name="roomType" control={control} render={({ field }) => (
              <>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder={t('selectRoomType')} {...field} />
                </SelectTrigger>
                <SelectContent>
                  {ROOM_TYPE_IDS.map((id) => (
                    <SelectItem key={id} value={id}>
                      {t(`options.roomType.${id}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </>
            )} />
            {errors.roomType && <p className="text-red-500 text-xs mt-1">{errors.roomType.message}</p>}
          </div>

          <div className="space-y-3">
            <Label className="text-base font-semibold">{t('requiredAmenities')}</Label>
            <p className="text-xs text-gray-500">{t('amenitiesHotelbedsNote')}</p>
            {travelCatalogLoading ? (
              <p className="text-sm text-gray-500">{t('catalogLoading')}</p>
            ) : (travelCatalog?.facilities?.length ?? 0) === 0 ? (
              <p className="text-sm text-amber-700">
                {travelCatalog?.configured?.hotelbeds === false
                  ? t('catalogHotelbedsMissing')
                  : t('catalogHotelbedsEmpty')}
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto overscroll-y-contain pr-1">
                {travelCatalog!.facilities.map((amenity) => (
                  <div
                    key={amenity.code}
                    className="flex items-center space-x-2 bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors"
                  >
                    <Controller name="amenities" control={control} render={({ field }) => (
                      <Checkbox
                        id={`amenity-${amenity.code}`}
                        checked={field.value.includes(amenity.code)}
                        onCheckedChange={(checked) => toggleArrayValue('amenities', amenity.code)}
                      />
                    )} />
                    <Label htmlFor={`amenity-${amenity.code}`} className="cursor-pointer text-sm font-medium">
                      {amenity.label}
                    </Label>
                  </div>
                ))}
              </div>
            )}
            {errors.amenities && <p className="text-red-500 text-xs mt-1">{errors.amenities.message}</p>}
          </div>

          <div className="space-y-3">
            <Label className="text-base font-semibold">{t('preferredHotelChains')}</Label>
            {travelCatalogLoading ? (
              <p className="text-sm text-gray-500">{t('catalogLoading')}</p>
            ) : (travelCatalog?.chains?.length ?? 0) === 0 ? (
              <p className="text-sm text-amber-700">
                {travelCatalog?.configured?.hotelbeds === false
                  ? t('catalogHotelbedsMissing')
                  : t('catalogHotelbedsEmpty')}
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto overscroll-y-contain pr-1">
                {travelCatalog!.chains.map((chain) => (
                  <div
                    key={chain.code}
                    className="flex items-center space-x-2 bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors"
                  >
                    <Checkbox
                      id={`chain-${chain.code}`}
                      checked={watchedPreferences.hotelChain.includes(chain.code)}
                      onCheckedChange={() => toggleArrayValue('hotelChain', chain.code)}
                    />
                    <Label htmlFor={`chain-${chain.code}`} className="cursor-pointer text-sm font-medium">
                      {chain.label}
                    </Label>
                  </div>
                ))}
              </div>
            )}
            {errors.loyaltyPrograms && <p className="text-red-500 text-xs mt-1">{errors.loyaltyPrograms.message}</p>}
          </div>
        </TabsContent>

        <TabsContent value="cruise" className="space-y-6 mt-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-lg border border-teal-100 bg-teal-50/50 p-4">
            <div className="flex-1 min-w-0">
              <Label className="text-base font-semibold">{t('cruiseIncludeToggle')}</Label>
              <p className="text-sm text-gray-600 mt-1">{t('cruiseIncludeHint')}</p>
            </div>
            <Checkbox
              className="shrink-0 self-start sm:self-center"
              checked={watchedPreferences.cruiseEnabled}
              onCheckedChange={(v) => setValue('cruiseEnabled', Boolean(v))}
            />
          </div>

          {!watchedPreferences.cruiseEnabled ? (
            <p className="text-sm text-gray-500">{t('cruiseCollapsedHint')}</p>
          ) : (
            <>
              <div className="space-y-3">
                <Label className="text-base font-semibold">{t('cruiseRegions')}</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {CRUISE_DESTINATION_IDS.map((id) => (
                    <div
                      key={id}
                      className="flex items-center space-x-2 bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors"
                    >
                      <Checkbox
                        id={`cruise-dest-${id}`}
                        checked={watchedPreferences.cruiseDestinations.includes(id)}
                        onCheckedChange={() => toggleArrayValue('cruiseDestinations', id)}
                      />
                      <Label htmlFor={`cruise-dest-${id}`} className="cursor-pointer text-sm font-medium">
                        {t(`options.cruise.destinations.${id}`)}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-3">
                  <Label className="text-base font-semibold">{t('cruiseTier')}</Label>
                  <Select
                    value={watchedPreferences.cruiseTier || undefined}
                    onValueChange={(value: string) => setValue('cruiseTier', value)}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder={t('cruiseTierAny')} />
                    </SelectTrigger>
                    <SelectContent>
                      {CRUISE_TIER_IDS.map((id) => (
                        <SelectItem key={id} value={id}>
                          {t(`options.cruise.tier.${id}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label className="text-base font-semibold">{t('cruiseShipType')}</Label>
                  <Select
                    value={watchedPreferences.cruiseShipType || undefined}
                    onValueChange={(value: string) => setValue('cruiseShipType', value)}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder={t('cruiseShipTypeAny')} />
                    </SelectTrigger>
                    <SelectContent>
                      {CRUISE_SHIP_TYPE_IDS.map((id) => (
                        <SelectItem key={id} value={id}>
                          {t(`options.cruise.shipType.${id}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-semibold">{t('cruiseDuration')}</Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {CRUISE_DURATION_IDS.map((id) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setValue('cruiseDuration', id)}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        watchedPreferences.cruiseDuration === id
                          ? 'border-teal-600 bg-teal-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="font-semibold text-sm">{t(`options.cruise.duration.${id}.label`)}</div>
                      <div className="text-xs text-gray-600">{t(`options.cruise.duration.${id}.days`)}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-semibold">{t('cruiseBrands')}</Label>
                <p className="text-xs text-gray-500">{t('cruiseBrandsNote')}</p>
                {travelCatalogLoading ? (
                  <p className="text-sm text-gray-500">{t('catalogLoading')}</p>
                ) : (travelCatalog?.cruiseBrands?.length ?? 0) === 0 ? (
                  <p className="text-sm text-amber-700">
                    {travelCatalog?.configured?.siloah === false
                      ? t('catalogSiloahMissing')
                      : t('catalogSiloahEmpty')}
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto overscroll-y-contain pr-1">
                    {travelCatalog!.cruiseBrands!.map((brand) => (
                      <div
                        key={brand.name}
                        className="flex items-center space-x-2 bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors"
                      >
                        <Checkbox
                          id={`cruise-brand-${brand.name}`}
                          checked={watchedPreferences.cruiseBrandNames.includes(brand.name)}
                          onCheckedChange={() => toggleArrayValue('cruiseBrandNames', brand.name)}
                        />
                        <Label
                          htmlFor={`cruise-brand-${brand.name}`}
                          className="cursor-pointer text-sm font-medium flex-1"
                        >
                          {brand.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}