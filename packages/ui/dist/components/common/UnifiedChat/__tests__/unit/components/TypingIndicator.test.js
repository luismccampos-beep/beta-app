import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TypingIndicator } from '../../../components/TypingIndicator/TypingIndicator';
vi.mock('next-intl', () => ({
    useTranslations: () => (key) => key,
}));
describe('TypingIndicator', () => {
    it('renders correctly', () => {
        render(_jsx(TypingIndicator, {}));
        expect(screen.getByRole('status')).toBeInTheDocument();
    });
    it('has aria-live="polite"', () => {
        render(_jsx(TypingIndicator, {}));
        const container = screen.getByRole('status');
        expect(container).toHaveAttribute('aria-live', 'polite');
    });
    it('contains screen reader only text', () => {
        render(_jsx(TypingIndicator, {}));
        expect(screen.getByText('Digitando...')).toBeInTheDocument();
    });
});
//# sourceMappingURL=TypingIndicator.test.js.map