import { describe, expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MultiSelectCombobox } from '../MultiSelectCombobox';

const sampleOptions = [
  { value: 'pt', label: 'Portugal' },
  { value: 'es', label: 'Spain' },
  { value: 'fr', label: 'France' },
  { value: 'it', label: 'Italy' },
];

/** Find the trigger button — the one with the placeholder aria-label */
function getTrigger() {
  return screen.getByRole('button', { name: /select options/i });
}

describe('MultiSelectCombobox – accessibility', () => {
  it('renders trigger button with aria-haspopup="listbox"', () => {
    render(
      <MultiSelectCombobox options={sampleOptions} selected={[]} onChange={() => {}} />,
    );
    expect(getTrigger()).toHaveAttribute('aria-haspopup', 'listbox');
  });

  it('does not set aria-expanded when closed', () => {
    render(
      <MultiSelectCombobox options={sampleOptions} selected={[]} onChange={() => {}} />,
    );
    expect(getTrigger()).toHaveAttribute('aria-expanded', 'false');
  });

  it('sets aria-expanded="true" when opened', () => {
    render(
      <MultiSelectCombobox options={sampleOptions} selected={[]} onChange={() => {}} />,
    );
    fireEvent.click(getTrigger());
    expect(getTrigger()).toHaveAttribute('aria-expanded', 'true');
  });

  it('renders a listbox with role="listbox" when opened', () => {
    render(
      <MultiSelectCombobox options={sampleOptions} selected={[]} onChange={() => {}} />,
    );
    fireEvent.click(getTrigger());
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('opens listbox on ArrowDown key press', () => {
    render(
      <MultiSelectCombobox options={sampleOptions} selected={[]} onChange={() => {}} />,
    );
    fireEvent.keyDown(getTrigger(), { key: 'ArrowDown' });
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('renders options with role="option"', () => {
    render(
      <MultiSelectCombobox options={sampleOptions} selected={[]} onChange={() => {}} />,
    );
    fireEvent.click(getTrigger());
    expect(screen.getAllByRole('option')).toHaveLength(4);
  });

  it('marks selected options with aria-selected="true"', () => {
    render(
      <MultiSelectCombobox options={sampleOptions} selected={['pt']} onChange={() => {}} />,
    );
    fireEvent.click(getTrigger());
    expect(screen.getByRole('option', { name: /portugal/i })).toHaveAttribute('aria-selected', 'true');
  });

  it('marks unselected options with aria-selected="false"', () => {
    render(
      <MultiSelectCombobox options={sampleOptions} selected={['pt']} onChange={() => {}} />,
    );
    fireEvent.click(getTrigger());
    expect(screen.getByRole('option', { name: /spain/i })).toHaveAttribute('aria-selected', 'false');
  });

  it('closes listbox on Escape key', () => {
    render(
      <MultiSelectCombobox options={sampleOptions} selected={[]} onChange={() => {}} />,
    );
    fireEvent.click(getTrigger());
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    fireEvent.keyDown(getTrigger(), { key: 'Escape' });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('renders selected items with remove buttons that have accessible labels', () => {
    render(
      <MultiSelectCombobox options={sampleOptions} selected={['pt', 'es']} onChange={() => {}} />,
    );
    expect(screen.getAllByRole('button', { name: /remove/i })).toHaveLength(2);
    expect(screen.getByRole('button', { name: /remove portugal/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /remove spain/i })).toBeInTheDocument();
  });

  it('renders a group for selected items with aria-label', () => {
    render(
      <MultiSelectCombobox options={sampleOptions} selected={['pt']} onChange={() => {}} />,
    );
    expect(screen.getByRole('group', { name: /selected items/i })).toBeInTheDocument();
  });

  it('provides a searchbox with accessible label when opened', () => {
    render(
      <MultiSelectCombobox
        options={sampleOptions}
        selected={[]}
        onChange={() => {}}
        searchPlaceholder="Search countries"
      />,
    );
    fireEvent.click(getTrigger());
    expect(screen.getByRole('searchbox', { name: /search countries/i })).toBeInTheDocument();
  });

  it('applies label prop as accessible name to the trigger when provided', () => {
    render(
      <MultiSelectCombobox
        options={sampleOptions}
        selected={[]}
        onChange={() => {}}
        label="Destinations"
      />,
    );
    expect(screen.getByRole('button', { name: /destinations/i })).toBeInTheDocument();
  });
});
