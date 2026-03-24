import '@testing-library/jest-dom';
import { afterEach, vi, beforeEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Mock window.matchMedia for ThemeContext
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock scrollIntoView for jsdom
window.HTMLElement.prototype.scrollIntoView = vi.fn();

// Global mocks for every test
beforeEach(() => {
  // IntersectionObserver
  window.IntersectionObserver = vi.fn().mockImplementation(function() {
    return {
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }
  });
});

// Mock framer-motion to avoid 'undefined' opacity errors in jsdom
vi.mock('framer-motion', async () => {
  const React = await import('react');
  const dummy = new Proxy({}, {
    get: (target, prop) => {
      return React.forwardRef(({ children, transition, initial, animate, exit, ...props }, ref) => 
        React.createElement(prop, { ...props, ref }, children)
      );
    }
  });
  return {
    AnimatePresence: ({ children }) => React.createElement(React.Fragment, null, children),
    LazyMotion: ({ children }) => React.createElement(React.Fragment, null, children),
    domAnimation: {},
    m: dummy,
    motion: dummy,
  };
});

// Cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
    cleanup();
});
