'use client';

import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { cn } from '../ui/utils';
import { Plane, MapPin, Calendar, CheckCircle2, Clock, XCircle } from 'lucide-react';

type Booking = {
  id: string;
  destination: string;
  dates: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  price: string;
  type: string;
  bookingDate: string;
};

type BookingsTabProps = {
  bookings: Booking[];
  onNewBooking?: () => void;
  t: (key: string) => string;
};

function getStatusColor(status: string) {
  switch (status) {
    case 'confirmed': return 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800';
    case 'pending': return 'bg-accent-50 dark:bg-accent-700/30 text-accent-700 dark:text-accent-500 border border-accent-200 dark:border-accent-700';
    case 'cancelled': return 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800';
    default: return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'confirmed': return <CheckCircle2 className="w-3.5 h-3.5" />;
    case 'pending': return <Clock className="w-3.5 h-3.5" />;
    case 'cancelled': return <XCircle className="w-3.5 h-3.5" />;
    default: return null;
  }
}

export function BookingsTab({ bookings, onNewBooking, t }: BookingsTabProps) {
  if (bookings.length === 0) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('activeBookings')}</h2>
        <Card className="group overflow-hidden border-0 bg-white dark:bg-gray-800 shadow-md hover:shadow-lg ring-1 ring-gray-200/60 dark:ring-gray-700/60 transition-all duration-300">
          <CardContent className="p-12 text-center">
            <Plane className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">{t('noBookings')}</p>
            <Button onClick={onNewBooking} className="bg-gray-900 dark:bg-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 text-white">
              {t('bookNow')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('activeBookings')}</h2>
      <div className="grid gap-4">
        {bookings.map((booking) => (
          <Card key={booking.id} className="group overflow-hidden border-0 bg-white dark:bg-gray-800 shadow-md hover:shadow-lg ring-1 ring-gray-200/60 dark:ring-gray-700/60 transition-all duration-300">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-4 h-4 text-primary dark:text-primary-300" />
                    <h3 className="font-semibold text-gray-900 dark:text-white">{booking.destination}</h3>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {booking.dates}
                  </p>
                </div>
                <Badge className={cn('text-xs gap-1.5 px-2.5 py-1 rounded-full', getStatusColor(booking.status))}>
                  {getStatusIcon(booking.status)}
                  {booking.status === 'confirmed' ? t('confirmed') : booking.status === 'pending' ? t('pending') : t('cancelled')}
                </Badge>
              </div>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-700/60">
                <span className="text-sm text-gray-500 dark:text-gray-400">{booking.type}</span>
                <span className="font-bold text-lg text-gray-900 dark:text-white">{booking.price}</span>
              </div>
              <div className="flex gap-2 mt-3">
                <Button variant="outline" size="sm" className="flex-1 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                  {t('viewDetails')}
                </Button>
                {booking.status !== 'cancelled' && (
                  <Button variant="outline" size="sm" className="border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30">
                    {t('cancelBooking')}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
