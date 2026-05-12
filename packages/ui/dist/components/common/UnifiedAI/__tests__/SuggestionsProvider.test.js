import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SuggestionsProvider } from '../suggestions/SuggestionsProvider';
let currentState;
vi.mock('../suggestions/useAISuggestions', () => ({
    useAISuggestions: () => currentState,
}));
const buildSuggestion = (overrides = {}) => ({
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
        render(_jsx(SuggestionsProvider, {}));
        expect(screen.getByRole('button', { name: 'Lisboa' })).toBeInTheDocument();
    });
    it('renders children node when provided', () => {
        currentState = {
            items: [buildSuggestion()],
            isLoading: false,
            error: null,
            refresh: vi.fn(),
        };
        render(_jsx(SuggestionsProvider, { children: _jsx("div", { children: "Custom UI" }) }));
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
        render(_jsx(SuggestionsProvider, { children: (state) => (_jsxs("div", { children: [_jsx("span", { children: state.items.length }), _jsx("button", { type: "button", onClick: () => state.refresh(), children: "Refresh" })] })) }));
        expect(screen.getByText('2')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Refresh' }));
        expect(refresh).toHaveBeenCalled();
    });
});
//# sourceMappingURL=SuggestionsProvider.test.js.map