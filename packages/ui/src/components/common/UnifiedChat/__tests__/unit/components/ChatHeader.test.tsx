import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { ChatHeader } from '../../../components/ChatHeader/ChatHeader';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

describe('ChatHeader', () => {
  const defaultProps = {
    onMinimizeToggle: vi.fn(),
    onClose: vi.fn(),
    isMinimized: false,
  };

  it('renders title and status', () => {
    render(<ChatHeader {...defaultProps} />);
    expect(screen.getByText('Suporte AKMLEVA')).toBeInTheDocument();
    expect(screen.getByText('Online')).toBeInTheDocument();
  });

  it('shows minimize icon when open', () => {
    render(<ChatHeader {...defaultProps} isMinimized={false} />);
    expect(screen.getByLabelText('Minimizar Chat')).toBeInTheDocument();
  });

  it('shows maximize icon when minimized', () => {
    render(<ChatHeader {...defaultProps} isMinimized={true} />);
    expect(screen.getByLabelText('Maximizar Chat')).toBeInTheDocument();
  });

  it('calls onMinimizeToggle when minimize button clicked', () => {
    render(<ChatHeader {...defaultProps} />);
    fireEvent.click(screen.getByLabelText('Minimizar Chat'));
    expect(defaultProps.onMinimizeToggle).toHaveBeenCalledTimes(1);
  });

  it('shows confirmation when close button clicked', () => {
    render(<ChatHeader {...defaultProps} />);
    fireEvent.click(screen.getByLabelText('Fechar Chat'));

    expect(screen.getByLabelText('Confirmar fechamento')).toBeInTheDocument();
    expect(screen.getByLabelText('Cancelar fechamento')).toBeInTheDocument();
  });

  it('calls onClose when close confirmed', () => {
    render(<ChatHeader {...defaultProps} />);

    // Open confirmation
    fireEvent.click(screen.getByLabelText('Fechar Chat'));

    // Confirm
    fireEvent.click(screen.getByLabelText('Confirmar fechamento'));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('hides confirmation when cancel clicked', () => {
    render(<ChatHeader {...defaultProps} />);

    // Open confirmation
    fireEvent.click(screen.getByLabelText('Fechar Chat'));

    // Cancel
    fireEvent.click(screen.getByLabelText('Cancelar fechamento'));

    expect(screen.queryByLabelText('Confirmar fechamento')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Fechar Chat')).toBeInTheDocument();
  });
});