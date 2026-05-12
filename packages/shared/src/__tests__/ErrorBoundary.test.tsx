import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ErrorBoundary, ErrorBoundaryGroup, withErrorBoundary } from '../components/common/ErrorBoundary';
import { reportError } from '../logger/errorReporter';

vi.mock('../logger/errorReporter', () => ({
  reportError: vi.fn(),
}));

describe('ErrorBoundary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders fallback UI and reports error', () => {
    const ProblemChild = () => {
      throw new Error('Boom');
    };

    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );

    expect(screen.getByText('Algo correu mal')).toBeTruthy();
    expect(reportError).toHaveBeenCalled();
  });

  it('invokes onError with boundary context', () => {
    const ProblemChild = () => {
      throw new Error('Boom');
    };
    const onError = vi.fn();

    render(
      <ErrorBoundary boundaryId="profile" onError={onError}>
        <ProblemChild />
      </ErrorBoundary>
    );

    expect(onError).toHaveBeenCalled();
    expect(reportError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({ boundaryId: 'profile', componentStack: expect.any(String) })
    );
  });

  it('recovers after retry when error stops', () => {
    let shouldThrow = true;
    const ProblemChild = () => {
      if (shouldThrow) throw new Error('Boom');
      return <div>Ok</div>;
    };

    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );

    expect(screen.getByText('Algo correu mal')).toBeTruthy();
    shouldThrow = false;
    fireEvent.click(screen.getByRole('button', { name: /Tentar Novamente/i }));
    expect(screen.getByText('Ok')).toBeTruthy();
  });

  it('records recovery benchmark', async () => {
    let shouldThrow = true;
    const ProblemChild = () => {
      if (shouldThrow) throw new Error('Boom');
      return <div>Ok</div>;
    };

    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );

    shouldThrow = false;
    const start = performance.now();
    fireEvent.click(screen.getByRole('button', { name: /Tentar Novamente/i }));
    await screen.findByText('Ok');
    const duration = performance.now() - start;
    console.info('ErrorBoundary recovery ms', duration);
    expect(duration).toBeLessThan(500);
  });

  it('supports fallbackRender', () => {
    const ProblemChild = () => {
      throw new Error('Boom');
    };
    const fallbackRender = vi.fn(() => <div>Custom fallback</div>);

    render(
      <ErrorBoundary fallbackRender={fallbackRender}>
        <ProblemChild />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom fallback')).toBeTruthy();
    expect(fallbackRender).toHaveBeenCalled();
  });

  it('renders fallback node when provided', () => {
    const ProblemChild = () => {
      throw new Error('Boom');
    };

    render(
      <ErrorBoundary fallback={<div>Fallback node</div>}>
        <ProblemChild />
      </ErrorBoundary>
    );

    expect(screen.getByText('Fallback node')).toBeTruthy();
  });

  it('resets when resetKeys change', () => {
    const ProblemChild = ({ shouldThrow }: { shouldThrow: boolean }) => {
      if (shouldThrow) throw new Error('Boom');
      return <div>Recovered</div>;
    };

    const { rerender } = render(
      <ErrorBoundary resetKeys={[1]}>
        <ProblemChild shouldThrow />
      </ErrorBoundary>
    );

    expect(screen.getByText('Algo correu mal')).toBeTruthy();

    rerender(
      <ErrorBoundary resetKeys={[2]}>
        <ProblemChild shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Recovered')).toBeTruthy();
  });

  it('skips monitoring when reportToMonitoring is false', () => {
    const ProblemChild = () => {
      throw new Error('Boom');
    };

    render(
      <ErrorBoundary reportToMonitoring={false}>
        <ProblemChild />
      </ErrorBoundary>
    );

    expect(reportError).not.toHaveBeenCalled();
  });

  it('reports retry handler failures', () => {
    const ProblemChild = () => {
      throw new Error('Boom');
    };
    const onRetry = vi.fn(() => {
      throw new Error('Retry failed');
    });

    render(
      <ErrorBoundary boundaryId="retry" onRetry={onRetry}>
        <ProblemChild />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button', { name: /Tentar Novamente/i }));
    expect(reportError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({ boundaryId: 'retry', tags: { action: 'retry' } })
    );
  });

  it('reports reload handler failures', () => {
    const ProblemChild = () => {
      throw new Error('Boom');
    };
    const onReload = vi.fn(() => {
      throw new Error('Reload failed');
    });

    render(
      <ErrorBoundary boundaryId="reload" onReload={onReload}>
        <ProblemChild />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button', { name: /Recarregar Página/i }));
    expect(reportError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({ boundaryId: 'reload', tags: { action: 'reload' } })
    );
  });

  it('wraps components with withErrorBoundary', () => {
    const Simple = () => <div>Wrapped</div>;
    const Wrapped = withErrorBoundary(Simple);
    render(<Wrapped />);
    expect(screen.getByText('Wrapped')).toBeTruthy();
  });

  it('renders ErrorBoundaryGroup children', () => {
    render(
      <ErrorBoundaryGroup
        boundaries={[
          { boundaryId: 'one' },
          { boundaryId: 'two' },
        ]}
      >
        <div>Grouped</div>
      </ErrorBoundaryGroup>
    );
    expect(screen.getByText('Grouped')).toBeTruthy();
  });
});
