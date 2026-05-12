import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ChatWindow } from '../../../components/ChatWindow/ChatWindow';
vi.mock('next-intl', () => ({
    useTranslations: () => (key) => key,
}));
// Mock ChatHeader to simplify testing
vi.mock('../../../components/ChatHeader/ChatHeader', () => ({
    ChatHeader: ({ isMinimized }) => (_jsxs("div", { "data-testid": "chat-header", children: ["Header ", isMinimized ? '(Minimized)' : '(Open)'] })),
}));
// Mock framer-motion
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, animate, style, className, ...props }) => (_jsx("div", { className: className, style: { ...style, ...animate }, ...props, children: children })),
    },
    AnimatePresence: ({ children }) => _jsx(_Fragment, { children: children }),
}));
describe('ChatWindow', () => {
    const defaultProps = {
        onMinimizeToggle: vi.fn(),
        onClose: vi.fn(),
        isMinimized: false,
    };
    it('renders correctly', () => {
        render(_jsx(ChatWindow, { ...defaultProps, children: _jsx("div", { "data-testid": "chat-content", children: "Chat Content" }) }));
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByTestId('chat-header')).toBeInTheDocument();
        expect(screen.getByTestId('chat-content')).toBeInTheDocument();
    });
    it('hides children when minimized', () => {
        render(_jsx(ChatWindow, { ...defaultProps, isMinimized: true, children: _jsx("div", { "data-testid": "chat-content", children: "Chat Content" }) }));
        expect(screen.getByTestId('chat-header')).toHaveTextContent('Header (Minimized)');
        expect(screen.queryByTestId('chat-content')).not.toBeInTheDocument();
    });
    it('applies correct height when minimized', () => {
        const { container } = render(_jsx(ChatWindow, { ...defaultProps, isMinimized: true, children: _jsx("div", { children: "Content" }) }));
        const windowElement = container.firstChild;
        expect(windowElement.style.height).toBe('3.75rem');
    });
    it('applies correct height when open', () => {
        const { container } = render(_jsx(ChatWindow, { ...defaultProps, isMinimized: false, children: _jsx("div", { children: "Content" }) }));
        const windowElement = container.firstChild;
        expect(windowElement.style.height).toBe('70vh');
    });
});
//# sourceMappingURL=ChatWindow.test.js.map