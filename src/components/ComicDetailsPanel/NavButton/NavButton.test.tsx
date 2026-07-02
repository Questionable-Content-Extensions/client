import { describe, expect, it, vi } from 'vitest'

import { fireEvent, render, screen } from '@testing-library/react'

import NavButton from './NavButton'

describe('NavButton', () => {
    it('links to the given comic and reports clicks without a full navigation', () => {
        const onSetCurrentComic = vi.fn()
        render(
            <NavButton
                comicNo={42}
                title="Next strip"
                faClass="forward"
                onSetCurrentComic={onSetCurrentComic}
            />
        )

        const link = screen.getByTitle('Next strip')
        expect(link).toHaveAttribute('href', 'view.php?comic=42')
        expect(link).not.toHaveClass('invisible')

        fireEvent.click(link)
        expect(onSetCurrentComic).toHaveBeenCalledWith(42)
    })

    it('renders invisible and links nowhere when there is no comic to go to', () => {
        const onSetCurrentComic = vi.fn()
        render(
            <NavButton
                comicNo={null}
                title="Next strip"
                faClass="forward"
                onSetCurrentComic={onSetCurrentComic}
            />
        )

        const link = screen.getByTitle('Next strip')
        expect(link).toHaveClass('invisible')
        expect(link).toHaveAttribute('href', '#')
    })
})
