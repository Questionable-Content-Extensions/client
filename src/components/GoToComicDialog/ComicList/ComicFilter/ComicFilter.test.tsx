import { describe, expect, it, vi } from 'vitest'

import { FilterType } from '@models/Filter'
import { fireEvent, render, screen } from '@testing-library/react'

import ComicFilter from './ComicFilter'

vi.mock('@store/api/itemApiSlice', () => ({
    useAllItemsQuery: () => ({ data: [] }),
}))

// jsdom doesn't implement scrollIntoView; ComicFilter calls it when
// highlighting the active suggestion in its dropdown.
Element.prototype.scrollIntoView = vi.fn()

describe('ComicFilter', () => {
    it('adds the highlighted suggestion when Enter is pressed', () => {
        const setFilters = vi.fn()
        render(<ComicFilter filters={[]} setFilters={setFilters} />)

        fireEvent.focus(screen.getByRole('textbox'))
        fireEvent.change(screen.getByRole('textbox'), {
            target: { value: 'tale' },
        })
        fireEvent.keyDown(screen.getByRole('textbox'), { code: 'Enter' })

        expect(setFilters).toHaveBeenCalled()
        const updater = setFilters.mock.calls[0][0] as (
            f: unknown[]
        ) => unknown[]
        expect(updater([])).toEqual([{ type: FilterType.Text, value: 'tale' }])
    })

    it('does not throw when Enter is pressed while the highlighted suggestion has no button', () => {
        const setFilters = vi.fn()
        render(<ComicFilter filters={[]} setFilters={setFilters} />)

        fireEvent.focus(screen.getByRole('textbox'))
        fireEvent.change(screen.getByRole('textbox'), {
            target: { value: 'tale' },
        })

        // Simulate the highlighted suggestion's <li> no longer containing a
        // <button> (e.g. removed by an unrelated re-render race) to guard
        // against the previous non-null assertion throwing here.
        const highlighted = document.querySelector('li.bg-blue-500')
        highlighted?.querySelector('button')?.remove()

        expect(() =>
            fireEvent.keyDown(screen.getByRole('textbox'), { code: 'Enter' })
        ).not.toThrow()
    })
})
