import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UnifiedChat } from '../../../UnifiedChat';
import { useChatStore } from '../../../store/useChatStore';
vi.mock('next-intl', () => ({
    useTranslations: () => (key) => key,
}));
vi.mock('../../../services/ChatApiService', () => ({
    ChatApiService: {
        getMessages: vi.fn().mockResolvedValue([]),
        sendMessage: vi.fn(),
    },
}));
vi.mock('../../../services/ChatStorageService', () => ({
    ChatStorageService: {
        load: vi.fn().mockReturnValue([]),
        save: vi.fn(),
    },
}));
describe('UnifiedChat', () => {
    beforeEach(() => {
        useChatStore.setState({
            isOpen: false,
            isMinimized: false,
            messages: [],
            status: 'idle',
            unreadCount: 0,
        });
    });
    it('renders chat bubble initially', () => {
        render(_jsx(UnifiedChat, {}));
        const bubble = screen.getByRole('button', { name: /Abrir chat de suporte/i });
        expect(bubble).toBeTruthy();
    });
    it('opens chat window when bubble is clicked', async () => {
        render(_jsx(UnifiedChat, {}));
        const bubble = screen.getByRole('button', { name: /Abrir chat de suporte/i });
        fireEvent.click(bubble);
        const window = await screen.findByRole('dialog');
        expect(window).toBeTruthy();
        expect(await screen.findByText('Suporte AKMLEVA')).toBeTruthy();
    });
    it('shows message input when open', async () => {
        render(_jsx(UnifiedChat, {}));
        const bubble = screen.getByRole('button', { name: /Abrir chat de suporte/i });
        fireEvent.click(bubble);
        const input = await screen.findByPlaceholderText('Digite sua mensagem...');
        expect(input).toBeTruthy();
    });
});
//# sourceMappingURL=UnifiedChat.test.js.map