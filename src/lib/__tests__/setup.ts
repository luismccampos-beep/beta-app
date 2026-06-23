import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Map jest to vi for compatibility with Vitest
// @ts-ignore
globalThis.jest = vi;
const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockBack = jest.fn();
const mockForward = jest.fn();
const mockRefresh = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    back: mockBack,
    forward: mockForward,
    refresh: mockRefresh,
    prefetch: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
  useSegments: () => [],
}));

// Mock do next-auth
jest.mock('next-auth/react', () => ({
  useSession: () => ({ data: null, status: 'unauthenticated' }),
  getSession: () => Promise.resolve(null),
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

// Mock do next-intl
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'pt',
  getLocale: () => 'pt',
  getMessages: () => ({}),
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock do @tanstack/react-query
jest.mock('@tanstack/react-query', () => ({
  useQuery: () => ({ data: null, isLoading: false, error: null }),
  useMutation: () => ({ mutate: jest.fn(), isLoading: false }),
  useQueryClient: () => ({
    invalidateQueries: jest.fn(),
    setQueryData: jest.fn(),
    getQueryData: jest.fn(),
  }),
  QueryClient: jest.fn(),
  QueryClientProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock do fetch global
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
  } as Response)
);

// Mock do localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock do matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Limpar mocks entre testes
beforeEach(() => {
  jest.clearAllMocks();
});