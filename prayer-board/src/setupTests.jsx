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

vi.mock('./context/SocketContext', () => ({
  SocketProvider: ({ children }) => children,
  useSocket: () => ({
    socket: null,
    joinRequest: vi.fn(),
    leaveRequest: vi.fn(),
    emitToRequest: vi.fn()
  })
}));

// Mock framer-motion to avoid 'undefined' opacity errors in jsdom
vi.mock('framer-motion', async () => {
  const React = await import('react');
  const dummy = new Proxy({}, {
    get: (target, prop) => {
      return React.forwardRef(({ 
        children, _transition, _initial, _animate, _exit, 
        _whileHover, _whileTap, _whileInView, _variants, _viewport, _layout, _layoutId,
        ...props 
      }, ref) => 
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
    useReducedMotion: () => false,
  };
});

// Cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
    cleanup();
});
