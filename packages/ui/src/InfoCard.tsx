import type { ReactNode } from 'react';
import { Card, CardContent } from './card';
import { Badge } from './badge';
import { CheckCircle2 } from 'lucide-react';

interface InfoCardProps {
  /** Icon element to display at the top */
  icon?: ReactNode;
  /** Title text */
  title: string;
  /** Description / body text */
  description?: string;
  /** Optional children for custom content */
  children?: ReactNode;
  /** Badge labels to show at the bottom (e.g. "Verified", "Active") */
  badges?: Array<{ label: string; variant?: 'default' | 'secondary' | 'outline' | 'destructive'; icon?: boolean }>;
  /** Border color class (e.g. 'border-primary-200') */
  borderColor?: string;
  /** Hover effect class */
  hoverEffect?: string;
  /** Additional class names */
  className?: string;
  /** Click handler */
  onClick?: () => void;
}

/**
 * Reusable InfoCard component for consistent card styling across the app.
 * Used in AboutPage, LegalPage, FAQPage, and other informational sections.
 */
export function InfoCard({
  icon,
  title,
  description,
  children,
  badges,
  borderColor = 'border-gray-200 dark:border-gray-700',
  hoverEffect = 'hover:border-primary dark:hover:border-primary transition-all',
  className = '',
  onClick,
}: InfoCardProps) {
  const Component = onClick ? 'button' : 'div';

  return (
    <Card
      className={`border-2 ${borderColor} shadow-xl dark:bg-gray-800 ${hoverEffect} ${onClick ? 'cursor-pointer text-left w-full' : ''} ${className}`}
      onClick={onClick}
    >
      <CardContent className="p-4 sm:p-6">
        {icon && (
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-3 sm:mb-4">
            {icon}
          </div>
        )}
        <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
        {description && (
          <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mb-3 sm:mb-4 line-clamp-3">{description}</p>
        )}
        {children}
        {badges && badges.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap mt-3">
            {badges.map((badge, i) => (
              <Badge
                key={i}
                variant={badge.variant ?? 'secondary'}
                className={`${badge.variant ? '' : 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-200 border-0 text-xs sm:text-sm'}`}
              >
                {badge.icon && <CheckCircle2 className="w-3 h-3 mr-1" />}
                {badge.label}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Section header component for consistent page section styling.
 */
interface SectionHeaderProps {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  iconColor?: string;
}

export function SectionHeader({ icon, title, subtitle, iconColor = 'text-primary dark:text-primary-300' }: SectionHeaderProps) {
  return (
    <div className="mb-4 sm:mb-6">
      <div className="flex items-center gap-2 sm:gap-3 mb-2">
        <div className={`w-6 h-6 sm:w-8 sm:h-8 ${iconColor} flex-shrink-0`}>
          {icon}
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{title}</h2>
      </div>
      {subtitle && (
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 ml-0 sm:ml-10 sm:pl-1">{subtitle}</p>
      )}
    </div>
  );
}