import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { HelpCircle, DollarSign } from 'lucide-react';

import { TopicsSection } from '../../../components/TopicsSection/TopicsSection';

const MOCK_TOPICS = [
  {
    id: '1',
    title: 'Suporte Geral',
    description: 'Ajuda com tudo',
    icon: HelpCircle,
  },
  {
    id: '2',
    title: 'Financeiro',
    description: 'Faturas e pagamentos',
    icon: DollarSign,
  },
];

vi.mock('../../../UnifiedChat.constants', () => ({
  CHAT_TOPICS: [
    { id: '1', title: 'Suporte Geral', description: 'Ajuda com tudo', icon: HelpCircle },
  ],
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

describe('TopicsSection', () => {
  const onToggleMinimize = vi.fn();
  const onTopicSelect = vi.fn();

  const defaultProps = {
    isMinimized: false,
    onToggleMinimize,
    onTopicSelect,
    topics: MOCK_TOPICS,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders correctly when expanded', () => {
    render(<TopicsSection {...defaultProps} />);
    expect(screen.getByText('Selecione um tópico')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Selecione um tópico/i })).toBeInTheDocument();
    expect(screen.getByText('Suporte Geral')).toBeInTheDocument();
  });

  it('calls onTopicSelect with correct title when a topic is clicked', () => {
    render(<TopicsSection {...defaultProps} />);

    const topicButton = screen.getByRole('button', { name: /Suporte Geral/i });
    fireEvent.click(topicButton);

    expect(onTopicSelect).toHaveBeenCalledWith('Suporte Geral');
  });

  it('handles the transition between minimized and expanded states', () => {
    const { rerender } = render(<TopicsSection {...defaultProps} isMinimized={false} />);
    let header = screen.getByRole('button', { name: /Selecione um tópico/i });
    expect(header).toHaveAttribute('aria-expanded', 'true');

    rerender(<TopicsSection {...defaultProps} isMinimized={true} />);
    header = screen.getByRole('button', { name: /Selecione um tópico/i });
    expect(header).toHaveAttribute('aria-expanded', 'false');
  });
});