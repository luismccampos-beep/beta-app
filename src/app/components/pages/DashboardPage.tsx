'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import { useTranslations } from 'next-intl';
import { AppHeader } from '../AppHeader';
import { cn } from '../ui/utils';
import { BookingsTab } from '../dashboard/BookingsTab';
import { HistoryTab } from '../dashboard/HistoryTab';
import { ProfileTab } from '../dashboard/ProfileTab';
import { PreferencesTab } from '../dashboard/PreferencesTab';
import { Plane, Calendar, Clock, User, Settings } from 'lucide-react';

type TabType = 'bookings' | 'history' | 'profile' | 'preferences';

interface DashboardPageProps {
  onBack: () => void;
  onNewBooking?: () => void;
  initialTab?: TabType;
  onLogout?: () => void;
}

type Booking = {
  id: string;
  destination: string;
  dates: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  price: string;
  type: string;
  bookingDate: string;
};

type TravelHistory = {
  id: string;
  destination: string;
  dates: string;
  rating: number;
  type: string;
};

export function DashboardPage({ onBack, onNewBooking, initialTab, onLogout }: DashboardPageProps) {
  const t = useTranslations('dashboard');
  const [activeTab, setActiveTab] = useState<TabType>(initialTab ?? 'bookings');

  const mockBookings: Booking[] = [];
  const mockHistory: TravelHistory[] = [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50 to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors">
      <AppHeader showBack onBack={onBack} showLogout={!!onLogout} onLogout={onLogout} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 pb-24 sm:pb-12">
        {/* Hero */}
        <div className="mb-8">
          <div className="flex items-center justify-between gap-4 mb-2">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">{t('title')}</h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{t('subtitle')}</p>
            </div>
            {onNewBooking && (
              <Button
                onClick={onNewBooking}
                className="bg-gray-900 dark:bg-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 text-white gap-2 max-sm:hidden shadow-sm"
              >
                <Plane className="w-4 h-4" />
                {t('newBooking')}
              </Button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex gap-1 pb-2 min-w-max sm:min-w-0 border-b border-gray-200 dark:border-gray-700">
            {([
              { id: 'bookings' as TabType, label: t('tabBookings'), icon: Calendar },
              { id: 'history' as TabType, label: t('tabHistory'), icon: Clock },
              { id: 'profile' as TabType, label: t('tabProfile'), icon: User },
              { id: 'preferences' as TabType, label: t('tabPreferences'), icon: Settings },
            ]).map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'px-4 sm:px-5 py-3 font-medium transition-all flex items-center gap-2 whitespace-nowrap text-sm rounded-t-lg border-b-2',
                    activeTab === tab.id
                      ? 'border-teal-600 dark:border-orange-500 text-teal-700 dark:text-orange-400 bg-white/60 dark:bg-gray-800/60'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/30'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="space-y-6"
          >
            {activeTab === 'bookings' && <BookingsTab bookings={mockBookings} onNewBooking={onNewBooking} t={t} />}
            {activeTab === 'history' && <HistoryTab history={mockHistory} t={t} />}
            {activeTab === 'profile' && <ProfileTab />}
            {activeTab === 'preferences' && <PreferencesTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
