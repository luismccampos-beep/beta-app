import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { cn } from '../../../../../utils';
import type { ChatWindowProps } from '../../UnifiedChat.types';
import { ChatHeader } from '../ChatHeader/ChatHeader';

const MINIMIZED_HEIGHT = '3.75rem';
const OPEN_HEIGHT = '70vh';

export const ChatWindow = React.memo<ChatWindowProps>(
  ({ isMinimized, children, onMinimizeToggle, onClose, status }) => {
    const minimized = isMinimized ?? false;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ 
          opacity: 1, 
          y: 0, 
          scale: 1,
          height: minimized ? MINIMIZED_HEIGHT : OPEN_HEIGHT,
        }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "fixed bottom-[calc(env(safe-area-inset-bottom,0px)+1rem)] md:bottom-[calc(env(safe-area-inset-bottom,0px)+2rem)] right-5 md:right-8 w-[24rem] max-w-[calc(100vw-2.5rem)] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl flex flex-col origin-bottom-right z-50 overflow-hidden",
          "max-[480px]:right-2 max-[480px]:left-2 max-[480px]:max-w-[calc(100vw-1rem)]",
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="chat-header-title"
      >
        <ChatHeader onMinimizeToggle={onMinimizeToggle} onClose={onClose} isMinimized={minimized} status={status || 'idle'} />
        <AnimatePresence>
          {!minimized && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col min-h-0"
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }
);

ChatWindow.displayName = 'ChatWindow';