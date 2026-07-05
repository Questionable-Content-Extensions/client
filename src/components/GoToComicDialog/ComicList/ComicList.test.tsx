import { describe, expect, it, vi } from 'vitest'

import { ComicList as ComicListModel } from '@models/ComicList'
import { fireEvent, render, screen } from '@testing-library/react'

import ComicList from './ComicList'

vi.mock('@store/api/comicApiSlice', () => ({
    useGetConainingItemsQuery: () => ({ data: undefined }),
}))

vi.mock('@store/api/itemApiSlice', () => ({
    useAllItemsQuery: () => ({ data: [] }),
}))

const allComicData: ComicListModel[] = [
    {
        comic: 1,
        title: 'A tale of two panels',
        isNonCanon: false,
        isGuestComic: false,
    },
    {
        comic: 2,
        title: 'Something else entirely',
        isNonCanon: false,
        isGuestComic: false,
    },
]

// jsdom doesn't implement scrollIntoView; ComicFilter calls it when
// highlighting the active suggestion in its dropdown.
Element.prototype.scrollIntoView = vi.fn()

function addTextFilter(text: string) {
    fireEvent.focus(screen.getByRole('textbox'))
    fireEvent.change(screen.getByRole('textbox'), { target: { value: text } })
    fireEvent.click(screen.getByText(new RegExp(`Contains text "${text}"`)))
}

describe('ComicList', () => {
    it('reports its filtered results to the caller when a filter is added', () => {
        const onFilteredComicsChange = vi.fn()
        render(
            <ComicList
                allComicData={allComicData}
                subDivideGotoComics={false}
                onGoToComic={vi.fn()}
                isLoading={false}
                onFilteredComicsChange={onFilteredComicsChange}
            />
        )

        addTextFilter('tale')

        expect(onFilteredComicsChange).toHaveBeenLastCalledWith(
            [1],
            expect.arrayContaining([expect.objectContaining({ value: 'tale' })])
        )
    })

    it('reports an empty result once the last active filter is removed', () => {
        const onFilteredComicsChange = vi.fn()
        render(
            <ComicList
                allComicData={allComicData}
                subDivideGotoComics={false}
                onGoToComic={vi.fn()}
                isLoading={false}
                onFilteredComicsChange={onFilteredComicsChange}
            />
        )

        addTextFilter('tale')
        onFilteredComicsChange.mockClear()

        fireEvent.click(screen.getByTitle('Remove filter'))

        expect(onFilteredComicsChange).toHaveBeenLastCalledWith([], [])
    })

    it('does not touch any shared state when no callback is provided, e.g. when reused for an unrelated picker', () => {
        expect(() =>
            render(
                <ComicList
                    allComicData={allComicData}
                    subDivideGotoComics={false}
                    onGoToComic={vi.fn()}
                    isLoading={false}
                />
            )
        ).not.toThrow()

        expect(() => addTextFilter('tale')).not.toThrow()
    })
})
