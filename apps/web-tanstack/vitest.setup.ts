import '@testing-library/jest-dom/vitest'
import React from 'react'
import { vi } from 'vitest'

// window.matchMedia mock for useReducedMotion / framer-motion
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// IntersectionObserver mock for framer-motion / in-view components
class IntersectionObserverMock {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
  takeRecords = vi.fn(() => [])
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: IntersectionObserverMock,
})

// scrollTo / scrollBy mocks for framer-motion
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: vi.fn(),
})

Object.defineProperty(window, 'scrollBy', {
  writable: true,
  value: vi.fn(),
})

// global.fetch mock
global.fetch = vi.fn().mockResolvedValue({
  ok: true,
  json: async () => ({}),
  text: async () => '',
  headers: new Headers(),
  status: 200,
  statusText: 'OK',
})

// localStorage mock
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value }),
    removeItem: vi.fn((key: string) => { delete store[key] }),
    clear: vi.fn(() => { store = {} }),
    get length() { return Object.keys(store).length },
    key: vi.fn((index: number) => Object.keys(store)[index] ?? null),
  }
})()
Object.defineProperty(window, 'localStorage', { value: localStorageMock })

// framer-motion mock (strip animation props to plain DOM elements)
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
          React.createElement(String(tag), props, children as React.ReactNode);
        component.displayName = `motion.${tag}`;
        return component;
      },
    }),
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
    useAnimation: vi.fn(() => ({ start: vi.fn(), stop: vi.fn(), set: vi.fn() })),
    useMotionValue: vi.fn((val: number) => ({ get: () => val, set: vi.fn() })),
    useTransform: vi.fn((val: unknown) => val),
    useSpring: vi.fn((val: unknown) => val),
    useReducedMotion: vi.fn(() => false),
    useInView: vi.fn(() => true),
    useAnimationControls: vi.fn(() => ({ start: vi.fn(), stop: vi.fn(), set: vi.fn() })),
  };
})
