'use client';

import { Hotel } from 'lucide-react';
import { ACCOMMODATION_ICONS, ACCOMMODATION_COLORS } from './accommodation-types';

export type HotelTypeBadgeProps = {
  tipo: string;
  count?: number;
  label: string;
  className?: string;
};

export function HotelTypeBadge({ tipo, count, label, className = '' }: HotelTypeBadgeProps) {
  const Icon = ACCOMMODATION_ICONS[tipo] ?? Hotel;
  const colorClass = ACCOMMODATION_COLORS[tipo] ?? ACCOMMODATION_COLORS.hotel;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs border-0 ${colorClass} ${className}`}
    >
      <Icon className="h-3 w-3" />
      {count != null && <span className="font-medium">{count}</span>}
      {label}
    </span>
  );
}
