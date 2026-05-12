import { Avatar, AvatarFallback, AvatarImage } from '@akmleva/ui';
import { motion, AnimatePresence } from 'framer-motion';

import { cn } from '../../utils/index';
import type { SharedUser } from './navigation/types';

interface SharedUserAvatarProps {
  user?: SharedUser;
  labelFallback?: string;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

type AvatarColor = 
  | 'bg-blue-500 text-blue-50'
  | 'bg-emerald-500 text-emerald-50'
  | 'bg-indigo-500 text-indigo-50'
  | 'bg-rose-500 text-rose-50'
  | 'bg-amber-500 text-amber-50'
  | 'bg-violet-500 text-violet-50'
  | 'bg-cyan-500 text-cyan-50';

// Deterministic color generation so the user always has the same "brand" color
const getAvatarColor = (name: string): AvatarColor => {
  const colors: readonly AvatarColor[] = [
    'bg-blue-500 text-blue-50',
    'bg-emerald-500 text-emerald-50',
    'bg-indigo-500 text-indigo-50',
    'bg-rose-500 text-rose-50',
    'bg-amber-500 text-amber-50',
    'bg-violet-500 text-violet-50',
    'bg-cyan-500 text-cyan-50',
  ];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  // Safe array access with fallback
  // eslint-disable-next-line security/detect-object-injection
  return colors[index] ?? 'bg-blue-500 text-blue-50';
};

function getInitials(text: string): string {
  const cleanText = text.trim();
  if (!cleanText) return 'U';
  
  const parts = cleanText.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) {
    const firstPart = parts[0];
    return firstPart ? firstPart.slice(0, 2).toUpperCase() : 'U';
  }
  
  const firstChar = parts[0]?.[0] ?? '';
  const lastChar = parts[parts.length - 1]?.[0] ?? '';
  return (firstChar + lastChar).toUpperCase() || 'U';
}

type SizeClass = 'h-6 w-6 text-[10px]' | 'h-8 w-8 text-xs' | 'h-10 w-10 text-sm' | 'h-14 w-14 text-base' | 'h-20 w-20 text-xl';

const getSizeClass = (size: 'xs' | 'sm' | 'md' | 'lg' | 'xl'): SizeClass => {
  switch (size) {
    case 'xs':
      return 'h-6 w-6 text-[10px]';
    case 'sm':
      return 'h-8 w-8 text-xs';
    case 'md':
      return 'h-10 w-10 text-sm';
    case 'lg':
      return 'h-14 w-14 text-base';
    case 'xl':
      return 'h-20 w-20 text-xl';
    default:
      return 'h-10 w-10 text-sm';
  }
};

export default function SharedUserAvatar({
  user,
  labelFallback = 'User',
  className,
  size = 'md'
}: SharedUserAvatarProps) {
  const name = user?.name || user?.email || labelFallback;
  const initials = getInitials(name);
  const colorClass = getAvatarColor(name);
  const sizeClass = getSizeClass(size);

  return (
    <Avatar 
      className={cn(
        'relative flex shrink-0 overflow-hidden rounded-full ring-2 ring-white dark:ring-gray-950 shadow-sm transition-transform hover:scale-105',
        sizeClass,
        className
      )}
    >
      <AnimatePresence mode="wait">
        {user?.avatarUrl && (
          <AvatarImage
            asChild
            src={user.avatarUrl}
            alt={name}
          >
            {/* Framer motion for a smooth fade-in once the image actually loads */}
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="aspect-square h-full w-full object-cover"
            />
          </AvatarImage>
        )}
      </AnimatePresence>

      <AvatarFallback 
        delayMs={600} // Only show fallback if image takes >600ms to load to avoid flickering
        className={cn(
          "flex h-full w-full items-center justify-center font-bold tracking-tighter uppercase",
          colorClass
        )}
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}