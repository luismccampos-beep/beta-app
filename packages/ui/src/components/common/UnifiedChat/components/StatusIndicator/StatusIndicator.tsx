import React from 'react';
import { AlertCircle, Check, CheckCheck, Clock } from 'lucide-react';

import { cn } from '../../../../../utils';
import type { ChatMessageStatus } from '../../UnifiedChat.types';

export const StatusIndicator = React.memo<{ status: ChatMessageStatus }>(({ status }) => {
  const config = (() => {
    switch (status) {
      case 'sending':
        return { icon: Clock, text: 'Enviando…', className: 'opacity-85' };
      case 'delivered':
        return { icon: Check, text: 'Entregue', className: 'opacity-90' };
      case 'read':
        return { icon: CheckCheck, text: 'Lida', className: 'font-medium' };
      case 'failed':
        return { icon: AlertCircle, text: 'Falha', className: 'text-red-500' };
      default:
        return null;
    }
  })();
  if (!config) return null;

  const Icon = config.icon;
  return (
    <div className="flex items-center gap-1.5 mt-1 justify-end" aria-live="polite">
      <span className={cn("text-[10px] inline-flex items-center gap-1", config.className)}>
        <Icon className="w-3.5 h-3.5" /> {config.text}
      </span>
    </div>
  );
});
StatusIndicator.displayName = 'StatusIndicator';
