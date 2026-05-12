import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { AISuggestionsState } from '../suggestions/useAISuggestions';
import type { AISuggestion } from '../types/ai.types';
import { SuggestionsProvider } from '../suggestions/SuggestionsProvider';

let currentState: AISuggestionsState;

vi.mock('../suggestions/useAISuggestions', () => ({
  useAISuggestions: () => currentState,
}));

const buildSuggestion = (overrides: Partial<AISuggestion> = {}): AISuggestion => ({
  id: overrides.id ?? '1',
  label: overrides.label ?? 'Lisboa',
  payload: overrides.payload ?? {},
});

describe('SuggestionsProvider', () => {
  beforeEach(() => {
    currentState = {
      items: [],
      isLoading: false,
      error: null,
      refresh: vi.fn(),
    };
  });

  it('renders SuggestionsRenderer when no children are provided', () => {
    currentState = {
      items: [buildSuggestion()],
      isLoading: false,
      error: null,
      refresh: vi.fn(),
    };

    render(<SuggestionsProvider />);

    expect(screen.getByRole('button', { name: 'Lisboa' })).toBeInTheDocument();
  });

  it('renders children node when provided', () => {
    currentState = {
      items: [buildSuggestion()],
      isLoading: false,
      error: null,
      refresh: vi.fn(),
    };

    render(
      <SuggestionsProvider>
        <div>Custom UI</div>
      </SuggestionsProvider>
    );

    expect(screen.getByText('Custom UI')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Lisboa' })).toBeNull();
  });

  it('invokes render prop with suggestions state', () => {
    const refresh = vi.fn();
    currentState = {
      items: [buildSuggestion({ id: '1', label: 'Porto' }), buildSuggestion({ id: '2', label: 'Coimbra' })],
      isLoading: false,
      error: null,
      refresh,
    };

    render(
      <SuggestionsProvider>
        {(state) => (
          <div>
            <span>{state.items.length}</span>
            <button type="button" onClick={() => state.refresh()}>Refresh</button>
          </div>
        )}
      </SuggestionsProvider>
    );

    expect(screen.getByText('2')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Refresh' }));
    expect(refresh).toHaveBeenCalled();
  });
});
