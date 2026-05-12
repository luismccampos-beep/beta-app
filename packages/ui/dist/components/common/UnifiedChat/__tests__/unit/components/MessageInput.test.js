import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MessageInput } from '../../../components/MessageInput/MessageInput';
vi.mock('next-intl', () => ({
    useTranslations: () => (key) => key,
}));
describe('MessageInput', () => {
    it('renders input and button', () => {
        render(_jsx(MessageInput, { onSendMessage: vi.fn(), isSending: false }));
        expect(screen.getByPlaceholderText('Digite sua mensagem...')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Enviar mensagem' })).toBeInTheDocument();
    });
    it('updates value on change', () => {
        render(_jsx(MessageInput, { onSendMessage: vi.fn(), isSending: false }));
        const input = screen.getByPlaceholderText('Digite sua mensagem...');
        fireEvent.change(input, { target: { value: 'Hello' } });
        expect(input).toHaveValue('Hello');
    });
    it('calls onSendMessage when submit button clicked', () => {
        const handleSend = vi.fn();
        render(_jsx(MessageInput, { onSendMessage: handleSend, isSending: false }));
        const input = screen.getByPlaceholderText('Digite sua mensagem...');
        fireEvent.change(input, { target: { value: 'Hello' } });
        const button = screen.getByRole('button', { name: 'Enviar mensagem' });
        fireEvent.click(button);
        expect(handleSend).toHaveBeenCalledWith('Hello');
        expect(input).toHaveValue('');
    });
    it('calls onSendMessage when Enter pressed', () => {
        const handleSend = vi.fn();
        render(_jsx(MessageInput, { onSendMessage: handleSend, isSending: false }));
        const input = screen.getByPlaceholderText('Digite sua mensagem...');
        fireEvent.change(input, { target: { value: 'Hello' } });
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', charCode: 13 });
        expect(handleSend).toHaveBeenCalledWith('Hello');
    });
    it('does not send empty message', () => {
        const handleSend = vi.fn();
        render(_jsx(MessageInput, { onSendMessage: handleSend, isSending: false }));
        const button = screen.getByRole('button', { name: 'Enviar mensagem' });
        fireEvent.click(button);
        expect(handleSend).not.toHaveBeenCalled();
    });
    it('shows autocomplete when typing /', () => {
        render(_jsx(MessageInput, { onSendMessage: vi.fn(), isSending: false }));
        const input = screen.getByPlaceholderText('Digite sua mensagem...');
        fireEvent.change(input, { target: { value: '/' } });
        expect(screen.getByText('/help')).toBeInTheDocument();
        fireEvent.change(input, { target: { value: '/cle' } });
        expect(screen.getByText('/clear')).toBeInTheDocument();
        expect(screen.queryByText('/help')).not.toBeInTheDocument();
    });
});
//# sourceMappingURL=MessageInput.test.js.map