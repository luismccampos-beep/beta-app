import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';

import type { Message, MessageListProps } from '../../../UnifiedChat.types';
import { MessageList } from '../../../components/MessageList/MessageList';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('../../../utils/AutoSizer', () => ({
  default: ({ children }: { children: (size: { width: number; height: number }) => React.ReactNode }) =>
    children({ width: 500, height: 500 }),
}));

vi.mock('react-window', () => ({
  List: ({ rowComponent: RowComponent, rowCount, rowProps }: {
    rowComponent: (props: {
      index: number;
      style: React.CSSProperties;
      ariaAttributes: { 'aria-posinset': number; 'aria-setsize': number; role: 'listitem' };
    } & {
      messages: Message[];
      isAssistantTyping: boolean;
      sessionUser?: MessageListProps['sessionUser'];
    }) => React.ReactElement | null;
    rowCount: number;
    rowProps: {
      messages: Message[];
      isAssistantTyping: boolean;
      sessionUser?: MessageListProps['sessionUser'];
    };
  }) => (
    <div data-testid="virtual-list">
      {Array.from({ length: rowCount }).map((_, index) => (
        <div key={index}>
          <RowComponent
            index={index}
            style={{}}
            ariaAttributes={{ 'aria-posinset': index + 1, 'aria-setsize': rowCount, role: 'listitem' }}
            {...rowProps}
          />
        </div>
      ))}
    </div>
  ),
  useListRef: () => ({ current: { scrollToRow: vi.fn() } }),
}));

window.HTMLElement.prototype.scrollIntoView = vi.fn();

describe('MessageList', () => {
  const mockMessages: Message[] = [
    {
      id: '1',
      content: 'Hello',
      role: 'user',
      timestamp: Date.now(),
      type: 'text',
      status: 'read',
      isRead: true,
    },
    {
      id: '2',
      content: 'Hi there',
      role: 'assistant',
      timestamp: Date.now(),
      type: 'text',
      status: 'delivered',
      isRead: true,
    },
  ];

  it('renders messages using virtual list', () => {
    render(<MessageList messages={mockMessages} isAssistantTyping={false} />);

    expect(screen.getByTestId('virtual-list')).toBeInTheDocument();
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('Hi there')).toBeInTheDocument();
  });

  it('shows typing indicator when isAssistantTyping is true', () => {
    render(<MessageList messages={mockMessages} isAssistantTyping={true} />);

    const list = screen.getByTestId('virtual-list');
    expect(list.children).toHaveLength(mockMessages.length + 1);
  });
});