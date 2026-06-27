'use client';

import { motion } from 'framer-motion';
import { Hotel, Star } from 'lucide-react';
import { Card, CardContent } from '../../../ui/card';
import { Badge } from '../../../ui/badge';
import { HotelTypeBadge } from '../../../travel/HotelTypeBadge';
import { fadeInUp, staggerContainer } from '../constants/animations';
import type { DestinationDetailData } from '../DestinationDetailPage';

export function HotelsSection({
  hotels = [],
  hotelTypes,
  t,
}: {
  hotels?: DestinationDetailData['hotels'];
  hotelTypes: DestinationDetailData['hotelTypes'];
  t: (key: string) => string;
}) {
  if (hotels.length === 0 && (!hotelTypes || Object.keys(hotelTypes).length === 0)) return null;
  return (
    <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} className="space-y-8">
      <h2 className="text-4xl font-black text-gray-950 dark:text-white tracking-tighter uppercase italic flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10 text-primary dark:text-primary-300">
          <Hotel className="h-6 w-6" />
        </div>
        {t('hotels')}
      </h2>
      {hotelTypes && Object.keys(hotelTypes).length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {Object.entries(hotelTypes)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([tipo, count]) => (
              <HotelTypeBadge key={tipo} tipo={tipo} count={count} label={t(`accommodationTypes.${tipo}`) ?? tipo} />
            ))}
        </div>
      )}
      <div className="grid sm:grid-cols-2 gap-6">
        {hotels.map((h) => (
          <motion.div key={h.id} variants={fadeInUp} className="h-full">
            <Card className="card-premium dark:bg-gray-900 group h-full">
              <CardContent className="p-6">
                <p className="text-xl font-black dark:text-white tracking-tight group-hover:text-primary transition-colors">{h.nome}</p>
                <div className="text-sm font-bold text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-3">
                  <div className="flex items-center gap-1 bg-amber-400/10 dark:bg-amber-400/5 px-2 py-0.5 rounded-full text-amber-700 dark:text-amber-300">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <span>{h.estrelas}</span>
                  </div>
                  <span className="opacity-30">•</span>
                  <span className="font-black text-gray-950 dark:text-white">EUR {h.preco_por_noite}<span className="text-xs text-gray-400 dark:text-gray-600 italic">/noite</span></span>
                </div>
                {h.comodidades.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                    {h.comodidades.slice(0, 6).map((c) => (
                      <Badge key={c} variant="outline" className="text-[10px] font-black uppercase tracking-widest bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700">{c}</Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
