import React from 'react';
import { MessageCircle as ChatBubbleIcon } from 'lucide-react';
import { useTranslations } from 'next-intl'; // 1. Migrated to next-intl

import { Button } from '../../../Button';
import type { ChatBubbleProps } from '../../UnifiedChat.types';
import { cn } from '../../../../../utils';

export const ChatBubble = React.memo<ChatBubbleProps>(({ unreadCount = 0, onClick }) => {
  // 1. Initialized useTranslations with the 'chat' namespace
  const t = useTranslations('chat');

  return (
    <Button
      onClick={onClick}
      className={cn(
        // 2. Core Styling & Positioning
        "fixed z-50 flex items-center justify-center rounded-full border-none p-0 cursor-pointer group",
        "bg-gradient-to-br from-[#0088fe] to-[#00c49f] text-white",
        
        // 3. Responsive Sizing & Positioning
        "bottom-4 right-4 h-14 w-14", // Mobile-first size
        "md:bottom-6 md:right-6 md:h-16 md:w-16", // Desktop size
        
        // 4. Interaction & Transitions
        "transition-all duration-300 ease-in-out",
        "hover:-translate-y-1 active:scale-95",
        
        // 5. Shadows & Focus (with Dark Mode support)
        "shadow-lg hover:shadow-2xl",
        "dark:shadow-[0_10px_20px_rgba(0,136,254,0.25)] dark:hover:shadow-[0_10px_30px_rgba(0,196,159,0.35)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0088fe] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      )}
      aria-label={t('openChat')}
      type="button"
      title={t('talkToUs')}
    >
      {/* 6. Animated Icon */}
      <ChatBubbleIcon className="h-6 w-6 stroke-[1.5] transition-transform duration-300 group-hover:rotate-12 md:h-7 md:w-7" />
      
      {/* 7. Improved Unread Count Badge */}
      {unreadCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white shadow-md">
          {/* Ping animation for background */}
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
          {/* Foreground text */}
          <span className="relative inline-flex">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        </span>
      )}
    </Button>
  );
});

ChatBubble.displayName = 'ChatBubble';
