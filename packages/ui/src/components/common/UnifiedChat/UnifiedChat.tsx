import React, { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import type { UnifiedChatProps, Message } from './UnifiedChat.types';
import { useChatStore } from './store/useChatStore';
import { ChatBubble } from './components/ChatBubble/ChatBubble';
import { ChatWindow } from './components/ChatWindow/ChatWindow';
import { MessageList } from './components/MessageList/MessageList';
import { MessageInput } from './components/MessageInput/MessageInput';
import { TopicsSection } from './components/TopicsSection/TopicsSection';
import { WELCOME_MESSAGE_ID } from './UnifiedChat.constants';

const CHAT_LAYOUT_ID = 'unified-chat-layout';

/**
 * UnifiedChat Component
 *
 * A production-ready chat component that provides:
 * - A fluid, animated interface that transitions from a bubble to a full window.
 * - A responsive, mobile-first design (bottom sheet on mobile, floating window on desktop).
 * - Full dark and light mode support.
 * - Real-time messaging with AI assistant and topic-based quick actions.
 */
export const UnifiedChat: React.FC<UnifiedChatProps> = ({
  config,
  className,
  style,
  onReady,
  onDestroy,
  userId,
  userName,
  userAvatar,
}) => {
  const t = useTranslations('chat');
  const [topicsMinimized, setTopicsMinimized] = useState(true);

  const {
    isOpen,
    isMinimized,
    status,
    messages,
    unreadCount,
    open,
    close,
    minimize,
    maximize,
    sendMessage,
    loadHistory,
  } = useChatStore();

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  useEffect(() => {
    onReady?.();
    return () => onDestroy?.();
  }, [onReady, onDestroy]);

  const handleSendMessage = useCallback(async (content: string) => {
    const trimmedContent = content.trim().toLowerCase();

    if (trimmedContent === '/clear') {
      useChatStore.getState().clearMessages();
      return;
    }

    if (trimmedContent === '/help') {
      const helpMessage: Message = {
        id: `help-${Date.now()}`,
        content: t('helpMessage'),
        role: 'assistant',
        timestamp: Date.now(),
        type: 'markdown',
        isRead: true,
        status: 'delivered',
      };
      useChatStore.setState((state) => ({
        messages: [...state.messages, helpMessage],
      }));
      return;
    }

    await sendMessage(content);
  }, [sendMessage, t]);

  const handleTopicSelect = useCallback((topic: string) => {
    handleSendMessage(t('topicMessage', { topic }));
  }, [handleSendMessage, t]);

  const handleBubbleClick = useCallback(() => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }, [isOpen, open, close]);

  const handleClose = useCallback(() => {
    close();
  }, [close]);

  const handleMinimizeToggle = useCallback(() => {
    if (isMinimized) {
      maximize();
    } else {
      minimize();
    }
  }, [isMinimized, minimize, maximize]);

  const isAssistantTyping = status === 'typing' || status === 'sending';

  const sessionUser = {
    ...(userId !== undefined ? { id: userId } : {}),
    ...(userName !== undefined ? { name: userName } : {}),
    ...(userAvatar !== undefined ? { image: userAvatar } : {}),
  };

  const displayMessages = messages.length > 1
    ? messages.filter(m => m.id !== WELCOME_MESSAGE_ID)
    : messages;

  return (
    <div className={className} style={style}>
      <AnimatePresence>
        {!isOpen && (
          <motion.div layoutId={CHAT_LAYOUT_ID}>
            <ChatBubble
              unreadCount={unreadCount}
              onClick={handleBubbleClick}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          // layoutId on the wrapper — ChatWindow stays unaware of framer-motion
          <motion.div layoutId={CHAT_LAYOUT_ID}>
            <ChatWindow
              isMinimized={isMinimized}
              onMinimizeToggle={handleMinimizeToggle}
              onClose={handleClose}
              status={status}
            >
              <TopicsSection
                isMinimized={topicsMinimized}
                onToggleMinimize={() => setTopicsMinimized(!topicsMinimized)}
                onTopicSelect={handleTopicSelect}
                topics={config?.content?.topics}
              />
              <MessageList
                messages={displayMessages}
                isAssistantTyping={isAssistantTyping}
                sessionUser={sessionUser}
              />
              <MessageInput
                onSendMessage={handleSendMessage}
                isSending={status === 'sending'}
              />
            </ChatWindow>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

UnifiedChat.displayName = 'UnifiedChat';