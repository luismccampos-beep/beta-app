'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowRight, Plane, Route } from 'lucide-react';

import {
  DEFAULT_ORIGINS,
  indicativePriceFromOrigin,
  isDirectFromOrigin,
  type TransportRede,
} from '../../../lib/travel/flight-connectivity';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

type DestinationConnectivityPanelProps = {
  destIata: string;
  rede?: TransportRede;
  originIata: string;
  onOriginChange?: (iata: string) => void;
};

export function DestinationConnectivityPanel({
  destIata,
  rede,
  originIata,
  onOriginChange,
}: DestinationConnectivityPanelProps) {
  const t = useTranslations('destination');
  const [origin, setOrigin] = useState(originIata.toUpperCase());

  const direct = useMemo(() => isDirectFromOrigin(rede, origin), [rede, origin]);
  const price = useMemo(() => indicativePriceFromOrigin(rede, origin), [rede, origin]);
  const topDestinos = rede?.top_destinos ?? [];
  const hubs = rede?.hubs_com_ligacao ?? [];
  const aircraft = rede?.aeronaves_frequentes ?? [];

  const handleOrigin = (code: string) => {
    setOrigin(code);
    onOriginChange?.(code);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-gray-500 dark:text-gray-400">{t('connectivityFrom')}</span>
        {DEFAULT_ORIGINS.map((code) => (
          <Button
            key={code}
            type="button"
            size="sm"
            variant={origin === code ? 'default' : 'outline'}
            className="h-8 font-mono text-xs"
            onClick={() => handleOrigin(code)}
          >
            {code}
          </Button>
        ))}
      </div>

      <div
        className={`rounded-xl border p-4 ${
          direct
            ? 'bg-emerald-50/90 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800'
            : 'bg-amber-50/80 border-amber-200 dark:bg-amber-950/25 dark:border-amber-800'
        }`}
      >
        <p className="font-semibold text-sm dark:text-white flex items-center gap-2">
          <Plane className="h-4 w-4" />
          {direct
            ? t('connectivityDirect', { origin, dest: destIata })
            : t('connectivityNoDirect', { origin, dest: destIata })}
        </p>
        {price != null && direct && (
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
            {t('connectivityIndicativePrice', { price })}
          </p>
        )}
        {!direct && hubs.length > 0 && (
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
            {t('connectivityViaHubs')}: {hubs.join(', ')}
          </p>
        )}
      </div>

      {topDestinos.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2 flex items-center gap-1">
            <Route className="h-3.5 w-3.5" />
            {t('connectivityTopFrom', { iata: destIata })}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {topDestinos.map((d) => (
              <Badge key={d.iata} variant="outline" className="font-mono text-xs">
                {d.iata}
                <span className="font-normal text-gray-500 ml-1 max-w-[120px] truncate">
                  {d.nome.split(' ')[0]}
                </span>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {aircraft.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 mb-1">{t('connectivityAircraft')}</p>
          <div className="flex flex-wrap gap-1.5">
            {aircraft.map((a) => (
              <Badge key={a.code} variant="secondary" className="text-xs">
                {a.nome}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-gray-400 flex items-center gap-1">
        <ArrowRight className="h-3 w-3" />
        {t('connectivityDisclaimer')}
      </p>
    </div>
  );
}
