import { useState } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { render, screen } from '@testing-library/react'

import { BODY_CONTAINER_ID } from '~/shared'

import ModalPageOverlay, { OverlayContext } from './ModalPageOverlay'

vi.mock('~/utils', () => ({
    debug: vi.fn(),
    error: vi.fn(),
}))

function OverlayWithProbe({ show, label }: { show: boolean; label: string }) {
    const [active, setActive] = useState(false)
    return (
        <OverlayContext.Provider value={[active, setActive]}>
            <ModalPageOverlay show={show} />
            <div data-testid={label}>{String(active)}</div>
        </OverlayContext.Provider>
    )
}

beforeEach(() => {
    document.body.innerHTML = ''
    const bodyContainer = document.createElement('div')
    bodyContainer.id = BODY_CONTAINER_ID
    document.body.appendChild(bodyContainer)
    document.body.style.overflow = ''
})

describe('ModalPageOverlay', () => {
    it('flips its own context active flag when shown, even while another overlay already set body.style.overflow', () => {
        // Simulate a first, already-open modal having already hidden the
        // body's overflow.
        document.body.style.overflow = 'hidden'

        render(<OverlayWithProbe show={true} label="second" />)

        expect(screen.getByTestId('second')).toHaveTextContent('true')
    })

    it('flips its context active flag back to false once hidden', () => {
        const { rerender } = render(
            <OverlayWithProbe show={true} label="probe" />
        )
        expect(screen.getByTestId('probe')).toHaveTextContent('true')

        rerender(<OverlayWithProbe show={false} label="probe" />)
        expect(screen.getByTestId('probe')).toHaveTextContent('false')
    })
})
