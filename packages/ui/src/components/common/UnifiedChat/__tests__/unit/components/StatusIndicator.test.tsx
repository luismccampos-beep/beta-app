import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { StatusIndicator } from '../../../components/StatusIndicator/StatusIndicator';

const statusCases = [
  { status: 'sending' as const, text: 'Enviando…' },
  { status: 'delivered' as const, text: 'Entregue' },
  { status: 'read' as const, text: 'Lida' },
  { status: 'failed' as const, text: 'Falha' },
];

describe('StatusIndicator', () => {
  it('renders nothing when status prop is omitted', () => {
    // @ts-expect-error - Intentionally omitting required 'status' prop to test fallback behavior (should render nothing, e.g., treated as idle)
    const { container } = render(<StatusIndicator />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing for unknown/invalid status', () => {
    // @ts-expect-error - Intentionally passing invalid status value to test fallback behavior
    const { container } = render(<StatusIndicator status="unknown" />);
    expect(container).toBeEmptyDOMElement();
  });

  it.each(statusCases)(
    'renders "$text" for status "$status"',
    ({ status, text }) => {
      render(<StatusIndicator status={status} />);
      expect(screen.getByText(text)).toBeInTheDocument();
    }
  );

  it('applies red color class for failed status', () => {
    render(<StatusIndicator status="failed" />);
    expect(screen.getByText('Falha')).toHaveClass('text-red-500');
  });

  it('wraps the status text in an element with aria-live="polite"', () => {
    render(<StatusIndicator status="sending" />);
    const statusText = screen.getByText('Enviando…');
    const liveRegion = statusText.closest('[aria-live="polite"]');
    expect(liveRegion).toBeInTheDocument();
    expect(liveRegion).toContainElement(statusText);
  });
});