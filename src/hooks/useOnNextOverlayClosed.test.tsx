import { PropsWithChildren } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { OverlayContext } from '@modals/ModalPageOverlay/ModalPageOverlay'
import { renderHook } from '@testing-library/react'

import useOnNextOverlayClosed from './useOnNextOverlayClosed'

function makeWrapper(overlayActiveRef: { current: boolean }) {
    return function Wrapper({ children }: PropsWithChildren) {
        return (
            <OverlayContext.Provider
                value={[overlayActiveRef.current, () => {}]}
            >
                {children}
            </OverlayContext.Provider>
        )
    }
}

describe('useOnNextOverlayClosed', () => {
    it('invokes the action once when the overlay transitions from open to closed', () => {
        const action = vi.fn()
        const overlayActive = { current: true }

        const { result, rerender } = renderHook(
            () => useOnNextOverlayClosed(action),
            { wrapper: makeWrapper(overlayActive) }
        )
        result.current(true)

        overlayActive.current = false
        rerender()

        expect(action).toHaveBeenCalledTimes(1)

        // Further renders while closed shouldn't re-invoke it.
        rerender()
        expect(action).toHaveBeenCalledTimes(1)
    })

    it('does not invoke the action merely because a new inline action identity is passed each render', () => {
        const overlayActive = { current: true }
        const invocations: number[] = []

        const { result, rerender } = renderHook(
            () => useOnNextOverlayClosed(() => invocations.push(Date.now())),
            { wrapper: makeWrapper(overlayActive) }
        )
        result.current(true)

        // Overlay stays open across several re-renders with a fresh action each time.
        rerender()
        rerender()
        rerender()

        expect(invocations).toHaveLength(0)
    })

    it('invokes the latest action passed on the render where the overlay closes', () => {
        const firstAction = vi.fn()
        const secondAction = vi.fn()
        const overlayActive = { current: true }

        const { result, rerender } = renderHook(
            ({ action }: { action: () => void }) =>
                useOnNextOverlayClosed(action),
            {
                wrapper: makeWrapper(overlayActive),
                initialProps: { action: firstAction },
            }
        )
        result.current(true)

        overlayActive.current = false
        rerender({ action: secondAction })

        expect(firstAction).not.toHaveBeenCalled()
        expect(secondAction).toHaveBeenCalledTimes(1)
    })
})
