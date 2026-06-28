import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AnimatedSection } from '../AnimatedSection';

/**
 * Helper: mock window.matchMedia for a given prefers-reduced-motion value.
 */
function mockMatchMedia(prefersReduced: boolean) {
  const mq = {
    matches: prefersReduced,
    media: '(prefers-reduced-motion: reduce)',
    onchange: null,
    addEventListener: vi.fn((_event: string, cb: EventListener) => {
      // Store callback so we could simulate changes if needed
    }),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  };
  vi.spyOn(window, 'matchMedia').mockImplementation(() => mq as unknown as MediaQueryList);
}

describe('AnimatedSection – accessibility', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('renders children when prefers-reduced-motion is enabled', () => {
    mockMatchMedia(true); // prefers reduced motion
    render(
      <AnimatedSection className="test-class" data-testid="section">
        <p>Content here</p>
      </AnimatedSection>,
    );

    // Should render the children
    expect(screen.getByText('Content here')).toBeInTheDocument();
    // Should NOT render a motion.div — should be a plain div
    const section = screen.getByTestId('section');
    expect(section.tagName).toBe('DIV');
    expect(section.className).toContain('test-class');
  });

  it('renders children when prefers-reduced-motion is disabled', () => {
    mockMatchMedia(false); // no preference
    render(
      <AnimatedSection className="test-class" data-testid="section">
        <p>Animated content</p>
      </AnimatedSection>,
    );

    // Should still render the children
    expect(screen.getByText('Animated content')).toBeInTheDocument();
  });

  it('renders as specified HTML element via as prop', () => {
    mockMatchMedia(true);
    render(
      <AnimatedSection as="section" data-testid="section-elem">
        <p>Section content</p>
      </AnimatedSection>,
    );

    const el = screen.getByTestId('section-elem');
    expect(el.tagName).toBe('SECTION');
  });

  it('renders as ul via as="ul" when reduced motion is enabled', () => {
    mockMatchMedia(true);
    render(
      <AnimatedSection as="ul" data-testid="list-elem">
        <li>Item</li>
      </AnimatedSection>,
    );

    const el = screen.getByTestId('list-elem');
    expect(el.tagName).toBe('UL');
  });

  it('applies className to the wrapper element', () => {
    mockMatchMedia(true);
    render(
      <AnimatedSection className="my-custom-class" data-testid="custom">
        <span>Test</span>
      </AnimatedSection>,
    );

    expect(screen.getByTestId('custom')).toHaveClass('my-custom-class');
  });
});
