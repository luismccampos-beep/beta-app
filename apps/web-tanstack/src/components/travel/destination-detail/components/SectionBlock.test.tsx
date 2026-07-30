import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { ComponentType } from 'react';
import { SectionBlock } from './SectionBlock';

const TestIcon: ComponentType<{ className?: string }> = ({ className }) => (
  <span data-testid="test-icon" className={className} />
);

describe('SectionBlock', () => {
  const defaultTitle = 'Things to See';

  it('returns null when items is an empty array', () => {
    const { container } = render(
      <SectionBlock title={defaultTitle} icon={TestIcon} items={[]} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('returns null when items is undefined (regression: undefined.length crash)', () => {
    const { container } = render(
      <SectionBlock title={defaultTitle} icon={TestIcon} items={undefined} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders title and icon when items are provided', () => {
    render(
      <SectionBlock title={defaultTitle} icon={TestIcon} items={['Torre dos Clérigos']} />,
    );
    expect(screen.getByText(defaultTitle)).toBeInTheDocument();
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('renders all list items', () => {
    const items = ['Torre dos Clérigos', 'Livraria Lello', 'Ponte Dom Luís I'];
    render(<SectionBlock title={defaultTitle} icon={TestIcon} items={items} />);
    for (const item of items) {
      expect(screen.getByText(item)).toBeInTheDocument();
    }
  });

  it('renders with a single item', () => {
    render(
      <SectionBlock title="Try" icon={TestIcon} items={['Pastéis de Nata']} />,
    );
    expect(screen.getByText('Try')).toBeInTheDocument();
    expect(screen.getByText('Pastéis de Nata')).toBeInTheDocument();
  });
});
