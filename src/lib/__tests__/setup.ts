import React from 'react';
import '@testing-library/jest-dom';
import { vi, beforeEach } from 'vitest';

const mockPush = vi.fn();
const mockReplace = vi.fn();
const mockBack = vi.fn();
const mockForward = vi.fn();
const mockRefresh = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    back: mockBack,
    forward: mockForward,
    refresh: mockRefresh,
    prefetch: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
  useSegments: () => [],
}));

vi.mock('next-auth/react', () => ({
  useSession: () => ({ data: null, status: 'unauthenticated' }),
  getSession: () => Promise.resolve(null),
  signIn: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'pt',
  getLocale: () => 'pt',
  getMessages: () => ({}),
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock('@tanstack/react-query', () => ({
  useQuery: () => ({ data: null, isLoading: false, error: null }),
  useMutation: () => ({ mutate: vi.fn(), isLoading: false }),
  useQueryClient: () => ({
    invalidateQueries: vi.fn(),
    setQueryData: vi.fn(),
    getQueryData: vi.fn(),
  }),
  QueryClient: vi.fn(),
  QueryClientProvider: ({ children }: { children: React.ReactNode }) => children,
}));

global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
  } as Response)
);

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Strip framer-motion animation props and render plain DOM elements
vi.mock('framer-motion', () => {
  const motionProxy: Record<string, React.FC<Record<string, unknown>>> = {};
  const tags = ['div', 'button', 'ul', 'li', 'img', 'span', 'p', 'h1', 'h2', 'h3', 'section', 'a'];
  for (const tag of tags) {
    motionProxy[tag] = ({
      children,
      whileHover,
      whileTap,
      whileInView,
      whileFocus,
      exit,
      animate,
      initial,
      transition,
      viewport,
      variants,
      ...props
    }: Record<string, unknown>) =>
      React.createElement(tag, props, children as React.ReactNode);
  }
  return {
    motion: new Proxy(motionProxy, {
      get: (target, tag: string) => {
        if (target[tag]) return target[tag];
        const component = ({
          children,
          whileHover,
          whileTap,
          whileInView,
          whileFocus,
          exit,
          animate,
          initial,
          transition,
          viewport,
          variants,
          ...props
        }: Record<string, unknown>) =>
          React.createElement(tag, props, children as React.ReactNode);
        component.displayName = `motion.${tag}`;
        return component;
      },
    }),
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  };
});

beforeEach(() => {
  vi.clearAllMocks();
});
