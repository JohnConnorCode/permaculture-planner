// Jest setup file
import '@testing-library/jest-dom'

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
  takeRecords() {
    return []
  }
}

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Mock navigator
Object.defineProperty(window, 'navigator', {
  value: {
    clipboard: {
      writeText: jest.fn(),
      readText: jest.fn(),
    },
    serviceWorker: {
      ready: Promise.resolve({
        active: null,
        installing: null,
        waiting: null,
      }),
      register: jest.fn(),
      addEventListener: jest.fn(),
    },
  },
  writable: true,
})