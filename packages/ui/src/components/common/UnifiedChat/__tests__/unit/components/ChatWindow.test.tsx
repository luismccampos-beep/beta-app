import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { ChatWindow } from '../../../components/ChatWindow/ChatWindow';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

// Mock ChatHeader to simplify testing
vi.mock('../../../components/ChatHeader/ChatHeader', () => ({
  ChatHeader: ({ isMinimized }: { isMinimized: boolean }) => (
    <div data-testid="chat-header">Header {isMinimized ? '(Minimized)' : '(Open)'}</div>
  ),
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, animate, style, className, ...props }: any) => (
      <div
        className={className}
        style={{ ...style, ...animate }} // Apply animate props as style for testing
        {...props}
      >
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('ChatWindow', () => {
  const defaultProps = {
    onMinimizeToggle: vi.fn(),
    onClose: vi.fn(),
    isMinimized: false,
  };

  it('renders correctly', () => {
    render(
      <ChatWindow {...defaultProps}>
        <div data-testid="chat-content">Chat Content</div>
      </ChatWindow>
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByTestId('chat-header')).toBeInTheDocument();
    expect(screen.getByTestId('chat-content')).toBeInTheDocument();
  });

  it('hides children when minimized', () => {
    render(
      <ChatWindow {...defaultProps} isMinimized={true}>
        <div data-testid="chat-content">Chat Content</div>
      </ChatWindow>
    );

    expect(screen.getByTestId('chat-header')).toHaveTextContent('Header (Minimized)');
    expect(screen.queryByTestId('chat-content')).not.toBeInTheDocument();
  });

  it('applies correct height when minimized', () => {
    const { container } = render(
      <ChatWindow {...defaultProps} isMinimized={true}>
        <div>Content</div>
      </ChatWindow>
    );

    const windowElement = container.firstChild as HTMLElement;
    expect(windowElement.style.height).toBe('3.75rem');
  });

  it('applies correct height when open', () => {
    const { container } = render(
      <ChatWindow {...defaultProps} isMinimized={false}>
        <div>Content</div>
      </ChatWindow>
    );

    const windowElement = container.firstChild as HTMLElement;
    expect(windowElement.style.height).toBe('70vh');
  });
});