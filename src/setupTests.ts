import '@testing-library/jest-dom/vitest'

// jsdom doesn't implement ResizeObserver; components that rely on it (e.g.
// useAlternateLayout) need at least a no-op stand-in to avoid crashing.
// Tests that need it to actually fire trigger callbacks manually.
class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
}

global.ResizeObserver = ResizeObserverMock
