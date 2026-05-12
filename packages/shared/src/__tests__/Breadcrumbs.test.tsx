import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { BreadcrumbItem, Breadcrumbs } from '../components/common/Breadcrumbs';
import { reportError } from '../logger/errorReporter';

const push = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
  usePathname: () => '/account/settings',
}));

vi.mock('../logger/errorReporter', () => ({
  reportError: vi.fn(),
  NavigationError: class NavigationError extends Error {},
}));

describe('Breadcrumbs', () => {
  beforeEach(() => {
    push.mockClear();
  });

  it('builds breadcrumbs from pathname when items are missing', () => {
    render(<Breadcrumbs />);

    expect(screen.getByText('Home')).toBeTruthy();
    expect(screen.getByText('account')).toBeTruthy();
    expect(screen.getByText('settings')).toBeTruthy();
  });

  it('navigates using router when item is clicked', () => {
    render(
      <Breadcrumbs
        items={[
          { label: 'Account', href: '/account' },
          { label: 'Settings', href: '/account/settings' },
        ]}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Account' }));
    expect(push).toHaveBeenCalledWith('/account');
  });

  it('blocks unsafe hrefs', () => {
    render(
      <Breadcrumbs
        items={[
          { label: 'Bad', href: 'javascript:alert(1)' },
          { label: 'Safe', href: '/safe' },
          { label: 'Current' },
        ]}
        showHome={false}
      />
    );

    expect(screen.queryByRole('button', { name: 'Bad' })).toBeNull();
    expect(screen.getByRole('button', { name: 'Safe' })).toBeTruthy();
  });

  it('reports navigation errors', () => {
    const onNavigate = vi.fn(() => {
      throw new Error('Boom');
    });
    render(
      <Breadcrumbs
        items={[
          { label: 'Account', href: '/account' },
          { label: 'Settings' },
        ]}
        onNavigate={onNavigate}
        showHome={false}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Account' }));
    expect(reportError).toHaveBeenCalled();
  });

  it('marks last item as current page', () => {
    render(
      <Breadcrumbs
        items={[
          { label: 'Account', href: '/account' },
          { label: 'Settings' },
        ]}
      />
    );

    const current = screen.getByText('Settings');
    expect(current.getAttribute('aria-current')).toBe('page');
  });

  it('uses custom navigation handler', () => {
    const onNavigate = vi.fn();
    render(
      <Breadcrumbs
        items={[
          { label: 'Account', href: '/account' },
          { label: 'Settings', href: '/account/settings' },
        ]}
        onNavigate={onNavigate}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Account' }));
    expect(onNavigate).toHaveBeenCalledWith('/account', expect.objectContaining({ label: 'Account' }));
    expect(push).not.toHaveBeenCalled();
  });

  it('collapses items on small maxItems', () => {
    render(
      <Breadcrumbs
        items={[
          { label: 'A', href: '/a' },
          { label: 'B', href: '/b' },
          { label: 'C', href: '/c' },
          { label: 'D', href: '/d' },
        ]}
        maxItems={3}
        maxItemsMobile={3}
        showHome={false}
      />
    );

    expect(screen.getByText('…')).toBeTruthy();
  });

  it('responds to mobile breakpoint changes', async () => {
    const listeners: Array<(event: MediaQueryListEvent) => void> = [];
    const matchMedia = vi.fn().mockImplementation(() => ({
      matches: false,
      addEventListener: (_: string, cb: (event: MediaQueryListEvent) => void) => listeners.push(cb),
      removeEventListener: vi.fn(),
    }));
    Object.defineProperty(window, 'matchMedia', { writable: true, value: matchMedia });

    render(
      <Breadcrumbs
        items={[
          { label: 'A', href: '/a' },
          { label: 'B', href: '/b' },
          { label: 'C', href: '/c' },
          { label: 'D', href: '/d' },
        ]}
        maxItems={4}
        maxItemsMobile={2}
        showHome={false}
      />
    );

    listeners.forEach((cb) => cb({ matches: true } as MediaQueryListEvent));
    await waitFor(() => expect(screen.getByText('…')).toBeTruthy());
  });

  it('applies segment label overrides', () => {
    render(
      <Breadcrumbs
        segmentLabels={{ account: 'Conta' }}
        usePathFallback
      />
    );

    expect(screen.getByText('Conta')).toBeTruthy();
  });

  it('renders BreadcrumbItem and handles navigation errors', () => {
    const onNavigate = vi.fn(() => {
      throw new Error('Boom');
    });
    render(
      <BreadcrumbItem
        label="Account"
        href="/account"
        onNavigate={onNavigate}
        index={1}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Account' }));
    expect(reportError).toHaveBeenCalled();
  });
});
