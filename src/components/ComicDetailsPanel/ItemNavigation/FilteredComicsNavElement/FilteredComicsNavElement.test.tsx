import { describe, expect, it, vi } from 'vitest'

import { Filter, FilterType } from '@models/Filter'
import { fireEvent, render, screen } from '@testing-library/react'

import FilteredComicsNavElement from './FilteredComicsNavElement'

describe('FilteredComicsNavElement', () => {
    const filters: Filter[] = [{ type: FilterType.Text, value: 'sandwich' }]

    it('links first/previous/next/last buttons to the surrounding filtered comics', () => {
        render(
            <FilteredComicsNavElement
                filteredComics={[10, 20, 30, 40]}
                filters={filters}
                currentComic={20}
                onSetCurrentComic={vi.fn()}
                onReopenDialog={vi.fn()}
                onClear={vi.fn()}
            />
        )

        expect(
            screen.getByTitle('First strip matching filter')
        ).toHaveAttribute('href', 'view.php?comic=10')
        expect(
            screen.getByTitle('Previous strip matching filter')
        ).toHaveAttribute('href', 'view.php?comic=10')
        expect(screen.getByTitle('Next strip matching filter')).toHaveAttribute(
            'href',
            'view.php?comic=30'
        )
        expect(screen.getByTitle('Last strip matching filter')).toHaveAttribute(
            'href',
            'view.php?comic=40'
        )
    })

    it('reports clicks on nav buttons as unlocked navigation', () => {
        const onSetCurrentComic = vi.fn()
        render(
            <FilteredComicsNavElement
                filteredComics={[10, 20, 30]}
                filters={filters}
                currentComic={20}
                onSetCurrentComic={onSetCurrentComic}
                onReopenDialog={vi.fn()}
                onClear={vi.fn()}
            />
        )

        fireEvent.click(screen.getByTitle('First strip matching filter'))
        expect(onSetCurrentComic).toHaveBeenCalledWith(10, false)
    })

    it('shows the filter description and match count in the title, using singular wording for one match', () => {
        render(
            <FilteredComicsNavElement
                filteredComics={[20]}
                filters={filters}
                currentComic={20}
                onSetCurrentComic={vi.fn()}
                onReopenDialog={vi.fn()}
                onClear={vi.fn()}
            />
        )

        const button = screen.getByText('Filtered Results')
        expect(button).toHaveAttribute(
            'title',
            expect.stringContaining('1 comic matches the filter')
        )
    })

    it('uses plural wording in the title when multiple comics match', () => {
        render(
            <FilteredComicsNavElement
                filteredComics={[10, 20, 30]}
                filters={filters}
                currentComic={20}
                onSetCurrentComic={vi.fn()}
                onReopenDialog={vi.fn()}
                onClear={vi.fn()}
            />
        )

        const button = screen.getByText('Filtered Results')
        expect(button).toHaveAttribute(
            'title',
            expect.stringContaining('3 comics match the filter')
        )
    })

    it('reopens the filter dialog when the title button is clicked', () => {
        const onReopenDialog = vi.fn()
        render(
            <FilteredComicsNavElement
                filteredComics={[10, 20, 30]}
                filters={filters}
                currentComic={20}
                onSetCurrentComic={vi.fn()}
                onReopenDialog={onReopenDialog}
                onClear={vi.fn()}
            />
        )

        fireEvent.click(screen.getByText('Filtered Results'))
        expect(onReopenDialog).toHaveBeenCalled()
    })

    it('clears the filtered navigation when the clear button is clicked', () => {
        const onClear = vi.fn()
        render(
            <FilteredComicsNavElement
                filteredComics={[10, 20, 30]}
                filters={filters}
                currentComic={20}
                onSetCurrentComic={vi.fn()}
                onReopenDialog={vi.fn()}
                onClear={onClear}
            />
        )

        fireEvent.click(screen.getByTitle('Clear filtered results navigation'))
        expect(onClear).toHaveBeenCalled()
    })
})
