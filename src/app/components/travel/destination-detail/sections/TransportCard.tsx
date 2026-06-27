'use client';

import { Plane } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../ui/card';
import { Badge } from '../../../ui/badge';
import { DestinationConnectivityPanel } from '../../../travel/DestinationConnectivityPanel';
import { AnimatedSection } from '../components/AnimatedSection';
import type { DestinationDetailData } from '../DestinationDetailPage';

export function TransportCard({
  transporte,
  originIata,
  t,
}: {
  transporte: NonNullable<DestinationDetailData['transporte']>;
  originIata: string;
  t: (key: string) => string;
}) {
  if (!transporte.aeroporto) return null;
  return (
    <AnimatedSection>
      <Card className="bg-white/70 dark:bg-gray-800/60 backdrop-blur-md border-sky-200/40 dark:border-sky-900/40 hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg dark:text-white">
            <Plane className="h-5 w-5 text-sky-600 dark:text-sky-400" />
            {t('transportTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">{t('transportHint')}</p>
          <div className="rounded-xl bg-sky-50/80 dark:bg-sky-950/30 p-4 border border-sky-100 dark:border-sky-900/50">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-2xl font-bold text-sky-700 dark:text-sky-400">{transporte.aeroporto.iata}</span>
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{transporte.aeroporto.nome}</span>
            </div>
            {transporte.aeroporto.municipio && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{transporte.aeroporto.municipio}</p>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {t(`transportMatch_${transporte.aeroporto.match}`)}
              {transporte.aeroporto.distancia_km != null && transporte.aeroporto.distancia_km > 0 && ` · ${transporte.aeroporto.distancia_km} km`}
            </p>
          </div>
          {transporte.rede && (
            <>
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                  <p className="text-xs text-gray-500">{t('transportDirectRoutes')}</p>
                  <p className="text-xl font-semibold dark:text-white">{transporte.rede.ligacoes_diretas}</p>
                </div>
                {(transporte.rede.hubs_com_ligacao?.length ?? 0) > 0 && (
                  <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                    <p className="text-xs text-gray-500 mb-2">{t('transportHubs')}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {transporte.rede.hubs_com_ligacao!.map((hub) => (
                        <Badge key={hub} variant="secondary" className="font-mono">{hub}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <DestinationConnectivityPanel
                destIata={transporte.aeroporto.iata}
                rede={transporte.rede}
                originIata={originIata}
              />
            </>
          )}
          {transporte.fonte && <p className="text-xs text-gray-400 dark:text-gray-500">{transporte.fonte}</p>}
        </CardContent>
      </Card>
    </AnimatedSection>
  );
}
