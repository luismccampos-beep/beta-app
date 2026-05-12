import React, { useState } from 'react';
import { ChevronsDown, ChevronsUp, X, Check } from 'lucide-react';
import { useTranslations } from 'next-intl'; // 1. Replaced import

import { Button } from '../../../Button';
import { cn } from '../../../../../utils';
import { Logo } from '../../../Logo';
import type { ChatWindowProps } from '../../UnifiedChat.types';

export const ChatHeader = React.memo<ChatWindowProps>(({ onMinimizeToggle, onClose, isMinimized, status = 'idle' }) => {
  const t = useTranslations('chat'); // 2. Updated hook with "chat" namespace
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);

  const isError = status === 'error';
  // 3. Updated all t() calls to remove default values
  const statusText = isError ? t('offline') : t('online');
  const statusColor = isError ? 'bg-red-500' : 'bg-green-500';

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if ((event.key === 'Enter' || event.key === ' ') && isMinimized && onMinimizeToggle) {
      event.preventDefault();
      onMinimizeToggle();
    }
  };

  const handleConfirmClose = () => {
    setShowCloseConfirm(false);
    onClose();
  };

  return (
    <header
      id="chat-header-title"
      className={cn(
        "bg-[#0088fe] text-white p-4 flex justify-between items-center select-none shrink-0 relative transition-all duration-300",
        isMinimized ? "rounded-t-xl cursor-pointer" : "rounded-t-xl"
      )}
      onClick={isMinimized ? onMinimizeToggle : undefined}
      onKeyDown={isMinimized ? handleKeyDown : undefined}
      role={isMinimized ? 'button' : undefined}
      tabIndex={isMinimized ? 0 : undefined}
    >
      <div className="flex items-center flex-1 min-w-0">
        <div className="w-9 h-9 rounded-full border-2 border-white/50 flex-shrink-0 overflow-hidden mr-3 bg-white flex items-center justify-center">
          <Logo size="sm" withIcon={false} withText={false} className="h-6 w-6" />
        </div>
        <div className="min-w-0">
          <h3 className="text-base font-semibold m-0 whitespace-nowrap overflow-hidden text-ellipsis leading-tight">{t('supportTitle')}</h3>
          <p className="text-[10px] opacity-90 flex items-center gap-1.5 mt-0.5">
            <span className={cn("w-2 h-2 rounded-full animate-pulse flex-shrink-0", statusColor)} aria-hidden="true" />
            <span className="whitespace-nowrap">{statusText}</span>
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 ml-4">
        <Button
          variant="ghost"
          className="w-8 h-8 p-0 bg-white/10 hover:bg-white/25 text-white/90 rounded-md transition-all flex items-center justify-center border-none cursor-pointer"
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            onMinimizeToggle();
          }}
          aria-label={isMinimized ? t('maximizeChat') : t('minimizeChat')}
          type="button"
        >
          {isMinimized ? <ChevronsUp className="h-4 w-4 stroke-[2]" /> : <ChevronsDown className="h-4 w-4 stroke-[2]" />}
        </Button>
        {showCloseConfirm ? (
          <div className="flex gap-2 items-center animate-in slide-in-from-top duration-300">
            <Button
              className="w-8 h-8 p-0 bg-green-500/85 hover:bg-green-500 text-white rounded-md transition-all flex items-center justify-center border-none cursor-pointer font-bold shadow-md hover:scale-110 active:scale-95"
              onClick={handleConfirmClose}
              aria-label={t('confirmClose')}
              type="button"
            >
              <Check className="h-4 w-4 stroke-[3]" />
            </Button>
            <Button
              className="w-8 h-8 p-0 bg-red-500/85 hover:bg-red-500 text-white rounded-md transition-all flex items-center justify-center border-none cursor-pointer font-bold shadow-md hover:scale-110 active:scale-95"
              onClick={() => setShowCloseConfirm(false)}
              aria-label={t('cancelClose')}
              type="button"
            >
              <X className="h-4 w-4 stroke-[3]" />
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            className="w-8 h-8 p-0 bg-white/10 hover:bg-red-500 text-white/90 rounded-md transition-all flex items-center justify-center border-none cursor-pointer relative overflow-hidden group"
            onClick={() => setShowCloseConfirm(true)}
            aria-label={t('closeChat')}
            type="button"
          >
            <X className="h-4 w-4 stroke-[2] transition-transform group-hover:rotate-90" />
          </Button>
        )}
      </div>
    </header>
  );
});
ChatHeader.displayName = 'ChatHeader';
