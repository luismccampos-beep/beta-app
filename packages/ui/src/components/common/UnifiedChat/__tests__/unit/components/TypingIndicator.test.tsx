import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { TypingIndicator } from '../../../components/TypingIndicator/TypingIndicator';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

describe('TypingIndicator', () => {
  it('renders correctly', () => {
    render(<TypingIndicator />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('has aria-live="polite"', () => {
    render(<TypingIndicator />);
    const container = screen.getByRole('status');
    expect(container).toHaveAttribute('aria-live', 'polite');
  });

  it('contains screen reader only text', () => {
    render(<TypingIndicator />);
    expect(screen.getByText('Digitando...')).toBeInTheDocument();
  });
});