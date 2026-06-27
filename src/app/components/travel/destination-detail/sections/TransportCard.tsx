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
      <Card className="card-premium dark:bg-gray-900 group">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl font-black text-gray-950 dark:text-white uppercase tracking-tighter italic">
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <Plane className="h-5 w-5" />
            </div>
            {t('transportTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">{t('transportHint')}</p>
          <div className="rounded-2xl bg-sky-50/50 dark:bg-sky-950/20 p-6 border border-sky-100 dark:border-sky-900/50 shadow-sm">
            <div className="flex flex-wrap items-baseline gap-3 mb-2">
              <span className="text-4xl font-black text-sky-700 dark:text-sky-400 tracking-tighter uppercase italic">{transporte.aeroporto.iata}</span>
              <span className="text-lg font-black text-gray-900 dark:text-gray-100 tracking-tight">{transporte.aeroporto.nome}</span>
            </div>
            {transporte.aeroporto.municipio && (
              <p className="text-base font-medium text-gray-600 dark:text-gray-400">{transporte.aeroporto.municipio}</p>
            )}
            <div className="mt-4 pt-4 border-t border-sky-100 dark:border-sky-900/40 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-sky-600 dark:text-sky-400">
              {t(`transportMatch_${transporte.aeroporto.match}`)}
              {transporte.aeroporto.distancia_km != null && transporte.aeroporto.distancia_km > 0 && (
                <>
                  <span className="opacity-30">•</span>
                  <span>{transporte.aeroporto.distancia_km} km</span>
                </>
              )}
            </div>
          </div>
          {transporte.rede && (
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-gray-100 dark:border-gray-800 p-4 bg-white/50 dark:bg-gray-900/50">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-600 mb-1">{t('transportDirectRoutes')}</p>
                  <p className="text-3xl font-black text-gray-950 dark:text-white tracking-tighter">{transporte.rede.ligacoes_diretas}</p>
                </div>
                {(transporte.rede.hubs_com_ligacao?.length ?? 0) > 0 && (
                  <div className="rounded-xl border border-gray-100 dark:border-gray-800 p-4 bg-white/50 dark:bg-gray-900/50">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-600 mb-2">{t('transportHubs')}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {transporte.rede.hubs_com_ligacao!.map((hub) => (
                        <Badge key={hub} variant="secondary" className="font-black bg-primary/10 text-primary dark:bg-primary-900/40 border-0">{hub}</Badge>
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
            </div>
          )}
          {transporte.fonte && (
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-600 text-right">{transporte.fonte}</p>
          )}
        </CardContent>
      </Card>
    </AnimatedSection>
  );
}
