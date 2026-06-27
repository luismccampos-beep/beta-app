'use client';

import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { Clock, MapPin } from 'lucide-react';

type TravelHistory = {
  id: string;
  destination: string;
  dates: string;
  rating: number;
  type: string;
};

type HistoryTabProps = {
  history: TravelHistory[];
  t: (key: string) => string;
};

function renderStars(rating: number) {
  return Array.from({ length: 5 }, (_, i) => (
    <span key={i} className={i < rating ? 'text-accent' : 'text-gray-300 dark:text-gray-600'}>★</span>
  ));
}

export function HistoryTab({ history, t }: HistoryTabProps) {
  if (history.length === 0) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('pastTrips')}</h2>
        <Card className="group overflow-hidden border-0 bg-white dark:bg-gray-800 shadow-md hover:shadow-lg ring-1 ring-gray-200/60 dark:ring-gray-700/60 transition-all duration-300">
          <CardContent className="p-12 text-center">
            <Clock className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-lg text-gray-600 dark:text-gray-400">{t('noHistory')}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('pastTrips')}</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {history.map((trip) => (
          <Card key={trip.id} className="group overflow-hidden border-0 bg-white dark:bg-gray-800 shadow-md hover:shadow-lg ring-1 ring-gray-200/60 dark:ring-gray-700/60 transition-all duration-300">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-primary dark:text-primary-300" />
                <h3 className="font-semibold text-gray-900 dark:text-white">{trip.destination}</h3>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{trip.dates}</p>
              <Badge variant="secondary" className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-0">{trip.type}</Badge>
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/60">
                <span className="text-xs text-gray-400 dark:text-gray-500">{t('rating')}:</span>
                <div className="text-sm">{renderStars(trip.rating)}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
