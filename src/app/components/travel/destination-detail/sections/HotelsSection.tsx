'use client';

import { motion } from 'framer-motion';
import { Hotel, Star } from 'lucide-react';
import { Card, CardContent } from '../../../ui/card';
import { Badge } from '../../../ui/badge';
import { HotelTypeBadge } from '../../../travel/HotelTypeBadge';
import { fadeInUp, staggerContainer } from '../constants/animations';
import type { DestinationDetailData } from '../DestinationDetailPage';

export function HotelsSection({
  hotels,
  hotelTypes,
  t,
}: {
  hotels: DestinationDetailData['hotels'];
  hotelTypes: DestinationDetailData['hotelTypes'];
  t: (key: string) => string;
}) {
  if (hotels.length === 0 && (!hotelTypes || Object.keys(hotelTypes).length === 0)) return null;
  return (
    <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}>
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2 dark:text-white">
        <Hotel className="h-5 w-5 text-teal-600 dark:text-teal-400" />
        {t('hotels')}
      </h2>
      {hotelTypes && Object.keys(hotelTypes).length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {Object.entries(hotelTypes)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([tipo, count]) => (
              <HotelTypeBadge key={tipo} tipo={tipo} count={count} label={t(`accommodationTypes.${tipo}`) ?? tipo} />
            ))}
        </div>
      )}
      <div className="grid sm:grid-cols-2 gap-4">
        {hotels.map((h) => (
          <motion.div key={h.id} variants={fadeInUp} whileHover={{ y: -2 }} className="h-full">
            <Card className="bg-white/70 dark:bg-gray-800/60 backdrop-blur-sm hover:shadow-md hover:border-teal-200/50 dark:hover:border-teal-700/50 transition-all duration-200 h-full">
              <CardContent className="pt-4">
                <p className="font-semibold dark:text-white">{h.nome}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  {h.estrelas} ★ · EUR {h.preco_por_noite}/noite
                </p>
                {h.comodidades.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {h.comodidades.slice(0, 4).map((c) => (
                      <Badge key={c} variant="outline" className="text-xs">{c}</Badge>
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
