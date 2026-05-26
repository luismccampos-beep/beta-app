'use client';

import { useCallback, useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Bus, Footprints, Loader2, MapPin, Timer } from 'lucide-react';

import type { TripGoTripPlan } from '../../../lib/travel/tripgo';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

type TripGoRoutePanelProps = {
  from: { lat: number; lon: number; label?: string };
  to: { lat: number; lon: number; label?: string };
  /** Unix seconds */
  departAfter?: number;
  modes?: string;
};

function modeIcon(mode: string) {
  if (mode.includes('pt_') || mode.includes('pub')) return Bus;
  return Footprints;
}

export function TripGoRoutePanel({ from, to, departAfter, modes = 'pt_pub_wa_wal' }: TripGoRoutePanelProps) {
  const t = useTranslations('destination.tripgo');
  const locale = useLocale();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plans, setPlans] = useState<TripGoTripPlan[]>([]);
  const [configured, setConfigured] = useState(true);

  const fetchRoutes = useCallback(async () => {
    setLoading(true);
    setError(null);
    const qs = new URLSearchParams({
      from: `${from.lat},${from.lon}`,
      to: `${to.lat},${to.lon}`,
      modes,
      locale: locale.startsWith('pt') ? 'pt' : locale.startsWith('es') ? 'es' : locale.startsWith('fr') ? 'fr' : 'en',
    });
    if (departAfter) qs.set('departAfter', String(departAfter));

    try {
      const res = await fetch(`/api/travel/tripgo/routing?${qs.toString()}`);
      const data = (await res.json()) as {
        ok?: boolean;
        configured?: boolean;
        message?: string;
        plans?: TripGoTripPlan[];
      };
      setConfigured(data.configured !== false);
      if (!res.ok || !data.ok) {
        setPlans([]);
        setError(data.message ?? t('errorGeneric'));
        return;
      }
      setPlans(data.plans ?? []);
      if (!data.plans?.length) setError(t('noTrips'));
    } catch {
      setError(t('errorGeneric'));
      setPlans([]);
    } finally {
      setLoading(false);
    }
  }, [from, to, departAfter, modes, locale, t]);

  useEffect(() => {
    void fetchRoutes();
  }, [fetchRoutes]);

  if (!configured) {
    return (
      <p className="text-sm text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/30 rounded-lg p-3 border border-amber-200 dark:border-amber-800">
        {t('notConfigured')}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
        <MapPin className="h-3.5 w-3.5" />
        <span className="line-clamp-1">{from.label ?? `${from.lat.toFixed(3)}, ${from.lon.toFixed(3)}`}</span>
        <span>→</span>
        <span className="line-clamp-1">{to.label ?? `${to.lat.toFixed(3)}, ${to.lon.toFixed(3)}`}</span>
        <Button type="button" variant="ghost" size="sm" className="h-7 text-xs ml-auto" onClick={() => void fetchRoutes()}>
          {t('refresh')}
        </Button>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          {t('loading')}
        </div>
      )}

      {error && !loading && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      {plans[0] && !loading && (
        <div className="rounded-xl border border-violet-200 dark:border-violet-900/50 bg-violet-50/50 dark:bg-violet-950/20 p-4 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-sm font-semibold dark:text-white">
              <Timer className="h-4 w-4 text-violet-600" />
              {plans[0].durationMinutes} {t('minutes')}
            </div>
            {plans[0].fare?.formatted && (
              <Badge variant="secondary">{plans[0].fare.formatted}</Badge>
            )}
            {plans[0].carbon != null && (
              <span className="text-xs text-gray-500">
                {t('carbon', { kg: plans[0].carbon.toFixed(1) })}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500">
            {t('depart')}{' '}
            {new Date(plans[0].depart * 1000).toLocaleString(locale, {
              dateStyle: 'short',
              timeStyle: 'short',
            })}
          </p>
          <ol className="space-y-2">
            {plans[0].segments.map((seg, i) => {
              const Icon = modeIcon(seg.mode);
              return (
                <li
                  key={`${seg.mode}-${i}`}
                  className="flex gap-2 text-sm border-l-2 border-violet-300 dark:border-violet-700 pl-3"
                >
                  <Icon className="h-4 w-4 shrink-0 text-violet-600 mt-0.5" />
                  <div>
                    <p className="font-medium dark:text-white">{seg.modeLabel}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {seg.from} → {seg.to}
                      {seg.durationMinutes != null && ` · ${seg.durationMinutes} min`}
                    </p>
                    {seg.notes && (
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{seg.notes}</p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      )}

      {plans.length > 1 && !loading && (
        <p className="text-xs text-gray-400">
          {t('alternatives', { count: plans.length - 1 })}
        </p>
      )}

      <p className="text-xs text-gray-400">{t('attribution')}</p>
    </div>
  );
}
