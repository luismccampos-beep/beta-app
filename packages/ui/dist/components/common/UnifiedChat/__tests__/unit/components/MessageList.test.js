import { jsx as _jsx } from "react/jsx-runtime";
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { MessageList } from '../../../components/MessageList/MessageList';
vi.mock('next-intl', () => ({
    useTranslations: () => (key) => key,
}));
vi.mock('../../../utils/AutoSizer', () => ({
    default: ({ children }) => children({ width: 500, height: 500 }),
}));
vi.mock('react-window', () => ({
    List: ({ rowComponent: RowComponent, rowCount, rowProps }) => (_jsx("div", { "data-testid": "virtual-list", children: Array.from({ length: rowCount }).map((_, index) => (_jsx("div", { children: _jsx(RowComponent, { index: index, style: {}, ariaAttributes: { 'aria-posinset': index + 1, 'aria-setsize': rowCount, role: 'listitem' }, ...rowProps }) }, index))) })),
    useListRef: () => ({ current: { scrollToRow: vi.fn() } }),
}));
window.HTMLElement.prototype.scrollIntoView = vi.fn();
describe('MessageList', () => {
    const mockMessages = [
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
        render(_jsx(MessageList, { messages: mockMessages, isAssistantTyping: false }));
        expect(screen.getByTestId('virtual-list')).toBeInTheDocument();
        expect(screen.getByText('Hello')).toBeInTheDocument();
        expect(screen.getByText('Hi there')).toBeInTheDocument();
    });
    it('shows typing indicator when isAssistantTyping is true', () => {
        render(_jsx(MessageList, { messages: mockMessages, isAssistantTyping: true }));
        const list = screen.getByTestId('virtual-list');
        expect(list.children).toHaveLength(mockMessages.length + 1);
    });
});
//# sourceMappingURL=MessageList.test.js.map