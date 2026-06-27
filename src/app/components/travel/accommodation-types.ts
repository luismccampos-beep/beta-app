import { Building2, Hotel, Star, Tent } from 'lucide-react';

/** Icon map for accommodation types. */
export const ACCOMMODATION_ICONS: Record<string, typeof Hotel> = {
  resort: Star,
  camping: Tent,
  apartamento: Building2,
  guest_house: Building2,
  hostel: Building2,
  motel: Building2,
  pousada: Hotel,
  eco_lodge: Tent,
  villa: Building2,
  hotel: Hotel,
};

export const ACCOMMODATION_COLORS: Record<string, string> = {
  resort: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  camping: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  apartamento: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  guest_house: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  hostel: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
  motel: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  pousada: 'bg-accent-100 text-accent-700 dark:bg-accent-700/30 dark:text-accent-200',
  eco_lodge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
  villa: 'bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300',
  hotel: 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-200',
};
