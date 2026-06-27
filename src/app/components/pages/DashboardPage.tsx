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
import { Plane, Calendar, Clock, User, Settings, Sparkles } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50 to-accent-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-cyan-200/20 dark:bg-cyan-500/5 blur-[100px]" />
        <div className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-primary-200/20 dark:bg-primary-500/5 blur-[100px]" />
      </div>

      <AppHeader showBack onBack={onBack} showLogout={!!onLogout} onLogout={onLogout} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-16 pb-24 sm:pb-16 relative z-10">
        {/* Hero */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary dark:text-primary-300 text-xs font-bold uppercase tracking-widest mb-2">
                <Sparkles size={12} className="animate-pulse" />
                {t('title')}
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-gray-950 dark:text-white tracking-tighter">
                Olá, <span className="bg-gradient-to-r from-brand-gray via-orange to-green bg-clip-text text-transparent italic">Viajante</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 font-medium">{t('subtitle')}</p>
            </div>
            {onNewBooking && (
              <Button type="button"
                onClick={onNewBooking}
                variant="brand"
                size="lg"
                className="gap-2 shadow-glow-primary hover:scale-105"
              >
                <Plane className="w-5 h-5" />
                {t('newBooking')}
              </Button>
            )}
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="mb-10 overflow-x-auto">
          <div className="flex gap-2 pb-2 min-w-max sm:min-w-0 border-b border-gray-200 dark:border-gray-800">
            {([
              { id: 'bookings' as TabType, label: t('tabBookings'), icon: Calendar },
              { id: 'history' as TabType, label: t('tabHistory'), icon: Clock },
              { id: 'profile' as TabType, label: t('tabProfile'), icon: User },
              { id: 'preferences' as TabType, label: t('tabPreferences'), icon: Settings },
            ]).map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button type="button"
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'px-6 py-4 font-bold transition-all flex items-center gap-2 whitespace-nowrap text-sm rounded-t-xl relative',
                    isActive
                      ? 'text-gray-950 dark:text-white bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm'
                      : 'text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
                  )}
                >
                  <Icon className={cn('w-4 h-4', isActive && 'text-orange')} />
                  <span className="hidden sm:inline uppercase tracking-widest">{tab.label}</span>
                  {isActive && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute bottom-[-2px] left-0 right-0 h-[3px] bg-gradient-to-r from-brand-gray via-orange to-green"
                    />
                  )}
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
