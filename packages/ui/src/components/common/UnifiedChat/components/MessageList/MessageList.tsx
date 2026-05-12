import React, { useEffect, useCallback, useMemo } from 'react';
import { List, useListRef } from 'react-window';

import type { Message, MessageListProps } from '../../UnifiedChat.types';
import AutoSizer from '../../utils/AutoSizer';
import { MessageItem } from '../MessageItem/MessageItem';
import { TypingIndicator } from '../TypingIndicator/TypingIndicator';

const estimateItemSize = (content: string, type?: string) => {
  const baseHeight = 60; 
  const charsPerLine = 50;
  const lineHeight = 20;
  
  const cleanContent = content || '';
  const lines = Math.ceil(cleanContent.length / charsPerLine) + (cleanContent.split('\n').length - 1);
  
  let extra = 0;
  if (type === 'code') extra += 40;
  if (type === 'markdown') extra += 20;

  return Math.min(baseHeight + (lines * lineHeight) + extra, 800);
};

type RowProps = {
  messages: Message[];
  isAssistantTyping: boolean;
  sessionUser?: MessageListProps['sessionUser'];
};

type RowRenderProps = RowProps & {
  index: number;
  style: React.CSSProperties;
  ariaAttributes: { "aria-posinset": number; "aria-setsize": number; role: "listitem" };
};

const Row = ({ index, style, ariaAttributes, messages, isAssistantTyping, sessionUser }: RowRenderProps) => {
  
  if (index === messages.length && isAssistantTyping) {
    return (
      <div style={style} className="px-4" {...ariaAttributes}>
        <TypingIndicator />
      </div>
    );
  }

  // eslint-disable-next-line security/detect-object-injection -- index is controlled by react-window and is always a valid number
  const message = messages[index];
  const previousMessage = index > 0 ? messages[index - 1] : undefined;

  if (!message) return null;

  return (
    <div style={style} className="px-4" {...ariaAttributes}>
      <MessageItem
        message={message}
        {...(previousMessage ? { previousMessage } : {})}
          {...(sessionUser ? { sessionUser } : {})}
      />
    </div>
  );
};

export const MessageList = React.memo<MessageListProps>(({ messages, isAssistantTyping, sessionUser }) => {
  const listRef = useListRef(null);

  useEffect(() => {
    if (listRef.current) {
      const lastIndex = messages.length + (isAssistantTyping ? 1 : 0) - 1;
      if (lastIndex >= 0) {
        listRef.current.scrollToRow({ index: lastIndex, align: 'end' });
      }
    }
  }, [messages, isAssistantTyping]);

  const getItemSize = useCallback((index: number) => {
    if (index === messages.length && isAssistantTyping) return 40;
    // eslint-disable-next-line security/detect-object-injection -- index is controlled by react-window and is always a valid number
    const msg = messages[index];
    if (!msg) return 60;
    return estimateItemSize(msg.content, msg.type);
  }, [messages, isAssistantTyping]);

  const rowProps = useMemo<RowProps>(() => ({
    messages,
    isAssistantTyping,
    sessionUser
  }), [messages, isAssistantTyping, sessionUser]);

  const itemCount = messages.length + (isAssistantTyping ? 1 : 0);

  return (
    <div className="flex-1 w-full h-full bg-transparent" role="log" aria-live="polite">
      <AutoSizer>
        {({ height, width }) => (
          <List
            className="scrollbar-thin scrollbar-thumb-blue-500/30 scrollbar-track-transparent"
            defaultHeight={height}
            listRef={listRef}
            rowComponent={Row}
            rowCount={itemCount}
            rowHeight={(index) => getItemSize(index)}
            rowProps={rowProps}
            style={{ height, width }}
          />
        )}
      </AutoSizer>
    </div>
  );
});

MessageList.displayName = 'MessageList';
