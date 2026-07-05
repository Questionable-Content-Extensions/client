import { act } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { render } from '@testing-library/react'

import { useAlternateLayout } from './useAlternateLayout'

class MockResizeObserver {
    static instances: MockResizeObserver[] = []
    callback: ResizeObserverCallback
    observe = vi.fn()
    unobserve = vi.fn()
    disconnect = vi.fn()

    constructor(callback: ResizeObserverCallback) {
        this.callback = callback
        MockResizeObserver.instances.push(this)
    }

    trigger() {
        this.callback([], this as unknown as ResizeObserver)
    }
}

function setWidth(el: Element, clientWidth: number, scrollWidth = clientWidth) {
    Object.defineProperty(el, 'clientWidth', {
        configurable: true,
        value: clientWidth,
    })
    Object.defineProperty(el, 'scrollWidth', {
        configurable: true,
        value: scrollWidth,
    })
}

/**
 * Mirrors how NavElement.tsx consumes this hook: a visible container
 * (measured via clientWidth, which shrinks/grows with real layout) and a
 * hidden, always-unwrapped mirror of the same content (measured via
 * scrollWidth, standing in for the content's natural, unwrapped width).
 */
function TestComponent({
    onLayout,
}: {
    onLayout: (alternateLayout: boolean) => void
}) {
    const [alternateLayout, ref, measureRef] = useAlternateLayout()
    onLayout(alternateLayout)
    return (
        <>
            <div ref={ref} data-testid="self" />
            <div ref={measureRef} data-testid="measure" />
        </>
    )
}

function triggerResize() {
    act(() => {
        MockResizeObserver.instances.forEach((instance) => instance.trigger())
    })
}

describe('useAlternateLayout', () => {
    beforeEach(() => {
        MockResizeObserver.instances = []
        vi.stubGlobal('ResizeObserver', MockResizeObserver)
    })

    afterEach(() => {
        vi.unstubAllGlobals()
    })

    it('switches to the alternate layout when the mirrored content overflows the container', () => {
        let alternateLayout = false
        const { getByTestId } = render(
            <TestComponent onLayout={(v) => (alternateLayout = v)} />
        )

        setWidth(getByTestId('self'), 50)
        setWidth(getByTestId('measure'), 50, 200)

        triggerResize()

        expect(alternateLayout).toBe(true)
    })

    it('does not revert on a small shrinkage right at the threshold (hysteresis)', () => {
        let alternateLayout = false
        const { getByTestId } = render(
            <TestComponent onLayout={(v) => (alternateLayout = v)} />
        )

        setWidth(getByTestId('self'), 50)
        setWidth(getByTestId('measure'), 50, 200)
        triggerResize()
        expect(alternateLayout).toBe(true)

        // The container grew, and now technically fits the content again,
        // but only barely — within the hysteresis buffer.
        setWidth(getByTestId('self'), 190)
        triggerResize()

        expect(alternateLayout).toBe(true)
    })

    it('reverts to the normal layout once there is comfortably enough room again', () => {
        let alternateLayout = false
        const { getByTestId } = render(
            <TestComponent onLayout={(v) => (alternateLayout = v)} />
        )

        setWidth(getByTestId('self'), 50)
        setWidth(getByTestId('measure'), 50, 200)
        triggerResize()
        expect(alternateLayout).toBe(true)

        setWidth(getByTestId('self'), 300)
        triggerResize()

        expect(alternateLayout).toBe(false)
    })
})
